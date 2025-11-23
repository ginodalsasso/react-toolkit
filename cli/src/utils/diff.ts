import fsExtra from "fs-extra/esm";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CliConfig, FileDiff, ItemDiff, RegistryItem } from "../types";
import chalk from "chalk";

/**
 * Compares the contents of a local file with a file from the registry.
 * @param localPath - The path to the local file.
 * @param registryPath - The path to the registry file.
 * @returns A promise that resolves to true if the files are identical, false otherwise.
 */
async function compareFile(
    localPath: string,
    registryPath: string,
): Promise<boolean> {
    try {
        const localExists = await fsExtra.pathExists(localPath);
        const registryExists = await fsExtra.pathExists(registryPath);
        if (!localExists || !registryExists) {
            return false;
        }

        const localContent = readFileSync(localPath, "utf-8");
        const registryContent = readFileSync(registryPath, "utf-8");

        return localContent === registryContent;
    } catch (error) {
        return false;
    }
}

/**
 * Compares a file in the local directory with its counterpart in the registry directory.
 * @param fileName - The name of the file to compare.
 * @param localDir - The path to the local directory.
 * @param registryDir - The path to the registry directory.
 * @returns FileDiff object representing the comparison result 
 */
async function getFileDiffStatus(
    fileName: string,
    localDir: string,
    registryDir: string
): Promise<FileDiff> {
    const localPath = join(localDir, fileName);
    const registryPath = join(registryDir, fileName);

    const localExists = await fsExtra.pathExists(localPath);
    const registryExists = await fsExtra.pathExists(registryPath);

    if (!localExists && registryExists) {
        return {
            filePath: fileName,
            status: "missing-in-local",
            registryPath,
        };
    }

    if (localExists && !registryExists) {
        return {
            filePath: fileName,
            status: "missing-in-registry",
            localPath,
        };
    }

    if (!localExists && !registryExists) {
        return {
            filePath: fileName,
            status: "missing",
        };
    }

    const areIdentical = await compareFile(localPath, registryPath);

    return {
        filePath: fileName,
        status: areIdentical ? "identical" : "modified", // Updated line
        localPath,
        registryPath,
    };
}

/**
 * Compares a component or utility item in the local directory with its counterpart in the registry.
 * @param itemName - The name of the item to compare.
 * @param item - The RegistryItem object representing the item.
 * @param config - The CLI configuration object.
 * @param registryBasePath - The base path to the registry directory.
 * @returns ItemDiff object representing the comparison result
 */
export async function compareItem(
    itemName: string,
    item: RegistryItem,
    config: CliConfig,
    registryBasePath: string
): Promise<ItemDiff> {
    // if item type is component, use componentsPath, else use utilsPath
    const localBasePath = item.type === "component"
        ? config.componentsPath
        : config.utilsPath;

    const localDir = join(process.cwd(), localBasePath, itemName);
    const registryDir = join(
        registryBasePath,
        item.type === "component" ? "components" : "utils",
        itemName
    );

    // Check if item is installed
    const isInstalled = await fsExtra.pathExists(localDir);
    if (!isInstalled) {
        return {
            name: itemName,
            type: item.type,
            status: "not-installed",
            files: [],
        };
    }

    // Compare each file
    const fileDiffs: FileDiff[] = await Promise.all(
        item.files.map((fileName) =>
            getFileDiffStatus(fileName, localDir, registryDir)
        )
    );

    // Determine overall item status
    const hasModified = fileDiffs.some(file => file.status === "modified");
    const hasMissing = fileDiffs.some(file => 
        file.status === "missing-in-local" || file.status === "missing-in-registry" || file.status === "missing"
    );

    const itemStatus = hasModified || hasMissing ? "modified" : "up-to-date";

    return {
        name: itemName,
        type: item.type,
        status: itemStatus,
        files: fileDiffs,
    };
}

/** * Displays the diff result in the console.
 * @param diff - The ItemDiff object to display.
 * @param detailed - Whether to display detailed file diffs.
 */
export function displayDiff (diff: ItemDiff, detailed: boolean = false) {
    const statusColors = {
        "not-installed": chalk.red,
        "up-to-date": chalk.green,
        "modified": chalk.yellow,
    };
    const color = statusColors[diff.status];
    const typeLabel = diff.type === "component" ? "Component" : "Util";

    console.log(`${color(diff.status.toUpperCase())} - ${typeLabel}: ${diff.name}`);

    if (detailed && diff.files.length > 0) {
        diff.files.forEach(file => {
            const fileStatusColors = {
                "identical": chalk.green,
                "modified": chalk.yellow,
                "missing-in-local": chalk.red,
                "missing-in-registry": chalk.red,
                "missing": chalk.red,
            };
            console.log(`${fileStatusColors[file.status](file.status.toUpperCase())} - ${file.filePath}`);
        });
    }
}
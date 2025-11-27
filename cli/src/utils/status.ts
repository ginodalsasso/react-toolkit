import fsExtra from "fs-extra/esm";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CliConfig, FileStatus, ItemStatus, RegistryItem } from "../types/types";
import { FolderType, ItemType, StatusFileOptions, StatusItemsOptions } from "../types/enums";
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
 * @returns FileStatus object representing the comparison result 
 */
async function getFileStatus(
    fileName: string,
    localDir: string,
    registryDir: string
): Promise<FileStatus> {
    const localPath = join(localDir, fileName);
    const registryPath = join(registryDir, fileName);

    const localExists = await fsExtra.pathExists(localPath);
    const registryExists = await fsExtra.pathExists(registryPath);

    if (!localExists && registryExists) {
        return {
            filePath: fileName,
            status: StatusFileOptions.MISSING_IN_LOCAL,
            registryPath,
        };
    }

    if (localExists && !registryExists) {
        return {
            filePath: fileName,
            status: StatusFileOptions.MISSING_IN_REGISTRY,
            localPath,
        };
    }

    if (!localExists && !registryExists) {
        return {
            filePath: fileName,
            status: StatusFileOptions.MISSING,
        };
    }

    const areIdentical = await compareFile(localPath, registryPath);

    return {
        filePath: fileName,
        status: areIdentical ? StatusFileOptions.IDENTICAL : StatusFileOptions.MODIFIED,
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
 * @returns ItemStatus object representing the comparison result
 */
export async function compareItem(
    itemName: string,
    item: RegistryItem,
    config: CliConfig,
    registryBasePath: string
): Promise<ItemStatus> {
    // if item type is component, use componentsPath, else use utilsPath
    const localBasePath = item.type === ItemType.COMPONENT
        ? config.componentsPath
        : config.utilsPath;

    const localDir = join(process.cwd(), localBasePath, itemName);
    const registryDir = join(
        registryBasePath,
        item.type === ItemType.COMPONENT ? FolderType.COMPONENTS : FolderType.UTILS,
        itemName
    );

    // Check if item is installed
    const isInstalled = await fsExtra.pathExists(localDir);
    if (!isInstalled) {
        return {
            name: itemName,
            type: item.type,
            status: StatusItemsOptions.NOT_INSTALLED,
            files: [],
        };
    }

    // Compare each file
    const fileStatus: FileStatus[] = await Promise.all(
        item.files.map((fileName) =>
            getFileStatus(fileName, localDir, registryDir)
        )
    );

    // Determine overall item status
    const hasModified = fileStatus.some(file => file.status === StatusFileOptions.MODIFIED);
    const hasMissing = fileStatus.some(file => 
        file.status === StatusFileOptions.MISSING_IN_LOCAL || file.status === StatusFileOptions.MISSING_IN_REGISTRY || file.status === StatusFileOptions.MISSING
    );

    const itemStatus = hasModified || hasMissing ? StatusItemsOptions.MODIFIED : StatusItemsOptions.UP_TO_DATE;

    return {
        name: itemName,
        type: item.type,
        status: itemStatus,
        files: fileStatus,
    };
}

/** * Displays the status result in the console.
 * @param status - The ItemStatus object to display.
 * @param detailed - Whether to display detailed file status.
 */
export function displayStatus (status: ItemStatus, detailed: boolean = false) {
    const statusColors = {
        [StatusItemsOptions.NOT_INSTALLED]: chalk.red,
        [StatusItemsOptions.UP_TO_DATE]: chalk.green,
        [StatusItemsOptions.MODIFIED]: chalk.yellow,
    };
    const color = statusColors[status.status];
    const typeLabel = status.type === "component" ? "Component" : "Util";
    // Example output: "MODIFIED - Component: Button"
    console.log(`${color(status.status.toUpperCase())} - ${typeLabel}: ${status.name}`);

    // Detailed file Statuss
    if (detailed && status.files.length > 0) {
        status.files.forEach(file => {
            const fileStatusColors = {
                [StatusFileOptions.IDENTICAL]: chalk.green,
                [StatusFileOptions.MODIFIED]: chalk.yellow,
                [StatusFileOptions.MISSING_IN_LOCAL]: chalk.red,
                [StatusFileOptions.MISSING_IN_REGISTRY]: chalk.red,
                [StatusFileOptions.MISSING]: chalk.red,
            };
            // Example output: "MODIFIED - src/Button.tsx"
            console.log(`${fileStatusColors[file.status](file.status.toUpperCase())} - ${file.filePath}`);
        });
    }
}
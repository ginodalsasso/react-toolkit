import fsExtra from "fs-extra/esm";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FileDiff } from "../types";

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
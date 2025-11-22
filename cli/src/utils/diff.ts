import { readFileSync } from "fs-extra";
import fsExtra from "fs-extra/esm";

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
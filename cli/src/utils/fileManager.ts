import chalk from "chalk";
import fsExtra from "fs-extra/esm";
import { dirname } from "node:path";

/**
 * Copies a file from the source path to the destination path.
 * @param sourcePath The path to the source file.
 * @param destPath The path to the destination file.
 * @param options Options for the copy operation.
 * @returns A promise that resolves to true if the copy was successful, false otherwise.
 */
export async function copyFile(
    sourcePath: string, 
    destPath: string, 
    options?: { overwrite?: boolean }
): Promise<boolean> {
    try {
        const sourceExists = await fsExtra.pathExists(sourcePath);
        if (!sourceExists) {
            console.error(chalk.red(`Source file does not exist: ${sourcePath}`));
            return false;
        }

        const destExists = await fsExtra.pathExists(destPath);
        if (destExists && options?.overwrite === false) {
            console.error(chalk.red(`Destination file already exists and overwrite is set to false: ${destPath}`));
            return false;
        }

        // Ensure the destination directory exists
        await fsExtra.ensureDir(dirname(destPath));
        // Copy the file including overwrite option
        await fsExtra.copy(sourcePath, destPath, { overwrite: !!options?.overwrite }); // !! ensure boolean

        console.log(chalk.green(`File copied from ${sourcePath} to ${destPath}`));
        return true;
    } catch (error) {
        console.error(chalk.red(`Error copying file: ${error}`));
        return false;
    }
}

/**
 * creates a directory if it does not exist
 * @param dirPath 
 */
export async function ensureDir(dirPath: string): Promise<void> {
    await fsExtra.ensureDir(dirPath);
}

/**
 * Checks if a file exists.
 * @param filePath The path to the file.
 * @returns A promise that resolves to true if the file exists, false otherwise.
 */
export async function fileExists(filePath: string): Promise<boolean> {
    return fsExtra.pathExists(filePath);
}
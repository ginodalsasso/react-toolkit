import chalk from "chalk";
import fsExtra from "fs-extra/esm";
import { dirname } from "node:path";

/**
 * Copies a directory from the source path to the destination path.
 * @param sourceDir The path to the source directory.
 * @param destDir The path to the destination directory.
 * @param options Options for the copy operation.
 * @returns A promise that resolves to true if the copy was successful, false otherwise.
 */
export async function copyDirectory(
    sourceDir: string, 
    destDir: string,
    options?: { overwrite?: boolean }
): Promise<boolean> {
    try {
        const sourceExists = await fsExtra.pathExists(sourceDir);
        if (!sourceExists) {
            console.error(chalk.red(`Source directory does not exist: ${sourceDir}`));
            return false;
        }

        await fsExtra.ensureDir(dirname(destDir));
        await fsExtra.copy(sourceDir, destDir, { 
            overwrite: !!options?.overwrite,
            errorOnExist: !options?.overwrite,// prevent overwriting if overwrite is false
        }); // !! ensure boolean

        console.log(chalk.green(`Directory copied from ${sourceDir} to ${destDir}`));
        return true;
    } catch (error) {
        console.error(chalk.red(`Error copying directory: ${error}`));
        return false;
    }
}

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

        // Ensure the destination directory exists
        await fsExtra.ensureDir(dirname(destPath));
        // Copy the file including overwrite option
        await fsExtra.copy(sourcePath, destPath, { 
            overwrite: !!options?.overwrite,
            errorOnExist: !options?.overwrite,// prevent overwriting if overwrite is false
        }); // !! ensure boolean

        console.log(chalk.green(`File copied from ${sourcePath} to ${destPath}`));
        return true;
    } catch (error) {
        console.error(chalk.red(`Error copying file: ${error}`));
        return false;
    }
}
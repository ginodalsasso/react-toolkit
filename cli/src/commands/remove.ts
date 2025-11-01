import chalk from "chalk";
import { ensureConfig } from "../utils/config";
import { ensureItemName } from "../utils/prompt";
import { getItem, getRegistry } from "../utils/registry";
import { fileExists } from "../utils/fileManager";
import { join } from "path";
import fsExtra from "fs-extra/esm";
import { RegistryItem } from "../types";

export async function removeCommand(name? : string) {
    console.log(chalk.bold.blue('\n Remove component or utility\n'));

    const config = ensureConfig();
    const registry = getRegistry();

    const selectedName = await ensureItemName(name, registry, "remove");

    const item = getItem(registry, selectedName as string);
    if (!item) {
        console.error(chalk.red(`Item "${selectedName}" not found in the registry.`));
        process.exit(1);
    }

    const destPath = item.type === 'component' 
    ? config.componentsPath 
    : config.utilsPath;

    await removeRegistryFilesFromProject(destPath, item);
}

/**
 * Remove files associated with a registry item from the project.
 * @param destPath The destination path where the item files are located.
 * @param item The registry item to remove.
 */
async function removeRegistryFilesFromProject(
    destPath: string,
    item: RegistryItem
) {
    try {
        let success = false;

        for (const file of item.files) {
            const destFilePath = join(process.cwd(), destPath, file);

            if (await fileExists(destFilePath)) {
                await fsExtra.remove(destFilePath);
                success = true;
            } else {
                success = false;
            }

            if (success) {
                console.log(chalk.green(`Removed file: ${destFilePath}`));
            } else {
                console.log(chalk.yellow(`File not found, skipping: ${destFilePath}`));
            }
        }

        console.log(chalk.gray("Note: Dependencies were not removed from package.json"));
        console.log(chalk.gray("Run \"npm uninstall <package>\" manually if needed\n"));
    } catch (error) {
        console.error(chalk.red(error));
        process.exit(1);
    }
}
import chalk from "chalk";
import { ensureConfig } from "../utils/config";
import { confirmAction, ensureItemName } from "../utils/prompt";
import { getItem, getRegistry } from "../utils/registry";
import { join } from "path";
import fsExtra from "fs-extra/esm";
import { RegistryItem } from "../types";

export async function removeCommand(name? : string) {
    console.log(chalk.bold.blue('\n Remove component or utility\n'));

    const config = ensureConfig();
    const registry = getRegistry();

    const selectedName = await ensureItemName(name, registry, "remove");
    const item = getItem(registry, selectedName as string);

    const confirmed = await confirmAction(chalk.yellow(`Remove ${item.name} and all its files?`));
    if (!confirmed) {
        console.log(chalk.gray('Removal cancelled.'));
        return;
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

            if (await fsExtra.pathExists(destFilePath)) {
                await fsExtra.remove(destFilePath);
                success = true;
                console.log(chalk.green(`Removed file: ${destFilePath}`));
            } else {
                success = false;
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
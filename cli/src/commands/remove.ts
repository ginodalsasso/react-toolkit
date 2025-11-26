import chalk from "chalk";
import { ensureConfig } from "../utils/config";
import { confirmAction, ensureItemName } from "../utils/prompt";
import { getItem, getItemDestPath, getRegistry } from "../utils/registry";
import { resolve } from "path";
import fsExtra from "fs-extra/esm";
import { RegistryItem } from "../types/types";

export async function removeCommand(name? : string) {
    console.log(chalk.bold.blue('\n Remove component or utility\n'));

    const config = ensureConfig();
    const registry = getRegistry();

    const selectedName = await ensureItemName(name, registry, "remove");
    const item = getItem(registry, selectedName);

    const confirmed = await confirmAction(chalk.yellow(`Remove ${item.name} and all its files?`));
    if (!confirmed) {
        console.log(chalk.gray('Removal cancelled.'));
        return;
    }

    const destPath = getItemDestPath(item, config);

    await removeRegistryFilesFromProject(selectedName, item, destPath);
}

/**
 * Remove files associated with a registry item from the project.
 * @param selectedName The name of the selected component or utility.
 * @param item The registry item to remove.
 * @param destPath The destination path where the item files are located.
 */
async function removeRegistryFilesFromProject(
    selectedName: string,
    item: RegistryItem,
    destPath: string,
) {
    try {
        const projectRoot = resolve(process.cwd(), destPath);
        const destDirectory = resolve(projectRoot, selectedName);

        if (!destDirectory.startsWith(projectRoot)) {
            throw new Error("Destination path is outside the project directory.");
        }

        if (!await fsExtra.pathExists(destDirectory)) {
            console.log(chalk.yellow(`No files found for ${item.name} at ${destDirectory}. Nothing to remove.`));
            return;
        }
        
        await fsExtra.remove(destDirectory);

        console.log(chalk.green.bold(`\n ${item.name} was successfully removed! in \n${destDirectory}\n`));

        console.log(chalk.gray("Note: Dependencies were not removed from package.json"));
        console.log(chalk.gray("Run \"npm uninstall <package>\" manually if needed\n"));
    } catch (error) {
        console.error(chalk.red(error));
        process.exit(1);
    }
}
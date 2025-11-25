import { fileURLToPath } from "url";
import { ensureConfig } from "../utils/config";
import { compareItem, displayDiff } from "../utils/diff";
import { ensureItemName } from "../utils/prompt";
import { getAllItems, getItem, getRegistry } from "../utils/registry";
import { dirname, join } from "path";
import chalk from "chalk";

/**
 * Get the current file name and directory name
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __registryPath = join(__dirname, '../../registry');

/**
 * Diff command to compare installed components/utils with registry versions
 * @param name Optional name of the component or utility to check
 * @param options Command options
 */

export async function diffCommand(
    name? : string,
    options?: { detailled: boolean }
) {
    const config = ensureConfig();
    const registry = getRegistry();
    const detailled = options?.detailled || false;

    try {
        if (name) {
            const itemName = await ensureItemName(name, registry, "check");
            const item = getItem(registry, itemName);

            const diff = await compareItem(itemName, item, config, __registryPath);
            displayDiff(diff, detailled);
        } else {
            const allItems = getAllItems(registry);
            let totalChecked = 0;
            let upToDate = 0;
            let modified = 0;
            let notInstalled = 0;

            // Iterate over all items in the registry in order to compare them
            for (const [itemName, item] of Object.entries(allItems)) {
                const diff = await compareItem(
                    itemName,
                    item,
                    config,
                    __registryPath
                );
                displayDiff(diff, detailled);
                // Update summary counts
                totalChecked++;
                // Increment the appropriate count based on the diff status
                switch (diff.status) {
                    case "up-to-date":
                        upToDate++;
                        break;
                    case "modified":
                        modified++;
                        break;
                    case "not-installed":
                        notInstalled++;
                        break;
                }
                console.log(chalk.cyan(`\n Summary:`));
                console.log(chalk.gray(`Total checked: ${totalChecked}`));
                console.log(chalk.green(`Up to date: ${upToDate}`));
                console.log(chalk.yellow(`Modified: ${modified}`));
                console.log(chalk.red(`Not installed: ${notInstalled}`));
            }
        }
    } catch (error) {
        console.error(chalk.red(error));
        process.exit(1);
    }
}
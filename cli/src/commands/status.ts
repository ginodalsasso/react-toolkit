import { fileURLToPath } from "url";
import { ensureConfig } from "../utils/config";
import { compareItem, displayStatus } from "../utils/status";
import { ensureItemName } from "../utils/prompt";
import { getAllItems, getItem, getRegistry } from "../utils/registry";
import { dirname, join } from "path";
import chalk from "chalk";
import { CliConfig, Registry, StatusItemsOptions } from "../types/types";

/**
 * Get the current file name and directory name
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __registryPath = join(__dirname, '../../registry');

/**
 * Status command to compare installed components/utils with registry versions
 * @param name Optional name of the component or utility to check
 * @param options Command options
 */

export async function statusCommand(
    name? : string,
    options?: { detailled: boolean }
) {
    const config = ensureConfig();
    const registry = getRegistry();
    const detailled = options?.detailled || false;

    try {
        if (name) {
            await statusSingleItem(name, config, registry, detailled);
        } else {
            await statusAllItems(config, registry, detailled);
        }
    } catch (error) {
        console.error(chalk.red(error));
        process.exit(1);
    }
}

async function statusSingleItem(
    itemName: string,
    config: CliConfig,
    registry: Registry,
    detailled: boolean
) {
    ensureItemName(itemName, registry, "check");
    const item = getItem(registry, itemName);

    const status = await compareItem(itemName, item, config, __registryPath);
    displayStatus(status, detailled);
}


async function statusAllItems(
    config: CliConfig,
    registry: Registry,
    detailled: boolean
) {
    const allItems = getAllItems(registry);
    let totalChecked = 0;
    let upToDate = 0;
    let modified = 0;
    let notInstalled = 0;

    // Iterate over all items in the registry in order to compare them
    for (const [itemName, item] of Object.entries(allItems)) {
        const status = await compareItem(itemName, item, config, __registryPath);
        displayStatus(status, detailled);
        // Update summary counts
        totalChecked++;
        // Increment the appropriate count based on the status status
        switch (status.status) {
            case StatusItemsOptions.UP_TO_DATE:
                upToDate++;
                break;
            case StatusItemsOptions.MODIFIED:
                modified++;
                break;
            case StatusItemsOptions.NOT_INSTALLED:
                notInstalled++;
                break;
        }
    }
    // // Display summary
    console.log(chalk.yellow("\nSummary:"));
    console.log(chalk.yellow(`Total items checked: ${totalChecked}`));
    console.log(chalk.green(`Up-to-date: ${upToDate}`));
    console.log(chalk.red(`Modified: ${modified}`));
    console.log(chalk.red(`Not installed: ${notInstalled}`));
}
import chalk from "chalk";
import { readConfig } from "../utils/config";
import { getRegistry } from "../utils/registry";

export async function addCommand() {
    const config = readConfig();
    if (!config) {
        console.log(chalk.red('No config found, please run "my-cli init" first.'));
        return;
    }

    const registry = getRegistry();
    console.log(registry)
    if (registry.components || registry.utils) {
        console.log(chalk.green('Available components and utilities to add:'));
        const allItems = { ...registry.components, ...registry.utils };
        for (const itemName in allItems) {
            console.log(`- ${itemName}`);
        }
    } else {
        console.log(chalk.yellow('No components or utilities found in the registry.'));
    }
}
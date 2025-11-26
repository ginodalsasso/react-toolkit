import chalk from "chalk";
import { getRegistry } from "../utils/registry.js";
import { RegistryItem } from "../types/types.js";

/**
 * List command to display all components and utilities from the registry
 * @param options - Command options to filter by components or utilities
 * ex: npm run dev -- list --components / npm run dev -- list --utils
 */

export function listCommand(options?: { components?: boolean; utils?: boolean }) {
    const registry = getRegistry();
    const components = registry.components;
    const utils = registry.utils;
    
    if (Object.keys(components).length === 0 && Object.keys(utils).length === 0) {
        console.log(chalk.red("No components or utilities found."));
        return;
    }
    
    console.log(chalk.cyan(`Found the following components and utilities:\n`));

    showComponents(components, options);
    showUtils(utils, options);

    // total
    const totalItems = Object.keys(components).length + Object.keys(utils).length;
    console.log(chalk.yellow(`Total: ${totalItems} items`));
}

/**
 * Show registered components
 * @param components - The components to show
 * @param options - Command options to filter by components or utilities
 */
function showComponents(
    components: Record<string, RegistryItem>, 
    options?: { components?: boolean, utils?: boolean }
) {
    const showComponents = !options?.utils || options?.components;

    if (showComponents && Object.keys(components).length > 0) {
        console.log(chalk.bold.cyan(`Components (${Object.keys(components).length})`));
        Object.entries(components).forEach(([key, item], index) => {
            const isLast = index === Object.entries(components).length - 1;
            const prefix = isLast ? '└─' : '├─';

            console.log(`  ${prefix} ${chalk.green.bold.underline(item.name)} - ${item.description}`);
            console.log(`     ${chalk.gray(`Tags: ${item.tags.join(', ')}`)}`);
            console.log('');
        });
        return;
    }
}

/** Show registered utilities
 * @param utils - The utilities to show
 * @param options - Command options to filter by components or utilities
 */
function showUtils(
    utils: Record<string, RegistryItem>, 
    options?: { components?: boolean, utils?: boolean }
) {
    const showUtils = !options?.components || options?.utils;

    if (showUtils && Object.keys(utils).length > 0) {
        console.log(chalk.bold.cyan(`Utilities (${Object.keys(utils).length})`));
        Object.entries(utils).forEach(([key, item], index) => {
            const isLast = index === Object.entries(utils).length - 1;
            const prefix = isLast ? '└─' : '├─';

            console.log(`  ${prefix} ${chalk.green.bold.underline(item.name)} - ${item.description}`);
            console.log(`     ${chalk.gray(`Tags: ${item.tags.join(', ')}`)}`);
            console.log('');
        });
        return;
    }
}
import chalk from "chalk";
import { getAllItems, getRegistry } from "../utils/registry";

export function listCommand() {
    const registry = getRegistry();
    const components = registry.components;
    const utils = registry.utils;
    
    if (Object.keys(components).length === 0 && Object.keys(utils).length === 0) {
        console.log(chalk.red("No components or utilities found."));
        return;
    }
    
    const totalItems = Object.keys(components).length + Object.keys(utils).length;
    console.log(chalk.yellow(`Total: ${totalItems} items\n`));

    console.log(chalk.green(`Found the following components and utilities:`));
    // components
    Object.entries(components).forEach(([key, item], index) => {
        const isLast = index === Object.entries(components).length - 1;
        const prefix = isLast ? '└─' : '├─';
        console.log(`  ${prefix} ${chalk.green(item.name)} - ${item.description}`);
        console.log(`     ${chalk.gray(`Tags: ${item.tags.join(', ')}`)}`);
        console.log('');
    });

    // utils
    Object.entries(utils).forEach(([key, item], index) => {
        const isLast = index === Object.entries(utils).length - 1;
        const prefix = isLast ? '└─' : '├─';
        console.log(`  ${prefix} ${chalk.green(item.name)} - ${item.description}`);
        console.log(`     ${chalk.gray(`Tags: ${item.tags.join(', ')}`)}`);
        console.log('');
    });
}
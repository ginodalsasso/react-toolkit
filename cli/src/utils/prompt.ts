import chalk from "chalk";
import inquirer from "inquirer";
import { Registry } from "../types/types";
import { sanitizePath, validateName, validateNotEmpty } from "./validators";
import { getItem } from "./registry";

/**
 * Prompts the user to select an item from the registry
 * @param registry The registry containing components and utils
 * @param action The action being performed ex: "add", "remove"
 * @returns The selected item key
 */
export async function promptItemSelection(
    registry: Registry,
    action: string = "select"
): Promise<string> {
    const allItems = { ...registry.components, ...registry.utils };

    if (Object.keys(allItems).length === 0) {
        console.error(chalk.red('The registry is empty.'));
        console.log(chalk.yellow('No items available in the registry.\n'));
        process.exit(1);
    }

    console.log(chalk.cyan(`Available components and utilities:\n`));
    
    const choices = Object.entries(allItems).map(([key, item]) => ({
        name: `${item.name} (${item.type}) - ${item.description}`,
        value: key,
    }));
    
    const { itemName } = await inquirer.prompt([
        {
            type: 'list',
            name: 'itemName',
            message: `Select a component or utility to ${action}:`,
            choices,
        },
    ]);

    return itemName;
}

/**
 * Ensures an item name is provided, either from arguments or by prompting the user
 * @param name Optional name provided as argument
 * @param registry The registry to select from
 * @param action The action being performed
 * @returns The selected or provided item name
 */
export async function ensureItemName(
    name: string | undefined,
    registry: Registry,
    action: string = "select"
): Promise<string> {
    if (name) {
        validateNotEmpty(name);
        validateName(name);

        const safeName = sanitizePath(name);

        // Check if item exists in registry
        const item = getItem(registry, safeName);
        if (!item) {
            console.error(chalk.red(`Item "${safeName}" not found in registry.`));
            process.exit(1);
        }

        return safeName;
    }

    return await promptItemSelection(registry, action);
}

/**
 * Prompts the user for confirmation before proceeding with an action
 * @param message The confirmation message to display
 * @param defaultValue The default value for the confirmation (true/false)
 * @returns True if the action is confirmed, false otherwise
 */
export async function confirmAction(
    message: string,
    defaultValue: boolean = false
): Promise<boolean> {
    const { confirmed } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmed',
            message,
            default: defaultValue,
        },
    ]);

    return confirmed;
}
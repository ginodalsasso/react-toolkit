import chalk from "chalk";
import { configExists, readConfig } from "../utils/config";
import { getItem, getRegistry } from "../utils/registry";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import inquirer from "inquirer";
import { copyFile, ensureDir } from "../utils/fileManager";
import { addDependencyToPackageJson } from "../utils/dependencies";
import { Registry, RegistryItem } from "../types";

/**
 * Get the current file name and directory name
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Add command to add a component or utility from the registry to the project
 * @param name Optional name of the component or utility to add
 */
export async function addCommand(name? : string) {
    console.log(chalk.bold.blue('\n Add component or utility\n'));

    if (!configExists()) {
        console.error(chalk.red('No configuration found.'));
        console.log(chalk.yellow('Please run: my-cli init\n'));
        process.exit(1);
    }

    const config = readConfig();
    if (!config) {
        console.log(chalk.red('No config found, please run "my-cli init" first.'));
        process.exit(1);
    }

    const registry = getRegistry();
    const selectedName = await handleSelectedName(name, registry);

    const item = getItem(registry, selectedName as string);
    if (!item) {
        console.error(chalk.red(`Item "${selectedName}" not found in the registry.`));
        process.exit(1);
    }

    const destPath = item.type === 'component' 
    ? config.componentsPath 
    : config.utilsPath;

    await ensureDir(join(process.cwd(), destPath));
    await copyRegistryFilesToProject(selectedName, item, destPath);

    console.log(chalk.green(`\nSelected item: ${item.name} (${item.type})`));
    console.log(chalk.green(`Description: ${item.description}`));

    // Add dependencies if any
    if (item.dependencies.length > 0 || item.devDependencies.length > 0) {
        console.log(chalk.green('\nAdding dependencies to package.json...'));
        await addDependencyToPackageJson(item.dependencies, item.devDependencies);
    } else {
        console.log(chalk.yellow('\nNo dependencies to add.'));
    }

    // Final success message
    console.log(chalk.green.bold(`\n ${item.name} was successfully added!\n`));
    console.log(chalk.gray(`Files installed in: ${destPath}\n`));
}

/*
 * Handle the selection of a component or utility by name
 */
async function handleSelectedName(
    name: string | undefined, 
    registry: Registry
): Promise<string> {
    let selectedName = name;
    if (!selectedName) {
        // If no name provided, list available components and utils
        console.log(chalk.green('Available components and utilities to add:'));
        const allItems = { ...registry.components, ...registry.utils };

        const userEntries = Object.entries(allItems);
        if (userEntries.length === 0) {
            console.error(chalk.red('The registry is empty.'));
            console.log(chalk.yellow('Add items to the registry: my-cli add <name>\n'));
            process.exit(1);
        }
        
        const choices = Object.entries(allItems).map(([key, item]) => ({
            name: `${item.name} (${item.type}) - ${item.description}`,
            value: key,
        }));
        
        const { itemName } = await inquirer.prompt([
            {
                type: 'list',
                name: 'itemName',
                message: 'Select a component or utility to add:',
                choices,
            },
        ]);

        selectedName = itemName;
    }
    if (!selectedName) {
        console.error(chalk.red('No item selected.'));
        process.exit(1);
    }
    return selectedName;
}

/**
 * copy files from the registry to the user's project
 */
async function copyRegistryFilesToProject(
    selectedName: string, 
    item: RegistryItem,
    destPath: string,
) {
    for (const file of item.files) {
        const srcFilePath = join(
            __dirname,
            '../../registry',
            item.type + 's', // 'component' → 'components', 'util' → 'utils'
            selectedName as string, // 'button'
            file // 'Button.tsx'
        );        
        console.log('Source file path:', srcFilePath);
        const destFilePath = join(process.cwd(), destPath, file); // ex: 'src/components/button/Button.tsx'

        const success = await copyFile(srcFilePath, destFilePath, { overwrite: false });
        if (!success) {
            console.log(chalk.yellow(`File already exists, skipped: ${destFilePath}`));
        } else {
            console.log(chalk.green(`Created file: ${destFilePath}`));
        }
    }
}
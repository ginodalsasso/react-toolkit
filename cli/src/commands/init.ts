import chalk from "chalk";
import { configExists, writeConfig } from "../utils/config";
import inquirer from "inquirer";
import { CliConfig } from "../types/types";

/**
 * Action handler for the 'init' command.
 * This function initializes the CLI configuration by prompting the user for preferences
 * and writing them to a configuration file in the current working directory.
 */

export async function initCommand() {
    console.log(chalk.green("Initializing my-cli configuration...\n"));

    if (configExists()) {
        const { overwrite } = await inquirer.prompt([
            {
                type: "confirm",
                name: "overwrite",
                message: "A configuration file already exists. Do you want to overwrite it?",
                default: false,
            },
        ]);

        if (!overwrite) {
            console.log(chalk.yellow("Initialization cancelled. Existing configuration preserved."));
            return;
        }
    }

    // Prompt user for configuration options
    const answers = await inquirer.prompt<CliConfig>([
        {
            type: "input",
            name: "componentsPath",
            message: 'Where should components be installed?',
            default: 'src/components',
        },
        {
            type: "input",
            name: "utilsPath",
            message: 'Where should utilities be installed?',
            default: 'src/utils',
        },
        {
            type: "confirm",
            name: "typescript",
            message: 'Do you want to use TypeScript?',
            default: true
        },
        {
            type: "list",
            name: "styling",
            message: 'Which styling solution do you want to use?',
            choices: [
                { name: 'CSS Modules', value: 'css-modules' },
                { name: 'CSS', value: 'css' },
                { name: 'Tailwind CSS', value: 'tailwind-css' }
            ],
            default: 'css-modules'
        }
    ]);
    writeConfig(answers);
    
    console.log(chalk.green("Configuration file created successfully at ./my-cli.config.json"));
    console.log(chalk.gray("\nYou can now use:"));
    console.log(chalk.gray("my-cli add --component <ComponentName>"));
}
import chalk from "chalk";
import { ensureConfig } from "../utils/config";
import { getItem, getRegistry } from "../utils/registry";
import { ensureItemName } from "../utils/prompt";
import { compareItem } from "../utils/status";
import { StatusFileOptions, StatusItemsOptions } from "../types/enums";
import { __registryPath } from "../constants";

/**
 * Diff command to show line-by-line differences between local and registry files
 * @param name Optional name of the component or utility to diff
 */
export async function diffCommand(name? : string) {
    const config = ensureConfig();
    const registry = getRegistry();

    try {
        const selectedName = await ensureItemName(name, registry, "compare");
        const item = getItem(registry, selectedName);

        const status = await compareItem(selectedName, item, config, __registryPath);

        console.log(chalk.cyan(`Item: ${chalk.bold(item.name)} (${item.type})\n`));

        if (status.status === StatusItemsOptions.NOT_INSTALLED) {
            console.log(chalk.yellow(`The item ${item.name} is not installed in the project.`));
            return;
        }

        if (status.status === StatusItemsOptions.UP_TO_DATE) {
            console.log(chalk.green(`The item ${item.name} is up to date.`));
            return;
        }

        let hasDifferences = false;

        for (const fileStatus of status.files) {
            if (fileStatus.status === StatusFileOptions.IDENTICAL) {
                console.log(chalk.gray(`${fileStatus.filePath}: Identical`));
                continue;
            }

            if (fileStatus.status === StatusFileOptions.MISSING_IN_LOCAL) {
                console.log(chalk.yellow(`${fileStatus.filePath}: Missing in local project`));
                hasDifferences = true;
                continue;
            }

            if (fileStatus.status === StatusFileOptions.MISSING_IN_REGISTRY) {
                console.log(chalk.yellow(`${fileStatus.filePath}: Missing in registry`));
                hasDifferences = true;
                continue;
            }

            if (fileStatus.status === StatusFileOptions.MODIFIED) {
                console.log(chalk.red(`\-- ${fileStatus.filePath} (modified) --\n`));
                // Show line-by-line differences between the registry and local file
                if (fileStatus.localPath && fileStatus.registryPath) {
                    await showLineDiff(
                        fileStatus.registryPath,
                        fileStatus.localPath
                    );
                }
                hasDifferences = true;
                continue;
            }
        }

        if (hasDifferences) {
            console.log(chalk.cyan.bold(`\nDifferences found for item ${item.name}.\n`));
        }

    } catch (error) {
        console.error(chalk.red(error));
        process.exit(1);    
    }
}
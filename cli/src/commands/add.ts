import chalk from "chalk";
import { ensureConfig } from "../utils/config";
import { getItem, getRegistry } from "../utils/registry";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { copyDirectory } from "../utils/fileManager";
import { addDependencyToPackageJson } from "../utils/dependencies";
import { RegistryItem } from "../types";
import { confirmAction, ensureItemName } from "../utils/prompt";
import fsExtra from "fs-extra/esm";
import { sanitizePath } from "../utils/validators";

/**
 * Get the current file name and directory name
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __registryPath = join(__dirname, '../../registry');

/**
 * Add command to add a component or utility from the registry to the project
 * @param name Optional name of the component or utility to add
 */
export async function addCommand(name? : string) {
    console.log(chalk.bold.blue('\n Add component or utility\n'));

    const config = ensureConfig();
    const registry = getRegistry();

    const selectedName = await ensureItemName(name, registry, "add");

    const item = getItem(registry, selectedName as string);

    const destPath = item.type === 'component' 
    ? config.componentsPath 
    : config.utilsPath;

    await copyRegistryFilesToProject(selectedName, item, destPath);

    console.log(chalk.green(`\nSelected item: ${item.name} (${item.type})`));
    console.log(chalk.green(`Description: ${item.description}`));

    // Add dependencies if any
    if (item.dependencies.length > 0 || item.devDependencies.length > 0) {
        console.log(chalk.green('\nAdding dependencies to package.json...'));
        await addDependencyToPackageJson(item.dependencies, item.devDependencies);
    }

    // Final success message
    console.log(chalk.green.bold(`\n ${item.name} was successfully added!\n`));
    console.log(chalk.gray(`Files installed in: ${destPath}\n`));
}

/**
 * copy files from the registry to the user's project
 * @param selectedName The name of the selected component or utility
 * @param item The registry item details
 * @param destPath The destination path in the user's project
 */
async function copyRegistryFilesToProject(
    selectedName: string, 
    item: RegistryItem,
    destPath: string,
) {
    try {        
        // source: registry/components/button
        const srcDirectory = join(
            __registryPath,
            item.type + 's', 
            selectedName
        );      
        // destination: project/src/components/button
        const destDirectory = resolve(
            process.cwd(), 
            destPath, 
            selectedName
        );

        const projectRoot = resolve(process.cwd(), destPath);
        if (!destDirectory.startsWith(projectRoot)) {
            throw new Error("Destination path is outside the project directory.");
        }

        if (await fsExtra.pathExists(destDirectory)) {
            console.log(chalk.yellow(`\nThe item "${selectedName}" already exists at ${destDirectory}. Skipping copy.`));
            return;
        }

        const confirmed = await confirmAction(chalk.yellow(`Add file ${destDirectory } to project?`));
        if (!confirmed) {
            console.log(chalk.gray(`Skipped file: ${destDirectory }`));
            return;
        }

        const success = await copyDirectory(srcDirectory, destDirectory, { overwrite: false });
        if (success) {
            console.log(chalk.green(`Created file: ${destDirectory}`));
            console.log(chalk.gray(`Files copied: ${item.files.join(', ')}`));
        } else {
            console.log(chalk.gray(`Skipped (already exists): ${destDirectory}`));
        }
    } catch (error) {
        console.error(chalk.red(error));
        process.exit(1);
    }
}
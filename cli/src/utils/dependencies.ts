import chalk from "chalk";
import fsExtra from "fs-extra";
import { PackageJson } from "../types/types";
import { join } from "path";

/**
 * Reads the package.json file from the current working directory.
 * @returns The parsed PackageJson object or null if not found.
 */
export async function readPackageJson(): Promise<PackageJson | null> {
    try {
        const pkgPath = join(process.cwd(), 'package.json');
        if (!await fsExtra.pathExists(pkgPath)) {
            console.error(chalk.red('package.json not found in the current directory.'));
            return null;
        }

        const content = await fsExtra.readFile(pkgPath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error(chalk.red(`Error reading package.json: ${error}`));
        return null;
    }
}

/** Writes the given PackageJson object to the package.json file in the current working directory.
 * @param pkg The PackageJson object to write.
 * @returns True if the operation was successful.
 */
export async function writePackageJson(pkg: PackageJson): Promise<boolean> {
    try {
        const pkgPath = join(process.cwd(), 'package.json');
        const content = JSON.stringify(pkg, null, 4) + '\n';

        await fsExtra.writeFile(pkgPath, content, 'utf-8');
        return true;
    } catch (error) {
        console.error(chalk.red(`Error writing package.json: ${error}`));
        return false;
    }
}

/** Adds dependencies and devDependencies to the package.json file.
 * @param dependencies An array of dependency names to add.
 * @param devDependencies An array of devDependency names to add.
 * @returns True if the operation was successful.
 */
export async function addDependencyToPackageJson(
    dependencies: string[],
    devDependencies: string[]
): Promise<boolean> {
    const pkg = await readPackageJson();
    if (!pkg) return false;

    // Ensure dependencies and devDependencies objects exist
    pkg.dependencies = pkg.dependencies || {};
    pkg.devDependencies = pkg.devDependencies || {};

    let added = false;

    // Add regular dependencies
    for (const dependencie of dependencies) {
        if (!pkg.dependencies[dependencie]) {
            pkg.dependencies[dependencie] = "latest";
            console.log(chalk.green(`Added dependency: ${dependencie}`));
            added = true;
        } else {
            console.log(chalk.yellow(`Dependency already exists: ${dependencie}`));
        }
    }

    // Add dev dependencies
    for (const devDependencie of devDependencies) {
        if (!pkg.devDependencies[devDependencie]) {
            pkg.devDependencies[devDependencie] = "latest";
            console.log(chalk.green(`Added devDependency: ${devDependencie}`));
            added = true;
        } else {
            console.log(chalk.yellow(`DevDependency already exists: ${devDependencie}`));
        }
    }

    if(added) {
        await writePackageJson(pkg);
        console.log(chalk.yellow('\n Don\'t forget to run "npm install"'));
    }

    return true;
}
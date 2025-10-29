import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { CliConfig } from '../types';

/**
 * This file contains utility functions to read and write the CLI configuration file (.my-cli.json)
 * in the current working directory in order to manage user preferences.
 * ex: componentsPath, utilsPath, typescript, styling
 */

/* Configuration file path */
const __filename = ".my-cli.json";
const configPath = join(process.cwd(), __filename);

/**
 * returns true if the config file exists 
 * in the current working directory
 */
export function configExists(): boolean {
    return existsSync(configPath);
}

/**
 * read the config file to the current working directory
 */
export function readConfig(): CliConfig | null {
    try {
        const content = readFileSync(configPath, 'utf-8');  
        const config: CliConfig = JSON.parse(content);

        return config;
    } catch (error) {
        console.error('Error reading config:', error);
        return null;
    }
}

/**
 * write the config file to the current working directory
 */
export function writeConfig(config: CliConfig): void {
    try {
        const content = JSON.stringify(config, null, 4);
        writeFileSync(configPath, content, 'utf-8');
    } catch (error) {
        console.error('Error writing config:', error);
        process.exit(1);
    }
}
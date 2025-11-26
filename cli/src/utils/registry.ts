import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { CliConfig, Registry, RegistryItem } from '../types/types';

/**
 * This file contains utility functions to read and interact with the registry.json file in the registry folder,
 * including functions to get all items, get a specific item.
 */

// get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url); // convert URL to path
const __dirname = dirname(__filename); // get directory name
const __registryPath = join(__dirname, '../../registry');

/**
 * read and parse registry.json
 */
export function getRegistry(): Registry {
    try {
        const registryPath = join(__registryPath, 'registry.json');
        
        const content = readFileSync(registryPath, 'utf-8');
        const registry: Registry = JSON.parse(content);
        
        return registry;
    } catch (error) {
        console.error('Error reading registry:', error);
        process.exit(1);
    }
}

/**
 * Return all items in the registry
 */
export function getAllItems(registry: Registry) {
    return {
        ...registry.components,
        ...registry.utils,
    };
}

/**
 * Return a specific item by name from the registry
 */
export function getItem(registry: Registry, name: string) {
    return registry.components[name] 
        || registry.utils[name] 
        || null;
};

/**
 * 
 * Get the destination path for a registry item based on its type
 * @param item The registry item 
 * @param config The CLI configuration
 * @returns The destination path for the item
 */
export function getItemDestPath(item: RegistryItem, config: CliConfig): string {
    return item.type === 'component' 
        ? config.componentsPath 
        : config.utilsPath;
}
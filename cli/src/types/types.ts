import { ItemType, StatusFileOptions, StatusItemsOptions, StylingOptions } from "./enums";

export interface RegistryItem {
    name: string;
    type: ItemType;
    description: string;
    files: string[];
    dependencies: string[];
    devDependencies: string[];
    registryDependencies: string[];
    tags: string[];
    examples?: Array<{
        name: string;
        code: string;
    }>;
}

// Registry structure
export interface Registry {
    components: Record<string, RegistryItem>;
    utils: Record<string, RegistryItem>;
}

// CLI Configuration
export interface CliConfig {
    componentsPath: string;
    utilsPath: string;
    typescript: boolean;
    styling: StylingOptions;
}

// Package.json structure
export interface PackageJson {
    name?: string;
    version?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    [key: string]: any;
}

// Represents the diff result for a single file
export interface FileStatus {
    filePath: string;
    status: StatusFileOptions;
    localPath?: string;
    registryPath?: string;
}

// Represents the diff result for a component or utility
export interface ItemStatus {
    name: string;
    type: ItemType;
    status: StatusItemsOptions;
    files: FileStatus[];
}

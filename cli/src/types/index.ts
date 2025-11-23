export interface RegistryItem {
    name: string;
    type: 'component' | 'util';
    description: string;
    files: string[];
    dependencies: string[];
    devDependencies: string[];
    registryDependencies: string[];
    tags: string[];
    examples?: 
        Array<{
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
    styling: 'css-modules' | 'tailwind' | 'css';
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
export interface FileDiff {
    filePath: string;
    status: "identical" | "modified" | "missing-in-local" | "missing-in-registry" | "missing";
    localPath?: string;
    registryPath?: string;
}

// Represents the diff result for a component or utility
export interface ItemDiff {
    name: string;
    type: "component" | "util";
    status: "not-installed" | "up-to-date" | "modified";
    files: FileDiff[];
}
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
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
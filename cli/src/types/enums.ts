export enum FolderType {
    COMPONENTS = "components",
    UTILS = "utils",
}

export enum ItemType {
    COMPONENT = "component",
    UTIL = "util",
}

export enum StylingOptions {
    CSS_MODULES = "css-modules",
    TAILWIND = "tailwind",
    CSS = "css",
}

export enum StatusFileOptions {
    IDENTICAL = "identical",
    MODIFIED = "modified",
    MISSING_IN_LOCAL = "missing-in-local",
    MISSING_IN_REGISTRY = "missing-in-registry",
    MISSING = "missing",
}

export enum StatusItemsOptions {
    NOT_INSTALLED = "not-installed",
    UP_TO_DATE = "up-to-date",
    MODIFIED = "modified",
}
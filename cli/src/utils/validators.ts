import { basename } from "path";
import { Registry } from "../types";

/**
 * Check if the registry has a specific key ex: component or utility name
 */
export function registryHasKey(registry: Registry, key: string): boolean {
    return Boolean(
        (registry.components && registry.components[key]) ||
        (registry.utils && registry.utils[key])
    );
}

export function validateNotEmpty(input: string): boolean | string {
    if (!input || input.trim() === "") {
        return "This field cannot be empty";
    }
    return true;
}

export function validateName(input: string): boolean | string {
    const nameRegex = /^[a-zA-Z0-9-_]+$/;
    if (!nameRegex.test(input)) {
        return 'Name can only contain letters, numbers, hyphens, and underscores.';
    }
    return true;
}

/**
 * Sanitizes a given path by removing any directory traversal components.
 * @param unsafePath The path to sanitize
 * @returns The sanitized path
 */
export function sanitizePath(unsafePath: string): string {
    // Remove any path separators and parent directory references
    const safe = basename(unsafePath.replace(/\.\./g, ''));
    if (!safe || safe === "." || safe === "..") {
        throw new Error("Invalid after sanitization");
    }
    return safe;
}


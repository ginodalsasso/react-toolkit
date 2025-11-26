import { basename } from "path";
import { Registry } from "../types/types";

/**
 * Check if the registry has a specific key ex: component or utility name
 */
export function registryHasKey(registry: Registry, key: string): boolean {
    return Boolean(
        (registry.components && registry.components[key]) ||
        (registry.utils && registry.utils[key])
    );
}

export function validateNotEmpty(input: string): void {
    if (!input?.trim()) {
        throw new Error("This field cannot be empty");
    }
}

export function validateName(input: string): void {
    const nameRegex = /^[a-zA-Z0-9-_]+$/;
    if (!nameRegex.test(input)) {
        throw new Error('Name can only contain letters, numbers, hyphens, and underscores.');
    }
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


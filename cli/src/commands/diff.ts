import { ensureConfig } from "../utils/config";
import { getRegistry } from "../utils/registry";

/**
 * Diff command to compare installed components/utils with registry versions
 * @param name Optional name of the component or utility to check
 * @param options Command options
 */

export async function diffCommand(
    name? : string,
    options?: { detailled: boolean }
) {
    console.log("Diff command executed");

    const config = ensureConfig();
    const registry = getRegistry();

}
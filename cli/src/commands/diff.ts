import { ensureConfig } from "../utils/config";
import { getRegistry } from "../utils/registry";

export async function diffCommand(
    name? : string,
    options?: { detailled: boolean }
) {
    console.log("Diff command executed");

    const config = ensureConfig();
    const registry = getRegistry();

}
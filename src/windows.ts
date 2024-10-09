import { findInRegistry } from "./utils/findInRegistry";
import { access, constants } from "node:fs/promises";

/**
 * Locates the Steam directory on a Windows system
 * @throws Error if the Steam directory is not found
 * @returns The path to the Steam directory
 */
export async function locateSteamDirWindows(): Promise<string> {
    // first, try to check C:\Program Files (x86)\Steam
    const commonPath = "C:\\Program Files (x86)\\Steam";

    const isCommonPath = await access(commonPath, constants.F_OK)
        .then(() => true)
        .catch(() => false);

    if (isCommonPath) {
        return commonPath;
    }

    // if not found, try to look for it in windows registry

    const foundInRegistry = await locateSteamDirWindowsUsingRegistry();

    if (!foundInRegistry) {
        throw new Error("Steam directory not found");
    }

    return foundInRegistry;
}

/**
 * Locates the Steam directory on a Windows system using the registry
 * @throws Error if the Steam directory is not found in the registry
 * @returns The path to the Steam directory
 */
export async function locateSteamDirWindowsUsingRegistry(): Promise<
    string | null
> {
    if (process.arch === "x64") {
        return await findInRegistry(
            "HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam",
        );
    }

    if (process.arch === "ia32") {
        return await findInRegistry("HKLM\\SOFTWARE\\Valve\\Steam");
    }

    return null;
}

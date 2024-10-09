import { findInRegistry } from "./utils/findInRegistry";
import fs from "fs/promises";

/**
 * Locates the Steam directory on a Windows system
 * @throws Error if the Steam directory is not found
 * @returns The path to the Steam directory
 */
export async function locateSteamDirWindows(): Promise<string> {
    // first, try to check C:\Program Files (x86)\Steam
    const commonPath = "C:\\Program Files (x86)\\Steam";

    const isCommonPath = await fs
        .access(commonPath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

    if (isCommonPath) {
        return commonPath;
    }

    // if not found, try to look for it in windows registry
    return locateSteamDirWindowsUsingRegistry();
}

/* using registry */
async function locateSteamDirWindowsUsingRegistry(): Promise<string> {
    const REG_STEAM_PATH_32 = "HKLM\\SOFTWARE\\Valve\\Steam";
    const REG_STEAM_PATH_64 = "HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam";

    // Try to get the Steam install path from the registry

    const win32 = await findInRegistry(REG_STEAM_PATH_32);
    const win64 = await findInRegistry(REG_STEAM_PATH_64);
    const steamDir = win32 ?? win64;

    if (!steamDir) {
        throw new Error("Steam directory not found in registry");
    }

    return steamDir;
}
import { getInstallPath } from "./utils/getInstallPath";

/**
 * Locates the Steam directory on a Windows system
 * @throws Error if the Steam directory is not found
 * @returns The path to the Steam directory
 */
export async function locateSteamDirWindows(): Promise<string> {
    const REG_STEAM_PATH_32 = "HKLM\\SOFTWARE\\Valve\\Steam";
    const REG_STEAM_PATH_64 = "HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam";

    // Try to get the Steam install path from the registry

    const win32 = await getInstallPath(REG_STEAM_PATH_32);
    const win64 = await getInstallPath(REG_STEAM_PATH_64);
    const steamDir = win32 ?? win64;

    console.log(steamDir, win32, win64);

    if (!steamDir) {
        throw new Error("Steam directory not found in registry");
    }

    return steamDir;
}

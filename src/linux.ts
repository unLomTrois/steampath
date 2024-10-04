import fs from "fs/promises";
import { homedir } from "os";

/**
 * Locates the Steam directory on a Linux system
 * @throws Error if the Steam directory is not found
 * @returns The path to the Steam directory
 */
export async function locateSteamDirLinux(): Promise<string> {
    const home = homedir();

    const possiblePaths = [
        // Standard install directories
        `${home}/.local/share/Steam`,
        `${home}/.steam/steam`,
        `${home}/.steam/root`,
        `${home}/.steam`,
        // Snap Steam install directories
        `${home}/.snap/steam/common/.local/share/Steam`,
        `${home}/.snap/steam/common/.steam/steam`,
        `${home}/.snap/steam/common/.steam/root`,
        // Flatpak Steam install directories
        `${home}/.var/app/com.valvesoftware.Steam/.local/share/Steam`,
        `${home}/.var/app/com.valvesoftware.Steam/.steam/steam`,
        `${home}/.var/app/com.valvesoftware.Steam/.steam/root`,
    ];

    // Check all paths in parallel using Promise.any
    try {
        const steamDir = await Promise.any(
            possiblePaths.map(async (steamDir) => {
                await fs.access(steamDir, fs.constants.F_OK);
                return steamDir;
            }),
        );
        return steamDir;
    } catch {
        throw new Error("Steam directory not found");
    }
}

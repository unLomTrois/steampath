import fs from "fs/promises";
import { homedir } from "os";
import path from "path";

/**
 * Locates the steam directory on a Linux system
 * @throws Error if the steam directory is not found or if the HOME environment variable is not set
 * @returns The path to the steam directory
 */
export async function locateSteamDirLinux(): Promise<string> {
    const home = homedir();
    if (!home) {
        throw new Error("HOME environment variable not set");
    }

    const possiblePaths = [
        // Standard install directories
        path.join(home, ".local", "share", "Steam"),
        path.join(home, ".steam", "steam"),
        path.join(home, ".steam", "root"),
        path.join(home, ".steam"),
        // Snap steam install directories
        path.join(home, ".snap", "steam", "common", ".local", "share", "Steam"),
        path.join(home, ".snap", "steam", "common", ".steam", "steam"),
        path.join(home, ".snap", "steam", "common", ".steam", "root"),
        // Flatpak steam install directories
        path.join(home, ".var", "app", "com.valvesoftware.Steam", ".local", "share", "Steam"),
        path.join(home, ".var", "app", "com.valvesoftware.Steam", ".steam", "steam"),
        path.join(home, ".var", "app", "com.valvesoftware.Steam", ".steam", "root"),
    ];

    for (const steamDir of possiblePaths) {
        try {
            const stat = await fs.stat(steamDir);
            if (stat.isDirectory()) {
                return steamDir;
            }
        } catch {
            // Ignore errors and continue to the next path
        }
    }

    throw new Error("Steam directory not found");
}

import fs from "fs";
import { homedir } from "os";

/**
 * Locates the Steam directory on a macOS system
 * @throws Error if the Steam directory is not found
 * @returns The path to the Steam directory
 */
export async function locateSteamDirMacOS(): Promise<string> {
    const home = homedir();

    const possiblePaths = [
        `${home}/Library/Application Support/Steam`,
        "/Library/Application Support/Steam", // System-wide installation (less common)
    ];

    try {
        const steamDir = await Promise.any(
            possiblePaths.map(async (dir) => {
                await fs.promises.access(dir, fs.constants.F_OK);
                return dir;
            }),
        );
        return steamDir;
    } catch {
        throw new Error("Steam directory not found");
    }
}

import fs from "fs/promises";
import path from "path";

/**
 * Locates the steam directory on a Linux system
 * @throws Error if the steam directory is not found or if the HOME environment variable is not set
 * @returns The path to the steam directory
 */
export async function locateSteamDirLinux(): Promise<string> {
    const home = process.env.HOME;
    if (!home) {
        throw new Error("HOME environment variable not set");
    }

    const steamDir = path.join(home, ".steam", "steam");

    const isDirectory = await fs.stat(steamDir).then(
        (stat) => stat.isDirectory(),
        () => false,
    );

    const steamDirExists = isDirectory
    if (!steamDirExists) {
        throw new Error("Steam directory not found");
    }

    return steamDir;
}

import { homedir } from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';

/**
 * Locates the Steam directory on a macOS system
 * @throws Error if the Steam directory is not found
 * @returns The path to the Steam directory
 */
export async function locateSteamDirDarwin(): Promise<string> {
    const home = homedir();

    if (!home) {
        throw new Error('Home directory not found');
    }

    // Construct the path to the Steam directory
    const steamDir = path.join(home, 'Library', 'Application Support', 'Steam');

    try {
        const stat = await fs.stat(steamDir);
        if (stat.isDirectory()) {
            return steamDir;
        }
    } catch {
        // Ignore errors if the directory does not exist
    }

    throw new Error('Steam directory not found');
}

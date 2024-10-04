import { exec } from 'child_process';
import { promisify } from 'util';

/**
 * Locates the Steam directory on a Windows system
 * @throws Error if the Steam directory is not found
 * @returns The path to the Steam directory
 */
export async function locateSteamDirWindows(): Promise<string> {
    const REG_STEAM_PATH_32 = 'HKLM\\SOFTWARE\\Valve\\Steam';
    const REG_STEAM_PATH_64 = 'HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam';

    // Try to get the Steam install path from the registry
    const steamDir =
        (await getInstallPath(REG_STEAM_PATH_32)) ||
        (await getInstallPath(REG_STEAM_PATH_64));

    if (!steamDir) {
        throw new Error('Steam directory not found in registry');
    }

    return steamDir;
}

const execAsync = promisify(exec);

async function getInstallPath(regPath: string): Promise<string | null> {
    const command = `reg query "${regPath}" /v InstallPath`;
    try {
        const { stdout } = await execAsync(command);
        const match = stdout.match(/InstallPath\s+REG_SZ\s+(.*)/);
        if (match && match[1]) {
            return match[1].trim();
        }
    } catch {
        // Ignore errors and return null if the registry key doesn't exist
    }
    return null;
}

import { locateSteamDirMacOS } from "./darwin";
import { locateSteamDirLinux } from "./linux";
import { locateSteamDirWindows } from "./windows";

/**
 * Locates the steam directory on the system
 * @supported Windows, Linux, macOS
 * @throws Error if the platform is not supported
 * @returns The path to the steam directory
 */
export async function locateSteamDir(): Promise<string> {
    let steamDir: string = "";

    switch (process.platform) {
        case "win32":
            steamDir = await locateSteamDirWindows();
            break;

        case "linux":
            steamDir = await locateSteamDirLinux();
            break;

        case "darwin":
            steamDir = await locateSteamDirMacOS();
            break;

        default:
            throw new Error("Unsupported platform");
    }

    return steamDir;
}

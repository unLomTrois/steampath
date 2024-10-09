import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function findInRegistry(regPath: string): Promise<string | null> {
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

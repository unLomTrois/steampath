import { locateSteamDir } from "src";
import { describe, beforeEach, afterEach, test, expect } from "vitest";
import mockFs from "mock-fs";

const originalPlatform = process.platform;
const originalHome = process.env.HOME;
const originalUserProfile = process.env.USERPROFILE;

describe("locateSteamDir on linux", () => {
    beforeEach(() => {
        // Set the HOME environment variable
        // todo: replace with mock-os
        process.env.HOME = "/home/user";
        process.env.USERPROFILE = "/home/user";

        // Mock the platform to be Linux
        Object.defineProperty(process, "platform", {
            value: "linux",
        });
    });

    afterEach(() => {
        // Restore the mocked file system
        mockFs.restore();

        // Restore the original platform
        Object.defineProperty(process, "platform", {
            value: originalPlatform,
        });

        // Restore the original HOME environment variable
        process.env.HOME = originalHome;
        process.env.USERPROFILE = originalUserProfile;
    });

    test("should locate Steam in standard install directory", async () => {
        mockFs({
            "/home/user/.local/share/Steam": {
                steamapps: {},
            },
        });

        const steamDir = await locateSteamDir();
        expect(steamDir).toBe("/home/user/.local/share/Steam");
    });

    test("should locate Steam in Flatpak install directory", async () => {
        mockFs({
            "/home/user/.var/app/com.valvesoftware.Steam/.local/share/Steam": {
                steamapps: {},
            },
        });

        const steamDir = await locateSteamDir();
        expect(steamDir).toBe(
            "/home/user/.var/app/com.valvesoftware.Steam/.local/share/Steam",
        );
    });

    test("should locate Steam in Snap install directory", async () => {
        mockFs({
            "/home/user/.snap/steam/common/.local/share/Steam": {
                steamapps: {},
            },
        });

        const steamDir = await locateSteamDir();
        expect(steamDir).toBe(
            "/home/user/.snap/steam/common/.local/share/Steam",
        );
    });

    test("should throw an error if Steam directory is not found", async () => {
        mockFs({});

        await expect(locateSteamDir()).rejects.toThrow(
            "Steam directory not found",
        );
    });
});

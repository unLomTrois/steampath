import locateSteamDir from "src";
import { expect, test, beforeEach, afterEach, describe, beforeAll, afterAll } from "vitest";
import mock from "mock-fs";

const originalPlatform = process.platform;
const originalHome = process.env.HOME;

describe("locateSteamDir", () => {
    beforeEach(() => {
        // Set the HOME environment variable
        process.env.HOME = "/home/user";

        // Mock the platform to be Linux
        Object.defineProperty(process, "platform", {
            value: "linux",
        });
    });

    afterEach(() => {
        // Restore the mocked file system
        mock.restore();

        // Restore the original platform
        Object.defineProperty(process, "platform", {
            value: originalPlatform,
        });

        // Restore the original HOME environment variable
        process.env.HOME = originalHome;
    });

    test("should locate Steam in standard install directory", async () => {
        mock({
            "/home/user/.local/share/Steam": {
                "steamapps": {},
            },
        });

        const steamDir = await locateSteamDir();
        expect(steamDir).toBe("/home/user/.local/share/Steam");
    });

    test("should locate Steam in Flatpak install directory", async () => {
        mock({
            "/home/user/.var/app/com.valvesoftware.Steam/.local/share/Steam": {
                "steamapps": {},
            },
        });

        const steamDir = await locateSteamDir();
        expect(steamDir).toBe("/home/user/.var/app/com.valvesoftware.Steam/.local/share/Steam");
    });

    test("should locate Steam in Snap install directory", async () => {
        mock({
            "/home/user/.snap/steam/common/.local/share/Steam": {
                "steamapps": {},
            },
        });

        const steamDir = await locateSteamDir();
        expect(steamDir).toBe("/home/user/.snap/steam/common/.local/share/Steam");
    });

    test("should throw an error if Steam directory is not found", async () => {
        mock({});

        await expect(locateSteamDir()).rejects.toThrow("Steam directory not found");
    });
});

describe("locateSteamDir on Windows", () => {
    beforeAll(() => {
        process.env.HOME = "C:\\Users\\User";

        Object.defineProperty(process, "platform", {
            value: "win32",
        });

        mock({
            "C:\\Users\\User\\AppData\\Local\\Programs\\SomeGame": {
                "game.sh": "echo 'Hello, World!'",
            },
        });
    });

    test("should return the path to the steam directory", async () => {
        const steamDir = await locateSteamDir();
        expect(steamDir).toMatch(/C:\\Users\\\w+\\AppData\\Local\\Programs\\Steam/);
    });

    afterAll(() => {
        mock.restore();

        Object.defineProperty(process, "platform", {
            value: originalPlatform,
        });
    });
});

// mac

describe("locateSteamDir on macOS", () => {
    beforeAll(() => {
        process.env.HOME = "/Users/user";

        Object.defineProperty(process, "platform", {
            value: "darwin",
        });

        mock({
            "/Users/user/Library/Application Support/Steam/steamapps/common/SomeGame": {
                "game.sh": "echo 'Hello, World!'",
            },
        });
    });

    test("should return the path to the steam directory", async () => {
        const steamDir = await locateSteamDir();
        expect(steamDir).toMatch(/\/Users\/\w+\/Library\/Application Support\/Steam/);
    });

    afterAll(() => {
        mock.restore();

        Object.defineProperty(process, "platform", {
            value: originalPlatform,
        });
    });
});
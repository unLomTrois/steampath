import locateSteamDir from "src";
import { expect, test, beforeAll, afterAll, describe } from "vitest";
import mock from "mock-fs";

const originalPlatform = process.platform;

describe("locateSteamDir", () => {
    beforeAll(() => {
        process.env.HOME = "/home/user";

        Object.defineProperty(process, "platform", {
            value: "linux",
        });

        mock({
            "/home/user/.steam/steam/steamapps/common/SomeGame": {
                "game.sh": "echo 'Hello, World!'",
            },
        });
    });

    test("should return the path to the steam directory", async () => {
        const steamDir = await locateSteamDir();
        expect(steamDir).toMatch(/\/home\/\w+\/\.steam\/steam/);
    });

    afterAll(() => {
        mock.restore();

        Object.defineProperty(process, "platform", {
            value: originalPlatform,
        });
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
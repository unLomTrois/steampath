import { locateSteamDir } from "src";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import mockFs from "mock-fs";

const originalPlatform = process.platform;
const originalHome = process.env.HOME;
const originalUserProfile = process.env.USERPROFILE;

describe("locateSteamDir on macOS", () => {
    beforeAll(() => {
        // Set the HOME environment variable
        // todo: replace with mock-os
        process.env.HOME = "/Users/user";
        process.env.USERPROFILE = "/Users/user";

        Object.defineProperty(process, "platform", {
            value: "darwin",
        });

        mockFs({
            "/Users/user/Library/Application Support/Steam/steamapps/common/SomeGame":
                {
                    "game.sh": "echo 'Hello, World!'",
                },
        });
    });

    afterAll(() => {
        mockFs.restore();
        process.env.HOME = originalHome;
        process.env.USERPROFILE = originalUserProfile;

        Object.defineProperty(process, "platform", {
            value: originalPlatform,
        });
    });

    test("should return the path to the steam directory", async () => {
        const steamDir = await locateSteamDir();
        expect(steamDir).toMatch(
            /\/Users\/\w+\/Library\/Application Support\/Steam/,
        );
    });

    test("should throw an error if Steam directory is not found", async () => {
        mockFs({});

        await expect(locateSteamDir()).rejects.toThrow(
            "Steam directory not found",
        );
    });
});

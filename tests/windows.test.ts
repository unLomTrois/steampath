import { locateSteamDir } from "src";
import { describe, beforeAll, vi, test, expect, afterAll } from "vitest";
import mockFs from "mock-fs";

const originalPlatform = process.platform;

describe("locateSteamDir on Windows", () => {
    beforeAll(() => {
        // todo: replace with mock-os
        process.env.HOME = "C:\\Users\\User";
        process.env.USERPROFILE = "C:\\Users\\User";

        Object.defineProperty(process, "platform", {
            value: "win32",
        });

        mockFs({
            "C:\\ProgramFiles (x86)\\Steam\\steamapps\\common\\SomeGame": {
                "game.sh": "echo 'Hello, World!'",
            },
        });

        vi.mock("../src/utils/findInRegistry.ts", () => ({
            findInRegistry: vi
                .fn()
                .mockReturnValue("C:\\Program Files (x86)\\Steam"),
        }));
    });

    test("should return the path to the steam directory", async () => {
        const steamDir = await locateSteamDir();
        expect(steamDir).toBe("C:\\Program Files (x86)\\Steam");
    });

    afterAll(() => {
        mockFs.restore();

        Object.defineProperty(process, "platform", {
            value: originalPlatform,
        });

        vi.clearAllMocks();
    });
});

import { locateSteamDir } from "src";
import { describe,  expect, afterEach, beforeEach, it } from "vitest";
import mockFs from "mock-fs";

const originalPlatform = process.platform;

describe("locateSteamDir on Windows", () => {
    beforeEach(() => {
        // todo: replace with mock-os
        process.env.HOME = "C:\\Users\\User";
        process.env.USERPROFILE = "C:\\Users\\User";

        mockFs({
            "C:\\Program Files (x86)\\Steam\\steamapps\\common\\SomeGame": {
                "game.sh": "echo 'Hello, World!'",
            },
        });

        Object.defineProperty(process, "platform", {
            value: "win32",
        });
    });

    afterEach(() => {
        mockFs.restore();

        Object.defineProperty(process, "platform", {
            value: originalPlatform,
        });
    });

    it("should locate Steam directory on Windows", async () => {
        const steamDir = await locateSteamDir();
        expect(steamDir).toBe("C:\\Program Files (x86)\\Steam");
    });

    /* it("should locate Steam directory on Windows using registry", async (context) => {
        mockFs({});
        vi.doMock("../src/utils/findInRegistry.ts", () => ({
            findInRegistry: vi
                .fn()
                .mockReturnValue("C:\\Program Files (x86)\\Steam"),
        }));

        const steamDir = await locateSteamDirWindowsUsingRegistry();
        expect(steamDir).toBe("C:\\Program Files (x86)\\Steam");

        vi.doUnmock("../src/utils/findInRegistry.ts");
    }); */
});

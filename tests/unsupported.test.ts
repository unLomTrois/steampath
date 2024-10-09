import { locateSteamDir } from "src";
import { describe, beforeAll, afterAll, test, expect } from "vitest";

const originalPlatform = process.platform;

describe("locateSteamDir on unsopported platform", () => {
    beforeAll(() => {
        Object.defineProperty(process, "platform", {
            value: "freebsd",
        });
    });

    afterAll(() => {
        Object.defineProperty(process, "platform", {
            value: originalPlatform,
        });
    });

    test("should throw an error if Steam directory is not found", async () => {
        await expect(locateSteamDir()).rejects.toThrow("Unsupported platform");
    });
});

import {
    expect,
    test,
    beforeEach,
    afterEach,
    describe,
    beforeAll,
    afterAll,
    vi,
} from "vitest";
import mockFs from "mock-fs";
import { locateSteamDir } from "src/locateSteamDir";

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

        vi.mock("../src/utils/getInstallPath.ts", () => ({
            getInstallPath: vi
                .fn()
                .mockReturnValue("C:\\ProgramFiles (x86)\\Steam"),
        }));
    });

    test("should return the path to the steam directory", async () => {
        const steamDir = await locateSteamDir();
        expect(steamDir).toMatch(/C:\\ProgramFiles \(x86\)\\Steam/);
    });

    afterAll(() => {
        mockFs.restore();

        Object.defineProperty(process, "platform", {
            value: originalPlatform,
        });

        vi.clearAllMocks();
    });
});

// mac

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

describe("locateSteamDir on unsopported platform", () => {
    test("should throw an error if Steam directory is not found", async () => {
        Object.defineProperty(process, "platform", {
            value: "freebsd",
        });

        await expect(locateSteamDir()).rejects.toThrow(
            "Unsupported platform",
        );
    });
});

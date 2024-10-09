import { expect, test, describe, vi } from "vitest";
import { findInRegistry } from "src/utils/findInRegistry";

describe.skip("unmocked findInRegistry", () => {
    test("should throw an error if Steam directory is not found", async (context) => {
        if (process.platform !== "win32") {
            context.skip();
            return;
        } else {
            vi.unmock("../src/utils/getInstallPath.ts");
        }

        expect(
            await findInRegistry("HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam"),
        ).toBe("C:\\Program Files (x86)\\Steam");
    });
});

// vitest.config.ts
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: "v8",
            reporter: ["text-summary"],
            exclude: [...coverageConfigDefaults.exclude, "src/index.ts"],
        },
    },
});

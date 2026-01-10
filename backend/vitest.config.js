"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8', // instead of 'c8'
            enabled: true,
            reporter: ['text', 'html'],
            exclude: ['src/generated/**'],
        },
        include: ['test/**/*.test.ts'],
    },
});

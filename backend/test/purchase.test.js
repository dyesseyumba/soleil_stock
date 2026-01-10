"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const vitest_1 = require("vitest");
let server;
(0, vitest_1.beforeAll)(async () => {
    server = await app_1.default.listen({ port: 0 }); // bind to random free port
});
(0, vitest_1.afterAll)(async () => {
    await app_1.default.close();
});
(0, vitest_1.describe)('GET /products', () => {
    (0, vitest_1.it)('should return 200', async () => {
        const response = await (0, supertest_1.default)(server).get('/products');
        (0, vitest_1.expect)(response.statusCode).toBe(200);
    });
});

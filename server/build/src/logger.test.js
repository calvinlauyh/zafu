"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const sinon = require("sinon");
const chai_1 = require("chai");
const logger_1 = require("./logger");
describe("Logger", () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });
    describe("log", () => {
        it("should log message to console log", () => {
            const consoleLogStub = sandbox.stub(console, "log");
            const logger = new logger_1.Logger();
            logger.log("Test Message.");
            chai_1.expect(consoleLogStub.callCount).to.eq(1);
        });
    });
    describe("error", () => {
        it("should log message to console error", () => {
            const consoleErrorStub = sandbox.stub(console, "error");
            const logger = new logger_1.Logger();
            logger.error("Test Message.");
            chai_1.expect(consoleErrorStub.callCount).to.eq(1);
        });
    });
});
//# sourceMappingURL=logger.test.js.map
import "mocha"
import sinon = require("sinon");
import { expect } from "chai";
import { Logger } from "./logger";

describe("Logger", () => {
    let sandbox: sinon.SinonSandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("log", () => {
        it("should log message to console log", () => {
            const consoleLogStub = sandbox.stub(console, "log");
            const logger = new Logger();
            logger.log("Test Message.");

            expect(consoleLogStub.callCount).to.eq(1);
        });
    });

    describe("error", () => {
        it("should log message to console error", () => {
            const consoleErrorStub = sandbox.stub(console, "error");
            const logger = new Logger();
            logger.error("Test Message.");

            expect(consoleErrorStub.callCount).to.eq(1);
        });
    });
});
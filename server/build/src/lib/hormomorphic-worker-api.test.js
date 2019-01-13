"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const sinon = require("sinon");
const chai_1 = require("chai");
const chaiAsPromise = require("chai-as-promised");
const child_process = require("child_process");
const hormomorphic_worker_api_1 = require("./hormomorphic-worker-api");
chai_1.use(chaiAsPromise);
describe("HormomorphicWorkerAPI", () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });
    describe("getAddressScore", () => {
        it("should calculate the score from the result", () => {
            sandbox.stub(child_process, "exec").callsFake((_cmd, _options, callback) => {
                const err = null;
                const stdout = "30, 50";
                const stderr = null;
                callback(err, stdout, stderr);
                return {};
            });
            const hormorphicWorkerAPI = new hormomorphic_worker_api_1.HormomorphicWorkerAPI();
            return chai_1.expect(hormorphicWorkerAPI.getAddressScore("BTC", "3D2oetdNuZUqQHPJmcMDDHYoqkyNVsFk9r")).to.eventually.eq(70);
        });
    });
});
//# sourceMappingURL=hormomorphic-worker-api.test.js.map
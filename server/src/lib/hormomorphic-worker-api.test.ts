import "mocha"
import sinon = require("sinon");
import { use as chaiUse, expect } from "chai";
import chaiAsPromise = require("chai-as-promised");
import child_process = require("child_process");
import { HormomorphicWorkerAPI } from "./hormomorphic-worker-api";

chaiUse(chaiAsPromise);

describe("HormomorphicWorkerAPI", () => {
    let sandbox: sinon.SinonSandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });
    describe("getAddressScore", () => {
        it("should calculate the score from the result", () => {
            sandbox.stub(child_process, "exec").callsFake((_cmd: string, _options: any, callback: any): any => {
                const err = null;
                const stdout = "30, 50";
                const stderr = null;
                callback(err, stdout, stderr);
                return {};
            });

            const hormorphicWorkerAPI: HormomorphicWorkerAPI = new HormomorphicWorkerAPI();

            return expect(hormorphicWorkerAPI.getAddressScore("BTC", "3D2oetdNuZUqQHPJmcMDDHYoqkyNVsFk9r")).to.eventually.eq(70);
        });
    });
});

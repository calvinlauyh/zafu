"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const path = require("path");
const logger_1 = require("../logger");
class HormomorphicWorkerAPI {
    constructor() {
        this.calculateScoreFromQueryResult = (result) => {
            const tokens = result.split(",");
            const positiveScore = Number(tokens[2].trim());
            const negativeScore = Number(tokens[3].trim());
            return 50 - (positiveScore - negativeScore);
        };
    }
    async getAddressScore(currency, address) {
        return new Promise((resolve, reject) => {
            logger_1.logger.log(`${path.join(process.cwd(), "./fake-score-worker.sh")} "${currency} ${address}"`);
            child_process.exec(`./fake-score-worker.sh ${address}`, {}, (err, stdout, stderr) => {
                if (err) {
                    console.error(stderr);
                    reject(err);
                }
                resolve(this.calculateScoreFromQueryResult(stdout.trim()));
            });
        });
    }
    async submitAddressScore(address) {
        return new Promise((resolve, reject) => {
            logger_1.logger.log(`${path.join(process.cwd(), "./fake-score-worker.sh")} ${address}`);
            child_process.exec(`./fake-score-worker.sh ${address}`, {}, (err, stdout, stderr) => {
                if (err) {
                    console.error(stderr);
                    reject(err);
                }
                resolve(JSON.parse(stdout.trim()));
            });
        });
    }
}
exports.HormomorphicWorkerAPI = HormomorphicWorkerAPI;
//# sourceMappingURL=hormomorphic-worker-api.js.map
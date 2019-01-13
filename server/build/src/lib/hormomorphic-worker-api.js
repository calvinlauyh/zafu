"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const path = require("path");
const logger_1 = require("../logger");
class HormomorphicWorkerAPI {
    constructor() {
        this.calculateScoreFromQueryResult = (result) => {
            const tokens = result.split(",");
            const positiveScore = Number(tokens[0].trim());
            const negativeScore = Number(tokens[1].trim());
            const normalizedPositive = 50 - (positiveScore / 500) * 50;
            const normalizedNegative = ((negativeScore / 500) * 50) + 50;
            const finalScore = (normalizedPositive + normalizedNegative) / 2;
            return finalScore;
        };
    }
    async getAddressScore(currency, address) {
        return new Promise((resolve, reject) => {
            logger_1.logger.log(`python ${path.join(process.cwd(), "./hbc_db.py")} "${currency} ${address}"`);
            child_process.exec(`./fake-score-worker.sh "${currency} ${address}"`, {}, (err, stdout, stderr) => {
                if (err) {
                    console.error(stderr);
                    reject(err);
                }
                const tokens = stdout.split(",");
                const positiveScore = Number(tokens[0].trim());
                const negativeScore = Number(tokens[1].trim());
                console.log(tokens);
                console.log(tokens[1]);
                resolve({
                    positiveScore,
                    negativeScore,
                    score: this.calculateScoreFromQueryResult(stdout.trim())
                });
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
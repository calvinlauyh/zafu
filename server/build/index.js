"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const hormomorphic_worker_api_1 = require("./src/lib/hormomorphic-worker-api");
const logger_1 = require("./src/logger");
const SERVER_PORT = Number(process.env.PORT) | 8000;
const main = async () => {
    const app = express();
    app.use(express.json());
    const hormomorphicWorkerAPI = new hormomorphic_worker_api_1.HormomorphicWorkerAPI();
    app.use(function (_req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.get("/:currency/:address/score", (req, res) => {
        hormomorphicWorkerAPI
            .getAddressScore(req.params.currency, req.params.address)
            .then((score) => {
            res.send({
                success: true,
                score,
            });
        });
    });
    app.listen(SERVER_PORT, () => {
        logger_1.logger.log(`Server starts listening on ${SERVER_PORT}`);
    });
};
main();
//# sourceMappingURL=index.js.map
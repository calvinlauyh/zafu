import express = require("express");
import { HormomorphicWorkerAPI } from "./src/lib/hormomorphic-worker-api";
import { logger } from "./src/logger";

const SERVER_PORT: number = Number(process.env.PORT) | 8000;

const main = async () => {
    const app = express();
    app.use(express.json());

    const hormomorphicWorkerAPI: HormomorphicWorkerAPI = new HormomorphicWorkerAPI();

    app.use(function(_req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
    app.get(
        "/:currency/:address/score",
        (req: express.Request, res: express.Response) => {
            hormomorphicWorkerAPI
                .getAddressScore(req.params.currency, req.params.address)
                .then((score: number) => {
                    res.send({
                        success: true,
                        score,
                    });
                });
        },
    );

    app.listen(SERVER_PORT, () => {
       logger.log(`Server starts listening on ${SERVER_PORT}`)
    });
};

main();

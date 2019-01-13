import child_process = require("child_process");
import path = require("path");
import { logger } from "../logger";

export class HormomorphicWorkerAPI {
  async getAddressScore(currency: string, address: string): Promise<number> {
    return new Promise((resolve, reject) => {
      logger.log(`python ${path.join(process.cwd(), "./hbc_db.py")} "${currency} ${address}"`);
      child_process.exec(
        `python ./hbc_db.py "${currency} ${address}"`,
        {},
        (err: child_process.ExecException, stdout: string, stderr: string) => {
          if (err) {
            console.error(stderr);
            reject(err);
          }

          resolve(this.calculateScoreFromQueryResult(stdout.trim()));
        }
      );
    });
  }

  calculateScoreFromQueryResult = (result: string): number =>{
    const tokens = result.split(",");
    const positiveScore = Number(tokens[0].trim());
    const negativeScore = Number(tokens[1].trim());
    return 50 - (positiveScore - negativeScore);
  }

  async submitAddressScore(address: string): Promise<number> {
    return new Promise((resolve, reject) => {
      logger.log(`${path.join(process.cwd(), "./fake-score-worker.sh")} ${address}`);
      child_process.exec(
        `./fake-score-worker.sh ${address}`,
        {},
        (err: child_process.ExecException, stdout: string, stderr: string) => {
          if (err) {
            console.error(stderr);
            reject(err);
          }

          resolve(JSON.parse(stdout.trim()));
        }
      );
    });
  }
}

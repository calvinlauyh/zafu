"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    log(...message) {
        console.log(`[${new Date().toISOString()}][LOG]`, ...message);
    }
    error(...message) {
        console.error(`[${new Date().toISOString()}][ERROR]`, ...message);
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map
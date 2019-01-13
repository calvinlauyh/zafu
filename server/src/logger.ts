export class Logger {
    log(...message: any[]) {
        console.log(`[${new Date().toISOString()}][LOG]`, ...message);
    }

    error(...message: any[]) {
        console.error(`[${new Date().toISOString()}][ERROR]`, ...message);
    }
}

export const logger = new Logger();

import type { Request } from "express";
import { isDbConnected } from "../utils/db";
import { Logger } from "../utils/logger";

const logger = Logger.here();

class StatusController {
    getStatus = async (req: Request) => {
        logger.debug("Retrieving status");

        let status = await isDbConnected() ? "ok" : "ko";

        return {
            status: status,
            timestamp: new Date().toISOString()
        }
    }
}

export default StatusController;
import type { Request } from "express";

class StatusController {
    getStatus = async (req: Request) => {
        console.debug("Retrieving status");
        return {
            status: "ok",
            timestamp: new Date().toISOString()
        }
    }
}

export default StatusController;
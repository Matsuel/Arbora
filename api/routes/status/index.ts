import express from "express";
import createStatusRoutes from "./status.routes";
import { registerRoutes } from "../../builder/route";

const statusRouter = express.Router();

registerRoutes(statusRouter, createStatusRoutes());

export default statusRouter;
import express from 'express';
import cors from 'cors';
import { env } from './env';
import { dbHealthCheck } from './utils/db';
import statusRouter from './routes/status';
import portfolioRouter from './routes/portfolio';
import { Logger } from './utils/logger';

const logger = Logger.here()

const app = express();

app.use(cors());
app.use(express.json());

app.use(statusRouter);
app.use(portfolioRouter);

app.listen(env.PORT, async () => {
    await dbHealthCheck();
    logger.info(`Server is running on port ${env.PORT}`);
});
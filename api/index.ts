import express from 'express';
import cors from 'cors';
import { env } from './env';
import { dbHealthCheck } from './utils/db';

const app = express();

app.use(cors());
app.use(express.json());

app.listen(env.PORT, async () => {
    await dbHealthCheck();
    console.log(`Server is running on port ${env.PORT}`);
});
import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";
import { errorHandler } from "./exceptions/handler.exceptions";
import routes from "./routes/index.route";
import cors from "cors";

configDotenv();
const app: express.Express = express();

app.use(express.json());

app.use(cors({
    origin: "*",
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT']
}));

app.get("/", (req: Request, res: Response) => {
    res.json({
        name: "noorm",
        status: "running"
    });
});

app.use("/api", routes);
app.use(errorHandler);

const port: number = Number(process.env.PORT) || 8080;

app.listen(port, () => {
    console.info(`Server is running on port:${port}`);
});
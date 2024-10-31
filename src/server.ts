import "dotenv/config";
import cors from "cors";
import express from "express";
import router from "./routes";
import verifyEnvs from "./utils/verify-envs.util";
import { verifyNumbersConcursos } from "./lotomania/verify-numbers-concursos";

verifyEnvs();

// verifyNumbersConcursos();

const server = express();

server.use(express.json());
server.use(cors());
server.use(router);

server.use((error, req, res, next) => {
	res.status(500).json({ success: false, error: error.message });
});

const PORT = Number(process.env.PORT) || 3000;

server.listen(PORT, async () => {
	console.log(`\n\n...BOT Loteria Galhardo Server running on http://localhost:${PORT}`);
});

// src/server.ts
// import app from "../app";

import express from "express";
import router from "./routes";

const app = express();
const PORT = process.env.PORT || 3080;

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

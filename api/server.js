import "dotenv/config";
import express from "express";

const server = express();
const port = process.env.PORT || 3000;

server.use(express.json());

server.listen(port, () => {
  console.log(`Server is live at https://localhost:${port}`);
});

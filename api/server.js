import "dotenv/config";
import express from "express";
import registerBookings from "./routes/bookings.js";

const server = express();
const port = process.env.PORT || 3000;

server.use(express.json());

server.get('/instance', (req, res) => {
  res.status(200).json({ instance: process.env.INSTANCE_NAME });
});
registerBookings(server);

server.listen(port, () => {
  console.log(`Server is live at https://localhost:${port} and instance name is ${process.env.INSTANCE_NAME}`);
});

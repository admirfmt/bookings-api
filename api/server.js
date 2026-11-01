import "dotenv/config";
import express from "express";
import registerBookings from "./routes/bookings";

const server = express();
const port = process.env.PORT || 3000;

server.use(express.json());

registerBookings(server);

server.listen(port, () => {
  console.log(`Server is live at https://localhost:${port}`);
});

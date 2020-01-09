const express = require("express");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const dishRoutes = require("./routes/dishRoutes");
const promoRouter = require("./routes/promoRouter");
const leaderRouter = require("./routes/leaderRouter");

const hostname = "localhost";
const port = "3000";

const app = express();

app.use(bodyParser.json());

app.use("/dishes", dishRoutes);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

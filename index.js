const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import database connection and models
require("./models/index");

app.get("/", (req, res) => {
  res.send("Hello World");
});

const UsersRouter = require("./routes/Users");
app.use("/api", UsersRouter);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

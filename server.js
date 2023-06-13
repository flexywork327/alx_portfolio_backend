require("dotenv").config();
const cors = require("cors");
const express = require("express");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", require("./Routes/adminRoutes"));

// TODO: starting server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

require("dotenv").config();
const cors = require("cors");
const express = require("express");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/utils", require("./routes/utilsRoutes"));

app.use("/api/v1/admin", require("./routes/adminRoutes"));

app.use("/api/v1/sellers", require("./routes/sellersRoutes"));

app.use("/api/v1/products", require("./routes/productsRoutes"));

app.use("/api/v1/shoppers", require("./routes/shoppersRoutes"));

// TODO: starting server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

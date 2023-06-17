require("dotenv").config();
const cors = require("cors");
const express = require("express");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/admin", require("./Routes/adminRoutes"));

app.use("/api/v1/products", require("./Routes/productsRoutes"));

app.use("/api/v1/sellers", require("./Routes/sellersRoutes"));

app.use("/api/v1/shoppers", require("./Routes/shoppersRoutes"));

app.use("/api/v1/utils", require("./Routes/utilsRoutes"));

// TODO: starting server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

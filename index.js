const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//API Routes
app.use("/api/", require("./routes"));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

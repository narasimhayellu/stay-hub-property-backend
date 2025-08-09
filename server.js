const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const mongoDBConnection = require("./dbConfig/config");

const url = process.env.DB_CONNECTION_URL;
mongoDBConnection(url);
console.log("DB_CONNECTION_URL:", url); 

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.urlencoded({extended:true}));

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require("./routes/user");
const propertyRoutes = require("./routes/property");
const blogRoutes = require("./routes/blog");

app.use("/users",userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on ${PORT} `));
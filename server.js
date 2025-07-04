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

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173', // Local development
      'http://localhost:5174', // Alternative local port
      'https://tolet-property.netlify.app', // Production frontend
      'https://www.tolet-property.netlify.app' // Production with www
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); 
app.use(express.urlencoded({extended:true}));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require("./routes/user");
const propertyRoutes = require("./routes/property");

app.use("/users",userRoutes);
app.use("/api/properties", propertyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on ${PORT} `));


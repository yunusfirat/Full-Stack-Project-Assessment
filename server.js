import express from "express";
import cors from "cors";
import videos from "./routes/videos.js"
import path from "path";
const dotenv = require('dotenv');
const { Pool } = require('pg');
  
dotenv.config();
const app = express();
app.use(express.json( {limit: "30mb", extended: true }))
app.use(express.urlencoded( {limit: "30mb", extended: true }))
app.use(cors());

const PORT =  process.env.PORT || 5000;

const pool = new Pool({
    // connect with  connection string
    connectionString:process.env.CONNECTIONSTRING,
});
app.use("/", videos)


if(process.env.NODE_ENV === "production"){
    // set static folder
    app.use("/", express.static("client/build"));

    app.get("*",(req,res) => {
        res.sendFile(path.resolve(__dirname, "client","build","index.html"))
    })
}


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
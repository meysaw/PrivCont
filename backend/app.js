const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const contestRoutes = require("./routes/contestRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/submissions", submissionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/test", testRoutes);
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Mongo connected");
})
.catch((error)=>{
    console.error("mongodb connection error",error);
});
app.get("/",(req,res)=>{
    res.json({message:"PrivCont API is running"});
});
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});

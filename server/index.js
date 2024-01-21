import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors";
import { userRoute } from "./routes/userRoute.js";
import { exerciseRoute } from "./routes/qsRoute.js";
import { languageRoute } from "./routes/languageRoute.js";
dotenv.config();

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 3000;  

//routes
app.use('/api/user',userRoute);
app.use('/api/exercise',exerciseRoute);
app.use('/api/language',languageRoute)

app.listen(PORT,()=>{
    console.log(`server run at ${PORT}`);
})
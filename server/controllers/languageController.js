
import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";


export const addLanguage=asyncHandler(async(req,res)=>{
    const {language} = req.body;
  
    try {
      if(!language){
        return res.json({message:'Please provide language'});
      }
      const result = await prisma.language.create({
        data:{language}
      })
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
  //fetch all languages
  export const fetchLanguages = asyncHandler(async(req,res)=>{
    try {
      const result = await prisma.language.findMany({});
      if(!result){
        return res.json({message:'Languages Not Available'});
      }
      res.status(200).json(result);
    } catch (error) {
      
    }
  })
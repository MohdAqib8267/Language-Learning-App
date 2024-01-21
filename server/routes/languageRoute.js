import express from "express";
import { addLanguage, fetchLanguages } from "../controllers/languageController.js";


const router = express.Router();

//add language
router.post('/',addLanguage);
router.get('/',fetchLanguages);

export {router as languageRoute}
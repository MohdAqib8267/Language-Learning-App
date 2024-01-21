import express from "express";
import { createExercise, fetchExercise, fetchExerciseQues, fetchQuestions } from "../controllers/qsController.js";


const router = express.Router();
 
//create Exercise with questions
router.post('/question',createExercise);

//add questions into Exercise
router.post('/question/:id',createExercise)

//Fetch exercise
router.post('/',fetchExercise);

//fetch Question for a exercise
router.get('/:id',fetchExerciseQues);




export {router as exerciseRoute}
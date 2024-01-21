import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";

//create Exercise and insert questions into exercise
// This Api handle Both cases if admin want to creat a new Exercise and adding questions into them or can add questions into existing exercise

export const createExercise = asyncHandler(async (req, res) => {
  const exerciseId = req.params.id;
  const { title, category, minReward, maxReward, questionSets } = req.body;
  try {
    if (exerciseId) {
      //find exercise exist or not
      const findExercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
      });
      //if exercise not exist
      if (!findExercise) {
        res.json({ message: "Exercise not found" });
      }
      // if exercise exist then add questions into exercise
      const { text, level, options, correctAnswer } = req.body;
      const addQuestion = await prisma.question.create({
        data: {
          text,
          level,
          options,
          correctAnswer,
          exercise: {
            connect: {
              id: exerciseId,
            },
          },
        },
      });

      res.status(200).json(addQuestion);
    } else {
      //create new Exercise and add questions into it;
      const createdPoll = await prisma.exercise.create({
        data: {
          title,
          category,
          minReward,
          maxReward,
        },
      });
      //add question into exercise
      const createdQuestionSets = await Promise.all(
        questionSets &&
          questionSets.map(async (questionSet) => {
            const { text, level, options, correctAnswer } = questionSet;

            const createdQuestion = await prisma.question.create({
              data: {
                text,
                level,
                options,
                correctAnswer,
                exercise: {
                  connect: {
                    id: createdPoll.id,
                  },
                },
              },
            });

            return createdQuestion;
          })
      );
      res.status(200).json(createdQuestionSets);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//fetch exercise
export const fetchExercise = asyncHandler(async (req, res) => {
  const { language,userId,exerciseId } = req.body;
  try {
    let exe;
    
    if (language && userId) {
      const alreadyDone = await prisma.vote.findMany({
        where: { userId: userId }
      });
  
      // console.log(alreadyDone);
  
      const exerciseIdArray = alreadyDone.map((item) => item.exerciseId);
  
       exe = await prisma.exercise.findFirst({ 
        where: {
          category: language,
          id: {
            notIn: exerciseIdArray,
          },
        },
      });
  
      // console.log(exe);
    }
    else if(language){
      exe = await prisma.exercise.findFirst({
        where: {
          category: language,
        },
      });
    
    }else{
      exe=await prisma.exercise.findFirst({
        where:{
          id:exerciseId
        }
      })
      return res.json(exe);
    }
    if (!exe) {
     return res.json({ message: "Exercise not available for this Language" });
    }
    return res.status(200).json(exe);
  } catch (error) {
    console.error(error);
   return res.status(500).json({ message: "Internal Server Error" });
  }
});

//fetch exercise with questions based on the selected Language
export const fetchQuestions = asyncHandler(async (req, res) => {
  // const exerciseId = req.params.id;
  const { language } = req.body;

  // console.log(req.body);
  try {
    //fetch Exercises related to language
    const exe = await prisma.exercise.findMany({
      where: {
        category: language,
      },
    });
    if (exe.length == 0) {
      res.json({ message: "Exercise not available for this Language" });
    }

    // Fetch questions from a specific exercises
    const exerciseIds = exe.map((exercise) => exercise.id);
    const questions = await prisma.question.findMany({
      where: {
        exerciseId: {
          in: exerciseIds,
        },
      },
    });

    if (questions.length === 0) {
      return res.json({ message: "Questions not available in exercises" });
    }

    // Sort questions according to the level
    const sortedQuestions = questions.sort((a, b) => a.level - b.level);

    return res.status(200).json(sortedQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//fetch Questions for a exercise
export const fetchExerciseQues = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    if (!id) {
      return res.status(400).json({ message: "Please provide ID" }); // Use return to exit early
    }

    const result = await prisma.question.findMany({
      where: { exerciseId: id },
    });

    // Sort questions according to the level
    const sortedQuestions = result.sort((a, b) => a.level - b.level);
    // console.log(sortedQuestions);

    return res.status(200).json(sortedQuestions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



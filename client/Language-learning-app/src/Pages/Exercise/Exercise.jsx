import React, { useState, useEffect } from "react";
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import ReplayIcon from '@mui/icons-material/Replay';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from "@mui/material/Alert";
import Navbar from "../../Components/Navbar/Navbar"
import './Exercise.css'
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { NextPlanOutlined } from "@mui/icons-material";
import { useAuth0 } from "@auth0/auth0-react";
import Footer from "../../Components/Footer/Footer";



const Quiz_Set = [
    {
        queno:"que_1",
        que : "1) How many sides are equal in a scalene triangle?",
        options : [{que_options: "3" , selected: false},{que_options:"2", selected: false},{que_options:"0", selected: false}],
        ans : "0"
    },
    {
        queno:"que_2",
        que : "2) The angles of a triangle are 90°,35° and 55°.What type of triangle is this?",
        options : [{que_options: "Right Angled" , selected: false},{que_options:"Obtuse Angled", selected: false},{que_options:"Acute Angled", selected: false}],
        ans : "Right Angled"
    },
    {
        queno:"que_3",
        que : "3) The perimeter of an equilateral triangle is 24cm.Length of each side(in cm) is?",
        options : [{que_options: "9" , selected: false},{que_options:"6", selected: false},{que_options:"8", selected: false}],
        ans : "8"
    },
    {
        queno:"que_4",
        que : "4) The sum of angles of a triangle is?",
        options : [{que_options: "90" , selected: false},{que_options:"150", selected: false},{que_options:"180", selected: false}],
        ans : "180"
    },
    {
        queno:"que_5",
        que : "5) A triangle has angles 60°,60° and 60°.State the type of triangle?",
        options : [{que_options: "Isosceles" , selected: false},{que_options:"Equilateral", selected: false},{que_options:"Scalene", selected: false}],
        ans : "Equilateral"
    },
    {
        queno:"que_6",
        que : "6) What is a third angle for a triangle where angle1 = 57° and angle2 = 92° ?",
        options : [{que_options: "45" , selected: false},{que_options:"60", selected: false},{que_options:"31", selected: false}],
        ans : "31"
    },
    {
        queno:"que_7",
        que : "7) Pythagoras theorem is applicable to which type of triangles?",
        options : [{que_options: "Right" , selected: false},{que_options:"Acute", selected: false},{que_options:"Obtuse", selected: false}],
        ans : "Right"
    },
    {
        queno:"que_8",
        que : "8) The triangle which has 2 sides congruent?",
        options : [{que_options: "Equilateral" , selected: false},{que_options:"Isosceles", selected: false},{que_options:"Scalene", selected: false}],
        ans : "Isosceles"
    }
]

const Quiz = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [quizSet, setQuizSet] = useState(Quiz_Set);
    const [booleanonsubmit, setBooleanOnSubmit] = useState(false);
    const [total, setTotal] = useState(0);
    const [open, setOpen] = useState(false);
    const [catchmsg, setCatchmsg] = useState("");
    const [errormsg, setErrormsg] = useState("");

    const [language,setLanguage]=useState([]);
    const [exer,setExer]=useState('');
    const navigate = useNavigate();

    const {id}=useParams();
    //fetch language
    useEffect(()=>{
      const fetchLang = async()=>{
        const result = await axios.post(`http://localhost:8000/api/exercise`,{
          exerciseId:id
        })
        console.log(result);
        setExer(result?.data?.title);
        setLanguage(result?.data?.category);
      }
      
      fetchLang();
    },[]);

    const {user} = useAuth0();
    // console.log(user);  
    const [userDetails,setUserDetails]=useState('');

    useEffect(()=>{
      const findUser = async()=>{
        const result = await axios.post(`http://localhost:8000/api/user/signup`,{
          email:user.email
        })
        // console.log(result?.data?.existingUser);
        setUserDetails(result?.data?.existingUser.id);
      }
      findUser();
    },[user]);

    useEffect(()=>{
        const fetchQues = async () => {
            try {
                const result = await axios.get(`http://localhost:8000/api/exercise/${id}`);
      
              if (!result.data) {
                console.log("Questions not available");
              }
              setQuizSet(result?.data);
              // console.log(result);
            } catch (error) {
              console.log(error);
            }
          };
          fetchQues();
    },[id]);
  
    useEffect(() => {
      setQuizSet(Quiz_Set);
    }, []);
  
    const handleNext = () => {
      setActiveStep((prevStep) => prevStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevStep) => prevStep - 1);
    };
  
    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    };
  
    const onInputChange = (e) => {
      const updatedQuizSet = quizSet.map((card) => {
        if (card.level != e.target.name) return card;
    
        return {
          ...card,
          options: card.options.map((opt) => {
            // console.log(opt)
            const checked = opt.que_options === e.target.value;
            return {
              ...opt,
              selected: checked,
            };
          }),
        };

      }); 
    
      // console.log(updatedQuizSet); 
      setQuizSet(updatedQuizSet);
      
    };
  
    const onsubmit = () => {
      let list = quizSet;
      let count = 0;
      let notattempcount = 0;

      let points=0;
  
      list.forEach((item) => {
        item.options.forEach((anslist) => {
          if (anslist.selected === true) {
            if (anslist.que_options === item.correctAnswer) {
              count = count + 1;
              points= points+item.level;
            }
          } else {
            notattempcount = notattempcount + 1;
            points = points+0;
          }
        });
      });
  
      
      if (notattempcount <= (list.length*4) && notattempcount > (list.length*4 - list.length)) {
        setBooleanOnSubmit(false);
        setTotal(count);
        setCatchmsg("Please attempt all questions");
        setErrormsg("error");
        setOpen(true);
      } else {
        setBooleanOnSubmit(true);
        setTotal(count);
        
        const updateUserLevel = async()=>{
          const userId=userDetails;
          const findUser = await axios.post(`http://localhost:8000/api/user/find`,{
            userId:userId,
            points:points,
            exerciseId:id
          });
          // console.log(findUser);
        }
        updateUserLevel();
      }
    };
  
    const Snackbarrender = () => {
      return (
        open ? (
          <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} style={{ marginTop: '0px', width: '100%' }}>
            <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={errormsg}>
              {catchmsg}
            </MuiAlert>
          </Snackbar>
        ) : null
      );
    };
    const handleNewQuiz= async()=>{
      // I have userId then i will fetch vote table
      // console.log("call");

      const userId=userDetails;
      // console.log(userId,language);
      const newex = await axios.post(`http://localhost:8000/api/exercise`,{
        language:language,
        userId:userId
      })
      console.log(newex);
      setBooleanOnSubmit(false); setActiveStep(0);
      setTotal(0);
      navigate(`/exercise/${newex?.data?.id}`);
    }

   
    return (
        <>
        <Navbar />
      <div className="Quiz_render_container">
        {booleanonsubmit ?
          (<div className="Quiz-DisplayResult">
            <h2> Total Correct is {total} Out Of 5 </h2>
            {/* <Button onClick={() => {handleNewQuiz; setBooleanOnSubmit(false); setActiveStep(0); setQuizSet(Quiz_Set); setTotal(0) }}> */}
            <Button onClick={handleNewQuiz}>
              <NextPlanOutlined /> Next Exercise
            </Button>
          </div>)
          :
            id === 'undefined' ? (
              <div className="Quiz-DisplayResult">
                <h2>Exercise Finish</h2>
              </div>
            ) : 
          <div className="Quiz_container_display">
            <h2>{exer}</h2>
            {quizSet.map((item, index) => {
              if (Math.abs(activeStep - index) <= 0) {
                return (
                  <div key={item.level}>
                    <div className="Quiz_que"><b>Que{item.level}:-</b>{item.text}</div>
                    <div className="Quiz_options"> Options are : </div>
                    {item.options.map((ans, index_ans) => {
                        
                      index_ans = index_ans + 1;
                      return (
                        <div key={index_ans} className="Quiz_multiple_options">
                          {index_ans}] {ans.que_options}
                          <input
                            key={index_ans}
                            type="radio"
                            name={item.level}
                            value={ans.que_options}
                            checked={!!ans.selected}
                            onChange={onInputChange}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              } else {
                return null;
              }
            })}
  
            <div className="Quiz-MobileStepper">
              <MobileStepper variant="dots" steps={quizSet.length} position="static" activeStep={activeStep}
                nextButton={
                  activeStep === 4 ?
                    <Button size="small" onClick={onsubmit}>
                      Submit
                    </Button>
                    :
                    <Button size="small" onClick={handleNext} disabled={activeStep === quizSet.length}>
                      Next
                    </Button>
                }
                backButton={
                  <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                    Back
                  </Button>
                }
              />
            </div>
          </div>
            
            
        }
        
        {Snackbarrender()}
      </div>
      <Footer />
      </>
    );
  };
  
  export default Quiz;
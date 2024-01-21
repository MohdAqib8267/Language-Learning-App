import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./SelectLanguage.css";
import Navbar from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Footer from "../../Components/Footer/Footer";

const SelectLanguage = () => {
  const base_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [language, setLanguage] = React.useState('');
  const [list,setList]=React.useState([]);
  const [id,setId]=useState('');
  const {user}=useAuth0();

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const result = await axios.get(`${base_URL}/language`);

        if (!result) {
          console.log("No list available");
        }
        setList(result.data);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLanguages();
  }, []);

  //fetch exercise related to language
  useEffect(()=>{
    const fetchExercise = async () => {
        try {
          if(user){
          const findUser = await axios.post(`${base_URL}/user/signup`,{
            email:user.email
          })
          console.log(findUser,language);
        
            const result = await axios.post(`${base_URL}/exercise`, {
                language: language, 
                userId:findUser?.data?.existingUser?.id
                
              });
  
          if (!result.data) {
            console.log("No list available");
          }
          setId(result?.data?.id);
        }
          // console.log(result);
        } catch (error) {
          console.log(error);
        }
      };
      fetchExercise();
  },[language,user,window.location]);
  // console.log(id);

  const {  isAuthenticated } = useAuth0();
  return (
    <>
      <Navbar />
      <div className="selectLanguage">
        <h1>Language Learning App</h1>
        <h2>Please select Language.</h2>
        <div className="options">
          <Box sx={{ minWidth: 80, width: 300 }}>
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                style={{ textAlign: "left" }}
              >
                Select Language
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={language}
                label="Select Language"
                onChange={handleChange}
              >
                {list &&
                  Array.isArray(list) &&
                  list.map((item, index) => (
                    <MenuItem key={index} value={item.language}>
                      {item.language}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
          
          <button
            onClick={() =>
              !isAuthenticated? alert('You Are Not Logged In'):
              language ? navigate(`/exercise/${id}`) : 
              alert("Please select language")
            }
          >
            Start
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SelectLanguage;

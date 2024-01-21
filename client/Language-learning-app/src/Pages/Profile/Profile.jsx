import React, { useEffect, useState } from 'react'
import Navbar from "../../Components/Navbar/Navbar"
import "./Profile.css"
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import Footer from '../../Components/Footer/Footer';

const Profile = () => {
    const navigate = useNavigate();
    const {user} = useAuth0();
    const base_URL = import.meta.env.VITE_API_BASE_URL;
    // console.log(user);  
    const [userDetails,setUserDetails]=useState('');

    useEffect(()=>{
      const findUser = async()=>{
        const result = await axios.post(`${base_URL}/user/signup`,{
          email:user.email
        })
        // console.log(result?.data?.existingUser);
        setUserDetails(result?.data?.existingUser);
      }
      findUser();
    },[user]);

  return (
    <>
    <Navbar />
    <div className='profile'>
        <h2>User Profile</h2>
      <div className="profile-card">
        <div className="img-container">
            <div className="profile-img">
                {/* <img src="https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmF0bWFufGVufDB8fDB8fHww" alt="" /> */}
                <img src={user?.picture} alt="" />
            </div>
        </div>
        <div className="profile-info">
            <div className='info-points'>
            <span>Email:</span>
            <span>{userDetails?.email}</span>
            </div>
            <hr />
            {/* <div className='info-points'>
            <span>Attemped Questions:</span>
            <span>12</span>
            </div>
            <hr /> */}
            <div className='info-points'>
            <span>Points:</span>
            <span>{userDetails?.rewards}</span>
            </div>
            <hr />
            <div className='info-points'>
            <span>Level:</span>
            <span>{userDetails?.rewards >= 30?"Rider":"Biginner"}</span>
            </div>
        </div>
        <button style={{marginTop:"1rem"}} onClick={()=>navigate('/')}>Go To Home</button>

      </div>
    </div>
    <Footer />
    </>
  )
}

export default Profile

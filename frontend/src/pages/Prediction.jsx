import React from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import { useState } from 'react';
import {toast,Toaster} from 'react-hot-toast'
import Loading from './Loading';
import Sidebar from '../Components/Sidebar';
import { Link } from 'react-router-dom';
const Prediction = () => {
    const token = localStorage.getItem("token")
    const [userData, setUserData] = useState({
        username: '',
      });
      const proxyUrl = 'http://localhost:8080/';

    
      const [prediction, setPrediction] = useState(null);
      const [loading, setLoading] = useState(false);
      const [data,setData] = useState()

    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
      };
      
    const predictHandler = async () => {
      if(userData.username === ''){
        toast.error("Username is required");
        return;
      }
        try {
          setLoading(true); 
          setData(null)
          const response = await fetch(`${process.env.REACT_APP_BASE_URI}/predict`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch prediction from the API');
          }            
          const result = await response.json();
          console.log(result)
          if(result?.status === 'error'){
            toast.error(result?.message)
          }
          else{
          setData(result?.results)
          setPrediction(result?.prediction)
          return result.prediction; // Adjust this based on your API response structure
          }
        } catch (error) {
          console.log(error)
          toast.error(error?.message);

          console.error('Error fetching prediction:', error);
          return 'Error fetching prediction';
        } finally {
          setLoading(false);
        }
      };
      const handlePredict = async () => {
        // Call the predictHandler function here
        const result = await predictHandler();
    
        // Update the state with the prediction result
      };
    return (
        <div className='flex bg-[#fff] min-h-screen'>
          {token && <Sidebar />}          
          <Toaster />
          <div className={`${token && "ml-64"} w-full`}>
          <div className='w-full text-right p-5'>
          {!token && <Link to="/login">Admin Login</Link>}
          </div>
            <div className='w-full items-center justify-center grid'>
                <div>
                    <h1 className='text-[50px] font-bold my-12 text-center'>Fake Instagram<br></br> Account Detector</h1>
                    <p className=' mt-[-20px]  text-center'>Project accurately discerns fake social media accounts, bolstering online trust with precise <br></br>identification, ensuring platform integrity and user safety</p>
                </div>
                <div className='max-w-3xl my-12 ml-20'>
                    <input className='border border-[black] p-6 w-[340px] outline-none' placeholder='Enter instagram username' 
                     type="text"
                     id="username"
                     name="username"
                     value={userData.username}
                     onChange={handleInputChange}
                    />
                    <button className='bg-black text-white p-6 border ml-2 w-[240px] border-[black]'
                    onClick={handlePredict}
                    >Check Profile</button>
                </div>
            </div>
            {loading?<Loading />:data?<div className='mx-12 mb-12 border border-gray-300 shadow-lg grid grid-cols-2'>
                <div className='border-r-2 my-16'>
                    <a href={`http://www.instagram.com/${userData?.username}`} target='_blank'><div className='w-full grid justify-center items-center'>
                        {data?.profile_pic_url?<img src={`${proxyUrl}${data?.profile_pic_url}`}
                         referrerPolicy="no-referrer"
                         crossOrigin="anonymous"
                         headers={{ "X-Requested-With": "XMLHttpRequest" }}
                            className='w-28 h-28 rounded-full'
                        />:""}
                        <p className='font-bold my-4 text-center'>@{data?.username}</p>

                    </div>
                    </a>
                    <div className='grid justify-center items-center my-8 mx-16 border shadow-xl'>
                 <ReactSpeedometer
                value={prediction}
                minValue={0}
                maxValue={1}
                startColor="green"
                endColor="red"
                segments={10}  
                height={200}
                ringWidth={10}
                
            />            
                    </div>
                    <p className='text-center font-bold'>{prediction?"This Profile is Fake":"This Profile is Real"}</p>
                </div>
                <div className='border m-16 shadow-lg max-h-[420px]'>
                    <div className='flex justify-between items-center'>
                            <h1 className='p-12 font-bold text-[24px]'>Total Followers</h1>
                            <p className='p-12'>{data?.edge_followed_by.count}</p>
                    </div>
                    <hr className='mx-12 w-[4] h-[4]'></hr>
                    <div className='flex justify-between items-center'>
                            <h1 className='p-12 font-bold text-[24px]'>Total Following</h1>
                            <p className='p-12'>{data?.edge_follow?.count}</p>
                    </div>
                    <hr className='mx-12 w-[4] h-[4]'></hr>
                    <div className='flex justify-between items-center'>
                            <h1 className='p-12 font-bold text-[24px]'>Total Posts</h1>
                            <p className='p-12'>{data?.edge_owner_to_timeline_media?.count}</p>
                    </div>
                </div>
            </div>:""}
            </div>
        </div>
    );
}

export default Prediction;
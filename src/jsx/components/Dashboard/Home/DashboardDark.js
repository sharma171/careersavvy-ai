import React, { Fragment, useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserIcon from './userIcon.png';
import "./styles/dash.css";
import GptIcon from "../SearchJobs/aiIcon.gif";


import { ThemeContext } from "../../../../context/ThemeContext";
import JobSlide from "./JobSlide";
import { FeaturedSlide } from "./FeaturedSlide";
import CareerInsights from "./career-dash/careerInsights";
import Feedback from "./feedback";
import { setProfileData, setTechSkills, setFileResume, setActivities, setJobsApplied, setIsDarkMode, setSubscriptionNextAction, SetFeaturesToBlock,  } from "../../../../store/actions/actions";

const SunIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
     {/* Sun Core */}
     <circle cx="12" cy="12" r="5" fill="yellow" stroke="orange" strokeWidth="2" />
     {/* Sun Rays */}
     <g stroke="orange" strokeWidth="2">
       <line x1="12" y1="1" x2="12" y2="4" />
       <line x1="12" y1="20" x2="12" y2="23" />
       <line x1="1" y1="12" x2="4" y2="12" />
       <line x1="20" y1="12" x2="23" y2="12" />
       <line x1="4.5" y1="4.5" x2="6.5" y2="6.5" />
       <line x1="17.5" y1="17.5" x2="19.5" y2="19.5" />
       <line x1="4.5" y1="19.5" x2="6.5" y2="17.5" />
       <line x1="17.5" y1="6.5" x2="19.5" y2="4.5" />
     </g>
   </svg>
 );
 
 
 const MoonIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
     <path d="M569 936q-119 0-201.5-82.5T285 652q0-113 72.5-192T526 338q6 0 11 .5t11 .5q-33 38-50 86t-17 101q0 122 87.5 210T757 824q11 0 21-.5t21-1.5q-58 79-140.5 121.5T569 936Z" />
   </svg>
 );


const DashboardDark = () => {
   const dispatch = useDispatch();
   
   // Get profile data and tech skills from Redux state
   const { profileData, techSkills, fileResume, activities, jobsApplied, isDarkMode, subscriptionNextAction, apiToken, apiTokenReady, detailedJob } = useSelector((state) => state.profile);
    const { changeBackground } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const userEmail = useSelector((state) => state.auth.auth.email);
    const [feedbackPopup, setFeedbackPopup] = useState("");
    const [recentJobCount, setRecentJobCount] = useState("");
    const [interviewCount, setInterviewCount] = useState("");
    const [upgradePro, setUpgradePro] = useState(false);
    const [loaderAnimation,setLoaderAnimation] = useState(true);
    
    
    
    function feedbackTrigger() {
      setFeedbackPopup("active");
    }
    const dashapi = 'https://us-east1-foursssolutions.cloudfunctions.net/user_recent_activities_v2';

  // Memoize the userEmail to avoid unnecessary recomputation
  
  const memoizedactivities = useMemo(() => {
    return activities && activities.length>0;
  }, [activities]);
  const memoizedjobsApplied = useMemo(() => {
   return jobsApplied && jobsApplied>0;
  }, [jobsApplied]);
  useEffect(()=>{
   if(detailedJob!=="") {
      navigate(`/job/detailed?id=${detailedJob}`);
   }
  },[detailedJob])

  const fetchActivities = async () => {
      if (memoizedactivities) {
         console.log("activityLoaded");
         return; // Exit early if profileData is already present
      }
    try {
      const queryObj = {
        email_id: userEmail, // Using memoized userEmail
        task: "recent_activity",
      };

      const response = await fetch(dashapi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${apiToken}`,
        },
        body: JSON.stringify(queryObj),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      dispatch(setActivities(data.recent_activity));
    } catch (error) {
      console.error("File Error:", error);
    }
  };

  const JobsApplied = async () => {
   if (memoizedjobsApplied){
         console.log("jobs applied already fetched");
         return; // Exit early if profileData is already present
      }
      console.log(jobsApplied);
    try {
      const queryObj = {
        email_id: userEmail, // Using memoized userEmail
        task: "total_jobs_applied"
      };

      const response = await fetch(dashapi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`,
        },
        body: JSON.stringify(queryObj),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      dispatch(setJobsApplied(data.total_jobs_applied));
    } catch (error) {
      console.error("File Error:", error);
    }
  };
  useEffect(() => {
      if(userEmail!=='' && apiToken!==''){
         fetchFilenames();
         JobsApplied();
         fetchActivities();
         setTimeout(()=>{
            setLoaderAnimation(false);
         },2000)
      }
   }, [apiTokenReady]); // Only runs if userEmail changes
  

    useEffect(() => {
      if (fileResume?.length > 0 && apiToken!=='') {
         fetchSkillsTechnologies();
      }
   }, [fileResume,apiTokenReady]);


    const fileApi = "https://us-east1-foursssolutions.cloudfunctions.net/send_resume_details_front_end_v2";
     
    const fetchFilenames = async () => {
      try {
        const queryObj = {
          "emailid": `${userEmail}`,  // using template literal correctly
        };
    
        const response = await fetch(fileApi, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
               'Authorization': `Bearer ${apiToken}`,
          },
          body: JSON.stringify(queryObj),
        });
    
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
    
        const data = await response.json();
    
        // Extract file names from file_details
        const extractedFilenames = data.file_details.map((file) => file.file_name);
        
        // Set the first file resume (assuming you want the first one)
        dispatch(setFileResume(extractedFilenames[0]));
        dispatch(SetFeaturesToBlock(data.features_to_block));
        dispatch(setSubscriptionNextAction(data.subscription_next_action));
        
    
        // Extract user details and dispatch
        const extractedProfileData = data.user_details[0];  // assuming it's an array of 1 object
        dispatch(setProfileData(extractedProfileData));
        setInterviewCount(data.total_interviews);
        setRecentJobCount(data.recent_job_applications);
        // Navigate to resume upload page if no resumes are found
        

        if (!extractedFilenames?.length) {
         //  navigate("/resume-upload");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    useEffect(() => {
      setTimeout(()=> {
         if(subscriptionNextAction==="Trial Expired"){
            setUpgradePro(true);
            setTimeout(() => {setUpgradePro(false);},10000)
            setTimeout(() => {
               setUpgradePro(true);
               setTimeout(() => {setUpgradePro(false);},10000)
            },3600000);
         }
         else if(subscriptionNextAction==="Trial User"){
            setUpgradePro(true);
            setTimeout(() => {setUpgradePro(false);},10000);
         }
         else if(subscriptionNextAction==="Reactivate"){
            setUpgradePro(true);
            setTimeout(() => {setUpgradePro(false);},10000)
         }
         else{
            setUpgradePro(false);
         }
      },8000)
      
    },[subscriptionNextAction])
    

    
      

    const fetchSkillsTechnologies = async () => {
      if (techSkills && Object.keys(techSkills)?.length > 1) {
         console.log("Tech skills already fetched");
         return; // Exit early if profileData is already present
      }
      try {
         const fileName = fileResume;
         const bodyData = {
            email_id: userEmail,
            file_name: fileName,
            app_name: 'frontend'
         };

         const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/get_skills_technologies_from_resume_v2', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${apiToken}`,
            },
            body: JSON.stringify(bodyData)
         });

         if (!response.ok) {
            throw new Error('Failed to fetch skills, technologies, and title');
         }

         const data = await response.json();

         // Dispatch tech skills to Redux
         dispatch(setTechSkills(data));
      } catch (error) {
         setError(error.message);
         console.error('Error fetching skills and technologies:', error);
            setTimeout(()=>{
               if (fileResume?.length > 0) {
                  fetchSkillsTechnologies();
               }
            },70000);
      }
   };

   

   

   useEffect(() => {
      // Initial setup of theme when the component loads
      const currentTheme = isDarkMode ? "dark" : "light";
      changeBackground({
        value: currentTheme,
        label: currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1),
      });
    }, [isDarkMode]);
  
    const toggleTheme = () => {
      dispatch(setIsDarkMode(!isDarkMode)); // Dispatch the Redux action
      console.log("Toggled theme to:", !isDarkMode ? "Dark" : "Light");
    };

    const recentjobsApplied = parseInt(recentJobCount.split(" ")[3]);

    // Calculate the remaining days until expiration
  const calculateDaysLeft = () => {
   if (profileData.service_expiry_date) {
     const expiryDate = new Date(profileData.service_expiry_date);
     const currentDate = new Date();
     const timeDiff = expiryDate - currentDate;
     return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert ms to days
   }
   return null;
 };

 const daysLeft = calculateDaysLeft();



  
   return (
      <Fragment>
         <div className="row dashboard">
            <div className="col-xl-3 col-xxl-3 col-sm-6 info-graphic-card">
               <div className="card bg-primary">
                  <div className="card-body">
                     <div className="media align-items-center">
                        <span className="p-2 me-3 feature-icon rounded">
                           <svg
                              width="36"
                              height="36"
                              viewBox="0 0 36 36"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 d="M30.25 5.75H28.5V2.25C28.5 1.78587 28.3156 1.34075 27.9874 1.01256C27.6593 0.684374 27.2141 0.5 26.75 0.5C26.2859 0.5 25.8407 0.684374 25.5126 1.01256C25.1844 1.34075 25 1.78587 25 2.25V5.75H11V2.25C11 1.78587 10.8156 1.34075 10.4874 1.01256C10.1592 0.684374 9.71413 0.5 9.25 0.5C8.78587 0.5 8.34075 0.684374 8.01256 1.01256C7.68437 1.34075 7.5 1.78587 7.5 2.25V5.75H5.75C4.35761 5.75 3.02226 6.30312 2.03769 7.28769C1.05312 8.27226 0.5 9.60761 0.5 11V12.75H35.5V11C35.5 9.60761 34.9469 8.27226 33.9623 7.28769C32.9777 6.30312 31.6424 5.75 30.25 5.75Z"
                                 fill="white"
                              />
                              <path
                                 d="M0.5 30.25C0.5 31.6424 1.05312 32.9777 2.03769 33.9623C3.02226 34.9469 4.35761 35.5 5.75 35.5H30.25C31.6424 35.5 32.9777 34.9469 33.9623 33.9623C34.9469 32.9777 35.5 31.6424 35.5 30.25V16.25H0.5V30.25Z"
                                 fill="white"
                              />
                           </svg>
                        </span>
                        <div className="media-body text-end feature-icon-text">
                           <p className="fs-18 text-white mb-2">
                              Interviews
                           </p>
                           <span className="fs-48 text-white font-w600">
                              {interviewCount||0}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl-3 col-xxl-3 col-sm-6 info-graphic-card">
               <div className="card bg-info">
                  <div className="card-body">
                     <div className="media align-items-center">
                        <span className="p-2 me-3 feature-icon rounded">
                           <svg
                              width="36"
                              height="36"
                              viewBox="0 0 42 42"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 d="M38.4998 10.4995H35.0002V38.4999H38.4998C40.4245 38.4999 42 36.9238 42 34.9992V13.9992C42 12.075 40.4245 10.4995 38.4998 10.4995Z"
                                 fill="white"
                              />
                              <path
                                 d="M27.9998 10.4995V6.9998C27.9998 5.07515 26.4243 3.49963 24.5001 3.49963H17.4998C15.5756 3.49963 14.0001 5.07515 14.0001 6.9998V10.4995H10.5V38.4998H31.5V10.4995H27.9998ZM24.5001 10.4995H17.4998V6.99929H24.5001V10.4995Z"
                                 fill="white"
                              />
                              <path
                                 d="M3.50017 10.4995C1.57551 10.4995 0 12.075 0 13.9997V34.9997C0 36.9243 1.57551 38.5004 3.50017 38.5004H6.99983V10.4995H3.50017Z"
                                 fill="white"
                              />
                           </svg>
                        </span>
                        <div className="media-body text-end feature-icon-text">
                           <p className="fs-18 text-white mb-2">
                              Jobs Applied
                           </p>
                           <span className="fs-48 text-white font-w600">
                              {jobsApplied}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="col-xl-3 col-xxl-3 col-sm-6 info-graphic-card">
               <div className="card bg-secondary">
                  <div className="card-body">
                     <div className="media align-items-center">
                        <span className="p-2 me-3 feature-icon rounded">
                           <svg
                              width="36"
                              height="36"
                              viewBox="0 0 42 42"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 d="M40.614 9.36994C40.443 8.22658 39.8679 7.18234 38.9932 6.4265C38.1184 5.67067 37.0018 5.25328 35.8457 5.25H6.1543C4.99822 5.25328 3.88159 5.67067 3.00681 6.4265C2.13203 7.18234 1.55701 8.22658 1.38599 9.36994L21 22.0618L40.614 9.36994Z"
                                 fill="white"
                              />
                              <path
                                 d="M21.7127 24.7274C21.5003 24.8647 21.2529 24.9378 21 24.9378C20.7471 24.9378 20.4997 24.8647 20.2873 24.7274L1.3125 12.4503V31.9081C1.31389 33.1918 1.82445 34.4225 2.73217 35.3302C3.63988 36.238 4.87061 36.7485 6.15431 36.7499H35.8457C37.1294 36.7485 38.3601 36.238 39.2678 35.3302C40.1755 34.4225 40.6861 33.1918 40.6875 31.9081V12.449L21.7127 24.7274Z"
                                 fill="white"
                              />
                           </svg>
                        </span>
                        <div className="media-body text-end feature-icon-text">
                           <p className="fs-18 text-white mb-2">
                           Jobs Recently Applied by Others
                           </p>
                           <span className="fs-32 text-white font-w600">
                              {recentjobsApplied}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl-3 col-xxl-3 col-sm-6 info-graphic-card" style={{minHeight:"81.3px"}}>
               <div className="card bg-success" onClick={feedbackTrigger}>
                  <div className="card-body">
                     <div className="media align-items-center">
                        <span className="p-2 me-3 feature-icon rounded">
                        <svg
                              width="36"
                              height="36"
                              viewBox="0 0 42 42"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 fillRule="evenodd"
                                 clipRule="evenodd"
                                 d="M21 0.0410156C9.94531 0.0410156 0.75 7.70941 0.75 17.206C0.75 22.2428 3.66719 26.686 8.25 29.3709V40.0378L18.5781 34.0376C19.5952 34.2369 20.6602 34.3451 21.75 34.3451C32.8047 34.3451 42 26.6767 42 17.206C42 7.70941 32.8047 0.0410156 21 0.0410156ZM21.75 31.25C21.0086 31.25 20.2707 31.1704 19.5469 31.0109L10.5 35.685V30.1891C7.19688 28.0652 4.875 23.6535 4.875 17.206C4.875 9.67359 12.1875 4.04102 21 4.04102C29.8125 4.04102 37.125 9.67359 37.125 17.206C37.125 24.7384 29.8125 31.25 21.75 31.25Z"
                                 fill="white"
                              />
                           </svg>

                        </span>
                        <div className="media-body text-end feature-icon-text">
                           
                           <span className="feedback-span text-white font-w400" >
                           Share Your <strong>Thoughts!</strong>
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl-3 col-xxl-3">
               <div className="row">
                  <div className="col-xl-12">
                     <div className="card d-flex flex-xl-column flex-sm-row flex-column">
                        <div className="card-body  text-center border-bottom profile-bx">
                           <div className="profile-image mb-4">
                              <img
                                 src={UserIcon}
                                 className="rounded-circle"
                                 alt=""
                              />
                           </div>
                           <h4 className="fs-22 text-black mb-1">Welcome, {profileData.first_name}!</h4>
                           {techSkills?.recent_job_title ? (
                              <p className="mb-4">{techSkills.recent_job_title}</p>
                              ) : (
                              <div className="skeleton-loader mb-4"></div>
                           )}
                           <div className="row">
                           {techSkills?.top_technologies && techSkills.top_technologies?.length > 0 ? (
                              techSkills.top_technologies.map((tech, index) => {
                                 const proficiency = tech?.proficiency || 0;
                                 const percentage = (proficiency / 100) * 100; // Assuming proficiency is in percentage (0-100)
                                 const strokeDasharray = `${percentage} ${100 - percentage}`;

                                 return (
                                    <div key={index} className="col-4 p-0">
                                    <div className="d-inline-block mb-2 relative donut-chart-sale">
                                       <svg className="peity" height={75} width={75} viewBox="0 0 42 42">
                                          <circle
                                          className="donut-ring"
                                          cx="21"
                                          cy="21"
                                          r="15.91549430918954"
                                          fill="transparent"
                                          stroke="#e6e6e6"
                                          strokeWidth="3"
                                          />
                                          <circle
                                          className="donut-segment"
                                          cx="21"
                                          cy="21"
                                          r="15.91549430918954"
                                          fill="transparent"
                                          stroke={
                                             index === 0
                                                ? "#FF8E26" // Orange
                                                : index === 1
                                                ? "#3EA834"  // Green
                                                : "#22AC93"  // Teal
                                          }
                                          strokeWidth="3"
                                          strokeDasharray={strokeDasharray}
                                          strokeDashoffset="25"
                                          />
                                       </svg>
                                       <small className="text-black">{tech.proficiency}</small>
                                    </div>
                                    <span className="d-block">{tech.name}</span>
                                    </div>
                                 );
                              })
                              ) : (
                              // Render skeleton loaders while loading
                              [1, 2, 3].map((_, index) => (
                                 <div key={index} className="col-4 p-0">
                                    <div className="d-inline-block mb-2 relative donut-chart-sale">
                                    <div className="skeleton skeleton-circle"></div>
                                    <small className="text-black">
                                    </small>
                                    </div>
                                    <span className="d-block">
                                    <div className="skeleton skeleton-text m-auto"></div> 
                                    </span>
                                 </div>
                              ))
                              )}
                              
                           </div>
                        </div>
                        <div className="card-body col-xl-12 col-sm-6 border-left recentAct">
                           <h4 className="fs-18 text-black mb-3">
                              Recent Activities
                           </h4>
                           
                           {activities && activities?.length > 0 ?(activities.map((item, index)=>(
                              <div className="media mb-4" key={index} style={{flexDirection:"row-reverse"}}>
                                 <span className="p-2 border  rounded" style={{height:"33.6px"}}>
                                    <svg
                                       width="16"
                                       height="16"
                                       viewBox="0 0 24 24"
                                       fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       style={{marginTop:"-11px"}}
                                    >
                                       <path
                                          d="M20.3955 10.8038C19.9733 10.8038 19.5767 10.8742 19.2057 11.0213V4.79104H12.9883C13.1226 4.42004 13.193 4.01066 13.193 3.58849C13.193 1.60554 11.5874 0 9.60447 0C7.62152 0 6.01598 1.60554 6.01598 3.58849C6.01598 4.01066 6.08634 4.41365 6.22067 4.79104H0.00958252V11.7441C0.642845 11.1684 1.48719 10.8102 2.4083 10.8102C4.39125 10.8102 5.99679 12.4158 5.99679 14.3987C5.99679 16.3817 4.39125 17.9872 2.4083 17.9872C1.48719 17.9872 0.642845 17.629 0.00958252 17.0533V24H19.2121V17.7697C19.5831 17.9104 19.9797 17.9872 20.4019 17.9872C22.3912 17.9872 23.9904 16.3817 23.9904 14.3987C23.9904 12.4158 22.3912 10.8038 20.3955 10.8038Z"
                                          fill="#40189D"
                                       />
                                    </svg>
                                 </span>
                                 <div className="media-body me-2" style={{ width: 'calc(100% - 50px)'}}>
                                    <p className="fs-13  text-black font-w500" style={{marginBottom:"2px"}}>
                                       {item.activity.replace(/=+$/, "")}
                                       {/* <strong>{index+2} {item.title}</strong> */}
                                    </p>
                                    <span className="fs-12">{item.time_ago}</span>
                                 </div>
                              </div>
                           ))):(                            
                           <div className="recent-facade col-xl-12">
                              <div className="gptAnimate"></div>
                              <img src={GptIcon} alt="gptIcon" className="gptIcon"/>
                           </div>
                           )}
                           
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl-9 col-xxl-9">
               <div className="row">
                  <div className="col-xl-12">
                     <CareerInsights />
                  </div>
                  <div className="col-xl-12 recommended">
                     <div className="d-sm-flex align-items-center mb-3 mt-sm-0 mt-2">
                           <h4 className="fs-20 text-black mb-sm-4 me-auto mt-sm-0 mt-3  mb-2">
                              Recommended Jobs
                           </h4>
                           <Link
                           to="/search-job"
                           className="btn btn-primary light btn-rounded"
                        >
                           View More
                           <svg
                              className="ms-3"
                              width="24"
                              height="14"
                              viewBox="0 0 24 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 d="M23.5607 5.93941L18.2461 0.62482C17.9532 0.331898 17.5693 0.185461 17.1854 0.185461C16.8015 0.185461 16.4176 0.331898 16.1247 0.62482C15.539 1.21062 15.539 2.16035 16.1247 2.74615L18.8787 5.50005L1.5 5.50005C0.671578 5.50005 0 6.17163 0 7.00005C0 7.82848 0.671578 8.50005 1.5 8.50005L18.8787 8.50005L16.1247 11.254C15.539 11.8398 15.539 12.7895 16.1247 13.3753C16.7106 13.9611 17.6602 13.9611 18.2461 13.3753L23.5607 8.06069C24.1464 7.47495 24.1464 6.52516 23.5607 5.93941Z"
                                 fill="#40189D"
                              />
                           </svg>
                        </Link>
                     </div>
                     <JobSlide />
                  </div>
               </div>
            </div>
            <div className="col-xl-12 featured">
               <div className="d-sm-flex align-items-center mb-3 mt-sm-0 mt-2">
                  <h4 className="text-black fs-20 me-auto">
                     Featured Companies
                  </h4>
                  {/* <Link
                     to="/search-job"
                     className="btn btn-primary light btn-rounded"
                  >
                     View More
                     <svg
                        className="ms-3"
                        width="24"
                        height="14"
                        viewBox="0 0 24 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M23.5607 5.93941L18.2461 0.62482C17.9532 0.331898 17.5693 0.185461 17.1854 0.185461C16.8015 0.185461 16.4176 0.331898 16.1247 0.62482C15.539 1.21062 15.539 2.16035 16.1247 2.74615L18.8787 5.50005L1.5 5.50005C0.671578 5.50005 0 6.17163 0 7.00005C0 7.82848 0.671578 8.50005 1.5 8.50005L18.8787 8.50005L16.1247 11.254C15.539 11.8398 15.539 12.7895 16.1247 13.3753C16.7106 13.9611 17.6602 13.9611 18.2461 13.3753L23.5607 8.06069C24.1464 7.47495 24.1464 6.52516 23.5607 5.93941Z"
                           fill="#40189D"
                        />
                     </svg>
                  </Link> */}
               </div>
               <FeaturedSlide />
            </div>
         </div>
         {/* {upgradePro && (
            <div className={`pro-bg ${isDarkMode===false?"dark":"Light"}`}>
              <div className="pro-container small">
                <div className="pro-header flex-row">
                     <img src={Icons} className="icon" alt ="icons"/>
                     <span>Upgrade To Pro</span>
                     <div className="close" onClick={()=> setUpgradePro(false)}>+</div>
                  </div>
                <div className="upgrade-description">
                {daysLeft !== null && daysLeft > 0 ? (
        <>
          You are on a Free Trial to explore all our features, which will expire in <strong>{daysLeft} days</strong> (based on {profileData?.service_expiry_date ? new Date(profileData?.service_expiry_date).toISOString().split('T')[0] : "N/A"}). 
          Upgrade to Pro to continue using these features.

        </>
      ) : (
        <>Your Subscription is Expired on {profileData?.service_expiry_date ? new Date(profileData?.service_expiry_date).toISOString().split('T')[0] : "N/A"}. Upgrade to Pro to continue using all features</>
      )}
      
                </div>
                <div className="upgrade-button" onClick={makePayment}>
                  Upgrade Now
                </div>
              </div>
            </div>
          )} */}
         <div
            onClick={toggleTheme}
            style={{
            cursor: "pointer",
            padding: "10px",
            backgroundColor: "#ddd",
            borderRadius: "50%",
            display:"none ",
            position:"fixed",
            top:"50%",
            right:"0",
            }}
         >
            {isDarkMode ? <MoonIcon /> : <SunIcon />}
         </div>
         {feedbackPopup==="active" && (<Feedback userEmail={userEmail} feedbackPopup={feedbackPopup} setFeedbackPopup={setFeedbackPopup} />) }
         {loaderAnimation && (
            <div className="LoaderAnimation">
               <div className="gptAnimate"></div>
               <img className="gptIcon" src={GptIcon} alt="gptIcon"/>
         </div>)}
      </Fragment>
   );
};

export default DashboardDark;
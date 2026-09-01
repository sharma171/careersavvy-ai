import React, { useMemo } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import GptIcon from "../SearchJobs/aiIcon.gif"
import "./Jobslide.css";
import { setJobsList } from "../../../../store/actions/actions";

import Slider from "react-slick";

const JobSlide = () => {
   const dispatch = useDispatch();
   const userEmail = useSelector(state => state.auth.auth.email);
   const { jobsList,fileResume, techSkills, apiToken, apiTokenReady } = useSelector((state) => state.profile);
   const [ finalJob, setFinalJob ] = useState([]);
   const [ isLoading, setIsLoading ] = useState(true);
   const [error, setError] = useState(null);

   
   
   const apiEndpoint = 'https://us-east1-foursssolutions.cloudfunctions.net/Get_Jobs_From_Database_Comparing_Resume_streaming_v2';

   useEffect(()=>{
      
      dispatch(setJobsList(finalJob));
   },[ finalJob]);

    useEffect(() => {
      const fetchJobsList = async () => {
         if (jobsList && jobsList.matches && jobsList.matches.length > 1) {
             return console.log("already fetched jobs");
         }
         if (!userEmail) {
             console.error("User email is not available.");
             return; // Exit if user email is not available
         }
     
         try {
             const bodyData = {
                 email_id: userEmail
             };
     
             const response = await fetch(apiEndpoint, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${apiToken}`,
                 },
                 body: JSON.stringify(bodyData)
             });
     
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             }
     
             const reader = response.body?.getReader();
             if (!reader) throw new Error("ReadableStream not supported");
     
             const decoder = new TextDecoder();
             let buffer = "";
     
             while (true) {
                 const { value, done } = await reader.read();
                 if (done) break;
     
                 buffer += decoder.decode(value, { stream: true });
     
                 const lines = buffer.split("\n");
                 buffer = lines.pop() || ""; // Keep incomplete data in the buffer
     
                 const newJobs = [];
     
                 for (const line of lines) {
                     if (line.trim()) {
                         try {
                             const jsonStr = line.startsWith('data: ') ? line.slice(6) : line;
                             const parsedData = JSON.parse(jsonStr);
     
                             if (parsedData.status === "complete") {
                                 console.log("Stream complete:", parsedData.message);
                             } else if (parsedData.matches) {
                                 newJobs.push(...parsedData.matches);
                             }
                         } catch (err) {
                             console.warn("Error parsing line:", err, line);
                         }
                     }
                 }
     
                 if (newJobs.length > 0) {
                     setFinalJob(prevJobs => {
                         const uniqueJobs = [...prevJobs, ...newJobs].reduce((acc, job) => {
                             acc.set(job.job_id, job);  // Use job_id as a unique key
                             return acc;
                         }, new Map());
     
                         return Array.from(uniqueJobs.values()).sort(
                             (a, b) => new Date(b.job_posted_at_datetime_utc) - new Date(a.job_posted_at_datetime_utc)
                         );
                     });
                 }
             }
     
             const fetchedjobs = [];
             if (buffer.trim()) {
                 try {
                     const jsonStr = buffer.startsWith('data: ') ? buffer.slice(6) : buffer;
                     const parsedData = JSON.parse(jsonStr);
                     if (parsedData.matches) {
                         fetchedjobs.push(...parsedData.matches);
                         setFinalJob(prevJobs => {
                             const uniqueJobs = [...prevJobs, ...fetchedjobs].reduce((acc, job) => {
                                 acc.set(job.job_id, job); 
                                 return acc;
                             }, new Map());
     
                             return Array.from(uniqueJobs.values()).sort(
                                 (a, b) => new Date(b.job_posted_at_datetime_utc) - new Date(a.job_posted_at_datetime_utc)
                             );
                         });
                     }
                 } catch (err) {
                     console.warn("Error parsing final buffer:", err);
                 }
             }
     
         } catch (error) {
             console.error('Error fetching jobs:', error);
             dispatch(setJobsList([]));
         }
     };
        setTimeout(()=>{
         if(userEmail!=='' && apiToken!==''){
         fetchJobsList();
         setTimeout(()=>{
            setIsLoading(false);
         },500);
         }
        },100);
    }, [apiTokenReady]); 
   const settings = {
      dots: false,
      infinite: false,
      speed: 9000,
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 19000,
      arrows: false,
      responsive: [
         {
            breakpoint: 793,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
      ],
   };
   return (
      <>
         {finalJob?.length > 0 && isLoading === false ? (
            <Slider {...settings}>
               {finalJob
                  .sort((a, b) => new Date(b.job_posted_at_datetime_utc) - new Date(a.job_posted_at_datetime_utc))
                  .slice(0, 5)
                  .map((job, index) => (
                     <div className="items" key={index}>
                        <div className="card shadow">
                           <div className="card-body">
                              <div className="media mb-2">
                                 <div className="media-body">
                                    <p className="mb-1">{job.employer_name}</p>
                                    <h4
                                       className="fs-20 text-black"
                                       style={{
                                          textOverflow: "ellipsis",
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                          maxWidth: "300px",
                                       }}
                                    >
                                       {job.job_title}
                                    </h4>
                                 </div>
                              </div>
                              <span className="text-primary font-w500 d-block mb-3">
                                 {new Date(job.job_posted_at_datetime_utc).toLocaleDateString("en-US")}
                              </span>
                              <p className="fs-14" style={{ maxHeight: "63px", minHeight: "63px", overflow: "hidden" }}>
                                 {job.job_highlights?.Qualifications || "Qualifications not provided."}
                              </p>
                              <div className="d-flex align-items-center mt-4">
                                 <Link to="/search-job" className="btn btn-primary light btn-rounded me-auto">
                                    {job.job_is_remote ? "Remote" : "Onsite"}
                                 </Link>
                                 <span className="text-black font-w500 pl-3">{job.job_employment_type}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}

            </Slider>
         ) : (
            <div className="facade col-xl-12" key="fallback-job">
               <div className="gptAnimate"></div>
               <img src={GptIcon} alt="gptIcon" className="gptIcon"/>
            </div>
         )}

      </>

   );
};

export default JobSlide;

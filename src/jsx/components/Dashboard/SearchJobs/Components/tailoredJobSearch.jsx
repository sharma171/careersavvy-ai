import React, {useEffect, useState} from 'react';
import TjobsIcon from "./images/tjobsicon.png";
import TjobsFilled from "./images/tjobFilled.png";
import InstructionIcon from "./images/instructionIcon.png";
import AnalyzeIcon from "./images/AnalyzeIcon.png";
import "./t-jobs.css";
import JdAnalyze from "./images/AnalyzeIconJd.png";
import congratulationIcon from "./images/congratulationIcon.webp";
import SuggestionIcon from "./images/SuggestionIcon.png";
import SHeadIcon from "./images/sHeadIcon.png";
import CopyIcon from "./images/CopyIcon2.png";
import AutoApplyIcon from "./images/AutoApply.png";
import AiIcon2 from "./images/AiIcon2.png";
import FeatureIcon1 from "./images/FeatureIcon1.png";
import FeatureIcon2 from "./images/FeatureIcon2.png";
import FeatureIcon3 from "./images/FeatureIcon3.png";
import AiGifIcon from "../aiIcon.gif";
import TailoredJobsToggle from "./TailoredJobsdata";



const TailoredJobSearch = ({userEmail, apiToken, fetchResumeData, autoApply, setAutoApply, upgradeVideoPro, setUpgradeVideoPro, isTailoredJobsBlocked, createResumeOn, setCreateResumeOn, resumeResponse, setresumeResponse }) => {
    const [tailoredJobs, setTailoredJobs] = useState(false);
    const [resumeResponseReady, setresumeResponseReady] = useState(null);
    const [resumeUpdates, setResumeUpdates] = useState([]);
    const [error, setError] = useState(null);
    const [loading,setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("key1");
    const [jobDescription, setJobDescription] = useState("");
    function tailoredJobsToggle() {
      getResumeUpdates();
    }
    const buySubscription = async () => {
      setLoading(true);
          try {
             if (!userEmail) {
                console.error("User email is not available.");
                return; // Exit if user email is not available
             }
             const paymentPayload = {
                "user_email": userEmail,
                "product_code":"PC_102"
             };
    
             const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/create_payment_request_v2", {
                method: 'POST',
                headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${apiToken}`,
                },
                body: JSON.stringify(paymentPayload)
             });
    
             if (!response.ok) {
                throw new Error('Failed to fetch data');
             }
    
             const data = await response.json();
             window.location.href = `${data.payment_link}`;
             setLoading(false);
    
          } catch (error) {
             setError(error.message);
             setLoading(false);
          }
       };
    const getResumeUpdates = async () => {
      setCreateResumeOn(false);
      setResumeUpdates([]);
      setLoading(true);
          try {
             if (!userEmail) {
                console.error("User email is not available.");
                return; // Exit if user email is not available
             }
             const queryObj = {
                "email_id": userEmail,
                "job_description": jobDescription
             };
    
             const response = await fetch("https://resume-update-suggestions-tailored-job-v4-980069659423.us-east1.run.app", {
                method: 'POST',
                headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${apiToken}`,
                },
                body: JSON.stringify(queryObj)
             });
    
             if (!response.ok) {
                throw new Error('Failed to fetch data');
             }
    
             // Stream and log the response chunks
             await streamResponseChunks(response);
             setresumeResponseReady("updated")
             setError(null);
             setLoading(false);
    
          } catch (error) {
             setError(error.message);
             setLoading(false);
          }
       };
       const streamResponseChunks = async (response) => {
         const reader = response.body.getReader();
         const decoder = new TextDecoder("utf-8");
         let done = false;
         let buffer = '';
       
         while (!done) {
           const { value, done: doneReading } = await reader.read();
           done = doneReading;
           if (value) {
             // Append the decoded text to buffer
             buffer += decoder.decode(value, { stream: true });
             
             // Split the buffer by newlines (or your expected delimiter)
             const lines = buffer.split("\n");
             
             // The last line might be incomplete, so keep it in the buffer
             buffer = lines.pop();
             
             // Process each complete line
             for (const line of lines) {
               // Remove the "data:" prefix if present and trim whitespace
               const trimmedLine = line.startsWith("data:") ? line.slice(5).trim() : line.trim();
               if (trimmedLine) {
                 try {
                   const jsonChunk = JSON.parse(trimmedLine);
                   console.log("jsondata",jsonChunk);
                   
                   // Append the new chunk to your state
                   setResumeUpdates(prev => [...prev, jsonChunk]);
                 } catch (e) {
                   console.error("Error parsing chunk", e, trimmedLine);
                 }
               }
             }
           }
         }
       
         // Process any remaining text in the buffer
         if (buffer) {
           const trimmedLine = buffer.startsWith("data:") ? buffer.slice(5).trim() : buffer.trim();
           if (trimmedLine) {
             try {
               const jsonChunk = JSON.parse(trimmedLine);
               setResumeUpdates(prev => [...prev, jsonChunk]);
             } catch (e) {
               console.error("Error parsing final chunk", e, trimmedLine);
             }
           }
         }
       };
       
     
       // Call getResumeUpdates when needed, for example on a button click
       // or when the component mounts (using useEffect)
useEffect(()=>{
   console.log(resumeUpdates);
   
},[resumeUpdates]);
     
     

       function TailoredBlocked() {
         setUpgradeVideoPro(true);
         setTailoredJobs(false);
       }
    
       
    return(
        <>
        <div className="t-job-btn flex-row" onClick={()=> setTailoredJobs(true)}>
            <img src={TjobsIcon} alt="tjobsIcon" />
            Tailored Job Search
        </div>
        {tailoredJobs&&(
            <>
            <div className="card detailedJob top-card d-sm-flex flex-xl-column flex-sm-row resAi">
                <div className={`tailoredJobsPopup resumeAi light`}>
                     {loading&&(
                        <>
                        <div className="bgloader">
                           <div className="loader-icon"><img src={AiGifIcon} alt="image" /></div>
                        </div>
                        </>
                     )}
                        <div className="tjobsPopup">
                            <div className="closeNew" 
                            onClick={() => {
                              setTailoredJobs(false);
                              setresumeResponseReady(null);
                            }}
                            >+</div>
                            <div className="t-head">
                                <img src={TjobsFilled} alt="" className="icon" />
                                <h4 className="head">
                                    Tailored Job Search
                                </h4>
                            </div>
                            <div className="dividerLine"></div>
                            
                            {resumeResponseReady===null?(
                              <>
                              <div className="t-jobsContent col-flex">
                              
                                 <div className="d-flex flex-row justify-content-between">
                                       <div className="jdHead row-flex">
                                          <img src={AnalyzeIcon} alt="icon" />
                                          Analyze Job Description
                                    </div>
                                    <div className="d-flex flex-col instruction">
                                          <img src={InstructionIcon} alt="icon" />
                                          <span>Paste your job description here to see how your resume aligns with the specified requirements and receive personalized job matching suggestions.</span>
                                    </div>
                                 </div>
                                
                                
                                <p className='jdPara'>Click to <strong>Analyze  Match</strong>  your resume against provided job description.</p>
                                <div className="col-flex corner-box">
                                    <textarea className="styled-textarea" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description here to see how well your resume fits...">
                                    </textarea>
                                </div>
                                <div className="d-flex">
                                 {isTailoredJobsBlocked?(<>
                                    <button className='row-flex jd_matchbtn' onClick={()=>TailoredBlocked()}>
                                        <img src={JdAnalyze} alt="icon" />
                                        Analyze Match
                                    </button>
                                 </>):(<>
                                    <button className='row-flex jd_matchbtn' onClick={tailoredJobsToggle}>
                                        <img src={JdAnalyze} alt="icon" />
                                        Analyze Match
                                    </button></>)}
                                    
                                </div>

                            </div>
                              </>
                            ):(<>
                            <div className="resumeAiInner t-jobsContent">
                              <TailoredJobsToggle resumeUpdates={resumeUpdates} resumeResponse={resumeResponse} setresumeResponse={setresumeResponse} />
                              </div>

                            </>
                            )}
                            
                        </div>
                </div>
            </div>
            </>
        )}
        {autoApply && (
            <>
            <div className="card detailedJob top-card d-sm-flex flex-xl-column flex-sm-row resAi">
               <div className={`resumeOuter resumeAi light`}>
                  <div className="AutoApplyTab">
                     <div className="close" onClick={()=>setAutoApply(false)}>+</div>
                     <div className="col-flex col-cont">
                        <div className="top-head row-flex">
                           <img src={AutoApplyIcon} alt="" className="icon" />
                           Auto Apply
                        </div>
                        <div className="row-flex Auto-Apply-Cont">
                        
                           <div className="col-flex lhs">
                              <div className="top-head-AutoApply row-flex">
                                 <img src={AiIcon2} alt="icon" className="autoapplyicons" />
                                 Career Savvy Auto Apply
                              </div>
                              <p className="para">
                              Let CareerSavvy handle job applications for you effortlessly. Focus your time on preparing for interviews while we apply to relevant positions on your behalf.
                              </p>
                              <div className="card-row row-flex">
                                 <div className="col-flex featureCard">
                                    <img src={FeatureIcon1} alt="" className="icon" />
                                    CareerSavvy identifies jobs tailored to your resume.
                                 </div>
                                 <div className="col-flex featureCard">
                                    <img src={FeatureIcon2} alt="" className="icon" />
                                    CareerSavvy matches jobs to your skills and experience.
                                    
                                 </div>
                                 <div className="col-flex featureCard">
                                    <img src={FeatureIcon3} alt="" className="icon" />
                                    CareerSavvy connects you with roles that align with your profile.
                                 </div>
                              </div>
                           </div>
                           <div className="col-flex rhs">
                              <div className="pricingtab col-flex">
                                 <h3 className="p-head">
                                    Auto Apply<br></br>
                                    Subscription Plan
                                 </h3>
                                 <h5 className="price">$49.99</h5>
                                 <h6 className='price-info'>
                                 USD/Month
                                 </h6>
                                 <h2 className='listhead'>
                                 Everything in One Plan (Includes All Pro Features)
                                 </h2>
                                 <div className="col-flex list-bullet">
                                    <div className="row-flex item">
                                       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <g clip-path="url(#clip0_1498_426)">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4678 3.44238C13.5898 3.56435 13.6583 3.72975 13.6583 3.90221C13.6583 4.07467 13.5898 4.24007 13.4678 4.36203L6.31353 11.5163C6.19156 11.6383 6.02616 11.7068 5.8537 11.7068C5.68124 11.7068 5.51584 11.6383 5.39387 11.5163L2.14192 8.26438C2.0798 8.20439 2.03025 8.13262 1.99616 8.05327C1.96208 7.97392 1.94413 7.88857 1.94338 7.80221C1.94263 7.71586 1.95909 7.63021 1.99179 7.55028C2.02449 7.47035 2.07279 7.39773 2.13385 7.33667C2.19492 7.2756 2.26754 7.22731 2.34747 7.1946C2.4274 7.1619 2.51304 7.14545 2.5994 7.1462C2.68576 7.14695 2.77111 7.16489 2.85046 7.19897C2.92981 7.23306 3.00157 7.28261 3.06157 7.34473L5.8537 10.1369L12.5482 3.44238C12.6701 3.32045 12.8355 3.25195 13.008 3.25195C13.1805 3.25195 13.3459 3.32045 13.4678 3.44238Z" fill="#050096"/>
                                          </g>
                                          <defs>
                                          <clipPath id="clip0_1498_426">
                                          <rect width="15.61" height="15.61" fill="white"/>
                                          </clipPath>
                                          </defs>
                                       </svg>
                                       Apply to up to 50 jobs monthly.

                                    </div>
                                    <div className="row-flex item">
                                       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <g clip-path="url(#clip0_1498_426)">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4678 3.44238C13.5898 3.56435 13.6583 3.72975 13.6583 3.90221C13.6583 4.07467 13.5898 4.24007 13.4678 4.36203L6.31353 11.5163C6.19156 11.6383 6.02616 11.7068 5.8537 11.7068C5.68124 11.7068 5.51584 11.6383 5.39387 11.5163L2.14192 8.26438C2.0798 8.20439 2.03025 8.13262 1.99616 8.05327C1.96208 7.97392 1.94413 7.88857 1.94338 7.80221C1.94263 7.71586 1.95909 7.63021 1.99179 7.55028C2.02449 7.47035 2.07279 7.39773 2.13385 7.33667C2.19492 7.2756 2.26754 7.22731 2.34747 7.1946C2.4274 7.1619 2.51304 7.14545 2.5994 7.1462C2.68576 7.14695 2.77111 7.16489 2.85046 7.19897C2.92981 7.23306 3.00157 7.28261 3.06157 7.34473L5.8537 10.1369L12.5482 3.44238C12.6701 3.32045 12.8355 3.25195 13.008 3.25195C13.1805 3.25195 13.3459 3.32045 13.4678 3.44238Z" fill="#050096"/>
                                          </g>
                                          <defs>
                                          <clipPath id="clip0_1498_426">
                                          <rect width="15.61" height="15.61" fill="white"/>
                                          </clipPath>
                                          </defs>
                                       </svg>
                                       Receive detailed job application reports.

                                    </div>
                                    <div className="row-flex item">
                                       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <g clip-path="url(#clip0_1498_426)">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4678 3.44238C13.5898 3.56435 13.6583 3.72975 13.6583 3.90221C13.6583 4.07467 13.5898 4.24007 13.4678 4.36203L6.31353 11.5163C6.19156 11.6383 6.02616 11.7068 5.8537 11.7068C5.68124 11.7068 5.51584 11.6383 5.39387 11.5163L2.14192 8.26438C2.0798 8.20439 2.03025 8.13262 1.99616 8.05327C1.96208 7.97392 1.94413 7.88857 1.94338 7.80221C1.94263 7.71586 1.95909 7.63021 1.99179 7.55028C2.02449 7.47035 2.07279 7.39773 2.13385 7.33667C2.19492 7.2756 2.26754 7.22731 2.34747 7.1946C2.4274 7.1619 2.51304 7.14545 2.5994 7.1462C2.68576 7.14695 2.77111 7.16489 2.85046 7.19897C2.92981 7.23306 3.00157 7.28261 3.06157 7.34473L5.8537 10.1369L12.5482 3.44238C12.6701 3.32045 12.8355 3.25195 13.008 3.25195C13.1805 3.25195 13.3459 3.32045 13.4678 3.44238Z" fill="#050096"/>
                                          </g>
                                          <defs>
                                          <clipPath id="clip0_1498_426">
                                          <rect width="15.61" height="15.61" fill="white"/>
                                          </clipPath>
                                          </defs>
                                       </svg>
                                       Track visibility into all positions applied to.

                                    </div>
                                    <button className="p-buy" onClick={buySubscription}>
                                       Subscribe Now
                                    </button>
                                    
                                 </div>

                              </div>
                           </div>
                        </div>
                        
                     </div>
                     
                     
                     
                     
                  </div>
               </div>
            </div>
            </>
        )}
        
        </>
    )
}
export default TailoredJobSearch
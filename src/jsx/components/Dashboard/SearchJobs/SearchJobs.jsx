import React, { Fragment, useRef, useMemo, useContext } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import { Link } from "react-router-dom";
import { Nav, Tab, Dropdown } from 'react-bootstrap';
import { ThemeContext } from "../../../../context/ThemeContext";
import "./inpageStyles.css";
import LoaderIcon from "../../Dashboard/Home/loading-gif.gif";
import AiGifIcon from "./aiIcon.gif";
import GptIcon from "./aiIcon.gif";
import ListIcon from "./ListIcon.svg";
import PageIcon from "./pageIcon.svg";
import ResumeInsightIcon from "./ResumeInsights.svg";
import InstructionIcon from "./instructionIcon.svg";
import SuggestionIcon from "./SuggestionIcon.svg";
import CopyIcon from "./CopyIcon.svg";
import CheckIcon from "./checkIcon.svg";
import ResumeChooseIcon from "./ResumeChooseIcon.svg";
import ResumeAnimate from "./ResumeIconAnimate.svg"
import FilterComponent from "./Components/filterComponents";
import * as pdfjsLib from "pdfjs-dist";
import CompanyIcon from "./Components/images/companyIcon.png";
import LocationIcon from "./Components/images/LocationIcon.png";
import SearchIcon from "./Components/images/SearchIcon.png";
import TailoredJobSearch from "./Components/tailoredJobSearch";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

import { navtoggle } from "../../../../store/actions/AuthActions";
import { setFileResume, setIsDarkMode, setdetailedJob, setShowPro } from "../../../../store/actions/actions";

import aiAnimationIcon from "../../Dashboard/SearchJobs/aiIcon.gif";
import DownloadIcon from "./DownloadIcon.svg"
//**  Import Single Job Components */
import SingleJob from "./SingleJob";
import ListTab from "./ListTab";
import AiIconInsight from "./AiIconInsight.svg";
import Icons from "../../../layouts/nav/proIcon.svg";
import TailoredJobsToggle from "./Components/TailoredJobsdata";

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

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

const SearchJobs = () => {
   const dispatch = useDispatch();
   const sideMenu = useSelector(state => state.sideMenu);
   const [content, setContent] = useState(null);
   const userEmail = useSelector(state => state.auth.auth.email);
   const logSessionId = useSelector(state => state.auth.auth.global_session_id);
   const { fileResume, isDarkMode, featuresToBlock, apiToken, apiTokenReady, detailedJob } = useSelector((state) => state.profile);
   const { changeBackground } = useContext(ThemeContext);
   const [searchTerm, setSearchTerm] = useState(null);
   const [error, setError] = useState(null);
   const [selectId, setSelectId] = useState(null); // State for 
   const [isLoading, setIsLoading] = useState(false);
   const [daysFilter, setDaysFilter] = useState(null);
   const [jobsList, setJobsList] = useState([]);
   const [stateFilter, setStateFilter] = useState(null);
   const [cityFilter, setCityFilter] = useState(null);
   const [filteredCandidates, setFilteredCandidates] = useState([]);
   const [remoteJobsFilter, setRemoteJobsFilter] = useState(false);
   const [showLoader, setShowLoader] = useState(false);
   const [mobileFilters, setMobileFilters] = useState(false);
   const [subscription, setSubscription] = useState("");
   const [mobileActive, setMobileActive] = useState(false);
   const [loaderAnimation, setLoaderAnimation] = useState(true);
   const [aiCustomResumeTab, setAiCustomResumeTab] = useState(false);
   const [jobTitleFilter, setJobTitleFilter] = useState("");
   const [publisherFilter, setPublisherFilter] = useState("");
   const [employerFilter, setEmployerFilter] = useState("");
   const [autoApply, setAutoApply] = useState(false);
   // Get the user details from localStorage (assuming it's stored under the key "userDetails")
   const storedUserDetails = localStorage.getItem("userDetails");
   const userDetails = JSON.parse(storedUserDetails);

   const isInternBlocked = featuresToBlock.includes("block_intern");
   const isFulltimeBlocked = featuresToBlock.includes("block_intern");
   const isTailoredJobsBlocked = featuresToBlock.includes("block_tailored");
   const isGenResumeBlocked = featuresToBlock.includes("block_genresume");

   const [upgradePro, setUpgradePro] = useState(false);
   const [upgradeVideoPro, setUpgradeVideoPro] = useState(false);
   const [changeText, setChangetext] = useState(false);
   const [jobsReady, setJobsReady] = useState(false);
   const [activeJobId, setActiveJobId] = useState(null);

   function openUpgrade() {
      setUpgradeVideoPro(true);
      setChangetext(true);
   }


   function makePayment() {
      setUpgradePro(false);
      setUpgradeVideoPro(false);
      setChangetext(false);
      dispatch(setShowPro(true));
   }


   useEffect(() => {
      if (apiToken !== '' && userEmail !== '') {
         setSubscription(userDetails.subscription);
         setTimeout(() => {
            setLoaderAnimation(false);
         }, 3000);
      }
   }, [userDetails, apiTokenReady]);
   const apiEndpoint = 'https://us-east1-foursssolutions.cloudfunctions.net/Get_Jobs_From_Database_Comparing_Resume_streaming_v2';
   const handleSearch = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
   }



   function closeMobileFilter() {
      setMobileFilters(!mobileFilters);
   }


   useEffect(() => {
      if (jobsList) {
         setIsLoading(false);
         if (jobsList[0]?.job_id) {
            setActiveJobId(jobsList[0].job_id);
            setContent(jobsList && jobsList && jobsList[0]);
         }

      }
   }, [jobsList])


   // useEffect(() => {
   //    if (userEmail !== '' && apiToken !== '') {
   //       fetchJobsList();
   //    }
   // }, [apiTokenReady]); // Empty dependency array to run the effect only once on mount
   useEffect(() => {
      const fetchInitialData = async () => {
         if (userEmail !== '' && apiToken !== '') {
            setIsLoading(true);

            try {
               await Promise.any([fetchJobsList(), fetchFilenames()])
               console.log('all jobs and filename loaded successfully');

            } catch (error) {
               // If EITHER fetchJobsList or fetchFilenames throws an error, it is caught here.
               console.error("A critical error occurred during the initial load:", error);
               setError("Failed to load initial dashboard data.");
            } finally {
               // 4. Safely turn off the loader only when BOTH tasks are completely finished
               setIsLoading(false);
            }
         }

      }
      fetchInitialData();
   }, [apiTokenReady, userEmail, apiToken])

   const memoizedJobsList = useMemo(() => {
      return jobsList && jobsList && jobsList.length > 0;
   }, [jobsList]);
   const fetchJobsList = async () => {
      if (jobsList.length > 0) {
         // console.log("Jobs List Exists");
         setIsLoading(false);
         return;
      }

      setIsLoading(true);
      try {
         const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${apiToken}`,
            },
            body: JSON.stringify({ email_id: userEmail })
         });

         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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
                        // console.log("Stream complete:", parsedData.message);
                        setJobsReady(true);
                     } else if (parsedData.matches) {
                        newJobs.push(...parsedData.matches);
                     }
                  } catch (err) {
                     console.warn("Error parsing line:", err, line);
                  }
               }
            }

            if (newJobs.length > 0) {
               setJobsList(prevJobs => [...prevJobs, ...newJobs]);
            }
         }
         if (buffer.trim()) {
            try {
               const jsonStr = buffer.startsWith('data: ') ? buffer.slice(6) : buffer;
               const parsedData = JSON.parse(jsonStr);
               if (parsedData.matches) {
                  setJobsList(prevJobs => [...prevJobs, ...parsedData.matches]);
               }
            } catch (err) {
               console.warn("Error parsing final buffer:", err);
            }
         }

         setIsLoading(false);
         if (jobsList.length > 0) {
            setActiveJobId(jobsList[0]?.job_id);
            setContent(jobsList[0]);
         }
      } catch (error) {
         console.error('Error fetching jobs:', error);
         setError(error.message);
         setIsLoading(false);
      }
   };



   // Fething the filenames
   const memoizedfileResume = useMemo(() => {
      return fileResume !== "";
   }, [fileResume])

   const fileApi = "https://us-east1-foursssolutions.cloudfunctions.net/send_resume_details_front_end_v2";

   const fetchFilenames = async () => {
      if (memoizedfileResume) {
         // console.log("File Resume Exists")
         return;
      }
      try {
         const queryObj = {
            emailid: userEmail,
         };

         const response = await fetch(fileApi, {
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

         // Extract file names from the response object
         const filenames = data.file_details.map(file => file.file_name); // Extract all file names
         dispatch(setFileResume(filenames[0])); // Assuming setFilenames is updating state with filenames array
      } catch (error) {
         setError(error.message);
      }
   };

   // // Ensure the fetch is called when userEmail changes
   // useEffect(() => {
   //    if (userEmail !== "" && apiToken !== '') {
   //       fetchFilenames();
   //    };

   // }, [apiTokenReady]);
   const [resumeResponse, setresumeResponse] = useState(null);
   const [resumeAi, setresumeAi] = useState(false);
   const [loading, setLoading] = useState();

   function resumeToggle() {
      if (activeJobId !== null) {
         setresumeAi(!false);
         getResumeUpdates();
      }
   }

   const apiEndpointThree = 'https://us-east1-foursssolutions.cloudfunctions.net/resume_update_suggestions_all_v2';

   const oldResumeUpdates = async () => {
      try {
         if (!userEmail) {
            console.error("User email is not available.");
            return; // Exit if user email is not available
         }
         const queryObj = {
            "email_id": userEmail,
            "file_name": fileResume,
            "job_id": activeJobId,
            "session_id": logSessionId
         };

         const response = await fetch(apiEndpointThree, {
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

         const data = await response.json();
         setresumeResponse(data.result);
         setError(null);

      } catch (error) {
         setError(error.message);
         setLoading(false);
      }
   };

   const [resumeUpdates, setResumeUpdates] = useState([]);
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
                     console.log("jsondata", jsonChunk);

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

   const [resAiloading, setResAiloading] = useState(false);
   const [createResumeOn, setCreateResumeOn] = useState(false);

   const getResumeUpdates = async () => {
      setCreateResumeOn(true);

      setResumeUpdates([]);
      setResAiloading(true);
      try {
         if (!userEmail) {
            console.error("User email is not available.");
            return;
         }
         const queryObj = {
            "email_id": userEmail,
            "file_name": fileResume,
            "job_id": activeJobId
         };

         const response = await fetch("https://resume-update-suggestions-all-v4-980069659423.us-east1.run.app", {
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


         await streamResponseChunks(response);
         setError(null);
         setResAiloading(false);

      } catch (error) {
         setError(error.message);
         setLoading(false);
      }
   };












   const beautifyResumeResponse = (response) => {

      // Function to copy text to clipboard
      const handleCopy = (text) => {
         navigator.clipboard.writeText(text)
            .then(() => {
               alert("Copied to clipboard!");
            })
            .catch((err) => {
               console.error("Failed to copy: ", err);
            });
      };

      if (!response || !response.sections) {
         return <p>No resume suggestions available</p>;
      }

      const { intro_statement, overall_statement, sections } = response;

      return (
         <div className="resumeAiInner">
            {isGenResumeBlocked ? (<>
               <button className="customAiButton" onClick={() => openUpgrade()}>
                  <img src={ResumeChooseIcon} alt="icon" className="resumeAiIcon" />
                  Generate Custom Resume
               </button>
            </>) : (<>
               <button className="customAiButton" onClick={fetchResumeData}>
                  <img src={ResumeChooseIcon} alt="icon" className="resumeAiIcon" />
                  Generate Custom Resume
               </button></>)}

            {intro_statement && (
               <div className="info">
                  <img src={InstructionIcon} alt="" className="instruction-icon" />
                  <p className="instructions">{intro_statement}</p>
               </div>
            )}


            {Array.isArray(sections) && sections.length > 0 ? (
               sections.map((section, index) => {
                  const { job_experience } = section;

                  if (job_experience) {
                     const { company, title, years, points } = job_experience;

                     // Prepare the content to be copied (including company, title, and years)
                     const copyText = `Company: ${company}\nTitle: ${title}\nYears: ${years}\nPoints: ${points.join('\n')}`;

                     return (
                        <div className="card">

                           <div className="d-flex align-items-center justify-content-between card-head">
                              <div className="suggestion-button">
                                 <img src={SuggestionIcon} alt="" className="suggestion-icon" />
                                 Suggestions {index + 0}
                              </div>
                              <button
                                 className="CopyButton"
                                 onClick={() => handleCopy(copyText)}
                              >
                                 <img src={CopyIcon} alt="" className="copyIcon" />
                                 Copy
                              </button>
                           </div>
                           <h5 className="CompanyName">{company}</h5>
                           <div className="jobTitleDate">
                              <h6 className="job-title">{title}</h6>
                              <div className="divider"></div>
                              <h6 className="job-title">{years}</h6>
                           </div>
                           <ul className="list-unstyled">
                              {Array.isArray(points) && points.map((point, idx) => (
                                 <li key={idx} className="mb-2 list-text">
                                    <img src={CheckIcon} alt="" className="checkedIcon" />{point}
                                 </li>
                              ))}
                           </ul>
                           <div className="card-divider"></div>
                        </div>
                     );
                  }
                  return null;
               })
            ) : (
               <p className="text-warning">No experience sections available.</p>
            )}
            {Array.isArray(sections) && sections.length > 0 ? (
               sections.map((section, index) => {
                  const { candidate_skills } = section;

                  if (candidate_skills) {
                     const { soft_skills, tech_stack } = candidate_skills;

                     // Prepare the content to be copied (including company, title, and years)
                     const copyText = `SoftSkills: ${soft_skills}\nTitle: ${tech_stack}}`;

                     return (
                        <>
                           <div className="card">
                              <div className="d-flex align-items-center justify-content-between card-head">
                                 <div className="suggestion-button">
                                    <img src={SuggestionIcon} alt="" className="suggestion-icon" />
                                    Soft Skills
                                 </div>
                                 <button
                                    className="CopyButton"
                                    onClick={() => handleCopy(copyText)}
                                 >
                                    <img src={CopyIcon} alt="" className="copyIcon" />
                                    Copy
                                 </button>
                              </div>
                              {/* <h5 className="CompanyName">{company}</h5>
                                    <div className="jobTitleDate">
                                       <h6 className="job-title">{title}</h6>
                                       <div className="divider"></div>
                                       <h6 className="job-title">{years}</h6>
                                    </div> */}
                              <ul className="list-unstyled">
                                 {Array.isArray(soft_skills) && soft_skills.map((point, idx) => (
                                    <li key={idx} className="mb-2 list-text">
                                       <img src={CheckIcon} alt="" className="checkedIcon" />{point}
                                    </li>
                                 ))}
                              </ul>
                              <div className="card-divider"></div>
                           </div>
                           <div className="card">
                              <div className="d-flex align-items-center justify-content-between card-head">
                                 <div className="suggestion-button">
                                    <img src={SuggestionIcon} alt="" className="suggestion-icon" />
                                    Tech Stacks
                                 </div>
                                 <button
                                    className="CopyButton"
                                    onClick={() => handleCopy(copyText)}
                                 >
                                    <img src={CopyIcon} alt="" className="copyIcon" />
                                    Copy
                                 </button>
                              </div>
                              {/* <h5 className="CompanyName">{company}</h5>
                                    <div className="jobTitleDate">
                                       <h6 className="job-title">{title}</h6>
                                       <div className="divider"></div>
                                       <h6 className="job-title">{years}</h6>
                                    </div> */}
                              <ul className="list-unstyled">
                                 {Array.isArray(tech_stack) && tech_stack.map((point, idx) => (
                                    <li key={idx} className="mb-2 list-text">
                                       <img src={CheckIcon} alt="" className="checkedIcon" />{point}
                                    </li>
                                 ))}
                              </ul>
                              <div className="card-divider"></div>
                           </div>
                        </>
                     );
                  }
                  return null;
               })
            ) : (
               <p className="text-warning">No experience sections available.</p>
            )}


            {overall_statement && (
               <div className="summaryAi">
                  <div className="suggestion-button">
                     <img src={SuggestionIcon} alt="" className="suggestion-icon" />
                     Summary
                  </div>
                  <p>{overall_statement}</p>
               </div>
            )}
         </div>
      );
   };





   function closeResume() {
      setresumeAi(false);
      setresumeResponse(null);
      setAiCustomResumeTab(false);
      setBase64Pdf("");
      setBase64Docx("");
      setResumeFirstAnimate(false);
   }
   function beautifyJobDetails(jobDetails) {
      // Function to convert an array to a bullet point list
      const formatList = (list) => {
         return list.map((item) => `<li>${item}</li>`).join('');
      };

      // Safely extract job_highlights if they exist
      const jobHighlights = jobDetails.job_highlights || {};

      // Extracting relevant details with proper checks
      const qualifications = jobHighlights.Qualifications
         ? formatList(jobHighlights.Qualifications)
         : 'No qualifications provided.';
      const benefits = jobHighlights.Benefits
         ? formatList(jobHighlights.Benefits)
         : 'No benefits provided.';
      const responsibilities = jobHighlights.Responsibilities
         ? formatList(jobHighlights.Responsibilities)
         : 'No responsibilities provided.';

      // Creating formatted sections
      const formattedDetails = `
         <div className="topHead iconText" style="display:flex;align-items: center;flex-direction: row;gap: 8px;justify-content: center; margin-top: 16px;margin-bottom:12px">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M15.625 9.375L13.021 11.979M15.625 9.375V6.25L18.75 3.125V6.25H21.875L18.75 9.375H15.625Z" stroke="#344054" stroke-linecap="round" stroke-linejoin="round"/>
               <path d="M12.844 3.125H12.5C10.6458 3.125 8.83324 3.67483 7.29153 4.70497C5.74982 5.73511 4.54821 7.19929 3.83863 8.91234C3.12906 10.6254 2.94341 12.5104 3.30514 14.329C3.66688 16.1475 4.55976 17.818 5.87088 19.1291C7.182 20.4402 8.85246 21.3331 10.671 21.6949C12.4896 22.0566 14.3746 21.8709 16.0877 21.1614C17.8007 20.4518 19.2649 19.2502 20.295 17.7085C21.3252 16.1668 21.875 14.3542 21.875 12.5V12.1565" stroke="#3C5594" stroke-linecap="round" stroke-linejoin="round"/>
               <path d="M17.6041 13.542C17.4158 14.4639 16.9813 15.3175 16.3467 16.0123C15.7121 16.707 14.9012 17.2169 14.0001 17.4877C13.099 17.7585 12.1414 17.7802 11.2289 17.5504C10.3165 17.3206 9.48335 16.8479 8.81802 16.1826C8.15268 15.5172 7.68 14.6841 7.4502 13.7717C7.2204 12.8592 7.24207 11.9016 7.51289 11.0005C7.78371 10.0994 8.29358 9.28845 8.98832 8.65388C9.68306 8.01931 10.5367 7.58479 11.4586 7.39648" stroke="#3C5594" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <h4 style="margin-top:0px;margin-bottom:0">Qualifications</h4>
         </div>
           <ul>${qualifications}</ul>
           <div className="topHead">
           
           <h4>Benefits</h4>
           </div>
           <ul>${benefits}</ul>
           <div className="topHead">
           <h4>Responsibilities</h4>
           </div>
           <ul>${responsibilities}</ul>
         `;

      return formattedDetails;
   }


   const applyButton = async () => {
      try {
         if (!userEmail) {
            console.error("User email is not available.");
            return; // Exit if user email is not available
         }
         const payloadData = {
            email: userEmail,
            job_id: activeJobId
         };



         // Sending the query to the API
         const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/check_apply_reapply_buttons_v2", {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${apiToken}`,
            },
            body: JSON.stringify({
               "user_email": userEmail,
               "payload": {
                  "email": userEmail,
                  "job_id": activeJobId
               },
               "function_name": "clicked on Apply now",
               "insert_log": true
            })  // Send query in the body as JSON
         });

         // Handling the response
         if (!response.ok) {
            throw new Error('Failed to send data to the server');
         }

         const data = await response.json();
         // console.log('Response:', data);
         checkJobApplied();

      } catch (error) {
         console.error('Error:', error.message);
      }
   };

   const [buttonText, setButtonText] = useState('Apply');

   const checkJobApplied = async () => {
      try {
         if (!userEmail) {
            console.error("User email is not available.");
            return; // Exit if user email is not available
         }
         const appliedResponse = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/check_apply_reapply_buttons_v2', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${apiToken}`,
            },
            body: JSON.stringify({
               user_email: userEmail,
               job_id: activeJobId,
            }),
         });

         if (!appliedResponse.ok) {
            throw new Error('Failed to check job application status');
         }

         const data = await appliedResponse.json();
         //  console.log('Job active at api:',activeJobId);
         setButtonText(data.result === 'Reapply Button' ? 'Reapply' : 'Apply');

      } catch (error) {
         console.error('Error checking apply status:', error);
      }
   };

   useEffect(() => {
      if (activeJobId && userEmail !== '' && apiToken !== '') {
         checkJobApplied();
      }
   }, [activeJobId, userEmail, resumeAi, apiTokenReady]);


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
      // console.log("Toggled theme to:", !isDarkMode ? "Dark" : "Light");
   };
   const [employmentFilter, setEmploymentFilter] = useState("");
   const [contractorFilter, setContractorFilter] = useState("");
   const [fulltimeFilter, setFulltimeFilter] = useState("");
   const [internshipFilter, setInternshipFilter] = useState("");
   const [recentJobsFilter, setRecentJobsFilter] = useState(false);


   const [currentPage, setCurrentPage] = useState(1);
   const totalPages = Math.ceil(filteredCandidates?.length / 8);


   const [resumeData, setResumeData] = useState(null);
   // const [isLoading, setIsLoading] = useState(false);


   const [base64Pdf, setBase64Pdf] = useState("");
   const [base64Docx, setBase64Docx] = useState("");
   const [fileNamePdf, setFileNamePdf] = useState("");
   const [fileNameDocx, setFileNameDocx] = useState("");
   const [createResumeClicked, setCreateResumeClicked] = useState(false);

   useEffect(() => {
      if (createResumeClicked) {
         fetchResumeData();
         setCreateResumeClicked(false);
      }
   }, [createResumeClicked])


   const fetchResumeData = async () => {
      setAiCustomResumeTab(true);
      //   setIsLoading(true);
      setResumeFirst(true);
      try {
         const response = await fetch(
            "https://us-east1-foursssolutions.cloudfunctions.net/create_pdf_from_resume_suggestions_v2",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(
                  {
                     "email_id": userEmail,
                     "suggestions": resumeResponse
                  }
               ),
            }
         );

         if (!response.ok) throw new Error("Failed to fetch resume suggestions");

         const data = await response.json();
         setBase64Pdf(data.base64_pdf);
         setBase64Docx(data.base64_docx);
         setFileNamePdf(data.file_name);
         setFileNameDocx(data.file_name);
         setResumeFirstAnimate(true)

         setIsLoading(false);
         //  console.log("resumeData", resumeData);
      } catch (error) {
         console.error("Error fetching resume data:", error);
         setIsLoading(false);
      }
   };

   const now = new Date();
   const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
   const day = String(now.getDate()).padStart(2, '0');
   const year = now.getFullYear();
   const hours = String(now.getHours()).padStart(2, '0');
   const minutes = String(now.getMinutes()).padStart(2, '0');
   const seconds = String(now.getSeconds()).padStart(2, '0');
   const currentDateTime = `${month}-${day}-${year}_${hours}-${minutes}-${seconds}`;


   // Function to download PDF
   const DownloadPdf = () => {
      if (!base64Pdf) {
         alert("No PDF data available!");
         return;
      }

      // Convert Base64 to Blob
      const byteCharacters = atob(base64Pdf);
      const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileNamePdf.replace(".docx", "")}_${currentDateTime}.pdf`;
      link.click();

      // Clean up
      URL.revokeObjectURL(link.href);
   };

   // Function to download DOCX
   const DownloadDocx = () => {
      if (!base64Docx) {
         alert("No DOCX data available!");
         return;
      }

      // Convert Base64 to Blob
      const byteCharacters = atob(base64Docx);
      const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileNamePdf.replace(".docx", "")}_${currentDateTime}.docx`;
      link.click();

      // Clean up
      URL.revokeObjectURL(link.href);
   };

   const [resumeFirst, setResumeFirst] = useState(false);
   const [resumeFirstAnimate, setResumeFirstAnimate] = useState(false);

   function recentUncheck() {
      // console.log(recentJobsFilter);

      if (recentJobsFilter !== false) {
         // window.location.reload();
      }

   }




   return (
      <Fragment>

         <div className="row search-Jobs-Container">
            <div className="col-xl-8 col-xxl-8">
               <div className="row">
                  <div className="col-xl-12 col-xxl-12 col-sm-12 search-column">
                     <div className="topFilters ">
                        <div className="searchFilter">
                           <input
                              className="search-Input"
                              type="text"
                              placeholder="Search by Title, Company or any jobs keyword..."
                              value={searchTerm}
                              onChange={handleSearch}
                           />
                           <img src={SearchIcon} alt="search-icon" className="searchIcon" />

                        </div>
                        <div className="widthDivider">
                        </div>
                        <div className="sortFilters">
                           <label>
                              <input
                                 type="checkbox"
                                 className="form-check-input"
                                 checked={recentJobsFilter}
                                 onChange={(e) => {
                                    setRecentJobsFilter(e.target.checked);
                                    // console.log("Recent Jobs Filter toggled:", e.target.checked);


                                    recentUncheck();
                                 }}
                              />
                              Recent Jobs
                           </label>
                        </div>
                     </div>
                  </div>
               </div>
               <FilterComponent filteredCandidates={filteredCandidates} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} isInternBlocked={isInternBlocked} internshipFilter={internshipFilter} setInternshipFilter={setInternshipFilter} fulltimeFilter={fulltimeFilter} isFulltimeBlocked={isFulltimeBlocked} setFulltimeFilter={setFulltimeFilter} contractorFilter={contractorFilter} setContractorFilter={setContractorFilter} remoteJobsFilter={remoteJobsFilter} setRemoteJobsFilter={setRemoteJobsFilter} daysFilter={daysFilter} setDaysFilter={setDaysFilter} stateFilter={stateFilter} setStateFilter={setStateFilter} jobsList={jobsList} jobTitleFilter={jobTitleFilter} setJobTitleFilter={setJobTitleFilter} publisherFilter={publisherFilter} setPublisherFilter={setPublisherFilter} employerFilter={employerFilter} setEmployerFilter={setEmployerFilter} upgradePro={upgradePro} setUpgradePro={setUpgradePro} />


               <Tab.Container defaultActiveKey={'list'}>

                  <Tab.Content className="content-list jobs-list-outer">
                     {/* <Tab.Pane eventKey={'grid'}>

                        <SingleJob jobsList={jobsList} setJobsList={setJobsList} content={content} setContent={setContent} error={error} setError={setError} selectId={selectId} setSelectId={setSelectId} activeJobId={activeJobId} setActiveJobId={setActiveJobId} isDarkMode={isDarkMode} setMobileActive={setMobileActive} currentPage={currentPage} setCurrentPage={setCurrentPage} ></SingleJob>

                     </Tab.Pane> */}
                     <Tab.Pane eventKey={'list'}>
                        <ListTab jobsList={jobsList} autoApply={autoApply} setAutoApply={setAutoApply} setJobsList={setJobsList} content={content} setContent={setContent} error={error} setError={setError} selectId={selectId} setSelectId={setSelectId} activeJobId={activeJobId} setActiveJobId={setActiveJobId} isLoading={isLoading} setIsLoading={setIsLoading} searchTerm={searchTerm} setSearchTerm={setSearchTerm} buttonText={buttonText} daysFilter={daysFilter} setDaysFilter={setDaysFilter} stateFilter={stateFilter} setStateFilter={setStateFilter} cityFilter={cityFilter} setCityFilter={setCityFilter} filteredCandidates={filteredCandidates} setFilteredCandidates={setFilteredCandidates} remoteJobsFilter={remoteJobsFilter} setRemoteJobsFilter={setRemoteJobsFilter} employmentFilter={employmentFilter} setEmploymentFilter={setEmploymentFilter} internshipFilter={internshipFilter} fulltimeFilter={fulltimeFilter} contractorFilter={contractorFilter} isDarkMode={isDarkMode} setMobileActive={setMobileActive} currentPage={currentPage} setCurrentPage={setCurrentPage} recentJobsFilter={recentJobsFilter} setRecentJobsFilter={setRecentJobsFilter} resumeToggle={resumeToggle} jobTitleFilter={jobTitleFilter} setJobTitleFilter={setJobTitleFilter} publisherFilter={publisherFilter} setPublisherFilter={setPublisherFilter} employerFilter={employerFilter} setEmployerFilter={setEmployerFilter} setLoaderAnimation={setLoaderAnimation} />
                     </Tab.Pane>
                  </Tab.Content>
               </Tab.Container>
            </div>
            {mobileActive && (
               <div className="mobile-cont">
                  <div className="close-button" onClick={() => setMobileActive(false)}>
                     +
                  </div>
                  <div className="col-xl-3 col-xxl-3">
                     <div className="row content-detail">
                        <div className="col-xl-12">
                           {content ? (
                              <div className="card d-sm-flex flex-xl-column flex-sm-row resAi">
                                 {resumeAi && (
                                    <div className={`resumeOuter ${isDarkMode === false ? "light" : "dark"}`}>
                                       <div className="resumeTab">
                                          <div className="close" onClick={closeResume}>+</div>
                                          <h5 className="fs-18 border-bottom text-black font-w600 mb-3">
                                             Resume Insights
                                          </h5>
                                          <div className="fwline"></div>
                                          <div className={`responseContainer ${resumeResponse == null ? "loading" : ""}`}>
                                             {resumeResponse == null ? (<div className="loader-icon"><img src={AiGifIcon} alt="image" /><span className="text-center">"Almost there! Our AI is reviewing your resume and the job description to highlight key skills and experience.

                                             </span><span className="text-center">Use these insights to boost your profile—just add them to your resume if you have the experience, no re-upload needed! Perfect for client projects or job apps. Stay tuned!" </span> </div>) : beautifyResumeResponse(resumeResponse)}
                                          </div>
                                       </div>
                                    </div>
                                 )}
                                 <div className="card-body border-bottom text-center col-xl-12 col-sm-6">
                                    <svg
                                       className="mb-4 description-image"
                                       width="134"
                                       height="134"
                                       viewBox="0 0 134 134"
                                       fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                    >
                                       <path
                                          d="M0 19.4909C0 8.72638 8.72638 0 19.4909 0H114.509C125.274 0 134 8.72638 134 19.4909V114.509C134 125.274 125.274 134 114.509 134H19.4909C8.72638 134 0 125.274 0 114.509V19.4909Z"
                                          fill="#D3D3D3"
                                       />
                                       <path
                                          d="M0 19.4909C0 8.72638 8.72638 0 19.4909 0H114.509C125.274 0 134 8.72638 134 19.4909V114.509C134 125.274 125.274 134 114.509 134H19.4909C8.72638 134 0 125.274 0 114.509V19.4909Z"
                                          fill="#40C7CF"
                                       />
                                       <path
                                          d="M34.5414 34.5417C38.7631 30.32 43.7751 26.9711 49.291 24.6863C54.807 22.4015 60.719 21.2255 66.6895 21.2255C72.6599 21.2255 78.5719 22.4015 84.0879 24.6863C89.6039 26.9711 94.6158 30.32 98.8376 34.5417C103.059 38.7635 106.408 43.7754 108.693 49.2914C110.978 54.8074 112.154 60.7194 112.154 66.6898C112.154 72.6603 110.978 78.5723 108.693 84.0882C106.408 89.6042 103.059 94.6162 98.8376 98.8379L82.7635 82.7639C84.8744 80.653 86.5488 78.147 87.6912 75.389C88.8336 72.631 89.4216 69.675 89.4216 66.6898C89.4216 63.7046 88.8336 60.7486 87.6912 57.9906C86.5488 55.2326 84.8744 52.7266 82.7635 50.6158C80.6526 48.5049 78.1467 46.8304 75.3887 45.6881C72.6307 44.5457 69.6747 43.9577 66.6895 43.9577C63.7042 43.9577 60.7482 44.5457 57.9902 45.6881C55.2323 46.8305 52.7263 48.5049 50.6154 50.6158L34.5414 34.5417Z"
                                          fill="#8FD7FF"
                                       />
                                       <path
                                          d="M34.5413 98.8379C26.0151 90.3117 21.2252 78.7477 21.2252 66.6898C21.2252 54.6319 26.0151 43.0679 34.5413 34.5417C43.0675 26.0155 54.6316 21.2255 66.6894 21.2255C78.7473 21.2255 90.3113 26.0155 98.8375 34.5417L82.7635 50.6158C78.5004 46.3527 72.7184 43.9577 66.6894 43.9577C60.6605 43.9577 54.8785 46.3527 50.6154 50.6158C46.3523 54.8789 43.9573 60.6609 43.9573 66.6898C43.9573 72.7188 46.3523 78.5008 50.6154 82.7639L34.5413 98.8379Z"
                                          fill="white"
                                       />
                                    </svg>
                                    <h4 className="fs-22 text-black font-w600 mb-1">
                                       {content.job_title}
                                    </h4>
                                    <p className="employer-det">{content.employer_name}</p>
                                    <Link
                                       to={`${content.job_apply_link}`}
                                       target='_blank'
                                       className="btn btn-outline-primary d-block btn-rounded"
                                       onClick={applyButton}
                                    >
                                       {buttonText}
                                    </Link>
                                    <Link
                                       style={{ marginTop: '10px' }}
                                       onClick={resumeToggle}
                                       className="btn btn-outline-primary d-block btn-rounded"
                                    >
                                       Resume Insights
                                    </Link>

                                 </div>
                                 <div className="card-body col-xl-12 col-sm-6 border-left ">
                                    <h5 className="head text-black font-w600 mb-2">
                                       Job Description
                                    </h5>
                                    <p className="fs-15 job-decription" dangerouslySetInnerHTML={{ __html: beautifyJobDetails(content) }}>

                                    </p>
                                    <div className="d-flex justify-content-between flex-wrap pt-3">

                                    </div>
                                 </div>
                              </div>

                           ) : (
                              <div className="card facade-outer d-sm-flex flex-xl-column flex-sm-row">
                                 <div className="facade"></div>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            )}
            <div className="col-xl-4 col-xxl-4 desktop">
               <div className="row content-detail">
                  <div className="col-xl-12">
                     {content ? (
                        <>
                           <div className="card detailedJob top-card d-sm-flex flex-xl-column flex-sm-row resAi">
                              {resumeAi && (
                                 <div className={`tailoredJobsPopup resumeAi light`}>
                                    {resAiloading && (
                                       <>
                                          <div className="bgloader">
                                             <div className="loader-icon"><img src={AiGifIcon} alt="image" /></div>
                                          </div>
                                       </>
                                    )}
                                    <div className="tjobsPopup">
                                       <div className="closeNew" onClick={closeResume}>+</div>
                                       <div className="t-head">
                                          <img src={ResumeInsightIcon} alt="" className="icon" />
                                          <h4 className="head">
                                             AI Resume Insights
                                          </h4>
                                       </div>
                                       <div className="dividerLine"></div>
                                       <div className="resumeAiInner t-jobsContent">

                                          {aiCustomResumeTab === true ?
                                             (
                                                <>
                                                   <div className={`responseContainer ${resumeResponse == null ? "loading" : ""}`}>
                                                      <div className="customResumeComp">
                                                         {resumeFirst && (
                                                            <div className="animation-box">
                                                               <div className="resume-upload-animation">
                                                                  {resumeFirstAnimate === true ? (<></>) : (<>
                                                                     <div className={`local-animation ${resumeFirstAnimate === true ? "active" : ""}`}>
                                                                        <img src={ResumeAnimate} alt="localAnimation" className="local-img" />
                                                                     </div>
                                                                     <div className="ai-animation">
                                                                        <img src={aiAnimationIcon} alt="aiAnimation" className="ai-img" />
                                                                     </div>
                                                                  </>)}

                                                                  <div className={`ai-server  ${resumeFirstAnimate === true ? "active" : ""}`}>
                                                                     <img src={DownloadIcon} alt="aiAnimation" className="server-img" />
                                                                  </div>
                                                               </div>
                                                               {resumeFirstAnimate === true ? (<></>) : (<>
                                                                  <div className={`progress-outer ${resumeFirstAnimate === true ? "active" : ""}`}>
                                                                     <div className="left-dot">

                                                                     </div>
                                                                     <div className="right-dot">

                                                                     </div>
                                                                     <div className="progress-inner"></div>
                                                                  </div>
                                                               </>)}
                                                               <div className="animation text">
                                                                  <span className="">
                                                                     {resumeFirstAnimate === true ? "Your resume is ready to download" : "CareerSavvy is generating your custom resume"}
                                                                  </span>
                                                                  <div className="animation-line"></div>
                                                               </div>
                                                            </div>
                                                         )}
                                                         {resumeFirstAnimate === true && (
                                                            <div className="buttonRow">

                                                               <button onClick={DownloadPdf} > Download Pdf</button>
                                                               <button onClick={DownloadDocx} > Download Docx</button>
                                                            </div>
                                                         )}
                                                      </div>

                                                   </div>

                                                </>
                                             ) : (
                                                <>
                                                   <TailoredJobsToggle resumeUpdates={resumeUpdates} resumeResponse={resumeResponse} setresumeResponse={setresumeResponse} createResumeClicked={createResumeClicked} setCreateResumeClicked={setCreateResumeClicked} createResumeOn={createResumeOn} setCreateResumeOn={setCreateResumeOn} />

                                                </>
                                             )
                                          }
                                       </div>

                                    </div>
                                 </div>
                              )}
                              <div className="card-body border-bottom text-center col-xl-12 col-sm-6">
                                 <div className="detailedTop row-flex">
                                    <div className="detailedInfo col-flex">
                                       <h4 className="fs-20 text-black font-w600 mb-1">
                                          {content.job_title}
                                       </h4>
                                       <div className='row-flex jobCompntype'>
                                          <span>{content.employer_name}</span>
                                          <div className='widthDivider'></div>
                                          <span>{content.job_is_remote ? "Remote" : "Onsite"}</span>
                                          <div className='widthDivider'></div>
                                          <span>{content.job_employment_type}</span>
                                       </div>
                                       <div className='row-flex PostLocTime'>
                                          <div className='posted row-flex'>
                                             <img src={CompanyIcon} alt="posted" />
                                             <span>{content.job_publisher}</span>
                                          </div>
                                          <div className='widthDivider'></div>
                                          <div className='posted row-flex'>
                                             <img src={LocationIcon} alt="posted" />
                                             <span>{content.job_city}, {content.job_state}, {content.job_country}</span>
                                          </div>
                                       </div>

                                    </div>
                                    <div className="col-flex icons">
                                       <svg
                                          className="mb-3 description-image"
                                          width="134"
                                          height="134"
                                          viewBox="0 0 134 134"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                       >
                                          <path
                                             d="M0 19.4909C0 8.72638 8.72638 0 19.4909 0H114.509C125.274 0 134 8.72638 134 19.4909V114.509C134 125.274 125.274 134 114.509 134H19.4909C8.72638 134 0 125.274 0 114.509V19.4909Z"
                                             fill="#D3D3D3"
                                          />
                                          <path
                                             d="M0 19.4909C0 8.72638 8.72638 0 19.4909 0H114.509C125.274 0 134 8.72638 134 19.4909V114.509C134 125.274 125.274 134 114.509 134H19.4909C8.72638 134 0 125.274 0 114.509V19.4909Z"
                                             fill="#40C7CF"
                                          />
                                          <path
                                             d="M34.5414 34.5417C38.7631 30.32 43.7751 26.9711 49.291 24.6863C54.807 22.4015 60.719 21.2255 66.6895 21.2255C72.6599 21.2255 78.5719 22.4015 84.0879 24.6863C89.6039 26.9711 94.6158 30.32 98.8376 34.5417C103.059 38.7635 106.408 43.7754 108.693 49.2914C110.978 54.8074 112.154 60.7194 112.154 66.6898C112.154 72.6603 110.978 78.5723 108.693 84.0882C106.408 89.6042 103.059 94.6162 98.8376 98.8379L82.7635 82.7639C84.8744 80.653 86.5488 78.147 87.6912 75.389C88.8336 72.631 89.4216 69.675 89.4216 66.6898C89.4216 63.7046 88.8336 60.7486 87.6912 57.9906C86.5488 55.2326 84.8744 52.7266 82.7635 50.6158C80.6526 48.5049 78.1467 46.8304 75.3887 45.6881C72.6307 44.5457 69.6747 43.9577 66.6895 43.9577C63.7042 43.9577 60.7482 44.5457 57.9902 45.6881C55.2323 46.8305 52.7263 48.5049 50.6154 50.6158L34.5414 34.5417Z"
                                             fill="#8FD7FF"
                                          />
                                          <path
                                             d="M34.5413 98.8379C26.0151 90.3117 21.2252 78.7477 21.2252 66.6898C21.2252 54.6319 26.0151 43.0679 34.5413 34.5417C43.0675 26.0155 54.6316 21.2255 66.6894 21.2255C78.7473 21.2255 90.3113 26.0155 98.8375 34.5417L82.7635 50.6158C78.5004 46.3527 72.7184 43.9577 66.6894 43.9577C60.6605 43.9577 54.8785 46.3527 50.6154 50.6158C46.3523 54.8789 43.9573 60.6609 43.9573 66.6898C43.9573 72.7188 46.3523 78.5008 50.6154 82.7639L34.5413 98.8379Z"
                                             fill="white"
                                          />
                                       </svg>
                                    </div>
                                 </div>
                                 <div className="heightDivider"></div>


                                 <div className="row-flex button-box">

                                    <Link
                                       to={`${content.job_apply_link}`}
                                       target='_blank'
                                       className="btn btn-outline-primary d-block btn-rounded applyButton"
                                       onClick={applyButton}
                                    >
                                       {buttonText}
                                    </Link>
                                    <Link
                                       onClick={resumeToggle}
                                       className="Ai-Insights-Button"
                                    >
                                       <img src={AiIconInsight} alt="aiicon" className="icon" />
                                       AI Resume
                                    </Link>
                                 </div>


                              </div>
                           </div>
                           <div className="card detailedJob bot-card d-sm-flex flex-xl-column flex-sm-row resAi">
                              <div className="card-body col-xl-12 col-sm-6 border-left ">
                                 <div className="topHead">
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M9.74984 19.4997H16.2498M16.2498 18.4163C16.2498 15.1663 20.5832 12.9997 20.5832 8.66634C20.5832 4.33301 17.3332 1.08301 12.9998 1.08301C8.6665 1.08301 5.4165 4.33301 5.4165 8.66634C5.4165 12.9997 9.74984 15.1663 9.74984 18.4163V21.6663C9.74984 23.833 10.8332 24.9163 12.9998 24.9163C15.1665 24.9163 16.2498 23.833 16.2498 21.6663V18.4163Z" stroke="#40189D" stroke-width="2" />
                                    </svg>
                                    <h5 className="head text-black font-w600">
                                       Job Description
                                    </h5>
                                 </div>

                                 <div className="heightDivider"></div>
                                 <p className="fs-15 job-decription" dangerouslySetInnerHTML={{ __html: beautifyJobDetails(content) }}>

                                 </p>
                                 <div className="d-flex justify-content-between flex-wrap pt-3">

                                 </div>
                              </div>
                           </div>
                        </>

                     ) : (
                        <div className="card facade-outer d-sm-flex flex-xl-column flex-sm-row">
                           <div className="facade"></div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
            <TailoredJobSearch userEmail={userEmail} apiToken={apiToken} fetchResumeData={fetchResumeData} autoApply={autoApply} setAutoApply={setAutoApply} upgradeVideoPro={upgradeVideoPro} setUpgradeVideoPro={setUpgradeVideoPro} isTailoredJobsBlocked={isTailoredJobsBlocked} createResumeOn={createResumeOn} setCreateResumeOn={setCreateResumeOn} resumeResponse={resumeResponse} setresumeResponse={setresumeResponse} />
         </div>
         <div
            onClick={toggleTheme}
            style={{
               cursor: "pointer",
               padding: "10px",
               backgroundColor: "#ddd",
               display: "none",
               borderRadius: "50%",
               position: "fixed",
               top: "50%",
               right: "0",
            }}
         >
            {isDarkMode ? <MoonIcon /> : <SunIcon />}
         </div>
         {showLoader && (
            <div className="checkout-loader">
               <img src={LoaderIcon} alt="loader" />
            </div>
         )}
         {upgradePro && (
            <div className={`pro-bg ${isDarkMode === false ? "dark" : "Light"}`}>
               <div className="pro-container small">
                  <div className="pro-header flex-row">
                     <img src={Icons} className="icon" alt="pro-icon" />
                     <span>Upgrade To Pro</span>
                     <div className="close" onClick={() => setUpgradePro(false)}>+</div>
                  </div>
                  <div className="upgrade-description">
                     Upgrade to Pro to access these features and reach your career goals faster with the help of CareerSavvy!
                  </div>
                  <div className="upgrade-button" onClick={makePayment}>
                     Upgrade Now
                  </div>
               </div>
            </div>
         )}
         {upgradeVideoPro && (
            <div className={`pro-bg ${isDarkMode === false ? "dark" : "Light"}`}>
               <div className="pro-container small video">
                  <div className="pro-header flex-row">
                     <img src={Icons} className="icon" alt="pro-icon" />
                     <span>Upgrade To Pro</span>
                     <div className="close" onClick={() => { setUpgradeVideoPro(false); setChangetext(false) }}>+</div>
                  </div>
                  <div className="upgrade-description">
                     {changeText ? "Upgrade to Pro to unlock AI Resume Insights and Generate Custom Resume for your dream job! Learn more about Pro features:" : "Upgrade to Pro to unlock the Analyze Match feature and accelerate your job search with CareerSavvy! Learn more about Pro features:"}
                  </div>
                  <iframe width="360" height="165" src="https://www.youtube.com/embed/Nkl5TiWo6Bs?si=Ued5SnlPG40K6uSf" style={{ width: "100%", height: "auto" }} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  <div className="upgrade-button" onClick={makePayment}>
                     Upgrade Now
                  </div>
               </div>
            </div>
         )}
         {mobileFilters && (
            <div className="mobile-filters-popup">
               <div className="d-flex pb-3 mb-4 border-bottom flex-wrap align-items-center">
                  <div className="me-auto mb-2 pr-2">
                     <h6 className="text-black fs-16 font-w600 mb-1">
                        Select Filters
                     </h6>
                     <span className="fs-14">Choose Your preferences</span>
                  </div>
                  <button className="btn btn-primary light btn-rounded me-0 mb-2 btn-sm" onClick={closeMobileFilter}>
                     <svg className="scale5" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3H14C15.1 3 16 3.9 16 5V8L20 13V15H14V18L10 21V15H4V13L8 8V5C8 3.9 8.9 3 10 3Z" fill="white" />
                     </svg>
                  </button>
               </div>
               <div className="d-flex pb-3 mb-4 border-bottom flex-wrap align-items-center">
                  <select
                     className="btn btn-primary light btn-rounded me-2 mb-2 btn-sm select"
                     placeholder="Filter Days"
                     value={daysFilter}
                     onChange={(e) => setDaysFilter(e.target.value)}
                  >
                     <option value="">Filter Days</option>
                     <option value="24 hours">24 Hours</option>
                     <option value="last 3 days">Last 3 Days</option>
                     <option value="last 7 days">Last 7 Days</option>
                  </select>

                  <select
                     className="btn btn-primary light btn-rounded me-2 mb-2 btn-sm select"
                     placeholder="Filter State"
                     value={stateFilter}
                     onChange={(e) => setStateFilter(e.target.value)}
                  >
                     <option value="">Filter State</option>
                     {[...new Set(jobsList?.matches?.map(item => item.job_state))]
                        .map((state, index) => (
                           <option key={`state-${index}`} value={state}>{state}</option>
                        ))}
                  </select>


                  <select
                     className="btn btn-primary light btn-rounded me-0 mb-2 btn-sm select"
                     placeholder="Filter City"
                     value={cityFilter}
                     onChange={(e) => setCityFilter(e.target.value)}
                  >
                     <option value="">Filter City</option>
                     {[...new Set(jobsList?.matches?.map(item => item.job_city))]
                        .map((city, index) => (
                           <option key={`city-${index}`} value={city}>{city}</option>
                        ))}
                  </select>

                  <div className="form-check check-switch custom-checkbox me-4 mb-2">
                     <input
                        type="checkbox"
                        className="form-check-input"
                        id="customCheckRemote"
                        checked={internshipFilter}
                        onChange={(e) => setInternshipFilter(e.target.checked)}
                     />
                     <label className="form-check-label" htmlFor="customCheckRemote">
                        Internship
                     </label>
                  </div>
                  <div className="form-check check-switch custom-checkbox me-4 mb-2">
                     <input
                        type="checkbox"
                        className="form-check-input"
                        id="customCheckRemote"
                        checked={fulltimeFilter}
                        onChange={(e) => setFulltimeFilter(e.target.checked)}
                     />
                     <label className="form-check-label" htmlFor="customCheckRemote">
                        Full Time
                     </label>
                  </div>
                  <div className="form-check check-switch custom-checkbox me-4 mb-2">
                     <input
                        type="checkbox"
                        className="form-check-input"
                        id="customCheckRemote"
                        checked={contractorFilter}
                        onChange={(e) => setContractorFilter(e.target.checked)}
                     />
                     <label className="form-check-label" htmlFor="customCheckRemote">
                        Contractor
                     </label>
                  </div>
                  <div className="form-check check-switch custom-checkbox me-auto mb-2">
                     <input
                        type="checkbox"
                        className="form-check-input"
                        id="customCheckRemote"
                        checked={remoteJobsFilter}
                        onChange={(e) => setRemoteJobsFilter(e.target.checked)}
                     />
                     <label className="form-check-label" htmlFor="customCheckRemote">
                        Remote
                     </label>
                  </div>
               </div>
            </div>
         )}
         {loaderAnimation && (
            <div className="LoaderAnimation">
               <div className="gptAnimate"></div>
               <img className="gptIcon" src={GptIcon} alt="gptIcon" />
            </div>
         )}
      </Fragment>
   );
};

export default SearchJobs;

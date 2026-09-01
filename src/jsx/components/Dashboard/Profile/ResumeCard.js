import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, ListGroup } from "react-bootstrap";
import { Logout } from '../../../../store/actions/AuthActions';
import { setProfileData, setTechSkills, setFileResume, setJobsList, setJobsApplied } from "../../../../store/actions/actions";
  
import localAnimationIcon from "../../../../images/animation/localAnimationIcon.svg";

import aiAnimationIcon from "../../Dashboard/SearchJobs/aiIcon.gif";
import ServerIcon from "../../../../images/animation/serverIcon.svg";
import resumeScreen from "../../../../images/animation/resumeScreen.svg";
import AnalyzeIcon from "../../../../images/animation/analyzeIcon.svg";
import VideoIcon from "../../Forms/ResumeUpload/video.svg"
const ResumeCard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const userEmail = useSelector((state) => state.auth.auth.email);
  const [showReminder, setShowReminder] = useState(false);
  const [resumeReady, setResumeReady] = useState(false);
  const [resumeWatch, setResumeWatch] = useState(false);
  const [resumeFirst, setResumeFirst] = useState(false);
  const [resumeFirstAnimate, setResumeFirstAnimate] = useState(false);
  const [resumeSecond, setResumeSecond] = useState(false);
  const [resumeThird, setResumeThird] = useState(false);
  
  const { apiToken, apiTokenReady } = useSelector(state => state.profile);
  const [chosenFiles, setChosenFiles] = useState([]);
  const [fileResume, setFileResume] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const apiEndpoint =
    "https://us-east1-foursssolutions.cloudfunctions.net/send_resume_details_front_end_v2";

    const fetchFilenames = async () => {
      try {
        const queryObj = {
          "emailid": `${userEmail}`
    }

        const response = await fetch(apiEndpoint, {
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
        const extractedFilenames = data.file_details.map((file) => file.file_name);

        dispatch(setFileResume(extractedFilenames));
        console.log("bottom",fileResume);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    if (userEmail!=='' && apiToken!=='') {
      fetchFilenames();
    }
  }, [apiTokenReady]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setChosenFiles((prevFiles) => [...prevFiles, selectedFile]);
    setFile(selectedFile); // Save the selected file for upload
  };

  
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }
  
    setLoading(true);
    
    showReminderClicked();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email_id", userEmail);
  
    try {
      const response = await fetch(
        "https://us-east1-foursssolutions.cloudfunctions.net/Resume_upload_bucket_store_in_table_v2",
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await response.json();
      setMessage(data.Message);
      setFile(null); // Clear selected file
      setChosenFiles([]); // Clear chosen files list
      dispatch(setJobsList([]));
      dispatch(setJobsApplied([]));
      fetchFilenames();
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while uploading the file.");
    } finally {
      setLoading(false);
    }
  };
  function remConfirm () {
    dispatch(Logout(navigate));
  }
 
  const [countdown, setCountdown] = useState(5);
     const [isCounting, setIsCounting] = useState(false);
 
  useEffect(() => {
    let timer;
    if (isCounting && countdown > 0) {
        timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
    }
 
    // Cleanup the timer when the countdown is complete or the component unmounts
    if (countdown === 0) {
        clearInterval(timer);
        setIsCounting(false); // Reset counting state
        // You can also redirect or perform another action here
    }
 
    return () => clearInterval(timer);
 }, [isCounting, countdown]);


 function showReminderClicked() {
       setShowReminder(true);
       setTimeout(()=>{
          setResumeWatch(true);
          setTimeout(()=>{
            setResumeWatch(false);
         },5200);
       },100);
       setTimeout(()=>{
          setResumeFirst(true);
          setTimeout(()=>{
             setResumeFirstAnimate(true);
          },6500);
       },5300);
       setTimeout(()=>{
          setResumeFirst(false);
          setResumeSecond(true);
       },20000);
       setTimeout(()=>{
          setResumeSecond(false);
          setResumeThird(true);
       },40000);
       setTimeout(()=>{
          setResumeThird(false);
          setResumeReady(true);
          setIsCounting(true);
          setCountdown(5);
          setTimeout(() => {
             dispatch(Logout(navigate));
          }, 6000);
       },70000);
 
       
          
     }

     function watchVideo() {
      window.open("https://www.youtube.com/watch?v=Nkl5TiWo6Bs", "_blank");
    }
   
  
    return (
        <>
        <div className="mb-3" style={{ background: "transparent"}}>
            <label htmlFor="formFile" className="form-label" style={{ fontSize: "14px"}}>
                Choose and Upload Resume
            </label>
            <input
                className="form-control"
                type="file"
                id="formFile"
                style={{ fontSize: "14px"}}
                onChange={handleFileChange}
            />
        </div>
        <div className="basic-list-group" style={{ background: "transparent"}}>
                {chosenFiles?.length > 0 && <span style={{ fontSize: "14px"}}>Your Chosen Files</span>}
                {chosenFiles?.length > 0 && (
                  <ListGroup as="ul">
                    {chosenFiles.map((file, i) => (
                      <ListGroup.Item
                        key={i}
                        as="li"
                        style={{ margin: "10px 0 25px 0", fontSize: "14px" }}
                        active
                      >
                        {file?.name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                {fileResume?.length > 0 && <span style={{ fontSize: "14px"}}>Your Recently Uploaded Resume</span>}
                {fileResume?.length > 0 && (
                  <ListGroup as="ul">
                    {fileResume && fileResume.map((file, i) => (
                      <ListGroup.Item
                        key={i}
                        as="li"
                        style={{ margin: "10px 0 25px 0", fontSize: "14px"}}
                        active={i === 0}
                      >
                        {file}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                {message && <p style={{ fontSize: "14px"}}>{message === "Resume stored in bucket successfully" ? "You recently Updated Your Resume!":""}<br></br>{message}</p>}
                {loading && <p style={{ fontSize: "14px"}}>Uploading & Replacing Your File</p>}
              </div>

              {/* Change Link to Button for handling click */}
              <Button
                className="btn btn-primary ms-1"
                onClick={handleUpload}
                disabled={loading}
                style={{ fontSize: "14px" }}
              >
                {fileResume.length > 0 ? "Upload and " : ""}Replace
              </Button>
              {showReminder && (
                <div className="popup-overlay">
                  <div className="popup-box">
                    {resumeWatch && (
                      <div className="popup-overlay">
                          <div className="popup-box">
                            <div className="animation-box">
                                <div className="resume-screen-animation">
                                  <div className="ai-animation">
                                      <img src={aiAnimationIcon} alt="aiAnimation" className="ai-img"/>
                                  </div>
                                </div>
                                <div className="animation text">
                                      <span className="" 
                                      style={{
                                      width: "85%",
                                      textAlign: "center",
                                      color: "#595e7a",
                                      fontWeight: "500"
                                      }}
                                      >Our AI is reviewing your resume and ensuring it understands every detail...</span>
                                      <div className="animation-line"></div>
                                </div>
                                <h6 className="video"><span>🚀</span> Meanwhile, check out the video below by clicking the button to see how our magic works and how CareerSavvy can help you take the next step in your career!
                                </h6>
                                <button onClick={watchVideo}>
                                <img src={VideoIcon} alt="sharma"></img>
          
          
                                Watch Video
                                </button>
                            </div>
                          </div>
                      </div>
                    )}
                      {resumeFirst && (
                        <div className="animation-box">
                            <div className="resume-upload-animation">
                              <div className={`local-animation ${resumeFirstAnimate===true?"active":""}`}>
                                  <img src={localAnimationIcon} alt="localAnimation" className="local-img"/>
                              </div>
                              <div className="ai-animation">
                                  <img src={aiAnimationIcon} alt="aiAnimation" className="ai-img"/>
                              </div>
                              <div className={`ai-server  ${resumeFirstAnimate===true?"active":""}`}>
                                  <img src={ServerIcon} alt="aiAnimation" className="server-img"/>
                              </div>
                            </div>
                            <div className={`progress-outer ${resumeFirstAnimate===true?"active":""}`}>
                              <div className="left-dot">
                                  
                              </div>
                              <div className="right-dot">

                              </div>
                              <div className="progress-inner"></div>
                            </div>
                            <div className="animation text">
                              <span className="">Your resume has been uploaded to the server.</span>
                              <div className="animation-line"></div>
                            </div>
                        </div>
                      )}
                      {resumeSecond && (
                        <div className="animation-box">
                            <div className="resume-screen-animation">
                              <div className="ai-animation">
                                  <img src={aiAnimationIcon} alt="aiAnimation" className="ai-img"/>
                              </div>
                            </div>
                            <div className="resume-line-animation">
                              <div className="resume-Icon">
                                  <img src={resumeScreen} alt="aiAnimation" className="resume-img"/>
                              </div>
                              <div className="resume-line-animate">
                              </div>
                            </div>
                            
                            <div className="animation text">
                              <span className="">Your resume is being screened.</span>
                              <div className="animation-line"></div> 
                            </div>
                        </div>
                      )}
                      {resumeThird && (
                        <div className="animation-box">
                            <div className="resume-screen-animation">
                              <div className="ai-animation">
                                  <img src={aiAnimationIcon} alt="aiAnimation" className="ai-img"/>
                              </div>
                            </div>
                            <div className="resume-line-animation">
                              <div className="resume-Icon">
                                  <img src={AnalyzeIcon} alt="aiAnimation" className="resume-analyze"/>
                              </div>
                            </div>
                            
                            <div className="animation text">
                              <span className="">Our CareerSavvy AI is preparing your profile.</span>
                              <div className="animation-line"></div> 
                            </div>
                        </div>
                      )}
                      {resumeReady&&(
                        <>
                            <h3>Time To Unleash Our Magic!</h3>
                            <span className="text-light">Almost there! Please log in again to continue your journey with us.</span>
                            <div className="popup-buttons">
                            <button className="btn-secondary" onClick={remConfirm}>
                              Go to Log-Out {isCounting && <span>({countdown})</span>}
                            </button>
                            </div>
                        </>
                      )}
                      
                  </div>
                </div>
            )}

        </>
    );
}

export default ResumeCard;

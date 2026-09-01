import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from '../../../../store/actions/AuthActions';
import { setProfileData, setTechSkills, setFileResume, setJobsList, setJobsApplied, setControlFeatures } from "../../../../store/actions/actions";
import { Button, ListGroup } from "react-bootstrap";
import PageTItle from "../../../layouts/PageTitle";
import localAnimationIcon from "../../../../images/animation/localAnimationIcon.svg";
import "./resume.css?ver1.9";
import LoaderIcon from "../../Dashboard/Home/loading-gif.gif";
import aiAnimationIcon from "../../Dashboard/SearchJobs/aiIcon.gif";
import ServerIcon from "../../../../images/animation/serverIcon.svg";
import resumeScreen from "../../../../images/animation/resumeScreen.svg";
import AnalyzeIcon from "../../../../images/animation/analyzeIcon.svg";
import ToastSuccess from "../../toastSuccess";
import VideoIcon from "./video.svg";

const Element = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [file, setFile] = useState(null);
  const userEmail = useSelector((state) => state.auth.auth.email);
  const { profileData, techSkills, fileResume, jobsList, jobsApplied, apiToken, apiTokenReady, detailedJob, controlFeatures } = useSelector(state => state.profile);
  const [chosenFiles, setChosenFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showLoader, setShowLoader ] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [resumeReady, setResumeReady] = useState(false);
  const [resumeFirst, setResumeFirst] = useState(false);
  const [resumeFirstAnimate, setResumeFirstAnimate] = useState(false);
  const [resumeSecond, setResumeSecond] = useState(false);
  const [resumeThird, setResumeThird] = useState(false);
  const [type, setType] = useState("");
  const apiEndpoint =
    "https://us-east1-foursssolutions.cloudfunctions.net/send_resume_details_front_end_v2";
    const memoizedfileResume = useMemo(()=>{
      return fileResume!=="";
    },[fileResume])

    function showReminderClicked() {
      setShowReminder(true);
      setTimeout(()=>{
         setResumeFirst(true);
         setTimeout(()=>{
            setResumeFirstAnimate(true);
         },1500);
      },300);
      setTimeout(()=>{
         setResumeFirst(false);
         setResumeSecond(true);
      },15000);
      setTimeout(()=>{
         setResumeSecond(false);
         setResumeThird(true);
         
      },35000);
      setTimeout(()=>{
         setResumeThird(false);
         if(detailedJob!==""){
            console.log("DETAILED");
            
            navigate(`/job/detailed?id=${detailedJob}`);
            setControlFeatures(true);
         }
         setResumeReady(true);
         setIsCounting(true);
         setCountdown(5);
         setTimeout(() => {
            dispatch(Logout(navigate));
         }, 6000);
      },65000);

      
         
    }

  const fetchFilenames = async () => {
    try {
      const queryObj = {
        "emailid": `${userEmail}`
  }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryObj),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      const extractedFilenames = data.file_details.map((file) => file.file_name);

      setFileResume(extractedFilenames);
      // Extract user details and dispatch
      const extractedProfileData = data.user_details[0];  // assuming it's an array of 1 object
      dispatch(setProfileData(extractedProfileData));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
   if (userEmail !==''){
      fetchFilenames();
      fetchCountries();
   }
  }, [userEmail]);
  
  const fetchCountries = async () => {
    try {
       const response = await fetch('https://restcountries.com/v3.1/all');
       const data = await response.json();
       const countryList = data.map(country => ({
          name: country.name.common,
          code: country.cca2,
       }));
       setCountries(countryList);
    } catch (error) {
       console.error('Error fetching countries:', error);
    }
 };

  

const handleFileChange = (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const allowedExtensionsRegex = /\.(doc|docx|pdf)$/i; // extension check
  const allowedMimes = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]); // MIME check

  if (!(allowedExtensionsRegex.test(file.name) && allowedMimes.has(file.type))) {
    setMessage('Only PDF, DOC, or DOCX files are allowed.');
    e.target.value = ''; // allow re-selecting same filename
    return;
  }

  setChosenFiles([file]);       // REPLACE instead of append
  setFile(file);                // keep single selected file reference
};


  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }
    setShowLoader(true);
  
    setLoading(true);
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
      // setMessage(data.Message);
      setFile(null); // Clear selected file
      setChosenFiles([]); // Clear chosen files list
      fetchFilenames();
      dispatch(setJobsList([]));
      dispatch(setJobsApplied([]));
      setShowLoader(false);
      showReminderClicked();
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while uploading the file.");
      setShowLoader(false);
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update profile data locally and dispatch to Redux
    const updatedProfileData = { ...profileData, [name]: value };
    dispatch(setProfileData(updatedProfileData));
 };

 
 const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileData.first_name || !profileData.last_name || !profileData.mobile_no) {
   //  alert("Please fill out all fields.");
   setType("failed");
   setMessage("Please fill out all fields.");
    return;
    }
    else if (chosenFiles<1){
       alert("Please select a file to upload.");
       return;
    }
    else{
    setShowLoader(true);
 
    try {
    const changes = [
       { column: "first_name", value: profileData.first_name },
       { column: "last_name", value: profileData.last_name },
       { column: "mobile_no", value: profileData.mobile_no },
       { column: "about_me", value: profileData.about_me }
    ];
 
    const updateObj = {
       emailid: userEmail,
       modify: {
         "columns": {
            "first_name": profileData.first_name,
            "last_name": profileData.last_name,
            "mobile_no": profileData.mobile_no,
            "about_me": profileData.about_me
          }
      }
   }
    const response = await fetch(apiEndpoint, {
       method: 'POST',
       headers: {
          'Content-Type': 'application/json',
       },
       body: JSON.stringify(updateObj)
    });
    if (response.ok){
      handleUpload();
      // setShowLoader(false);
      // alert('Your Profile has been updated Successfully');
    }
 
    if (!response.ok) {
      setShowLoader(false);
       throw new Error('Failed to update data');
    }
 
    console.log("Profile updated successfully!");
 
    } catch (error) {
      setShowLoader(false);
    setError(error.message);
    }
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

function watchVideo() {
   window.open("https://www.youtube.com/watch?v=Nkl5TiWo6Bs", "_blank");
 }
 console.log(detailedJob);
 
 
  return (
    <Fragment>
      {/* <PageTItle activeMenu="Element" motherMenu="Form" pageContent="Element" /> */}
      {message !== "" && (
         <>
               <ToastSuccess message={message} type={type} setMessage={setMessage} setType={setType} />
         </>
      )}

      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-8">
               <div className="row">
                  <div className="col-xl-12">
                     <div className="card profile-card resume-upload">
                        <div className="card-header flex-wrap border-0 pb-0">
                           <h3 className="fs-24 text-black font-w600 me-auto mb-2 pr-3">
                              Update Yours Profile
                           </h3>
                           <div className="d-flex me-5 align-items-center mb-2">
                              <div className="form-check custom-switch  text-right">
                                 {/* <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="customSwitch1"
                                 />
                                 <label
                                    className="form-check-label mb-0"
                                    htmlFor="customSwitch1"
                                 >
                                    Available for hire?
                                 </label> */}
                              </div>
                           </div>
                           
                        </div>
                        <div className="card-body">
                           <form>
                              <div className="mb-3">
                                 {/* <div className="title mb-4">
                                    <span className="fs-18 text-black font-w600">
                                       Generals
                                    </span>
                                 </div> */}
                                 <div className="row">
                                    <div className="col-xl-4 col-sm-12">
                                       <div className="form-group">
                                             <label>First Name <span className="required">*</span></label>
                                             <input
                                                type="text"
                                                className="form-control"
                                                name="first_name"
                                                placeholder="Enter name"
                                                value={profileData?.first_name}
                                                onChange={handleInputChange}
                                             />
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-12">
                                       <div className="form-group">
                                             <label>Last Name <span className="required">*</span></label>
                                             <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Last name"
                                                name="last_name"
                                                value={profileData?.last_name}
                                                onChange={handleInputChange}
                                             />
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-12">
                                          <div className="mb-3">
                                             
                                          <div className="form-group">
                                             <label>Phone Number <span className="required">*</span></label>
                                             <div className="input-group input-icon mb-3">
                                                <div className="input-group-prepend">
                                                      <span className="input-group-text" id="basic-addon1">
                                                         <i className="fa fa-phone" aria-hidden="true"></i>
                                                      </span>
                                                </div>
                                                <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="Phone no."
                                                      name="mobile_no"
                                                      value={profileData?.mobile_no}
                                                      onChange={handleInputChange}
                                                />
                                             </div>
                                          </div>
                                    </div>
                                    
                                    
                                 </div>
                              </div>
                              
                                 <div className="row">
                                       
                                    
                                    
                                 </div>
                              
                                    <div className="col-xl-12">
                                    <div className="mb-5">
                                       <div className="form-group">
                                          <label>Let us know about yourself</label>
                                          <textarea
                                             className="form-control"
                                             rows="6"
                                             name="about_me"
                                             value={profileData?.about_me}
                                             onChange={handleInputChange}
                                             defaultValue=""
                                             style={{height: "80px!important"}}
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="mb-3">
                                 <div className="title mb-4">
                                    <span className="fs-18 text-black font-w600">
                                       Resume Upload
                                    </span>
                                 </div>
                                 <div className="mb-3">
                <label htmlFor="formFile" className="form-label" style={{color:"#020817"}}>
                  Choose and Upload Resume
                </label>
                <input
                  className="form-control file-violet"
                  type="file"
                  id="formFile"
                  onChange={handleFileChange}
                  style={{lineHeight:"1.77rem"}}
                />   
                                 </div>

                                 <div className="basic-list-group">
                                    {chosenFiles?.length > 0 && <span>Your Chosen Files</span>}
                                    {chosenFiles?.length > 0 && (
                                       <ListGroup as="ul">
                                       {chosenFiles?.map((file, i) => (
                                          <ListGroup.Item
                                             key={i}
                                             as="li"
                                             style={{ margin: "10px 0 25px 0" }}
                                             active
                                          >
                                             {file.name}
                                          </ListGroup.Item>
                                       ))}
                                       </ListGroup>
                                    )}
                                    {fileResume!==""?(
                                       <>
                                       {fileResume?.length > 0 && <span>Your Uploaded Resume</span>}
                                    {fileResume?.length > 0 && (
                                       <ListGroup as="ul">
                                          <ListGroup.Item
                                             as="li"
                                             style={{ margin: "10px 0 25px 0" }}
                                             active={true}
                                          >
                                             {fileResume}
                                          </ListGroup.Item>
                                       </ListGroup>
                                    )}
                                    </>
                                    ):(
                                       <>
                                       </>
                                    )}
                                    

                                    {message && <p>{message}</p>}
                                    {loading && <p>Uploading & Replacing Your File</p>}
                                 </div>
                                 
                              </div>
                              
                           </form>
                           <Link
                              to="#"
                              className="btn btn-dark light btn-rounded me-3 mb-2"
                           >
                              Cancel
                           </Link>
                           <Link
                              className="btn btn-primary btn-rounded mb-2"
                              to="#"
                              onClick={handleSubmit}
                           >
                              Upload and Save
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
      </div>
      {showLoader && (
         // <div className="checkout-loader">
         //    <img src={LoaderIcon} alt="loader" />
         // </div>
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
         {showReminder && (
            <div className="popup-overlay">
               <div className="popup-box">
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
    </Fragment>
  );
};

export default Element;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListGroup } from "react-bootstrap";
import UploadIcon from "../../../pages/jobComponents/images/upload.png";
import { setProfileData } from "../../../../store/actions/actions";
import SuccesIcon from "../../../../images/succesIcon.svg";
import AiIcon from "../../Dashboard/SearchJobs/aiIcon.gif";
import JobApplied from "./Components/images/job-applied.png";

const JobApply = ({ content, jobInternal, setJobInternal, userEmailSelected, setLinkExpired, setDetailedPopup, showLoader, setShowLoader, setLoaderText, file, setFile, chosenFiles, setChosenFiles }) => {
    const { profileData, apiToken } = useSelector(state => state.profile);
    const userEmail = userEmailSelected;
    const dispatch = useDispatch();

    const [fileName, setFileName] = useState("");
    // const [chosenFiles, setChosenFiles] = useState([]);
    const [choosedFiles, setChoosedFiles] = useState(false);
    // const [file, setFile] = useState(null);
    const [fetchedProfileData, setFetchedProfileData] = useState(null); // Store original data
    // const [loaderAnimation, setLoaderAnimation] = useState(false);
    const [applicationSubmitted, setApplicationSubmitted] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (chosenFiles.length > 0) {
            setChoosedFiles(true);
        }
    }, [chosenFiles])

    const fileApi = "https://us-east1-foursssolutions.cloudfunctions.net/send_resume_details_front_end_v2";
    useEffect(() => {
        console.log("useremailload", userEmailSelected);

    }, [userEmailSelected])
    console.log("emailload", userEmail);
    useEffect(() => {
        if (userEmail) {
            fetchFilenames();
        }
    }, [userEmail]);

    const fetchFilenames = async () => {
        try {
            const queryObj = { emailid: userEmail };
            const response = await fetch(fileApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`,
                },
                body: JSON.stringify(queryObj)
            });

            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();

            if (data.file_details && data.file_details.length > 0) {
                const extractedFilenames = data.file_details.map(file => file.file_name);
                setFileName(extractedFilenames[0]);
            }

            if (data.user_details && data.user_details.length > 0) {
                const extractedProfileData = data.user_details[0];
                dispatch(setProfileData(extractedProfileData));
                setFetchedProfileData(extractedProfileData); // Store original profile data
            }
        } catch (error) {
            console.error("Error fetching filenames:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(setProfileData({ ...profileData, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setChosenFiles([selectedFile]);
            setFile(selectedFile);
        }
        setChoosedFiles(!choosedFiles);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setChosenFiles([droppedFile]);
            setFile(droppedFile);
        }
        setChoosedFiles(!choosedFiles)
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowLoader(true);
        setLoaderText("Processing Job Application");
        try {
            await updateProfile();
            if (chosenFiles.length > 0) {
                await handleUpload();
                // setLoaderText("Uploading Files");
            }
            await applyNow();
            // setLoaderText("Submitting Applications");
        } catch (error) {
            console.error("Error in submission process:", error);
            setShowLoader(false);
            setLoaderText("");
        }
    };

    const updateProfile = async () => {
        if (!profileData || !profileData.first_name || !profileData.last_name || !profileData.email) {
            alert("Please fill out all fields.");
            setShowLoader(false);
            throw new Error("Missing required fields");
        }

        // Check if profile data has changed
        if (fetchedProfileData && JSON.stringify(profileData) === JSON.stringify(fetchedProfileData)) {
            console.log("No changes in profile data, skipping update.");
            return;
        }

        try {
            const updateObj = {
                emailid: userEmail,
                modify: {
                    "columns": {
                        "first_name": profileData.first_name,
                        "last_name": profileData.last_name,
                        "email": profileData.email,
                    }
                }
            };

            const response = await fetch(fileApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`,
                },
                body: JSON.stringify(updateObj)
            });

            if (!response.ok) throw new Error('Failed to update data');
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("email_id", userEmailSelected);

        try {
            const response = await fetch(
                "https://us-east1-foursssolutions.cloudfunctions.net/Resume_upload_bucket_store_in_table_v2",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) throw new Error('File upload failed');

            await response.json();
            setFile(null);
            setChosenFiles([]);
            fetchFilenames();
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    };

    const applyNow = async () => {
        try {
            const queryObj = {
                email: userEmail,
                job_id: content.job_id,
                resume: fileName
            };

            const response = await fetch("https://job-application-submission-internal-v10-737421501165.us-east1.run.app", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(queryObj)
            });

            const data = await response.json();
            // setApplicationStatus(data.message);
            // setMessage(data.message);
            console.log(file);

            setApplicationSubmitted(true);
            setShowLoader(false);
            setLoaderText("");
            setLinkExpired(true);
            setDetailedPopup({
                title: "Application Status",
                detailedMessage: data.message + ", You can proceed further with sign-in and explore new opportunities",
                buttonName: "Sign In"
            });
            setJobInternal(false);
            setLoaderText("");
        } catch (error) {
            console.error("Error submitting application:", error);
            // setApplicationStatus("error");
            // setMessage("Failed to submit application. Please try again later.");
            setLinkExpired(true);
            setDetailedPopup({
                title: "Application Error",
                detailedMessage: "Failed to submit application. Please try again later.",
                buttonName: "Sign in"
            });
            setApplicationSubmitted(true);
            setShowLoader(false);
            setLoaderText("");
            setJobInternal(false);

        }
    };

    return (
        <>
        {showLoader?(<></>):(<>
        
            <div className="modal-overlay overlay-login">
                <div className="modal-container">
                    <button className="close-btn" onClick={() => setJobInternal(false)}>✖</button>
                    {applicationStatus !== "" ? (
                        <div className={`${applicationStatus === "success" ? "bg-green-100 text-green-900 border-green-900" : "bg-red-300 text-red-900 border-red-900"} p-1 my-2 popup`} style={{ zIndex: "1000" }}>
                            {applicationStatus === "success" ? (
                                <>
                                    <img src={SuccesIcon} alt="Success Icon" />
                                    <div className="appliedHead"><h4>{message == "Application submitted successfully with status 'Applied'" ? (<>Application submitted successfully</>) : (<>{message}</>)}</h4></div>
                                </>
                            ) : (
                                <>
                                    <img src={JobApplied} alt="Job Applied" />
                                    <div className="appliedHead"><h4>{message}</h4></div>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="center-aligned">
                                <h5 className='apply'>You Are Applying to</h5>
                                <h3 className="topHead" title={content?.job_title}>{content?.job_title}</h3>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="fullName">
                                        <div className="inputs">
                                            <label>First Name</label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                placeholder="First Name"
                                                value={profileData?.first_name || ""}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="inputs">
                                            <label>Last Name</label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                placeholder="Last Name"
                                                value={profileData?.last_name || ""}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter Your Email Address"
                                        value={profileData?.email || ""}
                                        // onChange={handleInputChange} 
                                        required
                                    />
                                    {choosedFiles ? (<>

                                    </>) : (<>
                                        <div className="mb-3 fileSelect">
                                            <label htmlFor="resumeUpload" className="form-label">Choose and Upload Resume</label>
                                            <div className="Dragdrop" onDrop={handleDrop} onDragOver={handleDragOver}>
                                                <label htmlFor="resumeUpload" className="dragdropLabel">
                                                    <img src={UploadIcon} alt="Upload Icon" className="uploadIcon" />
                                                    <p className="line">Drag & Drop your resume here or Choose File</p>
                                                    <p className="formats">Supported Formats: PDF, DOC, DOCX (Max 5MB)</p>
                                                </label>
                                                <input type="file" id="resumeUpload" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                                            </div>
                                        </div>
                                    </>)}

                                    {chosenFiles.length > 0 && (<>
                                        <div className="mb-3 mt-3 fileSelect" onClick={() => { setChoosedFiles(!choosedFiles); setFile(null); setChosenFiles([]) }}>
                                            <ListGroup>
                                                <ListGroup.Item active style={{
                                                    fontSize: "14px", lineHeight: "2em", cursor: "pointer",
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                    background: "#f1f1f1",
                                                    border: "none",
                                                    color: "#020817"
                                                }}>{chosenFiles.length > 0 ? chosenFiles[0].name : fileName || "No file selected"} <><br /></>
                                                    <span style={{ background: "#d62424", padding: "3px 6px", borderRadius: "100px", marginBottom: "0", marginTop: "10px", color: "#fff" }}><svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "5px", marginTop: "-1px" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>Click to replace file</span>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    </>)}


                                    <button type="submit" className="submit-btn"  disabled={!choosedFiles}>Apply Now</button>
                                </form>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </>)}
        </>
    );
};

export default JobApply;
import React, { Fragment, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../../context/ThemeContext";
import DOMPurify from "dompurify";
import Nav from '../../layouts/nav';
import Footer from '../../layouts/Footer';
import CompanyIcon from "./images/companyIcon.png";
import "./detailed.css?ver0.1";
import locationIcon from "./images/locationIcon.png";
import dollarIcon from "./images/dollarIcon.png";
import networkIcon from "./images/networkIcon.png";
import timingIcon from "./images/timingIcon.png";
import AiIcon from "../../components/Dashboard/SearchJobs/aiIcon.gif";
import AiGifIcon from "../../components/Dashboard/SearchJobs/aiIcon.gif";
import rightIcon from "./images/twoRighticon.png";
import AiButtonIcon from "./images/aibuttonIcon.png";
import AutoApplyIcon from "./images/AutoApplyIcon.png";
import JobIcon from "./images/JobIcon.png";
import Qualification from "./images/Qualification.png";
import Benfits from "./images/benefits.png";
import simIcon from "./images/SimIcon.png";
import simJobIcon from "./images/simJobIcon.png";
import ApplyIcon from "./images/ApplyIcon.png";
import CSavvyPageLoader from "../Dashboard/CsavvyPageLoad.jsx";
import "../Dashboard/SearchJobs/Components/t-jobs.css";
import TailoredJobsToggle from "../Dashboard/SearchJobs/Components/TailoredJobsdata";
import { setdetailedJob, setShowPro } from '../../../store/actions/actions.js';
import JobApply from '../Dashboard/SearchJobs/jobApply.jsx';

import "../../components/Dashboard/SearchJobs/inpageStyles.css";

import TailoredJobSearch from "../../components/Dashboard/SearchJobs/Components/tailoredJobSearch";
import ResumeInsightIcon from "../../components/Dashboard/SearchJobs/ResumeInsights.svg";
import InstructionIcon from "../../components/Dashboard/SearchJobs/instructionIcon.svg";
import SuggestionIcon from "../../components/Dashboard/SearchJobs/SuggestionIcon.svg";
import CopyIcon from "../../components/Dashboard/SearchJobs/CopyIcon.svg";
import CheckIcon from "../../components/Dashboard/SearchJobs/checkIcon.svg";
import ResumeChooseIcon from "../../components/Dashboard/SearchJobs/ResumeChooseIcon.svg";
import ResumeAnimate from "../../components/Dashboard/SearchJobs/ResumeIconAnimate.svg";
import aiAnimationIcon from "../../components/Dashboard/SearchJobs/aiIcon.gif";
import DownloadIcon from "../../components/Dashboard/SearchJobs/DownloadIcon.svg"
import Icons from "../../layouts/nav/proIcon.svg";


const JobDetailed = () => {

    const { changeBackground } = useContext(ThemeContext);
    const { isDarkMode, apiToken, fileResume, featuresToBlock } = useSelector((state) => state.profile);
    const userEmail = useSelector(state => state.auth.auth.email);
    const logSessionId = useSelector(state => state.auth.auth.global_session_id);
    const [createResumeClicked, setCreateResumeClicked] = useState(false);
    const [jobInternal, setJobInternal] = useState(false);
    useEffect(() => {
        if (createResumeClicked) {
            fetchResumeData();
            setCreateResumeClicked(false);
        }
    }, [createResumeClicked])
    const [detailedData, setDetailedData] = useState(null);
    const [similarData, setSimilarData] = useState(null);
    const [loaderText, setLoaderText] = useState("Getting Job Details");
    const [jobId, setJobId] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [loaderAnimation, setLoaderAnimation] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [aiCustomResumeTab, setAiCustomResumeTab] = useState(false);
    const isTailoredJobsBlocked = featuresToBlock.includes("block_tailored");
    const isGenResumeBlocked = featuresToBlock.includes("block_genresume");

    const [upgradeVideoPro, setUpgradeVideoPro] = useState(false);
    const [changeText, setChangetext] = useState(false);

    function openUpgrade() {
        setUpgradeVideoPro(true);
        setChangetext(true);
        closeResume();
    }


    function makePayment() {
        setUpgradeVideoPro(false);
        setChangetext(false);
        dispatch(setShowPro(true));
    }

    const [activeJobId, setActiveJobId] = useState("");
    const [content, setContent] = useState(null);
    useEffect(() => {
        setLoaderAnimation(true);
        setActiveJobId(jobId);

        setTimeout(() => {
            setLoaderAnimation(false);
        }, 2500);
    }, [jobId]);

    // Extract jobId from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const rawToken = queryParams.get("id");
        const tokenFromUrl = rawToken?.replace(/ /g, "+");
        if (tokenFromUrl) {
            setJobId(tokenFromUrl);
        }
    }, [location.search]);

    // Fetch job details when jobId is set
    useEffect(() => {
        if (jobId) {
            fetchJobDetails();
            dispatch(setdetailedJob(jobId));
        }
    }, [jobId]); // Runs only when jobId is updated

    // Fetch job details from API
    const fetchJobDetails = async () => {
        setLoaderText("Getting Job Details");
        try {
            const response = await fetch(
                "https://us-east1-foursssolutions.cloudfunctions.net/Get_Jobs_with_job_id_v2",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiToken}`,
                    },
                    body: JSON.stringify({ job_id: jobId }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setDetailedData(data.job_details);
                setContent(data.job_details);
                setSimilarData(data.similar_jobs);
                setLoaderAnimation(false);
                setLoaderText("Loading")
                dispatch(setdetailedJob(""));
            } else {
                console.error("Failed to fetch job details:", data);
            }
        } catch (error) {
            console.error("Error fetching job details:", error);
        }
    };

    useEffect(() => {
        setContent(detailedData);
    }, [detailedData]);

    // Update theme when component loads
    useEffect(() => {
        const currentTheme = isDarkMode ? "dark" : "light";
        changeBackground({
            value: currentTheme,
            label: currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1),
        });
    }, [isDarkMode]);

    const getDaysAgo = (postedDate) => {
        const posted = new Date(postedDate);
        const today = new Date();

        posted.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const differenceInDays = Math.floor(
            (today - posted) / (1000 * 60 * 60 * 24)
        );

        // Handle any negative or zero difference as 'Today'
        if (differenceInDays <= 0) return "Today";
        return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
    };

    const sideMenu = useSelector(state => state.sideMenu);

    function loginNavigate() {
        navigate("/login");
    }
    const [resumeAi, setresumeAi] = useState(false);
    const [resumeResponse, setresumeResponse] = useState(null);

    function resumeToggle() {
        setresumeAi(!false);
        getResumeUpdates();
    }

    const apiEndpointThree = 'https://us-east1-foursssolutions.cloudfunctions.net/resume_update_suggestions_all_v2';

    const [resAiloading, setResAiloading] = useState(false);
    const [createResumeOn, setCreateResumeOn] = useState(false);
    const [resumeResponseReady, setresumeResponseReady] = useState(null);
    const [resumeUpdates, setResumeUpdates] = useState([]);

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

            setResAiloading(false);

        } catch (error) {
            //  setError(error.message);
            //  setLoading(false);
            setResAiloading(false);
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
    const [autoApply, setAutoApply] = useState(false);

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
       <div className="topHead">
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M15.625 9.375L13.021 11.979M15.625 9.375V6.25L18.75 3.125V6.25H21.875L18.75 9.375H15.625Z" stroke="#344054" stroke-linecap="round" stroke-linejoin="round"/>
             <path d="M12.844 3.125H12.5C10.6458 3.125 8.83324 3.67483 7.29153 4.70497C5.74982 5.73511 4.54821 7.19929 3.83863 8.91234C3.12906 10.6254 2.94341 12.5104 3.30514 14.329C3.66688 16.1475 4.55976 17.818 5.87088 19.1291C7.182 20.4402 8.85246 21.3331 10.671 21.6949C12.4896 22.0566 14.3746 21.8709 16.0877 21.1614C17.8007 20.4518 19.2649 19.2502 20.295 17.7085C21.3252 16.1668 21.875 14.3542 21.875 12.5V12.1565" stroke="#3C5594" stroke-linecap="round" stroke-linejoin="round"/>
             <path d="M17.6041 13.542C17.4158 14.4639 16.9813 15.3175 16.3467 16.0123C15.7121 16.707 14.9012 17.2169 14.0001 17.4877C13.099 17.7585 12.1414 17.7802 11.2289 17.5504C10.3165 17.3206 9.48335 16.8479 8.81802 16.1826C8.15268 15.5172 7.68 14.6841 7.4502 13.7717C7.2204 12.8592 7.24207 11.9016 7.51289 11.0005C7.78371 10.0994 8.29358 9.28845 8.98832 8.65388C9.68306 8.01931 10.5367 7.58479 11.4586 7.39648" stroke="#3C5594" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <h4>Qualifications</h4>
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

    const [resumeData, setResumeData] = useState(null);
    // const [isLoading, setIsLoading] = useState(false);


    const [base64Pdf, setBase64Pdf] = useState("");
    const [base64Docx, setBase64Docx] = useState("");
    const [fileNamePdf, setFileNamePdf] = useState("");
    const [fileNameDocx, setFileNameDocx] = useState("");


    const fetchResumeData = async () => {
        setAiCustomResumeTab(true);
        setIsLoading(true);
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
            console.log("resumeData", resumeData);
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

    function closeResume() {
        setresumeAi(false);
        setresumeResponse(null);
        setAiCustomResumeTab(false);
        setBase64Pdf("");
        setBase64Docx("");
        setResumeFirstAnimate(false);
    }



    const JobDescriptionList = ({ data }) => {
        if (!data) return null;

        // Split the data by full stops and filter out empty strings
        const sentences = data.split('.').map(sentence => sentence.trim()).filter(sentence => sentence);

        return (
            <ul className="list-unstyled" style={{
                marginTop: "5px",
                marginBottom: "18px"
            }}>
                {sentences.map((sentence, index) => (
                    <li key={index} className="list-text">{sentence}</li>
                ))}

            </ul>
        );
    };
    // Normalize overview into an array of lines
    const overviewRaw = detailedData?.job_description?.overview;
    const overviewHtmlRaw = Array.isArray(overviewRaw) ? (overviewRaw[0] || "") : (overviewRaw || "");
    // optional punctuation normalization for cases like "development.,Key"
    const overviewHtmlNormalized = overviewHtmlRaw.replace(/\.,\s*/g, ". ");
    const sanitizedOverviewHtml = DOMPurify.sanitize(overviewHtmlNormalized);
    // console.log("sanitized",sanitizedOverviewHtml);
    const additionalRaw = detailedData?.job_description?.additional_comments;
    const additionalHtmlRaw = Array.isArray(additionalRaw) ? (additionalRaw[0] || "") : (additionalRaw || "");
    // optional punctuation normalization for cases like "development.,Key"
    // const additionalHtmlNormalized = additionalRaw.replace(/\.,\s*/g, ". ");
    const sanitizedAdditionalHtml = DOMPurify.sanitize(additionalHtmlRaw);
    // console.log("sanitized",sanitizedOverviewHtml);

    const overviewItems = Array.isArray(overviewRaw)
        ? overviewRaw
        : typeof overviewRaw === 'string'
            ? (
                overviewRaw.includes('\n')
                    ? overviewRaw.split(/\r?\n/)
                    // Fallback: split into sentences if no newline present
                    : overviewRaw.split(/(?<=[.!?])\s+(?=[A-Z])/)
            )
            : [];

    const cleanedItems = overviewItems
        .map(item => String(item).trim())
        .filter(Boolean);

    const items = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "20px", color: "#047857" }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign-icon lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
            bg: "icon-green",
            label: "Salary Range",
            value: `${detailedData?.salary_range || "Not specified"} ${detailedData?.salary_type === "Hourly" ? "/ Hour" : "/ Year"}`,
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "20px", color: "#2563eb" }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap-icon lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /><path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></svg>,
            bg: "icon-blue",
            label: "Experience",
            value: `${detailedData?.experience_range || "Not specified"}`,
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "20px", color: "#7c3aed" }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2-icon lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>,
            bg: "icon-purple",
            label: "Employment Type",
            value: `${detailedData?.job_employment_type || "Not Specified"}`,
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "20px", color: "#ea580c" }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-icon lucide-clock"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" /></svg>,
            bg: "icon-orange",
            label: "Posted",
            value: `${detailedData?.job_posted_at_datetime_utc ? getDaysAgo(detailedData.job_posted_at_datetime_utc) : "N/A"}`,
        },
    ];

    const [showSecondary, setShowSecondary] = useState(false); // hidden at top
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY || document.documentElement.scrollTop || 0;
            setShowSecondary(y > 20);
        };
        onScroll(); // set initial state on mount
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <Fragment>
            <div className="CsavvyDetailed" style={{ paddingBottom: "20px" }}>
                <div className="job-card">
                    <div className="job-info">
                        <div className="job-icon">{detailedData?.employer_name?.substring(0, 2).toUpperCase()}</div>
                        <div className="job-details">
                            <h3 className="job-title">{detailedData?.job_title}</h3>
                            <div className="job-meta">
                                <span className="company">{detailedData?.employer_name}</span>
                                <span className="dot">•</span>
                                <span className="location">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                                    {`${detailedData?.job_city}, ${detailedData?.job_state}, ${detailedData?.job_country}`}</span>
                                <span className="dot">•</span>
                                <span className="type">{detailedData?.job_is_remote === false ? "Onsite" : "Remote"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="job-actions">
                        <button className="btn-outline" onClick={resumeToggle} >AI Resume</button>
                        <button className="btn-outline" onClick={() => setAutoApply(true)}>Auto Apply</button>
                        {detailedData?.job_source == "Internal" ? (
                            <>
                                <button className="btn-primary" onClick={() => { setJobInternal(true) }}>Easy Apply</button>
                            </>
                        ) : (
                            <>
                                <button className="btn-primary" onClick={() => window.open(detailedData?.job_apply_link, "_blank")}>Apply Now</button>
                            </>
                        )}

                    </div>
                </div>
                {showSecondary && (
                    <div
                        className={`job-actions-secondary job-card ${sideMenu ? "open" : "close"}`}
                        style={{
                            position: "fixed",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1000,
                            // background: "var(--card, #0b1221)",
                            borderTop: "1px solid rgba(255,255,255,0.08)",
                            padding: "12px 16px",
                            display: "flex",
                            gap: 12,
                            justifyContent: "space-between",
                            alignItems: "center",
                            boxShadow: "0 -6px 20px rgba(0,0,0,0.2)"
                        }}
                        aria-label="Secondary job actions"
                    >
                        <div className="job-info">
                            <div className="job-icon">{detailedData?.employer_name?.substring(0, 2).toUpperCase()}</div>
                            <div className="job-details">
                                <h3 className="job-title">{detailedData?.job_title}</h3>
                                <div className="job-meta">
                                    <span className="company">{detailedData?.employer_name}</span>
                                    <span className="dot">•</span>
                                    <span className="location">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                                        {`${detailedData?.job_city}, ${detailedData?.job_state}, ${detailedData?.job_country}`}</span>
                                    <span className="dot">•</span>
                                    <span className="type">{detailedData?.job_is_remote === false ? "Onsite" : "Remote"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="job-actions">
                            {/* <button className="btn-outline" onClick={loginApply}>AI Resume</button>
                            {profileName.first_name !== "" ? (<>

                                <button className="btn-outline" >Hi {profileName?.first_name}</button>
                            </>) : (<>

                                <button className="btn-outline" onClick={loginApply}>Sign In</button>
                            </>)} */}
                            {detailedData?.job_source == "Internal" ? (
                                <>
                                    <button className="btn-primary" onClick={() => { setJobInternal(true) }}>Easy Apply</button>
                                </>
                            ) : (
                                <>
                                    <button className="btn-primary" onClick={() => window.open(detailedData?.job_apply_link, "_blank")}>Apply Now</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
                <div className="job-info-container">
                    {items.map((item, idx) => (
                        <div key={idx} className="job-info-item">
                            <div className={`icon-box ${item.bg}`}>{item.icon}</div>
                            <div className="info-text">
                                <div className="label">{item.label}</div>
                                <div className="value">{item.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-md-9">
                        <div className="detailedLeft leftPart">
                            {cleanedItems.length > 0 && (<>
                                {cleanedItems.length === 1 ? (<>
                                    <div className="about-role-card">
                                        <div className="about-role-header">
                                            <div className="icon-box">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                    height="18" stroke="#7c3aed" style={{ color: "#7c3aed" }} className="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-icon lucide-book-open"><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></svg>

                                            </div>
                                            <h3 className="about-role-title">About the Role</h3>
                                        </div>

                                        <div className="about-role-body">
                                            <p>
                                                <div dangerouslySetInnerHTML={{ __html: cleanedItems[0] }}></div>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="interimMargin"></div>
                                </>) : (<></>)}
                            </>)}


                            {cleanedItems.length > 0 && (<>
                                {cleanedItems.length === 1 ? (<></>) : (<>
                                    <div className="responsibilities-card">
                                        <div className="responsibilities-header">
                                            <div className="icon-box yellow">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="lucide-icon"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#da4300"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                                </svg>
                                            </div>
                                            <h3 className="responsibilities-title">Overview</h3>
                                        </div>
                                        <div className="htmltagData" dangerouslySetInnerHTML={{ __html: sanitizedOverviewHtml }} />
                                        {/* <ul className="responsibilities-list">
                                            {cleanedItems.map((item, index) => (
                                                <li key={index}>
                                                    <span className="listBullet"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul> */}
                                    </div>
                                    <div className="interimMargin"></div>
                                </>)}

                            </>)}
                            {detailedData?.job_highlights?.Responsibilities?.length > 0 ? (
                                <>
                                    <div className="responsibilities-card">
                                        <div className="responsibilities-header">
                                            <div className="icon-box green">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20"
                                                    height="20" style={{ color: "#16a34a" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-check-icon lucide-check-check"><path d="M18 6 7 17l-5-5" /><path d="m22 10-7.5 7.5L13 16" /></svg>
                                            </div>
                                            <h3 className="responsibilities-title">Responsibilities</h3>
                                        </div>

                                        <ul className="responsibilities-list">
                                            {detailedData?.job_highlights?.Responsibilities?.map((item, index) => (
                                                <li key={index}>
                                                    <span className="listBullet green"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="interimMargin"></div>

                                </>
                            ) : (
                                <>
                                    {detailedData?.job_highlights?.responsibilities?.length > 0 && (
                                        <>
                                            <div className="responsibilities-card">
                                                <div className="responsibilities-header">
                                                    <div className="icon-box green">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20"
                                                            height="20" style={{ color: "#16a34a" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>
                                                    </div>
                                                    <h3 className="responsibilities-title">Responsibilities</h3>
                                                </div>

                                                <ul className="responsibilities-list">
                                                    {detailedData?.job_highlights?.responsibilities?.map((item, index) => (
                                                        <li key={index}>
                                                            <span className="listBullet green"></span>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="interimMargin"></div>

                                        </>
                                    )}
                                </>
                            )}

                            {detailedData?.job_highlights?.requirements?.length > 0 && (
                                <>
                                    <div className="responsibilities-card">
                                        <div className="responsibilities-header">
                                            <div className="icon-box purple">

                                                <svg xmlns="http://www.w3.org/2000/svg" width="20"
                                                    height="20" style={{ color: "#a31697" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>
                                            </div>
                                            <h3 className="responsibilities-title">Requirements</h3>
                                        </div>

                                        <ul className="responsibilities-list">
                                            {detailedData?.job_highlights?.requirements?.map((item, index) => (
                                                <li key={index}>
                                                    <span className="listBullet purple"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="interimMargin"></div>

                                </>
                            )}

                            {detailedData?.job_highlights?.Qualifications?.length > 0 ? (<>
                                <div className="responsibilities-card">
                                    <div className="responsibilities-header">
                                        <div className="icon-box green">

                                            <svg xmlns="http://www.w3.org/2000/svg" width="20"
                                                height="20" style={{ color: "#16a34a" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>
                                        </div>
                                        <h3 className="responsibilities-title">Qualifications</h3>
                                    </div>

                                    <ul className="responsibilities-list">
                                        {detailedData?.job_highlights?.Qualifications?.map((item, index) => (
                                            <li key={index}>
                                                <span className="listBullet green"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="interimMargin"></div>
                            </>) : (<></>)}

                            {detailedData?.job_description?.additional_comments?.length > 0 && (<>
                                {detailedData?.job_description?.additional_comments?.length === 1 ? (<></>) : (<>
                                    <div className="responsibilities-card">
                                        <div className="responsibilities-header">
                                            <div className="icon-box bluedark">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20"
                                                    height="20" viewBox="0 0 24 24" fill="none" stroke="#3216a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-dashed-icon lucide-message-circle-dashed"><path d="M10.1 2.182a10 10 0 0 1 3.8 0" /><path d="M13.9 21.818a10 10 0 0 1-3.8 0" /><path d="M17.609 3.72a10 10 0 0 1 2.69 2.7" /><path d="M2.182 13.9a10 10 0 0 1 0-3.8" /><path d="M20.28 17.61a10 10 0 0 1-2.7 2.69" /><path d="M21.818 10.1a10 10 0 0 1 0 3.8" /><path d="M3.721 6.391a10 10 0 0 1 2.7-2.69" /><path d="m6.163 21.117-2.906.85a1 1 0 0 1-1.236-1.169l.965-2.98" /></svg>
                                            </div>
                                            <h3 className="responsibilities-title">Additional Comments</h3>
                                        </div>

                                        <div className="htmltagData" dangerouslySetInnerHTML={{ __html: sanitizedAdditionalHtml }} />
                                        {/* <ul className="responsibilities-list">
                                                {cleanedItems.map((item, index) => (
                                                    <li key={index}>
                                                        <span className="listBullet"></span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul> */}
                                    </div>
                                    <div className="interimMargin"></div>
                                </>)}

                            </>)}




                        </div>
                    </div>
                    <div className="col-md-3 ">
                        <div className="detailedLeft rightPart">
                            {Array.isArray(detailedData?.job_highlights?.benefits) &&
                                detailedData.job_highlights.benefits[0]?.trim().length > 0 && (
                                    <>
                                        <div className="responsibilities-card">
                                            <div className="responsibilities-header">
                                                <div className="icon-box violet">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                        style={{ color: "#7c3aed" }} viewBox="0 0 24 24" fill="none"
                                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                        className="lucide lucide-gift-icon lucide-gift"
                                                    >
                                                        <rect x="3" y="8" width="18" height="4" rx="1" />
                                                        <path d="M12 8v13" />
                                                        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                                                        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                                                    </svg>
                                                </div>
                                                <h3 className="responsibilities-title">Benefits</h3>
                                            </div>

                                            <ul className="responsibilities-list">
                                                {detailedData.job_highlights.benefits
                                                    .filter(b => b.trim().length > 0)
                                                    .map((item, idx) => (
                                                        <li key={idx} className="small">
                                                            <span className="listBullet blue"></span>
                                                            {item}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>

                                        <div className="interimMargin"></div>
                                    </>
                                )}




                            <div className="related-jobs-card">
                                <h3 className="related-title">Related Jobs</h3>
                                <div className="jobs-list">
                                    {similarData?.map((item) => (
                                        <div className="job-item" key={item.job_id} onClick={() => { navigate(`/job/detailed?id=${item.job_id}`) }}>
                                            <div className="job-initials">
                                                {item.employer_name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="rel-job-col">
                                                <h4 className="job-role">{item.job_title}</h4>
                                                <p className="job-company">{item.employer_name}</p>
                                                <p className="job-location">{`${item?.job_city}, ${item?.job_state}, ${item?.job_country}`}</p>
                                                <div className="job-salary">{item?.job_posted_at_datetime_utc ? getDaysAgo(item.job_posted_at_datetime_utc) : "N/A"}</div>
                                            </div>
                                        </div>

                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

            {jobInternal && (<>
                <JobApply content={content} jobInternal={jobInternal} setJobInternal={setJobInternal} loaderText={loaderText} setLoaderText={setLoaderText} loaderAnimation={loaderAnimation} setLoaderAnimation={setLoaderAnimation} />
            </>)}
            {!loaderAnimation && (<>
                <div className="tailoredShifted">
                    <TailoredJobSearch userEmail={userEmail} apiToken={apiToken} fetchResumeData={fetchResumeData} autoApply={autoApply} setAutoApply={setAutoApply} upgradeVideoPro={upgradeVideoPro} setUpgradeVideoPro={setUpgradeVideoPro} isTailoredJobsBlocked={isTailoredJobsBlocked} createResumeOn={createResumeOn} setCreateResumeOn={setCreateResumeOn} resumeResponse={resumeResponse} setresumeResponse={setresumeResponse} />
                </div>
            </>)}


            {resumeAi && (
                <div className="card detailedJob top-card d-sm-flex flex-xl-column flex-sm-row resAi">
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
                                                                {resumeFirstAnimate === true?(<></>):(<>
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
                                                            {resumeFirstAnimate === true?(<></>):(<>
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
                                                                    {resumeFirstAnimate === true ? "Your resume is ready to download" : "Career Savvy is generating your custom resume"}
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

            {
                loaderAnimation && (
                    <CSavvyPageLoader loaderText={loaderText || "Loading"} />
                )
            }
        </Fragment>
    )
}
export default JobDetailed;

import React, { Fragment, useState, useEffect, useContext } from "react";
import LoginSignUp from "./loginSignUp.jsx";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import CSavvyPageLoader from "../../components/Dashboard/CsavvyPageLoad";
import styling from "./bottomSidePopup.module.css";
import { ThemeContext } from "../../../context/ThemeContext";
import DOMPurify from "dompurify";

import Nav from '../../layouts/nav';
import Footer from '../../layouts/Footer';
import JobApply from "../../components/Dashboard/SearchJobs/jobApplyWoSignUp.jsx";
import CompanyIcon from "./images/companyIcon.png";
import "./detailed.css?ver0.1";
import "./CSavvyDetailed.css?ver0.1"
import locationIcon from "./images/locationIcon.png";
import dollarIcon from "./images/dollarIcon.png";
import networkIcon from "./images/networkIcon.png";
import timingIcon from "./images/timingIcon.png";
import AiIcon from "../../components/Dashboard/SearchJobs/aiIcon.gif";
import rightIcon from "./images/twoRighticon.png";
import AiButtonIcon from "./images/aibuttonIcon.png";
import AutoApplyIcon from "./images/AutoApplyIcon.png";
import JobIcon from "./images/JobIcon.png";
import Qualification from "./images/Qualification.png";
import Benfits from "./images/benefits.png";
import simIcon from "./images/SimIcon.png";
import simJobIcon from "./images/simJobIcon.png";
import ApplyIcon from "./images/ApplyIcon.png";
import { loadingToggleAction, loginAction, setdetailedJob } from '../../../store/actions/actions.js';


const JobDetailed = () => {

    const { changeBackground } = useContext(ThemeContext);
    const { isDarkMode, apiToken, signUpActive } = useSelector((state) => state.profile);
    const [loginPopup, setLoginPopup] = useState(false);
    const [loginMessage, setLoginMessage] = useState("Ready To Apply")
    const [detailedData, setDetailedData] = useState(null);
    const [similarData, setSimilarData] = useState(null);
    const [jobInternal, setJobInternal] = useState(false);
    const [file, setFile] = useState(null); // single File to upload
    const [chosenFiles, setChosenFiles] = useState([]); // File[] for listing
    const [profileName, setProfileName] = useState({
        first_name: ""
    });
    const [loading, setLoading] = useState(false);
    const [linkExpired, setLinkExpired] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [loaderText, setLoaderText] = useState("");
    const [detailedPopup, setDetailedPopup] = useState({
        title: "",
        detailedMessage: "",
        buttonName: ""
    });
    useEffect(() => {
        if (linkExpired == true) {
            setTimeout(() => {
                setLinkExpired(false);
                setDetailedPopup({
                    title: "",
                    detailedMessage: "",
                    buttonName: ""
                });
            }, 5000)
        }
    }, [linkExpired])
    const [userEmailSelected, setUserEmailSelected] = useState("");

    const [content, setContent] = useState(null);
    const [jobId, setJobId] = useState("");
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

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loaderAnimation, setLoaderAnimation] = useState(true);
    useEffect(() => {
        setLoaderAnimation(true);
        setTimeout(() => {
            setLoaderAnimation(false);
        }, 1200);
    }, [jobId]);

    // Extract jobId from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const rawToken = queryParams.get("id");
        const tokenFromUrl = rawToken?.replace(/ /g, "+");

        if (tokenFromUrl) {
            setJobId(tokenFromUrl);
        };
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
        setShowLoader(true);
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
                setShowLoader(false);
                setLoaderText("");
                setSimilarData(data.similar_jobs);
                setLoaderAnimation(false);
                setContent(data.job_details);
            } else {
                console.error("Failed to fetch job details:", data);
                setShowLoader(false);
            }
        } catch (error) {
            console.error("Error fetching job details:", error);
            setShowLoader(false);
        }
    };

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

    function loginApply() {
        setLoginPopup(true);
        setLoginMessage("Ready To Apply");
        setFile(null);
        setChosenFiles([]);
    }
    // near other helpers, compute sanitized overview once
    const overviewRaw = detailedData?.job_description?.overview;
    const overviewHtmlRaw = Array.isArray(overviewRaw) ? (overviewRaw[0] || "") : (overviewRaw || "");
    // optional punctuation normalization for cases like "development.,Key"
    const overviewHtmlNormalized = overviewHtmlRaw.replace(/\.,\s*/g, ". ");
    const sanitizedOverviewHtml = DOMPurify.sanitize(overviewHtmlNormalized);
    const additionalRaw = detailedData?.job_description?.additional_comments;
    const additionalHtmlRaw = Array.isArray(additionalRaw) ? (additionalRaw[0] || "") : (additionalRaw || "");
    // optional punctuation normalization for cases like "development.,Key"
    // const additionalHtmlNormalized = additionalRaw.replace(/\.,\s*/g, ". ");
    const sanitizedAdditionalHtml = DOMPurify.sanitize(additionalHtmlRaw);
    // console.log("sanitized",sanitizedOverviewHtml);

    const overviewItems = Array.isArray(overviewRaw)
        ? overviewRaw
        : typeof overviewRaw === "string"
            ? (
                // First try to split by numbered points like "1.", "2.", "3."
                overviewRaw.match(/(\d+\.\s.*?)(?=\s*\d+\.|$)/gs)
                || (
                    overviewRaw.includes("\n")
                        ? overviewRaw.split(/\r?\n/)
                        : overviewRaw.split(/(?<=[.!?])\s+(?=[A-Z])/)
                )
            )
            : [];


    const cleanedItems = overviewItems
        .map(item => String(item).trim())
        .filter(Boolean);
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
            value: `${detailedData?.experience_range || "Not specified"} `,
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "20px", color: "#7c3aed" }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2-icon lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>,
            bg: "icon-purple",
            label: "Employment Type",
            value: `${detailedData?.job_employment_type || "Not specified"}`,
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "20px", color: "#ea580c" }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-icon lucide-clock"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" /></svg>,
            bg: "icon-orange",
            label: "Posted",
            // value: `${detailedData?.job_posted_at_datetime_utc ? getDaysAgo(detailedData.job_posted_at_datetime_utc) : "N/A"}`,
            value: `${detailedData?.job_status == "Closed" ? "Position Closed" : detailedData?.job_posted_at_datetime_utc ? getDaysAgo(detailedData.job_posted_at_datetime_utc) : "N/A"}`,
        },
    ];




    return (
        <div id="main-wrapper" className={`show hideInMobile ${sideMenu ? "menu-toggle" : ""}`}>
            <Nav />
            <div className="content-body" style={{ minHeight: "calc(100vh)", paddingTop: "0" }}>

                <div className="CsavvyDetailed">
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
                            {detailedData?.job_status == "Closed" ? (<>
                                <button className="btn-primary" onClick={()=>{navigate("/login")}}>Position Closed</button>
                            </>) : (<>
                                <button className="btn-outline mobileHide" onClick={loginApply}>AI Resume</button>
                                {profileName.first_name !== "" ? (<>

                                    <button className="btn-outline" >Hi {profileName?.first_name}</button>
                                </>) : (<>

                                    <button className="btn-outline" onClick={loginApply}>Sign In</button>
                                </>)}
                                <button className="btn-primary" onClick={loginApply}>Apply Now</button>
                            </>)}

                        </div>
                    </div>
                    {showSecondary && (
                        <div
                            className={`job-actions-secondary mobile job-card ${sideMenu ? "open" : "close"}`}
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
                                <div className="job-icon">{detailedData?.employer_name.substring(0, 2).toUpperCase()}</div>
                                <div className="job-details">
                                    <h3 className="job-title">{detailedData?.job_title}</h3>
                                    <div className="job-meta">
                                        <span className="company">{detailedData?.employer_name}</span>
                                        <span className="dot mobileHide">•</span>
                                        <span className="location mobileHide">
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
                            {detailedData?.job_status == "Closed" ? (<>
                                <button className="btn-primary" onClick={()=>{navigate("/login")}}>Position Closed</button>
                            </>):(<>
                                <button className="btn-primary" onClick={loginApply}>Apply Now</button>
                            </>)}
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
                                                    <div className="htmltagData" dangerouslySetInnerHTML={{ __html: cleanedItems[0] }}></div>
                                                    {/* {cleanedItems[0]} */}
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
                    <JobApply content={content} jobInternal={jobInternal} setJobInternal={setJobInternal} userEmailSelected={userEmailSelected} setLinkExpired={setLinkExpired} setDetailedPopup={setDetailedPopup} showLoader={showLoader} setShowLoader={setShowLoader} setLoaderText={setLoaderText} file={file} chosenFiles={chosenFiles} setFile={setFile} setChosenFiles={setChosenFiles} />
                </>)}
            </div>
            {
                linkExpired && (
                    <>
                        <div className={styling.linkExpiredPopup}>
                            <div className={styling.rowitems}>
                                <div className={styling.Info}>
                                    <h3 className={styling.head}>{detailedPopup.title || "Loading"}</h3>
                                    <p className={styling.para}>{detailedPopup.detailedMessage || "Thank you for your patience.We're getting ready for you."}</p>
                                </div>{detailedPopup.buttonName == "hide" ? (<>

                                </>) : (<>
                                    {detailedPopup.buttonName == "Sign In" ? (<>
                                        <button className={`${styling.OkayBtn} ${loading ? styling.loading : ''}`} onClick={() => setLoginPopup(true)} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg> {detailedPopup.buttonName || "Okay"}
                                        </button>
                                    </>) : (<>
                                        <button className={`${styling.OkayBtn} ${loading ? styling.loading : ''}`} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg> {detailedPopup.buttonName || "Okay"}
                                        </button>
                                    </>)}

                                </>)}


                            </div>
                        </div>
                    </>
                )
            }
            {
                loginPopup && (<>
                    <LoginSignUp setLoginPopup={setLoginPopup} detailedData={detailedData} jobInternal={jobInternal} setJobInternal={setJobInternal} setUserEmailSelected={setUserEmailSelected} setLinkExpired={setLinkExpired} setDetailedPopup={setDetailedPopup} showLoader={showLoader} setShowLoader={setShowLoader} loaderText={loaderText} setLoaderText={setLoaderText} profileName={profileName} setProfileName={setProfileName} file={file} chosenFiles={chosenFiles} setFile={setFile} setChosenFiles={setChosenFiles} />
                </>)
            }
            {
                showLoader && (
                    <CSavvyPageLoader loaderText={loaderText || "Loading"} />
                )
            }

            <Footer />
        </div >
    )
}
export default JobDetailed;
import React from 'react';
import { useEffect, useState } from 'react';
import "./skeleton.css";
import "./Components/List.css";
import "./jobApplyDetailed.css";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SkeletonLoader from "./skeletonLoader";
import AiGifIcon from "./aiIcon.gif";
import CompanyIcon1 from "./Components/images/CompanyIcon1.png";
import CompanyIcon from "./Components/images/companyIcon.png";
import LocationIcon from "./Components/images/LocationIcon.png";
import CelanderIcon from "./Components/images/CelanderIcon.png";
import aiIcon from "./Components/images/aiIcon.png";
import AutoApply from "./Components/images/AutoApply.png";
import UploadIcon from "../../../pages/jobComponents/images/upload.png";
import JobApply from './jobApply';


const DollerSvg = () => {
    return (
        <svg className="me-3 ms-lg-0 ms-sm-auto ms-0 mt-sm-0 mt-3" width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="54" height="54" rx="15" fill="#2BC155"></rect>
            <g clipPath="url(#clip6)">
                <path d="M27.0001 19.84C23.5987 19.84 20.6536 22.2024 19.9157 25.5229L17.4992 36.397C17.4815 36.4768 17.4725 36.5583 17.4725 36.64C17.4725 37.2585 17.974 37.76 18.5925 37.76H35.4077C35.4894 37.76 35.5709 37.751 35.6507 37.7333C36.2545 37.5991 36.6352 37.0008 36.501 36.397L34.0846 25.5229C33.3467 22.2024 30.4016 19.84 27.0001 19.84ZM27.0001 17.6C31.4515 17.6 35.3056 20.6916 36.2712 25.037L38.6877 35.9111C39.0902 37.7226 37.9481 39.5174 36.1366 39.92C35.8973 39.9731 35.6529 40 35.4077 40H18.5925C16.7369 40 15.2325 38.4956 15.2325 36.64C15.2325 36.3948 15.2594 36.1504 15.3126 35.9111L17.729 25.037C18.6947 20.6916 22.5488 17.6 27.0001 17.6Z" fill="white"></path>
                <path d="M29.2402 24.32C29.8588 24.32 30.3602 24.8214 30.3602 25.44C30.3602 26.0585 29.8588 26.56 29.2402 26.56H26.4402C26.1309 26.56 25.8802 26.8107 25.8802 27.12C25.8802 27.4292 26.1309 27.68 26.4402 27.68H27.5602C29.1066 27.68 30.3602 28.9336 30.3602 30.48C30.3602 32.0264 29.1066 33.28 27.5602 33.28H24.7602C24.1416 33.28 23.6402 32.7785 23.6402 32.16C23.6402 31.5414 24.1416 31.04 24.7602 31.04H27.5602C27.8695 31.04 28.1202 30.7892 28.1202 30.48C28.1202 30.1707 27.8695 29.92 27.5602 29.92H26.4402C24.8938 29.92 23.6402 28.6664 23.6402 27.12C23.6402 25.5736 24.8938 24.32 26.4402 24.32H29.2402Z" fill="white"></path>
                <path d="M25.8802 23.2C25.8802 22.5814 26.3817 22.08 27.0002 22.08C27.6188 22.08 28.1203 22.5814 28.1203 23.2V25.44C28.1203 26.0586 27.6188 26.56 27.0002 26.56C26.3817 2 align-items-center d-flex6.56 25.8802 26.0586 25.8802 25.44V23.2Z" fill="white"></path>
                <path d="M28.1203 34.4C28.1203 35.0186 27.6188 35.52 27.0002 35.52C26.3817 35.52 25.8802 35.0186 25.8802 34.4V32.16C25.8802 31.5414 26.3817 31.04 27.0002 31.04C27.6188 31.04 28.1203 31.5414 28.1203 32.16V34.4Z" fill="white"></path>
                <path d="M25.8001 18.304C26.0298 18.8784 25.7504 19.5302 25.1761 19.7599C24.6018 19.9896 23.95 19.7103 23.7203 19.136L21.4803 13.536C21.1163 12.626 22.0141 11.7204 22.9272 12.0766C23.7659 12.4037 24.391 12.56 24.7602 12.56C24.8521 12.56 24.9283 12.5404 25.0946 12.4697C25.1387 12.4509 25.1906 12.428 25.3122 12.3742C25.8915 12.1203 26.3491 12 27.0002 12C27.6497 12 28.1146 12.1206 28.6957 12.3721C28.8432 12.4366 28.9021 12.4623 28.9542 12.4838C29.0978 12.5429 29.1669 12.56 29.2402 12.56C29.5878 12.56 30.2185 12.4023 31.0812 12.0735C31.9932 11.7258 32.8825 12.6298 32.5201 13.536L30.2801 19.136C30.0503 19.7103 29.3985 19.9896 28.8242 19.7599C28.2499 19.5302 27.9705 18.8784 28.2003 18.304L29.6096 14.7807C29.4808 14.7936 29.3578 14.8 29.2402 14.8C28.8314 14.8 28.4927 14.7162 28.1013 14.5551C28.0241 14.5232 27.9394 14.4863 27.8064 14.4279C27.4822 14.2877 27.2985 14.24 27.0002 14.24C26.7048 14.24 26.5313 14.2856 26.2114 14.4258C26.1015 14.4745 26.0319 14.5052 25.9706 14.5313C25.5512 14.7095 25.2002 14.8 24.7602 14.8C24.6419 14.8 24.5189 14.7939 24.3911 14.7816L25.8001 18.304Z" fill="white"></path>
            </g>
            <defs>
                <clipPath id="clip6">
                    <rect width="28" height="28" fill="white" transform="translate(13 12)"></rect>
                </clipPath>
            </defs>
        </svg>
    )
}

const LocationSvg = () => {
    return (
        <svg className="me-3" width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="54" height="54" rx="15" fill="#FBA556"></rect>
            <path d="M27 15C21.934 15 17.8125 19.1215 17.8125 24.1875C17.8125 25.8091 18.2409 27.4034 19.0515 28.7979C19.2404 29.123 19.4516 29.4398 19.6793 29.7396L26.6008 39H27.3991L34.3207 29.7397C34.5483 29.4398 34.7595 29.1231 34.9485 28.7979C35.7591 27.4034 36.1875 25.8091 36.1875 24.1875C36.1875 19.1215 32.066 15 27 15ZM27 27.2344C25.32 27.2344 23.9531 25.8675 23.9531 24.1875C23.9531 22.5075 25.32 21.1406 27 21.1406C28.68 21.1406 30.0469 22.5075 30.0469 24.1875C30.0469 25.8675 28.68 27.2344 27 27.2344Z" fill="white"></path>
        </svg>
    )
}



const ListTab = ({ content, setContent, autoApply, setAutoApply, jobsList, setJobsList, activeJobId, setActiveJobId, error, setError, selectId, setSelectId, isLoading, setIsLoading, searchTerm, setSearchTerm, buttonText, daysFilter, setDaysFilter, stateFilter, setStateFilter, cityFilter, setCityFilter, filteredCandidates, setFilteredCandidates, remoteJobsFilter, employmentFilter, setEmploymentFilter, internshipFilter, fulltimeFilter, contractorFilter, isDarkMode, setMobileActive, currentPage, setCurrentPage, recentJobsFilter, setRecentJobsFilter, resumeToggle, jobTitleFilter, setJobTitleFilter, publisherFilter, setPublisherFilter, employerFilter, setEmployerFilter, setLoaderAnimation }) => {
    const userEmail = useSelector(state => state.auth.auth.email);
    

    const colorMapping = {
        design: "#F35F31", // UX Designer
        dev: "#3144F3",    // Developer
        marketing: "#31B9F3", // Marketing roles
        // Add more categories or job titles if needed
    };

    const [activeJobIndex, setActiveJobIndex] = useState(0);
    const [jobInternal, setJobInternal] = useState(false);

    const handleJobClick = (job, index) => {
        setContent(job);
        console.log("content", content)
        setActiveJobId(job.job_id);
        setMobileActive(true);
        setSelectId(job.job_id);
        setActiveJobIndex(index);  // Set the active index
        console.log(content);
    };
    
    useEffect(() => {
        let filtered = jobsList || [];
    
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter((job) =>
                job.job_title.toLowerCase().includes(lowerCaseSearchTerm) ||
                job.employer_name.toLowerCase().includes(lowerCaseSearchTerm) ||
                job.job_city?.toLowerCase().includes(lowerCaseSearchTerm) ||
                job.job_state?.toLowerCase().includes(lowerCaseSearchTerm) ||
                job.job_country?.toLowerCase().includes(lowerCaseSearchTerm) ||
                job.job_employment_type?.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }
    
        if (daysFilter) {
            const currentDate = new Date();
            filtered = filtered.filter((job) => {
                const jobPostingDate = new Date(job.job_posted_at_datetime_utc);
                const timeDiff = (currentDate - jobPostingDate) / (1000 * 60 * 60 * 24);
                return (
                    (daysFilter === "24 hours" && timeDiff <= 1) ||
                    (daysFilter === "last 3 days" && timeDiff <= 3) ||
                    (daysFilter === "last 7 days" && timeDiff <= 7)
                );
            });
        }
    
        if (stateFilter) {
            filtered = filtered.filter((job) => job.job_state === stateFilter);
        }
    
        if (cityFilter) {
            filtered = filtered.filter((job) => job.job_city === cityFilter);
        }
    
        if (remoteJobsFilter) {
            filtered = filtered.filter((job) => job.job_is_remote === true);
        }
    
        if (employmentFilter) {
            filtered = filtered.filter((job) => job.job_employment_type === employmentFilter);
        }
    
        if (internshipFilter || fulltimeFilter || contractorFilter) {
            filtered = filtered.filter((job) =>
                (internshipFilter && job.job_employment_type === "INTERNSHIP") ||
                (fulltimeFilter && job.job_employment_type === "FULLTIME") ||
                (contractorFilter && job.job_employment_type === "CONTRACTOR")
            );
        }
    
        if (jobTitleFilter) {
            filtered = filtered.filter((job) => job.job_title === jobTitleFilter);
        }
    
        if (publisherFilter) {
            filtered = filtered.filter((job) => job.job_publisher === publisherFilter);
        }
    
        if (employerFilter) {
            filtered = filtered.filter((job) => job.employer_name === employerFilter);
        }
    
        if (recentJobsFilter) {
            filtered = [...filtered].sort(
                (a, b) => new Date(b.job_posted_at_datetime_utc) - new Date(a.job_posted_at_datetime_utc)
            );
        }
    
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setFilteredCandidates(filtered);
        }, 100);
    }, [
        searchTerm,
        jobsList,
        daysFilter,
        stateFilter,
        cityFilter,
        remoteJobsFilter,
        employmentFilter,
        internshipFilter,
        fulltimeFilter,
        contractorFilter,
        recentJobsFilter,
        jobTitleFilter,
        publisherFilter,
        employerFilter,
    ]);
    
useEffect(()=>{
    if(recentJobsFilter){
        if(employerFilter==="");
        setEmployerFilter("a");
        setEmployerFilter(false);
    }
},[recentJobsFilter])

    const jobsPerPage = 8;

    // Calculate the start and end indices of jobs for the current page
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredCandidates?.slice(indexOfFirstJob, indexOfLastJob);

    const totalPages = Math.ceil(filteredCandidates?.length / jobsPerPage);
    useEffect(() => {
        handlePageChange(currentPage); // Ensure current page updates
    }, [currentPage, filteredCandidates]); // Listen to filteredCandidates updates

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Handle direct page input
    const handlePageInputChange = (e) => {
        const pageNum = Number(e.target.value);
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    // Function to calculate "time ago"
  const calculateTimeAgo = (postedAt) => {
    const now = new Date();
    const postedDate = new Date(postedAt);
    const differenceInMilliseconds = now - postedDate;

    // Convert time differences
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInDays > 0) {
      return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
    } else if (differenceInHours > 0) {
      return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""} ago`;
    } else if (differenceInMinutes > 0) {
      return `${differenceInMinutes} minute${differenceInMinutes > 1 ? "s" : ""} ago`;
    } else {
      return `Just now`;
    }
  };

  const isEarlyApplicant = (postedDate) => {
    const postedTime = new Date(postedDate); // Convert to date
    const currentTime = new Date();
    const differenceInHours = Math.abs(currentTime - postedTime) / (1000 * 60 * 60); // Convert ms to hours
    
    return differenceInHours <= 48; // Less than or equal to 24 hours
  };


    return (
        <div className="row">
            <div className="col-xl-12">
                
                {isLoading ? ([...Array(5)].map((_, index) => <SkeletonLoader  />) // Show 5 skeletons
                ) : (<> {currentJobs?.map((job, index) => {
                    const jobType = job.job_title?.toLowerCase().includes('designer')
                        ? 'design'
                        : job.job_title?.toLowerCase().includes('developer')
                            ? 'dev'
                            : 'marketing';

                    return (
                        <>
                        <div  className={`JobsCard d-flex flex-wrap mb-3 rounded justify-content-between align-items-center ${activeJobIndex === index ? 'active' : ''}`} onClick={() => handleJobClick(job, index)} >
                            <Link to={`/job/detailed?id=${job.job_id}`} className='viewLink'>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" fill="white"/>
                                    <path d="M15.4698 7.83C14.8817 6.30882 13.8608 4.99331 12.5332 4.04604C11.2056 3.09878 9.62953 2.56129 7.99979 2.5C6.37005 2.56129 4.79398 3.09878 3.46639 4.04604C2.1388 4.99331 1.11787 6.30882 0.529787 7.83C0.490071 7.93985 0.490071 8.06015 0.529787 8.17C1.11787 9.69118 2.1388 11.0067 3.46639 11.954C4.79398 12.9012 6.37005 13.4387 7.99979 13.5C9.62953 13.4387 11.2056 12.9012 12.5332 11.954C13.8608 11.0067 14.8817 9.69118 15.4698 8.17C15.5095 8.06015 15.5095 7.93985 15.4698 7.83ZM7.99979 11.25C7.357 11.25 6.72864 11.0594 6.19418 10.7023C5.65972 10.3452 5.24316 9.83758 4.99718 9.24372C4.75119 8.64986 4.68683 7.99639 4.81224 7.36596C4.93764 6.73552 5.24717 6.15642 5.70169 5.7019C6.15621 5.24738 6.73531 4.93785 7.36574 4.81245C7.99618 4.68705 8.64965 4.75141 9.24351 4.99739C9.83737 5.24338 10.3449 5.65994 10.7021 6.1944C11.0592 6.72886 11.2498 7.35721 11.2498 8C11.2485 8.86155 10.9056 9.68743 10.2964 10.2966C9.68722 10.9058 8.86133 11.2487 7.99979 11.25Z" fill="white"/>
                                </svg>
                                View
                            </Link>
                            <div className='row-flex top-contents'>
                                <div className='jobTags col-flex'>
                                    <h2 className='mainHead'>{job.job_title}</h2>
                                    <div className='row-flex jobCompntype'>
                                        <span>{job.employer_name}</span>
                                        <div className='widthDivider'></div>
                                        <span>{job.job_is_remote ? "Remote" : "Onsite"}</span>
                                        <div className='widthDivider'></div>
                                        <span>{job.job_employment_type}</span>
                                    </div>
                                    <div className='row-flex PostLocTime'>
                                        <div className='posted row-flex'>
                                            <img src={CompanyIcon} alt="posted"/>
                                            <span>{job.job_publisher}</span>
                                        </div>
                                        <div className='widthDivider'></div>
                                        <div className='posted row-flex'>
                                            <img src={LocationIcon} alt="posted"/>
                                            <span>{job.job_city}, {job.job_state}, {job.job_country}</span>
                                        </div>
                                        <div className='widthDivider'></div>
                                        <div className='posted row-flex'>
                                            <img src={CelanderIcon} alt="posted"/>
                                            <span>{new Date(job.job_posted_at_datetime_utc).toLocaleDateString('en-US')} - {calculateTimeAgo(job.job_posted_at_datetime_utc)}</span>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className='jobicons col-flex'>
                                    <img src={CompanyIcon1} className='companyIcon' alt="companyIcon" />
                                </div>

                            </div>
                            <div className='row-flex bot-details'>
                                <div className='col-flex jobInfo'>
                                    <p className='jobDetails'>
                                    {job.job_description}
                                    </p>
                                    {/* <span className="time">
                                    {calculateTimeAgo(job.job_posted_at_datetime_utc)}
                                    </span> */}
                                </div>
                                <div className='col-flex Main-buttons'>
                                    <div className='aiOuter'>
                                        <button className='aiButton row-flex' onClick={resumeToggle}>
                                            <img src={aiIcon} className='aiIcon' alt='aiicon'/>
                                            <span>AI Resume</span>
                                        </button>
                                    </div>
                                    <div className='ApplyOuter'>
                                    <button className='aiButton AutoApply row-flex' onClick={()=>setAutoApply(true)}>
                                        <img src={AutoApply} className='aiIcon' alt='aiicon'/>
                                        <span>
                                            Auto Apply
                                        </span>
                                    </button>
                                    </div>
                                    <div className='ApplyOuter'>
                                        {content.job_source=="Internal"?(
                                            <>
                                            <button className='ApplyButton row-flex'
                                                onClick={() => setJobInternal(true)}>
                                                    <span>
                                                        Easy Apply
                                                    </span>
                                                    <svg width="27" height="32" viewBox="0 0 27 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g filter="url(#filter0_d_1112_185)">
                                                        <path d="M16.4995 16.5303C16.7924 16.2374 16.7924 15.7626 16.4995 15.4697L11.7265 10.6967C11.4336 10.4038 10.9587 10.4038 10.6658 10.6967C10.373 10.9896 10.373 11.4645 10.6658 11.7574L14.9085 16L10.6658 20.2426C10.373 20.5355 10.373 21.0104 10.6658 21.3033C10.9587 21.5962 11.4336 21.5962 11.7265 21.3033L16.4995 16.5303ZM15 16.75L15.9691 16.75L15.9691 15.25L15 15.25L15 16.75Z" fill="#09B100"/>
                                                        </g>
                                                        <defs>
                                                        <filter id="filter0_d_1112_185" x="0.446289" y="0.476562" width="26.2729" height="31.0469" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                                        <feOffset/>
                                                        <feGaussianBlur stdDeviation="5"/>
                                                        <feComposite in2="hardAlpha" operator="out"/>
                                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1112_185"/>
                                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1112_185" result="shape"/>
                                                        </filter>
                                                        </defs>
                                                    </svg>

                                                </button>
                                            </>
                                        ):(
                                            <>
                                            <button className='ApplyButton row-flex'
                                                onClick={() => window.open(job.job_apply_link, '_blank', 'noopener,noreferrer')}>
                                                    <span>
                                                        {isEarlyApplicant(job.job_posted_at_datetime_utc) ? "Early Applicant" : "Apply Now"}
                                                    </span>
                                                    <svg width="27" height="32" viewBox="0 0 27 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g filter="url(#filter0_d_1112_185)">
                                                        <path d="M16.4995 16.5303C16.7924 16.2374 16.7924 15.7626 16.4995 15.4697L11.7265 10.6967C11.4336 10.4038 10.9587 10.4038 10.6658 10.6967C10.373 10.9896 10.373 11.4645 10.6658 11.7574L14.9085 16L10.6658 20.2426C10.373 20.5355 10.373 21.0104 10.6658 21.3033C10.9587 21.5962 11.4336 21.5962 11.7265 21.3033L16.4995 16.5303ZM15 16.75L15.9691 16.75L15.9691 15.25L15 15.25L15 16.75Z" fill="#09B100"/>
                                                        </g>
                                                        <defs>
                                                        <filter id="filter0_d_1112_185" x="0.446289" y="0.476562" width="26.2729" height="31.0469" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                                        <feOffset/>
                                                        <feGaussianBlur stdDeviation="5"/>
                                                        <feComposite in2="hardAlpha" operator="out"/>
                                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1112_185"/>
                                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1112_185" result="shape"/>
                                                        </filter>
                                                        </defs>
                                                    </svg>

                                                </button>
                                            </>
                                        )
                                    }
                                    
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        </>
                        
                    );
                })}


                </>)
                }
            </div>
            {jobInternal&&(<>
                <JobApply content={content} jobInternal={jobInternal} setJobInternal={setJobInternal}/>
            </>)}
        </div>

    );
};

export default ListTab;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
   Icon01,
   Icon02,
} from "./SearchJobsIcon";

const SingleJob = ({ content, setContent, jobsList, setJobsList, activeJobId, setActiveJobId, selectId, setSelectId, isDarkMode, setMobileActive, currentPage, setCurrentPage }) => {
   // Pagination State
   
   const jobsPerPage = 6; // Number of jobs per page

   // Get current jobs for the current page
   const indexOfLastJob = currentPage * jobsPerPage;
   const indexOfFirstJob = indexOfLastJob - jobsPerPage;
   const currentJobs = jobsList?.matches?.slice(indexOfFirstJob, indexOfLastJob);

   // Change active job
   const handleJobClick = (job) => {
      setContent(job);
      setMobileActive(true)
      setActiveJobId(job.id);
      setSelectId(job.job_id);
   };

   // Change page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   // Total pages calculation, ensuring jobsList and matches exist
   const totalJobs = jobsList?.matches?.length || 0;
   const totalPages = Math.ceil(totalJobs / jobsPerPage);

   return (
      <>
         <div className="row">
            {currentJobs?.map((job) => (
               <div
                  className={`col-xl-4 col-md-6 ${activeJobId === job.id ? "active" : ""}`}
                  key={job.id}
                  onClick={() => handleJobClick(job)}
               >
                  <div className="card shadow_1" style={{ cursor: "pointer" }}>
                     <div className="card-body">
                        <div className="media mb-2">
                           <div className="media-body">
                              <p className="mb-1">{job.employer_name}</p>
                              <h4 className="fs-20 text-black">{job.job_title}</h4>
                           </div>
                           {job.id % 2 === 0 ? Icon01 : Icon02}
                        </div>
                        <span className="text-primary font-w500 d-block mb-3">
                           {new Date(job.job_posted_at_datetime_utc).toLocaleDateString("en-US")}
                        </span>
                        <p className="fs-14" style={{ maxHeight: "85px", overflow: "hidden" }}>
                           {job.job_highlights?.Qualifications ? (
                              <ul>
                                 {job.job_highlights.Qualifications.map((qualification, index) => (
                                    <li key={index}>{qualification}</li>
                                 ))}
                              </ul>
                           ) : (
                              "No qualifications specified"
                           )}
                        </p>
                        <div className="d-flex align-items-center mt-4">
                           <Link to="#" className="btn btn-primary light btn-rounded me-auto">
                              {job.job_is_remote ? "Remote" : "Onsite"}
                           </Link>
                           <span className="text-black font-w500">
                              {job.job_employment_type}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         
      </>
   );
};

export default SingleJob;

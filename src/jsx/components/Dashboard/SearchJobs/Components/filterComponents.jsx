import React, { useState, useEffect, useRef } from 'react';
import FilterImage from "./images/FilterImage.png";
import FirstpageImage from "./images/listNavIcons/firstPage.svg";
import PrevPageImage from "./images/listNavIcons/prevPage.svg";
import CurrentPageImage from "./images/listNavIcons/currentPageIcon.svg";
import NextPageImage from "./images/listNavIcons/nextPage.svg";
import LastPageImage from "./images/listNavIcons/lastPage.svg";
import JobCount from "./images/JobCount.png";
import "./filter.css";

export default function FilterComponent({
  
  setInternshipFilter,
  setFulltimeFilter,
  setContractorFilter,
  setRemoteJobsFilter,
  setCurrentPage,
  currentPage,
  totalPages,
  filteredCandidates,
  isFulltimeBlocked,
  fulltimeFilter,
  internshipFilter,
  isInternBlocked,
  daysFilter,
  setDaysFilter,
  stateFilter,
  setStateFilter,
  jobsList,
  cityFilter,
  setCityFilter,
  jobTitleFilter,
  setJobTitleFilter,
  publisherFilter, 
  setPublisherFilter,
  employerFilter,
  setEmployerFilter,
  upgradePro,
  setUpgradePro
}) {
  const [dataFilters, setDataFilters] = useState(false);
  // Ref for the dataFilter container
  const dataFilterRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dataFilterRef.current && !dataFilterRef.current.contains(event.target)) {
        setDataFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <>
      <div className="d-flex mb-3 border-bottom flex-wrap align-items-center justify-content-between filtersContainer">
        {/* Filters Label */}
        <div className="filterButton" onClick={()=>{setDataFilters(!dataFilters)}}>
          <img src={FilterImage} alt="filters" />
          Filters
        </div>
        <div className="widthDivider">
        </div>
        {isInternBlocked?(<>
          <div className="inputFilters">
          <label onClick={()=>setUpgradePro(true)}>
            <input
              type="checkbox"
              className="form-check-input"
              disabled={isInternBlocked}
              checked={internshipFilter}
              onChange={(e) => setInternshipFilter(e.target.checked)}
            />
            Intern
          </label>
          <label onClick={()=>setUpgradePro(true)}>
            <input
              type="checkbox"
              className="form-check-input"
              checked={fulltimeFilter}
                disabled={isFulltimeBlocked}
              onChange={(e) => setFulltimeFilter(e.target.checked)}
            />
            Full Time
          </label>
          <label>
            <input
              type="checkbox"
              className="form-check-input"
              onChange={(e) => setRemoteJobsFilter(e.target.checked)}
            />
            Remote
          </label>
          <label>
            <input
              type="checkbox"
              className="form-check-input"
              onChange={(e) => setContractorFilter(e.target.checked)}
            />
            Contractor
          </label>
        </div>
        </>):(<>
          <div className="inputFilters">
          <label>
            <input
              type="checkbox"
              className="form-check-input"
              disabled={isInternBlocked}
              checked={internshipFilter}
              onChange={(e) => setInternshipFilter(e.target.checked)}
            />
            Intern
          </label>
          <label>
            <input
              type="checkbox"
              className="form-check-input"
              checked={fulltimeFilter}
                disabled={isFulltimeBlocked}
              onChange={(e) => setFulltimeFilter(e.target.checked)}
            />
            Full Time
          </label>
          <label>
            <input
              type="checkbox"
              className="form-check-input"
              onChange={(e) => setRemoteJobsFilter(e.target.checked)}
            />
            Remote
          </label>
          <label>
            <input
              type="checkbox"
              className="form-check-input"
              onChange={(e) => setContractorFilter(e.target.checked)}
            />
            Contractor
          </label>
        </div>
        </>)}
        
        <div className="widthDivider">
        </div>

       

        {/* Job Count */}
        <div className="JobCount">
          <img src={JobCount} alt="JobCount" className="JobCountIcon" />
          {filteredCandidates?.length}
        </div>
        <div className="widthDivider">
        </div>

        {/* Pagination Controls */}
        <ul className="jobPagination">
          <li
            className={`page-indicator ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => currentPage > 1 && setCurrentPage(1)}
          >
            <img src={FirstpageImage} alt="first-page" />
          </li>
          <li
            className={`page-indicator ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            <img src={PrevPageImage} alt="prev-page" />
          </li>
          <li className="currentPage">
            {/* <img src={CurrentPageImage} alt="current-page" /> */}
            {currentPage}
          </li>
          <li
            className={`page-indicator ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
          >
            <img src={NextPageImage} alt="next-page" />
          </li>
          <li
            className={`page-indicator ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            onClick={() => currentPage < totalPages && setCurrentPage(totalPages)}
          >
            <img src={LastPageImage} alt="last-page" />
          </li>
        </ul>
        {dataFilters && (
          <>
          <div className="dataFilter" ref={dataFilterRef}>
            <div className="filter">
              Date Filter
                <select
                    className="dataDrop"
                    placeholder="Filter Days"
                    value={daysFilter}
                    onChange={(e) => setDaysFilter(e.target.value)}
                >
                    <option value="">Choose Days</option>
                    <option value="24 hours">24 Hours</option>
                    <option value="last 3 days">Last 3 Days</option>
                    <option value="last 7 days">Last 7 Days</option>
                </select>
                  </div>
                  <div className="filter">
                    State Filter
                  <select
                     className="dataDrop"
                     placeholder="Filter State"
                     value={stateFilter}
                     onChange={(e) => setStateFilter(e.target.value)}
                  >
                     <option value="">Choose State</option>
                     {[...new Set(jobsList?.map(item => item.job_state))]
                        .map((state, index) => (
                           <option key={`state-${index}`} value={state}>{state}</option>
                        ))}
              </select>
              </div>
              <div className="filter">
                    City Filter
                  <select
                     className="dataDrop"
                     placeholder="Filter City"
                     value={cityFilter}
                     onChange={(e) => setCityFilter(e.target.value)}
                  >
                     <option value="">Choose City</option>
                     {[...new Set(jobsList?.map(item => item.job_city))]
                        .map((city, index) => (
                           <option key={`city-${index}`} value={city}>{city}</option>
                        ))}
                  </select>
                </div>
              <div className="filter">
                    Job Title
                  <select
                     className="dataDrop"
                     placeholder="Filter City"
                     value={jobTitleFilter}
                     onChange={(e) => setJobTitleFilter(e.target.value)}
                  >
                    {console.log(jobTitleFilter)};
                     <option value="">Choose Role</option>
                     {[...new Set(jobsList?.map(item => item.job_title))]
                        .map((city, index) => (
                           <option key={`city-${index}`} value={city}>{city}</option>
                        ))}
                  </select>
                </div>
              
              <div className="filter">
                By Publisher
                  <select
                     className="dataDrop"
                     placeholder="Filter City"
                     value={publisherFilter}
                     onChange={(e) => setPublisherFilter(e.target.value)}
                  >
                     <option value="">Choose Publisher</option>
                     {[...new Set(jobsList?.map(item => item.job_publisher))]
                        .map((city, index) => (
                           <option key={`city-${index}`} value={city}>{city}</option>
                        ))}
                  </select>
                </div>
              
              <div className="filter">
                Preferred Employer
                  <select
                     className="dataDrop"
                     placeholder="Filter City"
                     value={employerFilter}
                     onChange={(e) => setEmployerFilter(e.target.value)}
                  >
                     <option value="">Choose Employer</option>
                     {[...new Set(jobsList?.map(item => item.employer_name))]
                        .map((city, index) => (
                           <option key={`city-${index}`} value={city}>{city}</option>
                        ))}
                  </select>
                </div>
                <button className="continue" onClick={()=>setDataFilters(!dataFilters)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.99994 12L4.39594 6.563C4.22294 5.007 5.82494 3.864 7.23994 4.535L19.1839 10.193C20.7089 10.915 20.7089 13.085 19.1839 13.807L7.23994 19.466C5.82494 20.136 4.22294 18.994 4.39594 17.438L4.99994 12ZM4.99994 12H11.9999" stroke="#40189D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Continue
                </button>
          </div>
          </>
        )}
      </div>
    </>
  );
}

import React, { useEffect } from "react";

import "./TailoredJobsToggle.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import congratulationIcon from "./images/congratulationIcon.webp";
import SuggestionIcon from "./images/SuggestionIcon.png";
import SHeadIcon from "./images/sHeadIcon.png";
import CopyIcon from "./images/CopyIcon2.png";

const COLORS = ["#3d1c97", "#ddd"];

const TailoredJobsToggle = ({ resumeUpdates, resumeResponse, setresumeResponse, createResumeClicked, setCreateResumeClicked, createResumeOn, setCreateResumeOn }) => {
  const assessmentChunk = resumeUpdates.find(chunk => chunk.chunk_type === "assessment");
  const matchPercentage = assessmentChunk?.data.match_percentage || 0;
  const verdict = assessmentChunk?.data.submission_verdict || "N/A";
  const verdictReason = assessmentChunk?.data.verdict_reason || "No details provided";
  const chartData = [
    { name: "Match", value: matchPercentage },
    { name: "Remaining", value: 100 - matchPercentage },
  ];

  useEffect(()=>{
    if(resumeUpdates.length>0){
      setresumeResponse({"result": {
        "data": resumeUpdates
      }});
      console.log(resumeResponse);
    }
    
  },[resumeUpdates])

  function createResumeJson() {
    setresumeResponse({"result": {
      "data": resumeUpdates
    }});
    if(setresumeResponse==null){
      setresumeResponse({"result": {
        "data": resumeUpdates
      }});
    }
    if(resumeResponse){
      setCreateResumeClicked(true);
      console.log(resumeResponse);
    }
  }
    

  const formatExperienceDuration = (period) => {
    if (!period.includes(" - ")) return "Invalid Period";

    const [startStr, endStr] = period.split(" - ");

    // Function to parse "MM/YYYY" format correctly
    const parseDate = (dateStr) => {
        const [month, year] = dateStr.split("/").map(Number);
        if (!month || !year || month < 1 || month > 12) return NaN;
        return new Date(year, month - 1); // Month is 0-based in JavaScript Date
    };

    const startDate = parseDate(startStr);
    const endDate = endStr === "Present" ? new Date() : parseDate(endStr);

    if (isNaN(startDate) || isNaN(endDate)) return "Invalid Date Format";

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return `${years > 0 ? `${years} year${years > 1 ? "s" : ""} ` : ""}${months > 0 ? `${months} month${months > 1 ? "s" : ""}` : ""}`.trim() || "0 months";
};

const handleCopy = (jsonData) => {
  const formatData = (data, indent = "") => {
      if (Array.isArray(data)) {
          return data
              .map((item) => (typeof item === "object" ? formatData(item, indent + "  ") : `${indent}- ${item}`))
              .join("\n");
      } else if (typeof data === "object" && data !== null) {
          return Object.entries(data)
              .map(([key, value]) => `${indent}${key.replace(/_/g, " ")}: \n${formatData(value, indent + "  ")}`)
              .join("\n");
      }
      return `${indent}- ${String(data)}`;
  };

  const formattedText = formatData(jsonData);

  navigator.clipboard.writeText(formattedText).then(() => {
      console.log("Formatted data copied to clipboard!");
      showPopup(); // Show success message
  }).catch(err => {
      console.error("Failed to copy:", err);
  });
};

const showPopup = () => {
  const popup = document.createElement("div");
  popup.innerText = "Copied to clipboard!";
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "calc(50% - 106px)";
  popup.style.background = "rgb(0, 12, 122)";
  popup.style.color = "white";
  popup.style.padding = "10px 20px";
  popup.style.borderRadius = "8px";
  popup.style.zIndex = "1000000000";
  popup.style.fontSize = "14px";
  popup.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  popup.style.opacity = "1";
  popup.style.transition = "opacity 0.5s ease-out";

  document.body.appendChild(popup);

  setTimeout(() => {
      popup.style.opacity = "0";
      setTimeout(() => popup.remove(), 500); // Remove after fade-out
  }, 2000);
};


  // const handleCopy = (jsonData) => {
  //   const formattedText = JSON.stringify(jsonData, null, 2); // Pretty print JSON
  //   navigator.clipboard.writeText(formattedText).then(() => {
  //     console.log("JSON copied to clipboard!");
  //   }).catch(err => {
  //     console.error("Failed to copy:", err);
  //   });
  // };


  return (
    <div className="resume-container">
      {createResumeOn && (
        <button className="customResumeButton" onClick={createResumeJson}>
        <img src={SHeadIcon} alt="" className="icon" />
        Generate Custom Resume</button>
      )}
      
      {/* Profile Header */}
      <div className="d-flex flex-row topHead">
        <div className="resume-header">
        <svg width="114" height="114" viewBox="0 0 114 114" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon">
        <path d="M23.7024 61.0946C24.5741 67.3772 27.1998 73.2867 31.2781 78.1445C35.3565 83.0024 40.722 86.6116 46.7589 88.5579C52.7957 90.5042 59.259 90.7087 65.4068 89.1478C71.5545 87.5869 77.1375 84.324 81.5147 79.7336C81.1029 78.7726 80.8525 77.7503 80.7737 76.7078L80.7499 76.0001L80.7737 75.2876C80.9155 73.3986 81.6188 71.5951 82.7933 70.1089C83.9677 68.6226 85.5597 67.5214 87.3647 66.9466C89.1697 66.3719 91.1053 66.3499 92.9229 66.8835C94.7405 67.4171 96.3571 68.4818 97.565 69.941C98.7729 71.4002 99.517 73.1872 99.7017 75.0725C99.8865 76.9578 99.5033 78.8552 98.6016 80.5211C97.6998 82.187 96.3207 83.5453 94.6412 84.4215C92.9617 85.2977 91.0587 85.6518 89.1764 85.4383C83.6606 91.5429 76.517 95.9463 68.5849 98.1311C60.6529 100.316 52.2621 100.191 44.3984 97.7719C36.5348 95.3526 29.525 90.739 24.1929 84.4733C18.8608 78.2076 15.4278 70.5502 14.2974 62.4008C14.1663 61.174 14.5177 59.9442 15.2773 58.9719C16.0368 57.9995 17.145 57.3609 18.3671 57.1912C19.5892 57.0214 20.8294 57.3339 21.8252 58.0624C22.821 58.791 23.4942 59.8784 23.7024 61.0946Z" fill="#fff"/>
        <path d="M57 38C60.7174 38 64.3531 39.0905 67.4568 41.1364C70.5606 43.1823 72.996 46.0937 74.4614 49.5101C75.9268 52.9264 76.3579 56.6976 75.7011 60.3565C75.0444 64.0155 73.3288 67.4014 70.7668 70.0949C68.2048 72.7884 64.9089 74.6711 61.2874 75.5099C57.6659 76.3488 53.8779 76.1068 50.3925 74.8141C46.9071 73.5213 43.8776 71.2345 41.6791 68.237C39.4805 65.2394 38.2096 61.6627 38.0238 57.95L38 57L38.0238 56.05C38.2675 51.1814 40.3731 46.5928 43.9051 43.2332C47.4372 39.8736 52.1253 38 57 38Z" fill="#fff"/>
        <path d="M62.4245 14.6774C71.8266 15.8914 80.5689 20.1627 87.3049 26.8335C94.0409 33.5042 98.3971 42.2045 99.7025 51.5944C99.8372 52.8227 99.4879 54.0552 98.7288 55.0303C97.9697 56.0053 96.8605 56.6461 95.6366 56.8167C94.4127 56.9873 93.1705 56.6743 92.1737 55.944C91.1769 55.2137 90.5038 54.1237 90.2975 52.9054C89.2787 45.5778 85.8787 38.7886 80.6214 33.5836C75.3641 28.3787 68.5411 25.0468 61.2038 24.1014C55.955 23.4196 50.6195 23.9828 45.6287 25.7454C40.638 27.508 36.1322 30.4205 32.4757 34.2474C33.0229 35.5155 33.2869 36.8877 33.2494 38.2683C33.2119 39.649 32.8739 41.0048 32.2588 42.2414C31.6437 43.478 30.7664 44.5657 29.6879 45.4285C28.6095 46.2914 27.3559 46.9087 26.0145 47.2375C24.673 47.5663 23.276 47.5986 21.9208 47.3323C20.5656 47.0659 19.2848 46.5073 18.1676 45.6953C17.0504 44.8833 16.1236 43.8374 15.452 42.6306C14.7803 41.4238 14.3798 40.085 14.2785 38.7076L14.25 37.9999L14.2738 37.2874C14.3693 36.0145 14.7203 34.774 15.306 33.6398C15.8916 32.5056 16.6998 31.5011 17.6822 30.6862C18.6647 29.8713 19.8013 29.2628 21.0242 28.897C22.2471 28.5311 23.5312 28.4154 24.7998 28.5569C29.4833 23.3759 35.3526 19.4069 41.9051 16.9897C48.4576 14.5725 55.4983 13.7791 62.4245 14.6774Z" fill="#fff"/>
        </svg>

          <h1>Your Resume Analysis</h1>
          <p>Tailored insights for your career growth</p>
        </div>
        {/* Match Percentage Graph */}
        <div className="match-card">
          <h3>Resume Match Score</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className={`match-text ${matchPercentage > 50 ? "match-high" : "match-low"}`}>
            {matchPercentage}% Match <br></br> {verdict.replace(/_/g, ' ')}
          </p>
          <p className="match-reason">{verdictReason}</p>
        </div>
      </div>
      
      
      

      

      {/* Resume Sections */}
      {resumeUpdates.map((chunk, index) => {
        switch (chunk.chunk_type) {
          case "action_items":
            return (
              
                
              <div className="jd-content active mt-3" style={{ order: "8" }}>
                  <div className="row-flex d-flex align-items-center justify-content-between">
                    <div className="suggestionHead">
                    <img
                        src={SHeadIcon}
                        alt=""
                        className="icon"
                    />
                    Action Items
                    </div>
                    <button className="CopyButton" onClick={() => handleCopy(chunk.data)}>
                    <img
                        src={CopyIcon}
                        alt=""
                        className="copyIcon"
                    />
                    Copy
                    </button>
                  </div>
                  {chunk.data.immediate.length > 0 && (
                    <>
                    <div className="jobTitleDate" style={{ marginTop: 10 }}>
                    <h4 className="job-title">Immediate Term</h4>
                  </div>
                  <ul className="list-unstyled">
                  {chunk.data.immediate.map((item, i) => (
                    <li className="mb-2 list-text">
                    {item}
                    </li>
                  ))}
                  </ul>
                    </>
                  )}
                  {chunk.data.long_term.length > 0 && (
                    <>
                    <div className="jobTitleDate" style={{ marginTop: 2 }}>
                    <h4 className="job-title">Long Term</h4>
                  </div>
                  <ul className="list-unstyled">
                  {chunk.data.long_term.map((item, i) => (
                    <li className="mb-1 list-text">
                    {item}
                    </li>
                  ))}
                  </ul>
                    </>
                  )}
                  {chunk.data.short_term.length > 0 && (
                    <>
                    <div className="jobTitleDate" style={{ marginTop: 2 }}>
                    <h4 className="job-title">Short Term</h4>
                  </div>
                  <ul className="list-unstyled mb-2">
                  {chunk.data.short_term.map((item, i) => (
                    <li className="mb-1 list-text">
                    {item}
                    </li>
                  ))}
                  </ul>
                    </>
                  )}
                  
              </div>
            );

            case "domain_match":
              return (
                <>
                {chunk.data.jd_domain.length > 0 && (
                  <>
                  <div className="d-flex align-items-center justify-content-between jd-head mt-3 animated-item" style={{ order: "1" }}>
                      <div className="suggestion-button">
                        <img
                        src={SuggestionIcon}
                        alt=""
                        className="suggestion-icon"
                        />
                        Job Domain: {chunk.data.jd_domain}
                      </div>
                     
                  </div>
                  </>
                )}
                  
                  {chunk.data.resume_domain.length > 0 && (
                    <>
                    <div className="d-flex align-items-center justify-content-between jd-head animated-item" style={{ order: "2" }}>
                      <div className="suggestion-button">
                        <img
                        src={SuggestionIcon}
                        alt=""
                        className="suggestion-icon"
                        />
                        Resume Domain: {chunk.data.resume_domain}
                      </div>
                     
                  </div>
                    </>
                  )}
                  
                  {chunk.data.match_level.length > 0 && (
                    <>
                      <div className="d-flex align-items-center justify-content-between jd-head animated-item" style={{ order: "3" }}>
                      <div className="suggestion-button">
                        <img
                        src={SuggestionIcon}
                        alt=""
                        className="suggestion-icon"
                        />
                        Match Level: {chunk.data.match_level}
                      </div>
                     
                  </div>
                    </>)}
                  
                  {chunk.data.transferable_skills.length > 0 && (<>
                  <div className="d-flex align-items-center justify-content-between jd-head animated-item" style={{ order: "4" }}>
                      <div className="suggestion-button">
                        <img
                        src={SuggestionIcon}
                        alt=""
                        className="suggestion-icon"
                        />
                        Transferable Skills:
                      </div>
                     
                  </div>
                  
                    <div className="jd-content active " style={{ order: "5" }}>
                        <ul className="list-unstyled mt-2">
                        {chunk.data.transferable_skills.map((skill, skillIndex) => (<>
                          <li>
                          {skill}
                          </li>
                        </>))}
                          
                        </ul>
                    </div>
                  </>)}
                  {chunk.data.gap_analysis.length > 0 && (<>
                  <div className="d-flex align-items-center justify-content-between jd-head animated-item" style={{ order: "6" }}>
                      <div className="suggestion-button">
                        <img
                        src={SuggestionIcon}
                        alt=""
                        className="suggestion-icon"
                        />
                        Gap Analysis:
                      </div>
                     
                  </div>
                  
                    <div className="jd-content mt-2 active " style={{ order: "7" }}>
                        <ul className="list-unstyled">
                        {chunk.data.gap_analysis.map((gap, gapIndex) => (<>
                          <li>
                          {gap}
                          </li>
                        </>))}
                          
                        </ul>
                    </div>
                  </>)}
            
                  
                </>
              );

          case "experience_enhancement":
            return (
              <>
                
                {chunk.data.map((exp, expIndex) => (
                  <>
                  <div className="d-flex align-items-center justify-content-between jd-head mt-4" style={{ order: "11" }}>
                    <div className="suggestion-button">
                      <img
                      src={SuggestionIcon}
                      alt=""
                      className="suggestion-icon"
                      />
                      Experience Suggestion <span>|</span> {exp.period}
                    </div>
                    
                </div>
                <div className="jd-content active mt-3" style={{ order: "11" }}>
                    <div className="row-flex d-flex align-items-center justify-content-between">
                      <div className="suggestionHead">
                      <img
                          src={SHeadIcon}
                          alt=""
                          className="icon"
                      />
                      {exp.company}
                      </div>
                      <button className="CopyButton" onClick={() => handleCopy(chunk.data)}>
                      <img
                          src={CopyIcon}
                          alt=""
                          className="copyIcon"
                      />
                      Copy
                      </button>
                    </div>
                    <div className="jobTitleDate" style={{ marginTop: 10 }}>
                      <h4 className="job-title">Overview</h4>
                    </div>
                    {exp.suggested_points.map((pointObj, pointIndex) => (
                      <>
                    
                    <ul className="list-unstyled">
                      <li className="mb-2 list-text">
                      {pointObj.point}
                      </li>
                    </ul>
                    </>
                  ))}
                  <div className="jobTitleDate" style={{ marginTop: 10 }}>
                      <h4 className="job-title">Why Important</h4>
                    </div>
                    {exp.suggested_points.map((pointObj, pointIndex) => (
                      <>
                    
                    
                    <ul className="list-unstyled">
                      <li className="mb-2 list-text">
                      {pointObj.why_important}
                      </li>
                    </ul>
                    </>
                  ))}
                  <div className="jobTitleDate" style={{ marginTop: 10 }}>
                      <h4 className="job-title">Success Indicators Can Be Added</h4>
                    </div>
                    {exp.suggested_points.map((pointObj, pointIndex) => (
                      <>
                    <ul className="list-unstyled mb-2">
                      <li className="mb-2 list-text">
                      {pointObj.metrics_to_add}
                      </li>
                    </ul>
                    </>
                  ))}
                </div>
                
                
              
                  
                  </>
                ))}
              </>
            );
            
            

          case "skill_gaps":
            return (
              <>
                  <div className="jd-content active mt-4" style={{ order: "9" }}>
                    <div className="row-flex d-flex align-items-center justify-content-between">
                      <div className="suggestionHead">
                      <img
                          src={SHeadIcon}
                          alt=""
                          className="icon"
                      />
                      Skill Gaps
                      </div>
                      <button className="CopyButton" onClick={() => handleCopy(chunk.data)}>
                      <img
                          src={CopyIcon}
                          alt=""
                          className="copyIcon"
                      />
                      Copy
                      </button>
                    </div>
                    <div className="jobTitleDate" style={{ marginTop: 10 }}>
                      <h4 className="job-title">Critical Missing:</h4>
                    </div>
                    <ul className="list-unstyled">
                      <li className="mb-2 list-text">
                       {chunk.data.critical_missing.join(", ")}
                      </li>
                    </ul>
                    {chunk.data.recommended_missing.length > 0 && (
                      <>
                      <div className="jobTitleDate" style={{ marginTop: 10 }}>
                        <h4 className="job-title">Recommended Missing:</h4>
                      </div>
                      <ul className="list-unstyled mb-2">
                        <li className="mb-2 list-text">
                          {chunk.data.recommended_missing.join(", ")}
                        </li>
                      </ul>
                      </>
                    )}
                    {chunk.data.training_suggestions > 0 &&(
                      <>
                        <div className="jobTitleDate" style={{ marginTop: 10 }}>
                        <h4 className="job-title">Training Suggestion</h4>
                        </div>
                        <ul className="list-unstyled">
                        {chunk.data.training_suggestions.map((suggestion, i) => (
                          <li className="mb-2 list-text">
                          {suggestion}
                          </li>
                      ))}
                      </ul>
                      </>
                    )}
                    
                </div>
              </>
            );

          case "certifications":
            return (
              <div className="jd-content active mt-4" style={{ order: "10" }}>
                  <div className="row-flex d-flex align-items-center justify-content-between">
                    <div className="suggestionHead">
                    <img
                        src={SHeadIcon}
                        alt=""
                        className="icon"
                    />
                    Certifications
                    </div>
                    <button className="CopyButton" onClick={() => handleCopy(chunk.data)}>
                    <img
                        src={CopyIcon}
                        alt=""
                        className="copyIcon"
                    />
                    Copy
                    </button>
                  </div>
                  {chunk.data.required.length > 0 && (
                    <>
                    <div className="jobTitleDate" style={{ marginTop: 10 }}>
                    <h4 className="job-title">Required Certifications</h4>
                    </div>
                    <ul className="list-unstyled">
                    
                      <li className="mb-2 list-text">
                      {chunk.data.required.join(", ")}
                      </li>
                    
                    </ul>
                    </>)}
                  {chunk.data.missing.length > 0 && (
                    <>
                    <div className="jobTitleDate" style={{ marginTop: 10 }}>
                    <h4 className="job-title">Missing Certifications</h4>
                    </div>
                    <ul className="list-unstyled mb-2">
                    
                      <li className="mb-2 list-text">
                      {chunk.data.missing.join(", ")}
                      </li>
                    
                    </ul>
                    </>
                  )}
                  
              </div>
              
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default TailoredJobsToggle;


import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./careerInsoghts.css";
import InfoIcon from "./infoIcon.svg";
import TopIcon from "./TopIcon.svg";
import TipsIcon from "./tips.svg";
import CertIcon from "./certIcon.svg";
import TechIcon from "./TechIcon.svg";
import InterviewIcon from "./interviewIcon.svg";
import RolesIcon from "./RolesIcon.svg";
import AiIcon from "../../SearchJobs/aiIcon.gif";
import CareerDash from "./career-dash.svg";
import TrendIcon from "./trendIcon.svg";
import Choose from "./choose.svg";
import InsightList from "./insightListIcon.svg";

const CareerInsights = () => {
    const [careerInsight, setCareerInsight] = useState(false);
    const [activeCard, setActiveCard] = useState(null); // New state to track active card
    const [detailedContent, setDetailedContent] = useState(null); // New state to track detailed content
    const { techSkills, isDarkMode } = useSelector((state) => state.profile);
    const [instruction, setInstruction] = useState(true);
  
    function closeInsights() {
      setCareerInsight(false);
    }
  
    function handleCardClick(cardType, content) {
      setActiveCard(cardType); // Set the active card
      setDetailedContent(content); // Set the detailed content
      setCareerInsight(true);
    }
    function openInstruction() {
      setInstruction(!instruction);
    }

    useEffect(() => {
      setTimeout(()=> {
        setInstruction(false)
      },10000)
    },[instruction]);
  
  return (
    <>
      <div className="card careerInsights">
        <div className="card-header head">
          <div className="head-row">
            <img className="headIcon" src={CareerDash} alt="head" />
            <h4 className="text">
              Unlock New Possibilities
              with Inspiring Insights and Trends!
            </h4>
          </div>
          <div className="icon instruction">
          </div>
        </div>

        <div className="card-body">
          
        {techSkills?.career_insights ? (
            <div className="content row">
              {techSkills.career_insights.career_development && (
                <div
                  className={`card ${
                    activeCard === "career_development" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "career_development",
                      techSkills.career_insights.career_development
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={TopIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Career Development</h3>
                    <p className="card-decription">Level Up Your Career!</p>
                  </div>
                </div>
              )}
              {techSkills.career_insights.certifications && (
                <div
                  className={`card ${
                    activeCard === "certifications" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "certifications",
                      techSkills.career_insights.certifications
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={CertIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Certifications</h3>
                    <p className="card-decription">Boost Your Credibility!</p>
                  </div>
                </div>
              )}
              {techSkills.career_insights.emerging_technologies && (
                <div
                  className={`card ${
                    activeCard === "emerging_technologies" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "emerging_technologies",
                      techSkills.career_insights.emerging_technologies
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={TechIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Emerging Technologies</h3>
                    <p className="card-decription">Master New Tech Trends!</p>
                  </div>
                </div>
              )}
              {techSkills.career_insights.interview_tips && (
                <div
                  className={`card ${
                    activeCard === "interview_tips" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "interview_tips",
                      techSkills.career_insights.interview_tips
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={InterviewIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Interview Tips</h3>
                    <p className="card-decription">Interview Like a Pro!</p>
                  </div>
                </div>
              )}
              {techSkills.career_insights.resume_tips && (
                <div
                  className={`card ${
                    activeCard === "resume_tips" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "resume_tips",
                      techSkills.career_insights.resume_tips
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={TipsIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Resume Tips</h3>
                    <p className="card-decription">Build a Winning Resume!</p>
                  </div>
                </div>
              )}
              {techSkills.career_insights.trending_roles && (
                <div
                  className={`card ${
                    activeCard === "trending_roles" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "trending_roles",
                      techSkills.career_insights.trending_roles
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={RolesIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Trending Roles</h3>
                    <p className="card-decription">Explore In-Demand Roles!</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
            <div className="content row">
              
                <div
                  className={`card ${
                    activeCard === "career_development" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "career_development",
                      techSkills.career_insights.career_development
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={TopIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Career Development</h3>
                    <p className="card-decription">Level Up Your Career!</p>
                  </div>
                </div>
                <div
                  className={`card ${
                    activeCard === "certifications" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "certifications",
                      techSkills.career_insights.certifications
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={CertIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Certifications</h3>
                    <p className="card-decription">Boost Your Credibility!</p>
                  </div>
                </div>
                <div
                  className={`card ${
                    activeCard === "emerging_technologies" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "emerging_technologies",
                      techSkills.career_insights.emerging_technologies
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={TechIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Emerging Technologies</h3>
                    <p className="card-decription">Master New Tech Trends!</p>
                  </div>
                </div>
                <div
                  className={`card ${
                    activeCard === "interview_tips" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "interview_tips",
                      techSkills.career_insights.interview_tips
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={InterviewIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Interview Tips</h3>
                    <p className="card-decription">Interview Like a Pro!</p>
                  </div>
                </div>
                <div
                  className={`card ${
                    activeCard === "resume_tips" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "resume_tips",
                      techSkills.career_insights.resume_tips
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={TipsIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Resume Tips</h3>
                    <p className="card-decription">Build a Winning Resume!</p>
                  </div>
                </div>
                <div
                  className={`card ${
                    activeCard === "trending_roles" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "trending_roles",
                      techSkills.career_insights.trending_roles
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={RolesIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Trending Roles</h3>
                    <p className="card-decription">Explore In-Demand Roles!</p>
                  </div>
                </div>
            </div>
            </>
          )}
        </div>
      </div>
      {careerInsight && (
        <div className="insight-popup careerInsights">
          <div className="card-header head">
            <div className="head-row">
              <img className="headIcon" src={CareerDash} alt="head" />
              <h4 className="text">
              Unlock New Possibilities
              with Inspiring Insights and Trends!
              </h4>
            </div>
            <div className="icon">
              <div className="close-icon" onClick={closeInsights}>+</div>
            </div>
          </div>
          <div className="card-row">
            <div className="card-body">
            <div className="header-content">
                  <img className="trending-Icon" src={Choose} alt=""/>
                  Choose Category
            </div>
            {techSkills?.career_insights ? (
            <div className="content row">
              {techSkills.career_insights.career_development && (
                <div
                  className={`card ${
                    activeCard === "career_development" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "career_development",
                      techSkills.career_insights.career_development
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={TopIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Career Development</h3>
                    <p className="card-decription">Level Up Your Career!</p>
                  </div>
                </div>
              )}
              {techSkills.career_insights.certifications && (
                <div
                  className={`card ${
                    activeCard === "certifications" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "certifications",
                      techSkills.career_insights.certifications
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={CertIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Certifications</h3>
                    <p className="card-decription">Boost Your Credibility!</p>
                  </div>
                </div>
              )}
              {techSkills.career_insights.emerging_technologies && (
                <div
                  className={`card ${
                    activeCard === "emerging_technologies" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "emerging_technologies",
                      techSkills.career_insights.emerging_technologies
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={TechIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Emerging Technologies</h3>
                    <p className="card-decription">Master New Tech Trends</p>
                  </div>
                </div>
              )}
              {techSkills.career_insights.interview_tips && (
                <div
                  className={`card ${
                    activeCard === "interview_tips" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "interview_tips",
                      techSkills.career_insights.interview_tips
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={InterviewIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Interview Tips</h3>
                    <p className="card-decription">
                    Interview Like a Pro!</p>
                  </div>
                </div>
              )}
              {techSkills.career_insights.resume_tips && (
                <div
                  className={`card ${
                    activeCard === "resume_tips" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "resume_tips",
                      techSkills.career_insights.resume_tips
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={TopIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Resume Tips</h3>
                    <p className="card-decription">Build a Winning Resume!</p>
                  </div>
                </div>
              )}
              {techSkills.career_insights.trending_roles && (
                <div
                  className={`card ${
                    activeCard === "trending_roles" ? "active" : ""
                  } ${isDarkMode ? "dark":"light"}`}
                  onClick={() =>
                    handleCardClick(
                      "trending_roles",
                      techSkills.career_insights.trending_roles
                    )
                  }
                >
                  <div className="col-flex">
                    <img src={RolesIcon} alt="" className="card-icon" />
                    <h3 className="card-head">Trending Roles</h3>
                    <p className="card-decription">Explore In-Demand Roles!</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
            </div>
            <div className="detailed-content">
              <div className="header-content">
                <img className="trending-Icon" src={TrendIcon} alt=""/>
                 Trending Insights
              </div>
            {detailedContent?.map((item, index) => (
              <div key={index} className="detailed-card">
                <div className="insights-list">
                  <img src={InsightList} alt="insights" className="insights" />
                  Insight {(index+1)}
                </div>
                {Object.entries(item).map(([key, value], dataIndex) => (
                  <div key={dataIndex} className="inner">
                    <p className="insigts-para"><strong>{key} :</strong> {value}</p>
                  </div>
                ))}
              </div>
            ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CareerInsights;

import React, { useEffect, useState } from 'react';
import './interviewConfigModal.css';
import { setQuestionAnswer, setIsDarkMode, setDocId, setAnswers, setShowPro, setScenarioBased, setInterviewLevel, setIndustryInterview } from "../../../../store/actions/actions";
import { useDispatch, useSelector } from "react-redux";


const InterviewConfigModal = ({ onClose, handleSubmit, show, goToVideoInterviewPage }) => {
  const [level, setLevel] = useState('beginner');
  const { questionAnswer, isDarkMode, featuresToBlock, apiToken, apiTokenReady, scenarioBased, interviewLevel, industryInterview } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [jobDescription, setJobDescription] = useState('');
  useEffect(()=>{
    dispatch(setInterviewLevel(level));
    dispatch(setIndustryInterview(jobDescription));
  },[level,jobDescription])

  return (
    <div className="StartInterviewForm">
      <div className="InterviewFormInner">
        {show=="text-based"?(<>
            <button className="close-btn" onClick={onClose}>×</button>
            <h2 className="modal-title">Configure Your Interview</h2>
            <p className="modal-subtitle">Customize your interview experience</p>

            <div className="section">
              <label className="section-title">Interview Level</label>
              <div className="radio-group">
                {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                  <label key={lvl} className="radio-label">
                    <input
                      type="radio"
                      name="level"
                      value={lvl}
                      checked={level === lvl}
                      onChange={() => setLevel(lvl)}
                    />
                    <span className="radio-custom"></span>
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="section">
              <label className="section-title">Interview Format</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="format"
                    checked={scenarioBased}
                    onChange={() => dispatch(setScenarioBased(true))}
                  />
                  <span className="radio-custom"></span>
                  Scenario-based
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="format"
                    checked={!scenarioBased}
                    onChange={() => dispatch(setScenarioBased(false))}
                  />
                  <span className="radio-custom"></span>
                  Non-scenario-based
                </label>
              </div>
            </div>

            <div className="section">
              <label className="section-title">Job Description (Optional)</label>
              <textarea
                placeholder="Paste job description for more targeted questions..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              ></textarea>
              <p className="note">
                Providing a job description will help generate more relevant questions for your target role.
                If not provided, questions will be generated based on your resume and selected skill level.
              </p>
            </div>
            {show=="text-based"?(<>
            <button className="start-btn" onClick={handleSubmit}>Start Interview</button>

            </>):(<>
            <button className="start-btn" onClick={goToVideoInterviewPage}>Start Video Interview</button>
            </>)}
        </>):(<>
            <button className="close-btn" onClick={onClose}>×</button>
            <h2 className="modal-title">Configure Your Interview</h2>
            <p className="modal-subtitle">Customize your interview experience</p>

            <div className="section">
              <label className="section-title">Interview Level</label>
              <div className="radio-group">
                {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                  <label key={lvl} className="radio-label">
                    <input
                      type="radio"
                      name="level"
                      value={lvl}
                      checked={level === lvl}
                      onChange={() => setLevel(lvl)}
                    />
                    <span className="radio-custom"></span>
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="section">
              <label className="section-title">Interview Format</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="format"
                    checked={scenarioBased}
                    onChange={() => dispatch(setScenarioBased(true))}
                  />
                  <span className="radio-custom"></span>
                  Scenario-based
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="format"
                    checked={!scenarioBased}
                    onChange={() => dispatch(setScenarioBased(false))}
                  />
                  <span className="radio-custom"></span>
                  Non-scenario-based
                </label>
              </div>
            </div>

            <div className="section">
              <label className="section-title">Job Description (Optional)</label>
              <textarea
                placeholder="Paste job description for more targeted questions..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              ></textarea>
              <p className="note">
                Providing a job description will help generate more relevant questions for your target role.
                If not provided, questions will be generated based on your resume and selected skill level.
              </p>
            </div>

            {show=="text-based"?(<>
            <button className="start-btn" onClick={handleSubmit}>Start Interview</button>

            </>):(<>
            <button className="start-btn" onClick={goToVideoInterviewPage}>Start Video Interview</button>
            </>)}
        </>)}
        
      </div>
    </div>
  );
};

export default InterviewConfigModal;

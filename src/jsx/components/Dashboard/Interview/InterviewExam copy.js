import React, { Fragment, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'react-bootstrap'; // Assuming you're using react-bootstrap
import { Link } from "react-router-dom";
import "./banner.css";
import PrevIcon from "./icons/PrevIcon.svg";
import QuestionIcon from "./icons/QuestionIcon.svg";
import NextIcon from "./icons/NextIcon.svg";
import AnswerIcon from "./icons/AnswerIcon.svg";
import DraftIcon from "./icons/DraftIcon.svg";
import SubmitIcon from "./icons/submitIcon.svg";

import { ThemeContext } from "../../../../context/ThemeContext";
import { setQuestionAnswer, setIsDarkMode } from "../../../../store/actions/actions";

// Sun and Moon icons (as you already have)
const SunIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
     {/* Sun Core */}
     <circle cx="12" cy="12" r="5" fill="yellow" stroke="orange" strokeWidth="2" />
     {/* Sun Rays */}
     <g stroke="orange" strokeWidth="2">
       <line x1="12" y1="1" x2="12" y2="4" />
       <line x1="12" y1="20" x2="12" y2="23" />
       <line x1="1" y1="12" x2="4" y2="12" />
       <line x1="20" y1="12" x2="23" y2="12" />
       <line x1="4.5" y1="4.5" x2="6.5" y2="6.5" />
       <line x1="17.5" y1="17.5" x2="19.5" y2="19.5" />
       <line x1="4.5" y1="19.5" x2="6.5" y2="17.5" />
       <line x1="17.5" y1="6.5" x2="19.5" y2="4.5" />
     </g>
   </svg>
 );

const MoonIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
     <path d="M569 936q-119 0-201.5-82.5T285 652q0-113 72.5-192T526 338q6 0 11 .5t11 .5q-33 38-50 86t-17 101q0 122 87.5 210T757 824q11 0 21-.5t21-1.5q-58 79-140.5 121.5T569 936Z" />
   </svg>
);

const DashboardDark = () => {
  const dispatch = useDispatch();
  const { questionAnswer, isDarkMode } = useSelector((state) => state.profile);
  const { changeBackground } = useContext(ThemeContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [answers, setAnswers] = useState([]); 

  const userEmail = useSelector((state) => state.auth.auth.email);

  // Handling input for answers
  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < Object.keys(questionAnswer)?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Save answers as a draft
  const SaveToDraft = async () => {
    const payLoad = {
      email: userEmail,
      task: "submit_answers",
      questions: questionAnswer,
      answers,
      completed: false,
      scenario_based: true,
      level: "beginner",
      doc_id: "7298ZJK2fiz567bCKi7q",
    };
    try {
      const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/interview_prep_function_v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payLoad),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Draft saved:", data);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };
  console.log("question Answer:",questionAnswer);

  // Submit answers
  const SubmitExam = async () => {
    const payLoad = {
      email: userEmail,
      task: "submit_answers",
      questions: questionAnswer,
      answers,
      completed: true,
      scenario_based: true,
      level: "beginner",
      doc_id: "7298ZJK2fiz567bCKi7q",
    };
    try {
      const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/interview_prep_function_v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payLoad),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Exam submitted:", data);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  useEffect(() => {
    const currentTheme = isDarkMode ? "dark" : "light";
    changeBackground({
      value: currentTheme,
      label: currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1),
    });
  }, [isDarkMode]);

  const toggleTheme = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  return (
    <Fragment>
      <div className={`exam-page col-flex ${isDarkMode ? "Dark" : "Light"}`}>
        <div className="row-flex question-nav">
          {/* <button className="prev btn" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            <img className="icon" src={PrevIcon} alt="Previous" /> Previous Question
          </button>
          <button className="next btn" onClick={handleNextQuestion} disabled={currentQuestionIndex === Object.keys(questionAnswer).length - 1}>
            Next Question <img className="icon" src={NextIcon} alt="Next" />
          </button> */}
        </div>
        
        <div className="row-flex">
          <div className="question-tag e-tag">
            <img className="icon" src={QuestionIcon} alt="Question" />
            Question : {currentQuestionIndex + 1}
          </div>
        </div>
        
        <div className="col-flex">
          <h4 className="question-title">
            {questionAnswer && questionAnswer[currentQuestionIndex + 1]?.[currentQuestionIndex + 1]} 
          </h4>
          <div className="row-flex">
            <div className="answer-tag e-tag">
              <img className="icon" src={AnswerIcon} alt="Answer" />
              Answer Here
            </div>
          </div>
          <textarea
            className="answer-input"
            value={answers[currentQuestionIndex] || ""}
            onChange={handleAnswerChange}
            placeholder="Type your answer here..."
          />
        </div>

        <div className="row-flex form-nav">
          <button className="draft btn" onClick={SaveToDraft}>
            <img className="icon" src={DraftIcon} alt="Save Draft" /> Save Draft
          </button>
          <button className="submit btn" onClick={SubmitExam}>
            Submit Your Answers <img className="icon" src={SubmitIcon} alt="Submit" />
          </button>
        </div>
      </div>

      <div
        onClick={toggleTheme}
        style={{
          cursor: "pointer",
          padding: "10px",
          backgroundColor: "#ddd",
          borderRadius: "50%",
          position: "fixed",
          top: "50%",
          right: "0",
          display: "inline-block",
        }}
      >
        {isDarkMode ? <MoonIcon /> : <SunIcon />}
      </div>
    </Fragment>
  );
};

export default DashboardDark;
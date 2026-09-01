import React, { Fragment, useState, useEffect, useContext, } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./styles/aspireStyles.css?ver0.1";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";
import InterviewConfigModal from "./interviewConfigModal";

import CSavvyPageLoader from "../CsavvyPageLoad";
import CsavvyContentLoader from "../CsavvyContentLoader";
import SystemCheckPopup from "./systemCheckPopup";
import Feedback from "../Interview/feedbackInterviewList";
import { setQuestionAnswer, setDocId, setAnswers, setShowPro, setScenarioBased, setInterviewLevel, setIndustryInterview } from "../../../../store/actions/actions";

const AspireQuest = () => {
    const dispatch = useDispatch();
     // Get profile data and tech skills from Redux state
       const { questionAnswer, isDarkMode, apiToken, apiTokenReady, scenarioBased, interviewLevel, industryInterview } = useSelector((state) => state.profile);
    
       const [interviews, setInterviews] = useState([]);
       const [active, setActive] = useState('start');
       const [loaderText, setLoaderText] = useState('Loading Your History');
       const [viewType, setViewType] = useState('card');

       const [examVideoResultsPopup, setExamVideoResultsPopup] = useState(false);
       const [show, setShow] = useState(false);  // State to control the modal
       const [showPopup, setShowPopup] = useState(false);
       const [showLoader, setShowLoader] = useState(true);
       const [resultQuestion, setResultQuestion] = useState([]);
       const [examResultsPopup, setExamResultsPopup] = useState(false);
       const [resultData, setResultData] = useState([]);
       const [resultIndex, setResultIndex] = useState([]);
       const [tips, setTips] = useState([]);
       const [tipsPopup, setTipsPopup] = useState(false);
       const [incompleteInterviews, setIncompleteInterviews] = useState([]);
       const [upgradeReminder, setUpgradeReminder] = useState(false);
       const [startInterviewType, setStartInterviewType] = useState("text-based");
       function onClose(){
        setShow(false);
       }
       function goToVideoInterviewPage() {
          navigate("/videoInterview");
       }
       // Add a new state for video interview data
       const [videoInterviewData, setVideoInterviewData] = useState([]);

        function formatDateToUS(dateString) {
            const date = new Date(dateString);
            if (isNaN(date)) return "Invalid Date";

            const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
            const day = String(date.getDate()).padStart(2, "0");
            const year = date.getFullYear();

            return `${month}/${day}/${year}`;
        }

       function makePayment() {
          setUpgradeReminder(false);
          dispatch(setShowPro(true));
       }
       function openreminder() {
          setUpgradeReminder(true);
          console.log("upgradeReminder")
       }
       const fetchInterviews = async () => {
          const payload = {
             email: userEmail,
             task: "fetch_all_interviews"
          };
    
          try {
             const response = await fetch(
                "https://interview-prep-function-v4-980069659423.us-east1.run.app",
                {
                   method: "POST",
                   headers: {
                      "Content-Type": "application/json",
                      'Authorization': `Bearer ${apiToken}`,
                   },
                   body: JSON.stringify(payload)
                }
             );
    
             if (response.ok) {
                const data = await response.json();
                setTimeout(()=>{
                   setInterviews(data.response || []); // Assuming 'interviews' is the key in the response
                   setResultQuestion(data.response || [])
                   // If the response contains video interviews, store them
                   if (data.video_interview) {
                      setVideoInterviewData(data.video_interview);
                   }
                },1000)
             } else {
                console.error("Error fetching interviews");
             }
          } catch (error) {
             console.error("Error:", error);
          }
       };
       const fetchIncompleteInterviews = async () => {
          const payload = {
             email: userEmail,
             task: "fetch_incomplete_interviews"
          };
    
          try {
             const response = await fetch(
                "https://us-east1-foursssolutions.cloudfunctions.net/interview_prep_function_v2",
                {
                   method: "POST",
                   headers: {
                      "Content-Type": "application/json",
                      'Authorization': `Bearer ${apiToken}`,
                   },
                   body: JSON.stringify(payload)
                }
             );
    
             if (response.ok) {
                const data = await response.json();
                setIncompleteInterviews(data.response || []); // Assuming 'interviews' is the key in the response
                setLoaderText("Loading Your History");
                // setResultQuestion(data.response || [])
             } else {
                console.error("Error fetching interviews");
             }
          } catch (error) {
             console.error("Error:", error);
          }
       };
       const fetchTips = async () => {
          const payload = {
             email: userEmail,
             task: "fetch_tips"
          };
    
          try {
             const response = await fetch(
                "https://us-east1-foursssolutions.cloudfunctions.net/interview_prep_function_v2",
                {
                   method: "POST",
                   headers: {
                      "Content-Type": "application/json",
                      'Authorization': `Bearer ${apiToken}`,
                   },
                   body: JSON.stringify(payload)
                }
             );
    
             if (response.ok) {
                const data = await response.json();
                setTips(data.response[0] || []); // Assuming 'interviews' is the key in the response
             } else {
                console.error("Error fetching interviews");
             }
          } catch (error) {
             console.error("Error:", error);
          }
       };
    
       const startExam = async (interview) => {
        
          setShowLoader(true);
          const payLoad = {
            task: "fetch_specific_interview",
            email: userEmail,
            doc_id:interview.id
          };
    
          try {
             const response = await fetch(
                "https://interview-prep-function-v4-980069659423.us-east1.run.app",
                {
                   method: "POST",
                   headers: {
                      "Content-Type": "application/json",
                   },
                   body: JSON.stringify(payLoad),
                }
             );
    
             if (response.ok) {
                const data = await response.json();
                localStorage.removeItem("answers");
                localStorage.removeItem("questionAnswer");
                dispatch(setQuestionAnswer(data.response.questions));
                dispatch(setDocId(data.response.doc_id));
                dispatch(setAnswers(data.response.answers));
                dispatch(setInterviewLevel(data.response.level));
                console.log("question Answer:", questionAnswer);

                setTimeout(() => {
                     setShowLoader(false);
                    navigate("/interview-exam");
                    console.log("Create Exam data:", questionAnswer);
                }, 1000);
                setShow(false);
                
             } else {
                console.error("Error creating exam:", await response.text());
                alert("Failed to create exam. Please try again.");
             }
          } catch (error) {
             console.error("Error creating exam:", error);
             alert("Error creating exam: " + error);
             setShowLoader(false);
          } finally {
             setShow(false); // Close modal after submission
          }
       };

       // Helper function to safely get the interview date
       const getInterviewDate = (interview) => {
          // For video interviews, assume the date is stored in 'date'
          if (interview.type === "video") {
             return interview.date ? new Date(interview.date) : new Date(0);
          }
          // For text-based interviews
          if (interview.completed) {
             return interview.datetime ? new Date(interview.datetime) : new Date(0);
          } else {
             // Check for interview.data and fallback to 'date' if datetime is missing
             if (interview.data) {
                return interview.data.datetime
                   ? new Date(interview.data.datetime)
                   : interview.data.date
                      ? new Date(interview.data.date)
                      : new Date(0);
             }
          }
          return new Date(0);
       };
    
      //  const CreateExam = async () => {
      //     setShowLoader(true);
      //     setShowPopup(true);
      //     const payLoad = {
      //        email: userEmail,
      //        level: interviewLevel,
      //        scenario_based: scenarioBased,
      //        task: "create_exam",
      //     };
    
      //     try {
      //        const response = await fetch(
      //           "https://us-east1-foursssolutions.cloudfunctions.net/interview_prep_function_v2",
      //           {
      //              method: "POST",
      //              headers: {
      //                 "Content-Type": "application/json",
      //                 "Authorization": `Bearer ${apiToken}`,
      //              },
      //              body: JSON.stringify(payLoad),
      //           }
      //        );
    
      //        if (response.ok) {
      //           const data = await response.json();
      //           // Dispatch valid actions (ensure these action creators return plain objects)
      //           dispatch(setQuestionAnswer(data.response));
      //           console.log("questionsapi",data.response)
      //           dispatch(setDocId(data.doc_id));
      //           dispatch(setAnswers([]));
      //           localStorage.removeItem("answers");
      //           localStorage.removeItem("questionAnswer");
      //           console.log("Question Answer:", data.response);
    
      //           // Navigate after a delay
      //           setTimeout(() => {
      //           //    navigate("/interview-exam");
      //              console.log("Create Exam data:", data.response);
      //           }, 1000);
      //        } else {
      //           console.error("Error creating exam:", await response.text());
      //           alert("Failed to create exam. Please try again.");
      //        }
      //     } catch (error) {
      //        console.error("Error creating exam:", error);
      //        alert("Error creating exam: " + error);
      //        setShowLoader(false);
      //     } finally {
      //        setShow(false); // Close modal after submission
      //     }
      //  };
    
    
       const handleSubmit = (e) => {
          e.preventDefault();
          CreateExam();
          setShow(false); // Close modal after submission
       };
      
       const { changeBackground } = useContext(ThemeContext);
       const navigate = useNavigate();
       const userEmail = useSelector((state) => state.auth.auth.email);
    
       useEffect(() => {
          if (apiToken !== '' && userEmail !== '') {
             setTimeout(() => {
                setShowLoader(false);
             }, 400);
             setTimeout(() => {
                fetchInterviews();
                fetchTips();
             }, 1000);
             dispatch(setIndustryInterview(""));
             dispatch(setInterviewLevel(""));
             dispatch(setScenarioBased(false));
          }
       }, [apiTokenReady]);
    
       useEffect(() => {
          // Initial setup of theme when the component loads
          const currentTheme = isDarkMode ? "dark" : "light";
          changeBackground({
             value: currentTheme,
             label: currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1),
          });
       }, [isDarkMode]);
    
    
       function openResults(interview) {
         console.log("interviewId", interview)
         setResultData();
         setExamResultsPopup(true);
         //  setExamResultsPopup(true);
         //  setResultData(interview);
         //  setResultIndex(index);
          fetchTextSpecific(interview);
       }

       const fetchTextSpecific = async (interview) => {
          const payLoad = {
            task: "fetch_specific_interview",
            email: userEmail,
            doc_id:interview.id
          };
    
          try {
             const response = await fetch(
                "https://interview-prep-function-v4-980069659423.us-east1.run.app",
                {
                   method: "POST",
                   headers: {
                      "Content-Type": "application/json",
                   },
                   body: JSON.stringify(payLoad),
                }
             );
    
             if (response.ok) {
                const data = await response.json();
                console.log(data)
                setTimeout(()=>{
                   setResultData(data.response);
                },2500)
                
                
             } else {
                console.error("Error creating exam:", await response.text());
                alert("Failed to create exam. Please try again.");
             }
          } catch (error) {
             console.error("Error creating exam:", error);
             alert("Error creating exam: " + error);
          } finally {
          }
       };
    
       function jobNavigate() {
          navigate("/search-job");
       }
    
       /*------------------------------------------------------*/
    
    
       const [currentPage, setCurrentPage] = useState(1);
       const [recordsPerPage, setRecordsPerPage] = useState(4);
       useEffect(()=>{
         if(viewType=='card'){
            setRecordsPerPage(6);
         }
         else{
            setRecordsPerPage(4);
         }
       },[viewType])
    
       const normalizedInterviews = interviews.map((item) => ({
        id: item.doc_id,
        type: "text",
        completed: item.completed,
        datetime: item.datetime || item.data?.datetime || null,
        level: item.level || item.data?.level || "Unknown",
        status: item.completed ? "completed" : "in_progress",
        }));

        const normalizedVideoInterviews = videoInterviewData.map((item) => ({
        id: item.id,
        type: "video",
        completed: item.status === "completed",
        datetime: item.date || null,
        level: item.level || "Unknown",
        status: item.status,
        }));
        const combinedInterviews = [...normalizedInterviews, ...normalizedVideoInterviews].sort(
        (a, b) => new Date(b.datetime || 0) - new Date(a.datetime || 0)
        );

        const tableData = combinedInterviews.map((interview) => ({
            date: interview.datetime
                ? new Date(interview.datetime).toLocaleDateString()
                : "N/A",
            type: interview.type,
            level: interview.level,
            status: interview.status,
            action: interview.status !== "Completed", // show Resume link only for incomplete
        }));

    
       const totalRecords = combinedInterviews.length;
        const totalPages = Math.ceil(totalRecords / recordsPerPage);

        const paginatedInterviews = combinedInterviews.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
        );

        const data = paginatedInterviews.map((item) => ({
        date: item.datetime ? new Date(item.datetime).toLocaleDateString("en-US") : "N/A",
        type: item.type === "video" ? "Video Interview" : "Text Interview", 
        level: item.level || "Unknown",
        status: item.completed ? "Completed" : "In Progress",
        action: !item.completed, // show "Resume" only if not completed
        id: item.id
    }));

    const getPaginationRange = (totalPages, currentPage, siblingCount = 1) => {
        const totalNumbers = siblingCount * 2 + 5; // 5 = current + 2 dots + first + last
        const range = [];

        if (totalPages <= totalNumbers) {
            for (let i = 1; i <= totalPages; i++) {
            range.push(i);
            }
        } else {
            const left = Math.max(currentPage - siblingCount, 2);
            const right = Math.min(currentPage + siblingCount, totalPages - 1);

            range.push(1);

            if (left > 2) {
            range.push("...");
            }

            for (let i = left; i <= right; i++) {
            range.push(i);
            }

            if (right < totalPages - 1) {
            range.push("...");
            }

            range.push(totalPages);
        }

        return range;
    };

    
       // Pagination handlers
       const goToNextPage = () => {
          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
       };
    
       const goToPreviousPage = () => {
          if (currentPage > 1) setCurrentPage(currentPage - 1);
       };
    
    
    
       const getInterviewLevel = (interview) => {
          if (interview.type === "video") {
             return interview.level || "N/A";
          }
          return interview.completed ? (interview.level || "N/A") : (interview.data?.level || "N/A");
       };
    
       const getInterviewEmail = (interview) => {
          if (interview.type === "video") {
             return interview.email || "N/A";
          }
          return interview.completed ? (interview.email_id || "N/A") : (interview.data?.email_id || "N/A");
       };
    
       const getInterviewScore = (interview) => {
          if (interview.type === "video") {
             // For video interviews, use avg_score (as a number) if available.
             return typeof interview.avg_score === "number"
                ? Number(interview.avg_score).toFixed(1)
                : "N/A";
          }
          // For text-based interviews:
          if (interview.completed) {
             if (interview.rating && Array.isArray(interview.rating) && interview.rating.length > 0) {
                const avg =
                   interview.rating.reduce((sum, score) => sum + score, 0) /
                   interview.rating.length;
                return avg.toFixed(1);
             } else if (typeof interview.avg_score === "number") {
                return Number(interview.avg_score).toFixed(1);
             } else {
                return "N/A";
             }
          } else {
             return "0";
          }
       };
    
       const [docsId, setDocsId] = useState("");
       const [feedback, setFeedback] = useState([]);
       function interviewdetails(interviewData) {
          console.log("InterviewData", interviewData);
          setExamVideoResultsPopup(true);
          setDocsId(interviewData.id);
       }

       








const [questions, setQuestions] = useState([]);

const [loading, setLoading] = useState(false);

function convertToFlatArrayAndSet(structuredArray) {
  const flatArray = structuredArray.map(item => {
    const questionData = item.question;
    const questionNumber = Object.keys(questionData).find(
      key => key !== "initialize_code" && key !== "language"
    );

    return {
      [questionNumber]: questionData[questionNumber],
      initialize_code: questionData.initialize_code,
      language: questionData.language
    };
  });
  setQuestions(flatArray);
  console.log("flat",flatArray);
  setQuestions(flatArray);
}

useEffect(()=>{
   dispatch(setQuestionAnswer(questions));
   console.log("Questionchanged", questions)
   setTimeout(()=>{
      console.log("Qua ready", questionAnswer);
   },2000)
},[questions])

const CreateExam = async () => {
   setShowPopup(true);
  setLoading(true);
  

  try {
    const response = await fetch('https://interview-prep-function-v6-980069659423.us-east1.run.app', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        task: "create_exam",
        email: userEmail,
        level: interviewLevel,
        scenario_based: scenarioBased,
        job_desc: industryInterview
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep last incomplete line

      for (let line of lines) {
        line = line.trim();
        if (line.startsWith('data:')) {
          try {
            const jsonLine = JSON.parse(line.replace('data:', '').trim());

            if (jsonLine?.doc_id) {
              setDocId(jsonLine.doc_id);
              dispatch(setDocId(jsonLine.doc_id));
              console.log("latestDocId",docsId);
            }

            if (jsonLine?.content) {
              fullContent += jsonLine.content;
            }
          } catch (err) {
            // silently skip malformed lines
          }
        }
      }
    }

    // Parse final content
    const parsed = JSON.parse(fullContent);
    const entries = Object.entries(parsed).filter(([key]) => !isNaN(key));

    const newQuestions = entries.map(([id, text]) => ({
      id: parseInt(id),
      question: text,
    }));
    localStorage.removeItem("answers");
   localStorage.removeItem("questionAnswer");
   dispatch(setAnswers([]));
   console.log("Qua ready", "data cleared");
    convertToFlatArrayAndSet(newQuestions);
    console.log("newQuestions",newQuestions);
    
      
  } catch (error) {
    console.error("Error creating exam:", error);
   alert("Error creating exam: " + error);
   setShowLoader(false);
  } finally {
    setLoading(false);
    setShow(false); // Close modal after submission
  }
};











    return (
        <>
            <Fragment>

               {showLoader&& (<>
               <CSavvyPageLoader loaderText={"Getting Ready"}/>
               </>)}
               
                <div className="AspireQuest">
                    <div className="interview-Buttons ">
                        <button
                            className={`interview-btn ${active === 'start' ? 'active' : ''}`}
                            onClick={() => setActive('start')}
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play w-4 h-4" style={{marginRight:"6px"}}><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                            Start Interview
                        </button>
                        <button
                            className={`interview-btn ${active === 'history' ? 'active' : ''}`}
                            onClick={() => setActive('history')}
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history w-4 h-4" style={{marginRight:"6px"}}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path></svg>
                            Interview History
                        </button>
                    </div>
                    <div className="interviewData">
                        {active === 'start'?(<>
                            <div className="interviewCardHead">
                                <div className="lhs">
                                    <h3 className="mainHead">Select Interview Type</h3>
                                    <span className="interviewCardText">Choose the type of interview you want to practice</span>
                                </div>
                                <div className="rhs">
                                    <div className="button-row">
                                    </div>
                                </div>
                            </div>
                            <div className="interviewContent">
                                <div className="interviewChooseBox">
                                    <div className="interviewOption" onClick={()=>setShow("text-based")}>
                                        <div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square h-12 w-12 mb-2" data-lov-id="src/components/AspireQuestPanel.tsx:67:20" data-lov-name="MessageSquare" data-component-path="src/components/AspireQuestPanel.tsx" data-component-line="67" data-component-file="AspireQuestPanel.tsx" data-component-name="MessageSquare" data-component-content="%7B%22className%22%3A%22h-12%20w-12%20mb-2%22%7D"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
                                        <h5 className="title">Text-Based Interview</h5>
                                        <p className="desc">Answer questions in text format</p>
                                    </div>
                                    <div className="interviewOption" onClick={()=>setShow("video-based")}>
                                        <div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-video h-12 w-12 mb-2" data-lov-id="src/components/AspireQuestPanel.tsx:83:20" data-lov-name="Video" data-component-path="src/components/AspireQuestPanel.tsx" data-component-line="83" data-component-file="AspireQuestPanel.tsx" data-component-name="Video" data-component-content="%7B%22className%22%3A%22h-12%20w-12%20mb-2%22%7D"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg></div>
                                        <h5 className="title">Video-Based Interview</h5>
                                        <p className="desc">Answer questions with video recordings</p>
                                    </div>
                                </div>
                                <div className="interviewBrief">
                                    <div className="howitworks">
                                       <h6 className="mText">
                                          How it works
                                       </h6>
                                    </div>
                                    <div className="interviewBriefCard">
                                       <div className="briefCard">
                                          <div className="roundedNumbers">
                                             1
                                          </div>
                                          <h4 className="cardHead">
                                             Select interview type
                                          </h4>
                                          <p className="cardText">
                                             Choose between text or video-based interview formats
                                          </p>
                                       </div>
                                       <div className="briefCard">
                                          <div className="roundedNumbers">
                                             2
                                          </div>
                                          <h4 className="cardHead">
                                             Configure your session
                                          </h4>
                                          <p className="cardText">
                                             Customize difficulty and provide job description details
                                          </p>
                                       </div>
                                       <div className="briefCard">
                                          <div className="roundedNumbers">
                                             3
                                          </div>
                                          <h4 className="cardHead">
                                             Practice and improve
                                          </h4>
                                          <p className="cardText">
                                             Get feedback and improve your interview skills
                                          </p>
                                       </div>
                                    </div>
                                </div>
                            </div>
                        </>):(<>
                            <div className="interviewCardHead">
                                <div className="lhs">
                                    <h3 className="mainHead"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history w-4 h-4" style={{marginRight:"6px"}}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path></svg>Interview History</h3>
                                    <span className="interviewCardText">View your past and incomplete interviews</span>
                                </div>
                                <div className="rhs">
                                    <div className="button-row">
                                        <button className={`cardButton ${viewType == 'card'?"active":""}`} onClick={()=>{setViewType('card')}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid w-4 h-4 mr-2" style={{marginRight:"8px"}}><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>Card View</button>
                                        <button className={`cardButton ${viewType == 'table'?"active":""}`} onClick={()=>{setViewType('table')}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-list w-4 h-4 mr-2" style={{marginRight:"8px"}}><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect><path d="M14 4h7"></path><path d="M14 9h7"></path><path d="M14 15h7"></path><path d="M14 20h7"></path></svg>Table View</button>
                                    </div>
                                </div>
                            </div>
                            {interviews.length > 1 || videoInterviewData.length > 0 ? (
                            <>
                            <div className="interviewContent">

                              

                                {viewType=='card'?(
                                    <>
                                    <div className="interviewCardList"> 
                                        {paginatedInterviews.map((interview, index) => {
                                            const formattedDate = interview.datetime
                                                ? new Date(interview.datetime).toLocaleDateString("en-US")
                                                : "N/A";

                                            return (
                                                <div
                                                key={interview.id || index}
                                                className={`interviewCard ${interview.completed ? "green" : "amber"}`}
                                                onClick={() => {
                                                   if (interview.completed && interview.type=="text") {
                                                      openResults(interview);
                                                   } else if ( interview.type=="video") {
                                                      interviewdetails(interview);
                                                   } 
                                                }}
                                                >
                                                <div className="interviewHead">
                                                    <div className="lhs">
                                                    <div className="headIcon">
                                                        <div className="icon">
                                                         {interview.type === "video" ? (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video h-12 w-12 mb-2" data-lov-id="src/components/AspireQuestPanel.tsx:83:20" data-lov-name="Video" data-component-path="src/components/AspireQuestPanel.tsx" data-component-line="83" data-component-file="AspireQuestPanel.tsx" data-component-name="Video" data-component-content="%7B%22className%22%3A%22h-12%20w-12%20mb-2%22%7D"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>):(<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square h-12 w-12 mb-2" data-lov-id="src/components/AspireQuestPanel.tsx:67:20" data-lov-name="MessageSquare" data-component-path="src/components/AspireQuestPanel.tsx" data-component-line="67" data-component-file="AspireQuestPanel.tsx" data-component-name="MessageSquare" data-component-content="%7B%22className%22%3A%22h-12%20w-12%20mb-2%22%7D"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>)}
                                                            
                                                         </div>
                                                        <h5 className="title">
                                                        {interview.type === "video" ? "Video Interview" : "Text Interview"}
                                                        </h5>
                                                    </div>
                                                    <div className="interviewSubhead">{interview.level} Level</div>
                                                    </div>
                                                    <div className="rhs">
                                                    <span className={`interviewStatus ${interview.completed ? "green" : "amber"}`}>
                                                        {interview.completed ? "Completed" : "In Progress"}
                                                    </span>
                                                    </div>
                                                </div>
                                                <div className="cardDateButton">
                                                    <div className="date"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar-check h-3.5 w-3.5 mr-1" data-lov-id="src/components/InterviewHistory.tsx:347:26" data-lov-name="CalendarCheck" data-component-path="src/components/InterviewHistory.tsx" data-component-line="347" data-component-file="InterviewHistory.tsx" data-component-name="CalendarCheck" data-component-content="%7B%22className%22%3A%22h-3.5%20w-3.5%20mr-1%22%7D"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg>{formattedDate}</div>
                                                    {!interview.completed ?( <button className="actionButton" onClick={()=>startExam(interview)}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play w-4 h-4 mr-2" style={{width:"14px",marginRight:"6px"}}><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>Resume</button>):(<><button className="resultButton" ><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye" data-lov-id="src/components/ViewResultsButton.tsx:16:6" data-lov-name="Eye" data-component-path="src/components/ViewResultsButton.tsx" data-component-line="16" data-component-file="ViewResultsButton.tsx" data-component-name="Eye" data-component-content="%7B%7D"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>View Details</button></>)}
                                                </div>
                                                </div>
                                            );
                                        })}

                                    </div>
                                    </>
                                    ):(
                                    <>
                                    <div className="interview-table-container">
                                        <table className="interview-table">
                                            <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Level</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {data.map((row, idx) => (
                                                <tr key={idx}>
                                                <td>{row.date}</td>
                                                <td>
                                                   <span className="icon">
                                                      {row.type=='Video Interview'?(
                                                         <>
                                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video h-12 w-12 mb-2" data-lov-id="src/components/AspireQuestPanel.tsx:83:20" data-lov-name="Video" data-component-path="src/components/AspireQuestPanel.tsx" data-component-line="83" data-component-file="AspireQuestPanel.tsx" data-component-name="Video" data-component-content="%7B%22className%22%3A%22h-12%20w-12%20mb-2%22%7D"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
                                                         </>
                                                         ):(
                                                         <>
                                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square h-4 w-4" data-lov-id="src/components/InterviewHistory.tsx:99:11" data-lov-name="MessageSquare" data-component-path="src/components/InterviewHistory.tsx" data-component-line="99" data-component-file="InterviewHistory.tsx" data-component-name="MessageSquare" data-component-content="%7B%22className%22%3A%22h-4%20w-4%22%7D"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                         </>
                                                      )}
                                                      
                                                </span> {row.type}</td>
                                                <td>{row.level}</td>
                                                <td>
                                                    {row.status === 'Completed' ? (
                                                    <span className="status completed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check h-3 w-3 mr-1" data-lov-id="src/components/InterviewHistory.tsx:274:28" data-lov-name="Check" data-component-path="src/components/InterviewHistory.tsx" data-component-line="274" data-component-file="InterviewHistory.tsx" data-component-name="Check" data-component-content="%7B%22className%22%3A%22h-3%20w-3%20mr-1%22%7D"><path d="M20 6 9 17l-5-5"></path></svg> Completed</span>
                                                    ) : (
                                                    <span className="status in-progress"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock h-3 w-3 mr-1" data-lov-id="src/components/InterviewHistory.tsx:278:28" data-lov-name="Clock" data-component-path="src/components/InterviewHistory.tsx" data-component-line="278" data-component-file="InterviewHistory.tsx" data-component-name="Clock" data-component-content="%7B%22className%22%3A%22h-3%20w-3%20mr-1%22%7D"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> In Progress</span>
                                                    )}
                                                </td>
                                                <td>
                                                   {console.log("rowCheck",row)}
                                                   {row.action ? (
                                                      <> <a href="#" className="resume-link"  onClick={()=>startExam(row)}>
                                                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" style={{width:"14px", marginRight:"6px"}} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play w-4 h-4 mr-2"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                                                         Resume</a>
                                                      </>
                                                    ) : (
                                                       <><Link className="result-link"
                                                       onClick={() => {
                                                            if (row.status=="Completed" && row.type=="Text Interview") {
                                                               openResults(row);
                                                            } else if ( row.type=="Video Interview") {
                                                               interviewdetails(row);
                                                            } 
                                                         }}
                                                         ><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye" data-lov-id="src/components/ViewResultsButton.tsx:16:6" data-lov-name="Eye" data-component-path="src/components/ViewResultsButton.tsx" data-component-line="16" data-component-file="ViewResultsButton.tsx" data-component-name="Eye" data-component-content="%7B%7D"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>View Details</Link>
                                                      </>
                                                    )}
                                                   
                                                </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                        <p className="footer-note">A list of your recent interviews.</p>
                                    </div>
                                    </>
                                )}
                                <ul className="jobPagination">
                                    <li
                                        className={`page-btn ${currentPage === 1 ? "disabled" : ""}`}
                                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                    >
                                        ‹ Previous
                                    </li>

                                    {getPaginationRange(totalPages, currentPage).map((page, idx) => (
                                        <li
                                        key={idx}
                                        className={`page-number ${currentPage === page ? "active" : ""} ${page === "..." ? "dots" : ""}`}
                                        onClick={() => typeof page === "number" && setCurrentPage(page)}
                                        >
                                        {page}
                                        </li>
                                    ))}

                                    <li
                                        className={`page-btn ${currentPage === totalPages ? "disabled" : ""}`}
                                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                    >
                                        Next ›
                                    </li>
                                </ul>

                                
                            </div>
                            </>):(<>
                              <div className="interviewContent">
                                 <CsavvyContentLoader loaderText={loaderText}/>
                              </div>
                            </>)}
                        </>)}

                        
                        {/* <button className="btn" onClick={handleCreateExam}>Create Exam</button> */}
                        
                    </div>
                </div>
                {show&&(<><InterviewConfigModal show={show} onClose={onClose} handleSubmit={handleSubmit} goToVideoInterviewPage={goToVideoInterviewPage} /></>)}
                <SystemCheckPopup visible={showPopup} setShowPopup={setShowPopup} onClose={() => setShowPopup(false)} />
                  {examResultsPopup && (
                     <>
                        <div className={`row interview-prep ${isDarkMode === false ? "Light" : "Dark"}`}>
                           <div className={`resumeOuter ${resultData?"fullWidthPopup":""} ${isDarkMode === false ? "light" : "dark"}`}>
                              <div className="resumeTab whiteResume">
                                 {resultData?(<>
                                 
                                 
                                 <Link className="pop-close" >
                                    <div className="close" onClick={() => setExamResultsPopup(false)}>+</div>
                                 </Link>
                                 </>):(<></>)}
                                 <div className="col-flex">
                                    {resultData?(<>
                                    
                                    <h4 className="fs-18 text-black font-w600 mb-3">Exam Results Overview</h4>
                                    <div className="fwline"></div>
                                    </>):(<></>)}
                                    {/* <div className="row-flex">
                                 <Link to="#" className="pop-close" onClick={()=> setShowPopup(false)}>View Exam Overview</Link>
                                 <Link to="/interview-prep" className="pop-close" onClick={()=> setShowPopup(false)}>Go to Dashboard</Link>
                              </div> */}
                                    <div className="col-flex results-summary card">
                                       {resultData?(<>
                                       {resultData.questions.map((interview, index) => (
                                          <div key={index} className="col-flex">
                                             {console.log("QuestionAnswer", resultData.questions[index][index + 1])}
                                             <div className="text question fw-bold text-primary">
                                                <span className="QuestionName">
                                                   <span className="questionIcon">
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-help h-5 w-5 text-blue-600" data-lov-id="src/components/ExamQuestion.tsx:34:10" data-lov-name="CircleHelp" data-component-path="src/components/ExamQuestion.tsx" data-component-line="34" data-component-file="ExamQuestion.tsx" data-component-name="CircleHelp" data-component-content="%7B%22className%22%3A%22h-5%20w-5%20text-blue-600%22%7D"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
                                                   </span>
         
                                                   Question {index + 1} : {resultData.questions[index][index + 1] || "N/A"}</span>
                                             </div>
                                             <div className="text answer">
         
                                                <span className="AnswerName">
                                                   <span className="answerIcon">
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text h-4 w-4 text-gray-600" data-lov-id="src/components/ExamQuestion.tsx:46:12" data-lov-name="FileText" data-component-path="src/components/ExamQuestion.tsx" data-component-line="46" data-component-file="ExamQuestion.tsx" data-component-name="FileText" data-component-content="%7B%22className%22%3A%22h-4%20w-4%20text-gray-600%22%7D"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                                                   </span>
                                                   Answer : {resultData.answers[index] || "No Answer"}</span>
                                             </div>
                                             <div className="text rating">
                                                <span className="RatingName">
                                                   <span className="ratingIcon">
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-4 w-4 text-gray-600" data-lov-id="src/components/ExamQuestion.tsx:57:12" data-lov-name="Star" data-component-path="src/components/ExamQuestion.tsx" data-component-line="57" data-component-file="ExamQuestion.tsx" data-component-name="Star" data-component-content="%7B%22className%22%3A%22h-4%20w-4%20text-gray-600%22%7D"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                                                   </span>
         
                                                   Rating : 
                                                   {/* {resultData.rating[index] || "N/A"} */}
                                                   {[...Array(10)].map((_, i) => {
                                                      let color = "#d1d5db";
                                                      const rating = resultData.rating[index];
                                                      if (rating >= i + 1) {
                                                         if (rating <= 2) color = "#ef4444";
                                                         else if (rating <= 7) color = "#facc15";
                                                         else color = "#22c55e";
                                                      }
                                                      return (
                                                         <svg
                                                         key={i}
                                                         xmlns="http://www.w3.org/2000/svg"
                                                         width="18"
                                                         height="18"
                                                         viewBox="0 0 24 24"
                                                         fill={color}
                                                         stroke={color}
                                                         strokeWidth="2"
                                                         strokeLinecap="round"
                                                         strokeLinejoin="round"
                                                         style={{ marginRight: "2px", verticalAlign: "middle" }}
                                                         >
                                                         <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                                                         </svg>
                                                      );
                                                   })}
                                                   </span>
                                             </div>
                                             <div className="text feedback">
                                                <span className="feedBackName">
                                                   <span className="feedbackIcon">
                                                      <svg data-lov-id="src/components/ExamQuestion.tsx:81:12" data-lov-name="svg" data-component-path="src/components/ExamQuestion.tsx" data-component-line="81" data-component-file="ExamQuestion.tsx" data-component-name="svg" data-component-content="%7B%7D" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-blue-600"><path data-lov-id="src/components/ExamQuestion.tsx:96:14" data-lov-name="path" data-component-path="src/components/ExamQuestion.tsx" data-component-line="96" data-component-file="ExamQuestion.tsx" data-component-name="path" data-component-content="%7B%7D" d="M17 6.1H3"></path><path data-lov-id="src/components/ExamQuestion.tsx:97:14" data-lov-name="path" data-component-path="src/components/ExamQuestion.tsx" data-component-line="97" data-component-file="ExamQuestion.tsx" data-component-name="path" data-component-content="%7B%7D" d="M21 12.1H3"></path><path data-lov-id="src/components/ExamQuestion.tsx:98:14" data-lov-name="path" data-component-path="src/components/ExamQuestion.tsx" data-component-line="98" data-component-file="ExamQuestion.tsx" data-component-name="path" data-component-content="%7B%7D" d="M15.1 18H3"></path></svg>
                                                   </span>
                                                   
                                                   Feedback :{` `}
                                                   {resultData.feedback_comments[index] || "No Feedback"}&nbsp;
                                                   
                                                   </span>
                                             </div>
                                             <hr className="my-3" />
                                          </div>
                                       ))}
                                       </>):(<>
                                       <CsavvyContentLoader loaderText={"Loading Interview Results"}/>
                                       </>)}
                                       
         
                                    </div>
         
                                 </div>
                              </div>
                           </div>
                        </div>
                     </>
                  )}
                  {examVideoResultsPopup && (
                  <>
                     <div className={`row interview-prep ${isDarkMode === false ? "Light" : "Dark"}`}>
                        <div className={`resumeOuter ${examVideoResultsPopup?"fullWidthPopup":""} ${isDarkMode === false ? "light" : "dark"}`}>
                           <div className="resumeTab">
                              {examVideoResultsPopup?(<>
                                 <Link className="pop-close" >
                                    <div className="close" onClick={() => setExamVideoResultsPopup(false)}>+</div>
                                 </Link>
                              </>):(<></>)}
                              
                              <div className="col-flex">
                                 {examVideoResultsPopup?(<>
                              <h4 className="fs-18 text-black font-w600 mb-3">Exam Results Overview</h4>
                                 <div className="fwline"></div>
                              </>):(<></>)}
                                 
                                 {/* <div className="row-flex">
                              <Link to="#" className="pop-close" onClick={()=> setShowPopup(false)}>View Exam Overview</Link>
                              <Link to="/interview-prep" className="pop-close" onClick={()=> setShowPopup(false)}>Go to Dashboard</Link>
                           </div> */}
                                 <div className="feedbackbox  videoInterview">
      
                                    {examVideoResultsPopup && (<><Feedback docsId={docsId} feedback={feedback} setFeedback={setFeedback} /></>)}
                                 </div>
      
      
                              </div>
                           </div>
                        </div>
                     </div>
                  </>
               )}
                
            </Fragment>
        </>
    );
}

export default AspireQuest;

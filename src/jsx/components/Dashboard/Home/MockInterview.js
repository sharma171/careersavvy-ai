import React, { Fragment , useEffect, useRef, useState, useContext} from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./msgCss.css"
import { Link } from "react-router-dom";
import InfoIcon from "./info-icon.png";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import GptIcon from '../SearchJobs/aiIcon.gif';
import MockIntIcon from "./mockInterview.png";
// import upcomingMessage from "./upcomingMessage.png";
import { setIsDarkMode , setFileResume  } from "../../../../store/actions/actions";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import CoPilotIcon from "./images/CoPilotIcon.png";
import ManualCoPilotIcon from "./images/manualCoPilotIcon.png";
import StopCoPilotIcon from "./images/StopCoPilot.png";
import speakNowIcon from "./images/SpeakNowIcon.png";
import messageIcon from "./images/messageIcon.png";
import ClearChatIcon from "./images/clearChat.png";


import { ThemeContext } from "../../../../context/ThemeContext";
import { useStream } from 'react-streaming';

import AutoLanguageDetector from "./mockInterviewComponents/AutoLanguageDetector";

import  {VoiceRecognitionHandler}  from "./mockInterviewComponents/VoiceRecognitionHandler";


const Home = () => {
   const [openMsg, setOpenMsg] = useState(false)
   const dispatch = useDispatch
   const { changeBackground } = useContext(ThemeContext);	
   const [loaderAnimation, setLoaderAnimation] = useState(true);
   const { isDarkMode, apiToken, apiTokenReady, fileResume } = useSelector((state) => state.profile);
   const [ copilotShown, setCopilotShown ] = useState(false);
   const [ autoPilotShown, setAutoPilotShown ] = useState(false);
   
   useEffect(() => {
      // Initial setup of theme when the component loads
      const currentTheme = isDarkMode ? "dark" : "light";
      changeBackground({
        value: currentTheme,
        label: currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1),
      });
    }, [isDarkMode]);
  
    const toggleTheme = () => {
      dispatch(setIsDarkMode(!isDarkMode)); // Dispatch the Redux action
      console.log("Toggled theme to:", !isDarkMode ? "Dark" : "Light");
    };
  
	
   const navigate = useNavigate();
   const userEmail = useSelector(state => state.auth.auth.email);
   const token = useSelector(state => state.auth.auth.token);
   const [GPTsession_id, setGPTSession_id] = useState("");
   const [message, setMessage] = useState("");
   const [gptResponse, setGptResponse] = useState("");
   const [interviewQuestions, setInterviewQuestions] = useState([]);
   const [isListening, setIsListening] = useState(false);

   const [questions, setQuestions] = useState(true);
   const [compLoading, setCompLoading] = useState(false);
   const [highlightactive, setHighlightactive] = useState(true);
   const [fileNames, setFileNames] = useState('');
   const [aiChatSuggestions, setAiChatSuggestions] = useState(false);
   const [indexCounter, setIndexCounter] = useState(0);
   const [speakInitialise, setSpeakInitialise] = useState(false);
   const streamData = useStream(gptResponse);
   const [speechText, setSpeechText] = useState("");
   const [voiceText, setVoiceText] = useState("");
   const [voiceSpeech,setVoiceSpeech] = useState(false);
   const [manualCoPilot, setManualCoPilot] = useState(false);
   const [hideQuestion, setHideQuestion] = useState(false);
  useEffect(()=>{
   if(autoPilotShown){
      handleSend(speechText);
   }
  },[speechText])
   function clearChats() {
      setInterviewQuestions([]);
      setIndexCounter(0);
   }
   function speakNowShower() {
      if(autoPilotShown==false){
         setSpeakInitialise(true);
         setHideQuestion(true);
         // setAutoPilotShown(true);
      }
   }
   const fileApi = "https://us-east1-foursssolutions.cloudfunctions.net/send_resume_details_front_end_v2"
   useEffect(() => {
      if (userEmail!=='' && apiTokenReady === true) {
         if (fileResume!==""){
            loadSession();
            setTimeout(()=>{
               setLoaderAnimation(false);
            },3500)
         }
      }
   }, [apiTokenReady, fileResume]);
   useEffect(()=>{
      setTimeout(() => {
         setHighlightactive(false);
      }, 15000); 
   },[highlightactive])
      // Function to increment the counter
   const incrementCounter = () => {
      setIndexCounter(prevIndex => prevIndex + 1);
   };
   
   const loadSession = async () => {
      var text = "I'm going to start my mock interview and prepare for it ?";
      if (text.trim() === "") return; // Prevent sending empty messages

      const payload = {
         transcribed_text: text,
         resume_load: true,
         email_id: userEmail, // Use the logged-in user's email
         document_name: fileResume,
         session_id: ""
      };

      try {
         const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/audio_to_text_response_gpt_v2', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
         });

         const data = await response.json();
         if (text !== data.response) { // Only add user question
            setInterviewQuestions([...interviewQuestions, { question: text, answer: data.response }]);
            incrementCounter();
         }
         setGptResponse(data.response);
         setGPTSession_id(data.session_id)
         // console.log(data.response);
         setMessage("");
         setAiChatSuggestions(true);
         setTimeout(()=>{
            setAiChatSuggestions(false)
         },5000);
      } catch (error) {
         console.error("gpt first response Error:", error);
      }
   };
   const [responseLoading, setResponseLoading] = useState(false);
   const chatSuggestionsClick = async (text) =>{
      if (text.trim() === "") return; // Prevent sending empty messages
      
      setResponseLoading(true);

      setAiChatSuggestions(false);
      
      const Suggestionspayload = {
         transcribed_text: text,
         resume_load: true,
         email_id: userEmail, // Use the logged-in user's email
         document_name: fileResume,
         session_id: GPTsession_id
      };

      try {
         const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/audio_to_text_response_gpt_v2', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json',
            },
            body: JSON.stringify(Suggestionspayload)
         });

         const data = await response.json();
         if (text !== data.response) { // Only add user question
            setInterviewQuestions([...interviewQuestions, { question: text, answer: data.response }]);
        }
        setResponseLoading(false);
        setGptResponse(data.response);
        setMessage("");
      } catch (error) {
         console.error("gpt first response Error:", error);
      }
      
   }

   const [response, setResponse] = useState(""); // Final processed response

   // Add a ref for the message container
   const messageContainerRef = useRef(null);

   // Add scroll to bottom function
   const scrollToBottom = () => {
      if (messageContainerRef.current) {
         messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }
   };
   

   const handleSend = async (text) => {
      if(text===""){
         return
      }
      setResponseLoading(true);
      setMessage("");
      incrementCounter();
      setVoiceSpeech(false);
      setVoiceText("");
      setResponse(""); // Clear previous response
      let streamResponse = ""; // Track streaming response
      let correctedText = text; // Initialize with original text
    
      if (text.trim() === "") return;
    
      // Create a new question object
  const newQuestion = { question: text, answer: null };
  
  
  // Update interview questions array with the new question at the current index
  setInterviewQuestions(prevQuestions => {
    const updatedQuestions = [...prevQuestions];
    updatedQuestions[indexCounter] = newQuestion;
    return updatedQuestions;
  });
      
      const payload = {
        transcribed_text: text,
        resume_load: true,
        email_id: userEmail,
        document_name: fileResume,
        session_id: GPTsession_id,
      };
    
      try {
        const response = await fetch(
          "https://us-east1-foursssolutions.cloudfunctions.net/audio_to_text_response_gpt_streaming_v2",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
    
        if (!response.body) throw new Error("ReadableStream not supported");
    
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";
    
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          fullResponse += chunk;
    
         // Handle streaming chunks
            if (chunk.includes('"chunk"')) {
            const matches = chunk.match(/"chunk":\s*"([^"]*)"/g);
            if (matches) {
               // Process and filter chunks
               const filteredChunks = matches
                  .map(match =>
                  match
                     .replace(/"chunk":\s*"/, "") // Remove "chunk":
                     .replace(/"$/, "")          // Remove trailing double-quote
                     .replace(/\\}/g, "")        // Remove escaped curly braces (\})
                     .replace(/}$/, "")          // Remove trailing unescaped curly brace (})
                     .replace(/\\/g, "")         // Remove all backslashes (\)
                  );

               // Join valid chunks
               if (filteredChunks.length > 0) {
                  let streamText = filteredChunks.join("").trim(); // Combine and trim

                  // Beautify the streamText
                  streamText = beautifyStreamText(streamText);

                  streamResponse += streamText; // Append to response
                  setResponse(streamResponse);  // Update the UI or response state

                  // Update the interview question with the latest response
                  const newAnswer = { question: text, answer: streamResponse };

                  setInterviewQuestions(prevQuestions => {
                  const updatedQuestions = [...prevQuestions];
                  updatedQuestions[indexCounter] = newAnswer;
                  return updatedQuestions;
                  });
                  // Scroll to bottom after each update
                  setTimeout(scrollToBottom, 100);
               }
            }
            }

 
 // Function to beautify the stream text dynamically
 function beautifyStreamText(text) {
   // Define dynamic formatting rules
   const formattingRules = [
     {
       pattern: /(\d+\.\s\*\*.+?\*\*)/g, // Match numbered lists
       replaceWith: "\n$1"               // Add a line break before numbered items
     },
     {
       pattern: /(In my experience,|Java development offers several benefits, including)/g, // Match section headings
       replaceWith: "\n\n$1"            // Add paragraph spacing
     },
     {
       pattern: /\s{2,}/g,              // Match extra spaces
       replaceWith: " "                 // Replace with a single space
     },
     {
       pattern: /: \d+\.\s/g,           // Match colons followed by numbered lists
       replaceWith: ":\n  "             // Add line breaks for cleaner formatting
     }
   ];
 
   // Apply all formatting rules dynamically
   formattingRules.forEach(rule => {
     text = text.replace(rule.pattern, rule.replaceWith);
   });
 
   return text.trim(); // Ensure final output is clean
 }
 
 
    
          
          // Handle corrected text
          if (chunk.includes('"corrected_text"')) {
            const match = chunk.match(/"corrected_text":\s*"([^"]*)"/);
            if (match && match[1]) {
              correctedText = match[1].replace(/\\/g, '');
              // Update the question with corrected text while keeping the current stream response
              const newAnswer = { question: correctedText, answer: streamResponse };
              setInterviewQuestions(prevQuestions => {
                const updatedQuestions = [...prevQuestions];
                updatedQuestions[indexCounter] = newAnswer;
                return updatedQuestions;
              });
            }
          }
          // Handle final GPT response
          if (chunk.includes('"gpt_response"')) {
            const match = chunk.match(/"gpt_response":\s*"([^"]*)"/);
            if (match && match[1]) {
              const cleanedResponse = match[1].replace(/\\/g, '');
              setResponse(cleanedResponse);
              // Final update with corrected text and complete response
              const newAnswer = { question: correctedText, answer: cleanedResponse };
              setInterviewQuestions(prevQuestions => {
                const updatedQuestions = [...prevQuestions];
                updatedQuestions[indexCounter] = newAnswer;
                return updatedQuestions;
              });
              
              setTimeout(scrollToBottom, 100);
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setResponseLoading(false);
      }
    };
   // Add useEffect to scroll when messages update
   useEffect(() => {
      scrollToBottom();
   }, [interviewQuestions, voiceSpeech]);
   const decrementCounter = () => {
      setIndexCounter((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    };
  
    useEffect(() => {
      console.log(interviewQuestions);
      
      const hasNoNeedAnswer = interviewQuestions.some(
        item => item?.answer === "No need for any answer."
      );
    
      if (hasNoNeedAnswer) {
        setInterviewQuestions(prevQuestions => {
          if (prevQuestions.length > 0) {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions.pop(); // Remove the last question safely
            return updatedQuestions;
          }
          return prevQuestions;
        });
        decrementCounter();
      }
    }, [interviewQuestions]);
    


//   const handleKeyDown = (e) => {
//       if (e.key === 'Enter') {
//           e.preventDefault(); // Prevent newline character in input field
//           handleSend(message);
//           setMessage("")
//       }
//       else if (e.key === 'ArrowDown') {
//           toggleListening();
//       }
//   };

  const renderResponse = (response) => {
  if (!response) return null; // Handle null or undefined response

  // Remove any trailing `}` from the response
  const cleanedResponse = response.trim().endsWith('}')
    ? response.trim().slice(0, -1).trim()
    : response.trim();

  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

  // Split response into parts using the regex
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(cleanedResponse)) !== null) {
    // Push text before the code block
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: cleanedResponse.slice(lastIndex, match.index) });
    }

    // Push the code block
    parts.push({
      type: 'code',
      language: match[1] || 'text',
      content: match[2],
    });

    lastIndex = codeBlockRegex.lastIndex;
  }

  // Push remaining text after the last code block
  if (lastIndex < cleanedResponse.length) {
    parts.push({ type: 'text', content: cleanedResponse.slice(lastIndex) });
  }

  return parts.map((part, index) => {
    if (part.type === 'code') {
      return (
        <SyntaxHighlighter key={index} language={part.language} style={coy}>
          {part.content}
        </SyntaxHighlighter>
      );
    }
    return <span key={index}>{part.content}</span>;
  });
};


  useEffect(() => {
      setInterval(() => {
          setCompLoading(true);
      }, 400);
  }, []);

  function instructionClicked() {
   setHighlightactive(false);
  }
  function openInterview() {
   setQuestions(true);
  }
  function openInstructions() {
   setHighlightactive(true);
  }

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  

  
  const timeoutRef = useRef(null);
  const lastTranscriptRef = useRef("");
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  useEffect(() => {
   // Update message when transcript changes
   setMessage(transcript);
   if (isListening) {

   // // Clear previous timeout if transcript changes
   // if (timeoutRef.current) {
   //   clearTimeout(timeoutRef.current);
   // }

   // // Set a new timeout for 1 second
   // timeoutRef.current = setTimeout(() => {
   //   if (lastTranscriptRef.current === transcript && transcript.trim() !== "") {
   //     handleSend(message);
   //     resetTranscript();
   //     setIsListening(true);
   //   }
   // }, 1000);

   // // Update last transcript
   // lastTranscriptRef.current = transcript;

   // return () => {
   //   if (timeoutRef.current) {
   //     clearTimeout(timeoutRef.current);
   //   }
   // }
   ;}
 }, [transcript, isListening]);

 
  
 const toggleListening = () => {
    if (isListening) {
      // Stop listening
      SpeechRecognition.stopListening();
      setIsListening(false);

      // Handle sending the transcript when stopping
      if (transcript.trim() !== "") {
         setMessage(transcript);
         handleSend(transcript);
        resetTranscript();
      }

      // Release microphone resources
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      });

      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
      }
    } else {
      // Start listening
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
      speakNowShower()
      // Initialize audio context for visualization
      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
        });
      }

      setIsListening(true);

      // Automatically handle send if no speech detected for 15 seconds
      setTimeout(() => {
        if (transcript.trim() !== "") {
          handleSend(transcript);
          resetTranscript();
          setMessage("");
        }
      }, 15000);
    }
  };

  const inputRef = useRef(null); // Ref for the input element

  const handleInputChange = (e) => {
      setMessage(e.target.value);
  };

//   useEffect(()=>{
//    console.log(interviewQuestions);
//   },[interviewQuestions]);

useEffect(() => {
   const handleKeyDown = (event) => {
     // Prevent toggling when typing inside the textarea
     if (event.target.tagName === "TEXTAREA") return;
     if(copilotShown==false) return;

     if (event.code === "Space") {
       event.preventDefault(); // Prevents scrolling when pressing space
       if (isListening) {
            mCopilotClose();
            resetTranscript();
       } else {
         mCopilotOpen();
       }
     }
   };

   window.addEventListener("keydown", handleKeyDown);
   return () => {
     window.removeEventListener("keydown", handleKeyDown);
   };
 }, [isListening, toggleListening, setManualCoPilot]);

   function mCopilotOpen() {
      setManualCoPilot(true);
      if(copilotShown==false){
            setSpeakInitialise(true);
            setCopilotShown(true);
      }
      else if(copilotShown==true){
            toggleListening();
            setSpeakInitialise(false);
      }
   }
   function mCopilotClose(){
      if(isListening){
         setManualCoPilot(false);
         toggleListening();
         resetTranscript();
         setTimeout(()=>{
            setMessage('');
            resetTranscript()

         },1000)
      }
      
   }

   function autoPSpeak() {
      setSpeakInitialise(false);
      setAutoPilotShown(true);
      setHideQuestion();
      setVoiceText("")
   }

   return (
      <Fragment>
         <div className="row mockInterview">
            <div className={` ${questions===false && highlightactive===true? "col-md-12 mobile" : "col-md-12"}  ${questions===true && highlightactive===false? "col-md-12" : "col-md-12"}  ${questions===false && highlightactive===false? "col-md-12 mobile" : "col-md-12"}`}>
               <div className="card interview-card gpt-copilot">
                  {speakInitialise && (
                     <>
                        <div className="speakInitialise">
                           <img src={ManualCoPilotIcon} alt="speak"/>
                           
                           <span className="speakText">
                           {manualCoPilot?"Press the spacebar or click 'Stop Manual Co-Pilot' to get answers. Use Manual Co-Pilot to control the pace of your mock interview manually. This is recommended if you prefer to review and respond at your own speed.":"Now you can speak freely! Auto Co-Pilot allows you to respond to questions naturally, using voice input. If you experience frequent pauses while speaking, consider using Manual Co-Pilot for better control"}
                           
                           </span>
                           {manualCoPilot?(<>
                              <button className="speakbutton" onClick={()=>{mCopilotOpen();}}>I Understand</button>
                           </>):(<>
                              <button className="speakbutton" onClick={()=>{autoPSpeak();}}>I Understand</button>
                           </>)}
                           
                        </div>
                     </>
                  )}
                  <>
                     <div className="CoPilotButtonred CoPilotButton clearButton" onClick={clearChats}>
                        <img src={ClearChatIcon} alt="co-pilot"/>
                     </div>
                  </>
                  {isListening ? (
                     <>
                     {/* <div className="CoPilotButtonred CoPilotButton" onClick={toggleListening}>
                     <img src={StopCoPilotIcon} alt="co-pilot"/>
                     <span className="ButtonStatusred">
                        Stop AI<br></br> Co - Pilot
                     </span>
                     </div> */}
                     </>
                     ):(
                     <>
                     {/* <div className="CoPilotButton" onClick={toggleListening}>
                     <img src={CoPilotIcon} alt="co-pilot"/>
                     <span className="ButtonStatus">
                        Start AI<br></br> Co - Pilot
                     </span>
                     </div> */}
                     <AutoLanguageDetector setMessage={setMessage} speakNowShower={speakNowShower} setVoiceText={setVoiceText} setVoiceSpeech={setVoiceSpeech} voiceText={voiceText} 
                     onTranscriptComplete={(text) => {
                        // handleSend(text);
                        setSpeechText(text)
                        setMessage("");
                     }}
                     />
                     <VoiceRecognitionHandler 
                     onTranscriptComplete={(text) => {
                        // handleSend(text);
                        setMessage("");
                     }}
                     onStatusChange={(status) => {
                        // Use this to show/hide the "Now You Can Speak" message
                        if (status.isListening) {
                           speakNowShower();
                           
                        }
                     }}
                     />
                     </>
                  )}
                  {manualCoPilot ? 
                          (
                              <>
                               <div style={{top:"20%"}} className="CoPilotButtonred CoPilotButton" onClick={()=>{mCopilotClose()}}>
                                           <img src={StopCoPilotIcon} alt="co-pilot"/>
                                           <span className="ButtonStatusred">
                                           Stop manual<br></br> Co - Pilot
                                           </span>
                                           </div> 
                              </>
                          ) : 
                          (
                              <>
                              <div style={{top:"20%"}} className="CoPilotButton manual" onClick={()=>{mCopilotOpen()}}>
                                 <img src={ManualCoPilotIcon} alt="co-pilot"/>
                                 <span className="ButtonStatus">
                                    Manual<br></br> Co - Pilot
                                 </span>
                                 </div>
                              </>
                          )}
                  <div className="card-header border-0 pb-0 flex-wrap">
                     <div className="tophead">
                        <img src={MockIntIcon} alt="icon" className="mockicon"/>
                        <h4 className="Head">
                           AI Powered Mock Interview
                        </h4>
                     </div>
                  </div>
                  <div
                     ref={messageContainerRef}
                        className={`card-body msg_card_body dz-scroll`}
                        id="DZ_W_Contacts_Body3"
                     >
                        
                              {interviewQuestions?.map((item, index) => (
                                    <>
                                    <div className="userChat">
                                       <img src={messageIcon} className="messageIcon" alt="user"/>
                                       <div className="userText">
                                          <span>
                                             {item?.question}
                                          </span>
                                       </div>
                                    </div>
                                    <div className="chats gpt-helper">
                                       <div className="thumbnail row-flex">
                                          <img
                                          src={GptIcon}
                                          className="rounded-circle user_img_msg"
                                          alt="Gpt Icon"
                                          />
                                          <div className="chats-info col-flex">
                                          <div className="details">Interviewer</div>
                                          <div className="details">{new Date().toLocaleTimeString()}</div>
                                          </div>
                                       </div>
                                       <div className="chat-box col-flex other">
                                          <div className="response-content">
                                          {renderResponse(item?.answer)}
                                          </div>
                                       </div>
                                    </div>
                                    </>
                                 ))}
                                 {hideQuestion?(<>
                                 
                                 </>):(<>
                                    {voiceSpeech&& (
                                       <div className="userChat voiceChat">
                                          <div className="voiceIcon"></div>
                                          <div className="userText">
                                             <span>
                                                {voiceText}
                                             </span>
                                          </div>
                                       </div>
                                    )}
                                 </>)}
                                 
                  </div>
                  <div className="card-footer type_msg input-box">
                     <div className="input-group">
                        {aiChatSuggestions && (
                        <div className="ai-chat-Suggestions">
                           <div className="icon">
                              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M10.6244 6.35617C11.3221 4.3145 14.1431 4.25267 14.9703 6.17067L15.0403 6.35734L15.9818 9.11067C16.1975 9.74211 16.5462 10.3199 17.0043 10.8052C17.4623 11.2904 18.0191 11.6718 18.6371 11.9235L18.8903 12.018L21.6436 12.9583C23.6853 13.656 23.7471 16.477 21.8303 17.3042L21.6436 17.3742L18.8903 18.3157C18.2586 18.5313 17.6806 18.8799 17.1951 19.338C16.7097 19.796 16.3281 20.3529 16.0763 20.971L15.9818 21.223L15.0414 23.9775C14.3438 26.0192 11.5228 26.081 10.6968 24.1642L10.6244 23.9775L9.68413 21.2242C9.46851 20.5925 9.1199 20.0145 8.66183 19.529C8.20376 19.0436 7.64689 18.6621 7.0288 18.4102L6.7768 18.3157L4.02346 17.3753C1.98063 16.6777 1.9188 13.8567 3.8368 13.0307L4.02346 12.9583L6.7768 12.018C7.40824 11.8022 7.98606 11.4536 8.47129 10.9955C8.95652 10.5374 9.33788 9.98064 9.58963 9.36267L9.68413 9.11067L10.6244 6.35617ZM22.1663 2.3335C22.3845 2.3335 22.5984 2.39473 22.7836 2.51022C22.9688 2.62571 23.1179 2.79084 23.2139 2.98684L23.2699 3.12334L23.6783 4.32034L24.8764 4.72867C25.0952 4.80298 25.2869 4.94055 25.4274 5.12395C25.5678 5.30735 25.6507 5.52832 25.6654 5.75886C25.6802 5.9894 25.6261 6.21912 25.5102 6.41892C25.3942 6.61872 25.2216 6.7796 25.0141 6.88117L24.8764 6.93717L23.6794 7.3455L23.2711 8.54367C23.1967 8.76234 23.059 8.95398 22.8755 9.09433C22.692 9.23467 22.471 9.31739 22.2405 9.33201C22.01 9.34663 21.7803 9.29249 21.5806 9.17644C21.3809 9.0604 21.2201 8.88768 21.1186 8.68017L21.0626 8.54367L20.6543 7.34667L19.4561 6.93834C19.2374 6.86403 19.0456 6.72645 18.9052 6.54305C18.7647 6.35965 18.6819 6.13868 18.6671 5.90815C18.6524 5.67761 18.7064 5.44788 18.8223 5.24808C18.9383 5.04829 19.111 4.88741 19.3184 4.78584L19.4561 4.72984L20.6531 4.3215L21.0614 3.12334C21.1401 2.89283 21.2889 2.69273 21.4871 2.55108C21.6852 2.40944 21.9227 2.33336 22.1663 2.3335Z" fill="#432882"/>
                              </svg>
                              AI Suggestions
                           </div>
                           <button className="suggestion-button" onClick={()=>{chatSuggestionsClick("Can you briefly describe your recent project?")}}>Can you briefly describe your recent project? 
                           </button>
                           <button className="suggestion-button" onClick={()=>{chatSuggestionsClick("What tools or technologies did you use in your recent project?")}}>What tools or technologies did you use in your recent project?
                           </button>
                           <button className="suggestion-button" onClick={()=>{chatSuggestionsClick("Why do you think you are a good fit for this job?")}}>Why do you think you are a good fit for this job?
                           </button>
                           <button className="suggestion-button" onClick={()=>{chatSuggestionsClick("What led you to explore new job opportunities?")}}>What led you to explore new job opportunities? 
                           </button>
                        </div>)}
                        <textarea
                           ref={inputRef}
                           value={message}
                           onChange={handleInputChange}
                           placeholder="Message your gpt helper"
                           className="form-control ai-input auto-expand" // Added className
                           style={{overflow: 'hidden', resize: 'none',
                              borderTopLeftRadius: "35px",
                              borderBottomLeftRadius: "35px",
                              overflow: "hidden",
                              resize: "none",
                              height: "auto",
                              color:"#020817",
                              padding: "10px 22px"
                           }} 
                        />
                        <div className="input-group-append button-row">
                           
                           <button type="button" className="btn btn-primary submit-button" onClick={() => handleSend(message)}>
                              <i className="fa fa-location-arrow"></i>
                           </button>
                           
                        </div>
                     </div>
                  </div>
                  <div className="gradientOne">
                     
                  </div>
                  <div className="gradientTwo">

                  </div>
               </div>
            </div>
            {/* <div className={`col-md-3 mock instruction ${highlightactive===true?"active":"hidden"}`}>
               <div className="card interview-card">
                  <div className="card-header border-0 pb-0 flex-wrap" onClick={instructionClicked}>
                     <h4 className="fs-18  topHeading">
                        Instructions
                     </h4>
                  </div>
                  <div
                        className={`card-body msg_card_body dz-scroll ${
                           openMsg ? "" : ""
                        } `}
                        id="DZ_W_Contacts_Body3"
                     >
                        
                        <div className="chats col-flex">
                           <div className="chat-box col-flex highlight">
                              <p>
                                 1. Please make sure to load the resume before using the Mock interview GPT Helper. Based on your resume, Mock interview GPT Helper will read the information and provide answers accordingly.
                              </p>
                           </div>
                        </div>
                        <div className="chats col-flex">
                           <div className="chat-box col-flex highlight">
                           <p>
                                 2. The answer format changes every time, as they are generated by ChatGPT. 
                              </p>
                              
                           </div>
                        </div>
                        <div className="chats col-flex">
                           <div className="chat-box col-flex highlight">
                              <p>
                                 3. When we click on the blue icon or the down arrow while the cursor is in the message box, it will start taking voice instructions. Clicking 'Send' will provide the answers. 
                              </p>
                              
                           </div>
                        </div>
                           
                  </div>
                  
               </div>
            </div> */}
         </div>
         <div className={`interviewButton ${questions===false? "show" : "hidden"}`} onClick={openInterview}>Questions</div>
         {/* <div className={`instructionsButton ${highlightactive===false? "show" : "hidden"}`} onClick={openInstructions}><img src={InfoIcon} alt="icon" /></div> */}
         
         {loaderAnimation && (
            <div className="LoaderAnimation">
               <div className="gptAnimate"></div>
               <img className="gptIcon" src={GptIcon} alt="gptIcon"/>
         </div>)}
      </Fragment>
   );
};

export default Home;

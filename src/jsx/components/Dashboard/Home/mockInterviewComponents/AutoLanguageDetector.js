// src/components/AutoLanguageDetector.js
import React, { useState, useEffect, useRef } from 'react';
import CoPilotIcon from "../images/CoPilotIcon.png";
import StopCoPilotIcon from "../images/StopCoPilot.png";

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-IN', label: 'English (India)' }
];

const AutoLanguageDetector = ({ onTranscriptComplete, setMessage , speakNowShower, setVoiceText, setVoiceSpeech, voiceText}) => {
  const [currentLanguage, setCurrentLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [isListening, setIsListening] = useState(false);
  const recognitionInstances = useRef([]);

  useEffect(() => {
    // Initialize recognition instances for both languages
    SUPPORTED_LANGUAGES.forEach(lang => {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang.code;
      
      recognition.onresult = handleRecognitionResult;
      recognitionInstances.current.push({
        instance: recognition,
        language: lang
      });
    });

    return () => stopAllRecognition();
  }, []);

  

  const handleRecognitionResult = (event) => {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript;
    const confidence = result[0].confidence;
    
    // Switch language if confidence is high
    if (confidence > 0.8) {
      const recognition = event.target;
      const newLang = SUPPORTED_LANGUAGES.find(lang => lang.code === recognition.lang);
      if (newLang && newLang.code !== currentLanguage.code) {
        setCurrentLanguage(newLang);
      }
    }
    if (result.isFinal) {
      onTranscriptComplete(transcript);
    }
    setVoiceText(transcript);
};

  const startListening = () => {
    stopAllRecognition(); // Clear any existing instances
    recognitionInstances.current.forEach(({ instance }) => {
      instance.start();
    });
    setIsListening(true);
  };

  const stopAllRecognition = () => {
    recognitionInstances.current.forEach(({ instance }) => {
      try {
        instance.stop();
      } catch (e) {
        // Handle potential errors
      }
    });
    setIsListening(false);
  };

  useEffect(()=>{
    if(isListening){
        speakNowShower();
    }
  },[isListening])
  useEffect(()=>{
    if(isListening){
        setVoiceSpeech(true);
    }
    else{setVoiceSpeech(false)}
  }, [voiceText, isListening])

  return (
    <>
        {isListening ? 
        (
            <>
            <div className="CoPilotButtonred CoPilotButton" onClick={isListening ? stopAllRecognition : startListening}>
            <img src={StopCoPilotIcon} alt="co-pilot"/>
            <span className="ButtonStatusred">
            Stop AI<br></br> Co - Pilot
            </span>
            </div> 
            </>
        ) : 
        (
            <>
            <div className="CoPilotButton" onClick={isListening ? stopAllRecognition : startListening}>
                     <img src={CoPilotIcon} alt="co-pilot"/>
                     <span className="ButtonStatus">
                        Start AI<br></br> Co - Pilot
                     </span>
                     </div>
            </>
        )}
    </>
  );
};

export default AutoLanguageDetector;
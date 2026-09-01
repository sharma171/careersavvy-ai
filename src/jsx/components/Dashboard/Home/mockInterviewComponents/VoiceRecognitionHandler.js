// src/components/VoiceRecognitionHandler.js
import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import CoPilotIcon from "../images/CoPilotIcon.png";
import StopCoPilotIcon from "../images/StopCoPilot.png";

// Configuration constants
const SILENCE_DURATION = 4000;  // 3 seconds instead of current 1 second
const MINIMUM_TRANSCRIPT_LENGTH = 10;

export const VoiceRecognitionHandler = ({ onTranscriptComplete, onStatusChange }) => {
  const [isListening, setIsListening] = useState(false);
  const lastSpeechTime = useRef(Date.now());
  const silenceTimer = useRef(null);
  
  const {
    transcript,
    resetTranscript,
  } = useSpeechRecognition();

  // Rest of the component code here
  const VoiceButton = ({ isListening, onClick }) => (
    <div 
      className={`voiceAsist ${isListening ? 'active' : ''}`} 
      onClick={onClick}
    >
      <img 
        src={isListening ? StopCoPilotIcon : CoPilotIcon} 
        alt={isListening ? "Stop Recording" : "Start Recording"}
      />
      <span className={`ButtonStatus ${isListening ? 'recording' : ''}`}>
        {isListening ? 'Stop AI\nCo-Pilot' : 'Start AI\nCo-Pilot'}
      </span>
    </div>
  );
};  
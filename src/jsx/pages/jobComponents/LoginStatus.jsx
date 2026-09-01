import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import "../../components/fScreenPopup/fScreenPopup.css?ver0.91";
import styling from "./bottomSidePopup.module.css";
import {
  loginFailedAction,
} from "../../../store/actions/AuthActions";

const LoginStatus = ({ popupActive, setPopupActive, popupData, handleResendEmail, setIsForgot, setIsLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const containerRef = useRef(null);

  const handleClose = () => {
    setPopupActive(false);
    dispatch(loginFailedAction(""));
  };

  

  // Map existing data to new "detailedPopup" naming used by the new design
  const detailedPopup = {
    title: popupData?.MainHeading || "",
    detailedMessage: popupData?.Description || "",
    buttonName: popupData?.strokeBtn || "" // use "hide" to hide button if desired
  };

  const showButton = detailedPopup.buttonName && detailedPopup.buttonName !== "hide";

  const renderButton = () => {
    if (!showButton) return null;

    if (detailedPopup.buttonName === "Resend Email") {
      return (
        <>
          <button
            className={styling.OkayBtn}
            onClick={() => {handleClose() }}
            style={{background:"red"}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>

            {" "}{"Cancel"}
          </button>
          <button
            className={styling.OkayBtn}
            onClick={() => { handleResendEmail(); handleClose(); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="lucide lucide-check">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {" "}{detailedPopup.buttonName || "Okay"}
          </button>
        </>
      );
    }

    if (detailedPopup.buttonName === "Go To Login") {
      return (
        <button
          className={styling.OkayBtn}
          onClick={() => {
            handleClose();
            setIsForgot(false);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="lucide lucide-check">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {" "}{detailedPopup.buttonName || "Okay"}
        </button>
      );
    }

    // Default: keep original logic (e.g., "Sign In" opens login)
    return (
      <button
        className={styling.OkayBtn}
        onClick={() => {
          handleClose();
          if (detailedPopup.buttonName === "Sign In") {
            setIsLogin(true);
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="lucide lucide-check">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        {" "}{detailedPopup.buttonName || "Okay"}
      </button>
    );
  };

  return (
    <div className={styling.backdrop}>       
    <div className={styling.linkExpiredPopup}  ref={containerRef}>
      <div className={styling.rowitems}>
        <div className={styling.Info}>
          <h3 className={styling.head}>{detailedPopup.title || "Loading"}</h3>
          <p className={styling.para}>
            {detailedPopup.detailedMessage || "Thank you for your patience. We're getting ready for you."}
          </p>
        </div>

        {renderButton()}
      </div>
    </div>
    </div>
  );
};

export default LoginStatus;

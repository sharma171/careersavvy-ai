import React, {useEffect, useState } from "react";
import logo from "../../images/site_logo.jpg";
import "./css/login.css";
import CareerSavvyLogo from "../../images/site_logo.svg";
import FullSPopup from "../components/fScreenPopup/FullSPopup";
import { ReactComponent as TopRightSvg } from "../../images/Login/TopRight.svg";
import { ReactComponent as BotLeftSvg } from "../../images/Login/BotLeft.svg";
import { ReactComponent as TopEclipse } from "../../images/Login/topEclipse.svg";
import { ReactComponent as BotEclipse } from "../../images/Login/botEclipse.svg";
import { ReactComponent as LogoIcon } from "../../images/Login/logoIcon.svg";
import { ReactComponent as CloseIcon } from "../../images/Login/close.svg";
import { ReactComponent as MailIcon } from "../../images/Login/mailIcon.svg";
import { ReactComponent as PasswordIcon } from "../../images/Login/passwordIcon.svg";
import { ReactComponent as BrandBottom } from "../../images/Login/BrandBottom.svg";
import { ReactComponent as CountryIcon } from "../../images/Login/country.svg";
import {  useSelector } from "react-redux";
import { Link,  useNavigate } from "react-router-dom";
import AiCompressIcon from "./Home/icons & images/aigif compressed.gif"
const ForgotPassword = () => {
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState(""); //State to display success or error messages
  const [successModal, setSuccessModal] = useState(false);
  const [popupActive,setPopupActive] = useState(false);
  const [popupData, setPopupData] = useState({});
   const { resetEmail } = useSelector(state => state.profile);
   const [ loaderAnimate, setLoaderAnimate ] = useState(false);
  const navigate = useNavigate();
  function closeSuccessModal() {
    setSuccessModal(false); // Hide success modal
  }
  function goToLogin() {
    navigate("/login"); // Navigate to login page
  }
useEffect(()=>{
  setUserEmail(resetEmail)
},[]);

  const handleSubmit = async (e) => {
    setLoaderAnimate(true);

    e.preventDefault();  // Prevent page refresh

    // Payload to send in the POST request
    const payload = {
      task: "send_passwordresetlink",
      user_mail: userEmail
    };

    try {
      // Sending POST request
      const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/send_activation_link_v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      // Check if request was successful and update message
      if (response.ok) {
        setMessage("A password reset link has been sent to your email.");
        setPopupActive(true);
        setPopupData({
          MainHeading: "Password Reset Status",
          Description: (
            <>
              A password reset link has been sent to your email : <strong>{userEmail}</strong>
            </>
          ),
          strokeBtn: "Go To Login"
        });
        // setSuccessModal(true); // Show success modal
        setLoaderAnimate(false);
      } else {
        setMessage(result.error || "Failed to send reset link. Please try again.");
        setLoaderAnimate(false);
      }
    } catch (error) {
      setMessage("Error: Something went wrong. Please try again later.");
      setLoaderAnimate(false);
    }
  };

  return (
    <>
    {popupActive&&(
          <FullSPopup popupActive={popupActive} setPopupActive={setPopupActive} popupData={popupData} setPopupData={setPopupData} />
      )}
      <div className='CSavvyLogin'>
        <div className="loginCard">
            <div className="topRightBg">
                <TopRightSvg />
            </div>
            <div className="botLeftBg">
                <BotLeftSvg />
            </div>
            <div className="topEclipse">
                <TopEclipse />
            </div>
            <div className="botEclipse">
                <BotEclipse />
            </div>
            <div className="loginRow">
                <div className="brand-col">
                    <div className="BrandTop">
                        <h3 className="TopHead">
                            Welcome to CareerSavvy
                        </h3>
                        <p className="para">Where Al Meets Ambition</p>
                        <div className="social">
                            <ul>
                                <li>
                                    <Link to={"https://www.facebook.com/share/p/18Gv5rt2Lv/?mibextid=WC7FNe"} target='blank'>
                                        <i className="fab fa-facebook-f icon"></i>    </Link>
                                </li>
                                <li>
                                    <Link to={"https://www.instagram.com/p/DDYRi7XxGgv/?igsh=bHlla2s1cGwzdHo0"} target='blank'><i className="fab fa-instagram icon"></i></Link>
                                </li>
                                <li>
                                    <Link to={"https://www.linkedin.com/company/career-savvy-ai/"} target='blank'><i className="fab fa-linkedin-in icon"></i></Link></li>
                                <li>
                                    <Link to={"https://www.youtube.com/watch?v=Nkl5TiWo6Bs"} target='blank'><i className="fab fa-youtube icon"></i></Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="BrandBottom">
                        <BrandBottom/>
                    </div>
                </div>
                <div className="form-col">
                    <div className="logoClose">
                        <div className="logoIcon"><img src={CareerSavvyLogo} alt="icon" className="Icon" /></div>
                        <div className="close" onClick={()=>navigate("/")}><CloseIcon /></div>
                    </div>
                    <div className="AuthForm">

                        <div className="mb-2">
                            <h3 className="TopHead" >Forgot your password?</h3>
                            {/* <p className="TopPara">Sign in by entering information below</p> */}
                        </div>
                        {message && <div className="alert alert-info">{message}</div>}

                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                              <label className="textlabel" style={{    margin: "0px auto 17px",     color: "rgb(0 90 165)", fontSize: "16px", fontWeight: "500"}}>
                                Enter your email ID to reset your password
                              </label>
                                <div className="inputouter">
                                    <div className="mailIcon">
                                        <MailIcon />
                                    </div>
                                    <input
                                        type="text"
                                        className="CSavvyInputs"
                                        value={userEmail}
                                        placeholder="Enter your email address"
                                        onChange={(e) => setUserEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="text-center">
                                <input
                              type="submit"
                              value="Get Reset Link"
                              className="LoginButton mb-3"
                            />
                            </div>
                        </form>
                        


                        {/* <Link className="forgotPassword" to="/page-forgot-password" onClick={() => dispatch(setResetEmail(username))}>Forget Password?</Link> */}
                        <div className="ordivider"><div className="text">or</div></div>
                        <div className="RegisterButton mt-2">
                            <p className="mb-0">Don't have an account?{" "}
                                <Link className="text-black" to="/page-register">Sign Up</Link>
                            </p>
                        </div>
                        <Link className="backToHome" to="/">Back to Home</Link>
                    </div>
                </div>
            </div>

        </div>
    </div>
        {successModal && (
            <div
            className="modal fade bd-example-modal-sm show"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            style={{
              display: "block",
              backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay for more contrast
              transition: "opacity 0.5s ease-in-out", // Smooth fade-in effect
            }}
          >
            <div
              className="modal-dialog modal-sm"
              style={{
                maxWidth: "400px",
                animation: "fadeInUp 0.5s ease", // Smooth slide-in animation
              }}
            >
              <div
                className="modal-content"
                style={{
                  borderRadius: "12px", // Softer rounded corners
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)", // Deep shadow for a floating effect
                  overflow: "hidden",
                }}
              >
                {/* Modal Header */}
                <div
                  className="modal-header"
                  style={{
                    background: "#fafafa", // Gradient background for a modern look
                    color: "#fff",
                    padding: "15px",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <h5 className="modal-title" style={{ fontWeight: "bold", margin: 0 }}>
                    Password Reset Status
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    onClick={closeSuccessModal}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fff",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  >
                    &times;
                  </button>
                </div>
          
                {/* Modal Body */}
                <div
                  className="modal-body"
                  style={{
                    padding: "25px",
                    textAlign: "center",
                    fontSize: "16px",
                    color: "#333",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  Password reset link has been sent to your email:{" "}
                  <strong>{userEmail}</strong>
                </div>
          
                {/* Modal Footer */}
                <div
                  className="modal-footer"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px 20px",
                    backgroundColor: "#f1f1f1",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-danger light"
                    data-bs-dismiss="modal"
                    onClick={closeSuccessModal}
                    style={{
                      borderRadius: "32px",
                      padding: "5px 20px",
                      fontWeight: "600",
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      transition: "background-color 0.3s ease", // Smooth hover effect
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#c0392b")
                    } // Hover color change
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#e74c3c")}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={goToLogin}
                    style={{
                      borderRadius: "32px",
                      padding: "5px 20px",
                      fontWeight: "600",
                      backgroundColor: "rgb(0 69 209)",
                      color: "#fff",
                      border: "none",
                      transition: "background-color 0.3s ease", // Smooth hover effect
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#2980b9")
                    } // Hover color change
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#3498db")}
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          
            {/* Smooth slide-in animation */}
            <style>
              {`
                @keyframes fadeInUp {
                  0% {
                    transform: translateY(50px);
                    opacity: 0;
                  }
                  100% {
                    transform: translateY(0);
                    opacity: 1;
                  }
                }
              `}
            </style>
          </div>
          
        )}
        {loaderAnimate&&(
          <>
          <div className="LoaderAnimation">
                <div className="gptAnimate"></div>
                <img className="gptIcon" src={AiCompressIcon} alt="gptIcon"/>
          </div>
          </>
        )}
    </>
    
  );
};

export default ForgotPassword;

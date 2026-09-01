import React, {useState, useEffect } from "react";
import logo from "../../images/site_logo.jpg";
import "./css/login.css";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import CareerSavvyLogo from "../../images/site_logo.svg";
import "./register.css";
import SuccesIcon from "../../images/succesIcon.svg";
// import "../components/fScreenPopup/fScreenPopup.css";
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
import InstructionIcon from "./instruction.png";
import CsLogo from "./Home/icons & images/careerSavvy.svg"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation} from "react-router-dom";

const ForgotPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); //State to display success or error messages
  const location = useLocation(); // Get the query parameters from the URL
  const [token, setToken] = useState('');
  const [showLoading, setShowLoading] = useState("");
  const [popupData, setPopupData] = useState({});
  const [successModal, setSuccessModal] = useState(false);
  const [popupActive,setPopupActive] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Check if passwords match and both fields have values
  const passwordsMatch = password === confirmPassword && password.length > 0 && confirmPassword.length > 0;
  const isFormValid = passwordsMatch;

  function closeSuccessModal() {
    setSuccessModal(false); // Hide success modal
    navigate("/login"); // Navigate to login page
  }
  
  function goToLogin() {
    navigate("/login"); // Navigate to login page
  }

   // Extract the token from the URL
   useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    setToken(tokenFromUrl);
  }, [location.search]);

  const handleSubmit = async (e) => {
    setShowLoading(true);
    e.preventDefault();  // Prevent page refresh

    // Additional check to prevent submission if passwords don't match
    if (!passwordsMatch) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    // Payload to send in the POST request
    const payload = {
      task: "verify_passwordtoken",
      token: token,
      new_password: confirmPassword
    }

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
        // setMessage("Your new password has been updated");
        setPopupActive(true);
        setPopupData({
          MainHeading: "Update Password Status",
          Description: (
            <>
              Your new password has been updated. You can login with your new credentials.
            </>
          ),
          strokeBtn: "Go To Login"
        });
      } else {
        setPopupActive(true);
        setPopupData({
          MainHeading: "Update Password Status",
          Description: (
            <>
              Failed to update your password. Please try again.
            </>
          ),
          strokeBtn: "Go To Login"
        });
      }
    } catch (error) {
      setMessage("Error: Something went wrong. Please try again later.");
      setPopupActive(true);
        setPopupData({
          MainHeading: "Update Password Status",
          Description: (
            <>
              Failed to update your password. Please try again.
            </>
          ),
          strokeBtn: "Go To Login"
        });
    }
    finally{
      setShowLoading(false);
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
                            <h3 className="TopHead" >Update your Password ?</h3>
                        </div>

                        {message && <div className="alert alert-info">{message}</div>}
                        
                        {/* Show password mismatch warning */}
                        {password.length > 0 && confirmPassword.length > 0 && !passwordsMatch && (
                            <div className="alert alert-warning" style={{color: '#d63384', fontSize: '14px', marginBottom: '10px'}}>
                                Passwords do not match
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            
                            <div className="form-group" style={{ position: "relative" }}>
                                <div className="inputouter">
                                    <PasswordIcon />
                                    <div className='passwordDiv' style={{ position: "relative" }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="CSavvyInputs"
                                            placeholder="New Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        {/* Eye Icon to toggle visibility */}
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                right: "0px",
                                                cursor: "pointer",
                                                transform: "translate(0, -50%)"
                                            }}
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group" style={{ position: "relative" }}>
                                <div className="inputouter">
                                    <PasswordIcon />
                                    <div className='passwordDiv' style={{ position: "relative" }}>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="CSavvyInputs"
                                            placeholder="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        {/* Eye Icon to toggle visibility */}
                                        <span
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                right: "0px",
                                                cursor: "pointer",
                                                transform: "translate(0, -50%)"
                                            }}
                                        >
                                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <button 
                                    type="submit" 
                                    className="LoginButton" 
                                    disabled={!isFormValid}
                                    style={{
                                        opacity: isFormValid ? 1 : 0.5,
                                        cursor: isFormValid ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    Update Your Password
                                </button>
                            </div>
                        </form>
                        {showLoading ? (<>
                                    <div className="preloader container">
                                    <div id="preloader">
                                        <div className="sk-three-bounce">
                                            <div className="sk-child sk-bounce1"></div>
                                            <div className="sk-child sk-bounce2"></div>
                                            <div className="sk-child sk-bounce3"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                </>
                            ) : (<></>)}
                            <div className="RegisterButton mt-3">
                                <p className="mb-0">Already have an account?{" "}
                                    <Link className="text-black" to="/login">Log In</Link>
                                </p>
                            </div>
                            <div className="ordivider"><div className="text">or</div></div>
                        
                        <Link className="backToHome" to="/">Back to Home</Link>
                    </div>
                </div>
            </div>

        </div>
    </div>
    
    </>
  );
};

export default ForgotPassword;
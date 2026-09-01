import React, { useEffect, useState } from 'react';
import "./css/login.css?ver0.2";
import { useLocation } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import CareerSavvyLogo from "../../images/site_logo.svg";
import "./register.css?ver0.1";
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
import { loadingToggleAction, loginAction, loginFailedAction } from '../../store/actions/AuthActions';
import SuccesIcon from "../../images/succesIcon.svg";
import { setProfileData, setTechSkills, setFileResume, setActivities, setJobsApplied, setJobsList, setMembershipData, setApiTokenReady, setResetEmail } from '../../store/actions/actions';
// import logo from '../../images/logo.png';
// import logotext from '../../images/logo-text.png';
function Login(props) {
    const [username, setUsername] = useState('');  // Renamed to username
    let errorsObj = { username: '', password: '' };  // Updated for username instead of email
    const [errors, setErrors] = useState(errorsObj);
    const [popupActive,setPopupActive] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [password, setPassword] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const [linkSent, setLinkSent] = useState(true);
    const location = useLocation;
    const dispatch = useDispatch();
    const nav = useNavigate();

    useEffect(() => {
        if (props.errorMessage) {
            // Handle password-related errors
            if (props.errorMessage.includes("password") ||
                props.errorMessage.includes("incorrect") ||
                props.errorMessage.includes("Incorrect password") ||
                props.errorMessage.includes("invalid") ||
                props.errorMessage === "Invalid credentials") {
                setTimeout(()=>{setPopupActive(true);},1500)
                setPopupData({
                    MainHeading: "Incorrect Password – Please Try Again",
                    Description: "The password you entered is incorrect. Please double-check and enter the correct password to continue.",
                    strokeBtn: "Okay, Got It"
                });
            }
            // Handle inactive account error
            else if (props.errorMessage === "Your account is not active. Please check your email for activation.") {
                setTimeout(()=>{setPopupActive(true);},1500)
                setPopupData({
                    MainHeading: "Account Not Active",
                    Description: props.errorMessage,
                    strokeBtn: "Activate Account"
                });
            }
            // Handle other generic errors
            else if (props.errorMessage == "User not found") {
                setTimeout(()=>{setPopupActive(true);},1500)
                setPopupData({
                    MainHeading: "Incorrect Email – Please Try Again",
                    Description: "We couldn’t find an account with that email address. Please check and try again.",
                    strokeBtn: "Okay"
                });
            }
            // Handle other generic errors
            else if (props.errorMessage == "Mail has been sent to your email-id. Please check your email for activation.") {
                setTimeout(()=>{setPopupActive(true);},1500)
                setPopupData({
                    MainHeading: "Email Request Sent",
                    Description: "An email has been sent to your email ID. Please check your inbox to activate your account.",
                    strokeBtn: "Okay"
                });
            }
            // Handle other generic errors
            else if (props.errorMessage !== "User registered successfully") {
                setTimeout(()=>{setPopupActive(true);},1500)
                setPopupData({
                    MainHeading: "Error",
                    Description: props.errorMessage,
                    strokeBtn: "Okay"
                });
            }
        }
        
        // Handle success message
        if (props.successMessage) {
            setTimeout(()=>{setPopupActive(true);},1500)
            setPopupData({
                MainHeading: "Success",
                Description: props.successMessage,
                strokeBtn: "Okay"
            });
        }
    }, [props.errorMessage, props.successMessage, linkSent]);

    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    function showLoader() {
        setShowLoading(true);
        dispatch(setProfileData({}));
        dispatch(setTechSkills([]));
        dispatch(setFileResume(""));
        dispatch(setActivities([]));
        dispatch(setJobsApplied([]));
        dispatch(setJobsList([]));
        dispatch(setMembershipData([]));
        dispatch(setApiTokenReady(false));
        setTimeout(() => {
            setShowLoading(false);
        }, 4000);
    }

    function onLogin(e) {
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };
        dispatch(setResetEmail(username))

        // Validate username
        if (username === '') {
            errorObj.username = 'Username is Required';
            error = true;
        }

        // Validate password
        if (password === '') {
            errorObj.password = 'Password is Required';
            error = true;
        }

        setErrors(errorObj);
        if (error) {
            setLinkSent(true);
            return;
        }

        dispatch(loadingToggleAction(true));
        dispatch(loginAction(username, password, nav));  // Pass username instead of email
    }

    // Toggle function for showing/hiding password
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const { apiToken, resetEmail } = useSelector(state => state.profile);

    // Function to send POST request to verify the token
    const handleActivate = async () => {
        setShowLoading(true);
        let error = false;
        const errorObj = { ...errorsObj };
        try {
            const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/send_activation_link_v2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`,
                },
                body: JSON.stringify({

                    "task": "resend_activation_link",

                    "user_mail": username

                }),
            });

            const data = await response.json();
            setTimeout(() => {
                if (response.ok) {
                    dispatch(loginFailedAction("Mail has been sent to your email-id. Please check your email for activation."));
                    setPopupActive(true)
                    setLinkSent(false);
                    setShowLoading(false);
                } else {
                }
            }, 4000);
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    };

    function pageReload() {
        location.reload()
    }

    return (
        <>
            
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
                                <div className="close" onClick={()=>nav("/")}><CloseIcon /></div>
                            </div>
                            <div className="AuthForm">

                                <div className="mb-2">
                                    <h3 className="TopHead" >Welcome to CareerSavvy</h3>
                                    <p className="TopPara">Sign in by entering the information below.</p>
                                </div>

                                {/* {props.errorMessage === "Your account is not active. Please check your email for activation." ? (
                                    <div className={`bg-red-300 text-red-900 border border-red-900 p-1 my-2 errorMessage popup ${props.errorMessage === "User registered successfully" ? "popup" : ""}`} style={{ zIndex: "1000" }}>
                                       

                                        {linkSent ? (
                                            <>
                                                {props.errorMessage === "Your account is not active. Please check your email for activation." ? (<img src={InstructionIcon} alt="succesIcon" />) : (<></>)}
                                                {props.errorMessage === "Your account is not active. Please check your email for activation." ? (<span style={{ maxWidth: '250px', textAlign: 'center' }}>{props.errorMessage}</span>) : (<></>)}
                                                <Link className='button' onClick={handleActivate}>Resend Link ></Link>
                                            </>) :
                                            (
                                                <>
                                                    <img src={SuccesIcon} alt="succesIcon" />
                                                    <span className={`${linkSent === true ? "" : "green"}`} style={{ maxWidth: '250px', textAlign: 'center' }}>Mail has been sent to your email-id. Please check your email for activation.</span>
                                                    <Link to="/" className={`button ${linkSent === true ? "" : "green"}`} style={{ background: 'green !important' }} >Go to Home ></Link>
                                                </>)}

                                    </div>
                                ) : (
                                    <div className='bg-red-300 text-red-900 border-red-900 p-1 my-2'>
                                        {props.errorMessage}
                                    </div>
                                )}
                                {props.successMessage && (
                                    <div className='bg-green-300 text-green-900 border-green-900 p-1 my-2'>
                                        {props.successMessage}
                                    </div>
                                )} */}
                                <form onSubmit={onLogin} className={`${showLoading ?"hiddenWhileLoad":""}`}>
                                    <div className="form-group">
                                        <div className="inputouter">
                                            <div className="mailIcon">
                                                <MailIcon />
                                            </div>
                                            <input
                                                type="text"
                                                className="CSavvyInputs"
                                                placeholder='Enter your email address'
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </div>
                                        {errors.username && <div className="text-danger fs-12">{errors.username}</div>}
                                    </div>
                                    <div className="form-group" style={{ position: "relative" }}>
                                        <div className="inputouter">
                                            <PasswordIcon />
                                            <div className='passwordDiv' style={{ position: "relative" }}>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="CSavvyInputs"
                                                    placeholder="Enter your password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                {/* Eye Icon to toggle visibility */}
                                                <span
                                                    onClick={togglePasswordVisibility}
                                                    style={{
                                                        position: "absolute",
                                                        top: "50%",  // Adjust this value based on input padding
                                                        right: "0px", // Adjust for placement inside input
                                                        cursor: "pointer",
                                                        transform: "translate(0, -50%)"
                                                    }}
                                                >
                                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                                </span>
                                            </div>
                                        </div>

                                        {errors.password && <div className="text-danger fs-12">{errors.password}</div>}
                                    </div>

                                    <div className="text-center">
                                        <button type="submit" className="LoginButton" onClick={showLoader}>Log In</button>
                                    </div>
                                </form>
                                {showLoading ? (<>
                                    <div className="preloader container">
                                    <div id="preloader" style={{position:"absolute"}}>
                                        <div className="sk-three-bounce">
                                            <div className="sk-child sk-bounce1"></div>
                                            <div className="sk-child sk-bounce2"></div>
                                            <div className="sk-child sk-bounce3"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                </>
                            ) : (<></>)}


                                <Link className="forgotPassword" to="/page-forgot-password" onClick={() => dispatch(setResetEmail(username))}>Forgot Password?</Link>
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
            {popupActive&&(
                <FullSPopup popupActive={popupActive} setPopupActive={setPopupActive} popupData={popupData} setPopupData={setPopupData} handleActivate={handleActivate} />
            )}
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};

export default connect(mapStateToProps)(Login);

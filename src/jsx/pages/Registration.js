import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./css/login.css";
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
import { connect, useDispatch } from 'react-redux';
import CareerSavvyLogo from "../../images/site_logo.svg";
import SuccesIcon from "../../images/succesIcon.svg";

import LoaderIcon from "../components/Dashboard/Home/loading-gif.gif";
import "./register.css";
import {
  loadingToggleAction,
  signupAction,
} from '../../store/actions/AuthActions';

function Register(props) {
  const [firstName, setFirstName] = useState(' ');
  const [lastName, setLastName] = useState(' ');
  const [country, setCountry] = useState('');
  const [username, setUsername] = useState('');
  const [popupActive, setPopupActive] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // NEW: confirm password state
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (props.errorMessage) {
      // Handle different types of messages with appropriate popups
      if (props.errorMessage === "User registered successfully") {
        setPopupActive(true);
        setPopupData({
          MainHeading: "Registration Successful",
          Description: "Please check your email for the activation link and follow the instructions to activate your account.",
          strokeBtn: "Okay, Got It"
        });
      } else if (props.errorMessage === "An error occurred") {
        setPopupActive(true);
        setPopupData({
          MainHeading: "Registration Failed",
          Description: "Oops! It looks like this email is already registered.",
          strokeBtn: "Try Again"
        });
      } else if (props.errorMessage.includes("incorrect") ||
        props.errorMessage.includes("invalid") ||
        props.errorMessage === "Invalid credentials") {
        setPopupActive(true);
        setPopupData({
          MainHeading: "Incorrect Password – Please Try Again",
          Description: "The password you entered is incorrect. Please double-check and enter the correct password to continue.",
          strokeBtn: "Okay, Got It"
        });
      }
    }

    // Handle success messages separately if needed
    if (props.successMessage) {
      setPopupActive(true);
      setPopupData({
        MainHeading: "Success",
        Description: props.successMessage,
        strokeBtn: "Continue"
      });
    }
  }, [props.errorMessage, props.successMessage]);

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Extended errors object now includes confirmPassword
  const initialErrors = {
    firstName: '',
    lastName: '',
    country: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  const [errors, setErrors] = useState(initialErrors);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  function openLoader() {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
    }, 10000)
  }
  useEffect(() => {
    if (props.errorMessage === "User registered successfully") {
      setShowLoader(false);
      // Redirect after 5 seconds
      const timer = setTimeout(() => {
        navigate("/login");
      }, 5000);

      // Cleanup the timer in case the component unmounts before 5 seconds
      return () => clearTimeout(timer);
    }

  }, [props.errorMessage, navigate]);

  // Validate form inputs
  function validateInputs() {
    let error = false;
    const errorObj = { ...initialErrors };

    if (country === '') {
      errorObj.country = 'Country is required';
      error = true;
    }
    if (email === '') {
      errorObj.email = 'Email is required';
      error = true;
    }
    if (password === '') {
      errorObj.password = 'Password is required';
      error = true;
    }
    if (confirmPassword === '') {
      errorObj.confirmPassword = 'Confirm Password is required';
      error = true;
    }

    // New: check password match only if both provided
    if (password && confirmPassword && password !== confirmPassword) {
      errorObj.confirmPassword = 'Passwords do not match';
      error = true;
    }

    setErrors(errorObj);
    return error;
  }

  function onSignUp(e) {
    e.preventDefault();
    const error = validateInputs();

    // If validation fails, stop the submission
    if (error) return;

    // Dispatch the loading action and signup action
    dispatch(loadingToggleAction(true));
    dispatch(
      signupAction(
        firstName,
        lastName,
        country,
        username,
        email,
        password,
        navigate
      )
    );
  }
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  useEffect(() => {
    // update confirmPassword error live
    setErrors(prev => ({
      ...prev,
      confirmPassword:
        confirmPassword && password !== confirmPassword ? "Passwords do not match" : ""
    }));
  }, [password, confirmPassword]);

  return (
    <>
      {popupActive && (
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
                <BrandBottom />
              </div>
            </div>
            <div className="form-col">
              <div className="logoClose">
                <div className="logoIcon"><img src={CareerSavvyLogo} alt="icon" className="Icon" /></div>
                <div className="close" onClick={() => navigate("/")}><CloseIcon /></div>
              </div>
              <div className="AuthForm">

                <div className="mb-2">
                  <h3 className="TopHead" >Welcome to CareerSavvy</h3>
                  <p className="TopPara">Sign up by entering the information below.</p>
                </div>

                <form onSubmit={onSignUp} className={`${showLoader ? "hiddenWhileLoad" : ""}`}>
                  <div className="form-group">
                    <div className="inputouter mt-3">
                      <div className="mailIcon">
                        <MailIcon />
                      </div>
                      <input
                        type="email"
                        className="CSavvyInputs"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setUsername(e.target.value);
                        }}
                      />
                    </div>
                    {errors.email && (
                      <div className="text-danger fs-12">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group" style={{ position: "relative" }}>
                    <div className="inputouter">
                      <PasswordIcon />
                      <div className='passwordDiv' style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="CSavvyInputs"
                          value={password}
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        <span
                          onClick={togglePasswordVisibility}
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "-3px",
                            cursor: "pointer",
                            transform: "translate(0, -50%)"
                          }}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="inputouter" style={{ marginTop: "16px" }}>
                      <PasswordIcon />
                      <div className='passwordDiv' style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="CSavvyInputs"
                          value={confirmPassword}
                          placeholder="Confirm Password"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <span
                          onClick={togglePasswordVisibility}
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "-3px",
                            cursor: "pointer",
                            transform: "translate(0, -50%)"
                          }}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                      </div>
                    </div>

                    {errors.password && (
                      <div style={{ marginTop: "8px" }} className="text-danger fs-12">{errors.password}</div>
                    )}
                    {errors.confirmPassword && (
                      <div style={{ marginTop: "8px" }} className="text-danger fs-12">{errors.confirmPassword}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <div className="inputouter">
                      <CountryIcon />
                      <select
                        type="text"
                        className="CSavvyInputs"
                        value={country}
                        name="country"
                        placeholder="Enter country"
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="">Select Country</option>
                        <option value="USA">USA</option>
                        <option value="India">India</option>
                      </select>
                    </div>
                    {errors.country && (
                      <div className="text-danger fs-12">{errors.country}</div>
                    )}
                  </div>

                  <div className="text-center mt-0 mb-2">
                    <button
                      type="submit"
                      className={`LoginButton ${showLoader ? "loaderActive" : ""}`}
                      onClick={openLoader}
                      disabled={!passwordsMatch}           // disabled until passwords match
                      style={{ opacity: !passwordsMatch ? 0.6 : 1, pointerEvents: !passwordsMatch ? "none" : "auto" }}
                    >
                      Sign Up
                    </button>


                  </div>
                </form>

                {showLoader ? (<>
                  <div className="preloader container" style={{ marginLeft: "-1px" }}>
                    <div id="preloader" style={{ marginLeft: "-1px", marginRight: "-1px", width: "calc(100% + 3px)" }}>
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
                <Link className="backToHome mt-2" to="/">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default connect(mapStateToProps)(Register);

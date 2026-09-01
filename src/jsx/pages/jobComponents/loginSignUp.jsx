import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { ListGroup } from "react-bootstrap";
import SuccesIcon from "../../../images/succesIcon.svg";
import InstructionIcon from "../instruction.png";
import UploadIcon from "./images/upload.png";
import ApplyIcon from "./images/ApplyIcon.png";
import ToastSuccess from "../../components/toastSuccess";
import { setProfileData } from "../../../store/actions/actions";
import LoginStatus from "./LoginStatus";

import {
  loadingToggleAction,
  loginAction,
  signupAction,
  loginFailedAction,
} from "../../../store/actions/AuthActions";
import "./LoginSignUp.css?ver0.91";
import CsLogo from "../Home/icons & images/careerSavvy.svg";
import LoaderIcon from "../../components/Dashboard/Home/loading-gif.gif";
import { setSignUpActive } from "../../../store/actions/actions.js";

/* =========================
   Phone helpers (USA/India)
   ========================= */

// Keep only digits
const onlyDigits = (s) => (s || "").replace(/\D/g, "");

// Normalize a raw input to strict E.164 for USA/India (+1/+91 + 10 digits)
const normalizeToE164ByCountry = (country, input) => {
  const raw = (input || "").trim();
  const digits = onlyDigits(raw);

  if (country === "USA") {
    const nat = digits.startsWith("1") ? digits.slice(1) : digits;
    if (nat.length === 0) return "";                      // <-- allow empty
    if (/^\+1\d{10}$/.test(raw.replace(/\s|[-()]/g, ""))) return raw.replace(/\s|[-()]/g, "");
    if (digits.length === 11 && digits.startsWith("1")) return `+${digits.slice(0, 11)}`;
    if (nat.length >= 10) return `+1${nat.slice(0, 10)}`;
    return "";
  }

  if (country === "India") {
    let nat = digits;
    if (nat.startsWith("91")) nat = nat.slice(2);
    else if (nat.startsWith("0")) nat = nat.slice(1);
    if (nat.length === 0) return "";                      // <-- allow empty
    if (/^\+91\d{10}$/.test(raw.replace(/\s|[-]/g, ""))) return raw.replace(/\s|[-]/g, "");
    if (nat.length >= 10) return `+91${nat.slice(0, 10)}`;
    return "";
  }

  return "";
};



// Human-friendly display masks
const formatDisplayByCountry = (country, e164OrRaw) => {
  const d = onlyDigits(e164OrRaw || "");

  if (country === "USA") {
    // Separate country code from national digits
    const nat = d.startsWith("1") ? d.slice(1, 11) : d.slice(0, 10);
    if (nat.length === 0) return "";                     // <-- allow empty
    const a = nat.slice(0, 3), b = nat.slice(3, 6), c = nat.slice(6, 10);
    let out = "+1";
    out += a ? ` (${a}${a.length === 3 ? ")" : ""}` : "";
    if (b) out += ` ${b}`;
    if (c) out += `-${c}`;
    return out;
  }

  if (country === "India") {
    // India display: +91 AAAAA AAAAA
    let nat = d;
    if (nat.startsWith("91")) nat = nat.slice(2);
    else if (nat.startsWith("0")) nat = nat.slice(1);
    nat = nat.slice(0, 10);
    if (nat.length === 0) return "";
    const a = nat.slice(0, 5), b = nat.slice(5, 10);
    return b ? `+91 ${a} ${b}` : `+91 ${a}`;
  }

  return e164OrRaw || "";
};


// Validate canonical E.164 for USA/India
const isValidE164ByCountry = (country, e164) => {
  if (country === "USA") return /^\+1\d{10}$/.test(e164);
  if (country === "India") return /^\+91\d{10}$/.test(e164);
  return false;
};

const LoginSignUp = ({
  setLoginPopup,
  detailedData,
  jobInternal,
  setJobInternal,
  setUserEmailSelected,
  setLinkExpired,
  setDetailedPopup,
  showLoader,
  setShowLoader,
  loaderText,
  setLoaderText,
  profileName,
  setProfileName,
  file,
  chosenFiles,
  setFile,
  setChosenFiles,
  ...props
}) => {
  const { signUpActive } = useSelector((state) => state.profile);
  const [choosedFiles, setChoosedFiles] = useState(false);

  // Canonical payload state + masked display state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    phoneNumber: "", // canonical E.164 like +1XXXXXXXXXX or +91XXXXXXXXXX
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [phoneDisplay, setPhoneDisplay] = useState(""); // masked UI string

  const handleClose = () => {
    setPopupActive(false);
    dispatch(loginFailedAction(""));
  };

  useEffect(() => {
    if (props.errorMessage) {
      // password errors
      if (
        props.errorMessage.includes("password") ||
        props.errorMessage.includes("incorrect") ||
        props.errorMessage.includes("Incorrect password") ||
        props.errorMessage.includes("invalid") ||
        props.errorMessage === "Invalid credentials"
      ) {
        // setTimeout(() => {
        //   setPopupActive(true);
        // }, 100);
        setErrors({ password: "Incorrect Password" });
        // setPopupData({
        //   MainHeading: "Incorrect Password – Please Try Again",
        //   Description:
        //     "The password you entered is incorrect. Please double-check and enter the correct password to continue.",
        //   strokeBtn: "Okay, Got It",
        // });
      }
      // inactive
      else if (props.errorMessage === "Your account is not active. Please check your email for activation.") {
        setTimeout(() => {
          setPopupActive(true);
        }, 100);
        setPopupData({
          MainHeading: "Account Not Active",
          Description: props.errorMessage,
          strokeBtn: "Resend Email",
        });
      }
      // user not found
      else if (props.errorMessage == "User not found") {
        setTimeout(() => {
          setPopupActive(true);
        }, 100);
        setErrors({ email: "User not found" });
        setPopupData({
          MainHeading: "Incorrect Email – Please Try Again",
          Description:
            "We couldn’t find an account with that email address. Please check and try again.",
          strokeBtn: "Okay",
        });
      }
      // activation mail sent
      else if (props.errorMessage == "Mail has been sent to your email-id. Please check your email for activation.") {
        setTimeout(() => {
          setPopupActive(true);
        }, 100);
        setPopupData({
          MainHeading: "Email Request Sent",
          Description:
            "An email has been sent to your email ID. Please check your inbox to activate your account.",
          strokeBtn: "Okay",
        });
      }
      // already registered -> proceed
      else if (props.errorMessage == "User registered successfully") {
        setLinkExpired(true);
        setDetailedPopup({
          title: "Sign-up successful!",
          detailedMessage:
            "Your registration for this job profile is complete — you're now eligible to apply for positions!",
          buttonName: "hide",
        });
        setTimeout(() => {
          setLinkExpired(false);
          setDetailedPopup({
            title: "",
            detailedMessage: "",
            buttonName: "hide",
          });
          setJobInternal(true);
          setLoginPopup(false);
          handleClose();
        }, 5500);
      }
      // generic mapped to success flow in this UI
      else if (props.errorMessage == "An error occurred") {
        setTimeout(() => {
          setPopupActive(true);
        }, 100);

        setPopupData({
          MainHeading: "This email is already registered",
          Description: "Your email is already registered — you're all set to apply for this job profile. Go ahead and take the next step toward your opportunity!",
          strokeBtn: "Sign In",
        });
        setIsLogin(true);
        // setTimeout(() => {
        //   setLinkExpired(false);
        //   setDetailedPopup({
        //     title: "",
        //     detailedMessage: "",
        //     buttonName: "hide",
        //   });
        //   setJobInternal(true);
        //   setLoginPopup(false);
        //   handleClose();
        // }, 5500);
      } else if (props.errorMessage !== "User registered successfully") {
        setTimeout(() => {
          setPopupActive(true);
        }, 100);
        setPopupData({
          MainHeading: "Error",
          Description: props.errorMessage,
          strokeBtn: "Okay",
        });
      }
    }

    // success message banner
    if (props.successMessage) {
      setTimeout(() => {
        setPopupActive(true);
      }, 100);
      setPopupData({
        MainHeading: "Success",
        Description: props.successMessage,
        strokeBtn: "Okay",
      });
    }
  }, [props.errorMessage, props.successMessage]);

  const [popupActive, setPopupActive] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showLoading, setShowLoading] = useState(false);


  useEffect(() => {
    if (popupActive) {
      if (popupData.strokeBtn = "Resend Email") {
        return
      }
      else {
        setTimeout(() => {
          setPopupActive(false);
        }, 5000);
      }


    }
  }, [popupActive])

  // File upload state

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [fileMail, setFileMail] = useState("");
  let errorsObj = { username: "", password: "" };

  // Track last submit type
  const [lastSubmitType, setLastSubmitType] = useState(null); // "login" | "signup" | null

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Sync loader from Redux
  useEffect(() => {
    setShowLoader(!!props.showLoading);
  }, [props.showLoading]);

  // On successful signup, optionally auto-upload resume
  useEffect(() => {
    if (!isLogin && lastSubmitType === "signup" && props.successMessage) {
      if (file) handleUpload();
      dispatch(setSignUpActive(true));
    }
  }, [props.successMessage, isLogin, lastSubmitType, file, dispatch]);

  // Mirror email for upload API
  useEffect(() => {
    if (formData.email !== "") setFileMail(formData.email);
  }, [formData]);
  const ALLOWED_TLD_RE = /\.(com|org|in|ai|us)$/i;
  const BASIC_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Generic field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = typeof value === "string" ? value : "";

    // Clear error for just this field, not the whole object
    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (name === "email") {
      const emailVal = val.trim();
      const lower = emailVal.toLowerCase();

      // Only validate when there is some input
      const basicOk = !emailVal || BASIC_EMAIL_RE.test(emailVal);
      const tldOk = !emailVal || ALLOWED_TLD_RE.test(lower);

      if (emailVal && (!basicOk || !tldOk)) {
        setErrors((prev) => ({
          ...prev,
          email: "Email must end with .com, .org, .in, .ai, or .us.",
        }));
      } else {
        // Remove just the email error if previously set
        setErrors((prev) => {
          const { email, ...rest } = prev || {};
          return rest;
        });
      }

      // Mirror email to username
      setFormData((prev) => ({
        ...prev,
        email: val,
        username: val,
      }));
      return;
    }

    // Generic update for other fields
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  // Country change re-masks and re-normalizes phone
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setFormData((p) => ({ ...p, country }));

    // Rebuild from existing digits if any; otherwise keep blank
    const digits = onlyDigits(formData.phoneNumber) || onlyDigits(phoneDisplay);
    const ten = digits.slice(-10);
    const nextE164 =
      country === "USA" ? (ten.length === 10 ? `+1${ten}` : "") :
        country === "India" ? (ten.length === 10 ? `+91${ten}` : "") : "";

    setFormData((p) => ({ ...p, phoneNumber: nextE164 }));
    setPhoneDisplay(nextE164 ? formatDisplayByCountry(country, nextE164) : ""); // <-- blank when none
  };


  // Phone input with live mask and background canonical E.164
  const handlePhoneInputChange = (e) => {
    const v = e.target.value || "";
    const country = formData.country;
    const masked = formatDisplayByCountry(country, v);
    setPhoneDisplay(masked);
    const canonical = normalizeToE164ByCountry(country, v);
    setFormData((p) => ({ ...p, phoneNumber: canonical }));
  };

  // Validation
  const validateInputs = () => {
    let errorObj = {};
    let hasError = false;

    if (!formData.email) {
      errorObj.email = "Email or username is required";
      hasError = true;
    }
    if (!formData.password) {
      errorObj.password = "Password is required";
      hasError = true;
    }
    if (!isLogin) {
      if (!formData.country) {
        errorObj.country = "Country is required";
        hasError = true;
      }
      if (!formData.phoneNumber) {
        errorObj.phoneNumber = "Phone number is required";
        hasError = true;
      } else if (!isValidE164ByCountry(formData.country, formData.phoneNumber)) {
        errorObj.phoneNumber =
          formData.country === "USA"
            ? "Enter a valid US number (+1 and 10 digits)"
            : "Enter a valid India number (+91 and 10 digits)";
        hasError = true;
      }
      if (formData.password !== formData.confirmPassword) {
        errorObj.confirmPassword = "Passwords do not match";
        hasError = true;
      }
    }
    setErrors(errorObj);
    return hasError;
  };

  useEffect(() => {
    if (props.errorMessage == "User registered successfully") {
      setIsLogin(true);
      setLoginPopup(false);
    }
  }, [props.errorMessage]);

  useEffect(() => {
    if (isLogin) {
      setLoaderText("Sign-In");
    } else {
      setLoaderText("Creating your account… please wait.");
    }
  }, [isLogin]);

  // Add this handler in the same component
  const handlePhoneKeyDown = (e) => {
    const country = formData.country;
    if (country !== "USA") return;
    if (e.key !== "Backspace") return;

    const el = e.target;
    const val = el.value || "";
    const selStart = el.selectionStart ?? 0;
    const selEnd = el.selectionEnd ?? 0;

    // Let the browser handle range deletions
    if (selStart !== selEnd) return;

    const open = val.indexOf("(");
    const close = val.indexOf(")");
    const prevChar = selStart > 0 ? val[selStart - 1] : "";

    // Case 1: caret is just after ')' or the space right after it => remove last area-code digit
    const nearRightBracket =
      close !== -1 && (selStart === close + 1 || (selStart === close + 2 && val[close + 1] === " "));
    if (nearRightBracket) {
      e.preventDefault();

      // digits inside "(AAA"
      const inside = open !== -1 && close !== -1 ? val.slice(open + 1, close) : "";
      const areaDigits = inside.replace(/\D/g, "");
      if (areaDigits.length > 0) {
        const digits = onlyDigits(val); // uses helper
        const nat = digits.startsWith("1") ? digits.slice(1) : digits; // strip +1
        const idx = Math.min(areaDigits.length - 1, 2); // index within area code (0..2)
        const newNat = nat.slice(0, idx) + nat.slice(idx + 1);
        const newE164 = newNat.length ? "+1" + newNat.slice(0, 10) : "";
        const newDisplay = formatDisplayByCountry("USA", newE164);
        setPhoneDisplay(newDisplay);
        setFormData((p) => ({
          ...p,
          phoneNumber: normalizeToE164ByCountry("USA", newE164),
        }));

        // caret: park just after the new ')'
        requestAnimationFrame(() => {
          const newClose = newDisplay.indexOf(")");
          const nextPos = newClose !== -1 ? newClose + 1 : newDisplay.length;
          el.setSelectionRange(nextPos, nextPos);
        });
      }
      return;
    }

    // Case 2: backspacing over punctuation => skip symbol and delete previous digit
    if (prevChar && !/\d/.test(prevChar)) {
      e.preventDefault();

      // find previous digit index
      let j = selStart - 1;
      while (j >= 0 && !/\d/.test(val[j])) j--;
      if (j >= 0) {
        const leftDigits = (val.slice(0, j + 1).match(/\d/g) || []).length; // count of digits to left (includes the '1')
        const digits = onlyDigits(val);
        const nat = digits.startsWith("1") ? digits.slice(1) : digits;
        const natIdx = Math.max(0, leftDigits - 1); // subtract country digit
        const newNat = nat.slice(0, natIdx) + nat.slice(natIdx + 1);
        const newE164 = newNat.length ? "+1" + newNat.slice(0, 10) : "";
        const newDisplay = formatDisplayByCountry("USA", newE164);
        setPhoneDisplay(newDisplay);
        setFormData((p) => ({
          ...p,
          phoneNumber: normalizeToE164ByCountry("USA", newE164),
        }));

        // caret back where that digit lived
        requestAnimationFrame(() => {
          let count = 0;
          let pos = 0;
          for (let i = 0; i < newDisplay.length; i++) {
            if (/\d/.test(newDisplay[i])) count++;
            if (count === natIdx) pos = i + 1;
          }
          el.setSelectionRange(pos, pos);
        });
      }
    }
  };


  const resetPassword = async (e) => {
    setShowLoader(true);
    setLoaderText("Resetting Your Password");

    const payload = {
      task: "send_passwordresetlink",
      user_mail: formData.email,
    };

    try {
      const response = await fetch(
        "https://us-east1-foursssolutions.cloudfunctions.net/send_activation_link_v2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setPopupActive(true);
        setPopupData({
          MainHeading: "Password Reset Status",
          Description: (
            <>
              A password reset link has been sent to your email : <strong>{formData.email}</strong>
            </>
          ),
          strokeBtn: "Go To Login",
        });
        setShowLoader(false);
      } else {
        setMessage(result.error || "Failed to send reset link. Please try again.");
        setShowLoader(false);
      }
    } catch (error) {
      setMessage("Error: Something went wrong. Please try again later.");
      setShowLoader(false);
    }
  };

  const handleResendEmail = async () => {
    console.log("activate");
    setShowLoader(true);
    setLoaderText("Sending Request");
    let error = false;
    const errorObj = { ...errorsObj };
    try {
      const response = await fetch(
        "https://us-east1-foursssolutions.cloudfunctions.net/send_activation_link_v2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task: "resend_activation_link",
            user_mail: formData.email,
          }),
        }
      );

      const data = await response.json();
      setTimeout(() => {
        if (response.ok) {
          dispatch(
            loginFailedAction(
              "Mail has been sent to your email-id. Please check your email for activation."
            )
          );
          setPopupActive(true);
          setShowLoader(false);
        } else {
          setShowLoader(false);
        }
      }, 4000);
    } catch (error) {
      setShowLoader(false);
      console.error("Error verifying token:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserEmailSelected(formData.email);


    // Fallback: if canonical is empty, derive from the masked display once more
    if (!formData.phoneNumber && formData.country) {
      const fallback = normalizeToE164ByCountry(formData.country, phoneDisplay);
      if (fallback) {
        setFormData((p) => ({ ...p, phoneNumber: fallback }));
      }
    }
    if (!isLogin) {
      handleUpload();
    }
    dispatch(
      setProfileData({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber, // canonical E.164
      })
    );

    if (isForgot) return;
    if (validateInputs()) return;

    const submitType = isLogin ? "login" : "signup";
    setLastSubmitType(submitType);

    dispatch(loadingToggleAction(true));
    if (isLogin) {
      dispatch(loginAction(formData.email, formData.password, navigate));
      setLoaderText("Sign-In");
    } else {

      setLoaderText("Creating your account… please wait.");
      setProfileName({
        first_name: formData.firstName,
      });

      // Send canonical E.164 via phone: phoneNumber (as requested)
      dispatch(
        signupAction(
          formData.firstName,
          formData.lastName,
          formData.country,
          formData.email,
          formData.email,
          formData.password,
          (formData.phoneNumber || normalizeToE164ByCountry(formData.country, phoneDisplay)),
          navigate,
        )
      );
    }
  };

  function loginToggle() {
    setIsLogin((v) => !v);
    setLastSubmitType(null);
    setIsForgot(false);
    if (isLogin) {
      setFormData({
        firstName: "",
        lastName: "",
        country: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setPhoneDisplay("");
      setChosenFiles([]);
    }
  }

  function Close() {
    setLoginPopup(false);
    setLastSubmitType(null);
    dispatch(loginFailedAction(""));
    setFile(null);
    setChosenFiles([]);
  }

  const handleUpload = async () => {
    if (!file && !isLogin) {
      setMessage("Please select a file to upload.");
      return;
    }
    const body = new FormData();
    body.append("file", file);
    body.append("email_id", fileMail);
    try {
      const response = await fetch(
        "https://us-east1-foursssolutions.cloudfunctions.net/Resume_upload_bucket_store_in_table_v2",
        { method: "POST", body }
      );
      const data = await response.json();
      // setMessage(data.Message);
      // setFile(null);
      // setChosenFiles([]);
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while uploading the file.");
    }
  };

  const handleFileChange = (e) => {
    const file = (e.target.files && e.target.files[0]) || null;
    if (!file) return;
    setFile(null);
    setChosenFiles([]);
    setChosenFiles([file]);
    setFile(file);
    e.target.value = "";
    setChoosedFiles(!choosedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    let file = null;

    if (e.dataTransfer.items && e.dataTransfer.items.length) {
      const item = Array.from(e.dataTransfer.items).find((it) => it.kind === "file");
      file = item ? item.getAsFile() : null;
    } else {
      file = (e.dataTransfer.files && e.dataTransfer.files[0]) || null;
    }

    if (!file) return;
    setChosenFiles([file]);
    setFile(file);
    setChoosedFiles(!choosedFiles);
  };

  const handleDragOver = (e) => e.preventDefault();

  const renderLoginError = () => {
    if (!(isLogin && lastSubmitType === "login")) return null;
    if (!props.errorMessage) return null;
    return (
      <div
        className={`p-2 my-2 ${props.errorMessage == "User registered successfully" ? "green" : ""}`}
        style={{
          zIndex: 1000,
          background: props.errorMessage == "User registered successfully" ? "#e7fde2ff" : "#fde2e2",
          color: props.errorMessage == "User registered successfully" ? "#278420ff" : "#842029",
          border:
            props.errorMessage == "User registered successfully" ? "1px solid #c2f5d2ff" : "1px solid #f5c2c7",
          borderRadius: 6,
        }}
        role="alert"
        aria-live="assertive"
      >
        <img
          src={InstructionIcon}
          alt="instruction"
          style={{ height: "24px", marginRight: "6px", verticalAlign: "middle" }}
        />
        <span style={{ fontSize: "14px", verticalAlign: "middle" }}>{props.errorMessage}</span>
      </div>
    );
  };

  const renderSignupStatus = () => {
    if (!(!isLogin && lastSubmitType === "signup")) return null;

    const hasSuccess = !!props.successMessage;
    const hasError = !!props.errorMessage;

    if (hasSuccess) {
      return (
        <div
          className="p-2 my-2"
          style={{
            zIndex: 1000,
            background: "#e6ffed",
            color: "#0f5132",
            border: "1px solid #badbcc",
            borderRadius: 6,
          }}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <img src={SuccesIcon} alt="success" style={{ height: 24, marginRight: 6, verticalAlign: "middle" }} />
          <span style={{ fontSize: 14, verticalAlign: "middle" }}>{props.successMessage}</span>
          {detailedData?.job_apply_link && (
            <Link
              to={detailedData.job_apply_link}
              target="_blank"
              rel="noreferrer"
              className="applyButton"
              style={{ marginLeft: 8 }}
            >
              Apply Job <img src={ApplyIcon} alt="" className="svg" />
            </Link>
          )}
        </div>
      );
    }

    if (hasError) {
      return (
        <div
          className="p-2 my-2"
          style={{
            zIndex: 1000,
            background: props.errorMessage == "User registered successfully" ? "#e7fde2ff" : "#fde2e2",
            color: props.errorMessage == "User registered successfully" ? "#278420ff" : "#842029",
            border:
              props.errorMessage == "User registered successfully" ? "1px solid #c2f5d2ff" : "1px solid #f5c2c7",
            borderRadius: 6,
          }}
          role="alert"
          aria-live="assertive"
        >
          {props.errorMessage == "User registered successfully" ? (
            <></>
          ) : (
            <>
              <img
                src={InstructionIcon}
                alt="instruction"
                style={{ height: 24, marginRight: 6, verticalAlign: "middle" }}
              />
            </>
          )}
          <span style={{ fontSize: 14, verticalAlign: "middle" }}>{props.errorMessage}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {message !== "" && (
        <>
          <ToastSuccess message={message} type={type} setMessage={setMessage} setType={setType} />
        </>
      )}
      {popupActive && (
        <>
          <LoginStatus
            popupActive={popupActive}
            setPopupActive={setPopupActive}
            popupData={popupData}
            handleResendEmail={handleResendEmail}
            setIsForgot={setIsForgot}
            setIsLogin={setIsLogin}
          />
        </>
      )}

      {showLoader === true ? (
        <></>
      ) : (
        <>
          <div className="modal-overlay overlay-login">
            <div className="modal-container">
              <button className="close-btn" onClick={Close}>
                ✖
              </button>

              <div className="center-aligned">
                <img src={CsLogo} alt="logo" className="logo" />
                <h3 className="head">Ready To Apply?</h3>
                <h4>
                  {isLogin ? (
                    <>{isForgot ? <>Forgot your password?</> : "Log in to continue"}</>
                  ) : (
                    "Create your free profile and discover opportunities"
                  )}
                </h4>
              </div>

              {/* {isLogin ? renderLoginError() : renderSignupStatus()} */}

              <div className="modal-body">
                <form onSubmit={handleSubmit} aria-live="polite">
                  <div className="submissionFormContainer">
                    {!isLogin && (
                      <>
                        <div className="fullName">
                          <div className="inputs">
                            <label>First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              placeholder="First Name"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="inputs">
                            <label>Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              placeholder="Last Name"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <label>Country</label>
                        <select
                          className="form-control select-with-arrow"
                          value={formData.country}
                          name="country"
                          onChange={handleCountryChange}
                          required
                        >
                          <option value="">Select Country</option>
                          <option value="USA">USA</option>
                          <option value="India">India</option>
                        </select>
                        {errors.country && <div className="text-danger fs-12">{errors.country}</div>}
                        {formData.country !== "" ? (<>
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            className={`form-control ${errors.phoneNumber ? "input-error" : ""}`}
                            name="phoneDisplay"
                            value={phoneDisplay}
                            onChange={handlePhoneInputChange}
                            onKeyDown={handlePhoneKeyDown}
                            placeholder={
                              formData.country === "USA" ? "+1 (555) 555-1234" : formData.country === "India" ? "+91 98765 43210" : "+1 (555) 555-1234"
                            }
                            required
                          />
                          {errors.phoneNumber && <div className="text-danger fs-12">{errors.phoneNumber}</div>}
                        </>) : (<>

                        </>)}

                      </>
                    )}

                    <label>Email ID</label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email ID"
                      className={errors.email ? "input-error" : ""}
                      pattern="^[^\s@]+@[^\s@]+\.(com|org|in|ai|us)$"
                      title="Email must end with .com, .org, .in, .ai, or .us"
                      required
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                    {!isForgot && (
                      <>
                        <label>{!isLogin ? <>New Password</> : <>Password</>}</label>
                        <div className="password-container">
                          <input
                            type={!showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? "input-error" : ""}
                            required
                          />
                          <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-eye-closed-icon lucide-eye-closed"
                                >
                                  <path d="m15 18-.722-3.25" />
                                  <path d="M2 8a10.645 10.645 0 0 0 20 0" />
                                  <path d="m20 15-1.726-2.05" />
                                  <path d="m4 15 1.726-2.05" />
                                  <path d="m9 18 .722-3.25" />
                                </svg>
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-eye-icon lucide-eye"
                                >
                                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}

                    {errors.password && <p className="error-message">{errors.password}</p>}

                    {!isLogin && (
                      <>
                        <label>Confirm New Password</label>
                        <div className="password-container">
                          <input
                            type={!showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            required
                          />
                          <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-eye-closed-icon lucide-eye-closed"
                                >
                                  <path d="m15 18-.722-3.25" />
                                  <path d="M2 8a10.645 10.645 0 0 0 20 0" />
                                  <path d="m20 15-1.726-2.05" />
                                  <path d="m4 15 1.726-2.05" />
                                  <path d="m9 18 .722-3.25" />
                                </svg>
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-eye-icon lucide-eye"
                                >
                                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </>
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                      </>
                    )}

                    {!isLogin && (
                      <>
                        {choosedFiles ? (
                          <></>
                        ) : (
                          <>
                            <div className="mb-3 fileSelect" style={{ background: "transparent" }}>
                              <label className="form-label" style={{ fontSize: "12px" }}>
                                Choose and Upload Resume
                              </label>
                              <div className="Dragdrop" onDrop={handleDrop} onDragOver={handleDragOver}>
                                <label htmlFor="resumeUpload" className="dragdropLabel">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="uploadIcon lucide lucide-cloud-upload-icon lucide-cloud-upload"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M12 13v8" />
                                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                                    <path d="m8 17 4-4 4 4" />
                                  </svg>
                                  <p className="line">Drag & Drop your resume here or Choose File</p>
                                  <p className="formats">Supported Formats : PDF, DOC, DOCX (Max 5MB)</p>
                                </label>
                                <input
                                  type="file"
                                  id="resumeUpload"
                                  className="hidden"
                                  onChange={handleFileChange}
                                  accept=".pdf,.doc,.docx"
                                  required
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {/* {chosenFiles?.length > 0 && (
                        <span style={{ fontSize: "12px", color: "#020817" }}>Your Chosen Files</span>
                      )} */}

                        {chosenFiles?.length > 0 && (
                          <ListGroup as="ul" onClick={() => { setChoosedFiles(!choosedFiles); setFile(null); setChosenFiles([]) }}>
                            {chosenFiles.map((f, i) => (
                              <ListGroup.Item
                                key={`${f.name}-${f.size}-${f.lastModified}-${i}`}
                                as="li"
                                style={{
                                  margin: "10px 0 8px 0",
                                  fontSize: "14px",
                                  background: "#f1f1f1",
                                  lineHeight: "2em",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  cursor: "pointer",
                                }}
                                title={f.name}
                              >
                                Selected file : {f.name.replace("_", " ")} <><br /></>
                                <span style={{ background: "#d62424", padding: "3px 6px", borderRadius: "100px", marginBottom: "0", marginTop: "10px", color: "#fff" }}><svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "5px", marginTop: "-1px" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>Click to replace file</span>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}

                        {/* {message && (
                        <p style={{ fontSize: "14px" }}>
                          {message === "Resume stored in bucket successfully" ? "You recently Updated Your Resume!" : ""}
                          <br />
                          {message}
                        </p>
                      )} */}
                      </>
                    )}

                    {isLogin && !isForgot && (
                      <>
                        <span className="forgotPassword" onClick={() => setIsForgot(true)}>
                          Forgot Password?
                        </span>
                      </>
                    )}
                    {isLogin && isForgot && (
                      <>
                        <span className="forgotPassword" onClick={() => setIsForgot(false)}>
                          Do you want to Log In?
                        </span>
                      </>
                    )}
                  </div>

                  {isForgot ? (
                    <>
                      <button type="nothing" onClick={() => resetPassword()} className="submit-btn">
                        {showLoading ? (
                          <>
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              className="CSavvySpinner"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#fff"
                            >
                              <g transform="translate(20,20)">
                                <g transform="rotate(0)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.1" />
                                </g>
                                <g transform="rotate(45)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.2" />
                                </g>
                                <g transform="rotate(90)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.3" />
                                </g>
                                <g transform="rotate(135)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.4" />
                                </g>
                                <g transform="rotate(180)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.5" />
                                </g>
                                <g transform="rotate(225)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.6" />
                                </g>
                                <g transform="rotate(270)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.8" />
                                </g>
                                <g transform="rotate(315)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="1" />
                                </g>
                              </g>
                            </svg>
                          </>
                        ) : (
                          <></>
                        )}
                        {isLogin ? (isForgot ? "Get Reset Link" : "Log In") : "Sign Up"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="submit" className="submit-btn"
                        onClick={() => {
                          if (!isLogin) {
                            console.log("Upload your resume file before creating an account.");
                            if (!choosedFiles) {
                              setMessage("Upload your resume file before creating an account.");
                              setType("failed");
                              return;
                            }
                          }
                        }
                        }>
                        {showLoading ? (
                          <>
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              className="CSavvySpinner"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#fff"
                            >
                              <g transform="translate(20,20)">
                                <g transform="rotate(0)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.1" />
                                </g>
                                <g transform="rotate(45)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.2" />
                                </g>
                                <g transform="rotate(90)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.3" />
                                </g>
                                <g transform="rotate(135)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.4" />
                                </g>
                                <g transform="rotate(180)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.5" />
                                </g>
                                <g transform="rotate(225)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.6" />
                                </g>
                                <g transform="rotate(270)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="0.8" />
                                </g>
                                <g transform="rotate(315)">
                                  <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#fff" opacity="1" />
                                </g>
                              </g>
                            </svg>
                          </>
                        ) : (
                          <></>
                        )}
                        {isLogin ? (isForgot ? "Get Reset Link" : "Log In") : "Sign Up"}
                      </button>
                    </>
                  )}
                </form>
              </div>

              <div className="modal-footer">
                <p>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <span
                    className="toggle-link"
                    onClick={() => {
                      loginToggle();
                      dispatch(loginFailedAction(""));
                      setErrors({})
                      if (isLogin) {
                        setLoaderText("Sign-In");
                      } else {
                        setLoaderText("Creating your account… please wait.");

                      }
                    }}
                  >
                    {isLogin ? " Sign up" : " Log in"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {/* {showLoader && (
        <div className="checkout-loader">
          <img src={LoaderIcon} alt="loader" />
        </div>
      )} */}
    </>
  );
};

const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
  successMessage: state.auth.successMessage,
  showLoading: state.auth.showLoading,
});

export default connect(mapStateToProps)(LoginSignUp);

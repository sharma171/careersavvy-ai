import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListGroup } from "react-bootstrap";
import styling from "../../../pages/jobComponents/bottomSidePopup.module.css";
import UploadIcon from "../../../pages/jobComponents/images/upload.png";
import { setProfileData, setJobResumeUpload, setProfileUpdateStatus } from "../../../../store/actions/actions";
import SuccesIcon from "../../../../images/succesIcon.svg";
import AiIcon from "../../Dashboard/SearchJobs/aiIcon.gif";
import JobApplied from "./Components/images/job-applied.png";

// ---------- Helpers ----------
const onlyDigits = (s = "") => String(s).replace(/\D+/g, "");

const formatUS = (input) => {
  const d = onlyDigits(input);
  const nat = d.startsWith("1") ? d.slice(1) : d;
  const a = nat.slice(0, 3);
  const b = nat.slice(3, 6);
  const c = nat.slice(6, 10);
  if (!a) return "+1 ";
  if (!b) return `+1 (${a}`;
  if (!c) return `+1 (${a}) ${b}`;
  return `+1 (${a}) ${b}-${c}`;
};

const formatIN = (input) => {
  const d = onlyDigits(input);
  const nat = d.startsWith("91") ? d.slice(2) : d;
  const a = nat.slice(0, 5);
  const b = nat.slice(5, 10);
  if (!a) return "+91 ";
  if (!b) return `+91 ${a}`;
  return `+91 ${a} ${b}`;
};

const formatDisplayByCountry = (country, input) => {
  if (country === "USA") return formatUS(input);
  if (country === "India") return formatIN(input);
  return input || "";
};

const normalizeToE164ByCountry = (country, input) => {
  const d = onlyDigits(input);
  if (country === "USA") {
    const nat = d.startsWith("1") ? d.slice(1) : d;
    return nat ? `+1${nat.slice(0, 10)}` : "";
  }
  if (country === "India") {
    const nat = d.startsWith("91") ? d.slice(2) : d;
    return nat ? `+91${nat.slice(0, 10)}` : "";
  }
  return d ? `+${d}` : "";
};

const getNationalDigits = (country, e164) => {
  const d = onlyDigits(e164 || "");
  if (country === "USA") return d.replace(/^1/, "").slice(0, 10);
  if (country === "India") return d.replace(/^91/, "").slice(0, 10);
  return d;
};

const isValidPhone = (country, e164) => {
  if (!country) return false;
  const nat = getNationalDigits(country, e164);
  if (country === "USA" || country === "India") return nat.length === 10;
  return nat.length > 0; // fallback rule for other countries if added later
};

const JobApply = ({ content, jobInternal, setJobInternal, loaderText, setLoaderText, loaderAnimation, setLoaderAnimation }) => {
  const { profileData, apiToken, jobResumeUpload, profileUpdateStatus } = useSelector(state => state.profile);
  const userEmail = useSelector(state => state.auth.auth.email);
  const dispatch = useDispatch();

  const [choosedFiles, setChoosedFiles] = useState(true);
  const [fileName, setFileName] = useState("");
  const [chosenFiles, setChosenFiles] = useState([]);
  const [file, setFile] = useState(null);

  const [phoneDisplay, setPhoneDisplay] = useState(""); // masked UI string
  const [fetchedProfileData, setFetchedProfileData] = useState(null); // Store original data

  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  useEffect(()=>{
    if(applicationStatus!==""){
      console.log("a",applicationStatus)
      setTimeout(()=>{
        setApplicationStatus("");
        setJobInternal(false);
      },3000)
    };
  },[applicationStatus]);

  const fileApi = "https://us-east1-foursssolutions.cloudfunctions.net/send_resume_details_front_end_v2";

  useEffect(() => {
    if (userEmail) {
      fetchFilenames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  // Sync masked UI from Redux when resume flow active or profile changes
  useEffect(() => {
    if (!jobResumeUpload) return;
    const c = profileData?.country || "";
    const e164 = profileData?.phoneNumber || "";
    if (!c) return;
    setPhoneDisplay(e164 ? formatDisplayByCountry(c, e164) : "");
  }, [jobResumeUpload, profileData?.country, profileData?.phoneNumber]);

  // Country change re-masks and re-normalizes phone
  const handleCountryChange = (e) => {
    const country = e.target.value;

    const digitsFromState = onlyDigits(profileData?.phoneNumber);
    const digitsFromUI = onlyDigits(phoneDisplay);
    const ten = (digitsFromState || digitsFromUI || "").slice(-10);

    const nextE164 =
      country === "USA" ? (ten ? `+1${ten}` : "") :
      country === "India" ? (ten ? `+91${ten}` : "") : "";

    dispatch(setProfileData({ ...profileData, country, phoneNumber: nextE164 }));
    setPhoneDisplay(nextE164 ? formatDisplayByCountry(country, nextE164) : "");
    // Clear phone errors on country change
    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
  };

  // Phone input with live mask and background canonical E.164
  const handlePhoneInputChange = (e) => {
    const v = e.target.value || "";
    const country = profileData?.country;
    const masked = formatDisplayByCountry(country, v);
    setPhoneDisplay(masked);
    const canonical = normalizeToE164ByCountry(country, v);
    dispatch(setProfileData({ ...profileData, phoneNumber: canonical }));

    // Live validation feedback
    if (jobResumeUpload) {
      if (isValidPhone(country, canonical)) {
        setErrors((prev) => ({ ...prev, phoneNumber: "" }));
      } else {
        setErrors((prev) => ({ ...prev, phoneNumber: "Phone number must be 10 digits" }));
      }
    }
  };

  // Smart backspace for US mask
  const handlePhoneKeyDown = (e) => {
    const country = profileData?.country;
    if (country !== "USA") return;
    if (e.key !== "Backspace") return;

    const el = e.target;
    const val = el.value || "";
    const selStart = el.selectionStart ?? 0;
    const selEnd = el.selectionEnd ?? 0;

    if (selStart !== selEnd) return;

    const open = val.indexOf("(");
    const close = val.indexOf(")");
    const prevChar = selStart > 0 ? val[selStart - 1] : "";

    // Case 1: caret is after ')' or the space right after it => remove last area-code digit
    const nearRightBracket =
      close !== -1 && (selStart === close + 1 || (selStart === close + 2 && val[close + 1] === " "));
    if (nearRightBracket) {
      e.preventDefault();

      const inside = open !== -1 && close !== -1 ? val.slice(open + 1, close) : "";
      const areaDigits = inside.replace(/\D/g, "");
      if (areaDigits.length > 0) {
        const digits = onlyDigits(val);
        const nat = digits.startsWith("1") ? digits.slice(1) : digits;
        const idx = Math.min(areaDigits.length - 1, 2);
        const newNat = nat.slice(0, idx) + nat.slice(idx + 1);
        const newE164 = newNat.length ? "+1" + newNat.slice(0, 10) : "";
        const newDisplay = formatDisplayByCountry("USA", newE164);
        setPhoneDisplay(newDisplay);
        dispatch(setProfileData({ ...profileData, phoneNumber: normalizeToE164ByCountry("USA", newE164) }));
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

      let j = selStart - 1;
      while (j >= 0 && !/\d/.test(val[j])) j--;
      if (j >= 0) {
        const leftDigits = (val.slice(0, j + 1).match(/\d/g) || []).length;
        const digits = onlyDigits(val);
        const nat = digits.startsWith("1") ? digits.slice(1) : digits;
        const natIdx = Math.max(0, leftDigits - 1);
        const newNat = nat.slice(0, natIdx) + nat.slice(natIdx + 1);
        const newE164 = newNat.length ? "+1" + newNat.slice(0, 10) : "";
        const newDisplay = formatDisplayByCountry("USA", newE164);
        setPhoneDisplay(newDisplay);
        dispatch(setProfileData({ ...profileData, phoneNumber: normalizeToE164ByCountry("USA", newE164) }));
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

  const fetchFilenames = async () => {
    try {
      const queryObj = { emailid: userEmail };
      const response = await fetch(fileApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
        },
        body: JSON.stringify(queryObj)
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();

      if (data.file_details && data.file_details.length > 0) {
        const extractedFilenames = data.file_details.map(f => f.file_name);
        setFileName(extractedFilenames[0] || "");
      }

      if (data.user_details && data.user_details.length > 0) {
        const extractedProfileData = data.user_details[0];
        dispatch(setProfileData(extractedProfileData));
        setFetchedProfileData(extractedProfileData);
      }
    } catch (error) {
      console.error("Error fetching filenames:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setProfileData({ ...profileData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setChosenFiles([selectedFile]);
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setChoosedFiles(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setChosenFiles([droppedFile]);
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setChoosedFiles(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone only in resume flow
    if (jobResumeUpload) {
      const valid = isValidPhone(profileData?.country, profileData?.phoneNumber);
      if (!valid) {
        setErrors((prev) => ({ ...prev, phoneNumber: "Phone number must be 10 digits" }));
        return;
      }
      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    }

    setLoaderAnimation(true);
    try {
      await updateProfile();
      if (chosenFiles.length > 0) {
        await handleUpload();
        if (jobResumeUpload) {
          profileResumeUpload();
          dispatch(setJobResumeUpload(false));
          await submitProfileDetails();
        }
      }
      else{

        await applyNow();
      }
    } catch (error) {
      console.error("Error in submission process:", error);
      setLoaderAnimation(false);
    }
  };

  const updateProfile = async () => {
    if (!profileData || !profileData.first_name || !profileData.last_name || !profileData.email) {
      alert("Please fill out all fields.");
      setLoaderAnimation(false);
      throw new Error("Missing required fields");
    }

    if (fetchedProfileData && JSON.stringify(profileData) === JSON.stringify(fetchedProfileData)) {
      // No change, skip
      return;
    }

    try {
      const updateObj = {
        emailid: userEmail,
        modify: {
          columns: {
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: profileData.email,
            mobile_no: profileData.phoneNumber || "",
            country: profileData.country || "",
          }
        }
      };

      const response = await fetch(fileApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
        },
        body: JSON.stringify(updateObj)
      });

      if (!response.ok) throw new Error('Failed to update data');
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const profileResumeUpload = async () => {
    dispatch(setProfileUpdateStatus(true));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email_id", userEmail);

    try {
      const response = await fetch(
        "https://us-east1-foursssolutions.cloudfunctions.net/Resume_upload_bucket_store_in_table_v2",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error('File upload failed');

      await response.json();
      if(response.ok){
        dispatch(setProfileUpdateStatus(false));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoaderText("Uploading resume");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("email", userEmail);
    formData.append("job_id", content.job_id);

    try {
      const response = await fetch(
        "https://job-application-submission-internal-v10-737421501165.us-east1.run.app",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      setApplicationStatus(data.status);
      setMessage(data.message);
      setLoaderAnimation(false);

      setFile(null);
      setChosenFiles([]);
      await fetchFilenames();
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoaderAnimation(false);
      throw error;
    }
  };

  const applyNow = async () => {
    setLoaderText("Submitting your applcation");
    try {
      const queryObj = {
        email: userEmail,
        job_id: content.job_id,
        resume: fileName
      };

      const response = await fetch("https://job-application-submission-internal-v10-737421501165.us-east1.run.app", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryObj)
      });

      const data = await response.json();
      setApplicationStatus(data.status);
      setMessage(data.message);
      setLoaderText("Submitting your applcation");

      setApplicationSubmitted(true);
      setLoaderAnimation(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      setApplicationStatus("error");
      setMessage("Failed to submit application. Please try again later.");
      setApplicationSubmitted(true);
      setLoaderAnimation(false);
    }
  };

  useEffect(() => {
    // Reflect file presence in UI
    const hasFile = chosenFiles.length > 0 || !!fileName;
    setChoosedFiles(hasFile);
  }, [chosenFiles, fileName]);

  const submitProfileDetails = async () => {
    // Extra safety validation
    if (jobResumeUpload && !isValidPhone(profileData?.country, profileData?.phoneNumber)) {
      setErrors((prev) => ({ ...prev, phoneNumber: "Phone number must be 10 digits" }));
      return;
    }

    try {
      const updateObj = {
        emailid: userEmail,
        modify: {
          columns: {
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            country: profileData.country,
            mobile_no: profileData.phoneNumber,
          }
        }
      };
      const response = await fetch(fileApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
        },
        body: JSON.stringify(updateObj)
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }
    } catch (error) {
      console.error("Error in submitProfileDetails:", error);
    }finally{
      setLoaderAnimation(false)
    }
  };

  return (
    <>
      {applicationStatus !== "" ? (
        <>
          <div className={styling.linkExpiredPopup}>
            <div className={styling.rowitems}>
              <div className={styling.Info}>
                <h3 className={styling.head}>
                  {applicationStatus === "success" ? (<>Successfully applied</>) : (<>Already applied</>)}
                </h3>
                <p className={styling.para}>
                  {applicationStatus === "success"
                    ? (<>Your resume is Uploaded & succesfully applied for this job.</>)
                    : (<>You have already applied for this job. Thank you!</>)
                  }
                </p>
              </div>
              <button className={`${styling.OkayBtn}`} onClick={() => setJobInternal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="lucide lucide-check-icon lucide-check">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {" "}Okay
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="modal-overlay overlay-login">
            <div className="modal-container">
              <button className="close-btn" onClick={() => setJobInternal(false)}>✖</button>

              <div className="center-aligned">
                <h5 className='apply'>You Are Applying to</h5>
                <h3 className="topHead">{content?.job_title}</h3>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="fullName">
                    <div className="inputs">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={profileData?.first_name || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="inputs">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={profileData?.last_name || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Your Email Address"
                    value={profileData?.email || ""}
                    readOnly
                    required
                  />

                  {jobResumeUpload && (
                    <>
                      <label>Country</label>
                      <select
                        className="form-control select-with-arrow"
                        value={profileData?.country || ""}
                        name="country"
                        onChange={handleCountryChange}
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="USA">USA</option>
                        <option value="India">India</option>
                      </select>
                      {errors.country && <div className="text-danger fs-12">{errors.country}</div>}

                      {profileData?.country !== "" && (
                        <>
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            className={`form-control ${errors.phoneNumber ? "input-error" : ""}`}
                            style={{maxHeight:"36px"}}
                            name="phoneDisplay"
                            value={phoneDisplay}
                            onChange={handlePhoneInputChange}
                            onKeyDown={handlePhoneKeyDown}
                            placeholder={
                              profileData?.country === "USA"
                                ? "+1 (555) 555-1234"
                                : profileData?.country === "India"
                                  ? "+91 98765 43210"
                                  : "+1 (555) 555-1234"
                            }
                            required
                          />
                          {errors.phoneNumber && <div className="text-danger fs-12">{errors.phoneNumber}</div>}
                        </>
                      )}
                    </>
                  )}

                  {!choosedFiles ? (
                    <>
                      <div className="mb-3 fileSelect">
                        <label htmlFor="resumeUpload" className="form-label">Choose and Upload Resume</label>
                        <div className="Dragdrop" onDrop={handleDrop} onDragOver={handleDragOver}>
                          <label htmlFor="resumeUpload" className="dragdropLabel">
                            <img src={UploadIcon} alt="Upload Icon" className="uploadIcon" />
                            <p className="line">Drag & Drop your resume here or Choose File</p>
                            <p className="formats">Supported Formats: PDF, DOC, DOCX (Max 5MB)</p>
                          </label>
                          <input type="file" id="resumeUpload" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="mb-3 mt-3 fileSelect"
                        onClick={() => {
                          setChoosedFiles(false);
                          setFile(null);
                          setChosenFiles([]);
                          setFileName("");
                        }}
                      >
                        <ListGroup>
                          <ListGroup.Item
                            active
                            style={{
                              fontSize: "14px",
                              lineHeight: "2em",
                              cursor: "pointer",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              background: "#f1f1f1",
                              border: "none",
                              color: "#020817"
                            }}
                          >
                            {chosenFiles.length > 0 ? chosenFiles[0].name : (fileName || "Getting Details")}
                            <><br /></>
                            <span
                              style={{
                                background: "#d62424",
                                padding: "3px 6px",
                                borderRadius: "100px",
                                marginBottom: "0",
                                marginTop: "10px",
                                color: "#fff"
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "5px", marginTop: "-1px" }} width="14" height="14"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="lucide lucide-x-icon lucide-x">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                              </svg>
                              Click to replace file
                            </span>
                          </ListGroup.Item>
                        </ListGroup>
                      </div>
                    </>
                  )}

                  <button type="submit" className="submit-btn" disabled={!choosedFiles}>Apply Now</button>
                </form>
              </div>
            </div>

            {/* Optional loader UI
            {loaderAnimation && (
              <div className="LoaderAnimation">
                <div className="gptAnimate"></div>
                <img className="gptIcon" src={AiIcon} alt="gptIcon"/>
              </div>
            )} */}
          </div>
        </>
      )}
    </>
  );
};

export default JobApply;

import React, { Fragment, useState, useEffect, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import "./profile.css"
//** Import Profile Img */
import profileImg from "../../../../images/avatar/1.jpg";
import { Dropdown } from "react-bootstrap";
import ResumeUpload from './ResumeCard';
import topCountries from './topCountries';

import { ThemeContext } from "../../../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setTechSkills, setIsDarkMode } from "../../../../store/actions/actions";
import Icons from "../Interview/icons/proIcon.svg";

const SunIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      {/* Sun Core */}
      <circle cx="12" cy="12" r="5" fill="yellow" stroke="orange" strokeWidth="2" />
      {/* Sun Rays */}
      <g stroke="orange" strokeWidth="2">
         <line x1="12" y1="1" x2="12" y2="4" />
         <line x1="12" y1="20" x2="12" y2="23" />
         <line x1="1" y1="12" x2="4" y2="12" />
         <line x1="20" y1="12" x2="23" y2="12" />
         <line x1="4.5" y1="4.5" x2="6.5" y2="6.5" />
         <line x1="17.5" y1="17.5" x2="19.5" y2="19.5" />
         <line x1="4.5" y1="19.5" x2="6.5" y2="17.5" />
         <line x1="17.5" y1="6.5" x2="19.5" y2="4.5" />
      </g>
   </svg>
);


const MoonIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
      <path d="M569 936q-119 0-201.5-82.5T285 652q0-113 72.5-192T526 338q6 0 11 .5t11 .5q-33 38-50 86t-17 101q0 122 87.5 210T757 824q11 0 21-.5t21-1.5q-58 79-140.5 121.5T569 936Z" />
   </svg>
);

// Function to get the calling code based on the selected country
const getCallingCode = (countryName) => {
   const country = topCountries.find(c => c.name === countryName);
   return country ? country.callingCode : ''; // Return the calling code if found, otherwise return an empty string
};

const Profile = () => {
   const dispatch = useDispatch();
   const [submitActive, setSubmitActive] = useState(false);
   const [cancelStore, setCancelStore] = useState([]);

   const { profileData, techSkills, isDarkMode, apiToken, apiTokenReady } = useSelector(state => state.profile);
   const { changeBackground } = useContext(ThemeContext);

   const initialProfileRef = useRef(null);


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

   // Access user email and profile data from Redux
   const userEmail = useSelector(state => state.auth.auth.email);

   const [error, setError] = useState(null);
   const [countries, setCountries] = useState([]);
   const [filenames, setFilenames] = useState([]);
   const [loading, setLoading] = useState(true);
   const [openPopup, setOpenPopup] = useState('');

   function formatUSPhoneNumber(value) {
      let cleaned = value.trim();
      // Remove "+1" if present at the start
      if (cleaned.startsWith('+1')) {
         cleaned = cleaned.slice(2).trim();
      }
      // Remove all non-numeric characters
      let x = cleaned.replace(/[^\d]/g, '');
      // Only use first 10 digits
      x = x.substring(0, 10);

      if (!x) return '';
      if (x.length < 4) {
         return '(' + x;
      } else if (x.length < 7) {
         return `(${x.slice(0, 3)}) ${x.slice(3)}`;
      } else {
         return `+1 (${x.slice(0, 3)}) ${x.slice(3, 6)}-${x.slice(6)}`;
      }
   }
   function formatInternationalPhoneNumber(value, countryCode) {
      const cc = String(countryCode || "").replace(/[^\d]/g, ""); // "91" or "1"
      let digits = String(value || "").replace(/[^\d]/g, "");     // only numbers from input

      // 1) Drop leading country code from the digits to avoid duplication
      if (cc && digits.startsWith(cc)) {
         digits = digits.slice(cc.length);
      }

      // 2) Limit length: India = 10 digits, others up to 15 (E.164)
      if (cc === "91") {
         digits = digits.substring(0, 10);  // Indian mobile numbers are 10 digits
      } else {
         digits = digits.substring(0, 15);  // generic international max
      }

      // Nothing typed yet
      if (!cc && !digits) return "";
      if (!digits) return `+${cc}`;

      // 3) Optional grouping for India: +91 98765 43210
      let grouped = digits;
      if (cc === "91" && digits.length > 5) {
         grouped = `${digits.slice(0, 5)} ${digits.slice(5)}`;
      }

      return `+${cc} ${grouped}`.trim();
   }

   function formatPhoneByCountry(value, country, countryCode) {
      const ccRaw = String(countryCode || "").trim();
      const cc = ccRaw.replace(/[^\d]/g, "");

      const isUS =
         cc === "1" ||
         ccRaw === "+1" ||
         String(country || "").toLowerCase() === "united states" ||
         String(country || "").toLowerCase() === "united states of america";

      if (isUS) {
         return formatUSPhoneNumber(value); // your existing US formatter
      }

      return formatInternationalPhoneNumber(value, cc);
   }






   const fileApi = "https://us-east1-foursssolutions.cloudfunctions.net/send_resume_details_front_end_v2"
   useEffect(() => {
      const fetchCountries = () => {
         // Set predefined country list directly
         setCountries(topCountries);
      };

      const fetchFilenames = async () => {
         try {
            const queryObj = {
               "emailid": `${userEmail}`
            }

            const response = await fetch(fileApi, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiToken}`,
               },
               body: JSON.stringify(queryObj)
            });

            if (!response.ok) {
               throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            // Extract file names from file_details
            const extractedFilenames = data.file_details.map((file) => file.file_name);


            // Set the first file resume (assuming you want the first one)
            setFilenames(extractedFilenames[0]);

            // ...inside your fetchFilenames success path:
            const extractedProfileData = data.user_details[0];
            // dispatch(setProfileData(extractedProfileData));
            initialProfileRef.current = extractedProfileData;
            dispatch(setProfileData(extractedProfileData));
            setCancelStore(extractedProfileData);
            dispatch(setProfileData({ ...extractedProfileData, password: "" }));
            setSubmitActive(true);
            setLoading(false);
         } catch (error) {
            setError(error.message);
            setLoading(false);
         }
      };

      if (userEmail !== '' && apiToken !== '') {
         setTimeout(() => {

            fetchFilenames();
         }, 4000)
      }

      fetchCountries();

   }, [apiTokenReady]);

   const fetchSkillsTechnologies = async () => {
      if (!filenames || filenames?.length === 0) {
         console.error('No filenames available to fetch skills and technologies.');
         return;
      }

      try {
         const fileName = filenames[0].name;
         const bodyData = {
            email_id: userEmail,
            file_name: fileName,
            app_name: 'frontend'
         };

         const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/get_skills_technologies_from_resume_v2', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${apiToken}`,
            },
            body: JSON.stringify(bodyData)
         });

         if (!response.ok) {
            throw new Error('Failed to fetch skills, technologies, and title');
         }

         const data = await response.json();

         // Dispatch tech skills to Redux
         dispatch(setTechSkills(data));
      } catch (error) {
         setError(error.message);
         console.error('Error fetching skills and technologies:', error);
      }
   };

   useEffect(() => {
      if (filenames?.length > 0) {
         fetchSkillsTechnologies();
      }
   }, [filenames, dispatch]);
   const handleInputChange = (e) => {
      const { name, value } = e.target;

      if (name === "mobile_no") {
         const codeFromState = profileData.country_code;
         const codeFromCountry = getCallingCode(profileData.country);
         const finalCode = codeFromState || codeFromCountry || "";

         const formatted = formatPhoneByCountry(
            value,
            profileData.country,
            finalCode
         );

         const updatedProfileData = {
            ...profileData,
            country_code: finalCode,
            mobile_no: formatted,
         };

         dispatch(setProfileData(updatedProfileData));
      } else {
         const updatedProfileData = { ...profileData, [name]: value };
         dispatch(setProfileData(updatedProfileData));
      }
   };


   const getChangedFields = (original = {}, current = {}) => {
      const changed = {};
      for (const [k, v] of Object.entries(current)) {
         if (original?.[k] !== v) changed[k] = v;
      }
      return changed;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!profileData.first_name || !profileData.last_name || !profileData.username) {
         alert("Please fill out all fields.");
         return;
      }

      try {
         const changedColumns = getChangedFields(initialProfileRef.current, {
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            username: profileData.username,
            email: profileData.email,
            country: profileData.country,
            skills: profileData.skills,
            gender: profileData.gender,
            mobile_no: profileData.mobile_no,
            country_code: profileData.country_code,
            middle_name: profileData.middle_name,
            about_me: profileData.about_me,
         });

         const columns = {
            ...changedColumns,
            ...(profileData.password?.trim() ? { password: profileData.password } : {}),
         };

         if (Object.keys(columns).length === 0) {
            setOpenPopup('No changes to update');
            return;
         }

         const updateObj = { emailid: userEmail, modify: { columns } };

         const response = await fetch(fileApi, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${apiToken}`,
            },
            body: JSON.stringify(updateObj),
         });

         if (!response.ok) throw new Error('Failed to update data');

         setOpenPopup('Your Profile has been updated successfully');
         initialProfileRef.current = { ...(initialProfileRef.current || {}), ...columns };
      } catch (error) {
         setError(error.message);
      }
   };

   // Searchable Country dropdown state
   const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
   const [countryMenuStyle, setCountryMenuStyle] = useState({ top: '100%', bottom: 'auto', maxHeight: '250px' });

   // Helper to compute placement and height
   const computeCountryMenuStyle = () => {
      const root = countryDropdownRef.current;
      if (!root) return { top: '100%', bottom: 'auto', maxHeight: '250px' };

      const rect = root.getBoundingClientRect();
      const gap = 8;                 // spacing between button and menu
      const desired = 250;           // your configured max menu height
      const viewportH = window.innerHeight;

      const spaceBelow = viewportH - rect.bottom - gap;
      const spaceAbove = rect.top - gap;

      const openUp = spaceBelow < desired && spaceAbove > spaceBelow;
      const maxHeight = Math.max(100, Math.min(desired, openUp ? spaceAbove : spaceBelow)); // keep at least 100px

      return openUp
         ? { top: 'auto', bottom: '100%', maxHeight: `${maxHeight}px` }
         : { top: '100%', bottom: 'auto', maxHeight: `${maxHeight}px` };
   };
   const [countrySearch, setCountrySearch] = useState("");
   const countryDropdownRef = useRef(null);

   const filteredCountries = useMemo(() => {
      const q = countrySearch.trim().toLowerCase();
      if (!q) return countries || [];
      return (countries || []).filter((c) =>
         c.name.toLowerCase().includes(q) ||
         c.code?.toLowerCase().includes(q) ||
         (c.callingCode || "").toLowerCase().includes(q.replace("+", ""))
      );
   }, [countrySearch, countries]);

   useEffect(() => {
      const onClickOutside = (e) => {
         if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
            setCountryDropdownOpen(false);
         }
      };
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
   }, []);

   const selectCountry = (c) => {
      // Store canonical name and code so getCallingCode/phone display work
      const updated = {
         ...profileData,
         country: c.name || "",
         country_code: c.callingCode || "",
      };
      dispatch(setProfileData(updated));
      setCountryDropdownOpen(false);
      setCountrySearch("");
   };
   const getCallingCode = (countryName) => {
      const country = topCountries.find(
         (c) => c.name.toLowerCase() === String(countryName || "").toLowerCase()
      );
      return country ? country.callingCode : "";
   };

   // Recompute on open + on resize/scroll so it stays pinned in view
   useEffect(() => {
      if (!countryDropdownOpen) return;
      const onRecalc = () => setCountryMenuStyle(computeCountryMenuStyle());
      window.addEventListener('resize', onRecalc);
      window.addEventListener('scroll', onRecalc, true);
      // slight delay to ensure layout is settled
      const id = requestAnimationFrame(onRecalc);
      return () => {
         cancelAnimationFrame(id);
         window.removeEventListener('resize', onRecalc);
         window.removeEventListener('scroll', onRecalc, true);
      };
   }, [countryDropdownOpen]);

   return (
      <Fragment>
         <div className="row">
            <div className="col-xl-9 col-xxl-8 col-lg-8">
               <div className="row">
                  <div className="col-xl-12">
                     <div className="card profile-card">
                        <div className="card-header flex-wrap border-0 pb-0">
                           <h3 className="fs-24 text-black font-w600 me-auto mb-2 pr-3">
                              Edit Profile
                           </h3>
                           <div className="d-flex me-5 align-items-center mb-2">
                              <div className="form-check custom-switch  text-right">
                                 {/* <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="customSwitch1"
                                 />
                                 <label
                                    className="form-check-label mb-0" 
                                    htmlFor="customSwitch1"
                                 >
                                    Available for hire?
                                 </label> */}
                              </div>
                           </div>
                           <Link
                              to="#"
                              className="btn btn-dark light btn-rounded me-3 mb-2 profileCancel"
                              onClick={() => {
                                 dispatch(setProfileData(cancelStore));
                              }}
                           >
                              Cancel
                           </Link>
                           {submitActive ? (<>
                              <Link
                                 className="btn btn-primary btn-rounded mb-2"
                                 to="#"
                                 onClick={handleSubmit}
                              >
                                 Save Changes
                              </Link>
                           </>) : (<>
                              <Link
                                 className="btn btn-primary btn-rounded mb-2"
                                 to="#"
                              >
                                 Getting Details...
                              </Link>
                           </>)}

                        </div>
                        <div className="card-body">
                           <form>
                              <div className="mb-3">
                                 <div className="title mb-4">
                                    <span className="fs-18 text-black font-w600">
                                       General
                                    </span>
                                 </div>
                                 <div className="row">
                                    <div className="col-xl-6 col-sm-6">
                                       <div className="form-group">
                                          <label>First Name</label>
                                          <input
                                             type="text"
                                             className="form-control"
                                             name="first_name"
                                             placeholder="Enter name"
                                             value={profileData.first_name}
                                             onChange={handleInputChange}
                                          />
                                       </div>
                                    </div>
                                    {/* <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>Middle Name</label>
                                          <input
                                             type="text"
                                             className="form-control"
                                             name="middle_name"
                                             placeholder="Type here"
                                             value={profileData.middle_name} // Assuming you have middle_name in profileData
                                             onChange={handleInputChange}
                                          />
                                       </div>
                                    </div> */}
                                    <div className="col-xl-6 col-sm-6">
                                       <div className="form-group">
                                          <label>Last Name</label>
                                          <input
                                             type="text"
                                             className="form-control"
                                             placeholder="Last name"
                                             name="last_name"
                                             value={profileData.last_name}
                                             onChange={handleInputChange}
                                          />
                                       </div>
                                    </div>
                                    <div className="col-xl-6 col-sm-6">
                                       <div className="form-group">
                                          <label>Username <span className="required">*</span></label>
                                          <input
                                             type="text"
                                             className="form-control"
                                             name="username"
                                             placeholder="User name"
                                             value={profileData.username}
                                             onChange={handleInputChange}
                                             disabled
                                          />
                                       </div>
                                    </div>
                                    <div className="col-xl-6 col-sm-6">
                                       <div className="form-group">
                                          <label>Password <span className="required">*</span></label>
                                          <input
                                             type="password"
                                             className="form-control"
                                             placeholder="Enter password"
                                             name="password"
                                             autoComplete="new-password"
                                             value="Test@12344574"
                                             disabled
                                          // onChange={handleInputChange}
                                          />
                                       </div>
                                    </div>

                                 </div>
                              </div>
                              <div className="mb-3">
                                 <div className="title mb-4">
                                    <span className="fs-18 text-black font-w600">
                                       CONTACT
                                    </span>
                                 </div>
                                 <div className="row">
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>Phone Number</label>
                                          <div className="input-group input-icon mb-3">
                                             <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1">
                                                   <i className="fa fa-phone" aria-hidden="true"></i>
                                                </span>
                                             </div>
                                             <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Phone number"
                                                name="mobile_no"
                                                value={profileData.mobile_no}
                                                onChange={handleInputChange}
                                             />
                                          </div>
                                       </div>
                                    </div>

                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group">
                                          <label>Email</label>
                                          <div className="input-group input-icon mb-3">
                                             <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon3">
                                                   <i className="las la-envelope"></i>
                                                </span>
                                             </div>
                                             <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleInputChange}
                                                disabled
                                             />
                                          </div>
                                       </div>
                                    </div>
                                    <div className="col-xl-4 col-sm-6">
                                       <div className="form-group countryfield">
                                          <label>Country</label>

                                          <div className="dropdown position-relative" ref={countryDropdownRef}>
                                             <button
                                                className="btn btn-outline-secondary dropdown-toggle w-100 text-start customDropDown"
                                                type="button"
                                                onClick={() => {
                                                   // compute placement based on current position
                                                   const style = computeCountryMenuStyle();
                                                   setCountryMenuStyle(style);
                                                   setCountryDropdownOpen((v) => !v);
                                                }}

                                             >
                                                {profileData.country || "Select country"}
                                             </button>

                                             <ul
                                                className={`dropdown-menu w-100 customDropDownMenu ${countryDropdownOpen ? "show" : ""}`}
                                                style={{
                                                   position: "absolute",
                                                   zIndex: 1000,
                                                   overflowY: "auto",
                                                   padding: "8px",
                                                   background: "#fff",
                                                   ...countryMenuStyle,
                                                }}
                                             >
                                                <li>
                                                   <input
                                                      type="text"
                                                      className="form-control mb-2"
                                                      placeholder="Search country..."
                                                      value={countrySearch}
                                                      onChange={(e) => setCountrySearch(e.target.value)}
                                                      style={{
                                                         maxHeight: "38px",
                                                         paddingLeft: "15px",
                                                         paddingRight: "15px",
                                                         fontSize: "14px",
                                                         color: "#020817",
                                                         borderRadius: "0",
                                                         background: "#fff",
                                                         fontWeight: "500",
                                                      }}
                                                      onClick={(e) => e.stopPropagation()}
                                                   />
                                                </li>

                                                <li>
                                                   <button
                                                      className="dropdown-item"
                                                      type="button"
                                                      onClick={() => selectCountry({ name: "", callingCode: "" })}
                                                   >
                                                      Select country
                                                   </button>
                                                </li>

                                                {filteredCountries.length ? (
                                                   filteredCountries.map((c) => (
                                                      <li key={c.code}>
                                                         <button
                                                            className={`dropdown-item ${c.name === profileData.country ? "active" : ""}`}
                                                            type="button"
                                                            onClick={() => selectCountry(c)}
                                                         >
                                                            {c.name} {c.callingCode ? `(${c.callingCode})` : ""}
                                                         </button>
                                                      </li>
                                                   ))
                                                ) : (
                                                   <li className="dropdown-item disabled">No countries found</li>
                                                )}
                                             </ul>
                                          </div>
                                       </div>
                                    </div>

                                 </div>
                              </div>
                              <div className="mb-3">
                                 <div className="row">
                                    <div className="col-xl-12">
                                       <div className="form-group">
                                          <label>Let us know about yourself</label>
                                          <textarea
                                             className="form-control"
                                             rows="6"
                                             name="about_me"
                                             value={profileData.about_me}
                                             onChange={handleInputChange}
                                             defaultValue=""
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div>
                                 <div className="title mb-4">
                                    <span className="fs-18 text-black font-w600">
                                       Skills
                                    </span>
                                 </div>
                                 <div className="row">
                                    {techSkills?.top_technologies && techSkills.top_technologies?.length > 0 ? (
                                       techSkills?.top_skills?.map((skill, index) => (
                                          <div className="col-xl-6" key={index}>
                                             <div className="media mb-4">
                                                <span className="text-primary progress-icon me-3">
                                                   {skill?.proficiency}%
                                                </span>
                                                <div className="media-body">
                                                   <p className="font-w500">{skill?.name}</p>
                                                   <div className="progress skill-progress" style={{ height: "10px" }}>
                                                      <div
                                                         className="progress-bar bg-primary progress-animated"
                                                         style={{
                                                            width: `${skill?.proficiency}%`,
                                                            height: "10px",
                                                         }}
                                                         role="progressbar"
                                                      >
                                                         <span className="sr-only">{skill?.proficiency}% Complete</span>
                                                      </div>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       ))) : (
                                       [1, 2, 3].map((_, index) => (
                                          <div key={index} className="col-xl-6">
                                             <div className="media mb-4">
                                                <span className="skeleton skeleton-icon me-3">
                                                   <div className="skeleton skeleton-circle"></div>
                                                </span>
                                                <div className="media-body">
                                                   <div className="skeleton skeleton-text mb-2" style={{ width: "80%" }}></div>
                                                   <div className="progress skill-progress" style={{ height: "10px" }}>
                                                      <div
                                                         className="skeleton skeleton-progress"
                                                         style={{
                                                            width: "100%",
                                                            height: "10px",
                                                         }}
                                                      ></div>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       ))
                                    )}
                                 </div>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl-3 col-xxl-4 col-lg-4">
               <div className="row">
                  <div className="col-xl-12">
                     <div className="card  flex-lg-column flex-md-row ">
                        <div className="card-body card-body  text-center border-bottom profile-bx">
                           <div className="profile-image mb-4">
                              <img
                                 src={profileImg}
                                 className="rounded-circle"
                                 alt=""
                              />
                           </div>
                           <h4 className="fs-22 text-black mb-1">{profileData.first_name} {profileData.last_name}</h4>
                           {techSkills?.recent_job_title ? (
                              <p className="mb-4">{techSkills.recent_job_title}</p>
                           ) : (
                              <div className="skeleton-loader mb-4"></div>
                           )}
                        </div>
                        <div className="card-body  border-left">
                           <div className="d-flex mb-3 align-items-center">
                              <Link className="contact-icon me-3" to="#">
                                 <i
                                    className="fa fa-phone"
                                    aria-hidden="true"
                                 ></i>
                              </Link>

                              {profileData ? (
                                 <>
                                    <span className="text-black">
                                       {/* {getCallingCode(profileData.country)} */}
                                       {profileData?.mobile_no}
                                    </span>
                                 </>
                              ) : (
                                 <div className="skeleton-loader mb-4"></div>
                              )}

                           </div>
                           <div className="d-flex mb-3 align-items-center">
                              <Link className="contact-icon me-3" to="#">
                                 <i className="las la-envelope"></i>
                              </Link>
                              <span className="text-black">
                                 {profileData?.email}
                              </span>
                           </div>
                           <div className="row text-center mt-2 mt-md-5">
                              <h5 className="mb-4">Key skills featured in your profile</h5>
                              {techSkills?.top_technologies && techSkills.top_technologies?.length > 0 ? (
                                 techSkills.top_technologies.map((tech, index) => {
                                    const proficiency = tech?.proficiency || 0;
                                    const percentage = (proficiency / 100) * 100; // Assuming proficiency is in percentage (0-100)
                                    const strokeDasharray = `${percentage} ${100 - percentage}`;

                                    return (
                                       <div key={index} className="col-4 p-0">
                                          <div className="d-inline-block mb-2 relative donut-chart-sale">
                                             <svg className="peity" height={75} width={75} viewBox="0 0 42 42">
                                                <circle
                                                   className="donut-ring"
                                                   cx="21"
                                                   cy="21"
                                                   r="15.91549430918954"
                                                   fill="transparent"
                                                   stroke="#e6e6e6"
                                                   strokeWidth="3"
                                                />
                                                <circle
                                                   className="donut-segment"
                                                   cx="21"
                                                   cy="21"
                                                   r="15.91549430918954"
                                                   fill="transparent"
                                                   stroke={
                                                      index === 0
                                                         ? "#FF8E26" // Orange
                                                         : index === 1
                                                            ? "#3EA834"  // Green
                                                            : "#22AC93"  // Teal
                                                   }
                                                   strokeWidth="3"
                                                   strokeDasharray={strokeDasharray}
                                                   strokeDashoffset="25"
                                                />
                                             </svg>
                                             <small className="text-black">{tech.proficiency}</small>
                                          </div>
                                          <span className="d-block">{tech.name}</span>
                                       </div>
                                    );
                                 })
                              ) : (
                                 // Render skeleton loaders while loading
                                 [1, 2, 3].map((_, index) => (
                                    <div key={index} className="col-4 p-0">
                                       <div className="d-inline-block mb-2 relative donut-chart-sale">
                                          <div className="skeleton skeleton-circle"></div>
                                          <small className="text-black">
                                          </small>
                                       </div>
                                       <span className="d-block">
                                          <div className="skeleton skeleton-text m-auto"></div>
                                       </span>
                                    </div>
                                 ))
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
                  {/* portfolio and social media section */}
                  <div className="col-xl-12">
                     <div className="card">
                        <div className="card-header border-0 pb-0">
                           <h4 className="fs-20 text-black">Replace Your Resume</h4>

                        </div>
                        <div className="card-body portfolios-card">
                           <ResumeUpload />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div
            onClick={toggleTheme}
            style={{
               cursor: "pointer",
               padding: "10px",
               backgroundColor: "#ddd",
               display: "none",
               borderRadius: "50%",
               position: "fixed",
               top: "50%",
               right: "0",
            }}
         >
            {isDarkMode ? <MoonIcon /> : <SunIcon />}
         </div>
         {openPopup !== '' && (
            <div className={`pro-bg popup ${isDarkMode === false ? "dark" : "Light"}`}>
               <div className="pro-container small">
                  <div className="pro-header flex-row">
                     <span>Profile Status</span>
                     <div className="close" onClick={() => { setOpenPopup('') }}>+</div>
                  </div>
                  <div className="upgrade-description">
                     {openPopup}
                  </div>
               </div>
            </div>
         )}
      </Fragment>
   );
};

export default Profile;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from "react-router-dom";
import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import { setApiToken, setProductCode, setShowPro, setMembershipData, setApiTokenReady, setFileResume, setSubscriptionNextAction, SetFeaturesToBlock,setJobResumeUpload, setActivities } from '../../../store/actions/actions';
import Payment from './redirection-gif.gif';
import "../navStyle.css";

import { Link, useNavigate } from "react-router-dom";
/// Scroll
//import PerfectScrollbar from "react-perfect-scrollbar";
import LogoutPage from './Logout';
/// Image
import Icons from "./proIcon.svg";
import ProIcon from "./proIcon.svg";
import profile from "../../../images/profile/profile.svg";
import { Dropdown } from "react-bootstrap";
import JoinRightArr from "./rightArrow.png";
import { register } from "react-scroll/modules/mixins/scroller";

const Header = ({ onNote, toggle, onProfile, onNotification  }) => {
   const dispatch = useDispatch();
   const location = useLocation();
   const { apiToken, productCode, activities, isDarkMode, featuresToBlock, subscriptionNextAction, showPro, membershipData, fileResume, apiTokenReady, jobResumeUpload } = useSelector(state => state.profile);
   const userEmail = useSelector(state => state.auth.auth.email);
   const accesstoken = useSelector((state)=> state.auth.auth.accesstoken);
   const [subscription, setSubscription] = useState("");
   const [paymentRedirection, setPaymentRedirection] = useState(false);
   const storedUserDetails = localStorage.getItem("userDetails");
   const userDetails = JSON.parse(storedUserDetails);

   
   useEffect(()=>{
      
         if (userEmail!=''){
            dispatch(setApiToken(accesstoken));
            setTimeout(()=>{
               dispatch(setApiTokenReady(true));
            },1000);
      }
   },[userEmail])
   const fetchActivities = async () => {
      try {
      const queryObj = {
         email_id: userEmail, // Using memoized userEmail
         task: "recent_activity",
      };

      const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/user_recent_activities_v2', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         'Authorization': `Bearer`,
         },
         body: JSON.stringify(queryObj),
      });

      if (!response.ok) {
         throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      dispatch(setActivities(data.recent_activity));
      } catch (error) {
      console.error("File Error:", error);
      }
   };
   useEffect(()=>{
      if (location.pathname === '/resume-upload'){
         console.log('fill resume')
      }
      else{
         if (apiTokenReady!==false && apiToken!==''){
            fetchMembership();
            fetchActivities();
         }
      }
   },[apiTokenReady])
   useEffect(() => {
      if (location.pathname === '/resume-upload'){
         console.log('fill resume')
      }
      else{
         if (userEmail!=''){
            setSubscription(userDetails.subscription);
         }
      
      }
   }, [userDetails]);
   useEffect(() => {
      if (location.pathname === '/resume-upload'){
         console.log('fill resume')
      }
      else{

         setPaymentRedirection(false);
      }
   }, [setShowPro]);

   

   //  // Start the loop when the component mounts
   //  useEffect(() => {

   //       setTimeout(()=>{
   //          if (userEmail!=''){
   //          makePostRequest();
   //          }
   //       },15000)
   //  }, [userEmail]);
   
   const navigate = useNavigate();
    
    

    function selectProductCode(productCode){
      dispatch(setProductCode(productCode));
    }
    
    const togglePro = () => {
      dispatch(setShowPro(!showPro));
    };
  
    function buyNow(code) {
      try {
         fetchPayment(code);
         setPaymentRedirection(true);
      } catch (error) {
         console.error("Error in buyNow:", error);
      }
   }
    function buyNow2() {
      try {
         fetchPayment("PC_102");
         setPaymentRedirection(true);
      } catch (error) {
         console.error("Error in buyNow:", error);
      }
   }
  
     
  const fetchPayment = async (text) => {
   if (!membershipData || membershipData.length === 0) {
      console.error("Membership data is unavailable");
      return;
   }

   try {
      const queryPro = {
         user_email: userEmail,
         product_code: text,
      };
      console.log(membershipData[0]);
      
      const response = await fetch(
         "https://us-east1-foursssolutions.cloudfunctions.net/create_payment_request_v2",
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(queryPro),
         }
      );

      if (!response.ok) {
         throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      window.location.href = `${data.payment_link}`;
      setPaymentRedirection(false);
   } catch (error) {
      console.error("File Error:", error);
   }
};


    const fetchMembership = async () => {
      if(membershipData.length <= 0) {
      
         try {
            const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/send_resume_details_front_end_v2", {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiToken}`
               },
               body: JSON.stringify({
                  emailid: userEmail
               })
            });
            const data = await response.json();
            const extractedFilenames = data.file_details.map((file) => file.file_name);
            console.log(data);
            dispatch(setMembershipData(data.product_details));
            dispatch(SetFeaturesToBlock(data.features_to_block));
            dispatch(setSubscriptionNextAction(data.subscription_next_action));
            dispatch(setFileResume(extractedFilenames[0]));
            if (data.show_resume_upload === true) {
               if(location.pathname=="/job/detailed"){
                  dispatch(setJobResumeUpload(true));
               }
               else{

                  navigate("/resume-upload");
               }
            }
            if (!response.ok) {
               throw new Error('Failed to fetch data');
            }
         } catch (error) {
            console.error("File Error:", error);
         }
      }
   };
    

  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'browser';
  const [ip, setIp] = useState('');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => setIp(data.ip))
      .catch((error) => console.error('Error fetching IP:', error));
  }, []);

  function goToLogin() {
      navigate("/login");
  }
  function goToRegister() {
      navigate("/page-register");
  }

  const [showDropdown, setShowDropdown] = useState(false);
  const tokenDetailsString = localStorage.getItem('userDetails');

  // Automatically close dropdown on route change
  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);


   const getRandomDelay = () => Math.floor(Math.random() * (12 - 2 + 1) + 2) * 60000;

    // Function to make the POST request
    const makePostRequest = async () => {
      try {
         const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/get_authentication_tokens_v2", {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               user_email: userEmail,
               ip: `${ip}`,
               device: { type: deviceType },
               token_type: "access_token"
           })
         });

            if (response.ok) {
               // Call the function again after a random delay
                 const delay = getRandomDelay();
                 console.log(`Next request in ${delay / 60000} minutes`);
                 setTimeout(makePostRequest, delay);
                 const data = await response.json();
                 console.log(data.result.access_token);
                 dispatch(setApiToken(data.result.access_token))
            } else {
               const data = await response.json();
               console.log('Response:', data);
            }
         } catch (error) {
            console.error('Error making POST request:', error);
         }
    };
   
    const userName= userEmail.split('@')[0]
    
   var path = window.location.pathname.split("/");
   var name = path[path.length - 1].split("-");
   var filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;
   var finalName = filterName.includes("app")
      ? filterName.filter((f) => f !== "app")
      : filterName.includes("ui")
      ? filterName.filter((f) => f !== "ui")
      : filterName.includes("uc")
      ? filterName.filter((f) => f !== "uc")
      : filterName.includes("basic")
      ? filterName.filter((f) => f !== "basic")
      : filterName.includes("form")
      ? filterName.filter((f) => f !== "form")
      : filterName.includes("table")
      ? filterName.filter((f) => f !== "table")
      : filterName.includes("page")
      ? filterName.filter((f) => f !== "page")
      : filterName.includes("email")
      ? filterName.filter((f) => f !== "email")
      : filterName.includes("ecom")
      ? filterName.filter((f) => f !== "ecom")
      : filterName.includes("chart")
      ? filterName.filter((f) => f !== "chart")
      : filterName.includes("editor")
      ? filterName.filter((f) => f !== "editor")
      : filterName;
   return (
      <>
      {location.pathname=="/job/detailed"?(<></>):(<>
      
         <div className={`header ${location.pathname=="/videoInterview"?"hideHeader":""}`}>
            <div className={`header-content ${location.pathname=="/aspire-quest" ? "whiteHeader":""}${location.pathname=="/interview-exam" ? "whiteHeader":""}`}>
               <nav className="navbar navbar-expand">
                  <div className="collapse navbar-collapse justify-content-between">
                     <div className="header-left">
                        <div
                           className="dashboard_bar"
                           style={{ textTransform: "capitalize" }}
                        >
                           {finalName.join(" ")}
                        </div>
                     </div>
                     {location.pathname === '/resume-upload' || (location.pathname === '/job/detailed' && apiTokenReady!==true)?(
                        <></>
                     ):(
                        <>
                        {subscriptionNextAction==="Pro User"?(
                           <Link className="nav-link pro-item" >
                              <img src={ProIcon} className="icon" alt ="icons"/>
                              <span >Pro User</span>
                           </Link>
                        ):(
                           <Link className="nav-link pro-item" onClick={togglePro}>
                              <img src={ProIcon} className="icon" alt ="icons"/>
                              <span >Upgrade To Pro</span>
                           </Link>
                        )}
                        </>

                     )}
                     
                     
                     <ul className="navbar-nav header-right">
                        <li className="nav-item">
                           
                        </li>
                        {/* <li className="nav-item">
                           <div className="input-group search-area d-lg-inline-flex d-none">
                              <input
                                 type="text"
                                 className="form-control"
                                 placeholder="Search something here..."
                              />
                              <div className="input-group-append">
                                 <span className="input-group-text">
                                    <i className="flaticon-381-search-2"></i>
                                 </span>
                              </div>
                           </div>
                        </li> */}
                        {/* <li className="nav-item dropdown notification_dropdown">
                           <Link to={"#"}
                              className="nav-link bell bell-link"
                              onClick={() => onNote()}
                           >
                              <svg
                                 width="28"
                                 height="28"
                                 viewBox="0 0 28 28"
                                 fill="none"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <path
                                    d="M22.5678 26.5202C22.8079 26.5202 23.0447 26.6115 23.2249 26.7856C24.3769 27.8979 26.0572 28.2683 27.551 27.8047C26.5897 25.802 26.4564 23.5075 27.2014 21.383C28.126 18.7398 28.3577 16.0905 27.3055 13.4334C26.381 11.0992 24.5971 9.15994 22.3395 8.05408C22.4784 8.79455 22.5484 9.54903 22.5484 10.3115C22.5484 13.5478 21.304 16.5916 19.0444 18.8823C16.7846 21.1733 13.7553 22.4615 10.5147 22.5097C9.91267 22.5191 9.31331 22.4837 8.72073 22.4056C10.5017 25.5274 13.8606 27.5606 17.5516 27.6153C19.1663 27.6403 20.7166 27.302 22.1604 26.6125C22.2904 26.5503 22.4296 26.5202 22.5678 26.5202Z"
                                    fill="#3E4954"
                                 />
                                 <path
                                    d="M10.541 0.00236249C4.79223 -0.111786 0.0134501 4.53885 -0.000411333 10.2863C-0.00380737 11.6906 0.270302 13.052 0.814361 14.3331C0.822262 14.3517 0.829608 14.3706 0.836262 14.3897C1.58124 16.5142 1.4481 18.8086 0.486678 20.8114C1.98059 21.2748 3.66073 20.9046 4.81275 19.7922C5.09656 19.518 5.5212 19.449 5.8773 19.6192C7.3209 20.3087 8.87143 20.648 10.486 20.6221C16.1898 20.5374 20.6576 16.0085 20.6576 10.3117C20.6576 4.73921 16.1193 0.114501 10.541 0.00236249ZM4.81898 11.8517C3.99305 11.8517 3.32348 11.1832 3.32348 10.3587C3.32348 9.53414 3.99305 8.86568 4.81898 8.86568C5.64492 8.86568 6.31449 9.53414 6.31449 10.3587C6.31442 11.1832 5.64492 11.8517 4.81898 11.8517ZM10.3286 11.8517C9.50268 11.8517 8.8331 11.1832 8.8331 10.3587C8.8331 9.53414 9.50268 8.86568 10.3286 8.86568C11.1545 8.86568 11.8241 9.53414 11.8241 10.3587C11.8241 11.1832 11.1545 11.8517 10.3286 11.8517ZM15.8383 11.8517C15.0124 11.8517 14.3428 11.1832 14.3428 10.3587C14.3428 9.53414 15.0124 8.86568 15.8383 8.86568C16.6642 8.86568 17.3338 9.53414 17.3338 10.3587C17.3338 11.1832 16.6642 11.8517 15.8383 11.8517Z"
                                    fill="#3E4954"
                                 />
                              </svg>
                              <span className="badge light text-white bg-primary rounded-circle">
                                 18
                              </span>
                           </Link>
                        </li> */}
                        {location.pathname === '/resume-upload'|| (location.pathname === '/job/detailed' && apiTokenReady!==true)?(
                              <>
                              
                              </>
                           ):(
                              <>
                              <Dropdown as="li" className="nav-item dropdown notification_dropdown">
                              <Dropdown.Toggle to={"#"}
                                 className="nav-link i-false  ai-icon"
                                 as="div"                           
                              >
                                 <svg
                                    width="26"
                                    height="28"
                                    viewBox="0 0 26 28"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       d="M9.45251 25.6682C10.0606 27.0357 11.4091 28 13.0006 28C14.5922 28 15.9407 27.0357 16.5488 25.6682C15.4266 25.7231 14.2596 25.76 13.0006 25.76C11.7418 25.76 10.5748 25.7231 9.45251 25.6682Z"
                                       fill="#3E4954"
                                    />
                                    <path
                                       d="M25.3531 19.74C23.8769 17.8785 21.3995 14.2195 21.3995 10.64C21.3995 7.09073 19.1192 3.89758 15.7995 2.72382C15.7592 1.21406 14.5183 0 13.0006 0C11.4819 0 10.2421 1.21406 10.2017 2.72382C6.88095 3.89758 4.60064 7.09073 4.60064 10.64C4.60064 14.2207 2.12434 17.8785 0.647062 19.74C0.154273 20.3616 0.00191325 21.1825 0.240515 21.9363C0.473484 22.6721 1.05361 23.2422 1.79282 23.4595C3.08755 23.8415 5.20991 24.2715 8.44676 24.491C9.84785 24.5851 11.3543 24.64 13.0007 24.64C14.646 24.64 16.1524 24.5851 17.5535 24.491C20.7914 24.2715 22.9127 23.8415 24.2085 23.4595C24.9477 23.2422 25.5268 22.6722 25.7597 21.9363C25.9983 21.1825 25.8448 20.3616 25.3531 19.74Z"
                                       fill="#3E4954"
                                    />
                                 </svg>
                                 <span className="badge light text-white bg-primary rounded-circle">
                                    {activities?.length}
                                 </span>
                              </Dropdown.Toggle>
                              <Dropdown.Menu
                                 className="dropdown-menu dropdown-menu-right" align="end"
                              >
                                 <div
                                    id="DZ_W_Notification1"
                                    className={` widget-media dz-scroll p-3 height380 ${
                                       toggle === "notification"
                                          ? ""
                                          : ""
                                    }`}
                                 >
                                    <ul className="timeline">
                                    {activities && activities.length > 0 ?(activities.map((item, index)=>(
                                       <li>
                                          <div className="timeline-panel">
                                             <div className="media me-2 media-success">
                                                <i className="fa fa-home"></i>
                                             </div>
                                             <div className="media-body">
                                                <h6 className="mb-1">
                                                   {item.activity}
                                                </h6>
                                                <small className="d-block">
                                                   {item.time_ago}
                                                </small>
                                             </div>
                                          </div>
                                       </li>
                                       ))):(                            
                                          <div className="recent-facade col-xl-12">
                                          </div>
                                       )}
                                    </ul>
                                 </div>
                                 <Link to={"#"} className="all-notification">
                                    See all notifications{" "}
                                    <i className="ti-arrow-right"></i>
                                 </Link>
                              </Dropdown.Menu>
                              </Dropdown>
                              </>
                        )}
                        {(location.pathname === '/job/detailed' && apiTokenReady!==true)?(
                           <>
                           <div className="jButtonRow">
                              <button className="join-now-filled" onClick={goToRegister}>
                                 Join Now
                                 <img src={JoinRightArr} className="rArrIcon" alt="rightArr" />
                              </button>
                              <div className="join-btn-divider"></div>
                              <button className="join-now-bordered" onClick={goToLogin}>
                                 <div className="inner-button">
                                    Sign In
                                    <img src={JoinRightArr} className="rArrIcon" alt="rightArr" />
                                 </div>
                              </button>
                           </div>
                           </>
                        ):(
                           <>
                           {location.pathname === '/resume-upload'?(
                              <>
                                 <Dropdown as="li" className={`nav-item header-profile `}>
                                    <Dropdown.Toggle className="nav-link i-false" as="a" >
                                       <img src={profile} width="20" alt="" />
                                       <div className="header-info">
                                          <span className="text-black">{userName}</span>
                                          <p className="fs-12 mb-0">Job Applicant</p>
                                       </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className={`dropdown-menu-right`}>
                                       <LogoutPage />
                                    </Dropdown.Menu>
                                 </Dropdown>
                              </>
                           ):(
                              <>
                                 <Dropdown as="li" className={`nav-item header-profile `}
                                 show={showDropdown}
                                 onToggle={(isOpen) => setShowDropdown(isOpen)}
                                 >
                                    <Dropdown.Toggle className="nav-link i-false" as="a" 
                                    onClick={(e) => {
                                       e.preventDefault(); // Prevent <a> tag default
                                       setShowDropdown(!showDropdown);
                                    }}>
                                       <img src={profile} width="20" alt="" />
                                       <div className="header-info">
                                          <span className="text-black">{userName}</span>
                                          <p className="fs-12 mb-0">Job Applicant</p>
                                       </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className={`dropdown-menu-right  header-navpopup`}>
                                       <Link
                                          to="/profile"
                                          className="dropdown-item ai-icon"
                                       >
                                          <svg
                                             id="icon-user1"
                                             xmlns="http://www.w3.org/2000/svg"
                                             className="text-primary"
                                             width="18"
                                             height="18"
                                             viewBox="0 0 24 24"
                                             fill="none"
                                             stroke="currentColor"
                                             strokeWidth="2"
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                          >
                                             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                             <circle cx="12" cy="7" r="4"></circle>
                                          </svg>
                                          <span className="ms-2">Profile </span>
                                       </Link>
                                       <Link
                                          to="/subscription"
                                          className="dropdown-item ai-icon"
                                       >
                                          {isDarkMode===false?(
                                             <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.4133 7.6308C10.3287 7.37991 10.1728 7.16272 9.96688 7.00896C9.76092 6.8552 9.51498 6.77238 9.26271 6.77184H8.31821C8.04876 6.77035 7.78835 6.87438 7.58734 7.06381C7.38634 7.25325 7.25902 7.51462 7.23 7.7974C7.20099 8.08018 7.27234 8.36427 7.43026 8.59473C7.58818 8.8252 7.82145 8.98567 8.08497 9.04511L9.52315 9.37633C9.81723 9.44428 10.0771 9.62455 10.2529 9.88249C10.4288 10.1404 10.5081 10.4579 10.4756 10.7738C10.4432 11.0897 10.3013 11.3818 10.0772 11.594C9.85316 11.8062 9.5627 11.9235 9.26166 11.9234H8.44896C7.91761 11.9234 7.46576 11.5657 7.29841 11.0655M8.85583 6.77184V5.4834M8.85583 13.2118V11.9245M3.76831 16.6742V13.914H6.3832" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M15.6816 8.17942C15.9593 9.74191 15.7376 11.3575 15.0513 12.7726C14.365 14.1877 13.2531 15.3222 11.8899 15.9981C10.5267 16.674 8.98949 16.8529 7.51954 16.5069C6.04959 16.1608 4.73009 15.3094 3.76816 14.0862M2.31846 10.8203C2.04079 9.25786 2.26248 7.64228 2.94875 6.22717C3.63501 4.81206 4.747 3.67754 6.11017 3.00167C7.47335 2.3258 9.01055 2.14684 10.4805 2.49288C11.9505 2.83892 13.27 3.69038 14.2319 4.9136" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M14.2321 2.32544V5.0856H11.6172" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                                             </svg>
                                          ):(
                                             <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M10.4133 7.6308C10.3287 7.37991 10.1728 7.16272 9.96688 7.00896C9.76092 6.8552 9.51498 6.77238 9.26271 6.77184H8.31821C8.04876 6.77035 7.78835 6.87438 7.58734 7.06381C7.38634 7.25325 7.25902 7.51462 7.23 7.7974C7.20099 8.08018 7.27234 8.36427 7.43026 8.59473C7.58818 8.8252 7.82145 8.98567 8.08497 9.04511L9.52315 9.37633C9.81723 9.44428 10.0771 9.62455 10.2529 9.88249C10.4288 10.1404 10.5081 10.4579 10.4756 10.7738C10.4432 11.0897 10.3013 11.3818 10.0772 11.594C9.85316 11.8062 9.5627 11.9235 9.26166 11.9234H8.44896C7.91761 11.9234 7.46576 11.5657 7.29841 11.0655M8.85583 6.77184V5.4834M8.85583 13.2118V11.9245M3.76831 16.6742V13.914H6.3832" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                                             <path d="M15.6816 8.17942C15.9593 9.74191 15.7376 11.3575 15.0513 12.7726C14.365 14.1877 13.2531 15.3222 11.8899 15.9981C10.5267 16.674 8.98949 16.8529 7.51954 16.5069C6.04959 16.1608 4.73009 15.3094 3.76816 14.0862M2.31846 10.8203C2.04079 9.25786 2.26248 7.64228 2.94875 6.22717C3.63501 4.81206 4.747 3.67754 6.11017 3.00167C7.47335 2.3258 9.01055 2.14684 10.4805 2.49288C11.9505 2.83892 13.27 3.69038 14.2319 4.9136" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                                             <path d="M14.2321 2.32544V5.0856H11.6172" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                                             </svg>

                                          )}
                                          

                                          <span className="ms-2">My subscriptions</span>
                                       </Link>
                                       
                                       <LogoutPage />
                                    </Dropdown.Menu>
                                 </Dropdown>
                              </>
                           )}
                           </>
                        )}
                        
                        
                        
                     </ul>
                  </div>
               </nav>
            </div>
            {showPro && (
               <div className="pro-bg">
                  <div className="pro-container productsContainer">
                     <div className="pro-header flex-row">
                        <img src={Icons} className="icon" alt ="icons"/>
                        <span>Upgrade To Pro</span>
                        <div className="close" onClick={togglePro}>+</div>
                     </div>
                     <div className="pro-products">
                        {paymentRedirection===false?(<>
                        
                           {membershipData!==null ? (
                              <>
                              {console.log(membershipData)
                              }
                                 <div className={`card ${productCode===membershipData[0].product_code?"active":""}`}  onMouseOver={() => selectProductCode(membershipData[0].product_code)}>
                                    <div className="card-body">
                                       <img className="icon" src={ProIcon} alt="promember"></img>
                                       <h5 className="card-title">{membershipData[0].product_name}</h5>
                                       <p className="card-text">{membershipData[0].product_description}</p>
                                       <button
                                       className="btn btn-primary"
                                       onClick={()=>buyNow(membershipData[0].product_code)}
                                       >
                                       {/* Buy Now $9.99 */}
                                       Buy Now ${membershipData[0].product_price}
                                       </button>
                                    </div>
                                 </div>
                                 <div className={`card ${productCode===membershipData[1].product_code?"active":""}`}  onMouseOver={() => selectProductCode(membershipData[1].product_code)}>
                                    <div className="card-body">
                                       <img className="icon" src={ProIcon} alt="promember"></img>
                                       <h5 className="card-title">{membershipData[1].product_name}</h5>
                                       <p className="card-text">{membershipData[1].product_description}</p>
                                       
                                       <button
                                       className="btn btn-primary"
                                       onClick={()=>buyNow(membershipData[1].product_code)}
                                       >
                                       Buy Now ${membershipData[1].product_price}
                                       </button>
                                    </div>
                                 </div>
                              </>
                              ):(<div className="facade"></div>)}
                              </>
                        ):(
                           <>
                           <div className="payment-animation">
                              <img src={Payment} className="payment-redirection-gif" alt="payment"/>
                           </div>
                           </>
                        )}
                     
                     </div>
                        
                        
                  </div>
               </div>
            )}
         </div>
      </>)}
      </>
   );
};

export default Header;

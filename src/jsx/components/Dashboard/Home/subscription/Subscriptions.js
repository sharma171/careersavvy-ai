import React, { Fragment, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProductCode, setShowPro } from '../../../../../store/actions/actions';

import { Link } from "react-router-dom";
import LoaderIcon from "../loading-gif.gif";
import "./subscription.css";
import "../styles/dash.css";
import GptIcon from "../../SearchJobs/aiIcon.gif";

//** Import Image */

import { ThemeContext } from "../../../../../context/ThemeContext";





const DashboardDark = () => {
   const { changeBackground } = useContext(ThemeContext);
   const [showLoader, setShowLoader] = useState(false);
   const dispatch = useDispatch();
   function selectProductCode(productCode) {
      dispatch(setProductCode(productCode));
   }

   const navigate = useNavigate();
   const [error, setError] = useState("");
   const [message, setMessage] = useState("");
   const [loaderAnimation, setLoaderAnimation] = useState(false);
   const [subscriptionStatus, setSubscriptionStatus] = useState(false);
   const { productCode, subscriptionNextAction, isDarkMode, apiToken, apiTokenReady, membershipData } = useSelector(state => state.profile);
   const userEmail = useSelector(state => state.auth.auth.email);
   const [subscriptionData, setSubscriptionData] = useState(null);
   const [subscriptionDetails, setSubscriptionDetails] = useState(null);
   const [showCancelPopup, setShowCancelPopup] = useState(false);
   useEffect(() => {
      changeBackground({ value: "Light", label: "Light" });
   }, []);

   useEffect(() => {
      if (userEmail !== '')
         fetchSubscriptionData();
   }, [userEmail]);

   const fetchSubscriptionData = async () => {
      try {
         const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/send_resume_details_front_end_v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailid: userEmail })
         });
         const data = await response.json();
         setSubscriptionData(data.user_details[0]);
         setSubscriptionDetails(data)
         console.log(data);
      } catch (error) {
         console.error('Error fetching subscription data:', error);
      }
   };
   function handlePayment() {
      dispatch(setShowPro(true));
   }

   const fetchPayment = async () => {
      setLoaderAnimation(true);
      try {
         const queryPro = {
            user_email: userEmail,
            product_code: membershipData.product_code || "PC_101",
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
         setLoaderAnimation(false);
      } catch (error) {
         console.error("File Error:", error);
      }
   };

   const handleCancelSubscription = async () => {
      setShowLoader(true);

      try {
         const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/stripe_subscription_cancellation_v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_email: userEmail, product_code: subscriptionDetails.user_details[0].subscribed_product_code || "PC_101" })
         });
         const data = await response.json();
         // alert(data.status);
         setSubscriptionStatus(true);
         setShowCancelPopup(false);
         setShowLoader(false);
         fetchSubscriptionData();
         // fetchPayment();
      } catch (error) {
         console.error('Error canceling subscription:', error);
      }
   };
   if (!subscriptionData) return <p>Loading...</p>;

   const renewalDate = new Date(subscriptionData.service_expiry_date).toLocaleDateString();



   const displayData = subscriptionData


   // Calculate days and hours remaining
   const calculateTimeRemaining = (expiryDate) => {
      const now = new Date();
      const expiry = new Date(expiryDate);
      const timeDiff = expiry - now;

      if (timeDiff <= 0) return "Expired";

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      return `${days} ${days > 1 ? "days" : "day"} and ${hours} hours`;
   };

   const timeRemaining = displayData && displayData
      ? calculateTimeRemaining(displayData.service_expiry_date)
      : "N/A";

   function changePlan() {
      navigate("/checkout");
   }


   return (
      <Fragment>
         <div className="row">
            <div className={`subscriptionPage col-flex ${isDarkMode === true ? 'dark-mode' : 'light-mode'}`}>
               <div className="subscription-header">
                  <h2>Manage Subscription</h2>
               </div>

               <div className="subscription-plan-card">
                  <div className="plan-triggers row-flex">
                     <h3>
                        {displayData?.subscription_plan === "PC_101" ? "Your Pro Plan" : "Your Basic Plan"}
                        <span className="subscription-status">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 22C13.3135 22.0016 14.6143 21.7437 15.8278 21.2411C17.0412 20.7384 18.1434 20.0009 19.071 19.071C20.0009 18.1434 20.7384 17.0412 21.2411 15.8278C21.7437 14.6143 22.0016 13.3135 22 12C22.0016 10.6866 21.7437 9.38572 21.2411 8.17225C20.7384 6.95878 20.0009 5.85659 19.071 4.92901C18.1434 3.99909 17.0412 3.26162 15.8278 2.75897C14.6143 2.25631 13.3135 1.99839 12 2.00001C10.6866 1.99839 9.38572 2.25631 8.17225 2.75897C6.95878 3.26162 5.85659 3.99909 4.92901 4.92901C3.99909 5.85659 3.26162 6.95878 2.75897 8.17225C2.25631 9.38572 1.99839 10.6866 2.00001 12C1.99839 13.3135 2.25631 14.6143 2.75897 15.8278C3.26162 17.0412 3.99909 18.1434 4.92901 19.071C5.85659 20.0009 6.95878 20.7384 8.17225 21.2411C9.38572 21.7437 10.6866 22.0016 12 22Z" stroke="#08AD7B" stroke-width="2" stroke-linejoin="round" />
                              <path d="M8 12L11 15L17 9" stroke="#08AD7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                           </svg>
                           active
                        </span>
                     </h3>
                     <div className="row-flex">
                        {subscriptionNextAction === "Pro User" && subscriptionDetails?.user_details[0].subscription_status === "expiring soon" ? (
                           <button
                              className="subscription-renew-button"
                              onClick={() => fetchPayment()}
                           >
                              Renew Subscription
                           </button>
                        ) : (<>
                           {subscriptionNextAction === "Pro User" ? (
                              <button
                                 className="subscription-cancel-button"
                                 onClick={() => setShowCancelPopup(true)}
                              >
                                 Cancel Subscription
                              </button>
                           ) : (
                              <><button
                                 className="subscription-cancel-button"
                                 onClick={handlePayment}
                              >
                                 Upgrade to Pro
                              </button></>
                           )}
                        </>)}



                     </div>
                  </div>
                  <div className="row-flex subscriptionInfo">
                     <div className="subscription-usage-details subCard">
                        <h4>
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 22C10.6167 22 9.31667 21.7374 8.1 21.212C6.88333 20.6867 5.825 19.97 4.925 19.062C4.025 18.154 3.31267 17.0917 2.788 15.875C2.26333 14.6584 2.00067 13.3667 2 12C2 9.38338 2.86667 7.13338 4.6 5.25005C6.33333 3.36672 8.46667 2.30005 11 2.05005V5.05005C9.28333 5.28338 7.854 6.05438 6.712 7.36305C5.57 8.67172 4.99933 10.2174 5 12C5 13.9334 5.68333 15.5834 7.05 16.95C8.41667 18.3167 10.0667 19 12 19C13.1 19 14.1293 18.7667 15.088 18.3C16.0467 17.8334 16.8507 17.2 17.5 16.4L20.1 17.9C19.2 19.15 18.0417 20.1461 16.625 20.8881C15.2083 21.6301 13.6667 22.0007 12 22ZM21.15 16.05L18.55 14.55C18.7 14.15 18.8123 13.7377 18.887 13.313C18.9617 12.8884 18.9993 12.4507 19 12C19 10.2167 18.429 8.67105 17.287 7.36305C16.145 6.05505 14.716 5.28405 13 5.05005V2.05005C15.5333 2.30005 17.6667 3.36672 19.4 5.25005C21.1333 7.13338 22 9.38338 22 12C22 12.7334 21.9333 13.4417 21.8 14.125C21.6667 14.8084 21.45 15.45 21.15 16.05Z" fill="white" />
                           </svg>

                           Usage Details
                        </h4>
                        <p>Time Remaining:</p>
                        <div className="row-flex infoText">
                           <span>Included:</span>
                           <span>{timeRemaining}</span>
                        </div>
                        <div className="row-flex infoText">
                           <span>Your current plan ends on:</span>
                           <span>
                              {new Date(displayData.service_expiry_date).toLocaleDateString("en-US", {
                                 month: "2-digit",
                                 day: "2-digit",
                                 year: "numeric",
                              })}
                           </span>
                        </div>
                     </div>

                     <div className="subscription-plan-features subCard">
                        <h4>
                           <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 1.5C14 1.36739 13.9473 1.24021 13.8536 1.14645C13.7598 1.05268 13.6326 1 13.5 1C13.3674 1 13.2402 1.05268 13.1464 1.14645C13.0527 1.24021 13 1.36739 13 1.5V2H12.5C12.3674 2 12.2402 2.05268 12.1464 2.14645C12.0527 2.24021 12 2.36739 12 2.5C12 2.63261 12.0527 2.75979 12.1464 2.85355C12.2402 2.94732 12.3674 3 12.5 3H13V3.5C13 3.63261 13.0527 3.75979 13.1464 3.85355C13.2402 3.94732 13.3674 4 13.5 4C13.6326 4 13.7598 3.94732 13.8536 3.85355C13.9473 3.75979 14 3.63261 14 3.5V3H14.5C14.6326 3 14.7598 2.94732 14.8536 2.85355C14.9473 2.75979 15 2.63261 15 2.5C15 2.36739 14.9473 2.24021 14.8536 2.14645C14.7598 2.05268 14.6326 2 14.5 2H14V1.5ZM4.412 1.926C4.51 1.453 4.924 1 5.5 1C6.076 1 6.49 1.453 6.589 1.926C6.71258 2.5388 7.01295 3.10199 7.453 3.546C7.89689 3.98642 8.46009 4.28714 9.073 4.411C9.546 4.509 9.999 4.923 9.999 5.501C9.999 6.077 9.546 6.491 9.073 6.589C8.46009 6.71286 7.89689 7.01358 7.453 7.454C7.01295 7.89801 6.71258 8.4612 6.589 9.074C6.491 9.546 6.077 10 5.499 10C4.923 10 4.509 9.547 4.411 9.074C4.28732 8.46073 3.98659 7.89716 3.546 7.453C3.10199 7.01294 2.5388 6.71258 1.926 6.589C1.454 6.491 1.001 6.078 1 5.502C0.999002 4.924 1.453 4.509 1.926 4.411C2.5388 4.28742 3.10199 3.98706 3.546 3.547C3.98642 3.10311 4.28714 2.53992 4.411 1.927M11 5.5C11 5.324 10.98 5.15733 10.94 5H11.5C12.163 5 12.7989 5.26339 13.2678 5.73223C13.7366 6.20107 14 6.83696 14 7.5V11.5C14 12.163 13.7366 12.7989 13.2678 13.2678C12.7989 13.7366 12.163 14 11.5 14H7.5C6.83696 14 6.20108 13.7366 5.73223 13.2678C5.26339 12.7989 5 12.163 5 11.5V10.94C5.32847 11.0205 5.67153 11.0205 6 10.94V11.5C6 11.8978 6.15804 12.2794 6.43934 12.5607C6.72065 12.842 7.10218 13 7.5 13H11.5C11.8978 13 12.2794 12.842 12.5607 12.5607C12.842 12.2794 13 11.8978 13 11.5V7.5C13 7.10218 12.842 6.72064 12.5607 6.43934C12.2794 6.15804 11.8978 6 11.5 6H10.94C10.98 5.84267 11 5.676 11 5.5ZM8 8.5C8 8.36739 8.05268 8.24021 8.14645 8.14645C8.24022 8.05268 8.36739 8 8.5 8H11C11.1326 8 11.2598 8.05268 11.3536 8.14645C11.4473 8.24021 11.5 8.36739 11.5 8.5C11.5 8.63261 11.4473 8.75979 11.3536 8.85355C11.2598 8.94732 11.1326 9 11 9H8.5C8.36739 9 8.24022 8.94732 8.14645 8.85355C8.05268 8.75979 8 8.63261 8 8.5ZM8.5 10C8.36739 10 8.24022 10.0527 8.14645 10.1464C8.05268 10.2402 8 10.3674 8 10.5C8 10.6326 8.05268 10.7598 8.14645 10.8536C8.24022 10.9473 8.36739 11 8.5 11H10C10.1326 11 10.2598 10.9473 10.3536 10.8536C10.4473 10.7598 10.5 10.6326 10.5 10.5C10.5 10.3674 10.4473 10.2402 10.3536 10.1464C10.2598 10.0527 10.1326 10 10 10H8.5ZM2.5 12C2.63261 12 2.75979 12.0527 2.85355 12.1464C2.94732 12.2402 3 12.3674 3 12.5V13H3.5C3.63261 13 3.75979 13.0527 3.85355 13.1464C3.94732 13.2402 4 13.3674 4 13.5C4 13.6326 3.94732 13.7598 3.85355 13.8536C3.75979 13.9473 3.63261 14 3.5 14H3V14.5C3 14.6326 2.94732 14.7598 2.85355 14.8536C2.75979 14.9473 2.63261 15 2.5 15C2.36739 15 2.24022 14.9473 2.14645 14.8536C2.05268 14.7598 2 14.6326 2 14.5V14H1.5C1.36739 14 1.24022 13.9473 1.14645 13.8536C1.05268 13.7598 1 13.6326 1 13.5C1 13.3674 1.05268 13.2402 1.14645 13.1464C1.24022 13.0527 1.36739 13 1.5 13H2V12.5C2 12.3674 2.05268 12.2402 2.14645 12.1464C2.24022 12.0527 2.36739 12 2.5 12Z" fill="white" />
                           </svg>

                           Pro Plan Features</h4>
                        <ul className="subscription-feature-list">
                           <li className="subscription-feature-item"><svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.5 4.21069L4.5 7.21069L10.5 1.21069" stroke="#00B928" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                           </svg>
                              Unlimited Job applications</li>
                           <li className="subscription-feature-item"><svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.5 4.21069L4.5 7.21069L10.5 1.21069" stroke="#00B928" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                           </svg>
                              Unlimited mock interviews</li>
                           <li className="subscription-feature-item"><svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.5 4.21069L4.5 7.21069L10.5 1.21069" stroke="#00B928" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                           </svg>
                              5 Interview practice tests</li>
                           <li className="subscription-feature-item"><svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.5 4.21069L4.5 7.21069L10.5 1.21069" stroke="#00B928" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                           </svg>
                              Unlock Fulltime jobs</li>
                        </ul>
                     </div>

                     <div className="subscription-billing-payment subCard">
                        <h4><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path opacity="0.5" d="M5.75 10C5.75 9.80109 5.82902 9.61032 5.96967 9.46967C6.11032 9.32902 6.30109 9.25 6.5 9.25H13.5C13.6989 9.25 13.8897 9.32902 14.0303 9.46967C14.171 9.61032 14.25 9.80109 14.25 10C14.25 10.1989 14.171 10.3897 14.0303 10.5303C13.8897 10.671 13.6989 10.75 13.5 10.75H6.5C6.30109 10.75 6.11032 10.671 5.96967 10.5303C5.82902 10.3897 5.75 10.1989 5.75 10ZM12.164 13.819C12.049 14.044 12.014 14.317 12.004 14.75H20.996C20.986 14.317 20.951 14.044 20.836 13.819C20.6922 13.537 20.463 13.3078 20.181 13.164C19.861 13 19.441 13 18.6 13H14.4C13.56 13 13.14 13 12.819 13.164C12.537 13.3078 12.3078 13.537 12.164 13.819ZM21 16.25H12V17.6C12 18.44 12 18.86 12.164 19.181C12.3076 19.4633 12.5369 19.693 12.819 19.837C13.139 20 13.559 20 14.4 20H18.6C19.44 20 19.86 20 20.181 19.837C20.4635 19.6931 20.6931 19.4635 20.837 19.181C21 18.861 21 18.441 21 17.6V16.25ZM6.5 12.25C6.30109 12.25 6.11032 12.329 5.96967 12.4697C5.82902 12.6103 5.75 12.8011 5.75 13C5.75 13.1989 5.82902 13.3897 5.96967 13.5303C6.11032 13.671 6.30109 13.75 6.5 13.75H10C10.1989 13.75 10.3897 13.671 10.5303 13.5303C10.671 13.3897 10.75 13.1989 10.75 13C10.75 12.8011 10.671 12.6103 10.5303 12.4697C10.3897 12.329 10.1989 12.25 10 12.25H6.5Z" fill="white" />
                           <path d="M12.83 3.25H7.17C6.635 3.25 6.19 3.25 5.825 3.28C5.445 3.31 5.089 3.378 4.752 3.55C4.23445 3.81367 3.81367 4.23445 3.55 4.752C3.378 5.089 3.31 5.445 3.28 5.825C3.25 6.19 3.25 6.635 3.25 7.17V16.83C3.25 17.365 3.25 17.81 3.28 18.175C3.31 18.555 3.378 18.911 3.55 19.248C3.81367 19.7656 4.23445 20.1863 4.752 20.45C4.93 20.541 5.151 20.577 5.282 20.596C5.449 20.621 5.65 20.64 5.866 20.656C6.3 20.688 6.841 20.709 7.393 20.723C8.498 20.75 9.688 20.75 10.248 20.75H10.25C10.4489 20.75 10.6397 20.671 10.7803 20.5303C10.921 20.3897 11 20.1989 11 20C11 19.8011 10.921 19.6103 10.7803 19.4697C10.6397 19.329 10.4489 19.25 10.25 19.25C9.69 19.25 8.515 19.25 7.43 19.223C6.94492 19.213 6.46013 19.192 5.976 19.16C5.77533 19.1447 5.61667 19.1287 5.5 19.112L5.394 19.094C5.17587 18.973 4.99895 18.7894 4.886 18.567C4.84 18.477 4.798 18.34 4.775 18.052C4.751 17.757 4.75 17.372 4.75 16.8V7.2C4.75 6.628 4.75 6.243 4.775 5.947C4.798 5.66 4.84 5.523 4.886 5.433C5.00591 5.19741 5.19741 5.00591 5.433 4.886C5.523 4.84 5.66 4.798 5.947 4.775C6.243 4.751 6.627 4.75 7.2 4.75H12.8C13.372 4.75 13.757 4.75 14.052 4.775C14.34 4.798 14.477 4.84 14.568 4.886C14.803 5.006 14.994 5.197 15.114 5.433C15.16 5.523 15.202 5.66 15.225 5.947C15.249 6.243 15.25 6.627 15.25 7.2V10.25C15.25 10.4489 15.329 10.6397 15.4697 10.7803C15.6103 10.921 15.8011 11 16 11C16.1989 11 16.3897 10.921 16.5303 10.7803C16.671 10.6397 16.75 10.4489 16.75 10.25V7.17C16.75 6.635 16.75 6.19 16.72 5.825C16.69 5.445 16.622 5.089 16.45 4.752C16.1869 4.23475 15.7668 3.81401 15.25 3.55C14.912 3.378 14.556 3.31 14.176 3.28C13.811 3.25 13.366 3.25 12.831 3.25" fill="white" />
                           <path d="M18.629 12.25H14.37C13.975 12.25 13.634 12.25 13.353 12.273C13.0495 12.2885 12.7521 12.3639 12.478 12.495C12.0543 12.7108 11.7098 13.0553 11.494 13.479C11.3629 13.7531 11.2875 14.0505 11.272 14.354C11.249 14.634 11.249 14.976 11.249 15.371V17.629C11.249 18.024 11.249 18.365 11.272 18.646C11.296 18.943 11.35 19.238 11.494 19.521C11.71 19.945 12.054 20.289 12.478 20.505C12.761 20.649 13.056 20.703 13.353 20.727C13.633 20.75 13.975 20.75 14.37 20.75H18.628C19.023 20.75 19.364 20.75 19.645 20.727C19.9485 20.7115 20.2459 20.6361 20.52 20.505C20.9436 20.2895 21.288 19.9454 21.504 19.522C21.648 19.238 21.702 18.942 21.726 18.646C21.749 18.366 21.749 18.024 21.749 17.629V15.37C21.749 14.975 21.749 14.634 21.726 14.353C21.7105 14.0495 21.6351 13.7521 21.504 13.478C21.2885 13.0544 20.9444 12.71 20.521 12.494C20.2466 12.3628 19.9488 12.2873 19.645 12.272C19.365 12.249 19.023 12.249 18.628 12.249M13.158 13.831C13.196 13.811 13.271 13.784 13.475 13.767C13.687 13.75 13.967 13.749 14.399 13.749H18.599C19.031 13.749 19.311 13.749 19.523 13.767C19.727 13.784 19.803 13.812 19.839 13.831C19.9801 13.9027 20.0949 14.0171 20.167 14.158C20.187 14.196 20.214 14.271 20.231 14.475C20.248 14.687 20.249 14.967 20.249 15.399V17.599C20.249 18.031 20.249 18.311 20.231 18.523C20.214 18.727 20.186 18.803 20.167 18.839C20.0951 18.9802 19.9802 19.0951 19.839 19.167C19.802 19.187 19.727 19.214 19.523 19.231C19.311 19.248 19.031 19.249 18.599 19.249H14.399C13.967 19.249 13.687 19.249 13.475 19.231C13.271 19.214 13.195 19.186 13.158 19.167C13.0171 19.0949 12.9027 18.9801 12.831 18.839C12.811 18.802 12.784 18.727 12.767 18.523C12.7501 18.2153 12.744 17.9071 12.749 17.599V15.399C12.749 14.967 12.749 14.687 12.767 14.475C12.784 14.271 12.812 14.195 12.831 14.158C12.9028 14.0173 13.0173 13.9028 13.158 13.831ZM5.75 7C5.75 6.80109 5.82902 6.61032 5.96967 6.46967C6.11032 6.32902 6.30109 6.25 6.5 6.25H10.5C10.6989 6.25 10.8897 6.32902 11.0303 6.46967C11.171 6.61032 11.25 6.80109 11.25 7C11.25 7.19891 11.171 7.38968 11.0303 7.53033C10.8897 7.67098 10.6989 7.75 10.5 7.75H6.5C6.30109 7.75 6.11032 7.67098 5.96967 7.53033C5.82902 7.38968 5.75 7.19891 5.75 7ZM6.5 16.25C6.30109 16.25 6.11032 16.329 5.96967 16.4697C5.82902 16.6103 5.75 16.8011 5.75 17C5.75 17.1989 5.82902 17.3897 5.96967 17.5303C6.11032 17.671 6.30109 17.75 6.5 17.75H8.5C8.69891 17.75 8.88968 17.671 9.03033 17.5303C9.17098 17.3897 9.25 17.1989 9.25 17C9.25 16.8011 9.17098 16.6103 9.03033 16.4697C8.88968 16.329 8.69891 16.25 8.5 16.25H6.5Z" fill="white" />
                        </svg>
                           Billing & Payment
                        </h4>
                        <div className="billingData col-flex">
                           <div className="row-flex infoText">
                              <span>Price :</span>
                              <span>$9.99/Month</span>
                           </div>
                           <div className="row-flex infoText">
                              <span>Billing Period :</span>
                              <span>Monthly</span>
                           </div>
                           {/* <div className="row-flex infoText">
                              <span>Renewal Date :</span>
                              <span>{new Date(displayData.service_expiry_date).toLocaleDateString()}</span>
                           </div> */}
                        </div>
                     </div>
                  </div>



               </div>

               {showCancelPopup && (
                  <div className="subscription-cancel-popup">
                     <div className="header-wrapper row-flex">
                        <h4>We're sorry to see you go!</h4>
                        <button
                           className="subscription-close-button"
                           onClick={() => setShowCancelPopup(false)}
                        >
                           +
                        </button>
                     </div>
                     <div className="inner">
                        <p>Billing on Your Card will be cancelled and subscription will remains active until end of the Period.</p>
                        {/* <p>Your plan will be active until the end of your subscription period.</p> */}
                     </div>
                     <button
                        className="subscription-confirm-button"
                        onClick={handleCancelSubscription}
                     >
                        Confirm Cancellation
                     </button>

                  </div>
               )}
               {subscriptionStatus && (
                  <div className="subscription-cancel-popup">
                     <div className="header-wrapper row-flex">
                        <h4>Your Subscription status</h4>
                        <button
                           className="subscription-close-button"
                           onClick={() => setSubscriptionStatus(false)}
                        >
                           +
                        </button>
                     </div>
                     <div className="inner">
                        <p>Billing on Your Card will be cancelled successfully and subscription will remains active until end of the Period.</p>
                     </div>


                  </div>
               )}
            </div>
         </div>
         {showLoader && (<div className="checkout-loader">
            <img src={LoaderIcon} alt="loader" />
         </div>)}
         {loaderAnimation && (
            <div className="LoaderAnimation">
               <div className="gptAnimate"></div>
               <img className="gptIcon" src={GptIcon} alt="gptIcon" />
            </div>)}
      </Fragment>
   );
};

export default DashboardDark;
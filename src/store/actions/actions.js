// actions.js
export const setApiToken = (data) => ({
  type: "SET_API_TOKEN",
  payload: data,
});
export const setResetEmail = (data) => ({
  type: "SET_RESET_EMAIL",
  payload: data,
});
export const setApiTokenReady = (data) => ({
  type: "SET_API_TOKEN_READY",
  payload: data,
});
export const setProfileData = (data) => ({
    type: "SET_PROFILE_DATA",
    payload: data,
  });
export const setProductCode = (data) => ({
    type: "SET_PRODUCT_CODE",
    payload: data,
  });
  
  export const setTechSkills = (skills) => ({
    type: "SET_TECH_SKILLS",
    payload: skills,
  });
  export const setFileResume = (data) => ({
    type: "SET_FILE_RESUME",
    payload: data,
  });
  export const setActivities = (data) => ({
    type: "SET_ACTIVITIES",
    payload: data,
  });
  export const setJobsApplied = (data) => ({
    type: "SET_JOBS_APPLIED",
    payload: data,
  });
  export const setJobsList = (data) => ({
    type: "SET_JOBS_LIST",
    payload: data,
  });
  export const setIsDarkMode = (data) => ({
    type: "SET_DISPLAY_MODE",
    payload: data,
  });
  export const setQuestionAnswer = (data) => ({
    type: "SET_EXAM_QUESTION_ANSWER",
    payload: data,
  });
  export const setDocId = (data) => ({
    type: "SET_DOC_ID",
    payload: data,
  });
  export const setAnswers = (data) => ({
    type: "SET_ANSWERS",
    payload: data,
  });
  export const setSubscriptionNextAction = (data) => ({
    type: "SET_Subscription_Actions",
    payload: data,
  });
  export const SetFeaturesToBlock = (data) => ({
    type: "SET_FEATURES_TO_BLOCK",
    payload: data,
  });
  export const setShowPro = (data) => ({
    type: "SET_SHOW_PRO",
    payload: data,
  });
  export const setMembershipData = (data) => ({
    type: "SET_MEMBERSHIP_DATA",
    payload: data,
  });
  export const setdetailedJob = (data)=>({
    type: "ACTIVE_JOB_ID",
    payload: data,
  });
  export const setControlFeatures = (data)=>({
    type: "CONTROL_FEATURES",
    payload: data,
  });
  export const setSignUpActive = (data)=>({
    type: "SIGNUP_ACTIVE",
    payload: data,
  });
  export const setScenarioBased = (data)=>({
    type: "SET_SCENARIO_QUESTIONS",
    payload: data,
  });
  export const setInterviewLevel = (data)=>({
    type: "SET_INTERVIEW_LEVEL",
    payload: data,
  });
  export const setIndustryInterview = (data)=>({
    type: "SET_INDUSTRY_INTERVIEW",
    payload: data,
  });
  export const setLinkInterviewQuestions = (data)=>({
    type: "SET_LINK_INTERVIEW_QUESTION",
    payload: data,
  });
  export const setHomeLink = (data)=>({
    type: "SET_HOME_LINK",
    payload: data,
  });
  export const setJobResumeUpload = (data)=>({
    type: "SET_JOB_RESUME_UPLOAD",
    payload: data,
  });
  export const setProfileUpdateStatus = (data)=>({
    type: "SET_PROFILE_UPDATE_STATUS",
    payload: data,
  });
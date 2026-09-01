// profileReducer.js
const initialState = {
  resetEmail: '',
  apiToken: '',
  apiTokenReady: false,
  profileData: {},
  techSkills: [],
  productCode: "",
  fileResume: "",
  activities: [],
  jobsApplied: [],
  jobsList: [],
  questionAnswer: JSON.parse(localStorage.getItem("questionAnswer")) || "",
  docId: localStorage.getItem("docId") || "",
  answers: JSON.parse(localStorage.getItem("answers")) || [],
  subscriptionNextAction: "",
  featuresToBlock: [],
  showPro: false,
  membershipData: [],
  isDarkMode: false,
  detailedJob: '',
  controlFeatures:false,
  signUpActive: false,
  scenarioBased: false,
  interviewLevel :"",
  industryInterview :"",
  linkInterviewQuestions:"",
  homeLink:"",
  jobResumeUpload:"false",
  profileUpdateStatus:false,
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_API_TOKEN':
      return {
        ...state,
        apiToken: action.payload
      };
    case 'SET_RESET_EMAIL':
      return {
        ...state,
        resetEmail: action.payload
      };
    case 'SET_API_TOKEN_READY':
      return {
        ...state,
        apiTokenReady: action.payload
      };
    case 'SET_PROFILE_DATA':
      return {
        ...state,
        profileData: action.payload
      };
    case 'SET_TECH_SKILLS':
      return {
        ...state,
        techSkills: action.payload
      };
    case 'SET_PRODUCT_CODE':
      return {
        ...state,
        productCode: action.payload
      };
    case 'SET_FILE_RESUME':
      return {
        ...state,
        fileResume: action.payload
      };
    case 'SET_ACTIVITIES':
      return {
        ...state,
        activities: action.payload
      };
    case 'SET_JOBS_APPLIED':
      return {
        ...state,
        jobsApplied: action.payload
      };
    case 'SET_JOBS_LIST':
      return {
        ...state,
        jobsList: action.payload
      };
    case 'SET_DISPLAY_MODE':
      return {
        ...state,
        isDarkMode: action.payload
      };
    case 'SET_EXAM_QUESTION_ANSWER':
      return {
        ...state,
        questionAnswer: action.payload
      };
    case 'SET_DOC_ID':
      return {
        ...state,
        docId: action.payload
      };
    case 'SET_ANSWERS':
      return {
        ...state,
        answers: action.payload
      };
    case 'SET_Subscription_Actions':
      return {
        ...state,
        subscriptionNextAction: action.payload
      };
    case 'SET_FEATURES_TO_BLOCK':
      return {
        ...state,
        featuresToBlock: action.payload
      };
    case 'SET_SHOW_PRO':
      return {
        ...state,
        showPro: action.payload
      };
    case 'SET_MEMBERSHIP_DATA':
      return {
        ...state,
        membershipData: action.payload
      };
    case 'ACTIVE_JOB_ID':
      return {
        ...state,
        detailedJob: action.payload
      };
    case 'CONTROL_FEATURES':
      return {
        ...state,
        controlFeatures: action.payload
      };
    case 'SIGNUP_ACTIVE':
      return {
        ...state,
        signUpActive: action.payload
      };
    case 'SET_SCENARIO_QUESTIONS':
      return {
        ...state,
        scenarioBased: action.payload
      };
    case 'SET_INTERVIEW_LEVEL':
      return {
        ...state,
        interviewLevel: action.payload
      };
    case 'SET_INDUSTRY_INTERVIEW':
      return {
        ...state,
        industryInterview: action.payload
      };
    case 'SET_LINK_INTERVIEW_QUESTION':
      return {
        ...state,
        linkInterviewQuestions: action.payload
      };
    case 'SET_HOME_LINK':
      return {
        ...state,
        homeLink: action.payload
      };
    case 'SET_JOB_RESUME_UPLOAD':
      return {
        ...state,
        jobResumeUpload: action.payload
      };
    case 'SET_PROFILE_UPDATE_STATUS':
      return {
        ...state,
        profileUpdateStatus: action.payload
      };
    default:
      return state;
  }
};

export default profileReducer; // Ensure this is default export

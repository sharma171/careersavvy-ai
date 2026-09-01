import axios from 'axios';
import {
    loginConfirmedAction,
    Logout,
} from '../store/actions/AuthActions';

export async function signUp(email, password, firstName, lastName, username, country,phone_number) {
    const formData = {
        action: 'sign-up',
        first_name: email,
        last_name: password,
        username: lastName,
        email: username,
        password: country,
        country: firstName,
        phone_number:phone_number,
        app_name: "careersavvy"
    };

    try {
        const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/user_authentication_api_v2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return response; // Return the fetch response
    } catch (error) {
        console.error('Error in sign-up:', error.message);
        throw error;
    }
}
export function loginToAPI(loginEmail, loginPassword) {
    // Create the request payload
    const formData = {
        action: 'sign-in',
        username: loginEmail,
        password: loginPassword,
        app_name: "careersavvy"
    };

    console.log('Login formData:', formData);  // Log the request payload for debugging

    return axios.post(
        'https://us-east1-foursssolutions.cloudfunctions.net/user_authentication_api_v2',
        formData,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    .catch(error => {
        console.error('Error in loginToAPI:', error.response ? error.response.data : error.message);
        throw error;  // Re-throw error to be caught by the calling function
    });
}

export function login(email, password) {
    const postData = {
        email,
        password,
        returnSecureToken: true,
    };
    return axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
        postData,
    );
}

export function formatError(error) {
    let message = "An error occurred";  // Default error message
    
    if (error && error.message) {
        message = error.message;
    }
    
    return message;
}



export function saveTokenInLocalStorage(tokenDetails) {
    const tokenData = {
        token: tokenDetails.token,
        email: tokenDetails.email,
        storagePath: tokenDetails.storage_path,
        globalSessionId: tokenDetails.global_session_id,
        accessToken: tokenDetails.access_token,
        subscription: tokenDetails.subscription_type,
        expireDate: new Date(new Date().getTime() + 9000 * 1000), // Assuming token expiration is 1 hour
    };
    localStorage.setItem('userDetails', JSON.stringify(tokenData));
}

export function runLogoutTimer(dispatch, timer, navigate) {
    setTimeout(() => {
        //dispatch(Logout(history));
        dispatch(Logout(navigate));
    }, timer);
}

// AuthService.js
export function checkAutoLogin(dispatch, navigate, locationPath) {
    const tokenDetailsString = localStorage.getItem('userDetails');

    let tokenDetails = '';

    // Check if the locationPath is '/page-forgot-password' and if no token is found
    if (!tokenDetailsString && locationPath === '/robots.txt') {
        return; // Skip logout logic for the '/activate' route
    }
    // Check if the locationPath is '/page-forgot-password' and if no token is found
    if (!tokenDetailsString && locationPath === '/sitemap.xml') {
        return; // Skip logout logic for the '/activate' route
    }
    // Check if the locationPath is '/page-forgot-password' and if no token is found
    if (!tokenDetailsString && locationPath === '/') {
        return; // Skip logout logic for the '/activate' route
    }
    // Check if the locationPath is '/page-forgot-password' and if no token is found
    if (!tokenDetailsString && locationPath === '/blog') {
        return; // Skip logout logic for the '/activate' route
    }
    // Check if the locationPath is '/page-forgot-password' and if no token is found
    if (!tokenDetailsString && locationPath === '/blogDetailed') {
        return; // Skip logout logic for the '/activate' route
    }
    // Check if the locationPath is '/page-forgot-password' and if no token is found
    if (!tokenDetailsString && locationPath === '/job/detailed') {
        return; // Skip logout logic for the '/activate' route
    }
    // Check if the locationPath is '/page-forgot-password' and if no token is found
    if (!tokenDetailsString && locationPath === '/resetpassword') {
        return; // Skip logout logic for the '/activate' route
    }
    // Check if the locationPath is '/page-forgot-password' and if no token is found
    if (!tokenDetailsString && locationPath === '/page-forgot-password') {
        return; // Skip logout logic for the '/activate' route
    }
    // Check if the locationPath is '/activate' and if no token is found
    if (!tokenDetailsString && locationPath === '/activate') {
        return; // Skip logout logic for the '/activate' route
    }
    // Check if the locationPath is '/activate' and if no token is found
    if (!tokenDetailsString && locationPath === '/interview') {
        return; // Skip logout logic for the '/activate' route
    }
    // Check if the locationPath is '/activate' and if no token is found
    if (!tokenDetailsString && locationPath === '/interview-Candidate-exam') {
        return; // Skip logout logic for the '/activate' route
    }
    // Check if the locationPath is '/activate' and if no token is found
    if (!tokenDetailsString && locationPath === '/interview-Video-exam') {
        return; // Skip logout logic for the '/activate' route
    }
    // Check if the locationPath is '/activate' and if no token is found
    if (!tokenDetailsString && locationPath === '/reactivate-link') {
        return; // Skip logout logic for the '/activate' route
    }
    if(tokenDetailsString && locationPath === '/login') {
        navigate('/dashboard')
    }
    // Check if the locationPath is '/activate' and if no token is found
    if (!tokenDetailsString && locationPath === '/page-register') {
        return; // Skip logout logic for the '/activate' route
    }
    else if (locationPath == "/videoInterview") {
        return;
    }
    else if (locationPath == "/interview-exam") {
        return;
    }
    else if (tokenDetailsString && locationPath === '/cancel') {
        localStorage.removeItem('userDetails');
        // Use window.location to refresh the page with the current URL
        const currentUrl = window.location.href; // Get the current URL
        navigate('/login'); // Navigate to '/activate'
        window.location.href = currentUrl; // Refresh the page with the current URL
        return; // Skip logout logic for the '/activate' route
    }
    else if (tokenDetailsString && locationPath === '/activate') {
        localStorage.removeItem('userDetails');
        // Use window.location to refresh the page with the current URL
        const currentUrl = window.location.href; // Get the current URL
        navigate('/activate'); // Navigate to '/activate'
        window.location.href = currentUrl; // Refresh the page with the current URL
        return; // Skip logout logic for the '/activate' route
    }
    // If there's no token and it's not '/activate', log out
    else if (!tokenDetailsString) {
        dispatch(Logout(navigate));
        return;
    }

    // Parse token details
    tokenDetails = JSON.parse(tokenDetailsString);
    let expireDate = new Date(tokenDetails.expireDate);
    let todaysDate = new Date();

    // If the token is expired, log out
    if (todaysDate > expireDate) {
        dispatch(Logout(navigate));
        return;
    }

    // Confirm login and set logout timer
    dispatch(loginConfirmedAction(tokenDetails));

    const timer = expireDate.getTime() - todaysDate.getTime();
    runLogoutTimer(dispatch, timer, navigate);
}

export function isLogin() {
    const tokenDetailsString = localStorage.getItem('userDetails');

    if (tokenDetailsString) {
        return true;
    }else{
        return false;
    }
}
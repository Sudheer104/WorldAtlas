import axios from 'axios';

class AuthService {

    //if we are using vite (process.env) in this place use (import.meta.env)

    url = import.meta.env.VITE_API_URL;
    configMultipartData = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };

    configJsonData = {
        headers: {
            'Content-Type': 'application/json'
        }
    };


    // constructor() {
    //     this.axiosInstance = axios.create();  //Here axios instance are created
    //     this.axiosInstance.interceptors.response.use(
    //         response => response,
    //         async error => {
    //             const originalRequest = error.config;
    //             console.log(originalRequest)
    //             if (error.response.status === 401 && !originalRequest._retry)
    //                 originalRequest._retry = true;
    //             try {
    //                 //if refresh token not expired
    //                 await this.refreshToken();
    //                 const newAccessToken = localStorage.getItem('accessToken');
    //                 originalRequest.headers['Authorization'] ='Bearer '+newAccessToken;
    //                 return this.axiosInstance(originalRequest);
    //             } catch (error) {
    //                 // If refresh token also expired
    //                 console.log("Refresh token expired")
    //             }
    //         }
    //     );
    // }

    // async refreshToken() {
    //     const storeRefreshToken = localStorage.getItem("refreshToken");
    //     const authorizationHeader = {
    //         headers: {
    //             'Authorization': 'Bearer ' +storeRefreshToken
    //         }
    //     }
    //     const response = await axios.get(this.url + '/refresh-token', authorizationHeader);
    //     const { accessToken, refreshToken } = response.data;
    //     localStorage.setItem("accessToken", accessToken);
    //     localStorage.setItem("refreshToken", refreshToken);
    // }


    //OBJECT OF formDAta Send to Backend via Axios: 



    constructor() {

        this.axiosInstance = axios.create();

        this.axiosInstance.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;

                // Guard: If already retried or not a 401, reject
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        await this.refreshToken(); // Try to refresh token
                        const newAccessToken = localStorage.getItem("accessToken");
                        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

                        return this.axiosInstance(originalRequest); // Retry original request once
                    } catch (error) {
                        // console.error("Token refresh failed. Logging out.");

                        // Clean up tokens and redirect to login
                        this.logoutUser();
                        window.location.href = "/login";
                        return Promise.reject(error); // VERY IMPORTANT
                    }
                }

                // Any other case (retry already tried or non-401) — reject
                // return Promise.reject(error);
            }
        );
    }


    async refreshToken() {
        const refreshToken = localStorage.getItem("refreshToken");

        // if (!refreshToken) {
        //     throw new Error("No refresh token found");
        // }

        // try {
        const response = await axios.get(this.url + "/refresh-token", {
            headers: {
                Authorization: "Bearer " + refreshToken,
            },
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // if (!accessToken || !newRefreshToken) {
        //     throw new Error("Invalid response from refresh endpoint");
        // }

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        // } catch (err) {
        //     throw new Error("Refresh token invalid or expired");
        // }
    }






    register(formData) {
        return axios.post(this.url + '/register', formData, this.configMultipartData);
    }

    login(formData) {
        return axios.post(this.url + '/login', formData, this.configJsonData);
    }

    forgetPassword(formData) {
        return axios.post(this.url + '/forget-password', formData, this.configJsonData);
    }

    //Method for login user inside application
    loginUser(data) {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("tokenType", data.tokenType);
        localStorage.setItem("user", JSON.stringify(data.user));

    }

    //Method for logout user from application
    logoutUser() {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenType");
        localStorage.removeItem("user");
    }

    //Check for user is logged in or not
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    //get User data for update our profile
    getUserData() {
        return JSON.parse(localStorage.getItem('user'))
    }

    updateUserData(formData) {
        // console.log(formData);

        const authorizationHeader = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                // 'Content-Type': 'multipart/form-data'
            }
        }
        // console.log("Sending token:", localStorage.getItem('accessToken'));

        return this.axiosInstance.post(this.url + '/update-profile', formData, authorizationHeader);
    }

    setUserData(userData) {
        localStorage.setItem("user", JSON.stringify(userData))
    }


}

export default new AuthService();

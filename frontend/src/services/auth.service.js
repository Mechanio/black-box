import axios from "axios";

const signup = (firstname, lastname, nickname, email, password) => {
  return axios.post("http://localhost:5000/api/auth/registration",
      {firstname, lastname, nickname, email, password})
};

const login = (email, password) => {
    return axios.post("http://localhost:5000/api/auth/login",
        { email, password })
};

const logout = () => {
    return axios
        .post("http://localhost:5000/api/auth/logout-access", {data: "data"})
        .then(() => {
            localStorage.removeItem("user")
            window.location.reload()
        })
}

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
    // localStorage.removeItem("user");
}

const getAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.access_token) {
        return null
    }
    return user.access_token
};

const authGuard = (pathname, navigate) => {
    const accessToken = getAccessToken()

    // if (!accessToken ) {
    //     navigate('/auth/login')
    // }
}

const authInterceptor = () => {
     axios.interceptors.request.use(
        (config) => {
            const accessToken = getAccessToken()

            if ((accessToken) && config.headers) {
                config.headers.Authorization = `Bearer ${accessToken}`
                config.headers["Access-Control-Allow-Origin"] = '*'
            }
            return config
        })

     axios.interceptors.response.use((response) => response,
         (error) => {
        //catches if the session ended!
         if (error.response && error.response.status === 401) {
             if (window.location !== 'http://localhost:3000/auth/login') {
                 localStorage.removeItem("user")
                 // window.location = '/auth/login'
             }
             return error
        }
        return error
    });
}

const authService = {
    signup,
    login,
    logout,
    getCurrentUser,
    getAccessToken,
    authGuard,
    authInterceptor
}

export default authService
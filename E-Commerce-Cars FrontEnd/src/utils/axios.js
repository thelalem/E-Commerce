import axios from "axios";

const axiosClient = axios.create({
    baseURL: '/api',
    withCredentials: true, // Include cookies in requests
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Request with token:", config.headers.Authorization);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axiosClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.warn("Token expired, attempting to refresh...");
            try {
                const refreshRes = await axiosClient.post('/auth/refresh-token');
                const newToken = refreshRes.data.token;
                localStorage.setItem('accessToken', newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                console.log("New token set:", newToken);
                return axiosClient(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
export default axiosClient;
import axios from "axios";

const axiosClient = axios.create({
    baseURL: "/api",
    withCredentials: true, // Include cookies (for refresh token)
});

// Add Authorization header if accessToken exists
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
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

// Handle token expiration
axiosClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // Prevent retry loop and skip if it's already retried or it's refresh-token call itself
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh-token")
        ) {
            originalRequest._retry = true;
            console.warn("Token expired, attempting to refresh...");

            try {
                const refreshRes = await axiosClient.post("/auth/refresh-token");
                const newToken = refreshRes.data.token;

                localStorage.setItem("accessToken", newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                console.log("New token set:", newToken);

                return axiosClient(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                localStorage.removeItem("accessToken");

                // Redirect to login page
                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;

import axios from "axios";

const axiosClient = axios.create({
    baseURL: '/api',
    withCredentials: true, // Include cookies in requests
});

export default axiosClient;
import axiosClient from "./axios";

export const getMessages = async (chatId) => {
    return await axiosClient.get('/messages');
}

export const sendMessage = async (message) => {
    return await axiosClient.post("/messages", message);
}

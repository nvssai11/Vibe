import axiosClient from "./axiosClient";

const messageApi = {
  sendMessage: (data) => {
    const url = "/messages";
    return axiosClient.post(url, data);
  },
  getMessages: (userId) => {
    const url = `/messages/${userId}`;
    return axiosClient.get(url);
  },
  getConversations: () => {
    const url = "/messages/conversations";
    return axiosClient.get(url);
  },
  markMessageAsRead: (messageId) => {
    const url = `/messages/${messageId}/read`;
    return axiosClient.patch(url);
  }
};

export default messageApi;
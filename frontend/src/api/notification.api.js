import axiosClient from "./axiosClient";

const notificationApi = {
  getNotifications: async () => {
    try {
      const { data } = await axiosClient.get("/notifications");
      return data.notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },
  markAsRead: async (notificationId) => {
    try {
      const { data } = await axiosClient.patch(`/notifications/${notificationId}/read`);
      return data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },
  markAllAsRead: async () => {
    try {
      const { data } = await axiosClient.patch("/notifications/mark-all-read");
      return data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }
};

export default notificationApi;
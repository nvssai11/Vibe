// frontend/src/api/user.api.js
import axiosClient from "./axiosClient";

// Fetch nearby users based on current coordinates
// export const getNearbyUsers = async ({ lat, lng, radius }) => {
//   const res = await axiosClient.get(`/users/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
//   return res.data.users;
// };

export const getNearbyUsers = async ({ lat, lng, radius }) => {
  console.log("[getNearbyUsers API] Request params:", { lat, lng, radius });
  const { data } = await axiosClient.get("/users/nearby", {
    params: { lat, lng, radius }
  });
  console.log("[getNearbyUsers API] Response:", data);
  
  // Filter out current user and map to include apartmentName
  const usersWithApartmentNames = data.users
    .filter(user => user._id !== localStorage.getItem('userId'))
    .map(user => ({
      ...user,
      apartmentName: user.apartment?.name
    }));
  
  return usersWithApartmentNames;
};


// Update current user profile
export const updateProfile = async (data) => {
  console.log('Updating profile with data:', data);
  const res = await axiosClient.put("/users/profile", data);
console.log('Update profile response:', res.data);
  return res.data;
};

export const getProfile = async () => {
  const res = await axiosClient.get("/users/profile");
  return res.data;
};
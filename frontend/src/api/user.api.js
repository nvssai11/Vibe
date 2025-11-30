// frontend/src/api/user.api.js
import axiosClient from "./axiosClient";

// Fetch nearby users based on current coordinates
// export const getNearbyUsers = async ({ lat, lng, radius }) => {
//   const res = await axiosClient.get(`/users/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
//   return res.data.users;
// };

export const getNearbyUsers = async ({ lat, lng }) => {
  const { data } = await axiosClient.get("/users/nearby", {
    params: { lat, lng, radius: 2000 } // backend expects lat/lng
  });
  
  // Map users to include apartmentName if apartment exists
  const usersWithApartmentNames = data.users.map(user => ({
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
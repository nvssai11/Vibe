// frontend/src/api/resource.api.js
import axiosClient from "./axiosClient";

export const addResource = async (resourceData) => {
  try {
    const res = await axiosClient.post(`/resources`, resourceData);
    return res.data;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

export const getResources = async () => {
  try {
    const res = await axiosClient.get(`/resources`);
    return res.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

export const requestResource = async (id) => {
  try {
    const res = await axiosClient.patch(`/resources/${id}/request`);
    return res.data;
  } catch (error) {
    console.error('Error requesting resource:', error);
    throw error;
  }
};

export const approveResource = async (id) => {
  try {
    const res = await axiosClient.patch(`/resources/${id}/approve`);
    return res.data;
  } catch (error) {
    console.error('Error approving resource:', error);
    throw error;
  }
};

export const returnResource = async (id) => {
  try {
    const res = await axiosClient.patch(`/resources/${id}/return`);
    return res.data;
  } catch (error) {
    console.error('Error returning resource:', error);
    throw error;
  }
};
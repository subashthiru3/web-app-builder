import axios from "axios";

const apiUrl = process.env.NEXT_API_BASE_URL || "http://localhost:4000/api/";

export const saveData = async (data: any) => {
  let payload = {
    projectName: "sample-project",
    pageJson: data,
  };
  try {
    const response = await axios.post(`${apiUrl}pages/save`, payload);
    return response;
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
  }
};

export const loadData = async (projectName: string) => {
  try {
    const response = await axios.get(`${apiUrl}pages/${projectName}`);
    return response;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};

export const deployApp = async (projectName: string) => {
  let payload = {
    projectName: projectName,
  };
  try {
    const response = await axios.post(`${apiUrl}deploy`, payload);
    return response;
  } catch (error) {
    console.error("Error deploying app:", error);
    throw error;
  }
};

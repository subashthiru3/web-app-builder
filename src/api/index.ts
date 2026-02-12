import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_PROD_API_BASE_URL;

export const saveData = async (projectName: string, data: any) => {
  const payload = {
    projectName: projectName,
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

export const deployApp = async (projectName: string, pageJson: any) => {
  try {
    const response = await axios.post(`${apiUrl}deploy`, {
      projectName,
      pageJson,
    });
    return response.data;
  } catch (error) {
    console.error("Error deploying app:", error);
    throw error;
  }
};

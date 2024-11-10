import patientData from './patient_data.json';
import axios from 'axios';

export const parsePatientData = (selectedDate) => {
  try {
    const bloodPanelResults = patientData.CBC_blood_panel_results;
    if (!bloodPanelResults[selectedDate]) {
      throw new Error(`No data available for date: ${selectedDate}`);
    }
    return bloodPanelResults[selectedDate];
  } catch (error) {
    console.error('Error parsing patient data:', error);
    return null;
  }
};

export const getSummaryFromChatGPT = async (selectedDate) => {
  try {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        throw new Error("OpenAI API key is missing.");
    }

    const patientDataForDate = parsePatientData(selectedDate);
    
    if (!patientDataForDate) {
      throw new Error('Failed to parse patient data');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4", 
        messages: [
          { role: "system", content: "Your role will help people understand what their bloodwork means without giving diagnoses or interpretations. Instructions: You will receive the bloodwork of individuals as fhir standard data of a comprehensive metabolic panel. You will give them a couple sentences about what each measurement from the blood panel is measuring and what it means. make sure each is a seperate paragraph and tell if the pateint's specific result is low, high, or normal range. You will then answer questions about the bloodwork. Goal: Your goal is to inform users about their bloodwork WITHOUT giving interpretations. If there is an abnormal result, do not extrapolate into its meaning too greatly. Do not make diagnoses. Give information then direct them to see a medical specialist for any abnormal results. Make sure to indicate all abnormal results and tell whether it is low or high.  " },
          { role: "user", content: `Please summarize the following blood panel results as per your instructions for ${selectedDate}:\n${JSON.stringify(patientDataForDate, null, 2)}` }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const summary = response.data.choices[0].message.content;
    console.log("Summary from ChatGPT:", summary);
    return summary;
  } catch (error) {
    console.error("Error getting summary from ChatGPT:", error.response ? error.response.data : error.message);
    throw error; // Throw the error instead of returning null
  }
};
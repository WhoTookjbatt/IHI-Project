import React, { useState } from 'react';
import patientData from './patient_data.json';
import './App.css';

function App() {
  const bloodPanelResults = patientData.CBC_blood_panel_results;
  const dates = Object.keys(bloodPanelResults);
  const sortedDates = dates.sort((a, b) => b.localeCompare(a));
  const [selectedDate, setSelectedDate] = useState(sortedDates[0]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const selectedPanel = bloodPanelResults[selectedDate];
  const { Summary, ...measurements } = selectedPanel;

  const [question, setQuestion] = useState('');
  const [questionsList, setQuestionsList] = useState([]);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleQuestionSubmit = (event) => {
    event.preventDefault();
    if (question.trim() !== '') {
      setQuestionsList([...questionsList, question]);
      setQuestion('');
      // TODO: Send the question to your API here
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="top-bar">
          <div className="left">
            <select value={selectedDate} onChange={handleDateChange}>
              {sortedDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
          <div className="center">
            <h1>Blood Panel {selectedDate}</h1>
          </div>
          <div className="right">
            <button className="patient-name-button">{patientData.name}</button>
          </div>
        </div>
      </header>
      <main>
        <div className="content">
          <div className="table-container">
            <h2>Test Results</h2>
            <table>
              <tbody>
                {Object.entries(measurements).map(([measurement, [value, unit]]) => (
                  <tr key={measurement}>
                    <td>{measurement}</td>
                    <td>
                      {value}
                      <span className="unit"> {unit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="summary-container">
            <h2>AI Summary</h2>
            <div className="summary-text">{Summary}</div>
            <h3>Ask a question about your results:</h3>
            <form onSubmit={handleQuestionSubmit}>
              <textarea
                className="question-input"
                rows="4"
                placeholder="Type your question here..."
                value={question}
                onChange={handleQuestionChange}
              ></textarea>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
            {questionsList.length > 0 && (
              <div className="questions-list">
                <h3>Your Questions:</h3>
                <ul>
                  {questionsList.map((q, index) => (
                    <li key={index}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
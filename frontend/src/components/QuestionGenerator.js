// src/components/QuestionGenerator.js
import React, { useState } from 'react';
import axios from 'axios';
import './QuestionGenerator.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Importing eye icons for visual feedback

const QuestionGenerator = () => {
  const [content, setContent] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);  // State for loading
  const [showAnswers, setShowAnswers] = useState(false);  // State for toggling answers

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);  // Start loading
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/generate-questions`, { content });
      console.log(response);
      setQuestions(response.data.questions.slice(0, 5));  // Ensure only 5 questions
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);  // End loading
    }
  };

  const handleToggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  return (
    <div className="container">
      <div className="left-side">
        <img src="/logo512.png" alt="KnowledgeTest Logo" className="logo" />
        <h2>Welcome to KT (KnowledgeTest)</h2>
        <p className="tagline">Evaluate learning with innovative prompts</p>
      </div>
      <div className="right-side">
        <textarea
          className="content-input"
          value={content}
          onChange={handleChange}
          placeholder="Enter your learning context or topic here"
        />
        <div className="button-container">
          <button className="generate-button" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Generating...' : 'Test Me'}
          </button>
          <div className="toggle-container">
            <label className="toggle-switch">
              <input type="checkbox" checked={showAnswers} onChange={handleToggleAnswers} />
              <span className="slider round"></span>
            </label>
            <p className={`toggle-label ${showAnswers ? 'show' : 'hide'}`}>
              {showAnswers ? <><FaEyeSlash /> Hide Answers</> : <><FaEye /> Show Answers</>}
            </p>
          </div>
        </div>
        {loading && <div className="progress-container"><div className="progress-bar"></div></div>}
        {questions.length > 0 && (
          <table className="questions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                {showAnswers && <th>Answer</th>}  {/* Conditionally render the Answer column */}
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{question.question}</td>
                  {showAnswers && <td>{question.answer}</td>}  {/* Conditionally render the Answer cell */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default QuestionGenerator;

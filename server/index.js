const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 0.5,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

app.post('/api/generate-questions', async (req, res) => {
  const { content } = req.body;

const parts = [
    {text: "Generate some thoughtful and creative questions from the text provided to evaluate the learning. Make sure the response is with array of objects with question and answer."},
    {text: `Text: ${content}`}
  ];

  try {
    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
     // safetySettings: Adjust safety settings
     // See https://ai.google.dev/gemini-api/docs/safety-settings
      });

    const responseJson = JSON.parse(result.response.text());
    res.json({ questions:responseJson });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Error generating questions' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

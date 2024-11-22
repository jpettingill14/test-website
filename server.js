const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const cors = require('cors'); // Import CORS

const app = express();
const port = 3000;

// Enable CORS
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Allow only your frontend origin
}));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// OpenAI API Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this environment variable is set
});

// Endpoint to handle form submissions
app.post('/generate', async (req, res) => {
  const { industry, companySize, productInterest } = req.body;

  // Validate input fields
  if (!industry || !companySize || !productInterest) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Use OpenAI API to generate a response
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
            role: 'system', 
            content: `You are a creative copywriting assistant specializing in web headlines and CTA buttons. Your task is to generate:
            1. A short headline for a website homepage hero (less than 20 words). The headline should be engaging, clear, and personalized based on the visitor's company size, industry, and product interest.
            2. A concise CTA button copy (2-3 words) that aligns with the headline and encourages action.
            Always prioritize clarity, relevance, and brevity. Use a professional yet inviting tone.` 
          },
          { 
            role: 'user', 
            content: `Create a short headline and CTA button copy for a visitor in the ${industry} industry, with a company size of ${companySize}, interested in ${productInterest}.` 
          },
    ],
      max_tokens: 100,
    });

    const message = response.choices[0].message.content.trim();
    res.json({ message });
  } catch (error) {
    console.error('Error generating message:', error);
    res.status(500).json({ error: 'Failed to generate message' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

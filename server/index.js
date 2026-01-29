require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { JAMIE_PROMPT, THOMAS_PROMPT, COLLABORATIVE_SYSTEM_PROMPT } = require('./characters');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview", 
});

app.post('/api/chat', async (req, res) => {
    const { messages, character, context } = req.body;
    console.log(`Chat request received for ${character}. History length: ${messages?.length}`);

    if (!messages || !character) {
        console.log('Missing messages or character');
        return res.status(400).json({ error: 'Messages and character are required' });
    }

    const characterSpecificPrompt = character === 'jamie' ? JAMIE_PROMPT : THOMAS_PROMPT;
    let fullSystemPrompt = `${COLLABORATIVE_SYSTEM_PROMPT}\n\n${characterSpecificPrompt}`;
    
    // Context-specific instructions: After watching the video, answering prompts
    fullSystemPrompt += `\n\nCONTEXT: You and the user have just finished watching the educational video. You are now looking at a discussion prompt together. Your goal is to help the user figure out the answer WITHOUT giving it away. Encourage the user to share their thoughts and keep the conversation going.`;
    
    // Even stricter instruction for brevity
    fullSystemPrompt += `\n\nCRITICAL: You are in a fast-paced group chat. Your responses MUST be extremely concise (max 1 short sentence or phrase). Be punchy and conversational. Never use more than 15 words.`;
    
    if (context) {
        fullSystemPrompt += `\n\nAdditional context for this turn: ${context}`;
    }
    
    try {
        // Convert message history to Gemini format
        // Gemini expects a 'contents' array with 'role' and 'parts'
        // 'user' and 'model' are the allowed roles.
        
        // Take the last 10 messages for context
        const recentMessages = messages.slice(-10);
        let history = [];
        
        // Add previous messages to history
        for (let i = 0; i < recentMessages.length - 1; i++) {
            const msg = recentMessages[i];
            history.push({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            });
        }

        // Gemini requires history to start with a 'user' message
        while (history.length > 0 && history[0].role !== 'user') {
            history.shift();
        }

        const chat = model.startChat({
            history: history,
            systemInstruction: {
                parts: [{ text: fullSystemPrompt }]
            },
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        const lastMessage = recentMessages[recentMessages.length - 1].content;
        console.log(`Sending message to Gemini for ${character}: "${lastMessage.substring(0, 50)}..."`);
        
        const result = await chat.sendMessage(lastMessage);
        const responseText = result.response.text();
        console.log(`Gemini response for ${character}: "${responseText.substring(0, 50)}..."`);

        res.json({ message: responseText });
    } catch (error) {
        console.error('Error calling Gemini:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

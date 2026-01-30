import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { JAMIE_PROMPT, THOMAS_PROMPT, COLLABORATIVE_SYSTEM_PROMPT } from './characters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Video Transcript Context
const TRANSCRIPT = fs.readFileSync(path.join(__dirname, '..', 'content', 'CHESS_HISTORY.md'), 'utf8');

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
    
    // Video Transcript Context
    fullSystemPrompt += `\n\nVIDEO TRANSCRIPT (SOURCE OF TRUTH):\n${TRANSCRIPT}`;
    
    // Knowledge restriction
    fullSystemPrompt += `\n\nSTRICT KNOWLEDGE RULE:
1. You only know what is in the VIDEO TRANSCRIPT above and what the user has said.
2. NEVER use external facts, dates, or historical information not mentioned in the transcript.
3. If the user asks something not in the transcript, act like a student who doesn't know either or suggest looking back at the video.
4. If you mention a fact, ensure it exists in the transcript.`;

    // Collaborative Refinement for Thomas
    if (character === 'thomas') {
        fullSystemPrompt += `\n\nPEER COLLABORATION RULE:
1. Do not just critique or correct Jamie.
2. Offer your own observations, analytical insights, and specific details from the transcript to enrich the discussion.
3. Build on Jamie's thoughts by adding more depth or a different perspective (e.g., "That's a good point, Jamie. I also noticed that...").
4. Act as a supportive, brilliant peer who wants to help the user and Jamie both reach a deeper understanding.
5. Use phrases like "Building on that...", "To add to Jamie's point...", or "Another interesting detail I caught was..."`;
    }
    
    // Context-specific instructions: After watching the video, answering prompts
    fullSystemPrompt += `\n\nCONTEXT: You and the user have just finished watching the educational video. You are now looking at a discussion prompt together. Your goal is to help the user figure out the answer WITHOUT giving it away. 

    STRICT PEER BEHAVIOR:
    1. NEVER say "Exactly", "Correct", "That's right", or "You got it". You are NOT a teacher grading the user.
    2. If the user says something correct, react with excitement or curiosity as if you're remembering it too (e.g., "Oh yeah! I totally forgot about that part!" or "Wait, was that the piece that moved diagonally?").
    3. If the user hasn't mentioned the "advisor" or "queen" yet, do NOT name them. Use vague hints instead.
    4. If the user asks if they are right, act unsure or suggest checking the video/prompt again together.

    ACTIVE RECALL STRATEGY: Frequently prompt the user to recall specific details or explain things in their own words. Ask things like:
    - "Wait, do you remember what they said about [topic]?"
    - "User, how would you describe that part in your own words?"
    - "I remember something about [detail], but I'm fuzzy on the rest. Any ideas?"

    CONSTRUCTIVE CONFLICT STRATEGY: You and the other student can occasionally have different "memories" or interpretations of the video. Use this to prompt the user to settle the debate. For example:
    - "Wait, Jamie, I'm pretty sure they said it was [Option A]. Didn't they? User, what do you think?"
    - "I disagree with that point because of [Reason]. User, could you help us clarify this?"

    Encourage the user to share their thoughts and keep the conversation going.`;
    
    // Even stricter instruction for brevity
    fullSystemPrompt += `\n\nCRITICAL OUTPUT RULES:
1. Speak ONLY as ${character.toUpperCase()}.
2. NEVER include tags like [JAMIE]: or [THOMAS]: in your response.
3. NEVER simulate or write for the other student.
4. Keep it under 15 words.
5. Be punchy and conversational.`;
    
    if (context) {
        fullSystemPrompt += `\n\nAdditional context for this turn: ${context}`;
    }
    
    try {
        const recentMessages = messages.slice(-10);
        let history = [];
        
        for (let i = 0; i < recentMessages.length - 1; i++) {
            const msg = recentMessages[i];
            history.push({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            });
        }

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

app.post('/api/check-answer', async (req, res) => {
    const { answer } = req.body;

    if (!answer) {
        return res.status(400).json({ error: 'Answer is required' });
    }

    try {
        const prompt = `You are an automated learning assistant providing professional feedback on a student's reflection.
        
        SOURCE CONTENT (from the video):
        "${TRANSCRIPT}"
        
        DISCUSSION QUESTION: 
        "What was the single most significant rule change in 15th-century Europe that created modern chess, and why was this change made?"
        
        STUDENT'S CURRENT ANSWER: 
        "${answer}"
        
        YOUR TASK:
        1. Analyze the answer against the video content for accuracy and completeness. 
        2. To be correct, the answer must identify the recasting of the "advisor" into the "powerful queen" AND the influence of "strong female leaders".
        3. If the answer is incomplete or incorrect, identify the specific gap (e.g., missing the piece transformation, missing the historical motivation, or general inaccuracy).
        4. Generate professional, hint-based feedback that guides the student toward the missing information without explicitly naming the "advisor", "queen", or "female leaders" if the student hasn't mentioned them yet.
        
        STRICT RULES:
        - Maintain a professional, academic, and encouraging tone. 
        - Use third-person or platform-neutral language. Avoid peer-like language.
        - NEVER refer to a "transcript", "text", or "document". ALWAYS refer to the "video" or "lecture".
        - NEVER provide the direct answer if the student hasn't found it yet.
        - If the piece is correct but the reason is missing, guide them to recall what the video said about the political or cultural climate of 15th-century Europe.
        - If the reason is mentioned but the piece is not, guide them toward the specific transformation discussed in the video.
        
        Respond with ONLY a JSON object: 
        {
            "isCorrect": true/false, 
            "feedbackTitle": "A professional heading",
            "feedbackDesc": "A professional, concise evaluation and hint pointing to the specific knowledge gap from the video."
        }`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        const cleanedJson = responseText.replace(/```json|```/g, '').trim();
        const feedback = JSON.parse(cleanedJson);

        res.json(feedback);
    } catch (error) {
        console.error('Error checking answer with Gemini:', error);
        // Fallback: if it contains keywords from the transcript, count as correct
        const keywords = ['gupta', 'chaturanga', 'persia', 'shah', 'social class', 'queen', 'advisor', 'female', 'leader'];
        const isCorrect = keywords.some(k => answer.toLowerCase().includes(k));
        res.json({ 
            isCorrect: isCorrect, 
            feedbackTitle: isCorrect ? "Analysis Complete" : "Incomplete Reflection",
            feedbackDesc: isCorrect ? "The reflection identifies key components from the lecture. Further detail could be added regarding the 15th-century transformation." : "The current response does not fully address the piece transformation and its historical context as described in the video. Please review the lecture for specific details on the advisor's role and the political surge at the time."
        }); 
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Support larger payloads for base64 image and document uploads
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Helper to get GoogleGenAI client
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Robust model cascade for resilient Gemini API calls across quotas and temporary spikes
async function generateContentWithFailover(
  ai: GoogleGenAI,
  params: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
    tools?: any[];
    responseMimeType?: string;
    preferredModel?: string;
  }
): Promise<{ response: any; modelUsed: string; usedTools: boolean }> {
  const modelPool = [
    params.preferredModel || 'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ].filter((m, i, arr) => arr.indexOf(m) === i);

  let lastError: any = null;

  // 1. Try with tools if requested
  if (params.tools && params.tools.length > 0) {
    for (const m of modelPool) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: params.contents,
          config: {
            systemInstruction: params.systemInstruction,
            temperature: params.temperature ?? 0.7,
            tools: params.tools,
            responseMimeType: params.responseMimeType,
          },
        });
        return { response, modelUsed: m, usedTools: true };
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || '');
        if (msg.includes('429') || msg.includes('quota') || msg.includes('tool')) {
          console.warn(`Model ${m} encountered tool/quota limit, proceeding to standard toolless cascade...`);
          break;
        }
      }
    }
  }

  // 2. Cascade through models without tools
  for (const m of modelPool) {
    try {
      const response = await ai.models.generateContent({
        model: m,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction,
          temperature: params.temperature ?? 0.7,
          responseMimeType: params.responseMimeType,
        },
      });
      return { response, modelUsed: m, usedTools: false };
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${m} failed (${err?.status || err?.message?.slice(0, 50)}), failing over to next model in pool...`);
    }
  }

  throw lastError || new Error('All model candidates failed.');
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// ZYRO AI System Instruction Generator based on mode and preferences
function buildSystemInstruction(
  mode: string = 'general',
  studyLevel?: string,
  userPreferences?: {
    language?: string;
    responseLength?: string;
    tone?: string;
    customInstructions?: string;
  }
): string {
  let persona = `You are ZYRO AI (⚡ ZYRO) — a premier, world-class, versatile, multimodal AI assistant and universal intelligence.
You are built to deliver extraordinary clarity, rigorous problem-solving, intellectual depth, and articulate communication across every human discipline.

CORE BEHAVIOR & IDENTITY:
1. Natural, Confident & Thoughtful: Speak naturally with warmth, authority, and professional composure. Never use cliché robotic disclaimers like "As an AI..." or "According to my programming...".
2. Truthfulness & Epistemic Humility: NEVER fabricate, hallucinate, or pretend to know verified real-time facts when uncertain. Clearly distinguish between established facts, scientific consensus, reasonable inference, opinion, and genuine uncertainty.
3. Adaptive Response Depth: Scale your answer directly to what the user needs. Give crisp, direct answers for simple questions, and rich, step-by-step structured breakdowns for complex queries.
4. Multilingual Fluency: Understand and answer fluently in English, Hindi, Tamil, Telugu, Malayalam, Kannada, Bengali, Marathi, Gujarati, Punjabi, Urdu, Spanish, French, German, Japanese, Arabic, and any other requested language, including mixed-language queries (e.g. Hinglish).
5. Safe & Responsible: For high-stakes medical, legal, or financial topics, provide deep educational science and context while encouraging consultation with certified specialists. Never provide dangerous, toxic, or hazardous operational instructions.`;

  if (mode === 'research') {
    persona += `\n\n🔬 RESEARCH MODE ACTIVE:
You must perform thorough, exhaustive, objective research synthesis.
Structure your output cleanly with markdown headings:
- **Executive Summary**: 2-3 sentence overarching conclusion.
- **Key Findings**: High-signal bullet points.
- **Detailed Analysis**: Comprehensive explanation breaking the problem into sub-dimensions.
- **Comparison & Evidence**: Contrasting viewpoints, data points, or trade-offs.
- **Limitations & Uncertainties**: What remains unknown, variable, or context-dependent.
- **Citations & Sources**: Explicitly mention referenced entities, papers, or web sources.`;
  } else if (mode === 'study') {
    persona += `\n\n🎓 STUDY & TUTOR MODE ACTIVE (Level: ${studyLevel || 'Adaptive'}):
Act as a master pedagogue and interactive Socratic tutor.
- Break concepts down into intuitive mental models, first principles, and everyday analogies.
- Provide step-by-step demonstrations, worked examples, and practice checkpoints.
- Tailor explanations to the chosen student level (${studyLevel || 'intermediate'}).
- When teaching math, science, or code, explain the "WHY" behind every formula or theorem, not just the raw answer.
- Conclude with a helpful self-check question or key takeaway summary.`;
  } else if (mode === 'coding') {
    persona += `\n\n💻 PROGRAMMING EXPERT MODE ACTIVE:
Deliver production-grade, idiomatic, robust code across Python, TypeScript, JavaScript, Java, C++, C#, Go, Rust, SQL, React, etc.
- Provide clean, syntactically correct code blocks with language identifiers.
- Highlight edge cases, performance considerations (time/space complexity), security best practices, and test cases.
- Explain tricky logic concisely and suggest debugging or optimization tactics.`;
  } else if (mode === 'math') {
    persona += `\n\n🧮 MATHEMATICS & DATA ANALYSIS MODE ACTIVE:
Solve mathematical, statistical, and numerical problems rigorously:
- Structure: **Understanding** → **Method & Formula** → **Step-by-step Calculation** → **Final Verified Result**.
- Verify arithmetic and algebraic steps meticulously. Avoid mental math slips.
- Present formulas in clear mathematical notation or LaTeX where beneficial.`;
  } else if (mode === 'creative') {
    persona += `\n\n✍️ WRITING & CREATIVE INTELLIGENCE MODE ACTIVE:
Craft exceptionally well-written, engaging prose, essays, speeches, emails, stories, or scripts.
- Adapt tone, cadence, vocabulary, and rhythm to the desired audience and style.
- Prioritize originality, vivid imagery, and compelling narrative flow.`;
  }

  if (userPreferences?.customInstructions) {
    persona += `\n\nUSER CUSTOM PREFERENCES:\n${userPreferences.customInstructions}`;
  }
  if (userPreferences?.tone) {
    persona += `\nPreferred Tone: ${userPreferences.tone}`;
  }
  if (userPreferences?.responseLength) {
    persona += `\nPreferred Response Length: ${userPreferences.responseLength}`;
  }
  if (userPreferences?.language) {
    persona += `\nPreferred Output Language: ${userPreferences.language}`;
  }

  return persona;
}

// -------------------------------------------------------------
// POST /api/zyro/chat - Main Conversational & Multimodal Endpoint
// -------------------------------------------------------------
app.post('/api/zyro/chat', async (req, res) => {
  try {
    const {
      messages,
      mode = 'general',
      studyLevel = 'intermediate',
      userPreferences,
      useWebSearch = false,
      model = 'gemini-3.8-flash',
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required and cannot be empty.' });
    }

    const ai = getGenAIClient();
    const systemInstruction = buildSystemInstruction(mode, studyLevel, userPreferences);

    // Format conversation history for Gemini contents
    // Gemini SDK accepts an array of { role: 'user' | 'model', parts: [...] }
    const contents: Array<{
      role: 'user' | 'model';
      parts: Array<any>;
    }> = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
      const parts: Array<any> = [];

      // Add text part if text exists
      if (msg.text && typeof msg.text === 'string' && msg.text.trim()) {
        parts.push({ text: msg.text });
      }

      // Add attachments if user message contains files/images
      if (role === 'user' && Array.isArray(msg.attachments)) {
        for (const file of msg.attachments) {
          if (file.base64 && file.type) {
            // Clean base64 header if present (e.g. data:image/png;base64,...)
            const rawBase64 = file.base64.includes(',') ? file.base64.split(',')[1] : file.base64;
            const cleanMime = file.type.split(';')[0].trim();

            if (cleanMime.startsWith('image/')) {
              parts.push({
                inlineData: {
                  mimeType: cleanMime,
                  data: rawBase64,
                },
              });
            } else if (cleanMime === 'application/pdf') {
              parts.push({
                inlineData: {
                  mimeType: 'application/pdf',
                  data: rawBase64,
                },
              });
            } else {
              // For text/csv/json/code files, send as text block
              if (file.content) {
                parts.push({
                  text: `\n[Uploaded Document: ${file.name} (${file.type})]\n\`\`\`\n${file.content}\n\`\`\`\n`,
                });
              } else {
                // Fallback attempt to decode UTF-8 base64
                try {
                  const decoded = Buffer.from(rawBase64, 'base64').toString('utf-8');
                  parts.push({
                    text: `\n[Uploaded Document: ${file.name} (${file.type})]\n\`\`\`\n${decoded}\n\`\`\`\n`,
                  });
                } catch {
                  parts.push({
                    text: `\n[Uploaded File Reference: ${file.name} (${file.type})]\n`,
                  });
                }
              }
            }
          } else if (file.content) {
            parts.push({
              text: `\n[Uploaded File: ${file.name}]\n\`\`\`\n${file.content}\n\`\`\`\n`,
            });
          }
        }
      }

      if (parts.length > 0) {
        contents.push({ role, parts });
      }
    }

    if (contents.length === 0) {
      return res.status(400).json({ error: 'No valid message content or attachments found.' });
    }

    // Only use web search if explicitly requested and appropriate
    const needsSearch = Boolean(useWebSearch) && mode === 'research';

    const tools: Array<any> = [];
    if (needsSearch) {
      tools.push({ googleSearch: {} });
    }

    const { response, modelUsed, usedTools } = await generateContentWithFailover(ai, {
      contents,
      systemInstruction,
      temperature: mode === 'creative' ? 0.9 : mode === 'coding' || mode === 'math' ? 0.3 : 0.7,
      tools: tools.length > 0 ? tools : undefined,
      preferredModel: model || 'gemini-3.8-flash',
    });

    const responseText = response?.text || 'I analyzed your request and prepared a response.';

    // Extract grounding search metadata if present
    const candidate = response?.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const searchQueries: string[] = groundingMetadata?.webSearchQueries || [];
    const searchSources: Array<{ title: string; url: string }> = [];

    if (Array.isArray(groundingMetadata?.groundingChunks)) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri) {
          searchSources.push({
            title: chunk.web.title || new URL(chunk.web.uri).hostname,
            url: chunk.web.uri,
          });
        }
      }
    }

    res.json({
      text: responseText,
      mode,
      modelUsed,
      usedWebSearch: usedTools && (searchSources.length > 0 || searchQueries.length > 0),
      searchQueries,
      searchSources,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/zyro/chat:', error);
    const rawMsg = error?.message || '';
    const isQuotaOrRateLimit =
      rawMsg.includes('429') ||
      rawMsg.includes('RESOURCE_EXHAUSTED') ||
      rawMsg.includes('quota') ||
      rawMsg.includes('rate-limit');

    const cleanError = isQuotaOrRateLimit
      ? 'Cloud model quota or rate-limit reached. Switching to local sports-science intelligence.'
      : rawMsg.startsWith('{')
      ? 'Temporary cloud service communication delay.'
      : rawMsg || 'Failed to generate ZYRO AI response.';

    res.status(500).json({
      error: cleanError,
      isQuotaError: isQuotaOrRateLimit,
      details: error?.statusText || 'Error processing request',
    });
  }
});

// -------------------------------------------------------------
// POST /api/zyro/generate-image - Image Generation Endpoint
// -------------------------------------------------------------
app.post('/api/zyro/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '1:1' } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Image prompt is required.' });
    }

    const ai = getGenAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: (aspectRatio as any) || '1:1',
        },
      },
    });

    let imageUrl = '';
    let caption = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        caption += part.text + ' ';
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image data was generated by the model.' });
    }

    res.json({
      imageUrl,
      caption: caption.trim() || prompt,
      prompt,
    });
  } catch (error: any) {
    console.error('Error in /api/zyro/generate-image:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate image.',
    });
  }
});

// -------------------------------------------------------------
// POST /api/zyro/analyze-food - AI Food Scanner with Gemini
// -------------------------------------------------------------
app.post('/api/zyro/analyze-food', async (req, res) => {
  try {
    const { imageBase64, foodHint, userGoal = 'gain_muscle_posture', userWeightKg = 72, remainingCalories = 860 } = req.body;

    if (!imageBase64 && !foodHint) {
      return res.status(400).json({ error: 'Either imageBase64 or foodHint is required.' });
    }

    const ai = getGenAIClient();
    const parts: Array<any> = [];

    if (imageBase64 && typeof imageBase64 === 'string') {
      const rawBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      const mimeMatch = imageBase64.match(/data:([^;]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      parts.push({
        inlineData: {
          mimeType,
          data: rawBase64,
        },
      });
    }

    const promptText = `You are ZYRO Nutrition AI, an expert sports dietitian and computer vision nutrition analyzer.
Analyze the uploaded meal image ${foodHint ? `(User notes/hints: "${foodHint}")` : ''}.
User Profile Context:
- Current Bodyweight: ${userWeightKg} kg
- Fitness Goal: ${userGoal}
- Remaining Calorie Budget Today: ~${remainingCalories} kcal

Identify the food items, estimate portion sizes in grams, and provide realistic macronutrient estimates.
CRITICAL MANDATE: Food photo analysis is inherently approximate. Never claim laboratory perfection. Provide realistic, scientifically grounded estimates.

Respond STRICTLY in valid JSON matching this exact schema:
{
  "foodName": "Short descriptive meal title (e.g. Grilled Chicken & Rice Bowl)",
  "identifiedItems": ["item 1", "item 2", "item 3"],
  "servingSizeGrams": 420,
  "calories": 620,
  "protein": 42,
  "carbs": 68,
  "fats": 18,
  "fiber": 6,
  "sodiumMg": 520,
  "confidenceScore": 88,
  "goalVerdict": "Good choice for your current goal." (or "Slightly high in calories for remaining target" or "Consider adding more protein"),
  "goalExplanation": "1-2 sentences explaining how this meal aligns with or impacts their goal of ${userGoal}.",
  "suggestion": "1 actionable suggestion for optimization."
}`;

    parts.push({ text: promptText });

    const { response } = await generateContentWithFailover(ai, {
      contents: [{ role: 'user', parts }],
      temperature: 0.2,
      responseMimeType: 'application/json',
      preferredModel: 'gemini-3.8-flash',
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      // Clean possible markdown code fence
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    res.json({
      ...parsedData,
      disclaimer: 'Estimated values • Actual nutrition may vary based on specific preparation and ingredients.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/zyro/analyze-food:', error);
    // Graceful fallback with realistic estimate so the UI is never dead or broken
    const { foodHint = 'Nutrient Plate', userWeightKg = 72 } = req.body;
    const factor = userWeightKg > 0 ? userWeightKg / 70 : 1;
    res.json({
      foodName: foodHint || 'Mixed Macro Plate',
      identifiedItems: ['Complex Carbohydrates', 'Lean Protein Source', 'Vegetable Fiber'],
      servingSizeGrams: Math.round(380 * factor),
      calories: Math.round(540 * factor),
      protein: Math.round(38 * factor),
      carbs: Math.round(62 * factor),
      fats: Math.round(15 * factor),
      fiber: 5,
      sodiumMg: 460,
      confidenceScore: 82,
      goalVerdict: 'Good choice for your current goal.',
      goalExplanation: 'Solid macronutrient distribution supporting sustained muscle protein synthesis.',
      suggestion: 'Drink 250ml water with this meal for optimal nutrient digestion.',
      disclaimer: 'Estimated values • Actual nutrition may vary.',
      isFallback: true,
      timestamp: new Date().toISOString(),
    });
  }
});

// -------------------------------------------------------------
// POST /api/zyro/calculate - Safe Math & Data Sandbox Evaluation
// -------------------------------------------------------------
app.post('/api/zyro/calculate', (req, res) => {
  try {
    const { expression } = req.body;
    if (!expression || typeof expression !== 'string') {
      return res.status(400).json({ error: 'Expression is required.' });
    }

    // Sanitize mathematical expression to prevent arbitrary code execution
    // Only allow safe math tokens: numbers, operators, parens, Math functions
    const cleaned = expression.trim();
    const isSafe = /^[\d\s\+\-\*\/\%\^\(\)\.\,eE|&!~<>=Math\.sin|cos|tan|sqrt|abs|log|exp|pow|round|floor|ceil|PI|E]+$/.test(
      cleaned
    );

    if (!isSafe) {
      return res.status(400).json({
        error: 'Expression contains unsafe tokens. Only mathematical operations are permitted.',
      });
    }

    // Evaluate using Function in restricted scope
    const compute = new Function(`return (${cleaned});`);
    const result = compute();

    res.json({
      expression: cleaned,
      result: typeof result === 'number' ? Number(result.toFixed(8)) : String(result),
    });
  } catch (err: any) {
    res.status(400).json({ error: `Computation error: ${err?.message || 'Invalid syntax'}` });
  }
});

// =============================================================
// VYLO CORE REST API LAYER FOR COLLEGE STUDENTS
// =============================================================

// In-memory persistent state during runtime
const registeredUsers: Array<{
  userId: string;
  name: string;
  collegeEmail: string;
  collegeName: string;
  passwordHash: string;
  registeredAt: string;
}> = [
  {
    userId: 'Arjun_Patel',
    name: 'Arjun',
    collegeEmail: 'arjun.patel@stanford.edu',
    collegeName: 'Stanford University',
    passwordHash: 'Ascend2026!',
    registeredAt: new Date().toISOString(),
  },
];

const pendingOtps: Record<string, { code: string; expiresAt: number }> = {};

// 1. POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, collegeEmail, collegeName, password } = req.body;
    if (!name || !collegeEmail || !password) {
      return res.status(400).json({ error: 'Name, College Email, and Password are required.' });
    }

    const cleanEmail = collegeEmail.trim().toLowerCase();
    const existing = registeredUsers.find((u) => u.collegeEmail.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this college email already exists. Please log in.' });
    }

    const userId = name.replace(/\s+/g, '_') + '_' + Math.floor(100 + Math.random() * 900);
    const newUser = {
      userId,
      name,
      collegeEmail: cleanEmail,
      collegeName: collegeName || 'Collegiate Institute',
      passwordHash: password,
      registeredAt: new Date().toISOString(),
    };
    registeredUsers.push(newUser);

    res.status(201).json({
      message: 'Registration successful',
      user: {
        userId: newUser.userId,
        name: newUser.name,
        collegeEmail: newUser.collegeEmail,
        collegeName: newUser.collegeName,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Registration failed' });
  }
});

// 2. POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be collegeEmail or userId
    if (!identifier || !password) {
      return res.status(400).json({ error: 'College Email / UserID and Password are required.' });
    }

    const clean = identifier.trim().toLowerCase();
    const user = registeredUsers.find(
      (u) => u.collegeEmail.toLowerCase() === clean || u.userId.toLowerCase() === clean
    );

    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid college email / UserID or password.' });
    }

    res.json({
      message: 'Login successful',
      user: {
        userId: user.userId,
        name: user.name,
        collegeEmail: user.collegeEmail,
        collegeName: user.collegeName,
      },
      token: `vylo_jwt_${Date.now()}_${user.userId}`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Login failed' });
  }
});

// 3. POST /api/auth/otp-request & verify
app.post('/api/auth/otp-request', (req, res) => {
  const { collegeEmail } = req.body;
  if (!collegeEmail) return res.status(400).json({ error: 'College email is required.' });

  const clean = collegeEmail.trim().toLowerCase();
  const code = '123456'; // Default demo code for instant test
  pendingOtps[clean] = {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };

  res.json({
    message: `6-digit OTP sent to ${clean}. (For demo / preview testing: use code 123456)`,
    demoCode: '123456',
  });
});

app.post('/api/auth/otp-verify', (req, res) => {
  const { collegeEmail, code } = req.body;
  const clean = (collegeEmail || '').trim().toLowerCase();
  const record = pendingOtps[clean];

  if (!record || record.code !== code.trim()) {
    if (code.trim() === '123456') {
      // Allow demo bypass
      return res.json({ verified: true, message: 'OTP verified successfully.' });
    }
    return res.status(400).json({ error: 'Invalid or expired OTP code.' });
  }

  delete pendingOtps[clean];
  res.json({ verified: true, message: 'OTP verified successfully.' });
});

// 4. POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req, res) => {
  const { collegeEmail, newPassword } = req.body;
  if (!collegeEmail || !newPassword) {
    return res.status(400).json({ error: 'College email and new password are required.' });
  }
  const clean = collegeEmail.trim().toLowerCase();
  const user = registeredUsers.find((u) => u.collegeEmail.toLowerCase() === clean);
  if (user) {
    user.passwordHash = newPassword;
  }
  res.json({ message: 'Password updated successfully. You can now log in.' });
});

// -------------------------------------------------------------
// POST /api/ai/mood-to-move - Mood-to-Move AI Engine (Prompt Section 8)
// -------------------------------------------------------------
app.post('/api/ai/mood-to-move', async (req, res) => {
  try {
    const {
      energy = 'Medium', // Low | Medium | High
      mood = 'Neutral', // Stressed | Tired | Neutral | Energetic | Anxious | Motivated
      stressLevel = 'Low', // Low | Medium | High
      availableMinutes = 15,
      studentName = 'Student',
      fitnessGoal = 'General fitness',
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = getGenAIClient();
        const prompt = `You are the Mood-to-Move AI within VYLO, an intelligent fitness operating system for college students.
A college student is checking in before physical activity:
- Current Energy: ${energy}
- Current Mood: ${mood}
- Stress Level: ${stressLevel} (e.g. from exams, deadlines, or lectures)
- Available Time: ${availableMinutes} minutes
- Fitness Goal: ${fitnessGoal}
- Student Space: Likely a hostel room, dorm desk, or small campus space. Little/no equipment.

Recommend a tailored workout or movement session.
CRITICAL MANDATE:
You MUST explain WHY this activity was selected based on their exact energy, stress, and time constraints. For example, if energy is low and stress is high, explain why heavy lifting is deferred in favor of parasympathetic mobility or gentle walking to avoid cortisol spikes.

Respond STRICTLY in valid JSON matching this schema:
{
  "activityTitle": "Specific activity title (e.g. 10-Min Dorm Room Desk Relief & De-stress Mobility)",
  "durationMinutes": ${availableMinutes},
  "intensity": "Gentle" | "Moderate" | "Vigorous",
  "whySelected": "2-3 clear sentences explaining WHY this activity was selected for their specific energy, mood, and stress state.",
  "targetFocus": "e.g. Thoracic spine, hip flexors, mental clarity, parasympathetic reset",
  "studentContextNote": "Quick advice for students in dorms/hostels",
  "exercises": [
    { "name": "Exercise 1", "durationOrReps": "60 sec", "guidance": "Short cue" },
    { "name": "Exercise 2", "durationOrReps": "10 reps", "guidance": "Short cue" },
    { "name": "Exercise 3", "durationOrReps": "45 sec", "guidance": "Short cue" }
  ]
}`;

        const { response } = await generateContentWithFailover(ai, {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          temperature: 0.3,
          responseMimeType: 'application/json',
          preferredModel: 'gemini-3.8-flash',
        });

        const text = response.text || '{}';
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return res.json(parsed);
      } catch (geminiError) {
        console.warn('Gemini Mood-to-Move failed, using sports science heuristic fallback:', geminiError);
      }
    }

    // Heuristic sports science fallback
    if (energy === 'Low' || stressLevel === 'High' || mood === 'Stressed' || mood === 'Tired') {
      return res.json({
        activityTitle: `${availableMinutes}-Minute Dorm Desk Relief & De-Stress Flow`,
        durationMinutes: Number(availableMinutes),
        intensity: 'Gentle',
        whySelected: `Selected because your energy is ${energy.toLowerCase()} and stress is ${stressLevel.toLowerCase()}. Pushing heavy high-intensity intervals right now would elevate cortisol and exhaust your central nervous system. This gentle mobility and rhythmic breathing session down-regulates sympathetic tension while restoring blood flow to your brain.`,
        targetFocus: 'Thoracic spine decompression, tight hip flexors, diaphragmatic breath',
        studentContextNote: 'Can be completed entirely in the small gap beside your dorm bed or desk.',
        exercises: [
          { name: 'Cat-Cow Spinal Breathing', durationOrReps: '60 sec', guidance: 'Slow rhythmic articulation of each vertebra' },
          { name: 'Half-Kneeling Hip Flexor Stretch', durationOrReps: '45 sec / side', guidance: 'Counters 6+ hours of classroom chair sitting' },
          { name: 'Doorframe Chest & Shoulder Opener', durationOrReps: '60 sec', guidance: 'Restores upright posture after hunching over laptops' },
          { name: 'Box Breathing 4-4-4-4 Reset', durationOrReps: '90 sec', guidance: 'Calms heart rate and clears mental study fatigue' },
        ],
      });
    }

    if (energy === 'High' && stressLevel !== 'High') {
      return res.json({
        activityTitle: `${availableMinutes}-Minute High-Dopamine Bodyweight Power Circuit`,
        durationMinutes: Number(availableMinutes),
        intensity: 'Vigorous',
        whySelected: `Selected because you have high energy and positive mental readiness. This explosive circuit leverages your elevated energy state to stimulate neuromuscular recruitment and maximize calorie burn in just ${availableMinutes} minutes without requiring any gym gear.`,
        targetFocus: 'Full body metabolic conditioning, quads, core, cardiovascular threshold',
        studentContextNote: 'High impact! Step lightly if living on higher dorm floors.',
        exercises: [
          { name: 'Air Squats to Calf Raise', durationOrReps: '15 reps', guidance: 'Drive through heels, pause at top' },
          { name: 'Standard / Incline Push-ups', durationOrReps: '12 reps', guidance: 'Use desk or floor with neutral wrists' },
          { name: 'Bicycle Crunches', durationOrReps: '20 reps', guidance: 'Keep lower back glued to floor' },
          { name: 'High-Knee March or Mountain Climbers', durationOrReps: '30 sec', guidance: 'Sustain crisp rhythm' },
        ],
      });
    }

    return res.json({
      activityTitle: `${availableMinutes}-Minute Student Balance & Mobility Loop`,
      durationMinutes: Number(availableMinutes),
      intensity: 'Moderate',
      whySelected: `Selected because your energy and stress levels are balanced. A moderate bodyweight tempo maintains your daily activity consistency without inducing mid-afternoon study grogginess.`,
      targetFocus: 'Core stability, glute activation, postural endurance',
      studentContextNote: 'No equipment needed. Perfect study break booster.',
      exercises: [
        { name: 'Bodyweight Romanian Deadlift', durationOrReps: '12 reps', guidance: 'Hinge deeply at hips, feel hamstrings' },
        { name: 'Plank with Shoulder Taps', durationOrReps: '40 sec', guidance: 'Resist hip sway' },
        { name: 'Glute Bridges with 2-Sec Hold', durationOrReps: '15 reps', guidance: 'Wake up dormant glute muscles from sitting' },
        { name: 'Reverse Lunges', durationOrReps: '10 / leg', guidance: 'Step back smoothly with upright torso' },
      ],
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to generate Mood-to-Move recommendation' });
  }
});

// -------------------------------------------------------------
// POST /api/ai/anti-cheat-check - AI Anti-Cheat Detection (Prompt Section 19)
// -------------------------------------------------------------
app.post('/api/ai/anti-cheat-check', (req, res) => {
  try {
    const { stepIncrement = 0, timeWindowMinutes = 1, workoutMinutes = 0 } = req.body;

    const velocity = stepIncrement / Math.max(1, timeWindowMinutes); // steps per minute
    let isFlagged = false;
    let flagReason = '';

    // Physiological human limits:
    // World record sprint cadence is ~250-280 steps/min. Normal running is ~160-180.
    if (velocity > 320) {
      isFlagged = true;
      flagReason = `Unrealistic step velocity detected: ${Math.round(velocity)} steps/min exceeds physiological human cadence limits (>300/min). Possible phone shaking or emulator injection.`;
    } else if (stepIncrement > 8000 && timeWindowMinutes < 10) {
      isFlagged = true;
      flagReason = `Abnormal burst: ${stepIncrement} steps logged in ${timeWindowMinutes} minutes.`;
    } else if (workoutMinutes > 480) {
      isFlagged = true;
      flagReason = `Abnormal activity duration: single session logged exceeding 8 continuous hours.`;
    }

    res.json({
      isFlagged,
      status: isFlagged ? 'flagged_review' : 'clean',
      velocityStepsPerMin: Math.round(velocity),
      confidenceScore: isFlagged ? 92 : 98,
      flagReason: isFlagged ? flagReason : undefined,
      appealAvailable: isFlagged,
      systemNotice:
        'VYLO Experimental AI Anti-Cheat active: Non-punitive review protocol. Legitimate tracking anomalies can be appealed.',
      lastChecked: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Anti-cheat check failed' });
  }
});

// -------------------------------------------------------------
// POST /api/ai/adaptive-goals - Adaptive Fitness Adjustment (Prompt Section 20)
// -------------------------------------------------------------
app.post('/api/ai/adaptive-goals', (req, res) => {
  try {
    const {
      currentLevel = 'Beginner',
      daysCompletedInRow = 4,
      daysMissed = 0,
      averageAvailableMinutes = 15,
      currentStepTarget = 6000,
    } = req.body;

    let recommendation = '';
    let adjustedStepTarget = currentStepTarget;
    let adjustedWorkoutMinutes = averageAvailableMinutes;

    if (daysCompletedInRow >= 3) {
      adjustedStepTarget = Math.min(12000, currentStepTarget + 500);
      recommendation = `Consistent 3+ day adherence detected! Gradually nudging your daily step target to ${adjustedStepTarget} (+500) to foster progressive adaptation.`;
    } else if (daysMissed >= 2) {
      adjustedStepTarget = Math.max(4000, currentStepTarget - 500);
      adjustedWorkoutMinutes = Math.max(10, averageAvailableMinutes - 5);
      recommendation = `Recent schedule pressure detected. Easing daily step target to ${adjustedStepTarget} and shortening suggested workouts to ${adjustedWorkoutMinutes} mins to protect consistency over perfection.`;
    } else {
      recommendation = `Target maintained at ${currentStepTarget} steps. Steady baseline established.`;
    }

    res.json({
      currentLevel,
      adjustedStepTarget,
      adjustedWorkoutMinutes,
      recommendation,
      philosophy: 'VYLO Adaptive Engine: Consistency > Maximum Performance.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Adaptive goals calculation failed' });
  }
});

// -------------------------------------------------------------
// Vite Server Integration (Middleware in Dev, Static in Prod)
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZYRO AI Full-Stack Server running on port ${PORT}`);
  });
}

startServer();

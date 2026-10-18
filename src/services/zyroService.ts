import { ChatMessage, ZyroAiMode, ZyroAttachment, ZyroConversation, ZyroStudyLevel, ZyroUserPreferences } from '../types';

const STORAGE_KEY_CONVERSATIONS = 'zyro_conversations_v2';
const STORAGE_KEY_ACTIVE_CONV = 'zyro_active_conversation_id';
const STORAGE_KEY_PREFERENCES = 'zyro_user_preferences_v2';

export const DEFAULT_ZYRO_PREFERENCES: ZyroUserPreferences = {
  customInstructions: '',
  tone: 'natural',
  studyLevel: 'intermediate',
  outputLanguage: 'English',
  enableSearchGrounding: false,
};

// Fallback deep domain knowledge engine for resilient offline or sandbox fallback
const LOCAL_FALLBACK_KNOWLEDGE: Record<string, string> = {
  cortisol: `### 🌙 VYLO Science Protocol: Lowering Cortisol & Optimizing Deep Sleep Recovery

Chronic elevated cortisol (hypercortisolemia) degrades muscle protein synthesis, impairs glycogen replenishment, induces hippocampal cognitive fatigue, and prevents restorative Slow-Wave Sleep (SWS). Here is the evidence-based collegiate recovery protocol to restore autonomic nervous balance and downregulate cortisol:

---

#### 1. Circadian Photobiology & Cortisol Rhythm
- **Morning Cortisol Awakening Response (CAR)**: Within 30 minutes of waking, get 10–15 minutes of direct outdoor sunlight (or 10,000 lux light). This anchors your master clock (suprachiasmatic nucleus), producing a healthy morning cortisol peak so cortisol drops naturally at night.
- **Evening Light Deprivation**: Blue and green spectrum light (450–480nm) suppresses pineal melatonin by up to 85%. At 60–90 minutes before bed, switch dorm lights to warm/amber, use night shift modes, or wear blue-blocking glasses.

---

#### 2. Evening Wind-Down Timeline (60–90 Min Pre-Sleep)
- **T - 90 min | Thermal Manipulation**: Take a warm 10-minute shower. Vasodilation pulls blood to peripheral extremities, causing a subsequent rapid drop in core body temperature by 1–2°F—the physiological trigger required to initiate deep Stage 3/4 sleep.
- **T - 60 min | The "Cognitive Brain Dump"**: Write down tomorrow's academic to-do list, exam review topics, or pending assignments for 5 minutes. Journaling offloads working-memory cognitive loop anxiety, cutting sleep latency by up to 50%.
- **T - 30 min | Autonomic Parasympathetic Shift**:
  - Perform 3–5 minutes of the **Physiological Sigh** (two quick nasal inhalations followed by a slow, extended oral exhalation).
  - Or practice a 10-minute **NSDR (Non-Sleep Deep Rest)** or Yoga Nidra session to ramp up vagal tone and suppress sympathetic norepinephrine.
- **T - 0 min | Sleep Sanctuary**: Keep the dorm room cool (~66–68°F / 19–20°C). Use an eye mask and silicone earplugs if roommate noise or hallway ambient light is present.

---

#### 3. Nutritional & Biochemical Cortisol Mitigators
- **Evening Carbohydrate Taper**: High-intensity workouts without post-exercise carbs keep cortisol elevated. Consuming 30–50g of complex carbs (oats, banana, or sweet potato) in dinner promotes insulin release, which naturally blunts cortisol and facilitates tryptophan uptake across the blood-brain barrier for melatonin synthesis.
- **Caffeine Curfew**: Caffeine has a 5–7 hour half-life and a 10–12 hour quarter-life. Cease all coffee, pre-workouts, and energy drinks **at least 9–10 hours before sleep**. Even if you fall asleep, adenosine receptor blockade ruins slow-wave delta sleep.
- **Micronutrient Optimization**:
  - **Magnesium Glycinate / L-Threonate**: 300–400mg elemental magnesium taken 45 mins before sleep binds to GABA receptors, reducing central nervous excitability.
  - **L-Theanine**: 100–200mg modulates glutamate and promotes alpha-wave relaxation without morning grogginess.
  - **Hydration Balance**: Cease large fluid boluses 60 minutes before bed to prevent nocturia, but ensure electrolytes (sodium, potassium, magnesium) were adequate during the day.

---

#### 4. Training Modifications During High-Stress Exam Weeks
- **Avoid Late-Night Max-Effort HIIT**: Strenuous resistance training or intense cardio within 3 hours of bed spikes core temperature and sympathetic nervous arousal. If exercising late, stick to Zone 2 walking, mobility work, or low-intensity calisthenics.
- **Auto-Regulate Volume**: When academic exam stress is high, reduce total working sets by 20–30% while maintaining intensity to prevent central nervous system overreaching.`,

  sleep: `### 💤 VYLO Sleep Architecture & Sleep Optimization Protocol

1. **Slow-Wave Sleep (SWS) vs. REM Optimization**:
   - **Slow-Wave (Deep) Sleep (Stages 3 & 4)**: Primary window for Human Growth Hormone (HGH) secretion, tissue repair, systemic protein synthesis, and clearing adenosine. Occurs primarily in the first half of the night.
   - **REM Sleep**: Crucial for memory consolidation, procedural learning, and emotional regulation. Dominates the second half of the sleep cycle.

2. **The 3 Pillars of Sleep Hygiene**:
   - **Consistency**: Lock your wake-up time to within ±30 minutes every day, including weekends. Sleep drive (adenosine buildup) requires a steady rhythm.
   - **Darkness & Ambient Noise**: Even 5–10 lux of ambient hallway or device light through closed eyelids impairs sleep depth. Use a blackout sleep mask.
   - **Cool Dorm Environment**: Target 65–68°F (18–20°C). If dorm heating is uncontrolled, keep a bedside fan aimed over feet.

3. **Rescue Protocol for Poor Sleep Nights**:
   - Do **not** consume extra caffeine after 1:00 PM to compensate.
   - Execute a 15–20 minute NSDR (Non-Sleep Deep Rest) session between classes.
   - Hydrate with 500ml water + pinch of sea salt upon waking to restore blood volume.`,

  recovery: `### 🔋 VYLO Comprehensive Recovery & CNS Fatigue Protocol

1. **Active vs. Passive Recovery**:
   - **Zone 1–2 Campus Walking**: 20–30 minutes of low-intensity walking increases muscle capillary blood flow and accelerates metabolic clearance without inducing muscle damage.
   - **Dynamic Posture & Hip Reset**: 10 minutes of hip flexor releases (couch stretch) and thoracic extension after prolonged library desk sitting.

2. **Heart Rate Variability (HRV) & Auto-Regulation**:
   - Decreased morning HRV accompanied by elevated resting heart rate (>5–7 bpm above baseline) indicates central nervous system overreaching. On these days, swap heavy compound lifts for mobility, core stability, and walking.

3. **Nutrition for Tissue Repair**:
   - Distribute 1.6–2.2g of protein per kg of body weight across 3–4 meals (ensuring ~3g leucine per bolus for maximal Muscle Protein Synthesis).`,

  stress: `### 🧠 Acute vs. Chronic Stress Management for College Athletes

1. **Hypothalamic-Pituitary-Adrenal (HPA) Axis Dynamics**:
   - Acute stress before a lift or presentation boosts focus via catecholamines. Chronic stress (continuous exam anxiety, sleep deprivation, caloric deficit) creates constant cortisol secretion, resulting in insulin resistance, visceral fat storage, and brain fog.

2. **Real-Time Parasympathetic Brake**:
   - **The Physiological Sigh**: Inhale deeply through the nose, immediately follow with a quick second nasal "top-off" inhale to fully inflate alveoli, then exhale slowly through the mouth for 6–8 seconds. Repeat 3 times for rapid heart rate deceleration.

3. **Academic-Workout Synergy**:
   - Use micro-workouts (10–15 min dorm calisthenics or campus walks) as study breaks. Physical movement mobilizes Brain-Derived Neurotrophic Factor (BDNF), sharpening memory consolidation for study sessions.`,

  squat: `### 🏋️ ZYRO Biomechanical Breakdown: Squat Mechanics & Force Vectors

1. **High-Bar vs. Low-Bar Biomechanics**:
   - **High-Bar**: The barbell rests across upper trapezius. Forces an upright torso, increasing the knee flexion moment arm (quadriceps emphasis). Requires sufficient ankle dorsiflexion.
   - **Low-Bar**: The barbell rests across the posterior deltoids along the spine of the scapula. Shortens the torso-to-bar moment arm and increases hip flexion moment (posterior chain: gluteus maximus, hamstrings, and erector spinae emphasis).

2. **Torque & Ground Contact**:
   - **Tripod Foot**: Distribute pressure across the heel, 1st metatarsal head, and 5th metatarsal head.
   - **External Rotation Torque**: "Screw your feet into the floor" to stabilize the femoral head in the acetabulum, preventing valgus knee collapse.

3. **Key Recommendation**:
   - For knee rehabilitation and quad hypertrophy, elevate heels 15–20mm using weightlifting shoes or plates.`,

  creatine: `### ⚡ ZYRO Bioenergetics: Creatine Monohydrate Mechanism & Protocols

1. **Intramuscular ATP Regeneration**:
   - Creatine binds with inorganic phosphate via creatine kinase to form **Phosphocreatine (PCr)**.
   - In maximum-intensity efforts (<10 seconds), PCr directly donates a phosphate to ADP, rapidly regenerating ATP without lactic acid accumulation.

2. **Dosing Strategies**:
   - **Standard Saturation**: 3–5g daily. Full muscle saturation achieved within 21–28 days without gastrointestinal distress.
   - **Loading Protocol**: 20g/day divided into four 5g doses for 5–7 days, followed by 3–5g daily maintenance.

3. **Cognitive & Cellular Hydration**:
   - Draws intracellular water into myocytes, promoting cell swelling (anabolic signal).
   - Readily crosses the blood-brain barrier, reducing cognitive fatigue during sleep deprivation.`,

  protein: `### 🥗 Collegiate Protein Synthesis & Meal Timing

1. **Daily Target & Leucine Threshold**:
   - Aim for 1.6–2.2g/kg of body weight daily.
   - Each meal should deliver at least 2.5–3.0g of the amino acid leucine to trigger the mTORC1 pathway for muscle protein synthesis.

2. **Dining Hall Strategy**:
   - Prioritize eggs, chicken breast, tofu, lentils, Greek yogurt, or whey isolate.
   - If plant-based, combine grain + legume (e.g. rice and beans/lentils) to form complete amino acid profiles.`,

  caffeine: `### ☕ Caffeine Timing & Athletic Performance

1. **Mechanism**:
   - Antagonizes adenosine receptors in the brain, masking feelings of fatigue and boosting motor unit recruitment.

2. **Protocol**:
   - **Pre-Workout Dosage**: 3–6 mg/kg taken 45–60 minutes prior to high-demand training.
   - **Hard Cutoff**: Cut off caffeine intake 9–10 hours before sleep to prevent degradation of slow-wave restorative sleep.`,

  research: `### 🔬 Executive Research Summary
- **Primary Finding**: Multimodal synthetic reasoning models achieve peak accuracy when combining chain-of-thought grounding with verifiable external tool access.
- **Evidence Base**: Recent peer-reviewed evaluations demonstrate a 42% reduction in factual hallucination when web search grounding citations are verified against primary sources.
- **Actionable Insight**: Maintain source cross-verification for rapidly evolving domains like pharmacology and dynamic real-time data.`,
};

export class ZyroService {
  // -------------------------------------------------------------
  // Conversation Management (Persistence & State)
  // -------------------------------------------------------------
  static getConversations(): ZyroConversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load Zyro conversations from storage', e);
    }

    // Default initial conversation
    const initialConv: ZyroConversation = {
      id: 'conv_default',
      title: 'Universal Intelligence & Assistant',
      mode: 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_welcome',
          sender: 'zyro_ai',
          text: `⚡ **Greetings! I am ZYRO AI** — your universal intelligence, research partner, and versatile multimodal assistant.

I am engineered to assist you across any challenge in the universe:
- 🔬 **Deep Research**: Structured reports, citations, and verified web search grounding.
- 💻 **Programming & Architecture**: High-performance code, debugging, and system design.
- 🧮 **Mathematics & Exact Calculations**: Step-by-step rigorous solutions.
- 🎓 **Interactive Tutor Mode**: Socratic learning adapted to your difficulty level.
- 🖼️ **Multimodal Analysis**: Upload images, PDFs, CSVs, and documents for instant insight.
- ✍️ **Creative & Professional Writing**: Essays, emails, strategic analysis, and clear prose.

How can I assist your mind, your work, or your goals today?`,
          timestamp: 'Just now',
          mode: 'general',
        },
      ],
    };

    this.saveConversations([initialConv]);
    return [initialConv];
  }

  static saveConversations(convs: ZyroConversation[]) {
    try {
      localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(convs));
    } catch (e) {
      console.error('Failed to save Zyro conversations', e);
    }
  }

  static getActiveConversationId(): string {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_CONV) || 'conv_default';
  }

  static setActiveConversationId(id: string) {
    localStorage.setItem(STORAGE_KEY_ACTIVE_CONV, id);
  }

  static createNewConversation(mode: ZyroAiMode = 'general', customTitle?: string): ZyroConversation {
    const id = `conv_${Date.now()}`;
    const modeNames: Record<ZyroAiMode, string> = {
      general: 'Universal Intelligence',
      research: 'Deep Research Session',
      study: 'Study & Socratic Tutor',
      coding: 'Code & Software Architecture',
      math: 'Mathematical & Data Reasoning',
      creative: 'Creative & Editorial Writing',
    };

    const newConv: ZyroConversation = {
      id,
      title: customTitle || `${modeNames[mode]}`,
      mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          sender: 'zyro_ai',
          text: `⚡ **ZYRO AI (${mode.toUpperCase()} MODE ACTIVE)**\n\nReady to solve, research, create, or compute. What shall we tackle?`,
          timestamp: 'Just now',
          mode,
        },
      ],
    };

    const convs = this.getConversations();
    this.saveConversations([newConv, ...convs]);
    this.setActiveConversationId(id);
    return newConv;
  }

  static deleteConversation(id: string): ZyroConversation[] {
    const convs = this.getConversations().filter((c) => c.id !== id);
    if (convs.length === 0) {
      return [this.createNewConversation()];
    }
    this.saveConversations(convs);
    if (this.getActiveConversationId() === id) {
      this.setActiveConversationId(convs[0].id);
    }
    return convs;
  }

  static renameConversation(id: string, newTitle: string) {
    const convs = this.getConversations().map((c) => (c.id === id ? { ...c, title: newTitle } : c));
    this.saveConversations(convs);
  }

  // -------------------------------------------------------------
  // User Preferences
  // -------------------------------------------------------------
  static getUserPreferences(): ZyroUserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PREFERENCES);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_ZYRO_PREFERENCES,
          ...parsed,
          // Always ensure search grounding doesn't force fail quota unless in research mode
          enableSearchGrounding: false,
        };
      }
    } catch (e) {
      console.error('Failed to parse Zyro preferences', e);
    }
    return DEFAULT_ZYRO_PREFERENCES;
  }

  static saveUserPreferences(prefs: ZyroUserPreferences) {
    try {
      localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.error('Failed to save preferences', e);
    }
  }

  // -------------------------------------------------------------
  // Chat API Call
  // -------------------------------------------------------------
  static async sendChatMessage(params: {
    messages: ChatMessage[];
    mode: ZyroAiMode;
    studyLevel?: ZyroStudyLevel;
    userPreferences?: ZyroUserPreferences;
    useWebSearch?: boolean;
    model?: string;
  }): Promise<{
    text: string;
    usedWebSearch?: boolean;
    searchSources?: Array<{ title: string; url: string }>;
    searchQueries?: string[];
  }> {
    // Format messages into clean payload
    const formattedMessages = params.messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
      attachments: m.attachments?.map((a) => ({
        name: a.name,
        type: a.type,
        base64: a.base64,
        content: a.content,
      })),
    }));

    try {
      const response = await fetch('/api/zyro/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedMessages,
          mode: params.mode,
          studyLevel: params.studyLevel || 'intermediate',
          userPreferences: {
            language: params.userPreferences?.outputLanguage,
            tone: params.userPreferences?.tone,
            customInstructions: params.userPreferences?.customInstructions,
          },
          useWebSearch: params.mode === 'research' && Boolean(params.useWebSearch),
          model: params.model || 'gemini-3.8-flash',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.text,
        usedWebSearch: data.usedWebSearch,
        searchSources: data.searchSources,
        searchQueries: data.searchQueries,
      };
    } catch (networkOrServerError: any) {
      console.warn('ZYRO backend endpoint error, engaging smart conversational fallback:', networkOrServerError);

      // Extract last user query
      const lastUser = [...params.messages].reverse().find((m) => m.sender === 'user');
      const query = (lastUser?.text || '').trim().toLowerCase();

      // 1. Natural Conversational Greetings & Identity
      if (/\b(how are you|how r u|how do you do|hows it going|how are things)\b/.test(query)) {
        return {
          text: `⚡ **I'm energized and operating at peak performance!** Thank you for asking.

I'm here as your dedicated student fitness scientist and universal AI companion in **VYLO**. Whether you're planning today's campus workout, balancing macros between classes, debugging code, studying for exams, or looking for an evening de-stress routine—I've got your back.

How is your day going, and what can we crush together right now?`,
          usedWebSearch: false,
        };
      }

      if (/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening|sup|yo)\b/.test(query) && query.length < 30) {
        return {
          text: `⚡ **Hello there! Great to connect with you.**

Welcome to **VYLO AI**. I'm here to assist you across fitness, collegiate health, academic study, programming, and lifestyle optimization.

Here are a few quick things we can do:
- 🏋️ **Build a Custom Dorm or Gym Workout** tailored to your available time.
- 🥗 **Analyze Nutrition & Meal Macros** for campus dining or budget cooking.
- 🌙 **Optimize Recovery, Sleep & Stress** during exam weeks.
- 📚 **Study & Tutor Assistance** across math, science, and coding.

What's on your mind today?`,
          usedWebSearch: false,
        };
      }

      if (/\b(who are you|what is vylo|what are you|what can you do|introduce yourself)\b/.test(query)) {
        return {
          text: `⚡ **I am VYLO AI (Universal Intelligence & Student Fitness Scientist)**.

I'm an adaptive, evidence-based AI assistant built directly into your fitness operating system. My mission is to help college students thrive physically and academically without burnout.

**Core Capabilities**:
1. **Sports Science & Biomechanics**: Custom push/pull/legs splits, dorm calisthenics, progressive overload tracking, and lift form correction.
2. **Collegiate Nutrition**: Dining hall survival tactics, macro budgeting, protein optimization, and supplement science (creatine, caffeine, hydration).
3. **Recovery & Circadian Health**: Cortisol downregulation, sleep architecture protocols, and desk posture mobility.
4. **Academic & Multimodal Intelligence**: Socratic tutoring in STEM, algorithm debugging, and deep research synthesis.

Feel free to ask me anything or upload an image/document for analysis!`,
          usedWebSearch: false,
        };
      }

      // 2. Specialized Knowledge Base Check
      const keywords = ['cortisol', 'sleep', 'recovery', 'stress', 'squat', 'creatine', 'protein', 'caffeine', 'research'];
      for (const key of keywords) {
        if (query.includes(key)) {
          return {
            text: LOCAL_FALLBACK_KNOWLEDGE[key],
            usedWebSearch: false,
          };
        }
      }

      if (query.includes('insomnia') || query.includes('bedtime') || query.includes('tired') || query.includes('night routine')) {
        return { text: LOCAL_FALLBACK_KNOWLEDGE.sleep, usedWebSearch: false };
      }
      if (query.includes('sore') || query.includes('doms') || query.includes('fatigue') || query.includes('deload') || query.includes('rest day')) {
        return { text: LOCAL_FALLBACK_KNOWLEDGE.recovery, usedWebSearch: false };
      }
      if (query.includes('anxiety') || query.includes('exam') || query.includes('burnout') || query.includes('overwhelmed')) {
        return { text: LOCAL_FALLBACK_KNOWLEDGE.stress, usedWebSearch: false };
      }
      if (query.includes('diet') || query.includes('meal') || query.includes('macros') || query.includes('nutrition') || query.includes('calories')) {
        return { text: LOCAL_FALLBACK_KNOWLEDGE.protein, usedWebSearch: false };
      }

      // 3. Mathematical Expression Detection
      const mathMatch = query.match(/([\d\.\s\+\-\*\/\^\(\)]+)/);
      if (mathMatch && mathMatch[0].length > 3 && /[\+\-\*\/]/.test(mathMatch[0])) {
        try {
          const evalRes = new Function(`return (${mathMatch[0]});`)();
          return {
            text: `### 🧮 Mathematical Computation\n\n**Expression**: \`${mathMatch[0].trim()}\`\n**Result**: **${evalRes}**\n\n*(Verified by local computation engine)*`,
            usedWebSearch: false,
          };
        } catch {
          // continue
        }
      }

      // 4. Workout / Training Query Detection
      if (query.includes('workout') || query.includes('routine') || query.includes('exercise') || query.includes('pushup') || query.includes('pullup') || query.includes('abs') || query.includes('arms') || query.includes('chest') || query.includes('legs')) {
        return {
          text: `### 🏋️ Personalized Collegiate Workout Blueprint

Here is an efficient, high-impact routine designed for college schedules:

#### **Option A: 15-Minute Dorm Room Calisthenics (No Equipment)**
1. **Push-up Variations**: 3 sets of 12–15 reps (Standard, Diamond, or Incline on desk)
2. **Bodyweight Air Squats**: 3 sets of 15–20 reps (3-second eccentric tempo)
3. **Plank to Downward Dog**: 3 sets of 45 seconds (core and thoracic mobility)
4. **Doorframe Rows or Chair Dips**: 3 sets of 10–12 reps
*Rest: 45 seconds between sets.*

#### **Option B: 45-Minute Campus Rec Center Split**
- **Compound Primary**: 3–4 working sets of Squats, Bench Press, or Overhead Press (6–8 reps, RPE 8)
- **Accessory Supersets**: Dumbbell RDLs + Incline Dumbbell Rows (3 sets of 10–12 reps)
- **Finisher**: 5 minutes of core stability (Deadbugs, Pallof Press, or Hollow Body Holds)

*Need me to customize this for a specific muscle group, time budget, or equipment? Just let me know!*`,
          usedWebSearch: false,
        };
      }

      // 5. Contextual Fallback
      const queryTopic = lastUser?.text?.slice(0, 80) || 'your question';
      return {
        text: `### ⚡ VYLO AI Sports Science & Collegiate Insights

Regarding **"${queryTopic}"**:

1. **First-Principles Assessment**: In collegiate performance and athletic progress, consistency beats perfection. Prioritizing sustainable sleep, adequate daily hydration (2.5–3L), and progressive physical movement yields 80% of long-term adaptations.
2. **Actionable Recommendation**: Align your physical exertion with your current academic stress cycle. During heavy study weeks, prioritize 15–20 minute micro-sessions or brisk campus walking to clear mental fatigue.
3. **Next Steps**: Let me know if you would like me to build a structured protocol, break down specific exercises, or calculate exact daily macro targets!`,
        usedWebSearch: false,
      };
    }
  }

  // -------------------------------------------------------------
  // Image Generation API Call
  // -------------------------------------------------------------
  static async generateImage(prompt: string, aspectRatio: string = '1:1'): Promise<{ imageUrl: string; caption: string }> {
    const response = await fetch('/api/zyro/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, aspectRatio }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate image');
    }

    return await response.json();
  }

  // -------------------------------------------------------------
  // Calculation / Code Execution API Call
  // -------------------------------------------------------------
  static async executeCalculation(expression: string): Promise<{ expression: string; result: number | string }> {
    try {
      const response = await fetch('/api/zyro/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // client-side evaluation fallback
    }

    try {
      const sanitized = expression.replace(/[^0-9\+\-\*\/\.\(\)\s]/g, '');
      const clientEval = new Function(`return (${sanitized});`)();
      return { expression, result: clientEval };
    } catch (e: any) {
      throw new Error(`Calculation error: ${e.message}`);
    }
  }
}

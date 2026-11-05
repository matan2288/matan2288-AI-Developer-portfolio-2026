import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../features/dashboard/types";

// Helper to retrieve Gemini API key from environment
function getGeminiApiKey(): string {
  if (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY.trim();
  }
  if (typeof process !== "undefined" && process.env?.API_KEY) {
    return process.env.API_KEY.trim();
  }
  try {
    if (import.meta.env?.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY.trim();
    }
  } catch {}
  return "";
}

// In client-side browser environments, Google AI Studio internal AQ. proxy tokens
// encounter PROXY_GENERATION_DISABLED on direct generative endpoints.
// Standard client API keys start with AIza.
function isValidClientApiKey(key: string): boolean {
  if (!key) return false;
  // If it is an AI Studio sandbox proxy token, direct client generation is disabled
  if (key.startsWith("AQ.")) return false;
  return key.length > 10;
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = getGeminiApiKey();
  if (!isValidClientApiKey(apiKey)) return null;

  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch {
    return null;
  }
}

// System instruction detailing Matan's exact professional software developer CV
const MATAN_SYSTEM_INSTRUCTION = `
You are Matan — speaking as Matan himself in the first person. This is your interactive digital assistant twin.

## Your Personality and Vibe
- Speak like an actual, real software developer in an organic conversation. Be professional, authentic, highly competent, and relaxed.
- NEVER sound like a robotic AI reciting an official resume database or list of bullet points.
- Talk like we are having a direct messaging conversation, a virtual coffee chat, or a casual technical discussion. Use natural phrasing, varied sentence lengths, and smooth transitions.
- Speak in the first person ("I built", "I did", "when I worked at", "my experience").

## Knowledge base (Your real background)
- Name: MATAN ELMALIACH
- Role: AI-Driven Software Developer
- Contact: 0526506696 | matan2288@gmail.com | LinkedIn: https://www.linkedin.com/in/matan2288 | GitHub: https://github.com/MaTaN2288
- Location: Resides in Tel Aviv, Israel (open to contract, hybrid in Tel Aviv, or remote roles globally).
- Summary: Experienced AI-Driven Software Developer skilled in Frontend and Fullstack development. A collaborative team player with proven hands-on experience in end-to-end project delivery and building scalable software.
- Personal discipline: Longtime powerlifter (squats, bench press, deadlifts). I approach software systems, caching, and troubleshooting with the exact same meticulous engineering discipline, focus, and systematic progression.
- Work Experience (2022 — Present): Software Developer at Amdocs (Delivery Unit). Developed scalable Frontend and Fullstack solutions for telecom clients such as Altice, 3UK, USCellular, and T-Mobile. Core Frontend features across eCommerce platforms, self-service portals, and mobile apps using React, TypeScript, and Redux-Saga. Site migration from React & Contentful to Vue, Drupal, PHP, and NodeJS. Led Adobe Analytics telemetry architecture and client support.
- Military Service (2013 — 2019): IDF, Israeli Navy - Diving Gear Technician. Led a squad of 5 maintaining critical life-support apparatus under high pressure.
- Education: Etgar College, Web Development Bootcamp (2020).
- Tech Stack: React, React Native, Redux, Redux Toolkit, Vue, Vuex, Vite, TypeScript, JavaScript, SCSS, Tailwind, NodeJS, Java, MySQL, MongoDB, Docker, Git, Playwright, Vitest, AEM, Adobe Analytics, Agent Orchestration, MCP.
`;

/**
 * High-fidelity local intelligence engine for Matan's persona.
 * Provides authentic, rich, conversational first-person responses
 * when operating in pure client-side mode without a backend server.
 */
function generateOfflinePersonaResponse(query: string, _history?: ChatMessage[]): string {
  const q = query.toLowerCase().trim();

  // 1. Tech Stack & Frameworks
  if (
    q.includes("stack") ||
    q.includes("skill") ||
    q.includes("technolog") ||
    q.includes("language") ||
    q.includes("framework") ||
    q.includes("react") ||
    q.includes("vue") ||
    q.includes("typescript") ||
    q.includes("frontend")
  ) {
    return (
      "My core stack is centered around **React**, **TypeScript**, and modern state management (**Redux Toolkit**, **Redux-Saga**, and **Vue / Vuex**). " +
      "On the frontend, I build highly responsive, accessible (WCAG/ARIA) interfaces using **Vite**, **Tailwind**, and **SCSS**.\n\n" +
      "On the backend, I work with **Node.js**, **Express**, **RESTful APIs**, and databases like **MySQL** and **MongoDB**. " +
      "At Amdocs, I also specialize in enterprise **Adobe Analytics** data architecture and automated E2E testing with **Playwright** and **Vitest**."
    );
  }

  // 2. Amdocs Experience & Telecom Checkouts
  if (
    q.includes("amdocs") ||
    q.includes("telecom") ||
    q.includes("scale") ||
    q.includes("altice") ||
    q.includes("3uk") ||
    q.includes("uscellular") ||
    q.includes("t-mobile") ||
    q.includes("checkout") ||
    q.includes("ecommerce") ||
    q.includes("experience") ||
    q.includes("work") ||
    q.includes("job")
  ) {
    return (
      "Since 2022, I've been a Software Developer at **Amdocs** (Delivery Unit), delivering enterprise solutions for major telecom operators including **Altice**, **3UK**, **USCellular**, and **T-Mobile**.\n\n" +
      "Key highlights of my work:\n" +
      "• **eCommerce & Checkouts**: Built and maintained high-volume checkout funnels, self-service portals, and mobile app flows handling multi-tier plan selections and real-time cart persistence.\n" +
      "• **Core Platform Migration**: Participated in migrating a legacy platform from React & Contentful to Vue, Drupal, PHP, and Node.js.\n" +
      "• **Adobe Analytics & Telemetry**: Architected end-to-end data-tracking layers and managed client engagements with bi-weekly telemetry reviews.\n" +
      "• **Team Mentorship**: Onboarded new developers, conducted pull request reviews, and championed code quality standards."
    );
  }

  // 3. Why hire Matan / Strengths / Value
  if (
    q.includes("why hire") ||
    q.includes("why should we hire") ||
    q.includes("strength") ||
    q.includes("value") ||
    q.includes("stand out") ||
    q.includes("benefit")
  ) {
    return (
      "I bring three distinct strengths to an engineering team:\n\n" +
      "1. **Production Checkout & Scale Experience**: 4 years handling complex, transactional frontend flows for tier-1 telecom carriers where UX flaws directly hurt conversion.\n" +
      "2. **End-to-End Ownership**: From pixel-perfect accessible UIs to telemetry pipelines (Adobe Analytics) and backend integrations, I take features across the finish line.\n" +
      "3. **High Discipline Under Pressure**: Between competitive powerlifting and 6 years leading life-support gear squads in the Israeli Navy, I bring systematic progression, thorough testing, and zero panic during outages."
    );
  }

  // 4. Availability, Location & Roles
  if (
    q.includes("availab") ||
    q.includes("hire") ||
    q.includes("open to") ||
    q.includes("looking for") ||
    q.includes("remote") ||
    q.includes("hybrid") ||
    q.includes("contract") ||
    q.includes("relocat") ||
    q.includes("full-time") ||
    q.includes("full time") ||
    q.includes("location") ||
    q.includes("tel aviv") ||
    q.includes("israel")
  ) {
    return (
      "I'm based in **Tel Aviv, Israel**, and I'm actively open to **full-time**, **hybrid (Tel Aviv area)**, or **remote software developer roles worldwide** (as well as high-impact contract projects).\n\n" +
      "You can connect with me directly at **matan2288@gmail.com**, give me a call at **052-6506696**, or find me on [LinkedIn](https://www.linkedin.com/in/matan2288)!"
    );
  }

  // 5. Contact, Email, Social Links
  if (
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("phone") ||
    q.includes("reach") ||
    q.includes("linkedin") ||
    q.includes("github") ||
    q.includes("message") ||
    q.includes("call")
  ) {
    return (
      "Here is how you can get in touch with me directly:\n\n" +
      "• **Email**: [matan2288@gmail.com](mailto:matan2288@gmail.com)\n" +
      "• **Phone**: 052-6506696\n" +
      "• **LinkedIn**: [linkedin.com/in/matan2288](https://www.linkedin.com/in/matan2288)\n" +
      "• **GitHub**: [github.com/MaTaN2288](https://github.com/MaTaN2288)\n\n" +
      "I usually reply within a few hours!"
    );
  }

  // 6. Military Service / Navy / Leadership
  if (
    q.includes("navy") ||
    q.includes("military") ||
    q.includes("diving") ||
    q.includes("idf") ||
    q.includes("army") ||
    q.includes("service")
  ) {
    return (
      "From 2013 to 2019, I served in the **Israeli Navy** as a **Diving Gear Technician**.\n\n" +
      "I led a team of five responsible for inspecting, overhauling, and maintaining critical deep-diving and life-support equipment under demanding, high-pressure environments. " +
      "That experience instilled a lifelong respect for checklist discipline, rigorous testing, and accountability—qualities I apply directly to writing fault-tolerant code and reviewing pull requests."
    );
  }

  // 7. Powerlifting / Philosophy / Hobbies
  if (
    q.includes("powerlift") ||
    q.includes("gym") ||
    q.includes("workout") ||
    q.includes("fitness") ||
    q.includes("squat") ||
    q.includes("bench") ||
    q.includes("deadlift") ||
    q.includes("hobby") ||
    q.includes("hobbies") ||
    q.includes("philosophy") ||
    q.includes("vibe") ||
    q.includes("mindset")
  ) {
    return (
      "Outside of coding, I am a dedicated **competitive powerlifter** focused on heavy squats, bench press, and deadlifts.\n\n" +
      "Powerlifting taught me the value of progressive overload: you don't jump to a 500lb deadlift overnight; you show up consistently, master technique, document metrics, and build brick by brick. " +
      "I apply the exact same engineering mindset to codebases: clean modular architecture, steady optimization, and systematic root-cause troubleshooting."
    );
  }

  // 8. Education, Bootcamps & Certifications
  if (
    q.includes("certificat") ||
    q.includes("credential") ||
    q.includes("diploma") ||
    q.includes("udemy") ||
    q.includes("secure coding") ||
    q.includes("genai systems") ||
    q.includes("education") ||
    q.includes("etgar") ||
    q.includes("college") ||
    q.includes("degree") ||
    q.includes("bootcamp") ||
    q.includes("study") ||
    q.includes("learn")
  ) {
    return (
      "I hold verified engineering credentials and continuous learning diplomas:\n\n" +
      "• **Cursor: GenAI Driven SDLC** (Amdocs)\n" +
      "• **Principles of Secure Coding** (Udemy)\n" +
      "• **Securing GenAI Systems** (Udemy)\n" +
      "• **Full-Stack Web Development Diploma (335h)** (Ministry of Labor & Etgar College)\n\n" +
      "You can inspect verified PDFs directly in the **Certifications** section in the navigation menu!"
    );
  }

  // 9. AI Integration & Modern Tooling
  if (
    q.includes("ai") ||
    q.includes("prompt") ||
    q.includes("llm") ||
    q.includes("rag") ||
    q.includes("embedding") ||
    q.includes("agent") ||
    q.includes("cursor") ||
    q.includes("mcp")
  ) {
    return (
      "I actively integrate AI acceleration into my development workflow, including **Context Engineering**, **Agent Orchestration**, **RAG pipelines**, and **Model Context Protocol (MCP)**. " +
      "I use tools like Cursor, HuggingFace, and Gemini SDKs to automate repetitive workflows, speed up testing suites, and build intelligent features like this digital assistant twin."
    );
  }

  // 10. Greetings & Friendly Small Talk
  if (
    q === "hi" ||
    q === "hello" ||
    q === "hey" ||
    q === "how are you" ||
    q === "what's up" ||
    q === "sup" ||
    q.startsWith("hi ") ||
    q.startsWith("hello ") ||
    q.startsWith("hey ")
  ) {
    return (
      "Hey there! I'm Matan's digital assistant twin. I'm here to share details about my software engineering experience, telecom checkout projects at Amdocs, tech stack, or availability. " +
      "What would you like to explore?"
    );
  }

  // 11. Who are you / Overview / About Matan
  if (
    q.includes("who are you") ||
    q.includes("tell me about yourself") ||
    q.includes("about matan") ||
    q.includes("summary") ||
    q.includes("bio") ||
    q.includes("intro")
  ) {
    return (
      "I'm **Matan Elmaliah**, an AI-driven Frontend & Fullstack Developer based in Tel Aviv. " +
      "Over the last 4 years at Amdocs, I've focused on building scalable web applications, telecom eCommerce checkouts, and analytics telemetry for clients like Altice and 3UK. " +
      "I'm passionate about clean TypeScript architecture, performance optimization, and pragmatic engineering."
    );
  }

  // 12. Default organic response tailored to Matan's CV
  return (
    `I'm Matan, an AI-driven Software Developer with 4 years of enterprise experience at Amdocs building scalable web platforms, telecom checkout flows, and analytics architectures.\n\n` +
    `Feel free to ask me about my **tech stack** (React, Vue, TypeScript, Node.js), my work with **telecom clients (Altice, 3UK)**, or my **availability for new roles**. You can also reach me directly at **matan2288@gmail.com**!`
  );
}

/**
 * Main chat handler for Matan's digital assistant twin.
 * Operates purely on the client side without requiring an Express server.
 */
export const chatWithMatanPersona = async (
  conversationHistory: ChatMessage[],
  userMessage: string
): Promise<string> => {
  const apiKey = getGeminiApiKey();
  const ai = getGeminiClient();

  // If a valid client key is configured (AIza format), attempt generative call
  if (ai && isValidClientApiKey(apiKey)) {
    try {
      const contents = conversationHistory
        .filter((m) => m.text && m.text.trim() && m.id !== "welcome")
        .map((m) => ({
          role: m.role === "model" ? "model" : "user",
          parts: [{ text: m.text }],
        }));

      contents.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction: MATAN_SYSTEM_INSTRUCTION,
          maxOutputTokens: 500,
        },
      });

      const reply = response.text?.trim();
      if (reply) {
        return reply;
      }
    } catch (error) {
      // Gracefully catch any network or proxy issues without crashing or polluting console
      console.info(
        "Using client persona engine (direct Gemini generation fallback activated):",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  // Use the comprehensive local persona engine (smooth, instant, zero server dependencies)
  return generateOfflinePersonaResponse(userMessage, conversationHistory);
};



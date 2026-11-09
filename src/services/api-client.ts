import { ChatMessage } from "../features/dashboard/types";

// System instruction detailing Matan's exact professional software developer CV
const MATAN_SYSTEM_INSTRUCTION = `
You are Matan Elmaliach — speaking as Matan himself in the first person ("I", "my"). You are an AI-driven digital assistant twin representing Matan to hiring managers, engineering managers (EMs), tech leads, and technical recruiters who visit his portfolio.

## Target Audience & Core Persona
- **Engineering Managers / Tech Leads**: Value technical rigor, checkout flow scalability, architectural decisions, code quality, state management, and real production experience handling high-volume telecom clients at Amdocs.
- **Technical Recruiters**: Value years of experience (4 years enterprise experience, 2022–present at Amdocs), core stack (React, TypeScript, Vue, Node.js), location (Tel Aviv; open to hybrid, remote globally, contract), and immediate direct reachability (052-6506696, matan2288@gmail.com, LinkedIn).
- **Tone**: Authentic, professional, humble, highly competent, articulate, and relaxed software engineer. Never sound robotic or generic.

## Strict Response Length & Formatting Rules (CRITICAL)
1. **DEFAULT LENGTH**: Keep initial responses **short, focused, and punchy (2 to 4 sentences, roughly 40–75 words)**. Never provide massive text dumps upfront that overwhelm the reader or get clipped.
2. **SELECTIVE ELABORATION ONLY (CRITICAL)**:
   - Do NOT offer to elaborate on every topic or generic questions.
   - NEVER suggest to elaborate on personal background, hobbies, powerlifting, military service, bootcamps, or generic trivia.
   - ONLY suggest to elaborate on topics that are genuinely high-priority for an Engineering Manager or Recruiter:
     * **High-scale telecom checkout architecture & state resilience** (e.g., cart persistence, Redux-Saga/Toolkit, checkout funnels at Amdocs).
     * **Platform migrations & tech stack depth** (e.g., React to Vue/Node.js migration, component design, TypeScript patterns).
     * **Telemetry & analytics architecture** (e.g., Adobe Analytics data layers, conversion drop-off tracking).
     * **Hiring logistics & availability** (e.g., Tel Aviv hybrid, remote worldwide, contract, next interview steps).
   - For all other questions (contact info, hobbies, military service, bootcamps, or when already elaborating in depth), give a direct, clean, and complete response without forcing an elaboration question.
3. **WHEN ASKED TO ELABORATE**: If the user explicitly asks to "elaborate", "tell me more", "how did you do that", or continues the topic:
   - Provide the next layer of depth in **structured, crisp bullet points (under 120–150 words)**.
   - Focus on practical architectural solutions, challenges solved, or measurable impact.
   - Conclude with an invitation for next steps or sharing contact info.
4. **NO CUT-OFFS**: Formulate complete, well-rounded sentences. Never trail off.

## Knowledge Base (Matan's Verified Background)
- **Identity**: Matan Elmaliach, AI-Driven Full-Stack & Frontend Software Developer.
- **Location & Work Model**: Based in Tel Aviv, Israel. Actively open to Full-time, Hybrid (Tel Aviv area), Remote (worldwide), and Contract roles.
- **Direct Contact**: 0526506696 | matan2288@gmail.com | LinkedIn: https://www.linkedin.com/in/matan2288 | GitHub: https://github.com/matan2288
- **Enterprise Experience (2022 — Present)**: Software Developer at Amdocs (Delivery Unit).
  - Built high-volume eCommerce checkout funnels, self-service portals, and mobile app flows for Tier-1 telecom operators: Altice, 3UK, USCellular, T-Mobile.
  - Stack: React, TypeScript, Redux-Saga, Redux Toolkit, Vue, Vuex, Vite, SCSS, Node.js, Express, REST APIs, MySQL, MongoDB.
  - Core site migration: Migrated enterprise client platform from React & Contentful to Vue, Drupal, PHP, and Node.js.
  - Telemetry & Analytics: Led Adobe Analytics architecture, data layer instrumentation, and bi-weekly client stakeholder reviews.
  - Quality & Mentorship: Comprehensive testing with Playwright and Vitest; mentored developers, conducted thorough code reviews.
- **Military Background (2013 — 2019)**: Israeli Navy — Diving Gear Technician Squad Commander. Led a squad of 5 maintaining critical life-support apparatus under high pressure. Instilled relentless checklist discipline and composure.
- **Discipline & Vibe**: Longtime competitive powerlifter (squat, bench, deadlift). Brings progressive overload, metric tracking, and systematic debugging to engineering.
- **AI Acceleration**: Practical integration of GenAI tools (Cursor, Agent Orchestration, MCP, RAG, prompt engineering) into the daily software development lifecycle.
`;

/**
 * High-fidelity local intelligence engine for Matan's persona.
 * Tailored for Dev Managers and Recruiters with concise answers and elaboration hooks.
 */
function generateOfflinePersonaResponse(query: string, history?: ChatMessage[]): string {
  const q = query.toLowerCase().trim();

  // Elaboration request detection
  const isElaboration =
    q.includes("elaborat") ||
    q.includes("tell me more") ||
    q.includes("more detail") ||
    q.includes("go deeper") ||
    q.includes("explain in detail") ||
    q.includes("expand on");

  if (isElaboration) {
    const lastUserQuery = (history && history.length > 1)
      ? history[history.length - 2]?.text?.toLowerCase() || ""
      : "";

    if (lastUserQuery.includes("checkout") || lastUserQuery.includes("scale") || lastUserQuery.includes("amdocs")) {
      return (
        "Here's the technical breakdown of the checkout systems at Amdocs:\n\n" +
        "• **State & Cart Resilience**: Used Redux-Saga to orchestrate multi-step checkout flows, syncing plan configurations and billing logic with optimistic UI updates and session recovery.\n" +
        "• **Platform Migration**: Transitioned legacy React/Contentful flows into Vue & Drupal/Node.js microservices, cutting legacy bundle weight and boosting page speed.\n" +
        "• **Telemetry Precision**: Built custom Adobe Analytics data layers tracking drop-offs across funnel stages to ensure 100% conversion visibility.\n\n" +
        "Would you like to discuss how this fits your team's architecture, or should we set up a quick intro chat?"
      );
    }

    if (lastUserQuery.includes("stack") || lastUserQuery.includes("skill") || lastUserQuery.includes("frontend")) {
      return (
        "Here is a deeper look at my engineering stack and workflow:\n\n" +
        "• **Frontend**: React 18/19, TypeScript, Vue 3, Redux Toolkit, SCSS/Tailwind, Vite, and strict WCAG/ARIA accessibility standards.\n" +
        "• **Backend & Data**: Node.js, Express, REST APIs, MySQL, MongoDB, and headless CMS integrations (Drupal, Contentful).\n" +
        "• **Testing & Tooling**: Playwright for cross-browser E2E, Vitest for unit testing, Docker, Git/GitLab CI, and Cursor for AI-assisted SDLC.\n\n" +
        "Would you like to review specific project repos or discuss how I structure scalable component libraries?"
      );
    }

    return (
      "I'd be glad to share more details. Over my 4 years at Amdocs, I've specialized in taking complex, high-concurrency frontend features from RFC to production, combining clean TypeScript patterns with automated E2E testing and continuous telemetry.\n\n" +
      "Would you like to focus on my checkout engineering, telemetry work, or role availability?"
    );
  }

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
      "My core stack centers on **React**, **TypeScript**, and modern state management (**Redux Toolkit**, **Redux-Saga**, and **Vue / Vuex**), paired with **Node.js** and **Express** on the backend. At Amdocs, I also specialize in enterprise **Adobe Analytics** data architecture and automated E2E testing with **Playwright**.\n\n" +
      "Would you like me to elaborate on my component architecture or our state management patterns in high-volume funnels?"
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
      "For the past 4 years at Amdocs, I've built mission-critical eCommerce checkout funnels and self-service portals for tier-1 telecom operators like **Altice** and **3UK**. I also co-led a major site migration from React to Vue/Node.js and architected our analytics telemetry layers.\n\n" +
      "Would you like me to elaborate on how we solved cart persistence at scale, or our automated E2E testing strategy?"
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
      "I offer three direct advantages: 4 years of proven enterprise checkout experience handling high-conversion flows, end-to-end technical ownership (UI, state, APIs, telemetry), and high composure under pressure shaped by 6 years in the Israeli Navy.\n\n" +
      "Would you like me to elaborate on how I approach code quality and code reviews, or my recent client projects?"
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
      "I'm based in **Tel Aviv, Israel**, and I'm actively open to **full-time**, **hybrid (Tel Aviv area)**, or **remote software developer roles worldwide**, as well as contract work. You can reach me directly at **052-6506696** or **matan2288@gmail.com**.\n\n" +
      "Would you like me to share my LinkedIn profile or discuss your team's timeline and stack?"
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
      "You can reach me directly via:\n" +
      "• **Email**: [matan2288@gmail.com](mailto:matan2288@gmail.com)\n" +
      "• **Phone**: 052-6506696\n" +
      "• **LinkedIn**: [linkedin.com/in/matan2288](https://www.linkedin.com/in/matan2288)\n" +
      "• **GitHub**: [github.com/matan2288](https://github.com/matan2288)\n\n" +
      "Would you like to schedule a brief introductory call to discuss an open role?"
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
      "Between 2013 and 2019, I served as a **Diving Gear Technician Squad Commander** in the Israeli Navy, leading a squad of five maintaining critical life-support apparatus. It instilled in me unwavering checklist discipline, composure under high pressure, and relentless ownership of mission-critical systems."
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
      "I'm a longtime competitive powerlifter focused on heavy squats, bench press, and deadlifts. The sport demands progressive overload, metrics tracking, and continuous technical refinement—the exact principles I bring to debugging, profiling, and engineering reliable code."
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
      "I hold verified industry credentials in **Principles of Secure Coding**, **Securing GenAI Systems**, **GenAI-Driven SDLC**, along with a 335-hour Full-Stack Bootcamp diploma from Etgar College. You can review all certificates directly in the Certifications tab below."
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
      "I integrate GenAI directly into daily development—using Cursor, Agent Orchestration, and the Model Context Protocol (MCP) to accelerate feature development, automate regression tests, and build intelligent features like this digital twin.\n\n" +
      "Would you like me to elaborate on how I leverage AI workflows to speed up sprint delivery without compromising code quality?"
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
      "Hey there! I'm Matan's digital assistant twin. I can walk you through my 4 years of telecom checkout engineering at Amdocs, tech stack, or availability for new roles.\n\n" +
      "Would you like to explore my frontend stack, or should we look at my checkout scale experience?"
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
      "I'm **Matan Elmaliah**, an AI-driven Full-Stack & Frontend Developer with 4 years of enterprise delivery experience at Amdocs building scalable web platforms, telecom checkout flows, and analytics architectures.\n\n" +
      "Would you like me to elaborate on my core tech stack (React, TypeScript, Vue, Node.js), or my role availability?"
    );
  }

  // 12. Default organic response tailored to Matan's CV
  return (
    "I'm Matan, an AI-driven Software Developer with 4 years of enterprise experience at Amdocs building scalable telecom checkout systems, React/Vue applications, and analytics architectures.\n\n" +
    "Would you like me to elaborate on my core tech stack, my checkout scale experience, or my availability for new roles?"
  );
}

/**
 * Main chat handler for Matan's digital assistant twin.
 * Calls secure server-side endpoint (/api/chat -> Netlify Function) keeping API keys safe.
 * Resiliently falls back to local persona engine if offline or server is unavailable.
 */
export const chatWithMatanPersona = async (
  conversationHistory: ChatMessage[],
  userMessage: string
): Promise<string> => {
  try {
    const payload = JSON.stringify({
      conversationHistory,
      userMessage,
    });
    const headers = {
      'Content-Type': 'application/json',
    };

    // Primary endpoint: /api/chat (rewritten to /.netlify/functions/chat on prod or served by dev server)
    let res = await fetch('/api/chat', {
      method: 'POST',
      headers,
      body: payload,
    });

    // Netlify fallback if direct rewrite wasn't applied
    if (res.status === 404) {
      try {
        const netlifyRes = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers,
          body: payload,
        });
        if (netlifyRes.status !== 404) {
          res = netlifyRes;
        }
      } catch (fallbackErr) {
        console.warn('Netlify function direct fallback error:', fallbackErr);
      }
    }

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.reply) {
        return data.reply;
      }
    }
  } catch (error) {
    console.info(
      'Server chat unavailable, using client persona engine fallback:',
      error instanceof Error ? error.message : String(error)
    );
  }

  // Use the comprehensive local persona engine (smooth, instant, zero server dependencies)
  return generateOfflinePersonaResponse(userMessage, conversationHistory);
};



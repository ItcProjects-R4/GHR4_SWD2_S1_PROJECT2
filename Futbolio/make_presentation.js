import pptxgen from "pptxgenjs";

let pptx = new pptxgen();
pptx.author = "Futbolio Team";
pptx.company = "DEPI Final Project";
pptx.title = "Futbolio - Complete Project Presentation";
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5

// ─── Color Palette ───
const C = {
  bg:       "0F172A",  // deep dark navy
  bgCard:   "1E293B",  // card dark
  accent:   "00E676",  // green accent
  accentDim:"064E3B",  // dark green
  white:    "F8FAFC",
  gray:     "94A3B8",
  red:      "EF4444",
  blue:     "3B82F6",
  yellow:   "F59E0B",
  orange:   "F97316",
  purple:   "A855F7",
};

// ─── Reusable helpers ───
function addSlideNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, { x: 12.2, y: 7.0, w: 1, h: 0.4, color: C.gray, fontSize: 10, align: "right" });
}

function addBottomBar(slide) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.1, w: "100%", h: 0.4, fill: { color: C.bgCard } });
  slide.addText("FUTBOLIO", { x: 0.5, y: 7.1, w: 2, h: 0.4, color: C.accent, fontSize: 11, bold: true });
  slide.addText("DEPI Final Project 2025", { x: 10, y: 7.1, w: 3, h: 0.4, color: C.gray, fontSize: 10, align: "right" });
}

function addSectionHeader(slide, title) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: C.accent } });
  slide.addText(title, { x: 0.6, y: 0.4, w: 10, h: 0.8, fontSize: 32, bold: true, color: C.accent });
  slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.2, w: 3, h: 0.04, fill: { color: C.accent } });
}

function makeCard(slide, x, y, w, h, title, body, iconColor) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: C.bgCard }, line: { color: iconColor || C.accent, width: 1.5 }, rectRadius: 0.1 });
  slide.addText(title, { x: x+0.2, y: y+0.15, w: w-0.4, h: 0.5, fontSize: 15, bold: true, color: iconColor || C.accent });
  slide.addText(body, { x: x+0.2, y: y+0.65, w: w-0.4, h: h-0.9, fontSize: 12, color: C.white, lineSpacing: 18 });
}

const TOTAL = 14;

// ═══════════════════════════════════════════════════════
// SLIDE 1: TITLE
// ═══════════════════════════════════════════════════════
let s1 = pptx.addSlide();
s1.background = { color: C.bg };
// Big green circle accent
s1.addShape(pptx.ShapeType.ellipse, { x: -2, y: -2, w: 8, h: 8, fill: { color: C.accentDim } });
s1.addShape(pptx.ShapeType.ellipse, { x: 9, y: 4, w: 6, h: 6, fill: { color: C.accentDim } });
s1.addText("FUTBOLIO", { x: 2, y: 2.0, w: 9, h: 1.5, fontSize: 72, bold: true, color: C.accent, align: "center" });
s1.addText("The Ultimate Football Experience", { x: 2, y: 3.5, w: 9, h: 0.8, fontSize: 28, color: C.white, align: "center" });
s1.addShape(pptx.ShapeType.rect, { x: 5, y: 4.5, w: 3, h: 0.04, fill: { color: C.accent } });
s1.addText("DEPI Final Project Presentation", { x: 2, y: 4.8, w: 9, h: 0.5, fontSize: 16, color: C.gray, align: "center", italic: true });
s1.addText("June 2025", { x: 2, y: 5.4, w: 9, h: 0.5, fontSize: 14, color: C.gray, align: "center" });
addSlideNumber(s1, 1, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 2: AGENDA
// ═══════════════════════════════════════════════════════
let s2 = pptx.addSlide();
s2.background = { color: C.bg };
addSectionHeader(s2, "Agenda");
const agenda = [
  "Project Overview & Motivation",
  "System Architecture & Tech Stack",
  "Core Pages & Features Walkthrough",
  "Data Visualization & Charts",
  "AI Chatbot Integration",
  "Challenges & Solutions",
  "Caching & Fallback System",
  "Project Structure & Code Quality",
  "Team Members",
  "Live Demo & Q&A",
];
agenda.forEach((item, i) => {
  const yPos = 1.6 + i * 0.5;
  s2.addShape(pptx.ShapeType.rect, { x: 1.0, y: yPos, w: 0.35, h: 0.35, fill: { color: C.accent }, line: { color: C.accent } });
  s2.addText(`${i + 1}`, { x: 1.0, y: yPos, w: 0.35, h: 0.35, fontSize: 12, bold: true, color: C.bg, align: "center" });
  s2.addText(item, { x: 1.6, y: yPos, w: 8, h: 0.35, fontSize: 16, color: C.white });
});
addBottomBar(s2);
addSlideNumber(s2, 2, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 3: PROJECT OVERVIEW
// ═══════════════════════════════════════════════════════
let s3 = pptx.addSlide();
s3.background = { color: C.bg };
addSectionHeader(s3, "Project Overview");
s3.addText("What is Futbolio?", { x: 0.6, y: 1.5, w: 6, h: 0.6, fontSize: 22, bold: true, color: C.white });
s3.addText([
  { text: "A modern, responsive web application designed for football enthusiasts worldwide.", options: { bullet: true, breakLine: true } },
  { text: "Provides real-time match scores, league standings, detailed team & player statistics.", options: { bullet: true, breakLine: true } },
  { text: "Features advanced data visualization (charts, radar diagrams) for in-depth analysis.", options: { bullet: true, breakLine: true } },
  { text: "Integrates an AI-powered chatbot (Futbolio AI) to answer football questions instantly.", options: { bullet: true, breakLine: true } },
  { text: "Covers 25+ leagues globally including EPL, La Liga, Serie A, Bundesliga, UCL, and the Egyptian Premier League.", options: { bullet: true, breakLine: true } },
], { x: 0.8, y: 2.2, w: 6.5, h: 3.5, fontSize: 15, color: C.white, lineSpacing: 22 });

// Right side: Key stats boxes
makeCard(s3, 8.0, 1.5, 4.5, 1.2, "10 Pages", "Fully designed and functional, each with a unique purpose", C.blue);
makeCard(s3, 8.0, 3.0, 4.5, 1.2, "25+ Leagues", "Covering the biggest domestic and international competitions", C.yellow);
makeCard(s3, 8.0, 4.5, 4.5, 1.2, "AI Chatbot", "Groq-powered LLaMA 3.3 model for real-time Q&A", C.purple);
addBottomBar(s3);
addSlideNumber(s3, 3, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 4: ARCHITECTURE DIAGRAM
// ═══════════════════════════════════════════════════════
let s4 = pptx.addSlide();
s4.background = { color: C.bg };
addSectionHeader(s4, "System Architecture");

// Draw architecture boxes
const archBoxes = [
  { label: "React + Vite\n(Frontend)", x: 5, y: 2.0, w: 3, h: 1.2, color: C.blue },
  { label: "API Service\n(Axios + Cache)", x: 5, y: 3.8, w: 3, h: 1.2, color: C.accent },
  { label: "API-Sports\n(Football Data)", x: 1.0, y: 3.8, w: 3, h: 1.2, color: C.orange },
  { label: "Groq API\n(AI Chatbot)", x: 9.0, y: 3.8, w: 3, h: 1.2, color: C.purple },
  { label: "LocalStorage\n(Cache + Favorites)", x: 5, y: 5.6, w: 3, h: 1.2, color: C.yellow },
];
archBoxes.forEach(b => {
  s4.addShape(pptx.ShapeType.roundRect, { x: b.x, y: b.y, w: b.w, h: b.h, fill: { color: C.bgCard }, line: { color: b.color, width: 2 }, rectRadius: 0.1 });
  s4.addText(b.label, { x: b.x, y: b.y, w: b.w, h: b.h, fontSize: 13, bold: true, color: b.color, align: "center", valign: "middle" });
});

// Draw arrows (using lines)
// React -> API Service
s4.addShape(pptx.ShapeType.line, { x: 6.5, y: 3.2, w: 0, h: 0.6, line: { color: C.gray, width: 2 } });
// API Service -> API-Sports
s4.addShape(pptx.ShapeType.line, { x: 4.0, y: 4.4, w: 1.0, h: 0, line: { color: C.gray, width: 2 } });
// React -> Groq
s4.addShape(pptx.ShapeType.line, { x: 8.0, y: 4.4, w: 1.0, h: 0, line: { color: C.gray, width: 2 } });
// API Service -> LocalStorage
s4.addShape(pptx.ShapeType.line, { x: 6.5, y: 5.0, w: 0, h: 0.6, line: { color: C.gray, width: 2 } });

s4.addText("Data flows through a centralized API Service with a 3-layer strategy:\nFresh Cache > API Call > Stale Cache Fallback", 
  { x: 0.6, y: 1.5, w: 12, h: 0.5, fontSize: 13, color: C.gray, italic: true });
addBottomBar(s4);
addSlideNumber(s4, 4, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 5: TECH STACK
// ═══════════════════════════════════════════════════════
let s5 = pptx.addSlide();
s5.background = { color: C.bg };
addSectionHeader(s5, "Technology Stack");

const techItems = [
  { cat: "Frontend Framework", val: "React 19 + Vite 8", color: C.blue },
  { cat: "Routing", val: "React Router v7", color: C.blue },
  { cat: "HTTP Client", val: "Axios (with custom interceptors)", color: C.accent },
  { cat: "Football API", val: "API-Sports (api-football.com)", color: C.accent },
  { cat: "AI / Chatbot", val: "Groq Cloud API (LLaMA 3.3 70B)", color: C.purple },
  { cat: "Data Visualization", val: "Recharts (Radar, Area, Bar charts)", color: C.yellow },
  { cat: "Styling", val: "Custom CSS + Bootstrap Grid + CSS Variables", color: C.orange },
  { cat: "State Management", val: "React Context API (Favorites)", color: C.red },
  { cat: "Caching", val: "LocalStorage with TTL-based expiry", color: C.accent },
  { cat: "Build Tool", val: "Vite (HMR, ESBuild, optimized bundles)", color: C.blue },
];
techItems.forEach((item, i) => {
  const yPos = 1.5 + i * 0.52;
  s5.addShape(pptx.ShapeType.rect, { x: 0.8, y: yPos, w: 0.1, h: 0.35, fill: { color: item.color } });
  s5.addText(item.cat, { x: 1.1, y: yPos, w: 4, h: 0.4, fontSize: 14, bold: true, color: C.white });
  s5.addText(item.val, { x: 5.5, y: yPos, w: 7, h: 0.4, fontSize: 14, color: C.gray });
});
addBottomBar(s5);
addSlideNumber(s5, 5, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 6: PAGES OVERVIEW (Part 1)
// ═══════════════════════════════════════════════════════
let s6 = pptx.addSlide();
s6.background = { color: C.bg };
addSectionHeader(s6, "Core Pages (1/2)");

makeCard(s6, 0.6, 1.5, 3.8, 2.5, "Home Page", 
  "- Hero section with live date\n- Top matches carousel\n- Featured leagues grid\n- Clickable team logos\n- Status badges (LIVE, FT, NS)", C.accent);

makeCard(s6, 4.7, 1.5, 3.8, 2.5, "Matches Page",
  "- Full match schedule by date\n- Date picker navigation\n- Filter by league\n- Live score indicators\n- Click to view match details", C.blue);

makeCard(s6, 8.8, 1.5, 3.8, 2.5, "Match Details",
  "- Full match stats comparison\n- Event timeline (goals, cards)\n- Head-to-head history\n- Line-ups and formations\n- Real-time score updates", C.orange);

makeCard(s6, 0.6, 4.3, 3.8, 2.5, "Leagues List",
  "- 25+ leagues & competitions\n- Beautiful card grid layout\n- Organized: Top 7 + Explore More\n- Quick navigation to any league", C.yellow);

makeCard(s6, 4.7, 4.3, 3.8, 2.5, "League Page",
  "- League standings table\n- Top scorers & assists tables\n- Recent & upcoming fixtures\n- Team navigation from table", C.purple);

makeCard(s6, 8.8, 4.3, 3.8, 2.5, "Search Page",
  "- Dual search: Teams + Players\n- Real-time API search\n- Result cards with navigation\n- Fallback demo results", C.red);

addBottomBar(s6);
addSlideNumber(s6, 6, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 7: PAGES OVERVIEW (Part 2)
// ═══════════════════════════════════════════════════════
let s7 = pptx.addSlide();
s7.background = { color: C.bg };
addSectionHeader(s7, "Core Pages (2/2)");

makeCard(s7, 0.6, 1.5, 3.8, 2.5, "Team Profile",
  "- Team info & venue details\n- Win/Draw/Loss record\n- Squad list with player links\n- Goals by time interval chart\n- Formation & clean sheets data", C.accent);

makeCard(s7, 4.7, 1.5, 3.8, 2.5, "Player Profile",
  "- Full player biography\n- Season statistics breakdown\n- Radar chart (skills overview)\n- Career performance area chart\n- Rating and position details", C.blue);

makeCard(s7, 8.8, 1.5, 3.8, 2.5, "Compare Page",
  "- Side-by-side team comparison\n- Select any two teams\n- Stats comparison bars\n- Visual percentage breakdown\n- Head-to-head recent matches", C.orange);

makeCard(s7, 2.6, 4.3, 3.8, 2.5, "Favorites Page",
  "- Save favorite teams/players\n- Persistent via LocalStorage\n- Quick access to saved items\n- Toggle favorite with one click\n- Separate tabs for categories", C.red);

makeCard(s7, 6.7, 4.3, 3.8, 2.5, "AI Chatbot (Global)",
  "- Floating button on all pages\n- Football-exclusive knowledge\n- Arabic + English support\n- Powered by Groq LLaMA 3.3\n- Knows the developer team!", C.purple);

addBottomBar(s7);
addSlideNumber(s7, 7, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 8: DATA VISUALIZATION
// ═══════════════════════════════════════════════════════
let s8 = pptx.addSlide();
s8.background = { color: C.bg };
addSectionHeader(s8, "Data Visualization");
s8.addText("We used Recharts to build interactive, responsive charts that give deep insights into team & player performance.",
  { x: 0.6, y: 1.5, w: 12, h: 0.5, fontSize: 14, color: C.gray, italic: true });

// Chart type cards
makeCard(s8, 0.6, 2.3, 3.8, 2.0, "Area Chart", "Goals by 15-minute interval\nShows team scoring patterns\nacross different halves", C.accent);
makeCard(s8, 4.7, 2.3, 3.8, 2.0, "Radar Chart", "Player skill comparison:\nPace, Shooting, Passing,\nDribbling, Defending, Physical", C.blue);
makeCard(s8, 8.8, 2.3, 3.8, 2.0, "Bar Chart", "Win/Draw/Loss distribution\nHome vs Away performance\nComparison stats", C.orange);

// Additional info
s8.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 4.8, w: 12, h: 2, fill: { color: C.bgCard }, line: { color: C.accent, width: 1 }, rectRadius: 0.1 });
s8.addText("Key Design Decisions", { x: 0.9, y: 4.9, w: 5, h: 0.5, fontSize: 16, bold: true, color: C.accent });
s8.addText([
  { text: "Responsive containers that adapt to any screen size using ResponsiveContainer", options: { bullet: true, breakLine: true } },
  { text: "Custom color palette matching the site's dark theme (green accent on dark navy)", options: { bullet: true, breakLine: true } },
  { text: "Tooltips and hover effects for interactive data exploration", options: { bullet: true, breakLine: true } },
  { text: "Gradient fills on area charts for modern aesthetic appeal", options: { bullet: true, breakLine: true } },
], { x: 0.9, y: 5.4, w: 11, h: 1.3, fontSize: 13, color: C.white, lineSpacing: 18 });
addBottomBar(s8);
addSlideNumber(s8, 8, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 9: AI CHATBOT DEEP DIVE
// ═══════════════════════════════════════════════════════
let s9 = pptx.addSlide();
s9.background = { color: C.bg };
addSectionHeader(s9, "Futbolio AI - Chatbot");

// Left: Details
s9.addText([
  { text: "How it Works:\n", options: { bold: true, color: C.accent, fontSize: 16 } },
  { text: "1. User types a question in the chat window\n", options: { breakLine: true } },
  { text: "2. Message is sent to Groq Cloud API via fetch()\n", options: { breakLine: true } },
  { text: "3. LLaMA 3.3 70B processes with a System Prompt\n", options: { breakLine: true } },
  { text: "4. Response is streamed back in under 1 second\n\n", options: { breakLine: true } },
  { text: "System Prompt Rules:\n", options: { bold: true, color: C.accent, fontSize: 16 } },
  { text: "- ONLY answers football-related questions\n", options: { breakLine: true } },
  { text: "- Politely declines non-football topics\n", options: { breakLine: true } },
  { text: "- Supports Arabic + English fluently\n", options: { breakLine: true } },
  { text: "- Knows the developer team names\n", options: { breakLine: true } },
  { text: "- No emojis, professional tone\n", options: { breakLine: true } },
], { x: 0.6, y: 1.5, w: 6, h: 5, fontSize: 14, color: C.white, lineSpacing: 20 });

// Right: Mockup of chat
s9.addShape(pptx.ShapeType.roundRect, { x: 7.5, y: 1.5, w: 5, h: 5.2, fill: { color: C.bgCard }, line: { color: "374151", width: 1.5 }, rectRadius: 0.15 });
// Header
s9.addShape(pptx.ShapeType.rect, { x: 7.5, y: 1.5, w: 5, h: 0.7, fill: { color: "111827" } });
s9.addText("Futbolio AI  |  Football Expert", { x: 7.7, y: 1.5, w: 4.6, h: 0.7, fontSize: 12, bold: true, color: C.accent });
// Messages
s9.addShape(pptx.ShapeType.roundRect, { x: 9.5, y: 2.5, w: 2.7, h: 0.6, fill: { color: C.accent }, rectRadius: 0.1 });
s9.addText("Who is the top scorer in WC 2022?", { x: 9.6, y: 2.5, w: 2.5, h: 0.6, fontSize: 10, color: C.bg });
s9.addShape(pptx.ShapeType.roundRect, { x: 7.8, y: 3.4, w: 3.5, h: 1.0, fill: { color: "111827" }, rectRadius: 0.1 });
s9.addText("Kylian Mbappe is the top scorer\nof FIFA World Cup 2022 with\n8 goals for France.", { x: 7.9, y: 3.4, w: 3.3, h: 1.0, fontSize: 10, color: C.white });
s9.addShape(pptx.ShapeType.roundRect, { x: 9.5, y: 4.7, w: 2.7, h: 0.6, fill: { color: C.accent }, rectRadius: 0.1 });
s9.addText("How to make a cake?", { x: 9.6, y: 4.7, w: 2.5, h: 0.6, fontSize: 10, color: C.bg });
s9.addShape(pptx.ShapeType.roundRect, { x: 7.8, y: 5.6, w: 3.5, h: 0.8, fill: { color: "111827" }, rectRadius: 0.1 });
s9.addText("Sorry, I can only help with\nfootball-related questions!", { x: 7.9, y: 5.6, w: 3.3, h: 0.8, fontSize: 10, color: C.red });

addBottomBar(s9);
addSlideNumber(s9, 9, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 10: CHALLENGES & SOLUTIONS
// ═══════════════════════════════════════════════════════
let s10 = pptx.addSlide();
s10.background = { color: C.bg };
addSectionHeader(s10, "Challenges & Solutions");

// Challenge 1
s10.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 1.5, w: 5.8, h: 2.5, fill: { color: C.bgCard }, line: { color: C.red, width: 2 }, rectRadius: 0.1 });
s10.addText("CHALLENGE", { x: 0.8, y: 1.6, w: 2, h: 0.4, fontSize: 10, bold: true, color: C.red });
s10.addText("API Rate Limits & Account Suspension", { x: 0.8, y: 2.0, w: 5.3, h: 0.5, fontSize: 16, bold: true, color: C.white });
s10.addText("The API-Sports free tier has strict rate limits (100 requests/day). Our account was suspended multiple times during development, leaving the entire app with no data to display.", 
  { x: 0.8, y: 2.6, w: 5.3, h: 1.2, fontSize: 12, color: C.gray, lineSpacing: 18 });

s10.addShape(pptx.ShapeType.roundRect, { x: 6.8, y: 1.5, w: 5.8, h: 2.5, fill: { color: C.bgCard }, line: { color: C.accent, width: 2 }, rectRadius: 0.1 });
s10.addText("SOLUTION", { x: 7.0, y: 1.6, w: 2, h: 0.4, fontSize: 10, bold: true, color: C.accent });
s10.addText("3-Layer Fallback System", { x: 7.0, y: 2.0, w: 5.3, h: 0.5, fontSize: 16, bold: true, color: C.white });
s10.addText("1. Fresh Cache (LocalStorage with 15-min TTL)\n2. Live API call (if cache expired)\n3. Stale Cache fallback (returns old data if API fails)\n4. Static Demo Data (hardcoded fallback as last resort)", 
  { x: 7.0, y: 2.6, w: 5.3, h: 1.2, fontSize: 12, color: C.gray, lineSpacing: 18 });

// Challenge 2 (Merged)
s10.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 4.3, w: 5.8, h: 2.5, fill: { color: C.bgCard }, line: { color: C.red, width: 2 }, rectRadius: 0.1 });
s10.addText("CHALLENGE", { x: 0.8, y: 4.4, w: 2, h: 0.4, fontSize: 10, bold: true, color: C.red });
s10.addText("Integrating Member's Codebase", { x: 0.8, y: 4.8, w: 5.3, h: 0.5, fontSize: 16, bold: true, color: C.white });
s10.addText("Merging standalone components (Team & Player Profiles) caused style conflicts, broken API calls, and duplicate code since they used their own API layers and CSS files.", 
  { x: 0.8, y: 5.4, w: 5.3, h: 1.2, fontSize: 12, color: C.gray, lineSpacing: 18 });

s10.addShape(pptx.ShapeType.roundRect, { x: 6.8, y: 4.3, w: 5.8, h: 2.5, fill: { color: C.bgCard }, line: { color: C.accent, width: 2 }, rectRadius: 0.1 });
s10.addText("SOLUTION", { x: 7.0, y: 4.4, w: 2, h: 0.4, fontSize: 10, bold: true, color: C.accent });
s10.addText("Refactored & Unified Architecture", { x: 7.0, y: 4.8, w: 5.3, h: 0.5, fontSize: 16, bold: true, color: C.white });
s10.addText("- Rewired API calls to use the central ApiService\n- Created a dedicated profile.css to isolate styles\n- Unified routing through App.jsx", 
  { x: 7.0, y: 5.4, w: 5.3, h: 1.2, fontSize: 12, color: C.gray, lineSpacing: 18 });

addBottomBar(s10);
addSlideNumber(s10, 10, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 12: CACHING FLOW DIAGRAM
// ═══════════════════════════════════════════════════════
let s12 = pptx.addSlide();
s12.background = { color: C.bg };
addSectionHeader(s12, "Caching & Fallback Flow");

// Flowchart
const flowBoxes = [
  { label: "User Request", x: 5.2, y: 1.5, w: 2.8, h: 0.8, color: C.blue },
  { label: "Cache\nFresh?", x: 5.2, y: 2.8, w: 2.8, h: 0.9, color: C.yellow },
  { label: "Return\nCached Data", x: 9.5, y: 2.8, w: 2.5, h: 0.9, color: C.accent },
  { label: "Call API", x: 5.2, y: 4.2, w: 2.8, h: 0.8, color: C.orange },
  { label: "Success?\nSave to Cache", x: 5.2, y: 5.5, w: 2.8, h: 0.9, color: C.accent },
  { label: "Return Stale\nCache Data", x: 9.5, y: 5.5, w: 2.5, h: 0.9, color: C.yellow },
  { label: "Return Static\nDemo Data", x: 1.0, y: 5.5, w: 2.5, h: 0.9, color: C.red },
];
flowBoxes.forEach(b => {
  s12.addShape(pptx.ShapeType.roundRect, { x: b.x, y: b.y, w: b.w, h: b.h, fill: { color: C.bgCard }, line: { color: b.color, width: 2 }, rectRadius: 0.1 });
  s12.addText(b.label, { x: b.x, y: b.y, w: b.w, h: b.h, fontSize: 12, bold: true, color: b.color, align: "center", valign: "middle" });
});

// Arrows
s12.addShape(pptx.ShapeType.line, { x: 6.6, y: 2.3, w: 0, h: 0.5, line: { color: C.gray, width: 1.5 } });
s12.addShape(pptx.ShapeType.line, { x: 8.0, y: 3.25, w: 1.5, h: 0, line: { color: C.gray, width: 1.5 } });
s12.addText("YES", { x: 8.2, y: 2.9, w: 0.8, h: 0.3, fontSize: 9, color: C.accent, bold: true });
s12.addShape(pptx.ShapeType.line, { x: 6.6, y: 3.7, w: 0, h: 0.5, line: { color: C.gray, width: 1.5 } });
s12.addText("NO", { x: 5.2, y: 3.8, w: 0.8, h: 0.3, fontSize: 9, color: C.red, bold: true });
s12.addShape(pptx.ShapeType.line, { x: 6.6, y: 5.0, w: 0, h: 0.5, line: { color: C.gray, width: 1.5 } });
s12.addShape(pptx.ShapeType.line, { x: 8.0, y: 5.95, w: 1.5, h: 0, line: { color: C.gray, width: 1.5 } });
s12.addText("FAIL", { x: 8.2, y: 5.6, w: 0.8, h: 0.3, fontSize: 9, color: C.red, bold: true });
s12.addShape(pptx.ShapeType.line, { x: 3.5, y: 5.95, w: 1.7, h: 0, line: { color: C.gray, width: 1.5 } });
s12.addText("NO STALE", { x: 3.5, y: 5.6, w: 1.5, h: 0.3, fontSize: 9, color: C.red, bold: true });

addBottomBar(s12);
addSlideNumber(s12, 11, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 13: PROJECT STRUCTURE
// ═══════════════════════════════════════════════════════
let s13 = pptx.addSlide();
s13.background = { color: C.bg };
addSectionHeader(s13, "Project Structure");

s13.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 1.5, w: 5.5, h: 5.2, fill: { color: C.bgCard }, line: { color: "374151", width: 1 }, rectRadius: 0.1 });
const tree = [
  "football_stats/",
  "  src/",
  "    components/",
  "      Chatbot.jsx       (AI chatbot)",
  "      Navbar.jsx        (Navigation bar)",
  "      Footer.jsx        (Footer)",
  "      Loader.jsx        (Loading spinner)",
  "      cards/            (Reusable cards)",
  "    pages/",
  "      HomePage.jsx      (Main landing)",
  "      MatchesPage.jsx   (All matches)",
  "      MatchDetailsPage  (Single match)",
  "      LeaguesListPage   (Leagues grid)",
  "      LeaguePage.jsx    (League detail)",
  "      TeamPage.jsx      (Team profile)",
  "      PlayerPage.jsx    (Player profile)",
  "      ComparePage.jsx   (Team compare)",
  "      SearchPage.jsx    (Search)",
  "      FavoritesPage.jsx (Saved items)",
  "    services/",
  "      apiService.js     (Axios + Cache)",
  "      cacheService.js   (LocalStorage)",
  "      footballApiService (API endpoints)",
  "    context/",
  "      FavoritesContext   (State mgmt)",
];
s13.addText(tree.join("\n"), { x: 0.8, y: 1.6, w: 5.2, h: 5, fontSize: 10.5, color: C.white, fontFace: "Courier New", lineSpacing: 14 });

// Right side: metrics
makeCard(s13, 7, 1.5, 5.5, 1.3, "Lines of Code", "11 Pages  |  4 Components  |  3 Services\n1 Context  |  2 CSS Files  |  1 Constants File", C.accent);
makeCard(s13, 7, 3.2, 5.5, 1.3, "Design System", "CSS Variables for consistent theming\nDark mode with green accent palette\nResponsive layout with Bootstrap grid", C.blue);
makeCard(s13, 7, 4.9, 5.5, 1.3, "Code Quality", "Modular component architecture\nSeparation of concerns (services/pages)\nNo prop drilling (Context API)", C.purple);
addBottomBar(s13);
addSlideNumber(s13, 12, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 14: TEAM MEMBERS
// ═══════════════════════════════════════════════════════
let s14 = pptx.addSlide();
s14.background = { color: C.bg };
s14.addShape(pptx.ShapeType.ellipse, { x: -1, y: -1, w: 5, h: 5, fill: { color: C.accentDim } });
s14.addShape(pptx.ShapeType.ellipse, { x: 10, y: 5, w: 5, h: 5, fill: { color: C.accentDim } });
s14.addText("Meet The Team", { x: 0, y: 0.6, w: "100%", h: 0.8, fontSize: 36, bold: true, color: C.accent, align: "center" });
s14.addShape(pptx.ShapeType.rect, { x: 5.5, y: 1.4, w: 2, h: 0.04, fill: { color: C.accent } });

const members = [
  { name: "Omar Lokma", role: "Lead Developer" },
  { name: "Essam Hany", role: "Developer" },
  { name: "Yousef Amer", role: "Developer" },
  { name: "Basmala Shalaby", role: "Developer" },
];
members.forEach((m, i) => {
  const xPos = 1.0 + i * 3.0;
  // Card
  s14.addShape(pptx.ShapeType.roundRect, { x: xPos, y: 2.5, w: 2.8, h: 3.0, fill: { color: C.bgCard }, line: { color: C.accent, width: 1.5 }, rectRadius: 0.15 });
  // Avatar circle
  s14.addShape(pptx.ShapeType.ellipse, { x: xPos + 0.65, y: 2.8, w: 1.5, h: 1.5, fill: { color: C.accentDim }, line: { color: C.accent, width: 2 } });
  s14.addText(m.name.split(" ").map(n => n[0]).join(""), { x: xPos + 0.65, y: 2.8, w: 1.5, h: 1.5, fontSize: 24, bold: true, color: C.accent, align: "center" });
  // Name
  s14.addText(m.name, { x: xPos, y: 4.5, w: 2.8, h: 0.5, fontSize: 15, bold: true, color: C.white, align: "center" });
  s14.addText(m.role, { x: xPos, y: 4.9, w: 2.8, h: 0.4, fontSize: 12, color: C.gray, align: "center" });
});
addBottomBar(s14);
addSlideNumber(s14, 13, TOTAL);

// ═══════════════════════════════════════════════════════
// SLIDE 15: THANK YOU + Q&A
// ═══════════════════════════════════════════════════════
let s15 = pptx.addSlide();
s15.background = { color: C.bg };
s15.addShape(pptx.ShapeType.ellipse, { x: 3, y: 0, w: 7, h: 7, fill: { color: C.accentDim } });
s15.addText("Thank You!", { x: 0, y: 2.0, w: "100%", h: 1.2, fontSize: 60, bold: true, color: C.accent, align: "center" });
s15.addShape(pptx.ShapeType.rect, { x: 5.2, y: 3.3, w: 2.5, h: 0.04, fill: { color: C.accent } });
s15.addText("Questions & Live Demo", { x: 0, y: 3.6, w: "100%", h: 0.8, fontSize: 28, color: C.white, align: "center" });
s15.addText("We're ready to show you Futbolio in action!", { x: 0, y: 4.5, w: "100%", h: 0.5, fontSize: 16, color: C.gray, align: "center", italic: true });
s15.addText("Omar Lokma  |  Essam Hany  |  Yousef Amer  |  Basmala Shalaby", { x: 0, y: 5.8, w: "100%", h: 0.5, fontSize: 14, color: C.accent, align: "center" });
addSlideNumber(s15, 14, TOTAL);

// ═══════════════════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════════════════
pptx.writeFile({ fileName: "Futbolio_Presentation.pptx" }).then(fileName => {
  console.log("Presentation created successfully: " + fileName);
});

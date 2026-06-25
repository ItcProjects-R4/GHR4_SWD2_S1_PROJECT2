import React, { useState, useEffect, useRef } from 'react';

// Initialize the API only if the key exists
const apiKey = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = "You are 'Futbolio Assistant', an AI expert in football (soccer). You must ONLY answer questions related to football. However, there is ONE EXCEPTION: If the user asks who created, built, or developed this website/bot, you MUST proudly state that the website was developed by an amazing team of developers: Omar Lokma, Essam Hany, Yousef Amer, and Basmala Shalaby. If the user asks about ANY other non-football topic, politely decline and remind them that you only talk about football. Speak in a friendly, professional tone. DO NOT use any emojis in your responses. Support Arabic and English depending on the user's language. Keep answers concise.";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "أهلاً بيك! أنا المساعد الذكي لـ Futbolio، إسألني أي حاجة عن الكورة!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userText, sender: 'user' }]);

    if (!apiKey) {
      setMessages(prev => [...prev, { text: "عفواً، الـ API Key الخاص بـ Groq غير متوفر في ملف .env", sender: 'bot' }]);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare history format for Groq (OpenAI compatible)
      const history = messages.slice(1).map(m => ({
        role: m.sender === 'bot' ? 'assistant' : 'user',
        content: m.text
      }));

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Much smarter model for better Arabic & accuracy
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history,
            { role: "user", content: userText }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.choices[0].message.content;

      setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { text: "حصلت مشكلة في الاتصال، تأكد من صحة الـ API Key وحاول تاني.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={toggleChat}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
          width: 60, height: 60, borderRadius: '50%',
          background: 'var(--accent-green)', color: '#000',
          border: 'none', boxShadow: '0 4px 12px rgba(0,230,118,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? (
          <i className="bi bi-x-lg" style={{ fontSize: '1.5rem' }}></i>
        ) : (
          <i className="bi bi-robot" style={{ fontSize: '1.8rem' }}></i>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 90, right: 20, zIndex: 9998,
          width: 350, height: 500, maxHeight: '80vh', background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              <i className="bi bi-lightning-fill"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Futbolio AI</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                Football Expert <i className="bi bi-patch-check-fill"></i>
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', padding: '10px 14px', borderRadius: '16px',
                background: msg.sender === 'user' ? 'var(--accent-green)' : 'var(--bg-secondary)',
                color: msg.sender === 'user' ? '#000' : '#e2e8f0',
                fontSize: '0.9rem', lineHeight: 1.5,
                borderBottomRightRadius: msg.sender === 'user' ? 4 : 16,
                borderBottomLeftRadius: msg.sender === 'bot' ? 4 : 16,
                direction: /[\u0600-\u06FF]/.test(msg.text) ? 'rtl' : 'ltr',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: '16px', borderBottomLeftRadius: 4 }}>
                <span className="spinner-grow spinner-grow-sm text-success mx-1" role="status" style={{width: '0.5rem', height: '0.5rem'}}></span>
                <span className="spinner-grow spinner-grow-sm text-success mx-1" role="status" style={{width: '0.5rem', height: '0.5rem'}}></span>
                <span className="spinner-grow spinner-grow-sm text-success mx-1" role="status" style={{width: '0.5rem', height: '0.5rem'}}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{
            padding: '12px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)',
            display: 'flex', gap: '8px'
          }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about football..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1px solid var(--border)',
                background: 'var(--bg-card)', color: '#fff', outline: 'none', fontSize: '0.9rem',
                direction: /[\u0600-\u06FF]/.test(input) ? 'rtl' : 'ltr'
              }}
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              style={{
                width: 40, height: 40, borderRadius: '50%', background: input.trim() && !isLoading ? 'var(--accent-green)' : 'var(--border)',
                color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !isLoading ? 'pointer' : 'default'
              }}
            >
              <i className="bi bi-send-fill"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minus, Trash2, Zap, Film, Crown, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import MovieCard from './MovieCard';
import { useAuth } from '../../context/AuthContext';
import './Chatbox.css';

const Chatbox = () => {
    const { token, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    // Load history when chatbox opens
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            fetchHistory();
        }
    }, [isOpen]);

    const fetchHistory = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/ai/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setMessages(data.history);
            }
        } catch (err) {
            console.error("Lỗi lấy lịch sử chat:", err);
        }
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:3000/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            // Add an empty assistant message to start streaming into
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6).trim();
                        if (dataStr === '[DONE]') break;
                        if (dataStr === '[ERROR]') throw new Error('AI Error');

                        try {
                            const data = JSON.parse(dataStr);
                            if (data.content) {
                                assistantMessage += data.content;
                                // Update the last message (the assistant's one)
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    newMessages[newMessages.length - 1].content = assistantMessage;
                                    return newMessages;
                                });
                            }
                        } catch (e) {
                            // Ignore parse errors for partial chunks
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Lỗi chat:", err);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.' }]);
        } finally {
            setLoading(false);
            setIsTyping(false);
        }
    };

    const clearHistory = async () => {
        if (!window.confirm("Bạn có chắc muốn xóa lịch sử trò chuyện?")) return;
        try {
            await fetch('http://localhost:3000/api/ai/history', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages([]);
        } catch (err) {
            console.error("Lỗi xóa lịch sử:", err);
        }
    };

    const quickAction = (text) => {
        setInput(text);
        if (inputRef.current) inputRef.current.focus();
    };

    return (
        <div className="chatbox-container">
            {!isOpen ? (
                <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={28} />
                </button>
            ) : (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="bot-info">
                            <div className="bot-avatar">
                                <Sparkles size={20} color="white" />
                            </div>
                            <div>
                                <div className="bot-name">AI Assistant</div>
                                <div className="bot-status"><div className="status-dot"></div> Online</div>
                            </div>
                        </div>
                        <div className="chat-actions">
                            <button className="icon-btn" onClick={clearHistory} title="Xóa lịch sử">
                                <Trash2 size={16} color="#9ca3af" />
                            </button>
                            <button className="icon-btn" onClick={() => setIsOpen(false)}>
                                <Minus size={18} color="#9ca3af" />
                            </button>
                            <button className="icon-btn" onClick={() => setIsOpen(false)}>
                                <X size={18} color="#9ca3af" />
                            </button>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="welcome-msg">
                                <div className="welcome-icon"><Crown size={40} color="#fbbf24" /></div>
                                <h3>Chào bạn {user?.name || 'mới'}!</h3>
                                <p>Tôi là trợ lý ảo sẵn sàng hỗ trợ bạn tìm phim và nâng cấp VIP. Hãy hỏi tôi bất cứ điều gì!</p>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <ChatMessage key={i} role={m.role} content={m.content} />
                        ))}
                        {isTyping && (
                            <div className="message assistant typing">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="quick-actions">
                        <button className="quick-btn" onClick={() => quickAction("🎬 Phim hay hôm nay")}>🎬 Phim hay</button>
                        <button className="quick-btn" onClick={() => quickAction("🔥 Phim đang hot")}>🔥 Phim hot</button>
                        <button className="quick-btn" onClick={() => quickAction("👑 Tìm hiểu VIP")}>👑 Gói VIP</button>
                        <button className="quick-btn" onClick={() => quickAction("🔍 Tìm phim hành động")}>🔍 Phim hành động</button>
                    </div>

                    <form className="chat-input-area" onSubmit={handleSend}>
                        <textarea
                            ref={inputRef}
                            className="chat-input"
                            placeholder="Hỏi tôi về phim, VIP..."
                            rows="1"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <button type="submit" className="send-btn" disabled={loading || !input.trim()}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbox;

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';

const ChatMessage = ({ role, content }) => {
    const navigate = useNavigate();

    // Parse movie cards
    const parseMovieCards = (text) => {
        const cards = [];
        let cleanText = text;

        // Regex robust hơn, chấp nhận khoảng trắng
        const regex = /```moviecard\s*\n([\s\S]*?)\n```/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            try {
                const jsonStr = match[1].trim();
                // Thử parse, nếu lỗi thì bỏ qua
                const movieData = JSON.parse(jsonStr);

                // Validate có đủ field cần thiết
                if (movieData.id && movieData.title) {
                    cards.push(movieData);
                }
            } catch (e) {
                console.warn('⚠️ Parse moviecard failed:', e.message);
            }
        }

        // Xóa blocks đã parse
        cleanText = text.replace(regex, '').trim();

        return { cards, cleanText };
    };

    const { cards, cleanText } = parseMovieCards(content);

    // Custom link renderer
    const customRenderers = {
        a: ({ href, children }) => {
            if (href && href.startsWith('/')) {
                return (
                    <span
                        className="chat-link"
                        onClick={() => navigate(href)}
                        style={{
                            color: '#818cf8',
                            textDecoration: 'underline',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        {children}
                    </span>
                );
            }
            return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
        }
    };

    return (
        <div className={`message ${role}`}>
            <div className="message-content">
                <ReactMarkdown components={customRenderers}>{cleanText}</ReactMarkdown>

                {cards.length > 0 && (
                    <div className="movie-cards-container">
                        {cards.map((movie, idx) => (
                            <MovieCard key={idx} {...movie} />
                        ))}
                    </div>
                )}
            </div>
            <div className="message-time">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    );
};

export default ChatMessage;
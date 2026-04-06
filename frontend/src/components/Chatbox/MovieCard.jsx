import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ id, title, poster, rating, year, genre, is_vip }) => {
    const navigate = useNavigate();

    const handleWatch = () => {
        // ✅ LINK ĐÚNG: /movie/{ID}
        if (id) {
            navigate(`/movie/${id}`);
        }
    };

    return (
        <div className="movie-card-chat" onClick={handleWatch}>
            <div className="movie-card-poster-wrapper">
                <img
                    src={poster || '/placeholder.jpg'}
                    alt={title}
                    className="movie-card-poster"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                />
                {is_vip && (
                    <div className="vip-badge-overlay">👑</div>
                )}
            </div>

            <div className="movie-card-info">
                <h4 className="movie-card-title">{title}</h4>
                <div className="movie-card-meta">
                    <span>📅 {year || 'N/A'}</span>
                    <span>⭐ {rating || '0.0'}</span>
                </div>
                <div className="movie-card-genre">{genre}</div>
                <button className="movie-card-btn" onClick={handleWatch}>
                    🎬 Xem ngay
                </button>
            </div>
        </div>
    );
};

export default MovieCard;
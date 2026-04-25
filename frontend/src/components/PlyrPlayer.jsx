import React, { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import Hls from 'hls.js';
import { deobfuscate } from '../utils/obfuscate';
import { addToHistory } from '../service/history_service';
import 'plyr/dist/plyr.css';

const PlyrPlayer = ({ url, poster, title, movieId, onPlayStateChange = () => {} }) => {
  const videoRef = useRef(null);
  const plyrRef = useRef(null);
  const hlsRef = useRef(null);
  const watchTimerRef = useRef(null);
  const watchSecondsRef = useRef(0);
  const hasLoggedHistoryRef = useRef(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset watch tracking on new movie
    watchSecondsRef.current = 0;
    hasLoggedHistoryRef.current = false;
    if (watchTimerRef.current) clearInterval(watchTimerRef.current);

    if (!videoRef.current || !url) {
      console.warn('PlyrPlayer: Missing video ref or URL', { hasRef: !!videoRef.current, hasUrl: !!url });
      return;
    }

    setIsLoading(true);
    setError(null);
    const video = videoRef.current;
    const decodedUrl = deobfuscate(url);
    
    let hls = null;
    let plyr = null;

    const setupPlyr = (qualityOptions = {}) => {
      // If plyr already exists, destroy it first
      if (plyrRef.current) {
        plyrRef.current.destroy();
      }

      const options = {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'duration',
          'mute',
          'volume',
          'settings',
          'fullscreen'
        ],
        settings: ['quality', 'speed'],
        speed: {
          selected: 1,
          options: [0.5, 0.75, 1, 1.25, 1.5, 2]
        },
        quality: qualityOptions,
        tooltips: {
          controls: true,
          seek: true
        },
        autoplay: true,
        title: title || 'Cinema+ Player',
      };

      const newPlyr = new Plyr(video, options);
      plyrRef.current = newPlyr;

      newPlyr.on('play', () => onPlayStateChange(true));
      newPlyr.on('pause', () => onPlayStateChange(false));
      
      // History tracking logic (10 seconds cumulative)
      newPlyr.on('playing', () => {
        if (!hasLoggedHistoryRef.current && movieId) {
          watchTimerRef.current = setInterval(() => {
            watchSecondsRef.current += 1;
            if (watchSecondsRef.current >= 10) {
              clearInterval(watchTimerRef.current);
              hasLoggedHistoryRef.current = true;
              addToHistory(movieId).catch(err => console.error("History log failed:", err));
            }
          }, 1000);
        }
      });

      const stopTimer = () => clearInterval(watchTimerRef.current);
      newPlyr.on('pause', stopTimer);
      newPlyr.on('waiting', stopTimer);
      newPlyr.on('ended', stopTimer);

      newPlyr.on('error', (err) => {
        console.error('Plyr error:', err);
        // Don't show fatal error for minor Plyr issues unless it's constant
      });

      return newPlyr;
    };

    try {
      if (decodedUrl.includes('.m3u8')) {

        if (Hls.isSupported()) {
          hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            maxBufferLength: 60,
          });
          hlsRef.current = hls;

          hls.loadSource(decodedUrl);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            
            const availableQualities = data.levels.map(l => l.height);
            const qualityConfig = {
              default: availableQualities[availableQualities.length - 1] || 720, // Max quality by default if possible
              options: availableQualities,
              forced: true,
              onChange: (newQuality) => {
                const levelIndex = data.levels.findIndex(l => l.height === newQuality);
                if (hlsRef.current) {
                  hlsRef.current.currentLevel = levelIndex;
                }
              }
            };

            const p = setupPlyr(qualityConfig);
            setIsLoading(false);
            p.play().catch(() => {});
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.error('HLS Network Error, attempting recovery...');
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.error('HLS Media Error, attempting recovery...');
                  hls.recoverMediaError();
                  break;
                default:
                  setError('Lỗi kết nối máy chủ phát phim (Fatal Error)');
                  hls.destroy();
                  setIsLoading(false);
                  break;
              }
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native Safari HLS
          video.src = decodedUrl;
          const p = setupPlyr();
          video.addEventListener('loadedmetadata', () => {
            setIsLoading(false);
            p.play().catch(() => {});
          });
        } else {
          setError('Trình duyệt của bạn không hỗ trợ định dạng phim HLS này.');
          setIsLoading(false);
        }
      } else {
        // Normal MP4 fallback
        video.src = decodedUrl;
        const p = setupPlyr();
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          p.play().catch(() => {});
        });
      }
    } catch (e) {
      console.error('Error initializing PlyrPlayer:', e);
      setError('Đã xảy ra lỗi khi khởi tạo trình phát phim.');
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (plyrRef.current) {
        plyrRef.current.destroy();
        plyrRef.current = null;
      }
      if (watchTimerRef.current) {
        clearInterval(watchTimerRef.current);
      }
    };
  }, [url, title, movieId]); // Re-init on URL or title change

  return (
    <div key={url} className="relative w-full h-full bg-black rounded-3xl lg:rounded-[3rem] overflow-hidden group/player shadow-2xl">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] text-primary whitespace-nowrap animate-pulse">
              Đang tải nội dung...
            </span>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-surface px-6 text-center">
          <div className="space-y-6 max-w-md">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20">
              <span className="text-2xl text-red-500 font-bold italic">!</span>
            </div>
            <div>
              <p className="text-white font-black uppercase tracking-widest text-lg">{error}</p>
              <p className="text-white/40 text-[10px] mt-4 font-mono break-all bg-black/40 p-4 rounded-xl border border-white/5 uppercase">
                Phim: {title || 'Cinema+ Player'}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all active:scale-95"
            >
              Thử tải lại trang
            </button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full plyr-player object-contain"
        poster={poster}
        crossOrigin="anonymous"
        playsInline
        webkit-playsinline="true"
        preload="auto"
      />
      
      {/* Subtle bottom gradient cover to hide potential flickering on init */}
      {!isLoading && !error && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none group-hover/player:opacity-0 transition-opacity duration-700"></div>
      )}
    </div>
  );
};

export default PlyrPlayer;


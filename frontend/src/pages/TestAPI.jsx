import React, { useEffect, useState } from 'react';

const TestAPI = () => {
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/movies/1');
        const data = await response.json();
        console.log('API Response:', data);
        setMovieData(data);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl mb-4">API Debug</h1>
      <pre className="bg-surface p-4 rounded-lg overflow-auto max-h-96">
        {JSON.stringify(movieData, null, 2)}
      </pre>
      {movieData?.movie_url && (
        <div className="mt-6 space-y-4">
          <h2 className="text-2xl">Video URL: {movieData.movie_url}</h2>
          <video
            src={movieData.movie_url}
            className="w-full max-w-2xl h-auto rounded-lg"
            controls
            crossOrigin="anonymous"
          />
        </div>
      )}
      {!movieData?.movie_url && (
        <div className="mt-6 p-4 bg-red-500/20 rounded-lg text-red-300">
          ❌ No movie_url in database!
        </div>
      )}
    </div>
  );
};

export default TestAPI;

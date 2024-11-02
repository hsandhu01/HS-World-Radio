import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Pause, Play, Volume2, VolumeX, Search, Loader, Heart, Globe } from 'lucide-react';
import type { RadioStation } from '../types/radio';
import { fetchStations, searchStations } from '../utils/radio-utils';

const GENRES = ['All', 'Rock', 'Jazz', 'Classical', 'Pop', 'Electronic', 'News', 'Talk', 'Sports'];

const WorldRadio: React.FC = () => {
  // State
  const [selectedStation, setSelectedStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Load initial stations
  useEffect(() => {
    const loadStations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchStations();
        console.log('Loaded stations:', data.length);
        if (data.length === 0) {
          setError('No stations found. Please try again later.');
        } else {
          setStations(data);
          setFilteredStations(data);
        }
      } catch (err) {
        console.error('Failed to fetch stations:', err);
        setError('Failed to load stations. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadStations();

    // Cleanup audio on unmount
    return () => {
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, []);

  // Handle station selection and playback
  const handleStationSelect = async (station: RadioStation) => {
    try {
      if (selectedStation?.id === station.id && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsPlaying(false);
        audioRef.current.src = station.url;
        await audioRef.current.play();
        setSelectedStation(station);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing station:', error);
      setIsPlaying(false);
      setError('Unable to play this station. Please try another one.');
    }
  };

  // Volume control
  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // Search handling
  const handleSearch = async (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setFilteredStations(stations);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchStations(query);
      setFilteredStations(results);
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Genre filtering
  useEffect(() => {
    if (selectedGenre === 'all') {
      setFilteredStations(stations);
    } else {
      const filtered = stations.filter(station =>
        station.genre?.toLowerCase().includes(selectedGenre.toLowerCase())
      );
      setFilteredStations(filtered);
    }
  }, [selectedGenre, stations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/30 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-purple-400" />
            <span className="text-white font-bold">World Radio</span>
          </div>
          
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search stations, genres, countries..."
                className="w-full bg-white/10 text-white rounded-full px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                onChange={(e) => {
                  if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current);
                  }
                  searchTimeoutRef.current = setTimeout(() => {
                    handleSearch(e.target.value);
                  }, 500);
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              {isSearching && (
                <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4 animate-spin" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Globe className="w-5 h-5 text-gray-400" />
            <Heart className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Main Content - Fixed height and scrollable */}
      <main className="pt-24 px-4 pb-32 h-[calc(100vh-5rem)] overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Genre Filters */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre.toLowerCase())}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedGenre === genre.toLowerCase()
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Station Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredStations.map(station => (
                <motion.div
                  key={station.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/20 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold truncate">{station.name}</h3>
                      <p className="text-gray-400 text-sm">{station.country}</p>
                    </div>
                    <button
                      onClick={() => setFavorites(prev => {
                        const newFavorites = new Set(prev);
                        if (newFavorites.has(station.id)) {
                          newFavorites.delete(station.id);
                        } else {
                          newFavorites.add(station.id);
                        }
                        return newFavorites;
                      })}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.has(station.id) ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{station.genre || 'Various'}</span>
                    <button
                      onClick={() => handleStationSelect(station)}
                      className={`p-3 rounded-full ${
                        selectedStation?.id === station.id && isPlaying
                          ? 'bg-purple-500'
                          : 'bg-purple-500/50 hover:bg-purple-500'
                      }`}
                    >
                      {selectedStation?.id === station.id && isPlaying ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Player Bar */}
      {selectedStation && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/30 flex items-center justify-center">
                <Radio className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">{selectedStation.name}</h3>
                <p className="text-gray-400 text-sm">
                  {selectedStation.country} • {selectedStation.genre}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  {isMuted ? <VolumeX /> : <Volume2 />}
                </button>
                {!isMuted && (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-24 accent-purple-400"
                  />
                )}
              </div>

              <button
                onClick={() => {
                  if (isPlaying) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                  } else {
                    audioRef.current.play();
                    setIsPlaying(true);
                  }
                }}
                className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center hover:bg-purple-400 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading/Error Overlay */}
      {(isLoading || error) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4 max-w-md mx-4 text-center">
            {isLoading ? (
              <>
                <Loader className="w-8 h-8 text-purple-400 animate-spin" />
                <p className="text-white">Loading stations...</p>
              </>
            ) : error ? (
              <>
                <p className="text-white">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-400 transition-colors"
                >
                  Try Again
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldRadio;
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CompositionAPIWeb = ({ baseUrl }) => {
  const [clips, setClips] = useState([]);
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeClip, setActiveClip] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}/api/v1/composition`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const result = await response.json();
        const allClips = result.layers.flatMap(layer => layer.clips || []);
        const filteredClips = allClips.filter(clip => clip.name && clip.name.value);
        setClips(filteredClips);
        setDecks(result.decks || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [baseUrl]);

  const connectClip = async (clipId) => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/composition/clips/by-id/${clipId}/connect`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Failed to connect clip: ${response.statusText}`);
      }
      setActiveClip(clipId);
    } catch (err) {
      console.error(err.message);
    }
  };

  const selectDeck = async (deckId) => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/composition/decks/by-id/${deckId}/select`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Failed to select deck: ${response.statusText}`);
      }
      console.log(`Deck ${deckId} selected successfully`);
    } catch (err) {
      console.error(err.message);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    focusOnSelect: true,
    afterChange: (index) => setCurrentSlide(index),
    customPaging: (i) => (
      <button className="custom-dot">
        {i + 1}
      </button>
    ),
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "0",
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
    <div className="animated-background"></div>
    <div className="animated-overlay"></div>

      {/* Loading and Error States */}
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <p className="text-blue-500"></p>
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Deck Selection Buttons */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex flex-row space-x-4">
        {decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => selectDeck(deck.id)}
            className={`py-2 px-4 font-medium text-white transition-all duration-300 rounded-lg
              ${deck.selected.value ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            {deck.name.value}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto px-4">
          <Slider {...sliderSettings}>
            {clips.map((clip, index) => (
              <div key={clip.id} className="p-4">
                <div
                  className={`transform transition-all duration-300 ease-in-out
                    ${currentSlide === index ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}
                >
                  <div className="bg-gray-800 overflow-hidden rounded-xl">
                    <div className="relative">
                      <img
                        src={`${baseUrl}/api/v1/composition/clips/by-id/${clip.id}/thumbnail`}
                        alt={clip.name.value}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                    </div>

                    {/* Tombol Play Hanya Muncul di Slide Tengah */}
                    {currentSlide === index && (
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-4 text-center">
                          {clip.name.value}
                        </h3>

                        <button
                          onClick={() => connectClip(clip.id)}
                          className={`w-full py-2 px-4 font-medium text-2xl transition-all duration-300 rounded-lg
                            ${activeClip === clip.id
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                        >
                          {activeClip === clip.id ? 'Playing' : 'Play'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
      .slick-track {
        display: flex !important;
        align-items: center !important;
      }
      
      .slick-slide {
        transition: all 500ms ease-in-out;
        transform-style: preserve-3d;
        perspective: 1000px;
      }
      
      .slick-slide.slick-center {
        transform: scale(1.1);
        z-index: 10;
        opacity: 1;
      }
      
      .slick-slide:not(.slick-center) {
        transform: scale(0.9);
        opacity: 0.5;
      }

      .custom-dot {
        width: 24px;
        height: 24px;
        margin: 0 4px;
        color: white;
        opacity: 0.5;
        transition: all 300ms ease;
      }

      .slick-active .custom-dot {
        opacity: 1;
        color: #10B981;
      }

      .slick-dots {
        bottom: -60px;
        display: flex !important;
        justify-content: center;
        align-items: center;
        gap: 8px;
      }

      .slick-dots li {
        margin: 0;
      }

      .slick-prev, .slick-next {
        width: 48px;
        height: 48px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        z-index: 20;
        transition: all 300ms ease;
      }

      .slick-prev:hover, .slick-next:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .slick-prev {
        left: 24px;
      }

      .slick-next {
        right: 24px;
      }

      .animated-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
        z-index: -1;
      }

      @keyframes gradientBG {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      .animated-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 0;
      }
    `}</style>
    </div>
  );
};

export default CompositionAPIWeb;
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
    const interval = setInterval(fetchData, 2500);
    return () => clearInterval(interval);
  }, []);

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
    centerPadding: "0px",
    beforeChange: (oldIndex, newIndex) => {
      // console.log('Changing from slide', oldIndex, 'to slide', newIndex); 
    },
    afterChange: (index) => {
      setCurrentSlide(index);
      // console.log('Current Slide:', clips[index]?.name?.value); 
    },
    nextArrow: <button type="button" className="slick-next">Next</button>,
    prevArrow: <button type="button" className="slick-prev">Previous</button>,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          centerMode: true,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 820,
        settings: {
          slidesToShow: 3,
          centerMode: true,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "100px",
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "100px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="animated-background"></div>
      <div className="animated-overlay"></div>
      {/* Video Background */}
      {/* {clips.length > 0 && (
        <div className="absolute inset-0 z-0">
        {clips[currentSlide]?.name?.value ? (
          <video
            key={currentSlide}  
            className="w-full h-full object-cover opacity-20"
            autoPlay
            loop
            muted
            src={`./konten/${clips[currentSlide]?.name?.value}.mp4`}
          />
        ) : (
          <p className="text-white font-bold text-9xl text-left">Video tidak ditemukan</p> 
        )}
      </div>
      )} */}

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
      <div className="absolute top-4 left-4 z-20">
        {decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => selectDeck(deck.id)}
            className={`block w-full py-2 px-4 mb-2 font-medium text-white transition-all duration-300
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
            {clips.map((clip) => (
              <div key={clip.id} className="p-4">
                <div
                  className={`
                    transform transition-all duration-300
                    ${currentSlide === clips.indexOf(clip) ? 'scale-100' : 'scale-90 opacity-50'}
                  `}
                >
                  <div className="bg-gray-800 overflow-hidden">
                    <div className="relative">
                      <img
                        src={`${baseUrl}/api/v1/composition/clips/by-id/${clip.id}/thumbnail`}
                        alt={clip.name.value}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4 text-center">
                        {clip.name.value}
                      </h3>

                      <button
                        onClick={() => connectClip(clip.id)}
                        className={`
                          w-full py-2 px-4 font-medium text-2xl transition-all duration-300
                          ${activeClip === clip.id
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                        `}
                      >
                        {activeClip === clip.id ? 'Played' : 'Play'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        /* Existing slider styles */
        .slick-track {
          display: flex !important;
          align-items: center !important;
        }
        .slick-slide {
          transition: all 300ms ease;
          padding: 0 10px;
        }
        .slick-dots {
          top: 25rem;
        }
        .slick-dots li button:before {
          color: #9CA3AF;
          opacity: 0.5;
        }
        .slick-dots li.slick-active button:before {
          color: #60A5FA;
          opacity: 1;
        }
        .slick-prev, .slick-next {
          z-index: 20;
          font-size: 24px;
        }
        .slick-prev {
          left: 0;
        }
        .slick-next {
          right: 0;
        }

        /* Animated Background Styles */
        .animated-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            #0f172a,
            #1e293b,
            #1a237e,
            #1e293b,
            #0f172a
          );
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          z-index: 0;
        }

        .animated-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(0, 0, 0, 0.3) 100%
          );
          z-index: 1;
        }

        @keyframes gradient {
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

        /* Add subtle floating particles */
        .animated-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: float 20s linear infinite;
        }

        @keyframes float {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 50px 50px;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .slick-slide {
            padding: 0 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CompositionAPIWeb;
"use client";
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="/vedio.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        {/* Overlays temporarily removed for debugging */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div> */}
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            {/* Main Heading */}
            <h1 
              className={`text-xl md:text-6xl lg:text-8xl font-bold text-white mb-6 transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <span className="block overflow-hidden">
                <span 
                  className={`inline-block transition-transform duration-1000 delay-200 ${
                    isLoaded ? 'translate-y-0' : 'translate-y-full'
                  }`}
                >
                  Create
                </span>
              </span>
              <span className="block overflow-hidden">
                <span 
                  className={`inline-block transition-transform duration-1000 delay-400 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent ${
                    isLoaded ? 'translate-y-0' : 'translate-y-full'
                  }`}
                >
                  Amazing
                </span>
              </span>
              <span className="block overflow-hidden">
                <span 
                  className={`inline-block  mt-3 transition-transform duration-1000 delay-600 ${
                    isLoaded ? 'translate-y-0' : 'translate-y-full'
                  }`}
                >
                  Experiences
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p 
              className={`text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed transition-all duration-1000 delay-800 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Transform your ideas into reality with cutting-edge design and 
              innovative solutions that captivate your audience.
            </p>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-2xl">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
              
              <button className="group px-8 py-4 border-2 border-white text-white font-semibold rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:scale-105">
                <span className="flex items-center justify-center gap-2">
                  Watch Demo
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Floating Elements */}
            <div className="absolute -right-4 top-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -left-8 bottom-1/4 w-48 h-48 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="flex flex-col items-center text-white">
          <span className="text-sm mb-2 animate-pulse">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full animate-bounce mt-2"></div>
          </div>
        </div>
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite alternate`
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-20px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
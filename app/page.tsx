"use client";

import { useState } from "react";

export default function Home() {
  const [showContact, setShowContact] = useState(false);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {!showContact ? (
          <>
            {/* Logo or Brand Name - Optional */}
            <h1 className="text-white text-6xl md:text-8xl font-bold mb-12 tracking-tight">
              YOUR BRAND
            </h1>

            {/* Contact Button */}
            <button
              onClick={() => setShowContact(true)}
              className="group relative px-12 py-5 text-xl font-semibold text-white border-2 border-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Contact Us</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Contact Us
              </span>
            </button>
          </>
        ) : (
          /* Contact Form */
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-md w-full shadow-2xl">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold mb-6 text-gray-900">Get in Touch</h2>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

// components/GenreSelector.tsx

"use client";

import React from "react";
import {Genre} from "../data/songs";
import {FaCheck} from "react-icons/fa";

interface GenreSelectorProps {
  genres: Genre[];
  selectedGenre: Genre | "";
  setSelectedGenre: (genre: Genre | "") => void;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({
  genres,
  selectedGenre,
  setSelectedGenre,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Төрөл сонгох:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* "Бүгд" (All) Card */}
        <button
          type="button"
          onClick={() => setSelectedGenre("")}
          className={`relative p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${
            selectedGenre === ""
              ? "border-indigo-500 bg-indigo-100 shadow-lg"
              : "border-gray-300 bg-white hover:bg-gray-50"
          }`}
          aria-pressed={selectedGenre === ""}
        >
          {/* Checkmark Icon for Selected State */}
          {selectedGenre === "" && (
            <FaCheck className="absolute top-2 right-2 text-indigo-500" />
          )}
          <span className="block text-center text-gray-800">Бүгд</span>
        </button>

        {/* Dynamic Genre Cards */}
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => setSelectedGenre(genre)}
            className={`relative p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${
              selectedGenre === genre
                ? "border-indigo-500 bg-indigo-100 shadow-lg"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
            aria-pressed={selectedGenre === genre}
          >
            {/* Checkmark Icon for Selected State */}
            {selectedGenre === genre && (
              <FaCheck className="absolute top-2 right-2 text-indigo-500" />
            )}
            <span className="block text-center text-gray-800">{genre}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreSelector;

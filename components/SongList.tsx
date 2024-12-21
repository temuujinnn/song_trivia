// components/SongList.tsx

"use client";

import React, {useState, useEffect} from "react";
import {Song} from "../data/songs";
import {FaPlay, FaPause} from "react-icons/fa";
import GivePointButton from "./GivePointButton";

interface SongListProps {
  songs: Song[];
  handleGivePoint: (song: Song) => void;
  isGivingPoint: boolean;
  currentStage: number | null; // Not used anymore
  currentSongId: number | null;
  onPause: () => void; // Callback for pause action
  isPaused: boolean; // New prop
  handleSongClick: (song: Song) => void; // Added prop
}

const SongList: React.FC<SongListProps> = ({
  songs,
  handleGivePoint,
  isGivingPoint,
  currentStage, // No longer used
  currentSongId,
  onPause,
  isPaused,
  handleSongClick, // Destructure the new prop
}) => {
  // State to manage which song is currently playing
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);
  const [audioInstances, setAudioInstances] = useState<
    Record<number, HTMLAudioElement>
  >({});
  const [currentTime, setCurrentTime] = useState<number>(0); // New state variable

  // Helper function to format time in mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Initialize audio instances for each song
  useEffect(() => {
    const instances: Record<number, HTMLAudioElement> = {};
    songs.forEach((song) => {
      const audio = new Audio(song.src);
      // Handle song end event
      audio.addEventListener("ended", () => {
        setPlayingSongId(null);
        setCurrentTime(0); // Reset timer
      });
      // Handle audio loading errors
      audio.addEventListener("error", (e) => {
        console.error(`Error loading audio for song ID ${song.id}:`, e);
        // Optionally, mark the song as guessed to disable it
        // If you have a mechanism to update the song's guessed status, implement it here
      });
      instances[song.id] = audio;
    });
    setAudioInstances(instances);

    // Cleanup on unmount
    return () => {
      Object.values(instances).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [songs]);

  // Manage time updates for the currently playing song
  useEffect(() => {
    if (playingSongId !== null) {
      const audio = audioInstances[playingSongId];
      if (audio) {
        const updateTime = () => {
          setCurrentTime(audio.currentTime);
        };
        audio.addEventListener("timeupdate", updateTime);

        // Cleanup listener when song changes or component unmounts
        return () => {
          audio.removeEventListener("timeupdate", updateTime);
          setCurrentTime(0); // Reset timer
        };
      }
    }
  }, [playingSongId, audioInstances]);

  // Play a specific song
  const playAudio = (song: Song) => {
    if (playingSongId && playingSongId !== song.id) {
      // Pause the currently playing song
      audioInstances[playingSongId]?.pause();
    }

    const audio = audioInstances[song.id];
    if (audio) {
      audio.play();
      setPlayingSongId(song.id);
      handleSongClick(song); // Inform Home.tsx about the song being played
    }
  };

  // Pause a specific song
  const pauseAudio = (song: Song) => {
    const audio = audioInstances[song.id];
    if (audio) {
      audio.pause();
      setPlayingSongId(null);
      onPause(); // Notify Home.tsx about the pause
      setCurrentTime(0); // Reset timer
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {songs.map((song) => (
        <div
          key={song.id}
          className={`flex flex-col items-center justify-between p-4 bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300 ${
            song.guessed ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <div className="w-full">
            <h3 className="text-xl font-semibold">{song.title}</h3>
            <p className="text-xl text-gray-600">Points: {song.points}</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 w-full">
            {/* Play/Pause Button */}
            {playingSongId === song.id ? (
              <button
                onClick={() => {
                  pauseAudio(song);
                }}
                className={`flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition ${
                  song.guessed
                    ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                    : ""
                }`}
                aria-label={`Pause ${song.title}`}
                disabled={song.guessed}
              >
                <FaPause />
              </button>
            ) : (
              <button
                onClick={() => {
                  playAudio(song); // Call the modified playAudio
                }}
                className={`flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition ${
                  song.guessed
                    ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                    : ""
                }`}
                aria-label={`Play ${song.title}`}
                disabled={song.guessed}
              >
                <FaPlay />
              </button>
            )}
            {/* Give Point Button */}
            {(isGivingPoint || isPaused) &&
              currentSongId === song.id &&
              !song.guessed && ( // Ensure button is shown only if song is not guessed
                <GivePointButton
                  onGivePoint={() => handleGivePoint(song)}
                  disabled={song.guessed}
                  pointPercentage={100} // Fixed to 100%
                />
              )}
          </div>
          {/* Display Current Time */}
          {playingSongId === song.id && (
            <div className="mt-2 text-gray-600 font-medium">
              {formatTime(currentTime)}
            </div>
          )}
          {song.guessed && (
            <div className="mt-2 text-red-500 font-semibold">
              Points Assigned
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SongList;

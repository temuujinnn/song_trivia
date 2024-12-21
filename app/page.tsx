// pages/index.tsx

"use client";

import React, {useState, useEffect} from "react";
import GenreSelector from "../components/GenreSelector";
import SongList from "../components/SongList";
import TeamScores from "../components/TeamScores";
import {genres, songs as allSongs, Song, Genre} from "../data/songs";
import {initialTeams, Team} from "../data/teams";
import styles from "../styles/Home.module.css";
import {
  getGuessedSongsFromLocalStorage,
  saveGuessedSongsToLocalStorage,
  getTeamsFromLocalStorage,
  saveTeamsToLocalStorage,
} from "../utils/localStorage";

const Home: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<Genre | "">("");
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(allSongs);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [currentSongId, setCurrentSongId] = useState<number | null>(null);
  const [currentSongTitle, setCurrentSongTitle] = useState<string | null>(null);
  const [isGivingPoint, setIsGivingPoint] = useState<boolean>(false);
  const [songTimer, setSongTimer] = useState<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false); // New state variable

  // Load teams from local storage on mount
  useEffect(() => {
    const savedTeams = getTeamsFromLocalStorage();
    if (savedTeams) {
      setTeams(savedTeams);
      console.log("Loaded teams from local storage:", savedTeams);
    } else {
      setTeams(initialTeams);
      console.log("Initialized teams with initialTeams:", initialTeams);
    }
  }, []);

  // Save teams to local storage whenever they change
  useEffect(() => {
    saveTeamsToLocalStorage(teams);
    console.log("Saved teams to local storage:", teams);
  }, [teams]);

  useEffect(() => {
    let songs = allSongs;

    // Initialize guessed status from local storage
    const guessedSongIds = getGuessedSongsFromLocalStorage();
    songs = songs.map((song) =>
      guessedSongIds.includes(song.id) ? {...song, guessed: true} : song
    );

    if (selectedGenre) {
      songs = songs.filter((song) => song.genre === selectedGenre);
    }
    setFilteredSongs(songs);
    console.log("Filtered Songs:", songs);
  }, [selectedGenre]);

  /**
   * Handles clicking the play button on a song.
   * Initiates the song playback and starts the point allocation.
   */
  const handleSongClick = (song: Song) => {
    console.log(`handleSongClick: Song clicked: ${song.title}, ID: ${song.id}`);

    if (song.guessed) {
      alert("Points have already been assigned to this song.");
      return;
    }

    // Start Point Allocation
    playSong(song); // Single Stage: 100%
  };

  /**
   * Plays the song and manages the point allocation.
   * @param song The song to play.
   */
  const playSong = (song: Song) => {
    console.log(`playSong: Playing Song: ${song.title}`);

    if (songTimer) {
      clearTimeout(songTimer);
      setSongTimer(null);
    }

    // Set necessary states
    setIsGivingPoint(true);
    setIsPaused(false);
    setCurrentSongId(song.id);
    setCurrentSongTitle(song.title);

    console.log("playSong: State updated:", {
      isGivingPoint: true,
      isPaused: false,
      currentSongId: song.id,
      currentSongTitle: song.title,
    });

    // Start the timer (if needed for auto-pause or other logic)
    // For simplicity, we're not using stages, so this can be adjusted as per requirements
  };

  /**
   * Handles assigning points to the selected team.
   * @param song The song for which points are being assigned.
   */
  const handleGivePoint = (song: Song) => {
    console.log(`Giving points for Song: ${song.title}`);

    if (selectedTeamId === null) {
      alert("Please select a team to assign points!");
      return;
    }

    // Assign 100% points directly
    const earnedPoints = song.points;

    console.log(`Earned Points: ${earnedPoints}`);

    if (earnedPoints > 0) {
      // Assign points to the selected team
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === selectedTeamId
            ? {...team, score: team.score + earnedPoints}
            : team
        )
      );

      console.log(
        `Assigned ${earnedPoints} points to Team ID ${selectedTeamId}`
      );

      alert(`You have earned ${earnedPoints} points!`);

      // Disable the "Give Point" button
      setIsGivingPoint(false);
      setIsPaused(false); // Reset paused state
      console.log("Give Point button disabled.");

      // Mark the song as guessed
      setFilteredSongs((prevSongs) =>
        prevSongs.map((s) => (s.id === song.id ? {...s, guessed: true} : s))
      );
      console.log(`Song ID ${song.id} marked as guessed.`);

      // Update local storage with the guessed song
      const guessedSongIds = getGuessedSongsFromLocalStorage();
      if (!guessedSongIds.includes(song.id)) {
        const updatedGuessedSongIds = [...guessedSongIds, song.id];
        saveGuessedSongsToLocalStorage(updatedGuessedSongIds);
        console.log(
          `Guessed songs updated in local storage: ${updatedGuessedSongIds}`
        );
      }

      // Clear the current timer if any
      if (songTimer) {
        clearTimeout(songTimer);
        setSongTimer(null);
        console.log("Song timer cleared.");
      }

      // Optionally, you can add a delay before allowing the next action
      // setTimeout(() => {
      //   handleContinueSong();
      // }, 1000); // 1-second delay
    } else {
      alert("The time to assign points has expired!");
      console.log("No points awarded due to time expiration.");
    }
  };

  /**
   * Handles pausing a song and showing the "Give Point" button.
   */
  const handlePauseSong = () => {
    console.log("handlePauseSong called with current state:", {
      currentSongId,
      isGivingPoint,
      isPaused,
    });

    setIsPaused(true);
    setIsGivingPoint(true);

    // Log the state changes
    console.log("handlePauseSong: State after pause:", {
      isPaused: true,
      isGivingPoint: true,
      currentSongId,
    });
  };

  /**
   * Handles continuing to the next action after point assignment.
   * Resets necessary state variables to allow the next song/team.
   */
  const handleContinueSong = () => {
    console.log("Continuing to the next song or team.");

    // Reset all relevant state variables
    setIsGivingPoint(false);
    setIsPaused(false);
    setCurrentSongId(null);
    setCurrentSongTitle(null);
    console.log("State variables reset for next action.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-600">
            Song Trivia Game
          </h1>
          <p className="mt-2 text-gray-600">Choose a song and earn points!</p>
        </header>

        {/* Team Scores */}
        <div className="mb-6">
          <TeamScores
            teams={teams}
            selectedTeamId={selectedTeamId}
            setSelectedTeamId={setSelectedTeamId}
          />
        </div>

        {/* Selected Team Indicator */}
        <div className="mb-6">
          <div className="mb-4 text-center">
            {selectedTeamId ? (
              <p className="text-xl">
                <span className="font-semibold text-indigo-600">
                  Selected Team:
                </span>{" "}
                {teams.find((team) => team.id === selectedTeamId)?.name}
              </p>
            ) : (
              <p className="text-xl text-red-500">Please select a team!</p>
            )}
          </div>
          <GenreSelector
            genres={genres}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
          />
        </div>

        {/* Song List */}
        <div className="mb-6">
          {selectedGenre ? (
            <h2 className="text-2xl font-semibold mb-4">{selectedGenre}</h2>
          ) : (
            <h2 className="text-2xl font-semibold mb-4">All Genres</h2>
          )}
          <SongList
            songs={filteredSongs}
            handleGivePoint={handleGivePoint}
            isGivingPoint={isGivingPoint && currentSongId !== null}
            currentStage={null} // Removed multi-stage, set to null
            currentSongId={currentSongId}
            onPause={handlePauseSong} // Pass the callback
            isPaused={isPaused} // Pass the isPaused state
            handleSongClick={handleSongClick} // Pass handleSongClick
          />
        </div>

        {/* Continue Song Button */}
        {/* Optional: Remove if not needed */}
        {/*
        {isGivingPoint && (
          <div className="text-center">
            <button
              onClick={handleContinueSong}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Continue to Next
            </button>
          </div>
        )}
        */}

        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="text-xl">
            {currentSongTitle && (
              <span className="font-semibold text-indigo-700">
                Now Playing:
              </span>
            )}{" "}
            {currentSongTitle}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;

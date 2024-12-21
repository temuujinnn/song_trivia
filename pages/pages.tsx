// // pages/index.tsx

// "use client";

// import React, {useState, useEffect, useRef} from "react";
// import GenreSelector from "../components/GenreSelector";
// import SongList from "../components/SongList";
// import TeamScores from "../components/TeamScores";
// import {genres, songs as allSongs, Song, Genre} from "../data/songs";
// import {initialTeams, Team} from "../data/teams";
// import styles from "../styles/Home.module.css";

// const Home: React.FC = () => {
//   const [selectedGenre, setSelectedGenre] = useState<Genre | "">("");
//   const [filteredSongs, setFilteredSongs] = useState<Song[]>(allSongs);
//   const [teams, setTeams] = useState<Team[]>(initialTeams);
//   const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
//   const [playStates, setPlayStates] = useState<Record<number, number>>({});
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const [currentSongId, setCurrentSongId] = useState<number | null>(null);
//   const [currentSongTitle, setCurrentSongTitle] = useState<string | null>(null);
//   const [isGivingPoint, setIsGivingPoint] = useState<boolean>(false);
//   const [currentStage, setCurrentStage] = useState<number | null>(null); // 1:100%, 2:70%, 3:50%
//   const [songTimer, setSongTimer] = useState<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     let songs = allSongs;
//     if (selectedGenre) {
//       songs = songs.filter((song) => song.genre === selectedGenre);
//     }
//     setFilteredSongs(songs);
//   }, [selectedGenre]);

//   /**
//    * Handles clicking the play button on a song.
//    * Initiates the song playback and starts the point allocation stages.
//    */
//   const handleSongClick = (song: Song) => {
//     if (selectedTeamId === null) {
//       alert("Та оноо нэмэх багыг сонгоно уу!");
//       return;
//     }

//     if (song.guessed) {
//       alert("Энэ дуун дээр оноо өгсөн байна.");
//       return;
//     }

//     // Update play states using functional state update to ensure correctness
//     setPlayStates((prev) => {
//       const currentState = prev[song.id] || 0;
//       const newState = currentState + 1;
//       return {...prev, [song.id]: newState};
//     });

//     // Determine the next stage based on the updated play state
//     setPlayStates((prev) => {
//       const currentState = prev[song.id] || 0;
//       if (currentState === 1) {
//         playSong(song, 1); // Stage 1: 100%
//       } else if (currentState === 2) {
//         playSong(song, 2); // Stage 2: 70%
//       } else if (currentState === 3) {
//         playSong(song, 3); // Stage 3: 50%
//       } else {
//         playAllSongs();
//       }
//       return prev;
//     });
//   };

//   /**
//    * Plays the song and manages the point allocation stage.
//    * @param song The song to play.
//    * @param stage The current point allocation stage (1:100%, 2:70%, 3:50%).
//    */
//   const playSong = (song: Song, stage: number) => {
//     // Clear existing timers
//     if (songTimer) {
//       clearTimeout(songTimer);
//       setSongTimer(null);
//     }

//     // Pause any existing audio
//     if (audioRef.current) {
//       audioRef.current.pause();
//     }

//     // Create a new audio instance
//     const audio = new Audio(song.src);
//     audioRef.current = audio;
//     setCurrentSongId(song.id);
//     setCurrentSongTitle(song.title);

//     // Play the song
//     audio.play().catch((error) => {
//       console.error("Error playing audio:", error);
//       setCurrentSongId(null);
//       setCurrentSongTitle(null);
//     });

//     // Set the current stage
//     setCurrentStage(stage);

//     // Enable the "Give Point" button
//     setIsGivingPoint(true);

//     // Set timer to pause the song after 3 seconds
//     const timeout = setTimeout(() => {
//       audio.pause();
//       setIsGivingPoint(false);
//       setCurrentSongId(null);
//       setCurrentSongTitle(null);
//       setCurrentStage(null);
//     }, 3000); // 3 seconds
//     setSongTimer(timeout);
//   };

//   /**
//    * Plays all songs sequentially with a 3-second interval between each.
//    */
//   const playAllSongs = () => {
//     // Pause any existing audio
//     if (audioRef.current) {
//       audioRef.current.pause();
//     }

//     // Clear timers
//     if (songTimer) {
//       clearTimeout(songTimer);
//       setSongTimer(null);
//     }

//     setCurrentSongId(null);
//     setCurrentSongTitle("Бүх дуунуудыг тоглуулж байна...");
//     setIsGivingPoint(false);
//     setCurrentStage(null);

//     allSongs.forEach((song, index) => {
//       setTimeout(() => {
//         const audio = new Audio(song.src);
//         audio.play().catch((error) => {
//           console.error("Error playing audio:", error);
//         });
//       }, index * 3000); // Play each song 3 seconds apart
//     });

//     // Clear the message after all songs have played
//     const totalDuration = allSongs.length * 3000;
//     const finalTimeout = setTimeout(() => {
//       setCurrentSongTitle(null);
//     }, totalDuration);
//     setSongTimer(finalTimeout);
//   };

//   /**
//    * Handles assigning points to the selected team based on the current stage.
//    * @param song The song for which points are being assigned.
//    */
//   const handleGivePoint = (song: Song) => {
//     if (selectedTeamId === null) {
//       alert("Та оноо нэмэх багыг сонгоно уу!");
//       return;
//     }

//     if (currentStage === null) {
//       alert("Оноо өгөх нөхцөлд алдаа гарлаа!");
//       return;
//     }

//     let earnedPoints = 0;

//     if (currentStage === 1) {
//       earnedPoints = song.points; // 100%
//     } else if (currentStage === 2) {
//       earnedPoints = Math.round(song.points * 0.7); // 70%
//     } else if (currentStage === 3) {
//       earnedPoints = Math.round(song.points * 0.5); // 50%
//     }

//     if (earnedPoints > 0) {
//       // Assign points to the selected team
//       setTeams((prevTeams) =>
//         prevTeams.map((team) =>
//           team.id === selectedTeamId
//             ? {...team, score: team.score + earnedPoints}
//             : team
//         )
//       );

//       alert(`Та ${earnedPoints} оноо авлаа!`);

//       // Disable the "Give Point" button
//       setIsGivingPoint(false);

//       // Disable the song from further interactions by marking it as guessed
//       setFilteredSongs((prevSongs) =>
//         prevSongs.map((s) => (s.id === song.id ? {...s, guessed: true} : s))
//       );

//       // Optionally, move to the next stage automatically after assigning points
//       if (currentStage < 3) {
//         // Automatically proceed to the next stage after a short delay
//         setTimeout(() => {
//           // Find the song again
//           const songToPlay = allSongs.find((s) => s.id === song.id);
//           if (songToPlay) {
//             playSong(songToPlay, currentStage + 1);
//           }
//         }, 1000); // 1 second delay
//       } else {
//         // After the last stage, allow the user to select the next team manually
//         setCurrentStage(null);
//       }
//     } else {
//       alert("Оноо өгөх хугацаа дууссан байна!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <header className="mb-8 text-center">
//           <h1 className="text-4xl font-bold text-indigo-600">
//             Song Trivia Game
//           </h1>
//           <p className="mt-2 text-gray-600">
//             Та дуу сонгож, оноо цуглуулаарай!
//           </p>
//         </header>

//         {/* Team Scores */}
//         <div className="mb-6">
//           <TeamScores
//             teams={teams}
//             selectedTeamId={selectedTeamId}
//             setSelectedTeamId={setSelectedTeamId}
//           />
//         </div>

//         {/* Selected Team Indicator */}
//         <div className="mb-6">
//           <div className="mb-4 text-center">
//             {selectedTeamId ? (
//               <p className="text-xl">
//                 <span className="font-semibold text-indigo-600">
//                   Сонгосон баг:
//                 </span>{" "}
//                 {teams.find((team) => team.id === selectedTeamId)?.name}
//               </p>
//             ) : (
//               <p className="text-xl text-red-500">Та багыг сонгоно уу!</p>
//             )}
//           </div>
//           <GenreSelector
//             genres={genres}
//             selectedGenre={selectedGenre}
//             setSelectedGenre={setSelectedGenre}
//           />
//         </div>

//         {/* Song List */}
//         <div className="mb-6">
//           {selectedGenre ? (
//             <h2 className="text-2xl font-semibold mb-4">{selectedGenre}</h2>
//           ) : (
//             <h2 className="text-2xl font-semibold mb-4">Бүх Төрлүүд</h2>
//           )}
//           <SongList
//             songs={filteredSongs}
//             handleSongClick={handleSongClick}
//             handleGivePoint={handleGivePoint}
//             isGivingPoint={isGivingPoint && currentSongId !== null}
//             currentStage={currentStage}
//             currentSongId={currentSongId}
//           />
//         </div>

//         {/* Footer */}
//         <footer className="mt-8 text-center">
//           <div className="text-xl">
//             {currentSongTitle && (
//               <span className="font-semibold text-indigo-700">
//                 Тоглож байна:
//               </span>
//             )}{" "}
//             {currentSongTitle}
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Home;a// pages/index.tsx

// import React, { useState, useEffect, useRef } from 'react';
// import GenreSelector from '../components/GenreSelector';
// import SongList from '../components/SongList';
// import TeamScores from '../components/TeamScores';
// import { genres, songs as allSongs, Song, Genre } from '../data/songs';
// import { initialTeams, Team } from '../data/teams';
// import styles from '../styles/Home.module.css';

// const Home: React.FC = () => {
//   const [selectedGenre, setSelectedGenre] = useState<Genre | ''>('');
//   const [filteredSongs, setFilteredSongs] = useState<Song[]>(allSongs);
//   const [teams, setTeams] = useState<Team[]>(initialTeams);
//   const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
//   const [playStates, setPlayStates] = useState<Record<number, number>>({});
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const [currentSongId, setCurrentSongId] = useState<number | null>(null);
//   const [currentSongTitle, setCurrentSongTitle] = useState<string | null>(null);
//   const [isGivingPoint, setIsGivingPoint] = useState<boolean>(false);
//   const [currentStage, setCurrentStage] = useState<number | null>(null); // 1:100%, 2:70%, 3:50%
//   const [songTimer, setSongTimer] = useState<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     let songs = allSongs;
//     if (selectedGenre) {
//       songs = songs.filter((song) => song.genre === selectedGenre);
//     }
//     setFilteredSongs(songs);
//     console.log('Filtered Songs:', songs);
//   }, [selectedGenre]);

//   /**
//    * Handles clicking the play button on a song.
//    * Initiates the song playback and starts the point allocation stages.
//    */
//   const handleSongClick = (song: Song) => {
//     console.log(`Song clicked: ${song.title}, ID: ${song.id}`);

//     if (selectedTeamId === null) {
//       alert('Та оноо нэмэх багыг сонгоно уу!');
//       return;
//     }

//     if (song.guessed) {
//       alert('Энэ дуун дээр оноо өгсөн байна.');
//       return;
//     }

//     // Update play states using functional state update to ensure correctness
//     setPlayStates((prev) => {
//       const currentState = prev[song.id] || 0;
//       const newState = currentState + 1;
//       console.log(`Play state updated for Song ID ${song.id}: ${newState}`);

//       // Determine the stage based on the new state
//       if (newState === 1) {
//         playSong(song, 1); // Stage 1: 100%
//       } else if (newState === 2) {
//         playSong(song, 2); // Stage 2: 70%
//       } else if (newState === 3) {
//         playSong(song, 3); // Stage 3: 50%
//       } else {
//         playAllSongs();
//       }

//       return { ...prev, [song.id]: newState };
//     });
//   };

//   /**
//    * Plays the song and manages the point allocation stage.
//    * @param song The song to play.
//    * @param stage The current point allocation stage (1:100%, 2:70%, 3:50%).
//    */
//   const playSong = (song: Song, stage: number) => {
//     console.log(`Playing Song: ${song.title}, Stage: ${stage}%`);

//     // Clear existing timers
//     if (songTimer) {
//       clearTimeout(songTimer);
//       setSongTimer(null);
//     }

//     // Pause any existing audio
//     if (audioRef.current) {
//       audioRef.current.pause();
//       console.log('Paused existing audio.');
//     }

//     // Create a new audio instance
//     const audio = new Audio(song.src);
//     audioRef.current = audio;
//     setCurrentSongId(song.id);
//     setCurrentSongTitle(song.title);
//     console.log(`Current Song ID set to: ${song.id}, Title: ${song.title}`);

//     // Play the song
//     audio.play().then(() => {
//       console.log('Audio playback started.');
//     }).catch((error) => {
//       console.error('Error playing audio:', error);
//       setCurrentSongId(null);
//       setCurrentSongTitle(null);
//     });

//     // Set the current stage
//     setCurrentStage(stage);
//     console.log(`Current Stage set to: ${stage}%`);

//     // Enable the "Give Point" button
//     setIsGivingPoint(true);
//     console.log('Give Point button enabled.');

//     // Set timer to pause the song after 3 seconds
//     const timeout = setTimeout(() => {
//       audio.pause();
//       setIsGivingPoint(false);
//       setCurrentSongId(null);
//       setCurrentSongTitle(null);
//       setCurrentStage(null);
//       console.log('Audio paused automatically after 3 seconds.');
//     }, 3000); // 3 seconds
//     setSongTimer(timeout);
//   };

//   /**
//    * Plays all songs sequentially with a 3-second interval between each.
//    */
//   const playAllSongs = () => {
//     console.log('Playing all songs sequentially.');

//     // Pause any existing audio
//     if (audioRef.current) {
//       audioRef.current.pause();
//       console.log('Paused existing audio.');
//     }

//     // Clear timers
//     if (songTimer) {
//       clearTimeout(songTimer);
//       setSongTimer(null);
//     }

//     setCurrentSongId(null);
//     setCurrentSongTitle('Бүх дуунуудыг тоглуулж байна...');
//     setIsGivingPoint(false);
//     setCurrentStage(null);
//     console.log('Reset current song and stage.');

//     allSongs.forEach((song, index) => {
//       setTimeout(() => {
//         const audio = new Audio(song.src);
//         audio.play().then(() => {
//           console.log(`Playing song ${song.title} (${index + 1}/${allSongs.length})`);
//         }).catch((error) => {
//           console.error(`Error playing song ${song.title}:`, error);
//         });
//       }, index * 3000); // Play each song 3 seconds apart
//     });

//     // Clear the message after all songs have played
//     const totalDuration = allSongs.length * 3000;
//     const finalTimeout = setTimeout(() => {
//       setCurrentSongTitle(null);
//       console.log('All songs have been played.');
//     }, totalDuration);
//     setSongTimer(finalTimeout);
//   };

//   /**
//    * Handles assigning points to the selected team based on the current stage.
//    * @param song The song for which points are being assigned.
//    */
//   const handleGivePoint = (song: Song) => {
//     console.log(`Giving points for Song: ${song.title}, Stage: ${currentStage}%`);

//     if (selectedTeamId === null) {
//       alert('Та оноо нэмэх багыг сонгоно уу!');
//       return;
//     }

//     if (currentStage === null) {
//       alert('Оноо өгөх нөхцөлд алдаа гарлаа!');
//       return;
//     }

//     let earnedPoints = 0;

//     if (currentStage === 1) {
//       earnedPoints = song.points; // 100%
//     } else if (currentStage === 2) {
//       earnedPoints = Math.round(song.points * 0.7); // 70%
//     } else if (currentStage === 3) {
//       earnedPoints = Math.round(song.points * 0.5); // 50%
//     }

//     console.log(`Earned Points: ${earnedPoints}`);

//     if (earnedPoints > 0) {
//       // Assign points to the selected team
//       setTeams((prevTeams) =>
//         prevTeams.map((team) =>
//           team.id === selectedTeamId ? { ...team, score: team.score + earnedPoints } : team
//         )
//       );

//       console.log(`Assigned ${earnedPoints} points to Team ID ${selectedTeamId}`);

//       alert(`Та ${earnedPoints} оноо авлаа!`);

//       // Disable the "Give Point" button
//       setIsGivingPoint(false);
//       console.log('Give Point button disabled.');

//       // Disable the song from further interactions by marking it as guessed
//       setFilteredSongs((prevSongs) =>
//         prevSongs.map((s) =>
//           s.id === song.id ? { ...s, guessed: true } : s
//         )
//       );
//       console.log(`Song ID ${song.id} marked as guessed.`);

//       // Clear the song timer to prevent automatic pause
//       if (songTimer) {
//         clearTimeout(songTimer);
//         setSongTimer(null);
//         console.log('Song timer cleared.');
//       }

//       // Proceed to the next stage automatically after assigning points
//       if (currentStage < 3) {
//         // Automatically proceed to the next stage after a short delay
//         setTimeout(() => {
//           // Find the song again
//           const songToPlay = allSongs.find((s) => s.id === song.id);
//           if (songToPlay) {
//             playSong(songToPlay, currentStage + 1);
//           }
//         }, 1000); // 1 second delay
//       } else {
//         // After the last stage, allow the user to select the next team manually
//         setCurrentStage(null);
//         console.log('Reached final stage. Awaiting next action.');
//       }
//     } else {
//       alert('Оноо өгөх хугацаа дууссан байна!');
//       console.log('No points awarded due to time expiration.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <header className="mb-8 text-center">
//           <h1 className="text-4xl font-bold text-indigo-600">Song Trivia Game</h1>
//           <p className="mt-2 text-gray-600">Та дуу сонгож, оноо цуглуулаарай!</p>
//         </header>

//         {/* Team Scores */}
//         <div className="mb-6">
//           <TeamScores
//             teams={teams}
//             selectedTeamId={selectedTeamId}
//             setSelectedTeamId={setSelectedTeamId}
//           />
//         </div>

//         {/* Selected Team Indicator */}
//         <div className="mb-6">
//           <div className="mb-4 text-center">
//             {selectedTeamId ? (
//               <p className="text-xl">
//                 <span className="font-semibold text-indigo-600">Сонгосон баг:</span>{' '}
//                 {teams.find((team) => team.id === selectedTeamId)?.name}
//               </p>
//             ) : (
//               <p className="text-xl text-red-500">Та багыг сонгоно уу!</p>
//             )}
//           </div>
//           <GenreSelector
//             genres={genres}
//             selectedGenre={selectedGenre}
//             setSelectedGenre={setSelectedGenre}
//           />
//         </div>

//         {/* Song List */}
//         <div className="mb-6">
//           {selectedGenre ? (
//             <h2 className="text-2xl font-semibold mb-4">{selectedGenre}</h2>
//           ) : (
//             <h2 className="text-2xl font-semibold mb-4">Бүх Төрлүүд</h2>
//           )}
//           <SongList
//             songs={filteredSongs}
//             handleSongClick={handleSongClick}
//             handleGivePoint={handleGivePoint}
//             isGivingPoint={isGivingPoint && currentSongId !== null}
//             currentStage={currentStage}
//             currentSongId={currentSongId}
//           />
//         </div>

//         {/* Footer */}
//         <footer className="mt-8 text-center">
//           <div className="text-xl">
//             {currentSongTitle && (
//               <span className="font-semibold text-indigo-700">Тоглож байна:</span>
//             )}{' '}
//             {currentSongTitle}
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Home;

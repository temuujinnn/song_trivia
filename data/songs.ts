// data/songs.ts

export type Genre =
  | "Киноны дуу"
  | "Орчин үеийн дуу"
  | "Хуучины дуу"
  | "Шал random дуу";
export type Points = 1 | 2 | 3 | 4 | 5;

export interface Song {
  id: number;
  title: string;
  genre: Genre;
  points: Points;
  src: string;
  guessed: boolean; // Tracks if the song has been guessed
}

export const genres: Genre[] = [
  "Киноны дуу",
  "Орчин үеийн дуу",
  "Хуучины дуу",
  "Шал random дуу",
];

export const songs: Song[] = [
  // Киноны дуу
  {
    id: 1,
    title: "Киноны дуу 1",
    genre: "Киноны дуу",
    points: 1,
    src: "/songs/song_1.mp3",
    guessed: false,
  },
  {
    id: 2,
    title: "Киноны дуу 2",
    genre: "Киноны дуу",
    points: 2,
    src: "/songs/song_2.mp3",
    guessed: false,
  },
  {
    id: 3,
    title: "Киноны дуу 3",
    genre: "Киноны дуу",
    points: 3,
    src: "/songs/song_3.mp3",
    guessed: false,
  },
  {
    id: 4,
    title: "Киноны дуу 4",
    genre: "Киноны дуу",
    points: 4,
    src: "/songs/song_4.mp3",
    guessed: false,
  },
  {
    id: 5,
    title: "Киноны дуу 5",
    genre: "Киноны дуу",
    points: 5,
    src: "/songs/song_5.mp3",
    guessed: false,
  },
  // Орчин үеийн дуу
  {
    id: 6,
    title: "Орчин үеийн дуу 1",
    genre: "Орчин үеийн дуу",
    points: 1,
    src: "/songs/song_6.mp3",
    guessed: false,
  },
  {
    id: 7,
    title: "Орчин үеийн дуу 2",
    genre: "Орчин үеийн дуу",
    points: 2,
    src: "/songs/song_7.mp3",
    guessed: false,
  },
  {
    id: 8,
    title: "Орчин үеийн дуу 3",
    genre: "Орчин үеийн дуу",
    points: 3,
    src: "/songs/song_8.mp3",
    guessed: false,
  },
  {
    id: 9,
    title: "Орчин үеийн дуу 4",
    genre: "Орчин үеийн дуу",
    points: 4,
    src: "/songs/song_9.mp3",
    guessed: false,
  },
  {
    id: 10,
    title: "Орчин үеийн дуу 5",
    genre: "Орчин үеийн дуу",
    points: 5,
    src: "/songs/song_10.mp3",
    guessed: false,
  },
  // Хуучины дуу
  {
    id: 11,
    title: "Хуучины дуу 1",
    genre: "Хуучины дуу",
    points: 1,
    src: "/songs/song_11.mp3",
    guessed: false,
  },
  {
    id: 12,
    title: "Хуучины дуу 2",
    genre: "Хуучины дуу",
    points: 2,
    src: "/songs/song_12.mp3",
    guessed: false,
  },
  {
    id: 13,
    title: "Хуучины дуу 3",
    genre: "Хуучины дуу",
    points: 3,
    src: "/songs/song_13.mp3",
    guessed: false,
  },
  {
    id: 14,
    title: "Хуучины дуу 4",
    genre: "Хуучины дуу",
    points: 4,
    src: "/songs/song_14.mp3",
    guessed: false,
  },
  {
    id: 15,
    title: "Хуучины дуу 5",
    genre: "Хуучины дуу",
    points: 5,
    src: "/songs/song_15.mp3",
    guessed: false,
  },

  // Шал random дуу
  {
    id: 16,
    title: "Шал random дуу 1",
    genre: "Шал random дуу",
    points: 1,
    src: "/songs/song_6.mp3",
    guessed: false,
  },
  {
    id: 17,
    title: "Шал random дуу 2",
    genre: "Шал random дуу",
    points: 2,
    src: "/songs/song_17.mp3",
    guessed: false,
  },
  {
    id: 18,
    title: "Шал random дуу 3",
    genre: "Шал random дуу",
    points: 3,
    src: "/songs/song_18.mp3",
    guessed: false,
  },
  {
    id: 19,
    title: "Шал random дуу 4",
    genre: "Шал random дуу",
    points: 4,
    src: "/songs/song_19.mp3",
    guessed: false,
  },
  {
    id: 20,
    title: "Шал random дуу 5",
    genre: "Шал random дуу",
    points: 5,
    src: "/songs/song_20.mp3",
    guessed: false,
  },

  // Add more songs as needed
];

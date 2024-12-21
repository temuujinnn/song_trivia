// data/teams.ts

export interface Team {
  id: number;
  name: string;
  score: number;
}

export const initialTeams: Team[] = [
  {id: 1, name: "Баг 1", score: 0},
  {id: 2, name: "Баг 2", score: 0},
  {id: 3, name: "Баг 3", score: 0},
];

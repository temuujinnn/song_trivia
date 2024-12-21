// components/TeamScores.tsx

"use client";

import React from "react";
import {Team} from "../data/teams";

interface TeamScoresProps {
  teams: Team[];
  selectedTeamId: number | null;
  setSelectedTeamId: (id: number) => void;
}

const TeamScores: React.FC<TeamScoresProps> = ({
  teams,
  selectedTeamId,
  setSelectedTeamId,
}) => {
  return (
    <div className="flex justify-around mb-6">
      {teams.map((team) => (
        <div
          key={team.id}
          className={`flex flex-col items-center p-4 bg-white shadow-md rounded-lg cursor-pointer ${
            selectedTeamId === team.id ? "border-4 border-indigo-500" : "border"
          }`}
          onClick={() => setSelectedTeamId(team.id)}
        >
          <h3 className="text-lg font-semibold">{team.name}</h3>
          <p className="text-2xl font-bold text-indigo-600">
            {team.score} Оноо
          </p>
        </div>
      ))}
    </div>
  );
};

export default TeamScores;

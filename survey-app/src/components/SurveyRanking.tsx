"use client";

import React, { useMemo } from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import { withSurveyAnalytics } from './withSurveyAnalytics';

interface SurveyRankingProps {
  analytics?: {
    totalVotes: number;
    totalSurveys: number;
    averageVotesPerSurvey: number;
  };
}

const SurveyRanking: React.FC<SurveyRankingProps> = ({ analytics }) => {
  const { votes, surveys, hasVoted } = useSurvey();

  const sortedSurveys = useMemo(() => {
    return surveys
      .sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0))
      .map(survey => ({
        ...survey,
        voteCount: votes[survey.id] || 0,
        userVoted: hasVoted(survey.id)
      }));
  }, [surveys, votes, hasVoted]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Ranking de Encuestas</h2>
      {analytics && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p>Total de votos: {analytics.totalVotes}</p>
          <p>Promedio de votos: {analytics.averageVotesPerSurvey.toFixed(2)}</p>
        </div>
      )}
      <ul className="space-y-2">
        {sortedSurveys.map(({ id, title, voteCount, userVoted }) => (
          <li key={id} className="p-2 border-b flex justify-between items-center">
            <span className="font-medium">{title}</span>
            <div className="flex items-center">
              <span className="mr-2">{voteCount} votos</span>
              {userVoted && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Votado
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withSurveyAnalytics(SurveyRanking);
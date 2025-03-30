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
  const { votes, surveys, hasVoted, isLoading } = useSurvey();

  const sortedSurveys = useMemo(() => {
    return surveys
      .sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0))
      .map(survey => ({
        ...survey,
        voteCount: votes[survey.id] || 0,
        userVoted: hasVoted(survey.id)
      }));
  }, [surveys, votes, hasVoted]);

  if (isLoading) {
    return (
      <div className="p-5 bg-card rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Survey Ranking</h2>
        <p className="text-muted">Loading ranking...</p>
      </div>
    );
  }

  const maxVotes = sortedSurveys.length > 0 ? Math.max(...sortedSurveys.map(s => s.voteCount)) : 0;

  return (
    <div className="p-5 bg-card rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Survey Ranking</h2>
      {analytics && (
        <div className="mb-5 p-4 bg-background rounded-md border border-border">
          <div className="flex flex-wrap justify-between">
            <div className="mb-2 mr-4">
              <span className="text-muted text-sm">Total Votes</span>
              <p className="text-2xl font-bold text-primary">{analytics.totalVotes}</p>
            </div>
            <div className="mb-2 mr-4">
              <span className="text-muted text-sm">Surveys</span>
              <p className="text-2xl font-bold">{analytics.totalSurveys}</p>
            </div>
            <div className="mb-2">
              <span className="text-muted text-sm">Average Votes</span>
              <p className="text-2xl font-bold text-secondary">{analytics.averageVotesPerSurvey.toFixed(1)}</p>
            </div>
          </div>
        </div>
      )}
      
      {sortedSurveys.length === 0 ? (
        <p className="text-muted text-center py-6">No surveys available to display.</p>
      ) : (
        <ul className="space-y-3">
          {sortedSurveys.map(({ id, title, voteCount, userVoted }) => (
            <li key={id} className="p-3 border-b border-border hover:bg-background/50 transition-colors rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{title}</span>
                <div className="flex items-center">
                  <span className="mr-2 font-bold text-foreground">{voteCount} {voteCount === 1 ? 'vote' : 'votes'}</span>
                  {userVoted && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                      Voted
                    </span>
                  )}
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${maxVotes ? (voteCount / maxVotes) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default withSurveyAnalytics(SurveyRanking);
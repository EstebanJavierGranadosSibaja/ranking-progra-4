"use client";

import React, { createContext, useContext, useMemo, useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Survey {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
}

interface SurveyContextType {
  surveys: Survey[];
  addSurvey: (title: string, description?: string) => void;
  votes: Record<string, number>;
  addVote: (surveyId: string) => void;
  getTopSurveys: (limit?: number) => Survey[];
  getTotalVotes: () => number;
  userVotes: string[];
  hasVoted: (surveyId: string) => boolean;
  isLoading: boolean;
}

const SurveyContext = createContext<SurveyContextType | null>(null);

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [surveys, setSurveys] = useLocalStorage<Survey[]>('surveys', []);
  const [votes, setVotes] = useLocalStorage<Record<string, number>>('votes', {});
  const [userVotes, setUserVotes] = useLocalStorage<string[]>('userVotes', []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const hasVoted = useCallback((surveyId: string) => {
    return userVotes.includes(surveyId);
  }, [userVotes]);

  const addVote = useCallback((surveyId: string) => {
    if (!hasVoted(surveyId)) {
      setVotes(prev => ({
        ...prev,
        [surveyId]: (prev[surveyId] || 0) + 1,
      }));
      setUserVotes(prev => [...prev, surveyId]);
    }
  }, [setVotes, hasVoted, setUserVotes]);

  const addSurvey = useCallback((title: string, description?: string) => {
    setSurveys(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title,
        description,
        createdAt: new Date().toISOString(),
      }
    ]);
  }, [setSurveys]);

  const getTopSurveys = useCallback((limit?: number) => {
    return [...surveys]
      .sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0))
      .slice(0, limit);
  }, [surveys, votes]);

  const getTotalVotes = useCallback(() => {
    return Object.values(votes).reduce((sum, count) => sum + count, 0);
  }, [votes]);

  const value = useMemo(() => ({
    surveys,
    addSurvey,
    votes,
    addVote,
    getTopSurveys,
    getTotalVotes,
    userVotes,
    hasVoted,
    isLoading
  }), [
    surveys, 
    addSurvey, 
    votes, 
    addVote, 
    getTopSurveys, 
    getTotalVotes, 
    userVotes, 
    hasVoted, 
    isLoading
  ]);

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};

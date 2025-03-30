"use client";

import React, { useState } from 'react';
import { useSurvey } from '../contexts/SurveyContext';

const SurveyForm: React.FC = () => {
  const { surveys, addVote, addSurvey, hasVoted, isLoading } = useSurvey();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addSurvey(newTitle, newDescription);
      setNewTitle('');
      setNewDescription('');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-6 card">
        <p className="text-muted">Loading surveys...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 card">
      <h2 className="text-xl font-semibold mb-4">Create New Survey</h2>
      <form onSubmit={handleSubmitNew} className="space-y-4">
        <div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New survey title"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full p-2 border rounded mt-2 focus:ring-2 focus:ring-primary focus:border-primary"
            rows={3}
          />
          <button 
            type="submit"
            className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
          >
            Create Survey
          </button>
        </div>
      </form>

      <div className="space-y-3 mt-6">
        <h3 className="font-bold text-lg">Available Surveys</h3>
        {surveys.length === 0 ? (
          <p className="text-muted">No surveys available.</p>
        ) : (
          surveys.map(survey => {
            const alreadyVoted = hasVoted(survey.id);
            return (
              <div key={survey.id} className="p-4 border rounded bg-card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-card-foreground">{survey.title}</h4>
                    {survey.description && (
                      <p className="text-sm text-muted mt-1">{survey.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => addVote(survey.id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      alreadyVoted 
                        ? 'bg-muted text-card-foreground cursor-not-allowed' 
                        : 'bg-success text-white hover:bg-success/90'
                    }`}
                    disabled={alreadyVoted}
                  >
                    {alreadyVoted ? '✓ Voted' : 'Vote'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SurveyForm;
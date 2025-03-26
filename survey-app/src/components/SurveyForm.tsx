"use client";

import React, { useState } from 'react';
import { useSurvey } from '../contexts/SurveyContext';

const SurveyForm: React.FC = () => {
  const { surveys, addVote, addSurvey, hasVoted } = useSurvey();
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

  return (
    <div className="p-4 space-y-6">
      <form onSubmit={handleSubmitNew} className="space-y-4">
        <div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Título de nueva encuesta"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Descripción (opcional)"
            className="w-full p-2 border rounded mt-2"
          />
          <button 
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Crear Encuesta
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <h3 className="font-bold">Encuestas Disponibles</h3>
        {surveys.map(survey => {
          const alreadyVoted = hasVoted(survey.id);
          return (
            <div key={survey.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <h4 className="font-medium">{survey.title}</h4>
                {survey.description && (
                  <p className="text-sm text-gray-600">{survey.description}</p>
                )}
              </div>
              <button
                onClick={() => addVote(survey.id)}
                className={`px-3 py-1 rounded ${
                  alreadyVoted 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
                disabled={alreadyVoted}
              >
                {alreadyVoted ? 'Votado' : 'Votar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SurveyForm;
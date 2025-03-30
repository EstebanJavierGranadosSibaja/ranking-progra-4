"use client";

import React from 'react';

import SurveyForm from '../components/SurveyForm';
import SurveyRanking from '../components/SurveyRanking';

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Survey System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <SurveyForm />
        </div>
        <div>
          <SurveyRanking />
        </div>
      </div>
    </main>
  );
}
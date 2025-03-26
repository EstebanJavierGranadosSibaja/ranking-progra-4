import React from 'react';
import { useSurvey } from '../contexts/SurveyContext';

export const withSurveyAnalytics = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithSurveyAnalyticsComponent(props: P) {
    const { votes, surveys, getTotalVotes } = useSurvey();
    
    const analytics = {
      totalVotes: getTotalVotes(),
      totalSurveys: surveys.length,
      averageVotesPerSurvey: surveys.length ? getTotalVotes() / surveys.length : 0,
    };

    return <WrappedComponent {...props} analytics={analytics} />;
  };
};
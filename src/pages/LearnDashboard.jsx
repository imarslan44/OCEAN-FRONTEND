import React from 'react';
import Map from '../components/Learn.components/map';
import { skills } from '../SKILLS/SKILLS.JS';

const LearnDashboard = () => {
  return (
    <div className="theme-learn pb-24 pt-8 bg-background min-h-screen transition-colors duration-300">
      <div className="px-6 mb-2">
        <h1 className="text-3xl font-display-lg font-bold text-on-surface">Learn</h1>
        <p className="text-on-surface-variant mt-1 text-sm">Master human behavior step by step.</p>
      </div>
      
      {/* Map Component taking the parsed skills directly */}
      <Map skillsData={skills} />
      
    </div>
  );
};

export default LearnDashboard;

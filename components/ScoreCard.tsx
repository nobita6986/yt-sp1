
import React from 'react';

interface ScoreCardProps {
  title: string;
  score: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, score }) => {
  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-brand-success';
    if (s >= 60) return 'text-brand-warning';
    return 'text-brand-danger';
  };

  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-brand-bg p-4 rounded-lg flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full" viewBox="0 0 60 60">
          <circle
            className="text-brand-border"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="28"
            cx="30"
            cy="30"
          />
          <circle
            className={getScoreColor(score)}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="28"
            cx="30"
            cy="30"
            transform="rotate(-90 30 30)"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-brand-text-secondary">{title}</p>
    </div>
  );
};

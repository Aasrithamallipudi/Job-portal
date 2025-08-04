import React from 'react';
import { MapPin, Clock, DollarSign, Users, Briefcase } from 'lucide-react';
import { Job } from '../../types';
import { Button } from '../common/Button';

interface JobCardProps {
  job: Job;
  matchScore?: number;
  onApply?: (jobId: string) => void;
  showMatchScore?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  matchScore, 
  onApply, 
  showMatchScore = false 
}) => {
  const formatSalary = (salary: Job['salary']) => {
    if (!salary) return null;
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
              {job.title}
            </h3>
            {showMatchScore && matchScore && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMatchScoreColor(matchScore)}`}>
                {matchScore}% match
              </span>
            )}
          </div>
          <p className="text-blue-600 font-medium mb-2">{job.company}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDate(job.postedAt)}
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            +{job.skills.length - 4} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {job.salary && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {formatSalary(job.salary)}
            </div>
          )}
          {job.budget && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              ${job.budget.toLocaleString()} budget
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {job.applicants} applicants
          </div>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={() => onApply?.(job.id)}
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
};
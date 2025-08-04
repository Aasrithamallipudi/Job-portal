import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Target, TrendingUp } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Web3Provider } from './context/Web3Context';
import { AuthForm } from './components/auth/AuthForm';
import { Header } from './components/layout/Header';
import { JobCard } from './components/jobs/JobCard';
import { CreateJobModal } from './components/jobs/CreateJobModal';
import { PostCard } from './components/feed/PostCard';
import { CreatePostModal } from './components/feed/CreatePostModal';
import { ProfileView } from './components/profile/ProfileView';
import { Button } from './components/common/Button';
import { DataService } from './services/dataService';
import { AIService } from './services/aiService';
import { Job, Post, JobMatch } from './types';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  useEffect(() => {
    if (user) {
      loadJobs();
      loadPosts();
    }
  }, [user]);

  const loadJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const jobsData = await DataService.getJobs();
      setJobs(jobsData);
      
      if (user) {
        const matches = AIService.getJobRecommendations(user, jobsData);
        setJobMatches(matches);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const loadPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const postsData = await DataService.getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);
    if (user) {
      const updatedMatches = AIService.getJobRecommendations(user, [newJob, ...jobs]);
      setJobMatches(updatedMatches);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleApplyToJob = (jobId: string) => {
    alert(`Applied to job ${jobId}! This would typically redirect to an application form.`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderFeedContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0)}
            </div>
          )}
          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="flex-1 text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            Share your professional insights...
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreatePostModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Post
          </Button>
        </div>
      </div>

      {isLoadingPosts ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpdate={loadPosts}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderJobsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Opportunities</h2>
          <p className="text-gray-600">Discover your next career move</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateJobModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Post Job
        </Button>
      </div>

      {jobMatches.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">AI-Recommended Jobs</h3>
          </div>
          <div className="grid gap-4">
            {jobMatches.slice(0, 3).map((match) => (
              <JobCard
                key={match.job.id}
                job={match.job}
                matchScore={match.matchScore}
                onApply={handleApplyToJob}
                showMatchScore
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Jobs</h3>
        {isLoadingJobs ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={handleApplyToJob}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'feed' && renderFeedContent()}
        {activeTab === 'jobs' && renderJobsContent()}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      <CreateJobModal
        isOpen={isCreateJobModalOpen}
        onClose={() => setIsCreateJobModalOpen(false)}
        onJobCreated={handleJobCreated}
      />

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <AppContent />
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;
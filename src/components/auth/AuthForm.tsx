import React, { useState } from 'react';
import { Mail, Lock, User, MapPin, Building, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { AIService } from '../../services/aiService';

export const AuthForm: React.FC = () => {
  const { login, register, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    bio: '',
    location: '',
    title: '',
    company: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email || !formData.password) {
      setErrors({ general: 'Please fill in all required fields' });
      return;
    }

    let success = false;
    if (isLoginMode) {
      success = await login(formData.email, formData.password);
    } else {
      if (!formData.name) {
        setErrors({ name: 'Name is required' });
        return;
      }
      
      // Extract skills from bio using AI
      const extractedSkills = formData.bio ? 
        AIService.extractSkillsFromText(formData.bio) : 
        [];

      success = await register({
        ...formData,
        skills: extractedSkills,
      });
    }

    if (!success) {
      setErrors({ general: 'Authentication failed. Please try again.' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">JobHub</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            {isLoginMode ? 'Welcome back' : 'Join the network'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLoginMode ? 'Sign in to your account' : 'Create your professional profile'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginMode && (
              <Input
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                icon={<User className="h-4 w-4 text-gray-400" />}
                error={errors.name}
                required
              />
            )}

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail className="h-4 w-4 text-gray-400" />}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock className="h-4 w-4 text-gray-400" />}
              error={errors.password}
              required
            />

            {!isLoginMode && (
              <>
                <Input
                  label="Professional Title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  icon={<Briefcase className="h-4 w-4 text-gray-400" />}
                  placeholder="e.g., Senior Software Engineer"
                />

                <Input
                  label="Company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  icon={<Building className="h-4 w-4 text-gray-400" />}
                  placeholder="e.g., TechCorp Inc."
                />

                <Input
                  label="Location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  icon={<MapPin className="h-4 w-4 text-gray-400" />}
                  placeholder="e.g., San Francisco, CA"
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Tell us about your experience and skills. Our AI will extract your skills automatically!"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Mention your skills and experience - our AI will automatically detect and add them to your profile
                  </p>
                </div>
              </>
            )}

            {errors.general && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                {errors.general}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {isLoginMode ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {isLoginMode 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
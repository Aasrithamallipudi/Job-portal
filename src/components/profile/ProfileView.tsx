import React, { useState } from 'react';
import { Edit2, MapPin, Building, Briefcase, ExternalLink, Brain, Lightbulb } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { AIService } from '../../services/aiService';

export const ProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    title: user?.title || '',
    company: user?.company || '',
    linkedinUrl: user?.linkedinUrl || '',
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  React.useEffect(() => {
    if (user) {
      setSuggestions(AIService.generateSmartSuggestions(user));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract skills from updated bio
    const extractedSkills = formData.bio ? 
      AIService.extractSkillsFromText(formData.bio) : 
      user?.skills || [];

    updateProfile({
      ...formData,
      skills: extractedSkills,
    });
    setIsEditing(false);
  };

  const handleExtractSkills = () => {
    if (formData.bio) {
      const extractedSkills = AIService.extractSkillsFromText(formData.bio);
      updateProfile({
        ...formData,
        skills: extractedSkills,
      });
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-16">
            <div className="flex items-end space-x-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-32 w-32 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="h-32 w-32 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="pb-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                {user.title && (
                  <p className="text-lg text-gray-600">{user.title}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  {user.company && (
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{user.company}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="mb-2"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{user.bio}</p>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExtractSkills}
                className="text-blue-600"
              >
                <Brain className="h-4 w-4 mr-1" />
                AI Extract
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
              </div>
              {user.linkedinUrl && (
                <div>
                  <p className="text-sm text-gray-600">LinkedIn</p>
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    View Profile
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-900">AI Suggestions</h3>
            </div>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-purple-800">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Professional Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              icon={<Briefcase className="h-4 w-4 text-gray-400" />}
            />
            <Input
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              icon={<Building className="h-4 w-4 text-gray-400" />}
            />
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              icon={<MapPin className="h-4 w-4 text-gray-400" />}
            />
            <div className="md:col-span-2">
              <Input
                label="LinkedIn URL"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                icon={<ExternalLink className="h-4 w-4 text-gray-400" />}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Professional Bio
            </label>
            <textarea
              name="bio"
              rows={6}
              value={formData.bio}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Tell us about your experience, achievements, and professional goals..."
            />
            <p className="text-xs text-gray-500">
              💡 Our AI will automatically extract and update your skills based on your bio
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
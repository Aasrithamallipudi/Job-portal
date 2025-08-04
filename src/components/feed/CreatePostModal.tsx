import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/dataService';
import { Post } from '../../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [type, setType] = useState<Post['type']>('update');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const newPost = await DataService.createPost({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        userTitle: user.title,
        content: content.trim(),
        type,
      });
      
      onPostCreated(newPost);
      onClose();
      setContent('');
      setType('update');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const postTypes = [
    { value: 'update', label: 'Career Update' },
    { value: 'advice', label: 'Professional Advice' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'question', label: 'Question' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a Post" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {user?.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{user?.name}</h3>
            {user?.title && (
              <p className="text-sm text-gray-600">{user.title}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Post Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Post['type'])}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {postTypes.map((postType) => (
              <option key={postType.value} value={postType.value}>
                {postType.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            What's on your mind?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, experiences, or questions with the community..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={6}
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!content.trim()}
          >
            Post
          </Button>
        </div>
      </form>
    </Modal>
  );
};
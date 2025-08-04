import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Post } from '../../types';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/dataService';

interface PostCardProps {
  post: Post;
  onUpdate?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d`;
    return `${Math.floor(diffHours / 168)}w`;
  };

  const getPostTypeColor = (type: Post['type']) => {
    switch (type) {
      case 'achievement': return 'bg-green-100 text-green-800';
      case 'advice': return 'bg-blue-100 text-blue-800';
      case 'update': return 'bg-purple-100 text-purple-800';
      case 'question': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLike = async () => {
    if (!user || isLiking) return;
    
    setIsLiking(true);
    try {
      await DataService.likePost(post.id);
      onUpdate?.();
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    if (!user || !newComment.trim() || isCommenting) return;
    
    setIsCommenting(true);
    try {
      await DataService.addComment(post.id, {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content: newComment.trim(),
      });
      setNewComment('');
      onUpdate?.();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {post.userAvatar ? (
              <img
                src={post.userAvatar}
                alt={post.userName}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {post.userName.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{post.userName}</h3>
              {post.userTitle && (
                <p className="text-sm text-gray-600">{post.userTitle}</p>
              )}
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPostTypeColor(post.type)}`}>
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-2 text-sm transition-colors ${
                post.isLiked 
                  ? 'text-red-600 hover:text-red-700' 
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100">
          {/* Existing Comments */}
          {post.comments.length > 0 && (
            <div className="px-4 py-3 space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  {comment.userAvatar ? (
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
                      {comment.userName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-sm font-medium text-gray-900">{comment.userName}</p>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          {user && (
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex space-x-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      onClick={handleComment}
                      disabled={!newComment.trim() || isCommenting}
                      isLoading={isCommenting}
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
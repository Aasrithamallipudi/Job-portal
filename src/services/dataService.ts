import { Job, Post, User } from '../types';

export class DataService {
  private static jobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      description: 'We are looking for a skilled frontend developer with expertise in React, TypeScript, and modern web technologies. You will be working on cutting-edge projects and collaborating with a talented team.',
      company: 'TechFlow Inc.',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: { min: 120000, max: 180000, currency: 'USD' },
      skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
      postedBy: '1',
      postedAt: new Date('2024-01-15'),
      status: 'active',
      applicants: 45,
    },
    {
      id: '2',
      title: 'Blockchain Developer',
      description: 'Join our Web3 team and help build the future of decentralized applications. Experience with Solidity, smart contracts, and DeFi protocols required.',
      company: 'CryptoVentures',
      location: 'Remote',
      type: 'contract',
      budget: 15000,
      skills: ['Solidity', 'Web3', 'Ethereum', 'Smart Contracts', 'JavaScript'],
      postedBy: '2',
      postedAt: new Date('2024-01-14'),
      status: 'active',
      applicants: 23,
    },
    {
      id: '3',
      title: 'Full-Stack Engineer',
      description: 'Looking for a versatile full-stack engineer to work on our SaaS platform. Experience with Node.js, React, and cloud technologies preferred.',
      company: 'DataSync Solutions',
      location: 'New York, NY',
      type: 'full-time',
      salary: { min: 100000, max: 140000, currency: 'USD' },
      skills: ['Node.js', 'React', 'MongoDB', 'AWS', 'Docker'],
      postedBy: '3',
      postedAt: new Date('2024-01-13'),
      status: 'active',
      applicants: 67,
    },
    {
      id: '4',
      title: 'AI/ML Engineer',
      description: 'Exciting opportunity to work on machine learning projects. Experience with Python, TensorFlow, and data science required.',
      company: 'AI Innovations',
      location: 'Austin, TX',
      type: 'full-time',
      salary: { min: 130000, max: 200000, currency: 'USD' },
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'Deep Learning', 'Data Science'],
      postedBy: '4',
      postedAt: new Date('2024-01-12'),
      status: 'active',
      applicants: 89,
    },
  ];

  private static posts: Post[] = [
    {
      id: '1',
      userId: '2',
      userName: 'Sarah Chen',
      userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      userTitle: 'Product Manager at TechCorp',
      content: 'Just launched our new feature! Working with cross-functional teams has been an incredible learning experience. The key is clear communication and setting realistic expectations. #ProductManagement #TeamWork',
      type: 'achievement',
      likes: 24,
      comments: [
        {
          id: '1',
          userId: '3',
          userName: 'Mike Johnson',
          content: 'Congratulations! Looking forward to trying it out.',
          createdAt: new Date('2024-01-15T10:30:00'),
        }
      ],
      createdAt: new Date('2024-01-15T09:00:00'),
    },
    {
      id: '2',
      userId: '3',
      userName: 'David Rodriguez',
      userAvatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      userTitle: 'Senior Software Engineer',
      content: 'Career advice for junior developers: 1) Focus on fundamentals first 2) Build projects that solve real problems 3) Don\'t be afraid to ask questions 4) Contribute to open source when possible. What would you add to this list?',
      type: 'advice',
      likes: 156,
      comments: [
        {
          id: '2',
          userId: '1',
          userName: 'Alex Johnson',
          content: 'Great advice! I\'d add: Learn to read documentation effectively.',
          createdAt: new Date('2024-01-14T14:20:00'),
        },
        {
          id: '3',
          userId: '4',
          userName: 'Lisa Park',
          content: 'Network with other developers and attend meetups!',
          createdAt: new Date('2024-01-14T15:45:00'),   
        }
      ],
      createdAt: new Date('2024-01-14T13:00:00'),
    },
    {
      id: '3',
      userId: '4',
      userName: 'Emily Watson',
      userAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      userTitle: 'UX Designer',
      content: 'Exciting news! Just completed my certification in AI/UX Design. The intersection of artificial intelligence and user experience is fascinating. Looking forward to applying these new skills in upcoming projects.',
      type: 'update',
      likes: 89,
      comments: [],
      createdAt: new Date('2024-01-13T16:00:00'),
    },
  ];

  static async getJobs(): Promise<Job[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.jobs];
  }

  static async getJobById(id: string): Promise<Job | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.jobs.find(job => job.id === id) || null;
  }

  static async createJob(jobData: Omit<Job, 'id' | 'postedAt' | 'applicants'>): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      postedAt: new Date(),
      applicants: 0,
    };
    
    this.jobs.unshift(newJob);
    return newJob;
  }

  static async getPosts(): Promise<Post[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...this.posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date(),
      likes: 0,
      comments: [],
    };
    
    this.posts.unshift(newPost);
    return newPost;
  }

  static async likePost(postId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      post.isLiked = true;
    }
  }

  static async addComment(postId: string, comment: Omit<import('../types').Comment, 'id' | 'createdAt'>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      const newComment: import('../types').Comment = {
        ...comment,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      post.comments.push(newComment);
    }
  }
}
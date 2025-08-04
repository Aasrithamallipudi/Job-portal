import { User, Job, JobMatch } from '../types';

export class AIService {
  static extractSkillsFromText(text: string): string[] {
    // Mock skill extraction using basic keyword matching
    const skillKeywords = [
      'JavaScript', 'Python', 'Java', 'React', 'Angular', 'Vue.js', 'Node.js',
      'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Ruby on Rails',
      'HTML', 'CSS', 'Sass', 'TypeScript', 'PHP', 'C++', 'C#', 'Go', 'Rust',
      'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API',
      'AWS', 'Docker', 'Kubernetes', 'Git', 'Linux', 'DevOps', 'CI/CD',
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas',
      'Blockchain', 'Solidity', 'Web3', 'Smart Contracts', 'Ethereum', 'Solana',
      'UI/UX', 'Figma', 'Photoshop', 'Illustrator', 'Design Systems',
      'Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication'
    ];

    const foundSkills = skillKeywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    // Add some randomness to make it more realistic
    if (foundSkills.length < 3) {
      const randomSkills = skillKeywords
        .filter(skill => !foundSkills.includes(skill))
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.max(0, 5 - foundSkills.length));
      foundSkills.push(...randomSkills);
    }

    return foundSkills.slice(0, 8);
  }

  static calculateJobMatch(user: User, job: Job): JobMatch {
    const userSkills = user.skills.map(s => s.toLowerCase());
    const jobSkills = job.skills.map(s => s.toLowerCase());
    
    // Calculate skill overlap
    const matchingSkills = userSkills.filter(skill => 
      jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
    );
    
    const skillMatchPercentage = jobSkills.length > 0 
      ? (matchingSkills.length / jobSkills.length) * 100 
      : 0;

    // Factor in location, bio keywords, etc.
    let locationBonus = 0;
    if (user.location && job.location) {
      const userLocation = user.location.toLowerCase();
      const jobLocation = job.location.toLowerCase();
      if (userLocation.includes(jobLocation) || jobLocation.includes(userLocation) || 
          jobLocation.includes('remote') || userLocation.includes('remote')) {
        locationBonus = 10;
      }
    }

    // Bio relevance check
    const bioRelevance = job.description.toLowerCase().split(' ')
      .some(word => user.bio.toLowerCase().includes(word)) ? 5 : 0;

    const totalScore = Math.min(95, skillMatchPercentage + locationBonus + bioRelevance);

    const matchReasons = [];
    if (matchingSkills.length > 0) {
      matchReasons.push(`${matchingSkills.length} matching skills: ${matchingSkills.slice(0, 3).join(', ')}`);
    }
    if (locationBonus > 0) {
      matchReasons.push('Location compatibility');
    }
    if (bioRelevance > 0) {
      matchReasons.push('Relevant experience in bio');
    }

    return {
      job,
      matchScore: Math.round(totalScore),
      matchReasons,
    };
  }

  static getJobRecommendations(user: User, jobs: Job[], limit: number = 5): JobMatch[] {
    return jobs
      .map(job => this.calculateJobMatch(user, job))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  static generateSmartSuggestions(user: User): string[] {
    const suggestions = [
      `Consider adding "${this.getRandomSkill()}" to your skillset`,
      'Update your LinkedIn profile to attract more opportunities',
      'Connect with professionals in your field',
      'Share your recent projects or achievements',
      'Join relevant professional groups',
      'Consider getting certified in trending technologies',
    ];

    return suggestions.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  private static getRandomSkill(): string {
    const trendingSkills = [
      'GraphQL', 'Kubernetes', 'Microservices', 'Serverless', 'JAMstack',
      'Next.js', 'Svelte', 'Deno', 'WebAssembly', 'Progressive Web Apps'
    ];
    return trendingSkills[Math.floor(Math.random() * trendingSkills.length)];
  }
}
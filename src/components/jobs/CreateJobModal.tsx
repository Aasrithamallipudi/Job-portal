import React, { useState } from 'react';
import { DollarSign, MapPin, Briefcase, Tag } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';
import { DataService } from '../../services/dataService';
import { Job } from '../../types';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (job: Job) => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onJobCreated,
}) => {
  const { user } = useAuth();
  const { wallet, makePayment } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    type: 'full-time' as Job['type'],
    salaryMin: '',
    salaryMax: '',
    budget: '',
    skills: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.skills.trim()) newErrors.skills = 'Required skills are needed';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    if (!wallet.isConnected) {
      setErrors({ payment: 'Please connect your wallet to post a job' });
      return;
    }

    try {
      setIsPaymentProcessing(true);
      
      // Process blockchain payment (0.001 ETH platform fee)
      const paymentTx = await makePayment(0.001, '0x742d35cc6bf8532c4ea4b23e5dd6b6b50c00e9cd');
      
      if (!paymentTx) {
        setErrors({ payment: 'Payment failed. Please try again.' });
        return;
      }

      setIsPaymentProcessing(false);
      setIsSubmitting(true);

      // Create job after successful payment
      const jobData: Omit<Job, 'id' | 'postedAt' | 'applicants'> = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        postedBy: user.id,
        status: 'active',
        paymentTx,
        ...(formData.salaryMin && formData.salaryMax ? {
          salary: {
            min: parseInt(formData.salaryMin),
            max: parseInt(formData.salaryMax),
            currency: 'USD',
          }
        } : {}),
        ...(formData.budget ? { budget: parseInt(formData.budget) } : {}),
      };

      const newJob = await DataService.createJob(jobData);
      onJobCreated(newJob);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        company: '',
        location: '',
        type: 'full-time',
        salaryMin: '',
        salaryMax: '',
        budget: '',
        skills: '',
      });
    } catch (error) {
      console.error('Failed to create job:', error);
      setErrors({ general: 'Failed to create job. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setIsPaymentProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a New Job" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Senior React Developer"
              error={errors.title}
              required
            />
          </div>

          <Input
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            icon={<Briefcase className="h-4 w-4 text-gray-400" />}
            placeholder="e.g., TechCorp Inc."
            error={errors.company}
            required
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            icon={<MapPin className="h-4 w-4 text-gray-400" />}
            placeholder="e.g., San Francisco, CA or Remote"
            error={errors.location}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Salary Range (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="Min"
                icon={<DollarSign className="h-4 w-4 text-gray-400" />}
              />
              <Input
                name="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="Max"
                icon={<DollarSign className="h-4 w-4 text-gray-400" />}
              />
            </div>
          </div>

          <Input
            label="Project Budget (Optional)"
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleChange}
            icon={<DollarSign className="h-4 w-4 text-gray-400" />}
            placeholder="e.g., 5000"
          />

          <Input
            label="Required Skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            icon={<Tag className="h-4 w-4 text-gray-400" />}
            placeholder="e.g., React, TypeScript, Node.js"
            error={errors.skills}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            name="description"
            rows={6}
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
            required
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Payment Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Platform Fee</h4>
          <p className="text-sm text-blue-700">
            A platform fee of 0.001 ETH (~$2.50) is required to post this job. This helps maintain the quality of our platform.
          </p>
          {!wallet.isConnected && (
            <p className="text-sm text-red-600 mt-2">
              Please connect your wallet to proceed with payment.
            </p>
          )}
        </div>

        {errors.payment && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
            {errors.payment}
          </div>
        )}

        {errors.general && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting || isPaymentProcessing}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting || isPaymentProcessing}
            disabled={!wallet.isConnected}
          >
            {isPaymentProcessing ? 'Processing Payment...' : 'Post Job'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
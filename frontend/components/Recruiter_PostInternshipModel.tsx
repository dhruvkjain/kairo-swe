import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface RecruiterPostInternshipModelProps {
  id: string;
  onClose: () => void;
}

interface InternshipForm {
  title: string;
  category: string;
  location: string;
  Mode: string;
  Type: string;
  userType: string;
  duration: string;
  openings: number;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string[];
  stipendType: string;
  stipendAmount: string;
  perks: string[];
  applicationDeadline: string;
  startDate: string;
  questionsRequired: boolean;
  customQuestions: string[];
}

const Recruiter_PostInternshipModal = ({ id, onClose }: RecruiterPostInternshipModelProps) => {
  const [postStep, setPostStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [internshipForm, setInternshipForm] = useState<InternshipForm>({
    title: '',
    category: '',
    location: '',
    Mode: 'FULL_TIME', // Default value set
    Type: 'REMOTE', // Default value set
    userType: 'STUDENT', // Default value set
    duration: '',
    openings: 1,
    description: '',
    responsibilities: '',
    requirements: '',
    skills: [],
    stipendType: 'PAID', // Default value set
    stipendAmount: '',
    perks: [],
    applicationDeadline: '',
    startDate: '',
    questionsRequired: false,
    customQuestions: []
  });

// --- Validation Functions ---

  const validateStep1 = () => {
    if (!internshipForm.title || !internshipForm.category || !internshipForm.userType || !internshipForm.Mode || !internshipForm.Type || !internshipForm.duration || internshipForm.openings < 1 || !internshipForm.location) {
      alert('Step 1: Please fill in all required fields (Title, Category, User Type, Work Mode, Type, Location, Duration, and Openings).');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!internshipForm.description || !internshipForm.responsibilities || !internshipForm.requirements || internshipForm.skills.length === 0) {
      alert('Step 2: Please fill in the Description, Responsibilities, Requirements, and add at least one Skill.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (internshipForm.stipendType !== 'UNPAID' && !internshipForm.stipendAmount) {
      alert('Step 3: Please provide a Stipend Amount for the selected Stipend Type.');
      return false;
    }
    // Perks are optional, so no check needed here.
    return true;
  };

  const validateStep4 = () => {
    if (!internshipForm.applicationDeadline || !internshipForm.startDate) {
      alert('Step 4: Please set both the Application Deadline and Expected Start Date.');
      return false;
    }
    return true;
  };

// --- Handlers ---

  const handleNext = () => {
    let isValid = false;
    switch (postStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      default:
        isValid = true;
    }

    if (isValid && postStep < 5) {
      setPostStep(postStep + 1);
    }
  };

  const handleBack = () => {
    if (postStep > 1) setPostStep(postStep - 1);
  };

  const handleClose = () => {
    setPostStep(1);
    setInternshipForm({
      title: '', category: '', location: '', Mode: 'FULL_TIME', Type:'REMOTE', userType:'STUDENT', duration: '', openings: 1,
      description: '', responsibilities: '', requirements: '', skills: [],
      stipendType: 'PAID', stipendAmount: '', perks: [], applicationDeadline: '', startDate: '',
      questionsRequired: false, customQuestions: []
    });
    onClose();
  };

  const handlePublish = async () => {
    // Final check on all mandatory fields across all steps
    if (!validateStep1() || !validateStep2() || !validateStep3() || !validateStep4()) {
      alert('Please complete all mandatory fields in the previous steps before publishing.');
      setPostStep(1); // Go back to step 1 for review
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: internshipForm.title,
        slug: internshipForm.title.toLowerCase().replace(/\s+/g, '-'),
        category: internshipForm.category,
        description: internshipForm.description,
        location: internshipForm.location,
        mode: internshipForm.Mode || 'FULL_TIME',
        type: internshipForm.Type || 'REMOTE',
        userType: internshipForm.userType || 'STUDENT',
        durationWeeks: parseInt(internshipForm.duration) || null, // Assuming duration is a number of weeks/months stored as string
        openings: internshipForm.openings,
        stipend: internshipForm.stipendAmount ? parseInt(internshipForm.stipendAmount) : null,
        stipendType: internshipForm.stipendType || 'FIXED',
        perks: internshipForm.perks,
        skillsRequired: internshipForm.skills,
        question: internshipForm.customQuestions,
        applicationDeadline: internshipForm.applicationDeadline || null,
        startDate: internshipForm.startDate || null,
        companyId : "comp1",
        recruiterId : id,
      };

      const res = await fetch('/api/auth/uploadInternship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error creating internship:', data);
        alert(`Failed to publish internship: ${data.error || 'Unknown error'}`);
      } else {
        alert('Internship published successfully!');
        handleClose();
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Something went wrong while publishing internship.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    const skill = prompt('Enter skill name:');
    if (skill && skill.trim()) {
      setInternshipForm(prevForm => ({...prevForm, skills: [...prevForm.skills, skill.trim()]}));
    }
  };

  const removeSkill = (idx: number) => {
    setInternshipForm(prevForm => ({...prevForm, skills: prevForm.skills.filter((_, i) => i !== idx)}));
  };

  const addPerk = () => {
    const perk = prompt('Enter perk:');
    if (perk && perk.trim()) {
      setInternshipForm(prevForm => ({...prevForm, perks: [...prevForm.perks, perk.trim()]}));
    }
  };

  const removePerk = (idx: number) => {
    setInternshipForm(prevForm => ({...prevForm, perks: prevForm.perks.filter((_, i) => i !== idx)}));
  };

  const addQuestion = () => {
    const question = prompt('Enter custom question:');
    if (question && question.trim()) {
      setInternshipForm(prevForm => ({...prevForm, customQuestions: [...prevForm.customQuestions, question.trim()]}));
    }
  };

  const removeQuestion = (idx: number) => {
    setInternshipForm(prevForm => ({...prevForm, customQuestions: prevForm.customQuestions.filter((_, i) => i !== idx)}));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Post New Internship</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 bg-gray-50">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${
                postStep === step ? 'bg-gray-900 text-white' :
                postStep > step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {postStep > step ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              {step < 5 && (
                <div className={`w-16 h-1 mx-1 ${postStep > step ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Basic Information */}
          {postStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Basic Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internship Title *</label>
                <input type="text" value={internshipForm.title}
                  onChange={(e) => setInternshipForm({...internshipForm, title: e.target.value})}
                  placeholder="e.g., Frontend Developer Intern"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select value={internshipForm.category}
                  onChange={(e) => setInternshipForm({...internshipForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required>
                  <option value="">Select Category</option>
                  <option value="SOFTWARE_DEVLOPMENT">Software Development</option>
                  <option value="DESIGN">Design</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="SALSE">Sales</option>
                  <option value="CONTENT_WRITING">Content Writing</option>
                  <option value="DATA_SCIENCE">Data Science</option>
                  <option value="FINANCE">Finance</option>
                  <option value="HUMAN_RESOURCES">Human Resources</option>
                  <option value="ENGINEERING">Engineering</option>
                  <option value="OPERATIONS">Operations</option>
                  <option value="PRODUCT_MANAGEMENT">Product Management</option>
                  <option value="OTHER">other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Type *</label>
                  <select value={internshipForm.userType}
                    onChange={(e) => setInternshipForm({...internshipForm, userType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required>
                    <option value="STUDENT">Student</option>
                    <option value="GRADUATE">Graduate</option>
                    <option value="PROFESSIONAL">Professional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode *</label>
                  <select value={internshipForm.Mode}
                    onChange={(e) => setInternshipForm({...internshipForm, Mode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required>
                    <option value="FULL_TIME">FULL_TIME</option>
                    <option value="PART_TIME">PART_TIME</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select value={internshipForm.Type}
                    onChange={(e) => setInternshipForm({...internshipForm, Type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required>
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input type="text" value={internshipForm.location}
                    onChange={(e) => setInternshipForm({...internshipForm, location: e.target.value})}
                    placeholder="e.g., Bangalore, India"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Months) *</label>
                  <select value={internshipForm.duration}
                    onChange={(e) => setInternshipForm({...internshipForm, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required>
                    <option value="">Select Duration</option>
                    <option value="1">1 month</option>
                    <option value="2">2 months</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Openings *</label>
                  <input type="number" min="1" value={internshipForm.openings}
                    onChange={(e) => setInternshipForm({...internshipForm, openings: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description & Skills */}
          {postStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Description & Skills</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internship Description *</label>
                <textarea rows={4} value={internshipForm.description}
                  onChange={(e) => setInternshipForm({...internshipForm, description: e.target.value})}
                  placeholder="Describe what the intern will be working on..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Responsibilities *</label>
                <textarea rows={4} value={internshipForm.responsibilities}
                  onChange={(e) => setInternshipForm({...internshipForm, responsibilities: e.target.value})}
                  placeholder="List the main responsibilities (one per line)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements *</label>
                <textarea rows={4} value={internshipForm.requirements}
                  onChange={(e) => setInternshipForm({...internshipForm, requirements: e.target.value})}
                  placeholder="List the requirements and qualifications..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required></textarea>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Skills Required * ({internshipForm.skills.length} added)</label>
                  <button onClick={addSkill}
                    className="text-sm px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800">
                    + Add Skill
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {internshipForm.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center space-x-2">
                      <span>{skill}</span>
                      <button onClick={() => removeSkill(idx)} className="hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Compensation & Perks */}
          {postStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Compensation & Perks</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stipend Type *</label>
                <select value={internshipForm.stipendType}
                  onChange={(e) => setInternshipForm({...internshipForm, stipendType: e.target.value, stipendAmount: ''})} // Clear amount on type change
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required>
                  <option value="PAID">Paid</option>
                  <option value="UNPAID">Unpaid</option>
                  <option value="PB">Performance Based</option>
                </select>
              </div>
              {internshipForm.stipendType !== 'UNPAID' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stipend Amount {internshipForm.stipendType === 'FIXED' ? '(per month)' : '(range)'} *
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">₹</span>
                    <input type="text" value={internshipForm.stipendAmount}
                      onChange={(e) => setInternshipForm({...internshipForm, stipendAmount: e.target.value})}
                      placeholder="e.g., 15000 or 10000-20000"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Perks & Benefits (Optional)</label>
                  <button onClick={addPerk}
                    className="text-sm px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800">
                    + Add Perk
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {internshipForm.perks.map((perk, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center space-x-2">
                      <span>{perk}</span>
                      <button onClick={() => removePerk(idx)} className="hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Examples: Certificate, Letter of Recommendation, Flexible Hours, Free Snacks</p>
              </div>
            </div>
          )}

          {/* Step 4: Application Process */}
          {postStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 4: Application Process</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline *</label>
                  <input type="date" value={internshipForm.applicationDeadline}
                    onChange={(e) => setInternshipForm({...internshipForm, applicationDeadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Start Date *</label>
                  <input type="date" value={internshipForm.startDate}
                    onChange={(e) => setInternshipForm({...internshipForm, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                </div>
              </div>
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={internshipForm.questionsRequired}
                    onChange={(e) => setInternshipForm({...internshipForm, questionsRequired: e.target.checked})}
                    className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">Ask custom questions from applicants (Optional)</span>
                </label>
              </div>
              {internshipForm.questionsRequired && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Custom Questions ({internshipForm.customQuestions.length} added)</label>
                    <button onClick={addQuestion}
                      className="text-sm px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800">
                      + Add Question
                    </button>
                  </div>
                  <div className="space-y-2">
                    {internshipForm.customQuestions.map((question, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <span className="flex-1 text-sm">{idx + 1}. {question}</span>
                        <button onClick={() => removeQuestion(idx)} className="text-red-600 hover:text-red-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review & Publish */}
          {postStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 5: Review & Publish</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Title:</span> {internshipForm.title}</p>
                    <p><span className="font-medium">Category:</span> {internshipForm.category}</p>
                    <p><span className="font-medium">Work Mode:</span> {internshipForm.Mode}</p>
                    <p><span className="font-medium">Location:</span> {internshipForm.location}</p>
                    <p><span className="font-medium">Duration:</span> {internshipForm.duration} months</p>
                    <p><span className="font-medium">Openings:</span> {internshipForm.openings}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Skills Required</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {internshipForm.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Compensation</h4>
                  <p className="text-sm">
                    {internshipForm.stipendType === 'UNPAID' ? 'Unpaid' : `Rs ${internshipForm.stipendAmount}/month`}
                  </p>
                  {internshipForm.perks.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Perks:</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {internshipForm.perks.map((perk, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                            {perk}
                          </span>
                        ))}
                    </div>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Application Deadline:</span> {internshipForm.applicationDeadline}</p>
                    <p><span className="font-medium">Start Date:</span> {internshipForm.startDate}</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Warning: Please review all details carefully before publishing. Once published, the internship will be visible to all students.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
          <button onClick={postStep === 1 ? handleClose : handleBack}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">
            {postStep === 1 ? 'Cancel' : 'Back'}
          </button>
          <div className="text-sm text-gray-600">
            Step {postStep} of 5
          </div>
          {postStep < 5 ? (
            <button onClick={handleNext}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              disabled={isSubmitting}>
              Next
            </button>
          ) : (
            <button onClick={handlePublish}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              disabled={isSubmitting}>
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Internship'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recruiter_PostInternshipModal;
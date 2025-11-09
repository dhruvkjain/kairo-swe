"use client";

import { useState } from 'react';
import { Building2, Mail, Phone, Globe, MapPin, Users, Briefcase, Edit2, Save, X, Linkedin, Twitter, Facebook } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
//import { ApplicantsList, type Applicant } from './ApplicantsList';

export function RecruiterProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  
  const [profileData, setProfileData] = useState({
    companyName: 'TechCorp Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
    industry: 'Information Technology',
    companySize: '500-1000',
    founded: '2015',
    website: 'www.techcorpsolutions.com',
    email: 'recruiting@techcorpsolutions.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    description: 'TechCorp Solutions is a leading technology company specializing in cloud computing, artificial intelligence, and enterprise software solutions. We are committed to innovation and fostering a diverse, inclusive workplace where talented individuals can thrive.',
    linkedin: 'linkedin.com/company/techcorp',
    twitter: '@techcorpsolutions',
    facebook: 'facebook.com/techcorp',
    benefits: ['Health Insurance', 'Remote Work', 'Learning Budget', '401(k) Matching', 'Flexible Hours'],
    recruiterName: 'Sarah Johnson',
    recruiterTitle: 'Senior Talent Acquisition Manager',
    recruiterEmail: 'sarah.johnson@techcorpsolutions.com',
  });

  // Mock applicants data for different jobs
  const mockApplicants: { [key: number]: Applicant[] } = {
    1: [ // Software Engineering Intern
      {
        id: 1,
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        email: 'alex.chen@university.edu',
        phone: '+1 (555) 234-5678',
        university: 'Stanford University',
        major: 'Computer Science',
        graduationYear: '2025',
        gpa: '3.9',
        location: 'Palo Alto, CA',
        appliedDate: 'Nov 1, 2024',
        status: 'shortlisted',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'Docker', 'AWS'],
        experience: [
          {
            title: 'Software Development Intern',
            company: 'Google',
            duration: 'Summer 2024',
            description: 'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver features.'
          }
        ],
        education: [
          {
            degree: 'B.S. in Computer Science',
            institution: 'Stanford University',
            year: '2021 - 2025',
            gpa: '3.9'
          }
        ],
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Built a full-stack e-commerce platform with payment integration using React, Node.js, and MongoDB',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
          },
          {
            name: 'ML Image Classifier',
            description: 'Developed an image classification model using TensorFlow with 95% accuracy',
            technologies: ['Python', 'TensorFlow', 'OpenCV']
          }
        ],
        resume: 'alex-chen-resume.pdf',
        portfolio: 'alexchen.dev'
      },
      {
        id: 2,
        name: 'Sarah Martinez',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        email: 'sarah.martinez@mit.edu',
        phone: '+1 (555) 345-6789',
        university: 'MIT',
        major: 'Computer Science & Engineering',
        graduationYear: '2026',
        gpa: '3.8',
        location: 'Cambridge, MA',
        appliedDate: 'Oct 28, 2024',
        status: 'reviewed',
        skills: ['Java', 'C++', 'Python', 'React', 'SQL', 'Machine Learning', 'Data Structures'],
        experience: [
          {
            title: 'Research Assistant',
            company: 'MIT AI Lab',
            duration: 'Sep 2023 - Present',
            description: 'Conducting research on natural language processing and machine learning algorithms'
          }
        ],
        education: [
          {
            degree: 'B.S. in Computer Science & Engineering',
            institution: 'MIT',
            year: '2022 - 2026',
            gpa: '3.8'
          }
        ],
        projects: [
          {
            name: 'Smart Home System',
            description: 'IoT-based smart home automation system with voice control',
            technologies: ['Python', 'Raspberry Pi', 'IoT']
          }
        ],
        resume: 'sarah-martinez-resume.pdf',
        portfolio: 'sarahmartinez.io'
      },
      {
        id: 3,
        name: 'Michael Johnson',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
        email: 'mjohnson@berkeley.edu',
        phone: '+1 (555) 456-7890',
        university: 'UC Berkeley',
        major: 'Electrical Engineering & Computer Science',
        graduationYear: '2025',
        gpa: '3.7',
        location: 'Berkeley, CA',
        appliedDate: 'Oct 25, 2024',
        status: 'pending',
        skills: ['Python', 'Java', 'C', 'React', 'Django', 'PostgreSQL', 'Git'],
        experience: [],
        education: [
          {
            degree: 'B.S. in EECS',
            institution: 'UC Berkeley',
            year: '2021 - 2025',
            gpa: '3.7'
          }
        ],
        projects: [
          {
            name: 'Weather App',
            description: 'Mobile weather application with real-time updates and forecasts',
            technologies: ['React Native', 'API Integration']
          }
        ],
        resume: 'michael-johnson-resume.pdf',
        portfolio: ''
      }
    ],
    2: [ // Data Science Intern
      {
        id: 4,
        name: 'Emily Wang',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
        email: 'emily.wang@cmu.edu',
        phone: '+1 (555) 567-8901',
        university: 'Carnegie Mellon University',
        major: 'Data Science',
        graduationYear: '2025',
        gpa: '3.9',
        location: 'Pittsburgh, PA',
        appliedDate: 'Oct 30, 2024',
        status: 'shortlisted',
        skills: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy', 'Tableau'],
        experience: [
          {
            title: 'Data Analytics Intern',
            company: 'Amazon',
            duration: 'Summer 2024',
            description: 'Analyzed customer behavior data and built predictive models to improve recommendation systems'
          }
        ],
        education: [
          {
            degree: 'B.S. in Data Science',
            institution: 'Carnegie Mellon University',
            year: '2021 - 2025',
            gpa: '3.9'
          }
        ],
        projects: [
          {
            name: 'Customer Churn Prediction',
            description: 'Built ML model to predict customer churn with 88% accuracy',
            technologies: ['Python', 'Scikit-learn', 'Pandas']
          }
        ],
        resume: 'emily-wang-resume.pdf',
        portfolio: 'emilywang.github.io'
      }
    ],
    3: [ // UX Design Intern
      {
        id: 5,
        name: 'David Lee',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
        email: 'dlee@risd.edu',
        phone: '+1 (555) 678-9012',
        university: 'Rhode Island School of Design',
        major: 'Graphic Design',
        graduationYear: '2025',
        gpa: '3.8',
        location: 'Providence, RI',
        appliedDate: 'Nov 4, 2024',
        status: 'reviewed',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'User Research', 'Prototyping'],
        experience: [
          {
            title: 'UX Design Intern',
            company: 'Airbnb',
            duration: 'Summer 2024',
            description: 'Designed user interfaces for mobile app features and conducted user research'
          }
        ],
        education: [
          {
            degree: 'B.F.A. in Graphic Design',
            institution: 'Rhode Island School of Design',
            year: '2021 - 2025',
            gpa: '3.8'
          }
        ],
        projects: [
          {
            name: 'Food Delivery App Redesign',
            description: 'Complete UX/UI redesign of food delivery app focusing on accessibility',
            technologies: ['Figma', 'User Research', 'Prototyping']
          }
        ],
        resume: 'david-lee-resume.pdf',
        portfolio: 'davidlee.design'
      }
    ],
    4: [] // Marketing Intern - empty for now
  };

  const activeJobs = [
    { id: 1, title: 'Software Engineering Intern', applicants: 45, status: 'Active', posted: '2 weeks ago' },
    { id: 2, title: 'Data Science Intern', applicants: 32, status: 'Active', posted: '1 week ago' },
    { id: 3, title: 'UX Design Intern', applicants: 28, status: 'Active', posted: '3 days ago' },
    { id: 4, title: 'Marketing Intern', applicants: 51, status: 'Active', posted: '1 month ago' },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.companyLogo} alt={profileData.companyName} />
                  <AvatarFallback><Building2 className="w-12 h-12" /></AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl mb-2">{profileData.companyName}</h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{profileData.industry}</Badge>
                    <Badge variant="secondary">{profileData.companySize} employees</Badge>
                    <Badge variant="secondary">Founded {profileData.founded}</Badge>
                  </div>
                  <div className="flex flex-col gap-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>{profileData.website}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="company">Company Details</TabsTrigger>
            <TabsTrigger value="jobs">Posted Jobs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Description</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                    rows={6}
                  />
                ) : (
                  <p className="text-gray-700">{profileData.description}</p>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      {isEditing ? (
                        <Input
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                      ) : (
                        <p>{profileData.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      {isEditing ? (
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      ) : (
                        <p>{profileData.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      {isEditing ? (
                        <Input
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        />
                      ) : (
                        <p>{profileData.location}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">LinkedIn</p>
                      {isEditing ? (
                        <Input
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                        />
                      ) : (
                        <p>{profileData.linkedin}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Twitter</p>
                      {isEditing ? (
                        <Input
                          value={profileData.twitter}
                          onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                        />
                      ) : (
                        <p>{profileData.twitter}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-blue-700" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Facebook</p>
                      {isEditing ? (
                        <Input
                          value={profileData.facebook}
                          onChange={(e) => setProfileData({ ...profileData, facebook: e.target.value })}
                        />
                      ) : (
                        <p>{profileData.facebook}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Details Tab */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={profileData.companyName}
                      onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={profileData.industry}
                      onValueChange={(value) => setProfileData({ ...profileData, industry: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select
                      value={profileData.companySize}
                      onValueChange={(value) => setProfileData({ ...profileData, companySize: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="500-1000">500-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded">Year Founded</Label>
                    <Input
                      id="founded"
                      value={profileData.founded}
                      onChange={(e) => setProfileData({ ...profileData, founded: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recruiter Information</CardTitle>
                <CardDescription>Your personal information as a recruiter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recruiterName">Full Name</Label>
                    <Input
                      id="recruiterName"
                      value={profileData.recruiterName}
                      onChange={(e) => setProfileData({ ...profileData, recruiterName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recruiterTitle">Job Title</Label>
                    <Input
                      id="recruiterTitle"
                      value={profileData.recruiterTitle}
                      onChange={(e) => setProfileData({ ...profileData, recruiterTitle: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recruiterEmail">Email</Label>
                    <Input
                      id="recruiterEmail"
                      type="email"
                      value={profileData.recruiterEmail}
                      onChange={(e) => setProfileData({ ...profileData, recruiterEmail: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Posted Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Active Job Postings</CardTitle>
                <CardDescription>Manage your current internship opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="mb-1">{job.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {job.applicants} applicants
                            </span>
                            <span>•</span>
                            <span>Posted {job.posted}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge>{job.status}</Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setApplicantsDialogOpen(true);
                          }}
                        >
                          View Applicants
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Email notifications for new applicants</p>
                        <p className="text-sm text-gray-500">Receive an email when someone applies to your job posting</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Weekly application summary</p>
                        <p className="text-sm text-gray-500">Get a weekly digest of all applications</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Profile views notifications</p>
                        <p className="text-sm text-gray-500">Get notified when students view your company profile</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg">Privacy Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Make profile public</p>
                        <p className="text-sm text-gray-500">Allow students to view your company profile</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Show contact information</p>
                        <p className="text-sm text-gray-500">Display email and phone number on public profile</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Applicants Dialog */}
        {selectedJobId && (
          <ApplicantsList
            jobTitle={activeJobs.find(job => job.id === selectedJobId)?.title || ''}
            applicants={mockApplicants[selectedJobId] || []}
            open={applicantsDialogOpen}
            onOpenChange={setApplicantsDialogOpen}
          />
        )}
      </div>
    </div>
  );
}

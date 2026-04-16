"use client";

import React, { useState } from "react";
import { 
  User, MapPin, Briefcase, Award, BookOpen, Languages, 
  Link, Users, Globe, Edit3, Save, X, Plus, Calendar,
  Building, Clock, Star, TrendingUp, CheckCircle, ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

// TypeScript Interfaces - Structured Schema for AI
interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
}

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  role: string;
  link: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
}

interface Language {
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

interface SocialLink {
  platform: 'GitHub' | 'LinkedIn' | 'Portfolio';
  url: string;
}

interface TalentProfile {
  // Header Section
  fullName: string;
  headline: string;
  location: string;
  availability: 'Available' | 'Open' | 'Not Available';
  avatar?: string;
  
  // Structured Data for AI
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  socialLinks: SocialLink[];
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<TalentProfile>({
    fullName: "Ndizeye David",
    headline: "Frontend Developer - React & AI Systems",
    location: "Kigali, Rwanda",
    availability: "Available",
    skills: [
      { name: "React", level: "Advanced", yearsOfExperience: 3 },
      { name: "TypeScript", level: "Advanced", yearsOfExperience: 2 },
      { name: "Node.js", level: "Intermediate", yearsOfExperience: 2 },
      { name: "Tailwind CSS", level: "Advanced", yearsOfExperience: 3 },
      { name: "Python", level: "Intermediate", yearsOfExperience: 1 },
      { name: "GraphQL", level: "Intermediate", yearsOfExperience: 1 },
    ],
    experience: [
      {
        company: "TechCorp Rwanda",
        role: "Frontend Developer",
        startDate: "2022-01",
        endDate: "Present",
        description: "Developed and maintained responsive web applications using React and TypeScript. Implemented AI-powered features that improved user engagement by 40%.",
        technologies: ["React", "TypeScript", "GraphQL", "AWS"]
      },
      {
        company: "StartHub Labs",
        role: "Junior Frontend Developer",
        startDate: "2021-06",
        endDate: "2021-12",
        description: "Built responsive UI components and collaborated with backend team to integrate RESTful APIs.",
        technologies: ["JavaScript", "Vue.js", "CSS", "Git"]
      }
    ],
    projects: [
      {
        name: "AI Recruitment Platform",
        description: "Built an AI-powered recruitment platform that matches candidates with jobs based on skills and experience using machine learning algorithms.",
        technologies: ["React", "Node.js", "MongoDB", "OpenAI API"],
        role: "Frontend Developer",
        link: "https://github.com/ndizeyedavid/ai-recruitment"
      },
      {
        name: "E-Learning Dashboard",
        description: "Created a comprehensive dashboard for online learning with real-time progress tracking and interactive charts.",
        technologies: ["Next.js", "D3.js", "PostgreSQL", "Tailwind"],
        role: "Full Stack Developer",
        link: "https://github.com/ndizeyedavid/learning-dashboard"
      },
      {
        name: "Rwanda Tourism App",
        description: "Mobile-first web application showcasing Rwanda's tourist destinations with booking functionality.",
        technologies: ["React Native", "Firebase", "Redux", "Maps API"],
        role: "Frontend Developer",
        link: "https://github.com/ndizeyedavid/rwanda-tourism"
      }
    ],
    education: [
      {
        institution: "University of Rwanda",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2018",
        endDate: "2022"
      }
    ],
    certifications: [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023-06"
      },
      {
        name: "React Advanced Patterns",
        issuer: "Udemy",
        date: "2023-03"
      }
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Kinyarwanda", proficiency: "Native" },
      { name: "French", proficiency: "Conversational" }
    ],
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/sarahmugisha" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/sarahmugisha" },
      { platform: "Portfolio", url: "https://sarahmugisha.dev" }
    ]
  });

  // Calculate profile completion for AI scoring
  const calculateProfileCompletion = () => {
    const fields = [
      profile.fullName,
      profile.headline,
      profile.location,
      profile.skills.length >= 5,
      profile.experience.length >= 2,
      profile.projects.length >= 3,
      profile.education.length >= 1,
      profile.certifications.length >= 1,
      profile.languages.length >= 2,
      profile.socialLinks.length >= 2
    ];
    
    const completedFields = fields.filter(field => field === true || (typeof field === 'string' && field.length > 0)).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const getProfileSuggestions = () => {
    const suggestions = [];
    if (profile.skills.length < 5) suggestions.push("Add more skills to improve match score");
    if (profile.experience.length < 2) suggestions.push("Add more work experience");
    if (profile.projects.length < 3) suggestions.push("Add more projects (critical for AI ranking)");
    if (profile.certifications.length < 2) suggestions.push("Add certifications to boost credibility");
    if (!profile.experience.some(exp => exp.description.includes('achieved') || exp.description.includes('improved'))) {
      suggestions.push("Add measurable achievements to experience");
    }
    return suggestions;
  };

  const getAIScore = () => {
    let score = 65; // Base score
    
    // Skills contribution
    score += Math.min(profile.skills.length * 5, 20);
    
    // Projects contribution (highest weight)
    score += Math.min(profile.projects.length * 8, 25);
    
    // Experience contribution
    score += Math.min(profile.experience.length * 6, 15);
    
    // Education and certifications
    score += Math.min((profile.education.length + profile.certifications.length) * 3, 10);
    
    return Math.min(score, 95);
  };

  const getAvailabilityColor = (availability: string) => {
    const colors = {
      'Available': 'bg-green-100 text-green-800 border-green-200',
      'Open': 'bg-blue-100 text-blue-800 border-blue-200',
      'Not Available': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[availability as keyof typeof colors];
  };

  const getSocialIcon = (platform: string) => {
    const icons = {
      'GitHub': <Link className="w-5 h-5" />,
      'LinkedIn': <Users className="w-5 h-5" />,
      'Portfolio': <Globe className="w-5 h-5" />
    };
    return icons[platform as keyof typeof icons] || <Globe className="w-5 h-5" />;
  };

  const completionPercentage = calculateProfileCompletion();
  const aiScore = getAIScore();
  const suggestions = getProfileSuggestions();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER SECTION - Profile Summary Card */}
        <Card className="overflow-hidden">
          <div className="bg-gray-100 h-32" />
          <div className="px-8 pb-8">
            <div className="flex items-start justify-between -mt-16">
              <div className="flex items-end space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                    {profile.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 border-2 border-white rounded-full" />
                </div>
                
                {/* User Info */}
                <div className="pb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile.fullName}
                  </h1>
                  <p className="text-lg text-gray-600 mb-3">{profile.headline}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                  <div>
                    <Badge className={getAvailabilityColor(profile.availability)}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {profile.availability}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3 pb-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center"
                >
                  {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PROFILE COMPLETION SECTION */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Profile Strength</h2>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
              
              <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm font-bold text-blue-600">{completionPercentage}%</span>
                  </div>
                  <div className="flex items-end space-x-1 sm:space-x-2 h-20 sm:h-24">
                    {[
                      { label: 'Info', value: 100, color: 'bg-blue-600' },
                      { label: 'Skills', value: 85, color: 'bg-purple-600' },
                      { label: 'Projects', value: 90, color: 'bg-orange-600' },
                      { label: 'Experience', value: 75, color: 'bg-green-600' },
                      { label: 'Education', value: 95, color: 'bg-indigo-600' }
                    ].map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center justify-end min-w-0">
                        <div 
                          className={`w-full ${item.color} rounded-t-sm transition-all duration-500 relative flex items-center justify-center`}
                          style={{ height: `${(item.value / 100) * 80}px` }}
                        >
                          <span className="text-white text-xs sm:text-sm font-bold absolute top-1">
                            {item.value}%
                          </span>
                        </div>
                        <span className="text-xs text-gray-600 mt-1 sm:mt-2 text-center truncate w-full">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              
              {suggestions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Improve Your Profile:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">â¢</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {/* SKILLS SECTION - Structured Data */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{skill.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={skill.level === 'Expert' ? 'default' : skill.level === 'Advanced' ? 'secondary' : 'outline'} 
                            className="text-xs"
                          >
                            {skill.level}
                          </Badge>
                          <span className="text-xs text-gray-500">• {skill.yearsOfExperience} years</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 4 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              skill.level === 'Expert' ? 'bg-purple-600' :
                              skill.level === 'Advanced' ? 'bg-blue-600' :
                              skill.level === 'Intermediate' ? 'bg-green-600' :
                              'bg-yellow-600'
                            } ${i < (skill.level === 'Expert' ? 4 : skill.level === 'Advanced' ? 3 : skill.level === 'Intermediate' ? 2 : 1) ? '' : 'opacity-30'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* EXPERIENCE SECTION - Timeline UI */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </button>
              </div>
              
              <div className="space-y-6">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full" />
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.role}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.startDate} - {exp.endDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{exp.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" size="sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* PROJECTS SECTION - Critical for AI */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-orange-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                  <Badge variant="warning" className="text-xs">AI Critical</Badge>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.projects.map((project, index) => (
                  <Card key={index} hover className="p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{project.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-blue-600 text-xs sm:text-sm font-medium">
                        {project.role}
                      </Badge>
                      <a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center"
                      >
                        View Project
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* EDUCATION SECTION */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </button>
              </div>
              
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* CERTIFICATIONS SECTION */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.certifications.map((cert, index) => (
                  <Card key={index} className="p-4 border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{cert.name}</h3>
                        <p className="text-gray-600">{cert.issuer}</p>
                        <p className="text-sm text-gray-500">{cert.date}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* LANGUAGES SECTION */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Languages className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Languages</h2>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Language
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {profile.languages.map((lang, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="px-4 py-2 text-sm font-medium"
                  >
                    {lang.name} ({lang.proficiency})
                  </Badge>
                ))}
              </div>
            </Card>

            {/* SOCIAL LINKS SECTION */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {profile.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {getSocialIcon(link.platform)}
                    <span className="font-medium text-gray-700">{link.platform}</span>
                  </a>
                ))}
              </div>
            </Card>
          </div>

          {/* AI OPTIMIZATION PANEL - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Profile Score</h3>
              </div>
              
              {/* Profile Image */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img 
                    src="/api/placeholder/150/150" 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Score Display */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">{aiScore}</div>
                <div className="text-sm text-gray-600">out of 100</div>
                <ProgressBar value={aiScore} className="mt-4" />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5" />
                      Strong project portfolio
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5" />
                      Relevant tech stack
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5" />
                      Good experience timeline
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">To Improve</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start">
                      <X className="w-3 h-3 text-red-500 mr-2 mt-0.5" />
                      Add measurable achievements
                    </li>
                    <li className="flex items-start">
                      <X className="w-3 h-3 text-yellow-500 mr-2 mt-0.5" />
                      More backend experience
                    </li>
                    <li className="flex items-start">
                      <X className="w-3 h-3 text-yellow-500 mr-2 mt-0.5" />
                      Additional certifications
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-medium text-purple-900 mb-2">AI Tips</h4>
                  <p className="text-sm text-purple-800">
                    Add specific metrics and achievements to your experience descriptions. 
                    Quantifiable results significantly improve your AI match score.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

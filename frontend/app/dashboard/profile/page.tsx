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

    <div className="min-h-screen bg-white p-8">

      <div className="max-w-4xl mx-auto space-y-6">

        

        {/* Simple Header */}

        <div className="text-center py-8">

          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">

            {profile.fullName.split(' ').map(n => n[0]).join('')}

          </div>

          <h1 className="text-2xl font-light text-gray-900 mb-2">

            {profile.fullName}

          </h1>

          <p className="text-gray-600 mb-3">{profile.headline}</p>

          <p className="text-sm text-gray-500 mb-4">{profile.location}</p>

          <button

            onClick={() => setIsEditing(!isEditing)}

            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"

          >

            {isEditing ? 'Save' : 'Edit'}

          </button>

        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}

          <div className="lg:col-span-2 space-y-8">

            

            {/* Simple Profile Strength */}

            <div className="bg-gray-50 rounded-lg p-6">

              <div className="flex items-center justify-between mb-4">

                <h2 className="text-lg font-medium text-gray-900">Profile Strength</h2>

                <span className="text-2xl font-light text-blue-500">{completionPercentage}%</span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">

                <div 

                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"

                  style={{ width: `${completionPercentage}%` }}

                />

              </div>

              {suggestions.length > 0 && (

                <div className="mt-4 text-sm text-gray-600">

                  <p className="font-medium mb-2">Suggestions:</p>

                  <ul className="space-y-1">

                    {suggestions.slice(0, 2).map((suggestion, index) => (

                      <li key={index}>â¢ {suggestion}</li>

                    ))}

                  </ul>

                </div>

              )}

            </div>



            {/* Simple Skills */}

            <div className="bg-gray-50 rounded-lg p-6">

              <h2 className="text-lg font-medium text-gray-900 mb-4">Skills</h2>

              <div className="flex flex-wrap gap-2">

                {profile.skills.map((skill, index) => (

                  <span key={index} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">

                    {skill.name}

                  </span>

                ))}

              </div>

            </div>



            {/* Simple Experience */}

            <div className="bg-gray-50 rounded-lg p-6">

              <h2 className="text-lg font-medium text-gray-900 mb-4">Experience</h2>

              <div className="space-y-4">

                {profile.experience.map((exp, index) => (

                  <div key={index} className="border-l-2 border-gray-300 pl-4">

                    <h3 className="font-medium text-gray-900">{exp.role}</h3>

                    <p className="text-gray-600 text-sm">{exp.company}</p>

                    <p className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</p>

                  </div>

                ))}

              </div>

            </div>



            {/* Simple Projects */}

            <div className="bg-gray-50 rounded-lg p-6">

              <h2 className="text-lg font-medium text-gray-900 mb-4">Projects</h2>

              <div className="space-y-3">

                {profile.projects.map((project, index) => (

                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">

                    <h3 className="font-medium text-gray-900 mb-1">{project.name}</h3>

                    <p className="text-sm text-gray-600 mb-2">{project.description}</p>

                    <div className="flex flex-wrap gap-1">

                      {project.technologies.slice(0, 3).map((tech, techIndex) => (

                        <span key={techIndex} className="text-xs text-gray-500">

                          {tech}

                        </span>

                      ))}

                    </div>

                  </div>

                ))}

              </div>

            </div>



            {/* Simple Education & Languages */}

            <div className="bg-gray-50 rounded-lg p-6">

              <h2 className="text-lg font-medium text-gray-900 mb-4">Education</h2>

              <div className="space-y-2">

                {profile.education.map((edu, index) => (

                  <div key={index}>

                    <p className="font-medium text-gray-900">{edu.degree} in {edu.field}</p>

                    <p className="text-sm text-gray-600">{edu.institution}</p>

                  </div>

                ))}

              </div>

              

              <h2 className="text-lg font-medium text-gray-900 mb-4 mt-6">Languages</h2>

              <div className="flex flex-wrap gap-2">

                {profile.languages.map((lang, index) => (

                  <span key={index} className="text-sm text-gray-600">

                    {lang.name}

                  </span>

                ))}

              </div>

            </div>

          </div>



          {/* Simple AI Score */}

          <div className="lg:col-span-1">

            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">

              <h3 className="text-lg font-medium text-gray-900 mb-4">AI Score</h3>

              <div className="text-center mb-4">

                <div className="text-3xl font-light text-blue-500">{aiScore}</div>

                <div className="text-sm text-gray-500">out of 100</div>

              </div>

              <div className="space-y-3 text-sm">

                <div>

                  <p className="font-medium text-gray-900 mb-1">Good:</p>

                  <p className="text-gray-600">Projects, tech stack, experience</p>

                </div>

                <div>

                  <p className="font-medium text-gray-900 mb-1">Improve:</p>

                  <p className="text-gray-600">Add achievements, more certifications</p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}


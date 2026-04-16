"use client";

import React from "react";

interface UserDetailsFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    headline: string;
    location: string;
    socialLinks: string[];
  };
  onSubmit: (data: any) => void;
}

export default function UserDetailsForm({ initialData, onSubmit }: UserDetailsFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      headline: formData.get("headline") as string,
      location: formData.get("location") as string,
      socialLinks: [
        formData.get("linkedin") as string,
        formData.get("github") as string,
      ].filter(Boolean),
    };
    onSubmit(data);
  };

  const linkedin = initialData.socialLinks.find(l => l.includes("linkedin")) || "";
  const github = initialData.socialLinks.find(l => l.includes("github")) || "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#25324B]">First Name</label>
          <input 
            name="firstName" 
            defaultValue={initialData.firstName} 
            className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#286ef0]" 
            required 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#25324B]">Last Name</label>
          <input 
            name="lastName" 
            defaultValue={initialData.lastName} 
            className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#286ef0]" 
            required 
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#25324B]">Email</label>
        <input 
          name="email" 
          type="email" 
          defaultValue={initialData.email} 
          className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#286ef0]" 
          required 
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#25324B]">Headline</label>
        <input 
          name="headline" 
          defaultValue={initialData.headline} 
          className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#286ef0]" 
          required 
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#25324B]">Location</label>
        <input 
          name="location" 
          defaultValue={initialData.location} 
          className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#286ef0]" 
          required 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#25324B]">LinkedIn URL</label>
          <input 
            name="linkedin" 
            defaultValue={linkedin} 
            className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#286ef0]" 
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#25324B]">GitHub URL</label>
          <input 
            name="github" 
            defaultValue={github} 
            className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#286ef0]" 
            placeholder="https://github.com/username"
          />
        </div>
      </div>
      <button type="submit" className="w-full py-4 bg-[#286ef0] text-white rounded-2xl font-bold uppercase tracking-widest text-sm">
        Save Profile Details
      </button>
    </form>
  );
}

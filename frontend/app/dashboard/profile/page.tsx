"use client";

import React, { useState } from "react";
import {
  User,
  MapPin,
  Edit3,
  Globe,
  Mail,
  CheckCircle,
  Camera,
  Plus,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import ExperienceSection, { Experience } from "./components/ExperienceSection";
import SkillsSection, { Skill } from "./components/SkillsSection";
import LanguagesSection, { Language } from "./components/LanguagesSection";
import ProfileStatus from "./components/ProfileStatus";
import Modal from "./components/Modal";
import ExperienceForm from "./components/forms/ExperienceForm";
import SkillForm from "./components/forms/SkillForm";
import LanguageForm from "./components/forms/LanguageForm";
import BioForm from "./components/forms/BioForm";
import UserDetailsForm from "./components/forms/UserDetailsForm";
import SocialsForm from "./components/forms/SocialsForm";
import { ImGithub, ImLinkedin2 } from "react-icons/im";

export default function ProfilePage() {
  const [activeModal, setActiveModal] = useState<{
    type:
      | "experience"
      | "skills"
      | "languages"
      | "bio"
      | "details"
      | "socials"
      | null;
    index?: number;
  }>({ type: null });

  // Reflected from Talents & Users Schema
  const [userData, setUserData] = useState({
    firstName: "Ndizeye",
    lastName: "David",
    email: "david@umurava.com",
    picture: null,
  });

  const [talentData, setTalentData] = useState({
    headline: "Frontend Developer - React & AI Systems",
    bio: "Passionate about building scalable web applications with high-quality UI/UX and integrating AI solutions.",
    location: "Kigali, Rwanda",
    skills: [
      {
        name: "React",
        level: "Expert" as Skill["level"],
        yearsOfExperience: 3,
      },
      {
        name: "TypeScript",
        level: "Advanced" as Skill["level"],
        yearsOfExperience: 2,
      },
      {
        name: "Node.js",
        level: "Intermediate" as Skill["level"],
        yearsOfExperience: 2,
      },
      {
        name: "Tailwind CSS",
        level: "Expert" as Skill["level"],
        yearsOfExperience: 3,
      },
    ],
    experience: [
      {
        company: "TechCorp Rwanda",
        role: "Senior Frontend Engineer",
        startDate: "2022-01-01",
        endDate: "" as string,
        description:
          "Led the development of a next-gen dashboard for talent analytics, improving performance by 60%.",
        technologies: ["Next.js", "Tailwind", "Radix UI"],
        IsCurrent: true,
      },
      {
        company: "Umurava",
        role: "Frontend Developer",
        startDate: "2021-06-01",
        endDate: "2021-12-31",
        description:
          "Collaborated on building the landing pages and talent marketplace platform using React.",
        technologies: ["React", "Redux", "SCSS"],
        IsCurrent: false,
      },
    ],
    availability: {
      status: "Available" as const,
      type: "Full-time" as const,
    },
    socialLinks: ["https://linkedin.com/in/david", "https://github.com/david"],
    languages: [
      { name: "English", proficiency: "Fluent" as Language["proficiency"] },
      { name: "Kinyarwanda", proficiency: "Native" as Language["proficiency"] },
    ],
  });

  // Modal Handlers
  const openModal = (type: typeof activeModal.type, index?: number) => {
    setActiveModal({ type, index });
  };

  const closeModal = () => {
    setActiveModal({ type: null });
  };

  const handleUpdateExperience = (updatedExp: Experience) => {
    const newExperience = [...talentData.experience];
    const formattedExp = {
      ...updatedExp,
      endDate: updatedExp.endDate || "", // Ensure string
    };
    if (activeModal.index !== undefined) {
      newExperience[activeModal.index] = formattedExp;
    } else {
      newExperience.push(formattedExp);
    }
    setTalentData({ ...talentData, experience: newExperience });
    closeModal();
  };

  const handleUpdateSkill = (updatedSkill: Skill) => {
    const newSkills = [...talentData.skills];
    if (activeModal.index !== undefined) {
      newSkills[activeModal.index] = updatedSkill;
    } else {
      newSkills.push(updatedSkill);
    }
    setTalentData({ ...talentData, skills: newSkills });
    closeModal();
  };

  const handleUpdateLanguage = (updatedLang: Language) => {
    const newLanguages = [...talentData.languages];
    if (activeModal.index !== undefined) {
      newLanguages[activeModal.index] = updatedLang;
    } else {
      newLanguages.push(updatedLang);
    }
    setTalentData({ ...talentData, languages: newLanguages });
    closeModal();
  };

  const handleUpdateBio = (newBio: string) => {
    setTalentData({ ...talentData, bio: newBio });
    closeModal();
  };

  const handleUpdateDetails = (data: any) => {
    setUserData({
      ...userData,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });
    setTalentData({
      ...talentData,
      headline: data.headline,
      location: data.location,
      socialLinks: data.socialLinks,
    });
    closeModal();
  };

  const handleUpdateSocials = (data: any) => {
    setTalentData({ ...talentData, socialLinks: data.socialLinks });
    closeModal();
  };

  const removeItem = (type: typeof activeModal.type, index: number) => {
    if (type === "experience") {
      const newExp = talentData.experience.filter((_, i) => i !== index);
      setTalentData({ ...talentData, experience: newExp });
    } else if (type === "skills") {
      const newSkills = talentData.skills.filter((_, i) => i !== index);
      setTalentData({ ...talentData, skills: newSkills });
    } else if (type === "languages") {
      const newLangs = talentData.languages.filter((_, i) => i !== index);
      setTalentData({ ...talentData, languages: newLangs });
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      <div className="mx-auto space-y-3">
        {/* HEADER SECTION - Beautiful & Clean */}
        <div className="bg-white rounded-[10px] p-6 sm:p-7 border border-gray-100 overflow-hidden relative">
          <div className="flex  flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-32 sm:h-32 rounded-full bg-linear-to-tr from-[#286ef0] to-[#5c95ff] p-1 ">
                  <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center border-4 border-white">
                    <span className="text-4xl sm:text-5xl font-bold text-[#286ef0]">
                      {userData.firstName[0]}
                      {userData.lastName[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-left pt-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-3xl sm:text-3xl font-extrabold text-[#25324B]">
                    {userData.firstName} {userData.lastName}
                  </h1>
                </div>
                <p className="text-lg font-semibold text-[#7C8493] mb-4 max-w-xl">
                  {talentData.headline}
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#444]">
                    <div className="">
                      <MapPin className="w-4 h-4 text-[#286ef0]" />
                    </div>
                    {talentData.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#444]">
                    <div className=" ">
                      <Mail className="w-4 h-4 text-[#286ef0]" />
                    </div>
                    {userData.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => openModal("details")}
                className="w-full px-8 py-4 bg-[#286ef0] text-white rounded-2xl hover:bg-[#1f5fe0] shadow-[0_4px_15px_rgba(40,110,240,0.3)] transition-all flex items-center justify-center font-bold text-sm tracking-widest uppercase"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              <div className="flex justify-center gap-2">
                {talentData.socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-[#286ef0] hover:bg-[#F3F4FF] transition-all"
                  >
                    {link.includes("github") ? (
                      <ImGithub className="w-5 h-5" />
                    ) : (
                      <ImLinkedin2 className="w-5 h-5" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-3">
            {/* Bio Section */}
            <Card
              className="p-8 bg-white rounded-[10px] border border-gray-100 shadow-none cursor-pointer group hover:border-[#286ef0] transition-all"
              onClick={() => openModal("bio")}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#25324B] flex items-center gap-3">
                  <User className="w-5 h-5 text-[#286ef0]" />
                  Personal Bio
                </h2>
                <Edit3 className="w-4 h-4 text-gray-300 group-hover:text-[#286ef0] transition-colors" />
              </div>
              <p className="text-sm leading-relaxed text-[#7C8493] font-medium">
                {talentData.bio}
              </p>
            </Card>

            <ExperienceSection
              experience={talentData.experience as Experience[]}
              onAdd={() => openModal("experience")}
              onEdit={(index) => openModal("experience", index)}
            />

            <SkillsSection
              skills={talentData.skills as Skill[]}
              onAdd={() => openModal("skills")}
              onEdit={(index) => openModal("skills", index)}
            />

            <LanguagesSection
              languages={talentData.languages as Language[]}
              onAdd={() => openModal("languages")}
              onEdit={(index) => openModal("languages", index)}
              onRemove={(index) => removeItem("languages", index)}
            />
          </div>

          {/* Sidebar - Profile Status (The MIFOTRA-style card) */}
          <div className="lg:col-span-1 space-y-8 sticky top-[100px]">
            <ProfileStatus />
          </div>
        </div>

        {/* MODALS */}
        <Modal
          isOpen={activeModal.type === "experience"}
          onClose={closeModal}
          title={
            activeModal.index !== undefined
              ? "Edit Experience"
              : "Add Experience"
          }
        >
          <ExperienceForm
            initialData={
              activeModal.index !== undefined
                ? talentData.experience[activeModal.index]
                : undefined
            }
            onSubmit={handleUpdateExperience}
            onDelete={
              activeModal.index !== undefined
                ? () => removeItem("experience", activeModal.index!)
                : undefined
            }
          />
        </Modal>

        <Modal
          isOpen={activeModal.type === "skills"}
          onClose={closeModal}
          title={activeModal.index !== undefined ? "Edit Skill" : "Add Skill"}
        >
          <SkillForm
            initialData={
              activeModal.index !== undefined
                ? talentData.skills[activeModal.index]
                : undefined
            }
            onSubmit={handleUpdateSkill}
            onDelete={
              activeModal.index !== undefined
                ? () => removeItem("skills", activeModal.index!)
                : undefined
            }
          />
        </Modal>

        <Modal
          isOpen={activeModal.type === "languages"}
          onClose={closeModal}
          title={
            activeModal.index !== undefined ? "Edit Language" : "Add Language"
          }
        >
          <LanguageForm
            initialData={
              activeModal.index !== undefined
                ? talentData.languages[activeModal.index]
                : undefined
            }
            onSubmit={handleUpdateLanguage}
            onDelete={
              activeModal.index !== undefined
                ? () => removeItem("languages", activeModal.index!)
                : undefined
            }
          />
        </Modal>

        <Modal
          isOpen={activeModal.type === "bio"}
          onClose={closeModal}
          title="Edit Personal Bio"
        >
          <BioForm initialData={talentData.bio} onSubmit={handleUpdateBio} />
        </Modal>

        <Modal
          isOpen={activeModal.type === "details"}
          onClose={closeModal}
          title="Edit Profile Details"
        >
          <UserDetailsForm
            initialData={{
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              headline: talentData.headline,
              location: talentData.location,
              socialLinks: talentData.socialLinks,
            }}
            onSubmit={handleUpdateDetails}
          />
        </Modal>

        <Modal
          isOpen={activeModal.type === "socials"}
          onClose={closeModal}
          title="Edit Social Links"
        >
          <SocialsForm
            initialData={{
              socialLinks: talentData.socialLinks,
            }}
            onSubmit={handleUpdateSocials}
          />
        </Modal>
      </div>
    </div>
  );
}

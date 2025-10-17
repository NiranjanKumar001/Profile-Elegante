"use client";
import { FaExternalLinkAlt } from "react-icons/fa";
import DateRange from "../utility/DateRange";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DndContext, closestCenter } from "@dnd-kit/core";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { SortableItem, SortableSection } from "./Preview";
import { useEffect, useState } from "react";

// Professional Two-Column Template with Sidebar (TemplateSeven)
const TemplateSeven = ({
  resumeData,
  sectionOrder,
  enabledSections,
  handleDragEnd,
  sensors,
  icons,
  setResumeData,
}) => {
  const { customSectionTitles } = useSectionTitles();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle drag end for items within sections
  const handleItemDragEnd = (event, sectionType) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      if (sectionType === "projects" && setResumeData) {
        const oldIndex = parseInt(active.id.replace("project-", ""));
        const newIndex = parseInt(over.id.replace("project-", ""));

        if (oldIndex !== -1 && newIndex !== -1) {
          const newProjects = arrayMove(
            resumeData.projects,
            oldIndex,
            newIndex
          );
          setResumeData((prev) => ({ ...prev, projects: newProjects }));
        }
      } else if (sectionType === "experience" && setResumeData) {
        const oldIndex = parseInt(active.id.replace("work-", ""));
        const newIndex = parseInt(over.id.replace("work-", ""));

        if (oldIndex !== -1 && newIndex !== -1) {
          const newExperience = arrayMove(
            resumeData.workExperience,
            oldIndex,
            newIndex
          );
          setResumeData((prev) => ({ ...prev, workExperience: newExperience }));
        }
      }
    }
  };

  const sections = [
    {
      id: "summary",
      title: "About Me",
      content: resumeData.summary,
      sidebar: false,
    },
    {
      id: "education",
      title: "Education",
      content: resumeData.education,
      sidebar: true,
    },
    {
      id: "experience",
      title: "Work Experience",
      content: resumeData.workExperience,
      sidebar: false,
    },
    {
      id: "projects",
      title: "Projects",
      content: resumeData.projects,
      sidebar: false,
    },
    {
      id: "skills",
      title: "Skills",
      content: resumeData.skills,
      sidebar: true,
    },
    {
      id: "softSkills",
      title: "Soft Skills",
      content:
        resumeData.skills.find((skill) => skill.title === "Soft Skills")
          ?.skills || [],
      sidebar: true,
    },
    {
      id: "languages",
      title: "Languages",
      content: resumeData.languages,
      sidebar: true,
    },
    {
      id: "certifications",
      title: "Certifications",
      content: resumeData.certifications,
      sidebar: true,
    },
  ];

  const orderedSections = sectionOrder
    .map((id) => sections.find((section) => section.id === id))
    .filter((section) => section !== undefined && enabledSections[section.id]);

  const leftSections = orderedSections.filter((s) => s.sidebar);
  const rightSections = orderedSections.filter((s) => !s.sidebar);

  const renderSection = (section, isSidebar = false) => {
    const sidebarClass = isSidebar ? "text-white" : "";
    const titleClass = isSidebar
      ? "text-sm font-bold uppercase tracking-wider mb-3 pb-2 border-b border-white/30"
      : "text-base font-bold uppercase tracking-wide mb-3 pb-2 border-b-2 border-gray-800";
    const contentClass = isSidebar ? "text-xs" : "text-sm";

    switch (section.id) {
      case "summary":
        return (
          <div className="mb-5">
            <h2 className={titleClass}>
              {customSectionTitles.summary || "ABOUT ME"}
            </h2>
            <p className={`${contentClass} text-gray-700 leading-relaxed text-justify`}>
              {resumeData.summary}
            </p>
          </div>
        );

      case "education":
        return resumeData.education.length > 0 ? (
          <div className="mb-5">
            <h2 className={titleClass}>
              {customSectionTitles.education || "EDUCATION"}
            </h2>
            <div className="space-y-3">
              {resumeData.education.map((item, index) => (
                <div key={index}>
                  <h3 className={`${contentClass} ${sidebarClass} font-bold`}>
                    {item.school}
                  </h3>
                  <p className={`${contentClass} ${sidebarClass} opacity-90 mt-1`}>
                    {item.degree}
                  </p>
                  <p className={`text-xs ${sidebarClass} opacity-80 mt-1`}>
                    <DateRange
                      startYear={item.startYear}
                      endYear={item.endYear}
                      id={`education-${index}`}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "experience":
        return resumeData.workExperience.length > 0 ? (
          <div className="mb-5">
            <h2 className={titleClass}>
              {customSectionTitles.experience || "WORK EXPERIENCE"}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, "experience")}
            >
              <SortableContext
                items={resumeData.workExperience.map((_, idx) => `work-${idx}`)}
                strategy={verticalListSortingStrategy}
              >
                {resumeData.workExperience.map((item, index) => (
                  <SortableItem key={`work-${index}`} id={`work-${index}`}>
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <h3 className={`${contentClass} font-bold text-gray-900`}>
                            {item.company} - {item.position}
                          </h3>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs font-semibold text-gray-700">
                            <DateRange
                              startYear={item.startYear}
                              endYear={item.endYear}
                              id={`work-experience-${index}`}
                            />
                          </p>
                        </div>
                      </div>
                      <p className={`${contentClass} text-gray-700 leading-relaxed mb-2`}>
                        {item.description}
                      </p>
                      {typeof item.keyAchievements === "string" &&
                        item.keyAchievements.trim() && (
                          <ul className={`list-disc list-inside ${contentClass} text-gray-700 ml-4 space-y-1`}>
                            {item.keyAchievements
                              .split("\n")
                              .filter((achievement) => achievement.trim())
                              .map((achievement, subIndex) => (
                                <li key={`${item.company}-${index}-${subIndex}`}>
                                  {achievement}
                                </li>
                              ))}
                          </ul>
                        )}
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : null;

      case "projects":
        return resumeData.projects.length > 0 ? (
          <div className="mb-5">
            <h2 className={titleClass}>
              {customSectionTitles.projects || "PROJECTS"}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, "projects")}
            >
              <SortableContext
                items={resumeData.projects.map((_, idx) => `project-${idx}`)}
                strategy={verticalListSortingStrategy}
              >
                {resumeData.projects.map((item, index) => (
                  <SortableItem key={`project-${index}`} id={`project-${index}`}>
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`${contentClass} font-bold text-gray-900`}>
                              {item.name}
                            </h3>
                            {item.link && (
                              <Link
                                href={item.link}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FaExternalLinkAlt className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-700">
                            <DateRange
                              startYear={item.startYear}
                              endYear={item.endYear}
                              id={`projects-${index}`}
                            />
                          </p>
                        </div>
                      </div>
                      <p className={`${contentClass} text-gray-700 leading-relaxed mb-2`}>
                        {item.description}
                      </p>
                      {typeof item.keyAchievements === "string" &&
                        item.keyAchievements.trim() && (
                          <ul className={`list-disc list-inside ${contentClass} text-gray-700 ml-4 space-y-1`}>
                            {item.keyAchievements
                              .split("\n")
                              .filter((achievement) => achievement.trim())
                              .map((achievement, subIndex) => (
                                <li key={`${item.name}-${index}-${subIndex}`}>
                                  {achievement}
                                </li>
                              ))}
                          </ul>
                        )}
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : null;

      case "skills":
        return (
          <div className="mb-5">
            <h2 className={titleClass}>
              {customSectionTitles.skills || "SKILLS"}
            </h2>
            <div className="space-y-3">
              {resumeData.skills
                .filter((skill) => skill.title !== "Soft Skills")
                .map((skill, index) => (
                  <div key={`SKILLS-${index}`}>
                    <h3 className={`${contentClass} ${sidebarClass} font-semibold mb-1`}>
                      {skill.title}
                    </h3>
                    <ul className={`list-disc list-inside ${contentClass} ${sidebarClass} opacity-90 space-y-1`}>
                      {skill.skills.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        );

      case "softSkills":
        const softSkillsData = resumeData.skills.find(
          (skill) => skill.title === "Soft Skills"
        )?.skills;
        return softSkillsData && softSkillsData.length > 0 ? (
          <div className="mb-5">
            <h2 className={titleClass}>
              {customSectionTitles.softSkills || "SOFT SKILLS"}
            </h2> 
            {/* The error was here: changed </H2> to </h2> */}
            <ul className={`list-disc list-inside ${contentClass} ${sidebarClass} opacity-90 space-y-1`}>
              {softSkillsData.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
        ) : null;

      case "languages":
        return resumeData.languages.length > 0 ? (
          <div className="mb-5">
            <h2 className={titleClass}>
              {customSectionTitles.languages || "LANGUAGES"}
            </h2>
            <ul className={`list-disc list-inside ${contentClass} ${sidebarClass} opacity-90 space-y-1`}>
              {resumeData.languages.map((lang, idx) => (
                <li key={idx}>{lang}</li>
              ))}
            </ul>
          </div>
        ) : null;

      case "certifications":
        return resumeData.certifications.length > 0 ? (
          <div className="mb-5">
            <h2 className={titleClass}>
              {customSectionTitles.certifications || "CERTIFICATIONS"}
            </h2>
            <ul className={`${contentClass} ${sidebarClass} space-y-2`}>
              {resumeData.certifications.map((cert, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className={isSidebar ? "text-white" : "text-gray-700"}>•</span>
                  <div className="flex-1">
                    <span className={`${sidebarClass} opacity-90`}>
                      {typeof cert === "string" ? cert : cert.name}
                      {typeof cert === "object" && cert.issuer && (
                        <span className="opacity-75"> - {cert.issuer}</span>
                      )}
                    </span>
                    {typeof cert === "object" &&
                      cert.link &&
                      cert.link.trim() !== "" && (
                        <Link
                          href={cert.link}
                          className={`ml-2 ${isSidebar ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaExternalLinkAlt className="w-3 h-3 inline" />
                        </Link>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-full bg-white p-8">
        <div className="animate-pulse">
          <div className="flex gap-6">
            <div className="w-1/3 bg-gray-800 h-screen"></div>
            <div className="flex-1 space-y-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              {orderedSections.map((section) => (
                <div key={section.id} className="h-20 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex">
      {/* Left Sidebar - Dark Background */}
      <div className="w-1/3 bg-gray-800 text-white p-6">
        {/* Profile Section (if you have profile image, add here) */}
        <div className="mb-6 text-center">
          {/* Placeholder for profile image */}
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-bold">
            {resumeData.name ? resumeData.name.charAt(0) : "?"}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-6 space-y-3 text-xs">
          <div className="flex items-start gap-2">
            <MdPhone className="mt-1 flex-shrink-0" />
            <span className="break-words">{resumeData.contactInformation}</span>
          </div>
          <div className="flex items-start gap-2">
            <MdEmail className="mt-1 flex-shrink-0" />
            <span className="break-words">{resumeData.email}</span>
          </div>
          <div className="flex items-start gap-2">
            <MdLocationOn className="mt-1 flex-shrink-0" />
            <span className="break-words">{resumeData.address}</span>
          </div>
        </div>

        {/* Social Media */}
        {resumeData.socialMedia.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 pb-2 border-b border-white/30">
              CONNECT
            </h3>
            <div className="space-y-2 text-xs">
              {resumeData.socialMedia.slice(0, 5).map((social, index) => {
                const icon = icons.find(
                  (icon) => icon.name === social.socialMedia.toLowerCase()
                );
                return (
                  <Link
                    key={index}
                    href={`${
                      social.socialMedia.toLowerCase() === "website"
                        ? "https://"
                        : social.socialMedia.toLowerCase() === "linkedin"
                        ? "https://www."
                        : "https://www."
                    }${social.link}`}
                    className="flex items-center gap-2 hover:text-gray-300 transition-colors break-words"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {icon && icon.icon}
                    <span>{social.socialMedia}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Sidebar Sections */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={leftSections.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            {leftSections.map((section) => (
              <SortableSection key={section.id} id={section.id}>
                {renderSection(section, true)}
              </SortableSection>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Right Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6 pb-4 border-b-4 border-gray-800 no-break">
          <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-tight mb-1">
            {resumeData.name}
          </h1>
          <h2 className="text-xl text-gray-700 font-light">
            {resumeData.position}
          </h2>
        </div>

        {/* Main Content Sections */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rightSections.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            {rightSections.map((section) => (
              <SortableSection key={section.id} id={section.id}>
                {renderSection(section, false)}
              </SortableSection>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
//sidebar template

export default TemplateSeven;
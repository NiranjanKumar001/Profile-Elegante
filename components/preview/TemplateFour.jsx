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

// Classic Template Component - Professional and Clean
const TemplateFour = ({
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

  // Handle drag end for items within sections (same as Modern Template)
  const handleItemDragEnd = (event, sectionType) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Handle reordering within the same section
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

  // Define sections like Modern Template
  const sections = [
    {
      id: "summary",
      title: "Professional Summary",
      content: resumeData.summary,
    },
    { id: "education", title: "Education", content: resumeData.education },
    {
      id: "experience",
      title: "Experience",
      content: resumeData.workExperience,
    },
    { id: "projects", title: "Projects", content: resumeData.projects },
    { id: "skills", title: "Skills", content: resumeData.skills },
    {
      id: "softSkills",
      title: "Soft Skills",
      content:
        resumeData.skills.find((skill) => skill.title === "Soft Skills")
          ?.skills || [],
    },
    { id: "languages", title: "Languages", content: resumeData.languages },
    {
      id: "certifications",
      title: "Certifications",
      content: resumeData.certifications,
    },
    {
      id: "awards",
      title: "Awards & Achievements",
      content: resumeData.awards,
    },
  ];

  const orderedSections = sectionOrder
    .map((id) => sections.find((section) => section.id === id))
    .filter((section) => section !== undefined && enabledSections[section.id]);

  const renderSection = (section) => {
    switch (section.id) {
      case "summary":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1 text-gray-900">
              {customSectionTitles.summary || "Professional Summary"}
            </h2>
            <p className="content !text-gray-800 text-justify">
              {resumeData.summary}
            </p>
          </div>
        );

      case "education":
        return resumeData.education.length > 0 ? (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1 text-gray-900">
              {customSectionTitles.education || "Education"}
            </h2>
            {resumeData.education.map((item, index) => (
              <div
                key={index}
                className="mb-1 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h3 className="content font-semibold text-gray-900">
                    {item.school}
                  </h3>
                  <p className="content !text-gray-800">{item.degree}</p>
                </div>
                <div className="ml-4 text-right">
                  <DateRange
                    startYear={item.startYear}
                    endYear={item.endYear}
                    id={`education-${index}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null;

      case "experience":
        return resumeData.workExperience.length > 0 ? (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1 text-gray-900">
              {customSectionTitles.experience || "Professional Experience"}
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
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <h3 className="content flex items-center gap-1 i-bold text-gray-900">
                          {item.position} |{" "}
                          <p className="content !text-gray-800 !font-medium">
                            {" "}
                            {item.company}
                          </p>
                        </h3>
                      </div>
                      <div className="text-right">
                        <DateRange
                          startYear={item.startYear}
                          endYear={item.endYear}
                          id={`work-experience-${index}`}
                        />
                      </div>
                    </div>
                    <p className="content !text-gray-800 mb-2">
                      {item.description}
                    </p>
                    {item.keyAchievements === "string" &&
                      item.keyAchievements.trim() && (
                        <ul className="list-disc list-inside content !text-gray-800 ml-4">
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
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : null;

      case "projects":
        return resumeData.projects.length > 0 ? (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1 text-gray-900">
              {customSectionTitles.projects || "Projects"}
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
                  <SortableItem
                    key={`project-${index}`}
                    id={`project-${index}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="content i-bold text-gray-900">
                            {item.name}
                          </h3>
                          {item.link && (
                            <Link
                              href={item.link}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaExternalLinkAlt className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <DateRange
                          startYear={item.startYear}
                          endYear={item.endYear}
                          id={`projects-${index}`}
                        />
                      </div>
                    </div>
                    <p className="content !text-gray-800 mb-2">
                      {item.description}
                    </p>
                    {typeof item.keyAchievements === "string" &&
                      item.keyAchievements.trim() && (
                        <ul className="list-disc list-inside content !text-gray-800 ml-4">
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
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : null;

      case "skills":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1 text-gray-900">
              {customSectionTitles.skills || "Technical Skills"}
            </h2>
            {resumeData.skills
              .filter((skill) => skill.title !== "Soft Skills")
              .map((skill, index) => (
                <div key={`SKILLS-${index}`} className="mb-3">
                  <h3 className="content i-bold text-gray-900 mb-1">
                    {skill.title}
                  </h3>
                  <p className="content !text-gray-800">
                    {skill.skills.join(", ")}
                  </p>
                </div>
              ))}
          </div>
        );

      case "softSkills":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1 text-gray-900">
              {customSectionTitles.softSkills || "Soft Skills"}
            </h2>
            <p className="content !text-gray-800">
              {resumeData.skills
                .find((skill) => skill.title === "Soft Skills")
                ?.skills?.join(", ")}
            </p>
          </div>
        );

      case "languages":
        return resumeData.languages.length > 0 ? (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1 text-gray-900">
              {customSectionTitles.languages || "Languages"}
            </h2>
            <p className="content !text-gray-800">
              {resumeData.languages.join(", ")}
            </p>
          </div>
        ) : null;

      case "certifications":
        return resumeData.certifications.length > 0 ? (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1 text-gray-900">
              {customSectionTitles.certifications || "Certifications"}
            </h2>
            <ul className="list-disc list-inside content !text-gray-800">
              {resumeData.certifications.map((cert, index) => (
                <li key={index} className="mb-1">
                  <div className="flex items-center gap-2">
                    <span>
                      {typeof cert === "string" ? cert : cert.name}
                      {typeof cert === "object" && cert.issuer && (
                        <span className="text-gray-600"> - {cert.issuer}</span>
                      )}
                    </span>
                    {typeof cert === "object" &&
                      cert.link &&
                      cert.link.trim() !== "" && (
                        <Link
                          href={cert.link}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaExternalLinkAlt className="w-3 h-3" />
                        </Link>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      case "awards":
        return resumeData.awards?.length > 0 ? (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1 text-gray-900">
              {customSectionTitles.awards || "Awards & Achievements"}
            </h2>
            <ul className="list-disc list-inside content !text-gray-800">
              {resumeData.awards.map((award, index) => (
                <li key={index} className="mb-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-gray-900">
                        {award.name}
                      </span>
                      {award.issuer && (
                        <span className="text-gray-600"> - {award.issuer}</span>
                      )}
                      {award.description && (
                        <p className="text-gray-800 text-sm mt-0.5">
                          {award.description}
                        </p>
                      )}
                      {award.link && (
                        <Link
                          href={award.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-xs underline"
                        >
                          View Certificate / Photo
                        </Link>
                      )}
                    </div>
                    {award.date && (
                      <span className="text-xs text-gray-500">
                        {award.date}
                      </span>
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

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="w-full h-full bg-white p-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {resumeData.name}
          </h1>
          <p className="text-lg !text-gray-800">{resumeData.position}</p>
        </div>
        <div className="animate-pulse">
          <div className="space-y-4">
            {orderedSections.map((section) => (
              <div key={section.id} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white ">
      {/* Professional Header */}
      <div className="text-center mb-2 no-break">
        <h1 className="name">{resumeData.name}</h1>
        <h2 className="profession">{resumeData.position}</h2>

        {/* Contact Information */}
        <div className="flex justify-center items-center gap-4 contact mb-2">
          <div className="flex items-center gap-1">
            <MdPhone className="text-gray-500" />
            <span>{resumeData.contactInformation}</span>
          </div>
          <div className="flex items-center gap-1">
            <MdEmail className="text-gray-500" />
            <span>{resumeData.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <MdLocationOn className="text-gray-500" />
            <span>{resumeData.address}</span>
          </div>
        </div>

        {/* Social Media */}
        {resumeData.socialMedia.length > 0 &&
        resumeData.socialMedia.length < 6 ? (
          <div className="flex justify-center items-center gap-3 text-sm">
            {resumeData.socialMedia.map((socialMedia, index) => {
              const icon = icons.find(
                (icon) => icon.name === socialMedia.socialMedia.toLowerCase()
              );
              return (
                <Link
                  href={`${
                    socialMedia.socialMedia.toLowerCase() === "website"
                      ? "https://"
                      : socialMedia.socialMedia.toLowerCase() === "linkedin"
                      ? "https://www."
                      : "https://www."
                  }${socialMedia.link}`}
                  key={index}
                  className="inline-flex items-center gap-1 text-gray-800 transition-colors font-bold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon && icon.icon}
                  <span>{socialMedia.socialMedia}</span>
                  {index !== resumeData.socialMedia.length - 1 && (
                    <span>|</span>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-red-500">
            {" "}
            Social Media links are limited to 5 entries
          </div>
        )}
      </div>

      {/* Draggable Sections */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedSections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          {orderedSections.map((section) => (
            <SortableSection key={section.id} id={section.id}>
              {renderSection(section)}
            </SortableSection>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TemplateFour;

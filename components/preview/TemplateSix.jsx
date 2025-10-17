"use client";

import { FaExternalLinkAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone, MdLink } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import { BiBriefcase, BiBookAlt, BiCodeAlt, BiStar, BiTrophy } from "react-icons/bi";
import DateRange from "../utility/DateRange";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { SortableItem, SortableSection } from "./Preview";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

const TemplateSix = ({
  resumeData,
  sectionOrder,
  enabledSections,
  handleDragEnd,
  sensors,
  setResumeData,
}) => {
  const { customSectionTitles } = useSectionTitles();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleItemDragEnd = (event, sectionType) => {
    const { active, over } = event;

    if (active.id !== over?.id && setResumeData) {
      const updateArray = (arr) =>
        arrayMove(
          arr,
          parseInt(active.id.split("-")[1]),
          parseInt(over.id.split("-")[1])
        );
      if (sectionType === "projects")
        setResumeData((prev) => ({ ...prev, projects: updateArray(resumeData.projects) }));
      if (sectionType === "experience")
        setResumeData((prev) => ({ ...prev, workExperience: updateArray(resumeData.workExperience) }));
      if (sectionType === "education")
        setResumeData((prev) => ({ ...prev, education: updateArray(resumeData.education) }));
      if (sectionType === "awards")
        setResumeData((prev) => ({ ...prev, awards: updateArray(resumeData.awards) }));
    }
  };

  const sectionsMap = {
    summary: { id: "summary", title: "Professional Summary", content: resumeData.summary, icon: <BiBookAlt /> },
    experience: { id: "experience", title: "Experience", content: resumeData.workExperience, icon: <BiBriefcase /> },
    projects: { id: "projects", title: "Projects", content: resumeData.projects, icon: <BiCodeAlt /> },
    education: { id: "education", title: "Education", content: resumeData.education, icon: <GiGraduateCap /> },
    skills: { id: "skills", title: "Technical Skills", content: resumeData.skills.filter(s => s.title !== "Soft Skills"), icon: <BiCodeAlt /> },
    softSkills: { id: "softSkills", title: "Soft Skills", content: resumeData.skills.find(s => s.title === "Soft Skills")?.skills || [], icon: <BiStar /> },
    languages: { id: "languages", title: "Languages", content: resumeData.languages, icon: <BiBookAlt /> },
    certifications: { id: "certifications", title: "Certifications", content: resumeData.certifications, icon: <BiStar /> },
    awards: { id: "awards", title: "Awards & Achievements", content: resumeData.awards, icon: <BiTrophy /> },
  };

  const orderedSections = sectionOrder
    .map(id => sectionsMap[id])
    .filter(s => s && enabledSections[s.id] && s.content && (Array.isArray(s.content) ? s.content.length > 0 : s.content.length > 0));

  const SectionHeader = ({ id, icon, defaultTitle }) => (
    <div className="mb-2 print:mb-1">
      <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 mb-1">
        {customSectionTitles[id] || defaultTitle}
      </h2>
      <div className="w-full h-0.5 bg-gray-500 mb-3 print:mb-2"></div>
    </div>
  );

  const renderSectionContent = (section) => {
    switch (section.id) {
      case "summary":
        return (
          <div className="text-gray-700 text-sm leading-snug">
            {section.content}
          </div>
        );
      case "experience":
        return (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleItemDragEnd(e, "experience")}>
            <SortableContext items={resumeData.workExperience.map((_, i) => `work-${i}`)} strategy={verticalListSortingStrategy}>
              {resumeData.workExperience.map((item, index) => (
                <SortableItem key={`work-${index}`} id={`work-${index}`}>
                  <div className="mb-3 print:mb-2">
                    <div className="flex justify-between items-start text-sm">
                      <h3 className="font-bold text-gray-900 leading-tight">
                        {item.position}
                        <span className="font-normal text-gray-700 block italic">{item.company} | {item.location}</span>
                      </h3>
                      <DateRange
                        startYear={item.startYear}
                        endYear={item.endYear}
                        id={`exp-range-${index}`}
                        className="text-xs font-semibold text-gray-600 flex-shrink-0 ml-2 pt-1"
                      />
                    </div>
                    {item.description && <p className="text-gray-700 text-sm mt-1 leading-snug">{item.description}</p>}
                    {item.keyAchievements && (
                      <ul className="list-disc list-outside text-gray-700 mt-0.5 ml-5 text-sm leading-snug">
                        {item.keyAchievements.split("\n").filter(a => a.trim()).map((a, idx) => <li key={idx}>{a}</li>)}
                      </ul>
                    )}
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        );
      case "projects":
        return (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleItemDragEnd(e, "projects")}>
            <SortableContext items={resumeData.projects.map((_, i) => `project-${i}`)} strategy={verticalListSortingStrategy}>
              {resumeData.projects.map((item, index) => (
                <SortableItem key={`project-${index}`} id={`project-${index}`}>
                  <div className="mb-3 print:mb-2">
                    <div className="flex justify-between items-start text-sm">
                      <h3 className="font-bold text-gray-900 leading-tight flex items-center gap-2">
                        {item.name}
                        {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black"><FaExternalLinkAlt className="w-3 h-3" /></a>}
                      </h3>
                      <DateRange
                        startYear={item.startYear}
                        endYear={item.endYear}
                        id={`proj-range-${index}`}
                        className="text-xs font-semibold text-gray-600 flex-shrink-0 ml-2 pt-1"
                      />
                    </div>
                    <p className="text-gray-700 text-sm mt-0.5 leading-snug">{item.description}</p>
                    {item.technologies && <p className="text-xs text-gray-600 mt-0.5">Tech Stack: {item.technologies}</p>}
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        );
      case "education":
        return (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleItemDragEnd(e, "education")}>
            <SortableContext items={resumeData.education.map((_, i) => `education-${i}`)} strategy={verticalListSortingStrategy}>
              {resumeData.education.map((item, index) => (
                <SortableItem key={`education-${index}`} id={`education-${index}`}>
                  <div className="mb-3 print:mb-2">
                    <div className="flex justify-between items-start text-sm">
                      <h3 className="font-bold text-gray-900 leading-tight">
                        {item.degree}
                        <span className="font-normal text-gray-700 block italic">{item.school} | {item.location}</span>
                      </h3>
                      <DateRange
                        startYear={item.startYear}
                        endYear={item.endYear}
                        id={`edu-range-${index}`}
                        className="text-xs font-semibold text-gray-600 flex-shrink-0 ml-2 pt-1"
                      />
                    </div>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        );
      case "awards":
        return (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleItemDragEnd(e, "awards")}>
            <SortableContext items={resumeData.awards.map((_, i) => `award-${i}`)} strategy={verticalListSortingStrategy}>
              {resumeData.awards.map((award, index) => (
                <SortableItem key={`award-${index}`} id={`award-${index}`}>
                  <div className="mb-3 print:mb-2 text-sm text-gray-700">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 leading-tight flex items-center gap-2">
                        {award.name}
                        {award.link && (
                          <Link href={award.link} target="_blank" className="text-gray-500 hover:text-black">
                            <FaExternalLinkAlt className="w-3 h-3" />
                          </Link>
                        )}
                      </h3>
                      <span className="text-xs font-semibold text-gray-600 flex-shrink-0 ml-2 pt-1">
                        {award.date}
                      </span>
                    </div>
                    {award.issuer && (
                      <p className="italic text-gray-600 text-xs mb-1">
                        {award.issuer}
                      </p>
                    )}
                    {award.description && (
                      <p className="text-gray-700 text-sm leading-snug">
                        {award.description}
                      </p>
                    )}
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        );
      case "certifications": // NEW LOGIC FOR CERTIFICATIONS
        return (
          <ul className="list-disc list-outside text-gray-700 ml-4 text-sm leading-snug">
            {resumeData.certifications.map((cert, index) => {
              // Handle both string and object formats for backward compatibility
              const name = typeof cert === 'string' ? cert : cert.name;
              const issuer = typeof cert === 'object' ? cert.issuer : null;
              const link = typeof cert === 'object' ? cert.link : null;

              return (
                <li key={index} className="mb-1">
                  <span className="font-semibold">{name}</span>
                  {issuer && <span className="italic text-gray-600"> (Issuer: {issuer})</span>}
                  {link && link.trim() !== "" && (
                    <Link href={link} target="_blank" className="text-gray-500 hover:text-black ml-2">
                      <FaExternalLinkAlt className="w-3 h-3 inline align-baseline" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        );
      case "skills":
      case "softSkills":
      case "languages":
        const listContent = Array.isArray(section.content)
          ? section.content.map(s => typeof s === "string" ? s : s.skills?.join(", ") || s.name).join(" | ")
          : section.content;
        return <p className="text-gray-700 text-sm leading-snug font-semibold">{listContent}</p>;

      default:
        return null;
    }
  };

  if (!isClient) return <div className="animate-pulse p-4 bg-white h-full w-full"></div>;

  return (
    <div className="w-full h-full bg-white p-6 print:p-0 font-serif">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 mb-4 print:p-2 print:mb-2">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">
          {resumeData.name}
        </h1>
        <h2 className="text-xl font-light mb-3 opacity-90">
          {resumeData.position}
        </h2>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm opacity-80">
          {resumeData.contactInformation && (
            <div className="flex items-center gap-1">
              <MdPhone className="w-4 h-4" /> <span>{resumeData.contactInformation}</span>
            </div>
          )}
          {resumeData.email && (
            <div className="flex items-center gap-1">
              <MdEmail className="w-4 h-4" /> <span>{resumeData.email}</span>
            </div>
          )}
          {resumeData.address && (
            <div className="flex items-center gap-1">
              <MdLocationOn className="w-4 h-4" /> <span>{resumeData.address}</span>
            </div>
          )}
          {resumeData.linkedin && (
            <div className="flex items-center gap-1">
              <MdLink className="w-4 h-4" /> <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="underline">{resumeData.linkedin}</a>
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="px-4 print:px-0">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={orderedSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {orderedSections.map(section => (
              <SortableSection key={section.id} id={section.id}>
                <div className="mb-4 print:mb-2">
                  <SectionHeader
                    id={section.id}
                    icon={section.icon}
                    defaultTitle={section.title}
                  />
                  {renderSectionContent(section)}
                </div>
              </SortableSection>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default TemplateSix;
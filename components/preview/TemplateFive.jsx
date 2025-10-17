"use client";

import { FaExternalLinkAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import { BiBriefcase, BiBookAlt, BiCodeAlt } from "react-icons/bi";
import DateRange from "../utility/DateRange";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { SortableItem, SortableSection } from "./Preview";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";


const TemplateFive = ({
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
    }
  };

  const sections = [
    { id: "summary", title: "Professional Summary", content: resumeData.summary },
    { id: "experience", title: "Experience", content: resumeData.workExperience },
    { id: "projects", title: "Projects", content: resumeData.projects },
  ];

  const sidebarSections = [
    { id: "education", title: "Education", content: resumeData.education, icon: <GiGraduateCap /> },
    { id: "skills", title: "Technical Skills", content: resumeData.skills.filter((s) => s.title !== "Soft Skills"), icon: <BiCodeAlt /> },
    { id: "softSkills", title: "Soft Skills", content: resumeData.skills.find((s) => s.title === "Soft Skills")?.skills || [], icon: <BiBookAlt /> },
    { id: "languages", title: "Languages", content: resumeData.languages, icon: <BiBookAlt /> },
    { id: "certifications", title: "Certifications", content: resumeData.certifications, icon: <BiBookAlt /> },
    { id: "awards", title: "Awards & Achievements", content: resumeData.awards, icon: <BiBookAlt /> },
  ];

  const orderedSections = sectionOrder
    .map((id) => sections.find((s) => s.id === id))
    .filter((s) => s && enabledSections[s.id]);

  const renderMainSection = (section) => {
    switch (section.id) {
      case "summary":
        return (
          <div className="mb-3 print:mb-2">
            <h2 className="section-title-main flex items-center gap-1 text-black font-bold pb-0.5 mb-1 border-b border-gray-900">
              <BiBookAlt className="w-4 h-4" /> {customSectionTitles.summary || "Professional Summary"}
            </h2>
            <p className="text-gray-800 text-justify text-sm leading-snug">{section.content}</p>
          </div>
        );
      case "experience":
        return (
          <div className="mb-3 print:mb-2">
            <h2 className="section-title-main flex items-center gap-1 text-black font-bold pb-0.5 mb-2 border-b border-gray-900">
              <BiBriefcase className="w-4 h-4" /> {customSectionTitles.experience || "Professional Experience"}
            </h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleItemDragEnd(e, "experience")}>
              <SortableContext items={resumeData.workExperience.map((_, i) => `work-${i}`)} strategy={verticalListSortingStrategy}>
                {resumeData.workExperience.map((item, index) => (
                  <SortableItem key={`work-${index}`} id={`work-${index}`}>
                    <div className="relative pl-4 mb-2">
                      <div className="absolute left-0 top-1 w-2 h-2 bg-black rounded-full"></div>
                      <div className="p-0 bg-white border-l border-gray-300 ml-1">
                        <h3 className="font-bold text-gray-900 text-sm leading-snug">{item.position} | {item.company}</h3>
                        <DateRange startYear={item.startYear} endYear={item.endYear} id={`exp-${index}`} className="text-xs text-gray-700 block" />
                        <p className="text-gray-800 mt-1 text-sm leading-snug">{item.description}</p>
                        {item.keyAchievements && (
                          <ul className="list-disc list-inside text-gray-800 mt-1 ml-3 text-sm leading-snug">
                            {item.keyAchievements.split("\n").filter(a => a.trim()).map((a, idx) => <li key={idx}>{a}</li>)}
                          </ul>
                        )}
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        );
      case "projects":
        return (
          <div className="mb-3 print:mb-2">
            <h2 className="section-title-main flex items-center gap-1 text-black font-bold pb-0.5 mb-2 border-b border-gray-900">
              <BiCodeAlt className="w-4 h-4" /> {customSectionTitles.projects || "Projects"}
            </h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleItemDragEnd(e, "projects")}>
              <SortableContext items={resumeData.projects.map((_, i) => `project-${i}`)} strategy={verticalListSortingStrategy}>
                {resumeData.projects.map((item, index) => (
                  <SortableItem key={`project-${index}`} id={`project-${index}`}>
                    <div className="relative pl-4 mb-2">
                      <div className="absolute left-0 top-1 w-2 h-2 bg-black rounded-full"></div>
                      <div className="p-0 bg-white border-l border-gray-300 ml-1">
                        <h3 className="font-bold text-gray-900 text-sm leading-snug flex items-center gap-1">
                          {item.name}
                          {item.link && <Link href={item.link} target="_blank" className="text-gray-600 hover:text-black"><FaExternalLinkAlt className="w-3 h-3" /></Link>}
                        </h3>
                        <DateRange startYear={item.startYear} endYear={item.endYear} id={`proj-${index}`} className="text-xs text-gray-700 block" />
                        <p className="text-gray-800 mt-1 text-sm leading-snug">{item.description}</p>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSidebarSection = (section) => {
    if (!section.content || (Array.isArray(section.content) && section.content.length === 0)) return null;

    return (
      <div className="mb-3 print:mb-2">
        <h2 className="flex items-center gap-1 text-black font-bold pb-0.5 mb-1 border-b border-gray-900">
          <span className="text-black">{section.icon}</span> <span className="text-sm uppercase">{customSectionTitles[section.id] || section.title}</span>
        </h2>

        {section.id === "education" ? (
          <ul className="text-gray-800 text-sm space-y-1">
            {resumeData.education.map((item, idx) => (
              <li key={idx}>
                <p className="font-semibold">{item.school}</p>
                <div className="text-xs text-gray-700">
                  {item.degree} - <DateRange startYear={item.startYear} endYear={item.endYear} id={`edu-range-${idx}`} />
                </div>
              </li>
            ))}
          </ul>
        ) : section.id === "awards" ? (
          <ul className="list-disc list-inside text-gray-800 text-sm ml-2 space-y-2">
            {section.content.map((item, idx) => (
              <li key={idx}>
                {item.name && <p className="font-semibold">{item.name}</p>}
                {item.issuer && <p className="text-xs text-gray-600">Issuer: {item.issuer}</p>}
                {item.date && <p className="text-xs text-gray-500">Date: {item.date}</p>}
                {item.description && <p className="text-sm text-gray-800 mt-1">{item.description}</p>}
                {item.link && (
                  <Link href={item.link} target="_blank" className="text-blue-600 underline text-xs">
                    View Certificate / Photo
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : section.id === "certifications" ? (
          <ul className="list-disc list-inside text-gray-800 text-sm ml-2 space-y-1">
            {section.content.map((item, idx) => <li key={idx}>{typeof item === "string" ? item : item.name || item.title || item.issuer}</li>)}
          </ul>
        ) : Array.isArray(section.content) ? (
          section.id === "skills" || section.id === "softSkills" || section.id === "languages" ? (
            <div className="text-gray-800 text-sm leading-snug">
              {section.id === "skills" ? (
                section.content.map((group, idx) => (
                  <div key={idx} className="mb-1">
                    <p className="font-semibold text-xs">{group.title}:</p>
                    <p className="text-sm">{group.skills?.join(", ")}</p>
                  </div>
                ))
              ) : (
                <p>{section.content.map((s) => (typeof s === "string" ? s : s.skills?.join(", "))).join(", ")}</p>
              )}
            </div>
          ) : (
            <ul className="list-disc list-inside text-gray-800 text-sm ml-2 space-y-1">
              {section.content.map((item, idx) => <li key={idx}>{typeof item === "string" ? item : item.school || item.name}</li>)}
            </ul>
          )
        ) : (
          <p className="text-gray-800 text-sm">{section.content}</p>
        )}
      </div>
    );
  };

  if (!isClient) return <div className="animate-pulse p-4 bg-white h-full w-full"></div>;

  return (
    <div className="w-full h-full bg-white p-6 print:p-0">
      {/* Header */}
      <div className="text-center mb-4 border-b border-gray-900 pb-1">
        <h1 className="text-2xl font-bold text-gray-900 inline-block px-0 py-0">{resumeData.name}</h1>
        <h2 className="text-base font-semibold text-gray-800 mt-0.5">{resumeData.position}</h2>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-0.5 mt-1 text-gray-700 text-sm">
          {resumeData.contactInformation && <div className="flex items-center gap-1"><MdPhone className="w-3 h-3 text-gray-700" /><span>{resumeData.contactInformation}</span></div>}
          {resumeData.email && <div className="flex items-center gap-1"><MdEmail className="w-3 h-3 text-gray-700" /><span>{resumeData.email}</span></div>}
          {resumeData.address && <div className="flex items-center gap-1"><MdLocationOn className="w-3 h-3 text-gray-700" /><span>{resumeData.address}</span></div>}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-4 print:gap-3">
        <div className="w-full md:w-1/3 p-0 bg-white">
          {sidebarSections.map((section) => enabledSections[section.id] && <div key={section.id}>{renderSidebarSection(section)}</div>)}
        </div>
        <div className="w-full md:w-2/3 p-0 border-l border-gray-300 pl-4 print:pl-3">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={orderedSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {orderedSections.map((section) => <SortableSection key={section.id} id={section.id}>{renderMainSection(section)}</SortableSection>)}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default TemplateFive;

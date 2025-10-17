"use client";

import React, { useState, useEffect } from "react";
import ContactInfo from "./ContactInfo";
import Link from "next/link";
import { FaExternalLinkAlt, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import Certification from "./Certification";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component for individual items within sections
const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-2 cursor-move ${isDragging ? "bg-gray-50 shadow-lg" : ""}`}
    >
      {children}
    </div>
  );
};

// Sortable Section Component for main sections
const SortableSection = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-2 cursor-move ${isDragging ? "bg-gray-50 shadow-lg rounded" : ""}`}
    >
      {children}
    </div>
  );
};

const TemplateTwo = ({ 
  namedata, 
  positiondata, 
  contactdata, 
  emaildata, 
  addressdata, 
  telicon, 
  emailicon, 
  addressicon,
  summarydata,
  educationdata,
  projectsdata,
  workExperiencedata,
  skillsdata,
  languagesdata,
  certificationsdata,
  awardsdata, // <-- new prop
  sectionOrder,
  enabledSections,
  onDragEnd,
  resumeData,
  setResumeData
}) => {
  const [isClient, setIsClient] = useState(false);
  const { customSectionTitles } = useSectionTitles();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sections = [
    { id: "summary", title: customSectionTitles.summary || "Summary", content: summarydata },
    { id: "education", title: customSectionTitles.education || "Education", content: educationdata },
    { id: "projects", title: customSectionTitles.projects || "Projects", content: projectsdata },
    { id: "experience", title: customSectionTitles.experience || "Work Experience", content: workExperiencedata },
    { id: "skills", title: customSectionTitles.skills || "Technical Skills", content: skillsdata },
    { id: "softskills", title: customSectionTitles.softskills || "Soft Skills", content: skillsdata?.find(skill => skill.title === "Soft Skills")?.skills || [] },
    { id: "languages", title: customSectionTitles.languages || "Languages", content: languagesdata },
    { id: "certifications", title: customSectionTitles.certifications || "Certifications", content: certificationsdata },
    { id: "awards", title: customSectionTitles.awards || "Awards", content: awardsdata } // <-- new section
  ];

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end for sections
  const handleSectionDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      if (onDragEnd) {
        const result = {
          draggableId: active.id,
          type: 'SECTION',
          source: { index: sectionOrder.indexOf(active.id) },
          destination: { index: sectionOrder.indexOf(over.id) },
        };
        onDragEnd(result);
      }
    }
  };

  // Handle drag end for items within sections
  const handleItemDragEnd = (event, sectionType) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      if (sectionType === 'projects' && setResumeData) {
        const oldIndex = parseInt(active.id.replace('project-', ''));
        const newIndex = parseInt(over.id.replace('project-', ''));
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newProjects = arrayMove(projectsdata, oldIndex, newIndex);
          setResumeData(prev => ({ ...prev, projects: newProjects }));
        }
      } else if (sectionType === 'experience' && setResumeData) {
        const oldIndex = parseInt(active.id.replace('work-', ''));
        const newIndex = parseInt(over.id.replace('work-', ''));
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newExperience = arrayMove(workExperiencedata, oldIndex, newIndex);
          setResumeData(prev => ({ ...prev, workExperience: newExperience }));
        }
      } else if (sectionType === 'awards' && setResumeData) {
        const oldIndex = parseInt(active.id.replace('award-', ''));
        const newIndex = parseInt(over.id.replace('award-', ''));
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newAwards = arrayMove(awardsdata, oldIndex, newIndex);
          setResumeData(prev => ({ ...prev, awards: newAwards }));
        }
      }
    }
  };

  const orderedSections = sectionOrder
    .map(id => sections.find(section => section.id === id))
    .filter(section => section !== undefined && (!enabledSections || enabledSections[section.id]));

  if (!isClient) {
    return <div className="w-full h-96 bg-gray-50 animate-pulse rounded-lg"></div>;
  }

  const renderSection = (section) => {
    switch(section.id) {
      case "certifications":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">
              {customSectionTitles.certifications || "Certifications"}
            </h2>
            <ul className="list-disc pl-4 content">
              {certificationsdata && certificationsdata.map((cert, i) => (
                <li key={i} className="content">
                  <div className="flex items-center gap-2">
                    <span>
                      {cert.name}
                      {cert.issuer && (
                        <span className="text-gray-600"> - {cert.issuer}</span>
                      )}
                    </span>
                    {cert.link && cert.link.trim() !== '' && (
                      <a
                        href={cert.link}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      case "awards":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">
              {customSectionTitles.awards || "Awards"}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, 'awards')}
            >
              <SortableContext
                items={awardsdata && awardsdata.length > 0 ? awardsdata.map((_, idx) => `award-${idx}`) : []}
                strategy={verticalListSortingStrategy}
              >
                {awardsdata && awardsdata.map((award, i) => (
                  <SortableItem key={`award-${i}`} id={`award-${i}`}>
                    <div className="flex items-center gap-2">
                      <span>
                        {award.title}
                        {award.year && <span className="text-gray-600"> - {award.year}</span>}
                      </span>
                      {award.link && award.link.trim() !== '' && (
                        <Link
                          href={award.link}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaExternalLinkAlt className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        );
      case "summary":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">
              {customSectionTitles.summary || "Summary"}
            </h2>
            <p className="content">{summarydata}</p>
          </div>
        );
      case "education":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">
              {customSectionTitles.education || "Education"}
            </h2>
            {educationdata && educationdata.map((edu, idx) => (
              <div key={idx} className="mb-1 flex justify-between items-start">
                <div className="flex-1">
                  <p className="content font-semibold">{edu.school}</p>
                  <p className="content">{edu.degree}</p>
                </div>
                <div className="ml-4 text-right">
                  <p className="sub-content font-medium text-gray-600">
                    {new Date(edu.startYear).getFullYear()} - {new Date(edu.endYear).getFullYear()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      case "projects":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">
              {customSectionTitles.projects || "Projects"}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, 'projects')}
            >
              <SortableContext
                items={projectsdata && projectsdata.length > 0 ? projectsdata.map((_, idx) => `project-${idx}`) : []}
                strategy={verticalListSortingStrategy}
              >
                {projectsdata && projectsdata.map((project, idx) => (
                  <SortableItem key={`project-${idx}`} id={`project-${idx}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <p className="content i-bold">{project.name}</p>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            title={project.link}
                          >
                            <FaExternalLinkAlt size={12} />
                          </a>
                        )}
                      </div>
                      <p className="sub-content font-medium text-gray-600">
                        {new Date(project.startYear).getFullYear()} - {new Date(project.endYear).getFullYear()}
                      </p>
                    </div>
                    <p className="content">{project.description}</p>
                    {project.keyAchievements && (
                      <ul className="list-disc pl-4 content">
                        {project.keyAchievements.split('\n').map((achievement, i) => (
                          <li key={i} className="content">{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        );
      case "experience":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">
              {customSectionTitles.experience || "Work Experience"}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, 'experience')}
            >
              <SortableContext
                items={workExperiencedata && workExperiencedata.length > 0 ? workExperiencedata.map((_, idx) => `work-${idx}`) : []}
                strategy={verticalListSortingStrategy}
              >
                {workExperiencedata && workExperiencedata.map((work, idx) => (
                  <SortableItem key={`work-${idx}`} id={`work-${idx}`}>
                    <div className="flex justify-between items-center">
                      <p className="content">
                        <span className="font-bold">{work.company}</span>
                        <span className="mx-1">-</span>
                        <span>{work.position}</span>
                      </p>
                      <p className="sub-content font-medium text-gray-600">
                        {new Date(work.startYear).getFullYear()} - {new Date(work.endYear).getFullYear()}
                      </p>
                    </div>
                    <p className="content">{work.description}</p>
                    <p className="content">{work.keyAchievements}</p>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        );
      case "skills":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">
              {customSectionTitles.skills || "Technical Skills"}
            </h2>
            <div className="content">
              {skillsdata && skillsdata
                .filter(skill => skill.title !== "Soft Skills")
                .map((skillCategory, index) => (
                  <div key={index} className="mb-3">
                    <h3 className="font-semibold text-sm text-gray-700 mb-1">
                      {skillCategory.title}
                    </h3>
                    <p className="text-gray-600">
                      {skillCategory.skills && skillCategory.skills.join(", ")}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        );
      case "softskills":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">
              {customSectionTitles.softskills || "Soft Skills"}
            </h2>
            <p className="content">
              {skillsdata && skillsdata.find(skill => skill.title === "Soft Skills")?.skills?.join(", ")}
            </p>
          </div>
        );
      case "languages":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">
              {customSectionTitles.languages || "Languages"}
            </h2>
            <p className="content">
              {section.content && Array.isArray(section.content) ? section.content.join(", ") : ""}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const icons = [
    { name: "linkedin", icon: <FaLinkedin /> },
    { name: "twitter", icon: <FaTwitter /> },
    { name: "facebook", icon: <FaFacebook /> },
    { name: "instagram", icon: <FaInstagram /> },
    { name: "youtube", icon: <FaYoutube /> },
    { name: "website", icon: <CgWebsite /> },
  ];

  const getUsername = (url) => url.split('/').pop();

  return (
    <div className="w-full h-full bg-white p-4">
      {/* Header Section */}
      <div className="text-center mb-2">
        <h1 className="name">{namedata}</h1>
        <p className="profession">{positiondata}</p>
        <ContactInfo
          mainclass="flex flex-row gap-1 contact justify-center"
          linkclass="inline-flex items-center gap-1"
          teldata={contactdata}
          emaildata={emaildata}
          addressdata={addressdata}
          telicon={telicon}
          emailicon={emailicon}
          addressicon={addressicon}
        />
        <div className="flex justify-center items-center gap-2 mt-1 text-sm">
          {resumeData && resumeData.socialMedia && resumeData.socialMedia.map((socialMedia, index) => (
            <a
              href={`http://${socialMedia.link}`}
              aria-label={socialMedia.socialMedia}
              key={index}
              title={socialMedia.socialMedia}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-[2px] text-blue-600 hover:text-blue-800 transition-colors"
            >
              {icons.map((icon, idx) => icon.name === socialMedia.socialMedia.toLowerCase() ? <span key={idx} className="text-sm">{icon.icon}</span> : null)}
              {getUsername(socialMedia.link)}
            </a>
          ))}
        </div>
      </div>

      {/* Draggable Sections */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionDragEnd}
      >
        <SortableContext
          items={orderedSections.map(section => section.id)}
          strategy={verticalListSortingStrategy}
        >
          {orderedSections.map((section, index) => (
            <SortableSection key={section.id} id={section.id}>
              {renderSection(section)}
            </SortableSection>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TemplateTwo;

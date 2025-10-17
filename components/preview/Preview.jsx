"use client";

import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaExternalLinkAlt,
  FaChevronDown,
  FaFileAlt,
  FaTh,
  FaEyeSlash,
  FaHackerrank,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { CgWebsite } from "react-icons/cg";
import DateRange from "../utility/DateRange";
import Link from "next/link";
import React, { useContext, useState, useEffect, useRef } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";
import TemplateTwo from "./TemplateTwo";
import TemplateFour from "./TemplateFour"
import TemplateFive from "./TemplateFive"
import TemplateSix from "./TemplateSix"

// Import the new TemplateSeven component
import TemplateSeven from "./TemplateSeven"

import { useSectionTitles } from "../../contexts/SectionTitleContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImGithub } from "react-icons/im";
import { SiCodeforces, SiLeetcode } from "react-icons/si";

const Preview = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const [currentTemplate, setCurrentTemplate] = useState("template1");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side initialization
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const savedTemplate = localStorage.getItem("currentTemplate");
      if (savedTemplate) {
        setCurrentTemplate(savedTemplate);
      }
    }
  }, []);

  // Save template selection to localStorage
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      localStorage.setItem("currentTemplate", currentTemplate);
    }
  }, [currentTemplate, isClient]);

  // Available templates (TemplateSeven added here)
  const templates = [
    {
      id: "template1",
      name: "Classic Template",
      description: "Clean and professional layout",
      icon: FaFileAlt,
    },
    {
      id: "template2",
      name: "Modern Template",
      description: "Dynamic with drag-and-drop sections",
      icon: FaTh,
    },
    {
      id: "template3",
      name: "Classic Template II",
      description: "Clean and ATS friendly",
      icon: FaTh,
    },
    {
      id: "template5",
      name: "Fancy Template",
      description: "New modern layout",
      icon: FaFileAlt,
    },
    {
      id: "template6",
      name: "Smart Template",
      description: "clean layout with divisions",
      icon: FaFileAlt,
    },
    // ADDED TEMPLATESEVEN
    {
      id: "template7",
      name: "Sidebar Template",
      description: "Two-column professional layout",
      icon: FaTh,
    },
  ];

  const defaultSections = [
    "summary",
    "education",
    "experience",
    "projects",
    "skills",
    "softSkills",
    "languages",
    "certifications",
  ];

  const sectionLabels = {
    summary: "Professional Summary",
    education: "Education",
    experience: "Professional Experience",
    projects: "Projects",
    skills: "Technical Skills",
    softSkills: "Soft Skills",
    languages: "Languages",
    certifications: "Certifications",
  };

  const [sectionOrder, setSectionOrder] = useState(defaultSections);
  const [enabledSections, setEnabledSections] = useState(() => {
    // All sections enabled by default
    const initial = {};
    defaultSections.forEach((section) => {
      initial[section] = true;
    });
    return initial;
  });
  const [showSectionToggle, setShowSectionToggle] = useState(false);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (toggleRef.current && !toggleRef.current.contains(event.target)) {
        setShowSectionToggle(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setShowSectionToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle section toggle
  const toggleSection = (sectionId) => {
    setEnabledSections((prev) => {
      const updated = {
        ...prev,
        [sectionId]: !prev[sectionId],
      };
      if (isClient) {
        localStorage.setItem("enabledSections", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const icons = [
    { name: "linkedin", icon: <FaLinkedin /> },
    { name: "twitter", icon: <FaTwitter /> },
    { name: "facebook", icon: <FaFacebook /> },
    { name: "instagram", icon: <FaInstagram /> },
    { name: "youtube", icon: <FaYoutube /> },
    { name: "website", icon: <CgWebsite /> },
    { name: "github", icon: <ImGithub /> },
    { name: "leetcode", icon: <SiLeetcode /> },
    {name: "hackerrank", icon: <FaHackerrank />},
    {name: "hacker rank", icon: <FaHackerrank />},
    {name: "codeforces", icon: <SiCodeforces />}
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedOrder = localStorage.getItem("sectionOrder");
      const savedEnabled = localStorage.getItem("enabledSections");

      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        // Add missing sections
        if (!parsedOrder.includes("certifications")) {
          parsedOrder.push("certifications");
        }
        if (!parsedOrder.includes("education")) {
          // Insert education after summary if it exists, otherwise at the beginning
          const summaryIndex = parsedOrder.indexOf("summary");
          if (summaryIndex !== -1) {
            parsedOrder.splice(summaryIndex + 1, 0, "education");
          } else {
            parsedOrder.unshift("education");
          }
        }
        setSectionOrder(parsedOrder);
      } else {
        localStorage.setItem("sectionOrder", JSON.stringify(defaultSections));
      }

      if (savedEnabled) {
        const parsedEnabled = JSON.parse(savedEnabled);
        // Ensure all default sections are represented
        const updatedEnabled = {};
        defaultSections.forEach((section) => {
          updatedEnabled[section] = parsedEnabled.hasOwnProperty(section)
            ? parsedEnabled[section]
            : true;
        });
        setEnabledSections(updatedEnabled);
      } else {
        const initial = {};
        defaultSections.forEach((section) => {
          initial[section] = true;
        });
        localStorage.setItem("enabledSections", JSON.stringify(initial));
      }
    }
  }, [isClient]);

  // Handle drag and drop for section reordering using @dnd-kit
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        if (isClient) {
          localStorage.setItem("sectionOrder", JSON.stringify(newOrder));
        }

        return newOrder;
      });
    }
  };

  // Legacy drag end handler for TemplateTwo compatibility
  const onDragEnd = (result) => {
    if (!result.destination || !isClient) return;

    const { source, destination } = result;

    if (source.index !== destination.index) {
      const newOrder = Array.from(sectionOrder);
      const [reorderedItem] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, reorderedItem);

      setSectionOrder(newOrder);
      localStorage.setItem("sectionOrder", JSON.stringify(newOrder));
    }
  };

  return (
    <div className='w-full h-screen sticky top-0 preview rm-padding-print overflow-y-auto bg-gray-50'>
      {/* Template Dropdown */}
      <div className="absolute top-2   right-4 sm:right-6 z-50 exclude-print">
        <div className="flex flex-row  gap-2 sm:gap-3">
          {/* Section Toggle Button */}
          <div className='relative' ref={toggleRef}>
            <button
              onClick={() => setShowSectionToggle(!showSectionToggle)}
              className='flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors shadow-lg text-xs sm:text-sm'
              title='Toggle Sections'
            >
              <FaTh className='w-3 h-3 sm:w-4 sm:h-4' />
              <span className='font-medium hidden sm:inline'>Sections</span>
              <span className='font-medium sm:hidden'>Sec</span>
              <FaChevronDown
                className={`w-2 h-2 sm:w-3 sm:h-3 transition-transform ${showSectionToggle ? "rotate-180" : ""}`}
              />
            </button>

            {/* Section Toggle Dropdown */}
            {showSectionToggle && (
              <div className='absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-3'>
                <div className='px-3 sm:px-4 pb-2 border-b border-gray-200'>
                  <h3 className='text-xs sm:text-sm font-semibold text-gray-900'>
                    Toggle Resume Sections
                  </h3>
                  <p className='text-xs text-gray-600 mt-1'>
                    Hide sections you don&apos;t need (e.g., freshers can hide
                    experience)
                  </p>
                </div>
                <div className='py-2 max-h-60 overflow-y-auto'>
                  {defaultSections.map((sectionId) => (
                    <label
                      key={sectionId}
                      className='flex items-center gap-3 px-4 py-2 hover:bg-pink-50 cursor-pointer'
                    >
                      <input
                        type='checkbox'
                        checked={enabledSections[sectionId]}
                        onChange={() => toggleSection(sectionId)}
                        className='w-4 h-4 text-pink-600 bg-white border-2 border-gray-300 rounded focus:ring-pink-500 focus:ring-2 checked:bg-pink-600 checked:border-pink-600'
                      />
                      <span className='text-sm text-gray-900 flex-1'>
                        {sectionLabels[sectionId]}
                      </span>
                      {!enabledSections[sectionId] && (
                        <FaEyeSlash
                          className='w-4 h-4 text-gray-400'
                          title='Hidden'
                        />
                      )}
                    </label>
                  ))}
                </div>
                <div className='px-4 pt-2 border-t border-gray-200'>
                  <div className='text-xs text-gray-500'>
                    {Object.values(enabledSections).filter(Boolean).length} of{" "}
                    {defaultSections.length} sections visible
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Template Selector */}
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className='flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors shadow-lg text-xs sm:text-sm'
            >
              <FaFileAlt className='w-3 h-3 sm:w-4 sm:h-4' />
              <span className='font-medium hidden sm:inline'>
                {templates.find((t) => t.id === currentTemplate)?.name}
              </span>
              <span className='font-medium sm:hidden'>
                {
                  templates
                    .find((t) => t.id === currentTemplate)
                    ?.name.split(" ")[0]
                }
              </span>
              <FaChevronDown
                className={`w-2 h-2 sm:w-3 sm:h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2'>
                {templates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => {
                        setCurrentTemplate(template.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-pink-50 transition-colors ${
                        currentTemplate === template.id
                          ? "bg-pink-50 border-r-2 border-pink-500"
                          : ""
                      }`}
                    >
                      <IconComponent
                        className={`w-4 h-4 ${currentTemplate === template.id ? "text-pink-600" : "text-gray-600"}`}
                      />
                      <div className='text-left'>
                        <div
                          className={`font-medium text-sm ${currentTemplate === template.id ? "text-pink-900" : "text-gray-900"}`}
                        >
                          {template.name}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {template.description}
                        </div>
                      </div>
                      {currentTemplate === template.id && (
                        <div className='ml-auto w-2 h-2 bg-blue-500 rounded-full'></div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <A4PageWrapper>
        {(() => {
          switch (currentTemplate) {
            case "template1":
              return (
                <ClassicTemplate
                  resumeData={resumeData}
                  sectionOrder={sectionOrder}
                  enabledSections={enabledSections}
                  handleDragEnd={handleDragEnd}
                  sensors={sensors}
                  icons={icons}
                  setResumeData={setResumeData}
                />
              );
            case "template2":
              return (
                <TemplateTwo
                  namedata={resumeData.name}
                  positionData={resumeData.position}
                  contactData={resumeData.contactInformation}
                  emailData={resumeData.email}
                  addressData={resumeData.address}
                  telIcon={<MdPhone />}
                  emailIcon={<MdEmail />}
                  addressIcon={<MdLocationOn />}
                  summaryData={resumeData.summary}
                  educationData={resumeData.education}
                  projectsData={resumeData.projects}
                  workExperienceData={resumeData.workExperience}
                  skillsData={resumeData.skills}
                  languagesData={resumeData.languages}
                  certificationsData={resumeData.certifications}
                  sectionOrder={sectionOrder}
                  enabledSections={enabledSections}
                  onDragEnd={onDragEnd}
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                />
              );
            case "template5":
              return (
                <TemplateFive
                  resumeData={resumeData}
                  sectionOrder={sectionOrder}
                  enabledSections={enabledSections}
                  handleDragEnd={handleDragEnd}
                  sensors={sensors}
                  icons={icons}
                  setResumeData={setResumeData}
                />
              );
            case "template6":
              return (
                <TemplateSix
                  resumeData={resumeData}
                  sectionOrder={sectionOrder}
                  enabledSections={enabledSections}
                  handleDragEnd={handleDragEnd}
                  sensors={sensors}
                  icons={icons}
                  setResumeData={setResumeData}
                />
              );
            // ADDED TEMPLATESEVEN CASE BLOCK
            case "template7":
              return (
                <TemplateSeven
                  resumeData={resumeData}
                  sectionOrder={sectionOrder}
                  enabledSections={enabledSections}
                  handleDragEnd={handleDragEnd}
                  sensors={sensors}
                  icons={icons}
                  setResumeData={setResumeData}
                />
              );
            default:
              return (
                <TemplateFour
                  resumeData={resumeData}
                  sectionOrder={sectionOrder}
                  enabledSections={enabledSections}
                  handleDragEnd={handleDragEnd}
                  sensors={sensors}
                  icons={icons}
                  setResumeData={setResumeData}
                />
              );
          }
        })()}
      </A4PageWrapper>


    </div>
  );
};

// Sortable Section Component for Classic Template - Professional Style
export const SortableSection = ({ id, children }) => {
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
      className={`mb-1.5 cursor-move ${isDragging ? "bg-gray-50 shadow-lg rounded" : ""}`}
    >
      {children}
    </div>
  );
};

// Sortable Item Component for individual items within sections (like Modern Template)
export const SortableItem = ({ id, children }) => {
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
      className={`mb-1
          cursor-move ${isDragging ? "bg-gray-50 shadow-lg rounded p-2" : ""}`}
    >
      {children}
    </div>
  );
};

// Classic Template Component - Professional and Clean
const ClassicTemplate = ({
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
  ];

  const orderedSections = sectionOrder
    .map((id) => sections.find((section) => section.id === id))
    .filter((section) => section !== undefined && enabledSections[section.id]);

  const renderSection = (section) => {
    switch (section.id) {
      case "summary":
        return (
          <div>
            <h2 className='section-title border-b-2 border-gray-300 mb-1 text-gray-900'>
              {customSectionTitles.summary || "Professional Summary"}
            </h2>
            <p className="content font-sans  text-black text-justify">{resumeData.summary}</p>
          </div>
        );

      case "education":
        return resumeData.education.length > 0 ? (
          <div>
            <h2 className='section-title border-b-2 border-gray-300 mb-1 text-gray-900'>
              {customSectionTitles.education || "Education"}
            </h2>
            {resumeData.education.map((item, index) => (
              <div key={index} className="mb-1 flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="content font-semibold text-gray-900">{item.school}</h3>
                  <p className="content font-sans  text-black">{item.degree}</p>
                </div>
                <div className='ml-4 text-right'>
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
            <h2 className='section-title border-b-2 border-gray-300 mb-1 text-gray-900'>
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
                    <div className="flex justify-between items-start mb-[0.5]">
                      <div className="flex-1">
                        <h3 className="content i-bold text-gray-900">{item.position} - {item.company}</h3>
                      </div>
                      <div className='text-right'>
                        <DateRange
                          startYear={item.startYear}
                          endYear={item.endYear}
                          id={`work-experience-${index}`}
                        />
                      </div>
                    </div>
                    <p className="content font-sans  text-black mb-1">{item.description}</p>
                    {typeof item.keyAchievements === "string" && item.keyAchievements.trim() && (
                      <ul className="list-disc list-inside content font-sans  text-black ml-4">
                        {item.keyAchievements
                          .split("\n")
                          .filter(achievement => achievement.trim())
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
            <h2 className='section-title border-b-2 border-gray-300 mb-1 text-gray-900'>
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
                    <div className='flex justify-between items-start mb-1'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2'>
                          <h3 className='content i-bold text-gray-900'>
                            {item.name}
                          </h3>
                          {item.link && (
                            <a
                              href={item.link}
                              className='text-blue-600 hover:text-blue-800 transition-colors'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <FaExternalLinkAlt className='w-3 h-3' />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className='text-right'>
                        <DateRange
                          startYear={item.startYear}
                          endYear={item.endYear}
                          id={`projects-${index}`}
                        />
                      </div>
                    </div>
                    <p className="content font-sans  text-black mb-1">{item.description}</p>
                    {typeof item.keyAchievements === "string" && item.keyAchievements.trim() && (
                      <ul className="list-disc list-inside content font-sans  text-black ml-4">
                        {item.keyAchievements
                          .split("\n")
                          .filter(achievement => achievement.trim())
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
            <h2 className='section-title border-b-2 border-gray-300 mb-1 text-gray-900'>
              {customSectionTitles.skills || "Technical Skills"}
            </h2>
            {resumeData.skills
              .filter((skill) => skill.title !== "Soft Skills")
              .map((skill, index) => (
                <div key={`SKILLS-${index}`} className="mb-1">
                  <h3 className="content i-bold text-gray-900 mb-1">{skill.title}</h3>
                  <p className="content font-sans  text-black">{skill.skills.join(", ")}</p>
                </div>
              ))}
          </div>
        );

      case "softSkills":
        return (
          <div>
            <h2 className='section-title border-b-2 border-gray-300 mb-1 text-gray-900'>
              {customSectionTitles.softSkills || "Soft Skills"}
            </h2>
            <p className="content font-sans  text-black">
              {resumeData.skills.find(skill => skill.title === "Soft Skills")?.skills?.join(", ")}
            </p>
          </div>
        );

      case "languages":
        return resumeData.languages.length > 0 ? (
          <div>
            <h2 className='section-title border-b-2 border-gray-300 mb-1 text-gray-900'>
              {customSectionTitles.languages || "Languages"}
            </h2>
            <p className="content font-sans  text-black">{resumeData.languages.join(", ")}</p>
          </div>
        ) : null;

      case "certifications":
        return resumeData.certifications.length > 0 ? (
          <div>
            <h2 className='section-title border-b-2 border-gray-300 mb-1 text-gray-900'>
              {customSectionTitles.certifications || "Certifications"}
            </h2>
            <ul className="list-disc list-inside content font-sans  text-black">
              {resumeData.certifications.map((cert, index) => (
                <li key={index} className='mb-1'>
                  <div className='flex items-center gap-2'>
                    <span>
                      {typeof cert === 'string' ? cert : cert.name}
                      {typeof cert === 'object' && cert.issuer && (
                        <span className="font-sans  text-black"> - {cert.issuer}</span>
                      )}
                    </span>
                    {typeof cert === "object" &&
                      cert.link &&
                      cert.link.trim() !== "" && (
                        <a
                          href={cert.link}
                          className='text-blue-600 hover:text-blue-800 transition-colors'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <FaExternalLinkAlt className='w-3 h-3' />
                        </a>
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
        <div className="text-center mb-1
        
        
        
        ">
          <h1 className="text-2xl font-bold text-gray-900">{resumeData.name}</h1>
          <p className="text-lg text-gray-700">{resumeData.position}</p>
        </div>
        <div className='animate-pulse'>
          <div className='space-y-4'>
            {orderedSections.map((section) => (
              <div key={section.id} className='h-16 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-0">
      {/* Professional Header */}
      <div className="text-center mb-0 no-break">
        <h1 className="name">{resumeData.name}</h1>
        <h2 className="profession">{resumeData.position}</h2>
        
        {/* Contact Information */}
        <div className="flex justify-center items-center gap-2 contact mb-0">
          <div className="flex items-center gap-1">
            <MdPhone className="text-gray-500" />
            <a href={`tel:${resumeData.contactInformation}`}>
              {resumeData.contactInformation}
            </a>
          </div>
          <div className='flex items-center gap-1'>
            <MdEmail className='text-gray-500' />
            <a href={`mailto:${resumeData.email}`}>
              {resumeData.email}
            </a>
          </div>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='text-gray-500' />
            <span>{resumeData.address}</span>
          </div>
        </div>

        {/* Social Media */}
        {resumeData.socialMedia.length > 0 && (
          <div className='flex justify-center items-center gap-3 text-sm'>
            {resumeData.socialMedia.map((socialMedia, index) => {
              const icon = icons.find(
                (icon) => icon.name === socialMedia.socialMedia.toLowerCase()
              );
              return (
                <a
                  href={`${
                    socialMedia.socialMedia.toLowerCase() === "website"
                      ? "https://"
                      : socialMedia.socialMedia.toLowerCase() === "linkedin"
                      ? "https://www."
                      : "https://www."
                  }${socialMedia.link}`}
                  key={index}
                  className='inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {icon && icon.icon}
                  <span>{socialMedia.link}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Draggable Sections with Same System as Modern Template */}
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

const A4PageWrapper = ({ children }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        // Get the actual A4 dimensions in pixels (at 96 DPI)
        // A4 = 210mm x 297mm = 793.7px x 1122.5px at 96 DPI
        const a4HeightPx = 1122.5;
        const marginsPx = (10 + 10) * 3.7795; // 10mm top + 10mm bottom converted to px
        const availableHeight = a4HeightPx - marginsPx;

        // Get the actual content height
        const contentHeight = contentRef.current.scrollHeight;

        // Check if content exceeds available space
        const overflow = contentHeight > availableHeight;

        // A4 Height Check (console log removed)

        setIsOverflowing(overflow);
      }
    };

    // Initial check with longer delay to ensure content is rendered
    const timeoutId = setTimeout(checkOverflow, 200);

    // Check on resize
    window.addEventListener("resize", checkOverflow);

    // Enhanced mutation observer
    const observer = new MutationObserver(() => {
      setTimeout(checkOverflow, 100);
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeOldValue: true,
        characterDataOldValue: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOverflow);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full  flex justify-center p-2 md:p-4 lg:p-6 print:p-0">
      <div className={`a4-preview lg:top-10 sm:top-14 top-10 print:shadow-none print:rounded-none print:border-none print:p-0 ${isOverflowing ? 'overflow-content' : ''}`}>
        <div 
          ref={contentRef}
          className='preview-content w-full h-full bg-white text-black relative'
        >
          {children}
          {isOverflowing && (
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-100 to-transparent h-8 pointer-events-none print:hidden'>
              <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2 text-red-600 text-xs font-medium bg-red-100 px-2 py-1 rounded'>
                Content will continue on next page
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
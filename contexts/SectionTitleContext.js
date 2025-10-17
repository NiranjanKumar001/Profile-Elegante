"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const SectionTitleContext = createContext();

export const useSectionTitles = () => {
  const context = useContext(SectionTitleContext);
  if (!context) {
    throw new Error('useSectionTitles must be used within a SectionTitleProvider');
  }
  return context;
};

export const SectionTitleProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  
  const defaultTitles = useMemo(() => ({
    "summary": "Summary",
    "education": "Education", 
    "experience": "Professional Experience",
    "projects": "Projects",
    "skills": "Technical Skills",
    "programming": "Programming Languages",
    "frameworks": "Frameworks & Technologies", 
    "clouddb": "Cloud & Databases",
    "softSkills": "Soft Skills",
    "languages": "Languages",
    "certifications": "Certifications",
    "awards": "Awards & Achievements" // ➡️ NEW: Added awards key
  }), []);

  const [customSectionTitles, setCustomSectionTitles] = useState(defaultTitles);
  const [editingSection, setEditingSection] = useState('');

  useEffect(() => {
    setIsClient(true);
    // Load from localStorage with error handling
    try {
      const savedTitles = localStorage.getItem('customSectionTitles');
      if (savedTitles) {
        const parsedTitles = JSON.parse(savedTitles);
        setCustomSectionTitles({ ...defaultTitles, ...parsedTitles });
      }
    } catch (error) {
      console.warn('Failed to load custom section titles:', error);
      // Fallback to default titles if loading fails
      setCustomSectionTitles(defaultTitles);
    }
  }, [defaultTitles]);

  const updateSectionTitle = (sectionKey, newTitle) => {
    setCustomSectionTitles(prev => {
      const updated = { ...prev, [sectionKey]: newTitle };
      if (isClient) {
        try {
          localStorage.setItem('customSectionTitles', JSON.stringify(updated));
        } catch (error) {
          console.warn('Failed to save custom section titles:', error);
        }
      }
      return updated;
    });
    setEditingSection('');
  };

  const startEditingTitle = (sectionKey) => {
    setEditingSection(sectionKey);
  };

  const cancelEditing = () => {
    setEditingSection('');
  };

  const value = {
    customSectionTitles,
    editingSection,
    updateSectionTitle,
    startEditingTitle,
    cancelEditing,
    defaultTitles
  };

  return (
    <SectionTitleContext.Provider value={value}>
      {children}
    </SectionTitleContext.Provider>
  );
};

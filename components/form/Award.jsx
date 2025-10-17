"use client";

import React, { useContext } from "react";
import { ResumeContext } from "../../contexts/ResumeContext"; // Adjust path as needed
import FormButton from "./FormButton"; // Adjust path as needed
import EditableFormTitle from "./EditableFormTitle"; // Adjust path as needed

// A component to display and edit a single Award object
const AwardItem = ({ award, index, handleAwardChange, handleRemoveAward }) => (
  <div className="section-card border p-4 mb-4 rounded-md shadow-sm text-white">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-semibold text-lg">Award #{index + 1}</h4>
    </div>
    
    {/* Award Name Input */}
    <div className="mb-3">
      <label className="input-label text-white">Name of Award/Achievement</label>
      <input
        type="text"
        placeholder="e.g., Dean's List, Top Contributor Award"
        className="w-full other-input bg-[#1f1f1f] text-white border border-[#444] rounded-md px-2 py-1"
        value={award.name || ""}
        onChange={(e) => handleAwardChange(e, index, "name")}
      />
    </div>

    {/* Issuer/Institution and Date Inputs (Side-by-Side) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <div>
        <label className="input-label text-white">Issuer/Institution</label>
        <input
          type="text"
          placeholder="e.g., University Name, Company, Foundation"
          className="w-full other-input bg-[#1f1f1f] text-white border border-[#444] rounded-md px-2 py-1"
          value={award.issuer || ""}
          onChange={(e) => handleAwardChange(e, index, "issuer")}
        />
      </div>
      <div>
        <label className="input-label text-white">Date (YYYY-MM-DD)</label>
        <input
          type="date"
          className="w-full other-input bg-[#1f1f1f] text-white border border-[#444] rounded-md px-2 py-1"
          value={award.date || ""}
          onChange={(e) => handleAwardChange(e, index, "date")}
        />
      </div>
    </div>
    
    {/* Description Textarea */}
    <div className="mb-3">
      <label className="input-label text-white">Description / Key Achievement</label>
      <textarea
        placeholder="Describe the significance of the award in a few lines. Use Shift+Enter for new lines."
        className="w-full other-input h-20 resize-none bg-[#1f1f1f] text-white border border-[#444] rounded-md px-2 py-1"
        value={award.description || ""}
        onChange={(e) => handleAwardChange(e, index, "description")}
      />
    </div>

    {/* Photo/Link Input (for image URL or certificate link) */}
    <div className="mb-0">
      <label className="input-label text-white">Photo Link / Certificate URL</label>
      <input
        type="url"
        placeholder="Link to photo or external certificate (e.g., Google Drive link)"
        className="w-full other-input bg-[#1f1f1f] text-white border border-[#444] rounded-md px-2 py-1"
        value={award.link || ""}
        onChange={(e) => handleAwardChange(e, index, "link")}
      />
      <p className="text-xs text-gray-400 mt-1">
        *For direct image upload, you'd need a separate backend service. This field accepts a URL to your photo.
      </p>
    </div>
  </div>
);

const Award = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  // Safely get the awards array, defaulting to an empty array
  const awards = resumeData.awards || [];

  // Handle changes
  const handleAwardChange = (e, index, field) => {
    const newAwards = [...awards];
    newAwards[index] = {
      ...newAwards[index],
      [field]: e.target.value,
    };
    setResumeData((prevData) => ({
      ...prevData,
      awards: newAwards,
    }));
  };

  // Add new award
  const addAward = () => {
    const newAward = {
      name: "",
      issuer: "",
      date: "",
      description: "",
      link: "",
    };
    setResumeData((prevData) => ({
      ...prevData,
      awards: [...awards, newAward],
    }));
  };

  // Remove last award
  const removeAward = () => {
    setResumeData((prevData) => {
      const newAwards = [...awards];
      newAwards.pop();
      return {
        ...prevData,
        awards: newAwards,
      };
    });
  };

  return (
    <div className="form-section">
      <div className="form-section-title text-white">
        <EditableFormTitle 
          sectionKey="awards"
          defaultTitle="Awards & Achievements"
          className="input-title text-white"
        />
      </div>

      {awards.map((award, index) => (
        <AwardItem
          key={index}
          award={award}
          index={index}
          handleAwardChange={handleAwardChange}
          handleRemoveAward={removeAward}
        />
      ))}

      <FormButton
        size={awards.length}
        add={addAward}
        remove={removeAward}
        sectionName="Award"
      />
    </div>
  );
};

export default Award;
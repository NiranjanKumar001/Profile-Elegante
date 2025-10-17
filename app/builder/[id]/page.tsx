"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import LogoutLoader from "@/components/auth/LogoutLoader";

// Import your existing builder components
import Language from "@/components/form/Language";
import LoadUnload from "@/components/form/LoadUnload";
import Preview from "@/components/preview/Preview";
import DefaultResumeData from "@/components/utility/DefaultResumeData";
import SocialMedia from "@/components/form/SocialMedia";
import WorkExperience from "@/components/form/WorkExperience";
import Skill from "@/components/form/Skill";
import PersonalInformation from "@/components/form/PersonalInformation";
import Summary from "@/components/form/Summary";
import Projects from "@/components/form/Projects";
import Education from "@/components/form/Education";
import Certification from "@/components/form/certification";
// ➡️ NEW: Import the Award component
import Award from "@/components/form/Award"; 
import EditableFormTitle from "../../../components/form/EditableFormTitle";
import { SectionTitleProvider } from "@/contexts/SectionTitleContext";
import { ResumeContext } from "@/contexts/ResumeContext";
import Squares from "@/components/ui/Squares";
import type { ResumeData } from "../../types/resume";
import { FaChevronUp, FaOctopusDeploy } from "react-icons/fa";

// server side rendering false
const Print = dynamic(() => import("@/components/utility/WinPrint"), {
  ssr: false,
});

export default function BuilderPage() {
  // Get user session data
  const { data: session } = useSession();

  // Resume data state with localStorage persistence (hydration-safe)
  const [resumeData, setResumeData] = useState<ResumeData>(
    DefaultResumeData as ResumeData
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration to prevent mismatches
  useEffect(() => {
    const savedData = localStorage.getItem("resumeData");
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (error) {
        console.warn("Failed to parse saved resume data:", error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Logout loading state
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Save to localStorage whenever resumeData changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
    }
  }, [resumeData, isHydrated]);

  // Handle logout with loading state
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      // Handle any errors
    } finally {
      // The page will redirect, so we don't need to set loading to false
    }
  };

  // Form hide/show
  const [formClose, setFormClose] = useState(false);

  // Profile picture handler
  const handleProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeData({
          ...resumeData,
          profilePicture: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Invalid file type
    }
  };

  // Change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  // Keyboard shortcut for sidebar toggle (Ctrl+B or Cmd+B)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+B (Windows/Linux) or Cmd+B (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        // Keyboard shortcut triggered
        setFormClose((prev) => !prev);
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // No dependencies needed since we use functional setState
  const divRef = useRef(null);
  const scrollToTop = () => {
    if (divRef.current) {
      //@ts-ignore
      divRef.current.scrollTo({
        top: 0,
        behavior: "smooth", // smooth scrolling
      });
    }
  };

  // Render the main builder interface (unprotected)
  return (
    <>
      <SectionTitleProvider>
        <ResumeContext.Provider
          value={{
            resumeData,
            setResumeData,
            handleProfilePicture,
            handleChange,
          }}
        >
          <div className='flex flex-col lg:flex-row min-h-screen max-w-full overflow-hidden'>
            {!formClose && (
              <div
                className='w-full lg:w-[45%] xl:w-[40%] h-screen lg:h-screen md:h-auto exclude-print relative'
                style={{ backgroundColor: "hsl(240 10% 3.9%)" }}
              >
                {/* Fixed Animated Background Grid */}
                <div className='fixed inset-0 w-full lg:w-[45%] xl:w-[40%] h-screen z-0 hidden lg:block'>
                  <Squares
                    speed={0.3}
                    squareSize={30}
                    direction='diagonal'
                    borderColor='rgba(236, 72, 153, 0.15)'
                    hoverFillColor='rgba(236, 72, 153, 0.1)'
                  />
                </div>
                <div
                  ref={divRef}
                  className='h-full border-r relative z-10 overflow-y-auto'
                  style={{ borderColor: "hsl(240 3.7% 15.9%)" }}
                >
                  <div className='p-4 sm:p-6 lg:p-5 relative z-20 backdrop-blur-[1.5px]'>
                    {/* Header */}

                    <div className='bg-black/85 border border-pink-400/80 hover:border-pink-400  h-12 relative md:p-0 overflow-hidden flex flex-col gap-1 justify-center items-center mb-6 w-full rounded-full'>
                      <div className=' flex gap-0.5 items-center'>
                        <h1 className='text-2xl md:text-3-xl text-gray-200 font-bold tracking-wide'>
                          Profocto
                        </h1>
                        <FaOctopusDeploy className='text-pink-500 size-6 ' />
                      </div>
                      <FaOctopusDeploy className='text-pink-300 size-6 absolute left-5 bottom-2 opacity-20 -rotate-12' />
                      <FaOctopusDeploy className='text-pink-300 size-6 absolute right-5 bottom-2 opacity-20 rotate-12' />

                      <FaOctopusDeploy className='text-pink-300 size-6 absolute left-16 -top-1 opacity-20 rotate-180' />
                      <FaOctopusDeploy className='text-pink-300 size-6 absolute right-16 -top-1 opacity-20 rotate-180' />
                    </div>

                    {/* Form Sections */}
                    <div className='space-y-4 lg:space-y-6'>
                      <LoadUnload />
                      <PersonalInformation />
                      <SocialMedia />
                      <Summary />
                      <Education />
                      <WorkExperience />
                      <Projects />

                      {/* Technical Skills Section */}
                      <div className='form-section'>
                        <EditableFormTitle
                          sectionKey='skills'
                          defaultTitle='Technical Skills'
                          className='input-title'
                        />
                        <div className='space-y-4'>
                          {resumeData.skills
                            .filter(
                              (skill: { title: string; skills: string[] }) =>
                                skill.title !== "Soft Skills"
                            )
                            .map(
                              (
                                skill: { title: string; skills: string[] },
                                index: number
                              ) => (
                                <Skill title={skill.title} key={index} />
                              )
                            )}
                        </div>
                      </div>

                      {/* Soft Skills Section */}
                      {resumeData.skills
                        .filter(
                          (skill: { title: string; skills: string[] }) =>
                            skill.title === "Soft Skills"
                        )
                        .map(
                          (
                            skill: { title: string; skills: string[] },
                            index: number
                          ) => (
                            <Skill title={skill.title} key={index} />
                          )
                        )}

                      <Language />
                      <Certification />
                      {/* ➡️ NEW: Render the Awards component here */}
                      <Award /> 
                    </div>

                    {/* Floating Profile Pocket - stick only on large screens to avoid overlap */}
                    <div className='relative lg:sticky bottom-0 left-0 right-0 p-4 z-10 mt-6'>
                      <div
                        className='relative p-4 rounded-xl border backdrop-blur-sm'
                        style={{
                          backgroundColor: "hsla(240, 10%, 3.9%, 0.95)",
                          borderColor: "hsl(240 3.7% 25%)",
                          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        {/* Enhanced decorative elements for floating pocket effect */}
                        <div
                          className='absolute -top-1 left-4 right-4 h-2 rounded-b-lg opacity-60'
                          style={{ backgroundColor: "hsl(240 3.7% 20%)" }}
                        ></div>
                        <div
                          className='absolute -top-0.5 left-6 right-6 h-1 rounded-b-lg opacity-40'
                          style={{ backgroundColor: "hsl(240 3.7% 25%)" }}
                        ></div>
                        <div className='absolute inset-0 rounded-xl border border-pink-500/20 animate-pulse'></div>

                        <div className='flex items-center space-x-3'>
                          {/* Profile Image */}
                          <div className='relative'>
                            <div
                              className='w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg ring-2 ring-pink-500/30 overflow-hidden'
                              style={{
                                background:
                                  "linear-gradient(135deg, hsl(322, 84%, 60%) 0%, hsl(270, 84%, 60%) 100%)",
                              }}
                            >
                              {session?.user?.image ? (
                                <Image
                                  src={session.user.image}
                                  alt={session.user.name || "User"}
                                  width={50}
                                  height={40}
                                  className='w-full h-full rounded-full object-cover'
                                  onError={(e) => {
                                    // Hide the image on error and show initials instead
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className='w-full h-full flex items-center justify-center text-white text-xl font-bold'>
                                  {session?.user?.name
                                    ?.charAt(0)
                                    .toUpperCase() || "U"}
                                </div>
                              )}
                            </div>
                            <div
                              className='absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 animate-pulse'
                              style={{ borderColor: "hsl(240 10% 3.9%)" }}
                            ></div>
                          </div>

                          {/* Name and Info */}
                          <div className='flex-1 min-w-0'>
                            <p
                              className='text-sm font-medium truncate'
                              style={{ color: "hsl(0 0% 98%)" }}
                            >
                              {session?.user?.name || "User"}
                            </p>
                            <p
                              className='text-xs truncate'
                              style={{ color: "hsl(240 5% 64.9%)" }}
                            >
                              {/* Show Google email */}
                              {session?.user?.email || "Resume Builder"}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className='flex items-center space-x-2 relative z-50'>
                            {/* Logout Button */}
                            <button
                              onClick={handleSignOut}
                              disabled={isLoggingOut}
                              className='p-2 rounded-lg transition-all duration-200 hover:scale-105 group cursor-pointer relative z-50 disabled:opacity-50 disabled:cursor-not-allowed'
                              style={{
                                backgroundColor: "hsl(240 3.7% 20%)",
                                border: "1px solid rgba(236, 72, 153, 0.2)",
                                pointerEvents: "auto",
                              }}
                              title={isLoggingOut ? "Signing out..." : "Logout"}
                              type='button'
                            >
                              <svg
                                className='w-4 h-4 transition-colors group-hover:text-pink-400 pointer-events-none'
                                style={{ color: "hsl(240 5% 64.9%)" }}
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                                />
                              </svg>
                            </button>
                            <button
                              className='absolute   border-pink-500/40 border-[1.7px]  bg-black rounded-full z-[9999] text-white -translate-y-16 bottom-0 mt-3 p-2 right-0 text-xs '
                              onClick={scrollToTop}
                            >
                              {" "}
                              <FaChevronUp />
                            </button>
                            {/* Sidebar Close Button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setFormClose(true);
                              }}
                              className='p-2 rounded-lg transition-all duration-200 hover:scale-105 group cursor-pointer relative z-50'
                              style={{
                                backgroundColor: "hsl(240 3.7% 20%)",
                                border: "1px solid rgba(236, 72, 153, 0.2)",
                                pointerEvents: "auto",
                              }}
                              title='Hide Sidebar'
                              type='button'
                            >
                              <svg
                                className='w-4 h-4 transition-colors group-hover:text-pink-400 pointer-events-none'
                                style={{ color: "hsl(240 5% 64.9%)" }}
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Show Sidebar Button - appears when sidebar is closed */}
            {formClose && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Show sidebar button clicked
                  setFormClose(false);
                }}
                className='fixed top-4 left-4 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white cursor-pointer shadow-lg transition-all duration-200 hover:scale-105'
                title='Show Sidebar'
                style={{ zIndex: 9999, pointerEvents: "auto" }}
                type='button'
              >
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-white pointer-events-none'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 17l5-5-5-5M6 17l5-5-5-5'
                  />
                </svg>
              </button>
            )}

            <div
              className={`${
                formClose ? "w-full" : "w-full lg:w-[55%] xl:w-[60%]"
              } transition-all duration-300 min-h-screen lg:min-h-0`}
            >
              <Preview />
            </div>
          </div>
          <Print />
        </ResumeContext.Provider>
      </SectionTitleProvider>

      {/* Logout Loading */}
      <LogoutLoader isVisible={isLoggingOut} />
    </>
  );
}

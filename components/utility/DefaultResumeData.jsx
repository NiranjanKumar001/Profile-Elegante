const DefaultResumeData = {
  name: "JOHN DOE",
  position: "Software Engineer",
  contactInformation: "+1 555-123-4567",
  email: "john.doe@email.com",
  address: "San Francisco, CA",
  profilePicture: "",
  socialMedia: [
    {
      socialMedia: "LinkedIn",
      link: "linkedin.com/in/johndoe",
    },
    {
      socialMedia: "Website",
      link: "johndoe.dev",
    },
  ],
  summary: "Experienced Software Engineer with 5+ years of experience in developing scalable web applications and mobile solutions. Proficient in modern JavaScript frameworks, cloud technologies, and agile development practices. Passionate about creating efficient, user-friendly applications and mentoring junior developers.",
  education: [
    {
      "school": "Stanford University",
      "degree": "Bachelor of Science in Computer Science",
      "startYear": "2016-09-01",
      "endYear": "2020-06-01"
    },
  ],
  workExperience: [
    {
      "company": "Google",
      "position": "Senior Software Engineer",
      "description": "Led development of large-scale distributed systems serving millions of users. Collaborated with cross-functional teams to design and implement new features for Google Cloud Platform.",
      "keyAchievements": "Improved system performance by 35% through code optimization\nLed a team of 4 engineers to deliver critical features on time",
      "startYear": "2022-03-01",
      "endYear": "2024-12-01"
    },
    {
      "company": "Microsoft",
      "position": "Software Engineer",
      "description": "Developed and maintained Azure services and tools. Worked on improving developer experience and implementing new cloud functionalities for enterprise customers.",
      "keyAchievements": "Reduced deployment time by 50% through automation\nImplemented monitoring solutions that decreased system downtime by 25%",
      "startYear": "2020-07-01",
      "endYear": "2022-02-01"
    }
  ],
  projects: [
    
    {
      "name": "Task Management App",
      "description": "Built a comprehensive task management application using React, Node.js, and MongoDB. Features include real-time collaboration, file attachments, and advanced filtering capabilities.",
      "keyAchievements": "Implemented real-time collaboration using WebSockets\nAchieved 99.9% uptime with efficient caching strategies",
      "startYear": "2023-08-01",
      "endYear": "2024-01-15",
      "link": "https://johndoe.dev/task-manager"
    },
    {
      "name": "E-Commerce Platform",
      "description": "Developed a full-stack e-commerce solution with payment integration, inventory management, and admin dashboard. Used Next.js, Stripe API, and PostgreSQL for robust performance.",
      "keyAchievements": "Processed $100K+ in transactions with zero payment failures\nImplemented advanced search and filtering with 300ms response time",
      "startYear": "2023-02-01",
      "endYear": "2023-07-30",
      "link": "https://johndoe.dev/ecommerce-platform"
    }
  ],
  skills: [
    {
      title: "Programming Languages",
      skills: [
        "JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "SQL"
      ]
    },
    {
      title: "Frameworks & Technologies",
      skills: [
        "React", "Next.js", "Node.js", "Express", "Django", "Spring Boot", 
        "GraphQL", "REST APIs", "Docker", "Kubernetes"
      ]
    },
    {
      title: "Cloud & Databases",
      skills: [
        "AWS", "Google Cloud", "Azure", "PostgreSQL", "MongoDB", "Redis", 
        "MySQL", "DynamoDB"
      ]
    },
    {
      title: "Soft Skills",
      skills: [
        "Leadership", "Team Collaboration", "Problem Solving", "Communication", 
        "Project Management", "Mentoring"
      ]
    }
  ],
  languages: [
    "English",
    "Spanish",
    "French"
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      link: "https://www.credly.com/badges/aws-certified-solutions-architect"
    },
    {
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      link: "https://www.credential.net/google-cloud-professional-developer"
    },
    {
      name: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      link: ""
    },
    {
      name: "Microsoft Azure Developer Associate",
      issuer: "Microsoft",
      link: ""
    }
  ],
  // 🎯 CHANGE 1: Added the 'awards' array.
  awards: [
    {
      name: "Dean's List (2018)",
      issuer: "Stanford University",
      link: "",
      // 🎯 CHANGE 2: Renamed the date field from 'date' to 'year' 
      // to match your component logic in Award.js.
      year: "2018-06-01" 
    },
    {
      name: "Regional Programming Contest Winner",
      issuer: "ACM Chapter",
      link: "https://example.com/award-link",
      // 🎯 CHANGE 2: Renamed the date field from 'date' to 'year'.
      year: "2019-11-15"
    }
  ],
};

export default DefaultResumeData;

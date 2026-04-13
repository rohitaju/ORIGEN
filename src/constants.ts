import { 
  User, 
  Program, 
  Project, 
  Task, 
  Lead, 
  Application, 
  Course, 
  JobListing, 
  StudentProfile, 
  ClientProfile,
  Interview,
  Assessment
} from "./types";

export const DUMMY_USERS: User[] = [
  { id: "1", name: "Admin User", email: "admin@origen.com", role: "admin", status: "active" },
  { id: "2", name: "Student One", email: "student1@test.com", role: "student", status: "active" },
  { id: "3", name: "Client One", email: "client1@test.com", role: "client", status: "active" },
  { id: "4", name: "Student Two", email: "student2@test.com", role: "student", status: "active" },
];

export const DUMMY_STUDENT_PROFILES: StudentProfile[] = [
  {
    userId: "2",
    resumeUrl: "https://example.com/resume1.pdf",
    skills: ["React", "TypeScript", "Node.js"],
    education: "B.S. Computer Science",
    completionPercentage: 75,
    bio: "Passionate developer looking for real-world experience.",
  },
  {
    userId: "4",
    resumeUrl: "https://example.com/resume2.pdf",
    skills: ["UI/UX", "Figma", "Tailwind CSS"],
    education: "B.A. Graphic Design",
    completionPercentage: 40,
    bio: "Creative designer with a focus on user-centric products.",
  }
];

export const DUMMY_CLIENT_PROFILES: ClientProfile[] = [
  {
    userId: "3",
    companyName: "Tech Solutions Inc.",
    contactPerson: "Jane Smith",
    phone: "+1 234 567 890",
    requirements: "Looking for a modern e-commerce platform.",
  }
];

export const DUMMY_PROGRAMS: Program[] = [
  {
    id: "p1",
    title: "Web Development Internship",
    description: "Learn modern web development with React and Node.js.",
    duration: "3 Months",
    status: "open",
    image: "https://picsum.photos/seed/webdev/800/600",
  },
  {
    id: "p2",
    title: "UI/UX Design Program",
    description: "Master user interface and experience design principles.",
    duration: "2 Months",
    status: "open",
    image: "https://picsum.photos/seed/design/800/600",
  },
  {
    id: "p3",
    title: "Digital Marketing Boot Camp",
    description: "Deep dive into SEO, SEM, and social media strategies.",
    duration: "6 Weeks",
    status: "closed",
    image: "https://picsum.photos/seed/marketing/800/600",
  },
];

export const DUMMY_COURSES: Course[] = [
  {
    id: "c1",
    title: "Fullstack Web Development",
    description: "From zero to hero in modern web technologies.",
    thumbnail: "https://picsum.photos/seed/fullstack/800/600",
    enrolledStudents: ["2"],
    modules: [
      { id: "m1", title: "Introduction to HTML/CSS", content: "Basics of web structure.", tasks: ["t3"] },
      { id: "m2", title: "JavaScript Fundamentals", content: "Core programming concepts.", tasks: ["t4"] },
    ]
  }
];

export const DUMMY_PROJECTS: Project[] = [
  {
    id: "proj1",
    title: "E-commerce Platform",
    clientId: "3",
    description: "Building a custom e-commerce solution for a local boutique.",
    status: "in-progress",
    progress: 60,
    startDate: "2024-03-01",
    deadline: "2024-06-30",
    assignedStudents: ["2"],
  },
  {
    id: "proj2",
    title: "Brand Identity Redesign",
    clientId: "3",
    description: "Refreshing the visual identity of a tech startup.",
    status: "pending",
    progress: 0,
    startDate: "2024-05-01",
    deadline: "2024-07-15",
    assignedStudents: [],
  },
];

export const DUMMY_TASKS: Task[] = [
  {
    id: "t1",
    projectId: "proj1",
    title: "Setup Database Schema",
    description: "Design and implement the initial MongoDB schema.",
    status: "done",
    assignedTo: "2",
  },
  {
    id: "t2",
    projectId: "proj1",
    title: "Implement Auth Flow",
    description: "Create login and signup pages with JWT.",
    status: "in-progress",
    assignedTo: "2",
  },
  {
    id: "t3",
    courseId: "c1",
    title: "Build a Landing Page",
    description: "Create a responsive landing page using HTML and CSS.",
    status: "done",
    assignedTo: "2",
  },
  {
    id: "t4",
    courseId: "c1",
    title: "JS Calculator",
    description: "Build a functional calculator using vanilla JavaScript.",
    status: "todo",
    assignedTo: "2",
  }
];

export const DUMMY_LEADS: Lead[] = [
  {
    id: "l1",
    name: "John Doe",
    email: "john@example.com",
    company: "Doe's Diner",
    service: "Web Development",
    message: "I need a website for my new restaurant.",
    status: "new",
    createdAt: "2024-04-10",
  },
];

export const DUMMY_JOBS: JobListing[] = [
  {
    id: "j1",
    title: "Junior Frontend Developer",
    company: "Origen Tech",
    skills: ["React", "Tailwind CSS"],
    deadline: "2024-05-20",
    description: "Join our team to build amazing web products.",
    salary: "$3000 - $4000",
  }
];

export const DUMMY_APPLICATIONS: Application[] = [
  {
    id: "a1",
    programId: "p1",
    studentId: "2",
    status: "approved",
    appliedAt: "2024-04-01",
  },
  {
    id: "a2",
    jobId: "j1",
    studentId: "2",
    status: "pending",
    appliedAt: "2024-04-15",
  }
];

export const DUMMY_INTERVIEWS: Interview[] = [
  {
    id: "i1",
    candidateId: "2",
    jobId: "j1",
    scheduledAt: "2024-04-25T10:00:00Z",
    status: "scheduled",
  }
];

export const DUMMY_ASSESSMENTS: Assessment[] = [
  {
    id: "as1",
    title: "React Basics",
    type: "mcq",
    questions: [
      { q: "What is JSX?", options: ["A", "B", "C"], correct: 0 }
    ]
  }
];

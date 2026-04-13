export type UserRole = "student" | "client" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status?: "active" | "inactive";
}

export interface StudentProfile {
  userId: string;
  resumeUrl?: string;
  skills: string[];
  education: string;
  completionPercentage: number;
  bio?: string;
  phone?: string;
}

export interface ClientProfile {
  userId: string;
  companyName: string;
  contactPerson: string;
  phone?: string;
  requirements?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: "open" | "closed";
  image?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  modules: Module[];
  enrolledStudents: string[]; // User IDs
}

export interface Module {
  id: string;
  title: string;
  content: string;
  tasks: string[]; // Task IDs
}

export interface Application {
  id: string;
  jobId?: string;
  programId?: string;
  studentId: string;
  status: "pending" | "approved" | "rejected" | "selected";
  appliedAt: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  skills: string[];
  deadline: string;
  description: string;
  salary?: string;
}

export interface Project {
  id: string;
  title: string;
  clientId: string;
  description: string;
  status: "pending" | "in-progress" | "on-hold" | "completed";
  progress: number;
  startDate: string;
  deadline: string;
  assignedStudents: string[];
}

export interface Task {
  id: string;
  projectId?: string;
  courseId?: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assignedTo: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
  status: "new" | "contacted" | "converted";
  createdAt: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  scheduledAt: string;
  status: "scheduled" | "completed" | "cancelled";
  feedback?: string;
}

export interface Assessment {
  id: string;
  title: string;
  type: "mcq" | "coding";
  questions: any[];
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  studentId: string;
  score: number;
  completedAt: string;
}

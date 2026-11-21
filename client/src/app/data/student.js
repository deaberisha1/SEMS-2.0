import { api } from "../../api";

// Student data — downloaded from the Node.js server after login.
// Pages import these objects directly; loadStudentData() fills them in place.
export const profile = {};
export const upcomingExams = [];
export const recentGrades = [];
export const notifications = [];
export const transcript = [];
export const schedule = [];
export const paymentHistory = [];
export const courses = [];
export const examCourses = [];
export const consultationProfessors = [];
export const bookedSlots = {};
export const attendanceSemesters = [];
export const attendanceCourses = [];
export const attendanceSummary = [];
export const attendanceLogs = {};
export const consultations = [];

export async function loadStudentData() {
  const data = await api.get("/student/data");
  fill(profile, data.profile);
  fill(upcomingExams, data.upcomingExams);
  fill(recentGrades, data.recentGrades);
  fill(notifications, data.notifications);
  fill(transcript, data.transcript);
  fill(schedule, data.schedule);
  fill(paymentHistory, data.paymentHistory);
  fill(courses, data.courses);
  fill(examCourses, data.examCourses);
  fill(consultationProfessors, data.consultationProfessors);
  fill(bookedSlots, data.bookedSlots);
  fill(attendanceSemesters, data.attendanceSemesters);
  fill(attendanceCourses, data.attendanceCourses);
  fill(attendanceSummary, data.attendanceSummary);
  fill(attendanceLogs, data.attendanceLogs);
  fill(consultations, data.consultations);
}

function fill(target, value) {
  if (Array.isArray(target)) target.splice(0, target.length, ...(Array.isArray(value) ? value : []));
  else {
    for (const key of Object.keys(target)) delete target[key];
    Object.assign(target, value);
  }
}

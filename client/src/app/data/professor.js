import { api } from "../../api";

// Professor data — downloaded from the Node.js server after login.
// Pages import these objects directly; loadProfessorData() fills them in place.
export const PROFESSOR = {};
export const PROF_COURSES = [];
export const STUDENTS_BY_COURSE = {};
export const PROF_REQUESTS = [];
export const PROF_SCHEDULE = [];

export async function loadProfessorData() {
  const data = await api.get("/professor/data");
  fill(PROFESSOR, data.profile);
  fill(PROF_COURSES, data.courses);
  fill(STUDENTS_BY_COURSE, data.studentsByCourse);
  fill(PROF_REQUESTS, data.requests);
  fill(PROF_SCHEDULE, data.schedule);
}

function fill(target, value) {
  if (Array.isArray(target)) target.splice(0, target.length, ...(Array.isArray(value) ? value : []));
  else {
    for (const key of Object.keys(target)) delete target[key];
    Object.assign(target, value);
  }
}

export function getTodayClasses() {
  const today = new Date().getDay(); // 0=Sun..6=Sat
  const mapped = today === 0 || today === 6 ? 0 : today - 1;
  return PROF_SCHEDULE.filter((c) => c.day === mapped).slice(0, 2);
}

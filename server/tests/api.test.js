import { test, before } from "node:test";
import assert from "node:assert/strict";

const BASE = (process.env.BASE_URL || "http://localhost:4000").replace(/\/$/, "") + "/api";
const STUDENT = { id: process.env.STUDENT_ID || "111", password: process.env.STUDENT_PASSWORD || "student123" };
const PROFESSOR = { id: process.env.PROFESSOR_ID || "000", password: process.env.PROFESSOR_PASSWORD || "profesor123" };

async function call(method, path, { body, token } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

let studentToken;
let professorToken;

before(async () => {
  const s = await call("POST", "/auth/login", { body: STUDENT });
  const p = await call("POST", "/auth/login", { body: PROFESSOR });
  assert.equal(s.status, 200, "student login failed: " + JSON.stringify(s.data));
  assert.equal(p.status, 200, "professor login failed: " + JSON.stringify(p.data));
  studentToken = s.data.token;
  professorToken = p.data.token;
});

test("health check reports the database as connected", async () => {
  const r = await call("GET", "/health");
  assert.equal(r.status, 200);
  assert.equal(r.data.db, "connected");
});

test("wrong password returns 401", async () => {
  const r = await call("POST", "/auth/login", { body: { id: STUDENT.id, password: "wrong-password" } });
  assert.equal(r.status, 401);
});

test("missing token returns 401", async () => {
  const r = await call("GET", "/student/data");
  assert.equal(r.status, 401);
});

test("student cannot open professor routes (403)", async () => {
  const r = await call("GET", "/professor/data", { token: studentToken });
  assert.equal(r.status, 403);
});

test("malformed JSON returns 400, not 500", async () => {
  const r = await call("POST", "/student/requests", { body: "{bad json", token: studentToken });
  assert.equal(r.status, 400);
});

test("student data contains every section the pages use", async () => {
  const r = await call("GET", "/student/data", { token: studentToken });
  assert.equal(r.status, 200);
  for (const key of ["upcomingExams", "recentGrades", "paymentHistory", "examCourses", "consultationProfessors", "attendanceSemesters", "attendanceCourses", "attendanceSummary"]) {
    assert.ok(Array.isArray(r.data[key]) && r.data[key].length > 0, `${key} is empty`);
  }
  for (const key of ["bookedSlots", "attendanceLogs"]) {
    assert.ok(Object.keys(r.data[key] || {}).length > 0, `${key} is empty`);
  }
});

test("a student request reaches the professor, and the decision reaches the student", async () => {
  const sent = await call("POST", "/student/requests", {
    token: studentToken,
    body: { type: "Rivlerësim", details: { lenda: "UX/UI Design", arsyeja: "Test automatik", detaje: "D12" } },
  });
  assert.equal(sent.status, 201);
  assert.equal(sent.data.assignedTo, PROFESSOR.id);

  const inbox = await call("GET", "/professor/requests", { token: professorToken });
  assert.equal(inbox.status, 200);
  const found = inbox.data.find((r) => r.id === sent.data.id);
  assert.ok(found, "professor does not see the new request");
  assert.equal(found.course, "UX/UI Design");

  const decided = await call("PATCH", `/professor/requests/${sent.data.id}`, {
    token: professorToken,
    body: { status: "Aprovuar", note: "OK" },
  });
  assert.equal(decided.status, 200);

  const mine = await call("GET", "/student/requests", { token: studentToken });
  assert.equal(mine.data.find((r) => r.id === sent.data.id)?.status, "Aprovuar");
});

test("invalid request type and invalid IBAN return 400 with a field", async () => {
  const badType = await call("POST", "/student/requests", { token: studentToken, body: { type: "Hack", details: {} } });
  assert.equal(badType.status, 400);
  assert.equal(badType.data.field, "type");

  const badIban = await call("POST", "/student/requests", {
    token: studentToken,
    body: { type: "Bursë", details: { banka: "BKT", iban: "123", arsyeja: "Arsye e mjaftueshme", dokumentet: ["a.pdf"] } },
  });
  assert.equal(badIban.status, 400);
  assert.equal(badIban.data.field, "iban");
});

test("every certificate type the page offers can be generated", async () => {
  for (const lloji of ["Vërtetim i statusit studentor", "Vërtetim për notat e kaluara", "Vërtetim për bursë", "Vërtetim për vizë", "Vërtetim për konvikt"]) {
    const r = await call("POST", "/student/certificates", { token: studentToken, body: { lloji, gjuha: "Shqip", arsyeja: "Test" } });
    assert.equal(r.status, 201, `${lloji}: ${JSON.stringify(r.data)}`);
  }
});

test("profile update rejects an invalid email", async () => {
  const r = await call("PATCH", "/student/profile", { token: studentToken, body: { emailPersonal: "not-an-email" } });
  assert.equal(r.status, 400);
  assert.equal(r.data.field, "emailPersonal");
});

test("assessment value 26 in Kolokfiumi 1 returns 400; a valid value is saved", async () => {
  const bad = await call("POST", "/professor/assessments", {
    token: professorToken,
    body: { courseId: "rrjeta", rows: [{ studentId: "240204100009", kuiz: 5, p1: 5, p2: 5, k1: 26, k2: 5 }] },
  });
  assert.equal(bad.status, 400);
  assert.equal(bad.data.field, "k1");

  const good = await call("POST", "/professor/assessments", {
    token: professorToken,
    body: { courseId: "rrjeta", rows: [{ studentId: "240204100009", kuiz: 7, p1: 15, p2: 16, k1: 20, k2: 21 }] },
  });
  assert.equal(good.status, 200);

  const saved = await call("GET", "/professor/assessments?courseId=rrjeta", { token: professorToken });
  assert.equal(saved.data.find((a) => a.studentId === "240204100009")?.k1, 20);
});

test("published grades are computed by the server and can be read back", async () => {
  const r = await call("POST", "/professor/grades", {
    token: professorToken,
    body: { courseId: "rrjeta", grades: [{ studentId: "240204100009", exam: 85, final: 10 }] },
  });
  assert.equal(r.status, 200);
  const saved = await call("GET", "/professor/grades?courseId=rrjeta", { token: professorToken });
  assert.equal(saved.data.find((g) => g.studentId === "240204100009")?.final, 9);
});

test("change-password rejects a short password and a wrong current password with 400", async () => {
  const short = await call("POST", "/auth/change-password", { token: studentToken, body: { currentPassword: STUDENT.password, newPassword: "abc" } });
  assert.equal(short.status, 400);
  const wrong = await call("POST", "/auth/change-password", { token: studentToken, body: { currentPassword: "wrong-password", newPassword: "newpass123" } });
  assert.equal(wrong.status, 400);
  assert.equal(wrong.data.field, "currentPassword");
});

test("6 failed logins with a fake ID return 429, the demo account still works", async () => {
  let last;
  for (let i = 0; i < 6; i++) {
    last = await call("POST", "/auth/login", { body: { id: "999", password: "wrong-password" } });
  }
  assert.equal(last.status, 429);
  const ok = await call("POST", "/auth/login", { body: STUDENT });
  assert.equal(ok.status, 200);
});

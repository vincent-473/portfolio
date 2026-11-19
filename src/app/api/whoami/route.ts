import { certifications, education, jobs, profile, skillGroups } from "@/lib/data";

// A backend engineer's portfolio should be curl-able.
//   curl https://<your-domain>/api/whoami
export function GET() {
  return Response.json({
    name: profile.name,
    role: profile.role,
    location: profile.location,
    email: profile.email,
    summary: profile.summary,
    experience: jobs.map((j) => ({
      company: j.company,
      role: j.role,
      start: j.start,
      end: j.end ?? "present",
      stack: j.stack,
    })),
    skills: Object.fromEntries(skillGroups.map((g) => [g.id, g.items])),
    certifications: certifications.map((c) => `${c.name} (${c.issuer})`),
    education,
  });
}

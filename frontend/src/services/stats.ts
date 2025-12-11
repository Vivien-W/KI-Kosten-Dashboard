export async function fetchDashboardData() {
  const res = await fetch("http://localhost:4000/api/prompts/dashboard");

  if (!res.ok) {
    console.error("Dashboard API Fehler", res.status);
    throw new Error("Dashboard konnte nicht geladen werden.");
  }

  return res.json();
}

export type DashboardApiResponse = Awaited<
  ReturnType<typeof fetchDashboardData>
>;

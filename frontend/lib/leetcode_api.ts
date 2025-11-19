export interface LeetCodeStats {
  status: string;
  message: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
}

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  const baseUrl = "https://leetcode-stats-api.herokuapp.com";
  const url = `${baseUrl}/${username}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch LeetCode stats`);
  }

  const data = await resp.json();
  if (data.status === "error") {
     throw new Error("User not found or API error");
  }

  return data as LeetCodeStats;
}
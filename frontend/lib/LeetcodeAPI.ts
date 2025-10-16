export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export async function fetchLeetCodeStats(
  username: string
): Promise<LeetCodeStats> {
  const baseUrl = "https://leetcode-stats-api.herokuapp.com";
  const url = `${baseUrl}/${encodeURIComponent(username)}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    const msg = `Failed to fetch LeetCode stats: ${resp.status} ${resp.statusText}`;
    throw new Error(msg);
  }

  const data = await resp.json();

  return data as LeetCodeStats;
}
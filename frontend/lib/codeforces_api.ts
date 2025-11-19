export interface CodeforcesUser {
  handle: string;
  rating?: number;
  rank?: string;
  maxRating?: number;
  maxRank?: string;
  avatar?: string;
}

export async function fetchCodeforcesStats(username: string): Promise<CodeforcesUser> {
  const url = `https://codeforces.com/api/user.info?handles=${username}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch Codeforces stats`);
  }

  const data = await resp.json();
  
  if (data.status !== "OK" || !data.result || data.result.length === 0) {
     throw new Error("User not found");
  }

  return data.result[0] as CodeforcesUser;
}
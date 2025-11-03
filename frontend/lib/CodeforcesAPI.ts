export interface CodeforcesUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  contribution?: number;
  friendOfCount?: number;
  avatar?: string;
  titlePhoto?: string;
  registrationTimeSeconds?: number;
  lastOnlineTimeSeconds?: number;
  organization?: string;
  country?: string;
  city?: string;
}

export async function GetCodeforcesUserInfo(handles: string[]): Promise<CodeforcesUser[]> {
  const url = `https://codeforces.com/api/user.info?handles=${handles.join(",")}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Codeforces API error: ${data.comment || "Unknown error"}`);
    }

    // Map the result to our defined interface
    const users: CodeforcesUser[] = data.result.map((user: any) => ({
      handle: user.handle,
      rating: user.rating,
      maxRating: user.maxRating,
      rank: user.rank,
      maxRank: user.maxRank,
      contribution: user.contribution,
      friendOfCount: user.friendOfCount,
      avatar: user.avatar,
      titlePhoto: user.titlePhoto,
      registrationTimeSeconds: user.registrationTimeSeconds,
      lastOnlineTimeSeconds: user.lastOnlineTimeSeconds,
      organization: user.organization,
      country: user.country,
      city: user.city,
    }));

    return users;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    throw error;
  }
}

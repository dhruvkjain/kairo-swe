import fetch from "node-fetch";

export interface GitHubUser {
  login: string; 
  id: number;
  avatar_url: string;
  name?: string;
  company?: string;
  blog?: string;
  location?: string;
  email?: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export async function getGitHubUser(username: string): Promise<GitHubUser> {
  const token = process.env.GITHUB_TOKEN; // Store token in .env file

  const headers: Record<string, string> = {
    "Accept": "application/vnd.github+json",
  };

  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as GitHubUser;
  return data;
}
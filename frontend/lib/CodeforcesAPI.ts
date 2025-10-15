export async function GetCodeforcesUserInfo(handles: string[]): Promise<any>  {
    const url = `https://codeforces.com/api/user.info?handles=${handles.join(",")}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;  // this contains the Codeforces API response
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    throw error;
  }
}
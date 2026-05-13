import { useState, useEffect } from "react";

interface UserData {
  id: string;
  name: string;
}

export const useUserData = (apiUrl?: string) => {
  const [user, setUser] = useState<UserData>({
    id: "123",
    name: "Fatin",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiUrl) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUser({
          id: data.id || "123",
          name: data.name || "Fatin",
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch user data";
        setError(errorMessage);
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [apiUrl]);

  return { user, isLoading, error };
};

import { followup_complete } from "@/lib/apis/supervision/service";
import { useCallback, useState } from "react";


export const useExternalForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const completeFollowup = useCallback(
        async (token: string, body: any) => { // Add body parameter
          setLoading(true);
          setError("");
          try {
            const response = await followup_complete(token, body); // Pass body to the API call
            if (!response.ok) {
              setError("Failed to complete follow-up.");
            }
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError("An error occurred while completing follow-up.");
            }
          } finally {
            setLoading(false);
          }
        },
        [setError, setLoading]
      );
    
      return { completeFollowup, loading, error };
    };
import { useState, useEffect } from "react";

export interface FetchStatusResult {
  status?: number;
  ok: boolean;
}

export default function useFetchStatus(url?: string) {
  const [status, setStatus] = useState<FetchStatusResult>({
    ok: false,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      if (!url) {
        setStatus({ ok: false });
        return;
      }

      try {
        const response = await fetch(url, {
          method: "HEAD",
        });

        setStatus({
          status: response.status,
          ok: response.ok,
        });
      } catch (err) {
        void err;

        setStatus({
          ok: false,
        });
      }
    };

    void fetchStatus();
  }, [url]);

  return status;
}

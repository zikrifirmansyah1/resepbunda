import { useEffect, useState } from "react";
import { initDb } from "../services/db/migrations";

export function useDatabase() {
  const [isDbReady, setDbReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        console.log("Initializing database...");
        await initDb();
        setDbReady(true);
        console.log("Database is ready.");
      } catch (e) {
        console.error("Failed to initialize database", e);
      }
    })();
  }, []);

  return isDbReady;
}

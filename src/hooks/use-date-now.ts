import { useEffect, useState } from "react";

export function useDateNow(delay = 60000) {
  const [dateNow, setDateNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateNow(new Date());
    }, delay); // Update every minute
    return () => clearInterval(interval);
  }, [delay]);

  return dateNow;
}

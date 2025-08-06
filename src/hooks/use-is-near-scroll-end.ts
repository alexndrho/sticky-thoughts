"use client";

import { useEffect, useState } from "react";

export function useIsNearScrollEnd(threshold = 500) {
  const [isNearEnd, setIsNearEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - threshold;
      setIsNearEnd(isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return isNearEnd;
}

"use client";
import { useState, useEffect, useRef } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  const mediaQueryRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Create media query only once
      if (!mediaQueryRef.current) {
        mediaQueryRef.current = window.matchMedia(query);
        // Set initial value
        setMatches(mediaQueryRef.current.matches);
      }

      const mediaQuery = mediaQueryRef.current;

      // Stable handler function
      const handleChange = (event) => {
        setMatches(event.matches);
      };

      // Add listener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }

      // Cleanup function
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handleChange);
        } else {
          mediaQuery.removeListener(handleChange);
        }
      };
    } catch (error) {
      console.warn("useMediaQuery error:", error);
      setMatches(false);
    }
  }, [query]); // Only depend on query

  return matches;
}

// utils/hooks.ts
import { useEffect } from "react";

// Custom hook to run an effect only once after the initial render
export function useEffectOnce(effect: React.EffectCallback) {
  useEffect(effect, [effect]); // Empty dependency array ensures this runs only once after the initial render
}

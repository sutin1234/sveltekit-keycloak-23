import { useWritable } from "./shared-stored";
export const useDarkMode = () => useWritable('dark', true);

import { bn } from "./bn";
import { en } from "./en";
import { ar } from "./ar";
import { hi } from "./hi";
import { es } from "./es";

export type Language = "bn" | "en" | "ar" | "hi" | "es";

export const translations: Record<Language, Record<string, string>> = {
  bn,
  en,
  ar,
  hi,
  es,
};

export { bn, en, ar, hi, es };

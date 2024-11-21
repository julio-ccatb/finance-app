import { z } from "zod";

// Custom Zod validator for a string that can be cast to a decimal
export const decimalStringValidator = z.string().refine(
  (value) => {
    // Check if the string can be parsed as a decimal
    return !isNaN(parseFloat(value)) && isFinite(Number(value));
  },
  {
    message: "Invalid decimal string. Please provide a valid number.",
  },
);

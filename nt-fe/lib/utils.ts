import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toBase64(json: any) {
  return Buffer.from(JSON.stringify(json)).toString("base64");
}

export function formatBalance(balance: string | bigint, decimals: number, displayDecimals: number = 5): string {

  let parsedBalance: bigint;
  if (typeof balance === "string") {
    parsedBalance = BigInt(balance);
  } else {
    parsedBalance = balance;
  }
  return (
    (Number(parsedBalance / BigInt(10) ** BigInt(decimals - displayDecimals)))
    / (10 ** displayDecimals)).toFixed(displayDecimals);
}


/**
 * Parse key to readable format (snake_case/camelCase -> Title Case)
 */
export const parseKeyToReadableFormat = (key: string) => {
  return key
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add spaces between camelCase or PascalCase words
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize each word
};

/**
 * Encode data object to markdown format for DAO proposals
 */
export const encodeToMarkdown = (data: any) => {
  return Object.entries(data)
    .filter(([key, value]) => {
      return (
        key && // Key exists and is not null/undefined
        value !== null &&
        value !== undefined &&
        value !== ""
      );
    })
    .map(([key, value]) => {
      return `* ${parseKeyToReadableFormat(key)}: ${String(value)}`;
    })
    .join(" <br>");
};

import axios from "axios";

const BACKEND_API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_BASE || "";

interface Logger {
  info: (message: string, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
  error: (message: string, error?: unknown) => void;
}

const logger: Logger = {
  info: (message, data) => console.log(message, data),
  warn: (message, data) => console.warn(message, data),
  error: (message, error) => console.error(message, error),
};

export interface TreasuryMetadata {
  primaryColor?: string;
  flagLogo?: string;
  theme?: string;
}

export interface TreasuryConfig {
  metadata?: TreasuryMetadata;
  name?: string;
  purpose?: string;
}

export interface Treasury {
  daoId: string;
  config: TreasuryConfig;
}

/**
 * Get list of treasuries for a user account
 * Fetches from backend which includes config data from on-chain
 */
export async function getUserTreasuries(
  accountId: string
): Promise<Treasury[]> {
  if (!accountId) return [];

  try {
    const url = `${BACKEND_API_BASE}/user-treasuries`;
    logger.info("Fetching user treasuries", { accountId, url });

    const response = await axios.get<Treasury[]>(url, {
      params: { accountId },
    });

    logger.info("Successfully fetched user treasuries", {
      count: response.data.length,
    });

    return response.data;
  } catch (error) {
    logger.error("Error getting user treasuries", error);
    return [];
  }
}

export interface WhitelistToken {
  id: string;
  decimals: number;
  balance: number;
  balanceUSD: number;
  price: number;
  symbol: string;
  name: string;
  icon: string;
  weight: number;
}

export interface TreasuryAssets {
  tokens: WhitelistToken[];
  totalBalanceUSD: number;
}

interface WhitelistTokenRaw {
  id: string;
  decimals: number;
  balance: string;
  price: string;
  symbol: string;
  name: string;
  icon: string;
}

/**
 * Get whitelisted tokens with balances and prices for an account
 * Fetches from backend which aggregates data from Ref Finance and FastNear
 * Returns transformed data with calculated USD values and weights
 */
export async function getTreasuryAssets(
  treasuryId: string
): Promise<TreasuryAssets> {
  if (!treasuryId) return { tokens: [], totalBalanceUSD: 0 };

  try {
    const url = `${BACKEND_API_BASE}/whitelist-tokens`;
    logger.info("Fetching whitelist tokens", { treasuryId, url });

    const response = await axios.get<WhitelistTokenRaw[]>(url, {
      params: { accountId: treasuryId },
    });

    logger.info("Successfully fetched whitelist tokens", {
      count: response.data.length,
    });

    // Transform raw tokens with USD values
    const tokensWithUSD = response.data.map((token) => {
      const parsedBalance =
        BigInt(token.balance) / BigInt(10) ** BigInt(token.decimals);
      const balance = Number(parsedBalance);
      const price = parseFloat(token.price);
      const balanceUSD = balance * price;

      return {
        id: token.id,
        decimals: token.decimals,
        balance,
        balanceUSD,
        price,
        symbol: token.symbol,
        name: token.name,
        icon: token.icon,
        weight: 0,
      };
    });

    // Calculate total USD value
    const totalUSD = tokensWithUSD.reduce(
      (sum, token) => sum + token.balanceUSD,
      0
    );

    // Calculate weights
    const tokens = tokensWithUSD.map((token) => ({
      ...token,
      weight: totalUSD > 0 ? (token.balanceUSD / totalUSD) * 100 : 0,
    }));

    return {
      tokens,
      totalBalanceUSD: totalUSD,
    };
  } catch (error) {
    logger.error("Error getting whitelist tokens", error);
    return { tokens: [], totalBalanceUSD: 0 };
  }
}

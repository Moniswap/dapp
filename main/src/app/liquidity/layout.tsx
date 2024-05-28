import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moniswap | View & deposit liquidity",
  description: "Swap your favorite tokens on Berachain"
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

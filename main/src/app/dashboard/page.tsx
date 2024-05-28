"use client";

import ConnectWalletGuard from "@/guards/ConnectWalletGuard";
import Deposits from "@/ui/list/Deposits";
import LPAndRewards from "@/ui/list/LPAndRewards";
import Locks from "@/ui/list/Locks";
import Relay from "@/ui/list/Relay";
import VotingRewards from "@/ui/list/VotingRewards";

function Dashboard() {
  return (
    <ConnectWalletGuard>
      <div className="container mx-auto flex flex-col w-full justify-start items-start gap-10 px-3 animate-fade-down animate-once my-12">
        <Deposits />
        <Locks />
        <Relay />
        <LPAndRewards />
        <VotingRewards />
      </div>
    </ConnectWalletGuard>
  );
}

export default Dashboard;

'use client';
import NotConnected from "@/components/shared/NotConnected";
import Voting from "@/components/shared/Voting";
import VotingOwner from "@/components/shared/VotingOwner";

import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/utils/constants';

export default function Home() {
  const { address, isConnected } = useAccount();

  const { data, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'owner',
  });
  const ownerAddress = data as string;

  return (
    <>
      {!isConnected ? (
        <NotConnected />
      ) : ownerAddress && address && ownerAddress === address ? (
        <VotingOwner />
      ) : (
        <Voting />
      )
      }
    </>
  );
}

'use client';
import { useEffect, useState } from "react";
import { type BaseError, useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi'

// Viem to read blockchain events
import { publicClient } from "@/lib/client";
import { parseAbiItem } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

export type Proposal = {
    description: string,
    voteCount: number,
};

const GetProposals = () => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [proposalsLength, setProposalsLength] = useState(0);

    useEffect(() => {
        const fetchProposals = async () => {
            if (proposalsLength === 0) return;

            const proposalsData: Proposal[] = [];

            for (let i = 0; i <= proposalsLength; i++) {
                try {                    
                    const data = await publicClient.readContract({
                        address: CONTRACT_ADDRESS,
                        abi: CONTRACT_ABI,
                        functionName: 'getOneProposal',
                        args: [i],
                    });
                    proposalsData.push(data as Proposal);
                } catch (error) {
                    console.error(`Erreur lors de la récupération de la proposition ${i}:`, error);
                }
            }
            setProposals(proposalsData);
        };
        fetchProposals();
    }, [proposalsLength]);

    useEffect(() => {
        const fetchProposalsEvents = async () => {
            const proposalAddedEvents = await publicClient.getLogs({
                address: CONTRACT_ADDRESS,
                event: parseAbiItem('event ProposalRegistered(uint proposalId)'),
                fromBlock: 0n,
                toBlock: 'latest'
            });
            setProposalsLength(proposalAddedEvents.length);
        };
        fetchProposalsEvents();
    });

    useEffect(() => {
        console.log("Proposals mis à jour:", proposals);
    }, [proposals]);

    return (
        <div>
            <p>GetProposals {proposalsLength}</p>
            <ul>
                {proposals.map((proposal, index) => (
                    <li key={index}>
                        {proposal.description} - Votes: {proposal.voteCount}
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default GetProposals
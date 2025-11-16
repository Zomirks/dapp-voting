'use client';
import { useEffect, useState } from "react";
import { type BaseError, useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi'

// ShadCN UI Imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Viem to read blockchain events
import { publicClient } from "@/lib/client";
import { parseAbiItem } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

export type Proposal = {
    id: number,
    description: string,
    voteCount: number,
};

const GetProposals = () => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [proposalsLength, setProposalsLength] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProposals = async () => {
            if (proposalsLength === 0) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const proposalsData: Proposal[] = [];

            for (let i = 0; i <= proposalsLength; i++) {
                try {                    
                    const data = await publicClient.readContract({
                        address: CONTRACT_ADDRESS,
                        abi: CONTRACT_ABI,
                        functionName: 'getOneProposal',
                        args: [i],
                    }) as Proposal;
                    data.id = i;
                    if (i !== 0) {
                        proposalsData.push(data as Proposal);
                    }
                } catch (error) {
                    console.error(`Error getting the proposal ${i}:`, error);
                }
            }
            setProposals(proposalsData);
            setIsLoading(false);
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

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardContent className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground">Loading current Proposals...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (proposals.length === 0) {
        return (
            <Card className="w-full border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">There is no proposal yet</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="w-full mt-4 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Current Proposals</h2>
                <Badge variant="secondary" className="text-sm">
                    {proposals.length} {proposals.length > 1 ? 'proposals' : 'proposal'}
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {proposals.map((proposal) => (
                    <Card
                        key={proposal.id}
                        className="group relative overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]"
                    >
                        <CardHeader className="relative pb-2">
                            <div className="flex items-start justify-between gap-2">
                                <Badge variant="outline" className="bg-rainbowkit text-white w-fit">
                                    #{proposal.id}
                                </Badge>
                                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
                                    <svg
                                        className="h-4 w-4 text-primary"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span className="text-sm font-semibold text-primary">
                                        {proposal.voteCount}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="relative">
                            <p className="line-clamp-3 text-md">
                                {proposal.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
export default GetProposals
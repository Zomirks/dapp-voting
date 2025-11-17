'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

type ProposalData = {
    description: string;
    voteCount: bigint;
};

const WinningProposal = () => {
    const [winningProposal, setWinningProposal] = useState('');

    const { data: winningProposalID, error: readError, isPending: readIsPending } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'winningProposalID'
    });

    const { data: proposalData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getOneProposal',
        args: [winningProposalID],
    }) as { data: ProposalData | undefined };;

    useEffect(() => {
        if (proposalData?.description) {
            setWinningProposal(proposalData.description);
        }
    }, [proposalData]);

    return (
        <Card className="relative overflow-hidden border-2 border-primary/20 mb-4">
            <CardHeader className="relative space-y-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-rainbowkit text-primary-foreground px-3 py-1">
                                Winner
                            </Badge>
                            <Badge variant="outline" className="border-primary/30">
                                Proposal #{winningProposalID as number}
                            </Badge>
                        </div>
                        <CardDescription className="text-muted-foreground text-sm mt-1">
                            This proposal won the vote with the highest support
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative">
                <p className="text-lg">
                    {winningProposal}
                </p>
            </CardContent>
        </Card>
    )
}
export default WinningProposal
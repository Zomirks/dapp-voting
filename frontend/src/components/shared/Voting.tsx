'use client';

import { useEffect, useState } from "react";

// ShadCN components Import
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


// Wagmi Hooks to interact with the blockchain
import { type BaseError, useWriteContract, useReadContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

import AlertWaiting from "@/components/shared/alert/AlertWaiting";
import GetProposals from "@/components/shared/GetProposals";
import SetVote from "@/components/shared/SetVote";
import WinningProposal from "@/components/shared/WinningProposal";

type Voter = {
    isRegistered: boolean;
    hasVoted: boolean;
    votedProposalId: bigint;
};

const Voting = () => {
    const { data: hash, error: writeError, writeContract, isPending: writeIsPending } = useWriteContract()

    const { address } = useAccount();

    const [validationError, setValidationError] = useState('');
    const [inputProposal, setInputProposal] = useState('');

    const { data: workflowStatus, error: readError, isPending: readIsPending, refetch } = useReadContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'workflowStatus',
        });
    const workflowStatusIndex: number = workflowStatus as number;

    const { data: voter } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getVoter',
        args: [address]
    }) as { data: Voter | undefined };;

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    const handleAddProposal = async () => {
        setValidationError('');

        // Validation : Check if Proposal isn't empty
        if (!inputProposal || inputProposal.trim() === '') {
            setValidationError('Please enter a Proposal');
            return;
        }

        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'addProposal',
            args: [inputProposal],
        })
    }

    useEffect(() => {
        if (isConfirmed) {
            setInputProposal('');
        }
    }, [isConfirmed]);

    return (
        <>
            {workflowStatusIndex == 6 && (
                <WinningProposal />
            )}

            {voter?.isRegistered === true ? (
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">New Proposal</CardTitle>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <svg
                                        className="h-5 w-5 text-primary"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <CardDescription>
                                Send your proposal
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Alert : Waiting for blockchain confirmation */}
                            {isConfirming && (
                                <AlertWaiting />
                            )}

                            {/* Alert : Transaction confirmed */}
                            {isConfirmed && (
                                <Alert className="border-green-600 bg-green-500/10">
                                    <svg
                                        className="h-5 w-5 text-green-600"
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
                                    <AlertDescription className="text-foreground">
                                        Proposal added!
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Alert : Blockchain Error */}
                            {writeError && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        <div className="font-semibold mb-1">Transaction Error</div>
                                        <div className="text-sm">{(writeError as BaseError).shortMessage || writeError.message}</div>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="proposal-input"
                                        className={"text-base font-semibold text-" + (validationError ? "destructive" : "rainbowkit")}
                                    >
                                        Proposal description
                                    </Label>
                                    {validationError && (
                                        <Badge variant="destructive" className="text-xs">
                                            Error
                                        </Badge>
                                    )}
                                </div>

                                <Input
                                    id="proposal-input"
                                    type="text"
                                    value={inputProposal}
                                    placeholder="Describe your proposal..."
                                    onChange={(e) => setInputProposal(e.target.value)}
                                    className={validationError ? "border-destructive" : ""}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !writeIsPending && !isConfirming) {
                                            handleAddProposal();
                                        }
                                    }}
                                />

                                {validationError && (
                                    <p className="text-destructive text-xs flex items-center gap-1">
                                        <svg
                                            className="h-3 w-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        {validationError}
                                    </p>
                                )}

                                <Button
                                    onClick={handleAddProposal}
                                    className="w-full"
                                    disabled={writeIsPending || isConfirming}
                                >
                                    {writeIsPending || isConfirming ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            Submit
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-6">
                        <GetProposals />
                        <SetVote />
                    </div>
                </div>
            ) : (
                <>
                    <Alert className="border-blue-600 bg-blue-500/10">
                        <Info />
                        <AlertDescription className="text-foreground">
                            Oops! You're not on the whitelist. Come back when we're counting votes! 🗳️
                        </AlertDescription>
                    </Alert>
                </>
            )}
        </>
    )
}
export default Voting
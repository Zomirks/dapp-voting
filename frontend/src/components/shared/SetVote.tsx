'use client';
import { useState } from "react";
import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

// ShadCN components Import
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert"

// Custom components Import
import AlertWaiting from "@/components/shared/alert/AlertWaiting";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

const SetVote = () => {
    const [inputVoteProposal, setInputVoteProposal] = useState('');
    const [validationError, setValidationError] = useState('');

    const { data: hash, error: writeError, writeContract, isPending: writeIsPending } = useWriteContract()

    const [inputVote, setInputVote] = useState('');

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    const handleSetVote = async () => {
        setValidationError('');

        // Validation : Check if vote isn't empty
        if (!inputVoteProposal || inputVoteProposal.trim() === '' || Number(inputVoteProposal) == 0) {
            setValidationError('Please choose a valid proposal');
            return;
        }

        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'setVote',
            args: [inputVoteProposal],
        })
    }

    return (
        <div>
            <div className="p-6 border border-border rounded-lg bg-card">
            
                {/* Alert : Waiting for blockchain confirmation */}
                {isConfirming && (
                    <AlertWaiting />
                )}

                {/* Alert : Transaction confirmed */}
                {isConfirmed && (
                    <Alert className="mb-4 border-green-600 bg-green-500/10">
                        <AlertDescription className="text-foreground">
                            ✅ Transaction confirmed! You have voted.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Alert : Blockchain Error */}
                {writeError && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>
                            <div className="font-semibold mb-1">Transaction failed</div>
                            <div className="text-sm">{(writeError as BaseError).shortMessage || writeError.message}</div>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                    
                        <Label htmlFor="vote-input" className={"text-base font-semibold text-" + (validationError ? "destructive" : "rainbowkit")}>
                            Vote for a proposal
                        </Label>
                        {validationError && (
                            <Badge variant="destructive" className="text-xs">
                                Error
                            </Badge>
                        )}
                    </div>
                    <Input
                        id="vote-input"
                        type="number"
                        value={inputVoteProposal}
                        min={1}
                        placeholder="Select the Proposal ID you want to vote for"
                        onChange={(e) => setInputVoteProposal(e.target.value)}
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
                        onClick={handleSetVote}
                        className="w-full"
                        disabled={writeIsPending || isConfirming || isConfirmed}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default SetVote
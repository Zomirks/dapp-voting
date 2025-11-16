'use client';

import { useEffect, useState } from "react";

// ShadCN components Import
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert"

// Wagmi Hooks to interact with the blockchain
import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

import AlertWaiting from "@/components/shared/alert/AlertWaiting";

const Voting = () => {
    const { data: hash, error: writeError, writeContract, isPending: writeIsPending } = useWriteContract()

    const [validationError, setValidationError] = useState('');
    const [inputProposal, setInputProposal] = useState('');

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
            
        }
    }, [isConfirmed]);

    useEffect(() => {
        
    }, [])

    return (
        <>
            <div className="p-6 border border-border rounded-lg bg-card">
            
                {/* Alert : Waiting for blockchain confirmation */}
                {isConfirming && (
                    <AlertWaiting />
                )}

                {/* Alert : Transaction confirmed */}
                {isConfirmed && (
                    <Alert className="mb-4 border-green-600 bg-green-500/10">
                        <AlertDescription className="text-foreground">
                            ✅ Transaction confirmed! Your proposal has been added.
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

                <div className="space-y-2">
                    <Label htmlFor="proposal-input" className={"text-base font-semibold text-" + (validationError ? "destructive" : "rainbowkit")}>
                        Add a Proposal
                        {validationError && (
                            <Badge variant="destructive">Error</Badge>
                        )}
                    </Label>

                    <Input
                        id="proposal-input"
                        type="text"
                        value={inputProposal}
                        placeholder="Enter your Proposal"
                        onChange={(e) => setInputProposal(e.target.value)}
                    />
                    {validationError && (
                        <p className="text-destructive text-sm mb-2">{validationError}</p>
                    )}

                    <Button
                        onClick={handleAddProposal}
                        className=" w-full"
                        disabled={writeIsPending || isConfirming}
                    >
                        Submit
                    </Button>
                </div>
        </div>
        </>
    )
}
export default Voting
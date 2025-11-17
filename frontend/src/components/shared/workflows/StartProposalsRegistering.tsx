'use client';
import { useEffect } from "react";

// ShadCN components Import
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import AlertWaiting from "@/components/shared/alert/AlertWaiting";

// Wagmi Hooks to interact with the blockchain
import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

const StartProposalsRegistering = ({ refetch }: { refetch: () => void }) => {
    const { data: hash, error: writeError, writeContract, isPending: writeIsPending } = useWriteContract()

    const handleStartProposalsRegistering = async () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'startProposalsRegistering',
            args: [],
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    useEffect(() => {
        if (isConfirmed) {
            refetch();
        }
    }, [isConfirmed]);

    return (
        <>
            {/* Alert : Waiting for blockchain confirmation */}
            {isConfirming && (
                <AlertWaiting />
            )}

            {/* Alert : Transaction confirmed */}
            {isConfirmed && (
                <Alert className="mb-4 border-green-600 bg-green-500/10">
                    <AlertDescription className="text-foreground">
                        ✅ Transaction confirmed! The workflowStatus is now &quot;startProposalsRegistering&quot;.
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

            <Button
                onClick={handleStartProposalsRegistering}
                className="flex-1"
                disabled={writeIsPending || isConfirming}
            >
                Start Proposals Registration
            </Button>
        </>
    )
}
export default StartProposalsRegistering
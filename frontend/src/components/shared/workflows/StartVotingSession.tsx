'use client';
import { useEffect } from "react";

// ShadCN components Import
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

// Wagmi Hooks to interact with the blockchain
import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

const StartVotingSession = ({ refetch }: { refetch: () => void }) => {
    const { data: hash, error: writeError, writeContract, isPending: writeIsPending } = useWriteContract()

    const handleStartVotingSession = async () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'startVotingSession',
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
            toast.success("The workflow status is now: Start Voting Session");
        }
    }, [isConfirmed]);  

    return (
        <>
            <Button
                onClick={handleStartVotingSession}
                className="flex-1"
                disabled={writeIsPending || isConfirming}
            >
                {writeIsPending || isConfirming ? (
                    <>
                        <Spinner />
                        Waiting confirmation...
                    </>
                ) : (
                    <>
                        Start Voting Session
                    </>
                )}
            </Button>
        </>
    )
}
export default StartVotingSession
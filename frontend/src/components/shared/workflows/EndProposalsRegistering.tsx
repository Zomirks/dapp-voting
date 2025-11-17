'use client';
import { useEffect } from "react";

// ShadCN components Import
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

// Wagmi Hooks to interact with the blockchain
import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

const EndProposalsRegistering = ({ refetch }: { refetch: () => void }) => {
    const { data: hash, error: writeError, writeContract, isPending: writeIsPending } = useWriteContract()

    const handleEndProposalsRegistering = async () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'endProposalsRegistering',
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
            toast.success("The workflow status is now: End Proposals Registering");
        }
    }, [isConfirmed]);

    return (
        <>
            <Button
                onClick={handleEndProposalsRegistering}
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
                        End Proposals Registering
                    </>
                )}
            </Button>
        </>
    )
}
export default EndProposalsRegistering
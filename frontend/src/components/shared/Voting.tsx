'use client';

import { useEffect, useState } from "react";

// ShadCN components Import
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert"

// Wagmi Hooks to interact with the blockchain
import { type BaseError, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

// Viem to read blockchain events
import { publicClient } from "@/lib/client";
import { parseAbiItem } from "viem";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

const Voting = () => {
    const { data: hash, error: writeError, writeContract, isPending: writeIsPending } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    useEffect(() => {
        if (isConfirmed) {
            
        }
    }, [isConfirmed]);

    useEffect(() => {
        
    }, [])

    return (
        <div>
            
        </div>
    )
}
export default Voting
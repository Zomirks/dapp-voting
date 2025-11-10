'use client';

import { useEffect, useState } from "react";

// Imports des composants UI de shadcn
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert"

// Hooks Wagmi pour interagir avec la blockchain
import { type BaseError, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

// Constantes du smart contract (adresse et ABI)
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

const Voting = () => {
    const [inputWhitelistAddress, setInputWhitelistAddress] = useState('');
    const [validationError, setValidationError] = useState(''); 

    // Hook Wagmi pour écrire dans le smart contract (envoyer une transaction)
    const { data: hash, error: writeError, writeContract, isPending: writeIsPending } = useWriteContract()

    const handleAddWhitelist = async () => {
        setValidationError('');

        // Validation : Check if it's an EVM address
        if (!inputWhitelistAddress || inputWhitelistAddress.trim() === '' || !inputWhitelistAddress.startsWith("0x") || inputWhitelistAddress.length !== 42) {
            setValidationError('Please enter an EVM address');
            return;
        }

        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'addVoter',
            args: [inputWhitelistAddress],
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    useEffect(() => {
        if (isConfirmed) {
            setInputWhitelistAddress('');
        }
    }, [isConfirmed])

    return (
        <div>
            {/* Section 1 : Admin-only : Add an address to the whitelist */}
            <div className="p-6 border border-border rounded-lg bg-card">

                {/* Alert : Waiting for blockchain confirmation */}
                {isConfirming && (
                    <Alert className="mb-4">
                        <AlertDescription>
                            Waiting for blockchain confirmation... This may take a few seconds.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Alert : Transaction confirmed */}
                {isConfirmed && (
                    <Alert className="mb-4 border-green-600 bg-green-500/10">
                        <AlertDescription className="text-foreground">
                            ✅ Transaction confirmed! {inputWhitelistAddress} Has been added to the Whitelist.
                        </AlertDescription>
                    </Alert>
                )}
                <div className="space-y-2">
                    <Label htmlFor="whitelist-input" className={"text-base font-semibold text-" + (validationError ? "destructive" : "rainbowkit")}>
                        Add to the Whitelist
                        {validationError && (
                            <Badge variant="destructive">Error</Badge>
                        )}
                    </Label>
                    <Input
                        id="whitelist-input"
                        type="text"
                        value={inputWhitelistAddress}
                        placeholder="Enter an EVM address : 0x..."
                        onChange={(e) => setInputWhitelistAddress(e.target.value)}
                    />
                    {validationError && (
                        <p className="text-destructive text-sm mb-2">{validationError}</p>
                    )}
                </div>
                <Button
                    onClick={handleAddWhitelist}
                    className="w-full"
                >
                    Submit
                </Button>
            </div>
        </div>
    )
}
export default Voting
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

import EventsVoterRegistered from "./EventsVoterRegistered";
interface VoterAddress {
    voterAddress: string;
}

import StateStartProposalsRegistering from "./StateStartProposalsRegistering";

const Voting = () => {
    const [inputWhitelistAddress, setInputWhitelistAddress] = useState('');
    const [validationError, setValidationError] = useState(''); 

    const [eventsVoterAddress, setEventsVoterAddress] = useState<VoterAddress[]>([]);

    const { data: hash, error: writeError, writeContract, isPending: writeIsPending } = useWriteContract()

    const getVoterAddressEvents = async () => {
        const votersChangedEvents = await publicClient.getLogs({
            address: CONTRACT_ADDRESS,
            event: parseAbiItem('event VoterRegistered(address voterAddress)'),
            fromBlock: BigInt(0),
            toBlock: 'latest'
        });

        setEventsVoterAddress(votersChangedEvents.map((event) => {
            return {
                voterAddress: event.args.voterAddress as string,
            }
        }))
    }

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
            getVoterAddressEvents();
        }
    }, [isConfirmed]);

    useEffect(() => {
        getVoterAddressEvents();
    }, [])

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
                            ✅ Transaction confirmed! Address has been added to the Whitelist.
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
                    disabled={writeIsPending || isConfirming}
                >
                    Submit
                </Button>
            </div>
            
            <EventsVoterRegistered events={eventsVoterAddress} />

            <StateStartProposalsRegistering />
        </div>
    )
}
export default Voting
'use client';
import { useState, useEffect } from 'react';
import Voting from "@/components/shared/Voting";

// ShadCN components Import
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AlertWaiting from '@/components/shared/alert/AlertWaiting';

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

import StateStartProposalsRegistering from "@/components/shared/workflows/StartProposalsRegistering";

const VotingOwner = () => {
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
            <Tabs defaultValue="admin" className="w-full">
                <TabsList className="gap-1 self-center">
                    <TabsTrigger
                        value="admin"
                        className="data-[state=active]:bg-rainbowkit data-[state=active]:text-white data-[state=active]:font-semibold px-4"
                    >Admin</TabsTrigger>
                    
                    <TabsTrigger
                        value="user"
                        className="data-[state=active]:bg-rainbowkit data-[state=active]:text-white data-[state=active]:font-semibold px-4"
                    >User</TabsTrigger>
                </TabsList>

                <TabsContent value="admin">
                    {/* Section 1 : Admin-only : Add an address to the whitelist */}
                    <div className="p-6 border border-border rounded-lg bg-card">

                        {/* Alert : Waiting for blockchain confirmation */}
                        {isConfirming && (
                            <AlertWaiting />
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
                </TabsContent>

                <TabsContent value="user">
                    <Voting />
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default VotingOwner
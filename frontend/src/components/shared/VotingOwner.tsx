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
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

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

import StartProposalsRegistering from "@/components/shared/workflows/StartProposalsRegistering";
import EndProposalsRegistering from "@/components/shared/workflows/EndProposalsRegistering";
import CurrentWorkflow from '@/components/shared/workflows/CurrentWorkflow';
import StartVotingSession from '@/components/shared/workflows/StartVotingSession';
import EndVotingSession from '@/components/shared/workflows/EndVotingSession';

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

    const { data: workflowStatus, error: readError, isPending: readIsPending, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'workflowStatus',
    });
    const workflowStatusIndex: number = workflowStatus as number;

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
            refetch();
        }
    }, [isConfirmed]);

    useEffect(() => {
        getVoterAddressEvents();
        refetch();
    }, [])

    return (
        <div className="space-y-6">
            <Tabs defaultValue="admin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 gap-2 bg-muted/50 p-1">
                    <TabsTrigger
                        value="admin"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        Admin
                    </TabsTrigger>
                    
                    <TabsTrigger
                        value="user"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        User
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="admin" className="space-y-6 mt-6">
                    {/* Section Whitelist */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl">Whitelist</CardTitle>
                                    <CardDescription className="mt-1">
                                        Add the addresses of the users who will be able to vote
                                    </CardDescription>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Alerts */}
                        {isConfirming && (
                            <AlertWaiting />
                        )}

                        {isConfirmed && (
                                <Alert className="border-green-600 bg-green-500/10 [&>*]:col-span-full">
                                    <div className="flex items-center gap-3">
                                        <svg className="h-5 w-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                <AlertDescription className="text-foreground">
                                            Address added to the whitelist !
                                </AlertDescription>
                                    </div>
                            </Alert>
                        )}

                        {writeError && (
                                <Alert variant="destructive">
                                <AlertDescription>
                                        <div className="font-semibold mb-1">Transaction Error</div>
                                    <div className="text-sm">{(writeError as BaseError).shortMessage || writeError.message}</div>
                                </AlertDescription>
                            </Alert>
                        )}

                            {/* Form */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="whitelist-input" className="text-sm font-medium">
                                        Ethereum Address
                                    </Label>
                                {validationError && (
                                        <Badge variant="destructive" className="text-xs">
                                            Error
                                        </Badge>
                                )}
                                </div>

                            <Input
                                id="whitelist-input"
                                type="text"
                                value={inputWhitelistAddress}
                                    placeholder="0x..."
                                onChange={(e) => setInputWhitelistAddress(e.target.value)}
                                    className={validationError ? "border-destructive" : ""}
                            />

                            {validationError && (
                                    <p className="text-destructive text-xs flex items-center gap-1">
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {validationError}
                                    </p>
                            )}

                        <Button
                            onClick={handleAddWhitelist}
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
                                            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add to the whitelist
                                        </>
                                    )}
                        </Button>
                    </div>
                        </CardContent>
                    </Card>

                    {/* Liste des voteurs enregistrés */}
                    <EventsVoterRegistered events={eventsVoterAddress} />

                    {/* Section Workflow */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Workflow Management</CardTitle>
                            <CardDescription>
                                Control the different stages of the voting process
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <CurrentWorkflow workflowStatusIndex={workflowStatusIndex} isPending={readIsPending} />

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <StartProposalsRegistering refetch={refetch} />
                                <EndProposalsRegistering refetch={refetch} />
                                <StartVotingSession refetch={refetch} />
                                <EndVotingSession refetch={refetch} />
                        </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="user" className="mt-6">
                    <Voting />
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default VotingOwner
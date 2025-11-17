'use client';

// ShadCN components Import
import { Card, CardContent } from "@/components/ui/card";

const CurrentWorkflow = ({ workflowStatusIndex, isPending }: { workflowStatusIndex: number, isPending: boolean }) => {

    const workflowStatusNames = [
        "Registering Voters",
        "Proposals Registration Started",
        "Proposals Registration Ended",
        "Voting Session Started",
        "Voting Session Ended",
        "Votes Tallied"
    ];

    if (isPending)
        return <div className="p-6 text-center">Loading the current WorkflowStatus...</div>

    const workflowIcons = [
        // Registering Voters
        <svg key="0" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>,
        // Proposals Registration Started
        <svg key="1" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>,
        // Proposals Registration Ended
        <svg key="2" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>,
        // Voting Session Started
        <svg key="3" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>,
        // Voting Session Ended
        <svg key="4" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>,
        // Votes Tallied
        <svg key="5" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>,
    ];

    return (
        <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
                <div className="flex items-center gap-4 p-6 from-primary/10 via-primary/5 to-transparent">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {workflowIcons[workflowStatusIndex]}
                    </div>
                    <div className="flex flex-1 items-center justify-between gap-2">
                        <div>
                            <span className="text-sm text-muted-foreground mb-1">Current Workflow</span>
                            <h3 className="text-lg font-semibold">{workflowStatusNames[workflowStatusIndex]}</h3>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Step</p>
                            <p className="text-xl font-">{workflowStatusIndex + 1}/6</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        );
}
export default CurrentWorkflow
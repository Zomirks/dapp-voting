// ShadCN components Import
import { Alert, AlertDescription } from "@/components/ui/alert";

// Wagmi Hooks to interact with the blockchain
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/constants";

const CurrentWorkflow = () => {

    const { data: workflowStatus, error: readError, isPending: readIsPending } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'workflowStatus',
    });
    const workflowStatusIndex = workflowStatus as number;

    const workflowStatusNames = [
        "Registering Voters",
        "Proposals Registration Started",
        "Proposals Registration Ended",
        "Voting Session Started",
        "Voting Session Ended",
        "Votes Tallied"
    ];

    if (readIsPending)
        return <div className="p-6 text-center">Loading the current WorkflowStatus...</div>
    if (readError)
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertDescription>
                        Unable to read from smart contract. Make sure you are connected to the correct network or the the contract is deployed.
                    </AlertDescription>
                </Alert>
            </div>
        )
    
    return (
        <p>Current Status: <span>{workflowStatusNames[workflowStatusIndex]}</span></p>
    )
}
export default CurrentWorkflow
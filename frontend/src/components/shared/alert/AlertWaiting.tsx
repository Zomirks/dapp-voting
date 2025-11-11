import { Alert, AlertDescription } from "@/components/ui/alert";

const AlertWaiting = () => {
    return (
        <Alert className="mb-4">
            <AlertDescription>
                Waiting for blockchain confirmation... This may take a few seconds.
            </AlertDescription>
        </Alert>
    )
}
export default AlertWaiting
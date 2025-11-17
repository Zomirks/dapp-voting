import { Alert, AlertDescription } from "@/components/ui/alert";

const AlertWaiting = () => {
    return (
        <Alert className="border-blue-600 bg-blue-500/10">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <AlertDescription className="text-foreground">
                Waiting for blockchain confirmation... This may take a few seconds.
            </AlertDescription>
        </Alert>
    )
}
export default AlertWaiting
import { Badge } from "@/components/ui/badge"

interface VoterAddress {
  voterAddress: string;
}

const EventsVoterRegistered = ({ events }: { events: VoterAddress[] }) => {
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Whitelist History</h3>
      {events.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No transactions yet. Submit an address to see your transaction history.
        </p>
      ) : (
        <div className="space-y-2">
          {events.slice().reverse().map((event, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-1">
                <Badge variant="default" className="bg-rainbowkit">addVoter</Badge>
              </div>

              <div className="text-right">
                <span className="text-sm font-semibold text-primary">
                  {shortenAddress(event.voterAddress)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EventsVoterRegistered
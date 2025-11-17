import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote, Wallet, CheckCircle2, Users } from 'lucide-react';

const NotConnected = () => {
	return (
		<div className="max-w-4xl mx-auto space-y-8 mt-8">
			<div className="text-center space-y-4">
				<h2 className="text-4xl font-bold tracking-tight">Système de vote décentralisé</h2>
				<p className="text-xl text-muted-foreground">Participez aux décisions importantes de manière transparente et sécurisée</p>
			</div>

			<Alert>
				<Wallet className="h-4 w-4" />
				<AlertDescription>
					Connectez votre wallet EVM pour accéder à la plateforme de vote et participer aux décisions.
				</AlertDescription>
			</Alert>

			<div className="grid md:grid-cols-3 gap-6 mt-12">
				<Card>
				<CardHeader>
					<CheckCircle2 className="h-8 w-8 mb-2 text-primary" />
					<CardTitle className="text-rainbowkit">Transparent</CardTitle>
					<CardDescription>
						Tous les votes sont enregistrés sur la blockchain et vérifiables par tous
					</CardDescription>
				</CardHeader>
				</Card>

				<Card>
				<CardHeader>
					<Vote className="h-8 w-8 mb-2 text-primary" />
					<CardTitle className="text-rainbowkit">Sécurisé</CardTitle>
					<CardDescription>
						Votre vote est protégé par la cryptographie et ne peut pas être modifié
					</CardDescription>
				</CardHeader>
				</Card>

				<Card>
				<CardHeader>
					<Users className="h-8 w-8 mb-2 text-primary" />
					<CardTitle className="text-rainbowkit">Décentralisé</CardTitle>
					<CardDescription>
						Aucune autorité centrale ne contrôle le processus de vote
					</CardDescription>
				</CardHeader>
				</Card>
			</div>

			<Card className="mt-12">
				<CardContent className="pt-6">
				<div className="text-center space-y-4">
					<h3 className="text-rainbowkit text-2xl font-semibold">Prêt à voter ?</h3>
					<p className="text-muted-foreground">Connectez votre wallet Ethereum pour commencer. Assurez-vous d'être sur le bon réseau.</p>
				</div>
				</CardContent>
			</Card>

			<div className="text-center text-sm text-muted-foreground mt-8">
				<p>Wallets supportés : MetaMask, WalletConnect, Coinbase Wallet</p>
			</div>
		</div>
  	)
}
export default NotConnected
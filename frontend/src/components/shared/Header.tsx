'use client';
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
    return (
        <nav className="flex items-center justify-between p-2">
            <div className="font-bold text-md bg-rainbowkit gap-1 flex items-center text-white h-10 px-3.5 rounded-md">
                Voting <span className="text-primary">DApp</span>
            </div>
            <div>
                <ConnectButton />
            </div>
        </nav>
    )
}
export default Header
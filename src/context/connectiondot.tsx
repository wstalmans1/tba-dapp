/*
This component:
    * creates the green/red dot that indicates the connection status (green for "connected", red for "not connected")
    * imports the useWeb3Context hook from the Web3Context.tsx file, which provides the connection status, account, balance, and the connectWallet and disconnectWallet function
    * creates the button that triggers the function connectWallet from Web3Context.tsx
    * is a child of the Web3Context.tsx
*/

import React from 'react';
import { useWeb3Context } from './Web3Context';

const ConnectionDot: React.FC = () => {
    const { provider, account, balance, connectWallet } = useWeb3Context();

    return (
        <div className="text-green-100">
            {provider && !account ? (
                    <div className="flex flex-col pb-2">    
                        <div className="flex items-center">                
                            <div className="mr-2 h-3 w-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm">Not Connected</span>    
                            <button onClick={connectWallet} className="bg-green-500 text-green-100 text-xs px-1 py-1 rounded ml-2">Connect</button>
                        </div>
                    </div>
                ) : account ? (
                    <div className="flex flex-col pb-2">
                        <div className="flex items-center">
                            <div className="mr-2 h-3 w-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Connected: {account}</span>
                            <span className="text-sm">&nbsp;({balance} ETH)</span>
                        </div>
                    </div>    
            ) : (
                <div className="flex flex-col pb-2">    
                    <div className="flex items-center">                
                        <div className="mr-2 h-3 w-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Not Connected.</span>    
                        <p className="pl-2 text-sm">No provider detected. Install MetaMask or Phantom wallet.</p>
                    </div>
                </div>            
            )}
        </div>
    );
};

export default ConnectionDot;

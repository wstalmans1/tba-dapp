/**
 * This file:
    * sets the blockchain Web3 EIP 1193 provider object and identifies the user's account
    * passes those values to React Context
    * provides a wrapper that passes on the context down the component tree
    * provides the function/hook (cfr export const useWeb3) that enables components to consume the React context values
    * at the end of the file is the actual provider component with its values and functions: 
        <Web3Context.Provider value={{ provider, account, balance, connectWallet, disconnectWallet }}>
            {children}
        </Web3Context.Provider>
 */

        import React, { createContext, useContext, useEffect, useState } from 'react';
        import { formatBalance } from '../utils/utils';
        
        interface Web3ContextType {
            provider: any;
            account: string | null;
            balance: string | null;
            connectWallet: () => void;
            disconnectWallet: () => void;
        }
        
        // The React createContext function creates the CONTEXT OBJECT that allows to pass on information throughout the entire file tree. 
        // The context object is used to share information between components without having to pass props down manually at every level.
        // The context object has two components; the 'provider' and the 'consumer' component.
        // The provider object holds as info the content defined in the 
        // Web3ContextType interface (provider, account, balance, connectWallet function, disconnectWallet function).
        // The provider-component is provided with the info to be shared and used to wrap around components to provide context values. 
        // The provider-component is used to provide the context values to its children.
        // The conumer-component is Used by other files to consume the context values (though in modern React, useContext hook is typically used instead).
        const Web3Context = createContext<Web3ContextType | undefined>(undefined);
        
        
        // Web3Provider component to create and provide the Web3 context to its children
        export const Web3Provider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
            
            const [provider, setProvider] = useState<any>(null);
            const [account, setAccount] = useState<string | null>(null);
            const [balance, setBalance] = useState<string | null>(null);
        
            // Detect & set the EIP1193 provider object
            useEffect(() => {
                const detectProvider = async () => {
                    if ('ethereum' in window) {
                        setProvider(window.ethereum);
                    } else if ('solana' in window) {
                        setProvider(window.solana);
                    } else { 
                        console.log('No provider detected. Install MetaMask or Phantom wallet');                 
                    }               
                };
                detectProvider(); 
            }, []);
        
            // Handling disconnect and change of accounts
            useEffect(() => {
                if (provider) {
                    provider.on('accountsChanged', handleAccountsChanged);
                    provider.on('disconnect', disconnectWallet);
                    return () => {
                        provider.removeListener('accountsChanged', handleAccountsChanged);
                        provider.removeListener('disconnect', disconnectWallet);
                    };
                }
            }, [provider]);
        
            useEffect(() => {
                if (account) {
                    fetchBalance(account);
                }
            }, [account]);
        
            const handleAccountsChanged = async (accounts: string[]) => {
                if (accounts.length === 0) {
                    // User disconnected their wallet
                    disconnectWallet();
                } else {
                    // User switched accounts
                    setAccount(accounts[0]);
                }
            };
        
            const fetchBalance = async (account: string) => {
                if (provider) {
                    if (provider.isMetaMask) {
                        const balanceWei = await provider.request({
                            method: 'eth_getBalance',
                            params: [account, 'latest'],
                        });
                        setBalance(formatBalance(balanceWei));
                    } else if (provider.isPhantom) {
                        const balanceLamports = await provider.getBalance(account);
                        setBalance((balanceLamports / 1e9).toString());
                    }
                }
            };
        
            const disconnectWallet = () => {
                setAccount(null);
                setBalance(null);
            };
        
            // Function to connect to the wallet and set the account
            // This function can be called by any component that consumes the Web3Context consumer, as it is part of the context object
            const connectWallet = async () => {
                if (provider) {
                    try {
                        if (provider.isMetaMask) { 
                            // The following line is the one single line that is responsible for initoating the connection to the wallet
                            const accounts = await provider.request({method: 'eth_requestAccounts'});
                            setAccount(accounts[0]);
                        } else if (provider.isPhantom) {
                            const response = await provider.connect();
                            setAccount(response.publicKey.toString());
                        }
                    } catch (error) {
                        console.log('Error connecting to wallet:', error)
                    }
                }       
            };
        
            // Set the context (with its values provider, account, connectWallet) and pass them down to the component tree
            return (
                <Web3Context.Provider value={{ provider, account, balance, connectWallet, disconnectWallet }}>
                    {children}
                </Web3Context.Provider>
            );
        };
        
        // Custom hook to use the Web3 context. All descendant components (children) can access the context values using useContext(Web3Context).
        export const useWeb3Context = () => {
            const context = useContext(Web3Context);
            if (!context) {
                throw new Error('useWeb3 must be used within a Web3Provider');
            }
            return context;
        };
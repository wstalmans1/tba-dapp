import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ConnectButton } from '@rainbow-me/rainbowkit';



const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const ConnectionButton = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
            <ConnectButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default ConnectionButton;
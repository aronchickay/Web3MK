import './App.css';
import React from "react";
import {
    getDefaultWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
} from 'wagmi';
import { ChakraProvider } from '@chakra-ui/react'

import { publicProvider } from 'wagmi/providers/public';
import App from "./App";
import { alchemyProvider } from "wagmi/providers/alchemy";


const { chains, provider } = configureChains(
    [chain.polygonMumbai],
    [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
);
const { connectors } = getDefaultWallets({
    appName: 'Web3 Markdown',
    chains
});
const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

function AppIndex() {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
                showRecentTransactions={true}
                coolMode
                chains={chains}>
                <ChakraProvider>
                    <App/>
                </ChakraProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default AppIndex;

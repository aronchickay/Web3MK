import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@rainbow-me/rainbowkit/styles.css';
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

const { chains, provider } = configureChains(
    [chain.polygonMumbai],
    [
        publicProvider()
    ]
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
              showRecentTransactions={true}
              coolMode
              chains={chains}>
              <ChakraProvider>
                  <App />
              </ChakraProvider>
          </RainbowKitProvider>
      </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

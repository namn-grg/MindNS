import React, { useEffect, useState, useRef } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import Web3Modal from 'web3modal';
import { providers, Contract } from 'ethers';

// Constants
const TWITTER_HANDLE = 'namn_grg';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
    const [loading, setLoading] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const web3ModalRef = useRef();

    const getProviderOrSigner = async (needSigner = false) => {
        // Connect to Metamask
        // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);

        // If user is not connected to the Goerli network, let them know and throw an error
        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 5) {
            window.alert('Change the network to Goerli');
            throw new Error('Change network to Goerli');
        }

        if (needSigner) {
            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;
    };

    const connectWallet = async () => {
        try {
            // Get the provider from web3Modal, which in our case is MetaMask
            // When used for the first time, it prompts the user to connect their wallet
            await getProviderOrSigner();
            setWalletConnected(true);
        } catch (err) {
            console.error(err);
        }
    };

    const renderButton = () => {
        // If wallet is not connected, return a button which allows them to connect their wllet
        if (walletConnected) {
            if (loading) {
                return <button className="button">Loading...</button>;
            } else {
                return <button className="button">Join the Whitelist</button>;
            }
        } else if (!walletConnected) {
            return (
                <button onClick={connectWallet} className="button">
                    Connect your wallet
                </button>
            );
        }
    };

    useEffect(() => {
        // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
        if (!walletConnected) {
            // Assign the Web3Modal class to the reference object by setting it's `current` value
            // The `current` value is persisted throughout as long as this page is open
            web3ModalRef.current = new Web3Modal({
                network: 'goerli',
                providerOptions: {},
                disableInjectedProvider: false,
            });
            connectWallet();
        }
    }, [walletConnected]);

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <header>
                        <div className="left">
                            <p className="title">🧠 Mind Name Service</p>
                            <p className="subtitle">
                                Your immortal API on the blockchain!
                            </p>
                            {renderButton()}
                        </div>
                    </header>
                </div>

                <div className="footer-container">
                    <img
                        alt="Twitter Logo"
                        className="twitter-logo"
                        src={twitterLogo}
                    />
                    <a
                        className="footer-text"
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noreferrer"
                    >{`Build with ❤ and ⚡ by @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;

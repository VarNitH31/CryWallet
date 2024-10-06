import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import './walletPage.css';
import { QrCode } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import { BiCopy } from 'react-icons/bi';
import axios from 'axios';

function WalletPage() {
    const location = useLocation();
    const { wallet, currency } = location.state || {};
    const [balance, setBalance] = useState(0);
    const [solPrice, setSolPrice] = useState(0);
    const [sol, setSol] = useState(0);

    const getSolanaPrice = async () => {
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'solana',
        vs_currencies: 'usd',
      },
    });
            const solPrice = response.data.solana.usd;
            setSolPrice(solPrice);
        } catch (error) {
            console.error('Error fetching the Solana price:', error);
        }
    };

    const getSolQuantity = async () => {
        const reqBody = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getBalance",
            "params": ["Ahp1ST12RQMBiy66F6YtADXRdarjcdY5Xc5cdnTmp2Lm"]
        };

        try {
            const response = await axios.post("https://api.devnet.solana.com", reqBody);
            const solAmount = response.data.result.value;
            setSol(solAmount);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
            () => alert("Copied to clipboard!"),
            () => alert("Failed to copy!")
        );
    };

    useEffect(() => {
        if (currency === "sol") {
            getSolanaPrice();
            getSolQuantity();
        }
    }, [currency]);

    useEffect(() => {
        if (solPrice > 0 && sol > 0) {
            const balance = (sol * solPrice) / 1000000000;
            setBalance(balance);
        }
    }, [sol, solPrice]);

    return (
        <>
            <div className="body">
                <Navbar />
                <div className="walletMain">
                    <div className="walletHeader">
                        <h1>Balance</h1>
                    </div>
                    <div className="balance">
                        <h2>${balance.toFixed(2)}</h2>
                    </div>
                    <div className="walletIcons">
                        <div className="recieve item">
                            <QrCode />
                            <p>Receive</p>
                        </div>
                        <div className="send item">
                            <SendIcon />
                            <p>Send</p>
                        </div>
                    </div>


                    <div className="keys">
                        <label>Public Key</label>
                        <div className="key-container">
                            <span>{wallet?.address || "No public key available"}</span>
                            <BiCopy className="copy-icon" onClick={() => copyToClipboard(wallet?.address)} />
                        </div>

                        <label>Private Key</label>
                        <div className="key-container">
                            <span>{wallet?.privateKey || "No private key available"}</span>
                            <BiCopy className="copy-icon" onClick={() => copyToClipboard(wallet?.privateKey)} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WalletPage;

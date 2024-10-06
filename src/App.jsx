import { useState, useEffect } from "react";
import { generateMnemonic } from "bip39";
import "./App.css";
import Navbar from "./components/Navbar";
import PhraseBox from "./components/PhraseBox";
import Etherium from "./components/Etherium";
import Solana from "./components/Solana";
import { Buffer } from "buffer";
import { useSelector, useDispatch, Provider } from "react-redux";
import { removeEth } from "./redux/Etherium/ethSlicer";
import { removeSol } from "./redux/Solana/solSlicer";
import { store } from "./redux/store";
import { BiCopy } from "react-icons/bi";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import WalletPage from "./components/WalletPage";
import {
	Route,
	BrowserRouter as Router,
	Routes,
	useNavigate,
} from "react-router-dom";
import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function App() {
	const [mnemonic, setMnemonic] = useState("");
	const [wallets, setWallets] = useState([]);
	const [showWallets, setShowWallets] = useState(false);Buffer
	const [seedArray, setSeedArray] = useState([]);
	const [currentWallet, setCurrentWallet] = useState("");

	const solanaWallets = useSelector((state) => state.sol.value);
	const ethWallets = useSelector((state) => state.eth.value);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [visible, setVisible] = useState([]);
	const handleVisible = (index) => {
		setVisible((prevVisible) => {
			const newVisible = [...prevVisible];
			newVisible[index] = !newVisible[index]; 
			return newVisible;
		});
	};
	
	useEffect(() => {
		if (wallets.length > 0) {
			setVisible(new Array(wallets.length).fill(false)); // Set all visibility to false initially
		}
	}, [wallets]);
	

	const [open, setOpen] = useState(false);

	const handleClick = () => {
	  setOpen(true);
	};
  
	const handleClose = (event, reason) => {
	  if (reason === 'clickaway') {
		return;
	  }
  
	  setOpen(false);
	};

	const copyToClipboard = (text) => {
		if(text==""){
			return;
		}
		navigator.clipboard.writeText(text).then(
			() => {
				handleClick();
				setTimeout(() => setCopySuccess(""), 2000);
			},
		);
	};

	const deleteWallet = (address) => {
		setWallets((prevWallets) =>
			prevWallets.filter((wallet) => wallet.address !== address)
		);
		if (currentWallet == "sol") {
			dispatch(removeSol(address));
		} else if (currentWallet == "eth") dispatch(removeEth(address));
	};

	const generateSeed = () => {
		const mnemonicGenerated = generateMnemonic();
		setMnemonic(mnemonicGenerated);
		setSeedArray(mnemonicGenerated.split(" "));
	};

	const handleShowWallets = (currency) => {
		setShowWallets(true);
		if (currency === "sol") {
			setWallets(solanaWallets);
			setCurrentWallet("sol");
		} else if (currency === "eth") {
			setWallets(ethWallets);
			setCurrentWallet("eth");
		}
		setShowWallets(!showWallets);
	};

	const handleWalletClicked = (wallet) => {
		console.log(`wallet clicked with address ${wallet.address} `);
		navigate(`/wallet`,{
			state: {
				wallet: wallet,
				currency: currentWallet
			}
		});
	};

	return (
		<div className="body">
			<Navbar />
			{showWallets && (
				<div className="walletDisplay">
					<div className="walletDisHeader">
						<p>Wallets</p>
						<CloseIcon
							onClick={() => {
								setCurrentWallet("");
								setShowWallets(false);
							}}
						/>
					</div>
					{wallets.map((wallet, index) => (
						<div
							key={index}
							onClick={() => handleWalletClicked(wallet)}
							className="walletItem"
						>
							<div
								className="walletHead"
								style={{ display: "flex", justifycontent: "space-between" }}
							>
								<p>Wallet {index + 1}</p>
								<DeleteIcon
									style={{ color: "white" }}
									onClick={(e) =>{
										e.stopPropagation();
										deleteWallet(wallet.address)}
									} 
								/>
							</div>
							<div className="walletKey public">
								<label>Address</label>
								<div className="textDis">
									<span className="text">{wallet.address}</span>
									<BiCopy
										onClick={(e) => {
											e.stopPropagation();
											copyToClipboard(wallet.address)}}
										title="Copy Private Key"
									/>
								</div>
							</div>
							<div className="walletKey private">
								<label>Private Key</label>
								<div className="textDis">
									<input
										type={!visible[index] ? "password" : "text"}
										className="text"
										value={wallet.privateKey}
										readOnly
									/>
									<div className="icons">
										{!visible ? (
											<VisibilityIcon onClick={(e)=>{
												e.stopPropagation();
												handleVisible(index)}} />
										) : (
											<VisibilityOffIcon onClick={(e)=>{
												e.stopPropagation();
												handleVisible(index)}} />
										)}
										<BiCopy
											
											onClick={(e) => {
												e.stopPropagation();
												copyToClipboard(wallet.privateKey)}}
											title="Copy Private Key"
										/>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
			<div className={`main ${showWallets ? "blur" : ""}`}>
				<div className="seedGeneraator">
					<div className="getSeed button">
						<button onClick={generateSeed}>Generate seed</button>
					</div>
					{mnemonic && <PhraseBox seedArray={seedArray} />}
				</div>
				<div className="wallets">
					<div className="walletsContainer">
						<Etherium mnemonic={mnemonic} />
					</div>
					<div className="walletsContainer">
						<Solana mnemonic={mnemonic} />
					</div>
				</div>
				<div className="showWallets">
					<div
						className="showEth allWalletBut button"
						onClick={() => handleShowWallets("eth")}
					>
						<span>Show All Eth Wallets</span>
					</div>
					<div
						className="showSol allWalletBut button"
						onClick={() => handleShowWallets("sol")}
					>
						<span>Show All Sol Wallets</span>
					</div>
				</div>
			</div>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Copied!
        </Alert>
      </Snackbar>
		</div>
	);
}

export default () => (
	<Provider store={store}>
		<Router>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/wallet" element={<WalletPage />} />
			</Routes>
		</Router>
	</Provider>
);

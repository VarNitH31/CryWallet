import { useState, useEffect } from "react";
import { generateMnemonic } from "bip39";
import "./App.css";
import Navbar from "./components/Navbar";
import PhraseBox from "./components/PhraseBox";
import Etherium from "./components/Etherium";
import Solana from "./components/Solana";
import { Buffer } from "buffer";
import { useSelector, useDispatch, Provider } from "react-redux";
import { store } from "./redux/store";
import { BiCopy } from "react-icons/bi";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function App() {
	const [mnemonic, setMnemonic] = useState("");
	const [wallets, setWallets] = useState([]);
	const [showWallets, setShowWallets] = useState(false);
	const [seedArray, setSeedArray] = useState([]);
  const [copySuccess, setCopySuccess] = useState('');

	const solanaWallets = useSelector((state) => state.sol.value);
	const ethWallets = useSelector((state) => state.eth.value);

	const [visible, setVisible] = useState(false);
	const handleVisible = () => {
		setVisible(!visible);
	};

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text).then(
			() => {
				setCopySuccess("Copied!");
				setTimeout(() => setCopySuccess(""), 2000);
			},
			() => {
				setCopySuccess("Failed to copy!");
			}
		);
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
		} else if (currency === "eth") {
			setWallets(ethWallets);
		}
		setShowWallets(!showWallets);
	};

	useEffect(() => {
		if (showWallets) {
			console.log("Wallets updated:", wallets);
		}
	}, [showWallets, wallets]);
	return (
		<div className="body">
			<Navbar />
			{showWallets && (
				<div className="walletDisplay">
					<div className="walletDisHeader">
						<p>Wallets</p>
						<CloseIcon onClick={() => setShowWallets(false)} />
					</div>
					{wallets.map((wallet, index) => (
						<div key={index} className="walletItem">
							<p>Wallet {index+1}</p>
							<div className="walletKey public">
								<label>Address</label>
								<div className="textDis">
									<span className="text">{wallet.address}</span>
									<BiCopy
										onClick={() => copyToClipboard(wallet.privateKey)}
										title="Copy Private Key"
									/>
								</div>
							</div>
							<div className="walletKey private">
								<label>Private Key</label>
								<div className="textDis">
									<input
										type={!visible ? "password" : "text"}
										className="text"
										value={wallet.privateKey}
										readOnly
									/>
									<div className="icons">
										{!visible ? (
											<VisibilityIcon onClick={handleVisible} />
										) : (
											<VisibilityOffIcon onClick={handleVisible} />
										)}
										<BiCopy
											onClick={() => copyToClipboard(wallet.privateKey)}
											title="Copy Private Key"
										/>
									</div>
								</div>
							</div>

              {copySuccess && (
									<div className="copySuccess">{copySuccess}</div>
								)}
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
		</div>
	);
}

export default () => (
	<Provider store={store}>
		<App />
	</Provider>
);

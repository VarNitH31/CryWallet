import React from "react";
import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import "../components/eth.css";
import { BiCopy } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { addEth } from "../redux/Etherium/ethSlicer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Etherium({ mnemonic }) {
	const dispatch = useDispatch();

	const [currentIndex, setCurrentIndex] = useState(0);
	const [curPublicKey, setCurPublicKey] = useState("");
	const [curPrivateKey, setCurPrivateKey] = useState("");
	const [ethVisible, setEthVisible] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

	const handleEthVisible = () => {
		setEthVisible(!ethVisible);
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

	const createEtherium = async () => {
		if (mnemonic) {
			const seed = await mnemonicToSeed(mnemonic);
			const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
			const hdNode = HDNodeWallet.fromSeed(seed);
			const child = hdNode.derivePath(derivationPath);
			const privateKey = child.privateKey;
			setCurPrivateKey(privateKey);
			const wallet = new Wallet(privateKey);
			setCurrentIndex(currentIndex + 1);
			setCurPublicKey(wallet.address);
			dispatch(addEth({ privateKey, address: wallet.address }));
		}
	};

	return (
		<div>
			<div className="create-eth">
				<button className="button" onClick={createEtherium}> Genearte Etherium wallet </button>
				<div className="eth-wallets">
					<div className="publicKey key">
						<span className="text">{curPublicKey}</span>
						<BiCopy
							onClick={() => copyToClipboard(curPublicKey)}
							title="Copy Public Key"
						/>
					</div>
					<div className="privateKey key">
						<input
							type={!ethVisible ? "password" : "text"}
							className="text"
							value={curPrivateKey}
							readOnly
						/>
						<div className="icons">
							{!ethVisible ? (
								<VisibilityIcon onClick={handleEthVisible} />
							) : (
								<VisibilityOffIcon onClick={handleEthVisible} />
							)}
							<BiCopy
								onClick={() => copyToClipboard(curPrivateKey)}
								title="Copy Private Key"
							/>
						</div>
					</div>
                    {copySuccess && <div className="copySuccess">{copySuccess}</div>}
				</div>
			</div>
		</div>
	);
}

export default Etherium;

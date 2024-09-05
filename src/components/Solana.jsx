import React, { useState } from "react";
import "../components/solana.css";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { BiCopy } from "react-icons/bi"; // Importing copy icon
import { useDispatch } from "react-redux";
import { addSol } from "../redux/Solana/solSlicer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Solana({ mnemonic }) {
	const dispatch = useDispatch();
	const [solAddress, setSolAddress] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [curPublicKey, setCurPublicKey] = useState("");
	const [curPrivateKey, setCurPrivateKey] = useState("");
	const [copySuccess, setCopySuccess] = useState("");
	const [solVisible, setSolVisible] = useState(false);
	const handleSolVisible = () => {
		setSolVisible(!solVisible);
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

	const createSolana = async () => {
		if (mnemonic) {
			const seed = await mnemonicToSeed(mnemonic);
			const path = `m/44'/501'/${currentIndex}'/0'`;
			const derivedSeed = derivePath(path, seed.toString("hex")).key;
			const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
			const keypair = Keypair.fromSecretKey(secret);

			setCurPublicKey(keypair.publicKey.toBase58());
			setCurPrivateKey(Buffer.from(keypair.secretKey).toString("hex"));
			setCurrentIndex(currentIndex + 1);
			dispatch(
				addSol({
					address: keypair.publicKey.toBase58(),
					privateKey: Buffer.from(keypair.secretKey).toString("hex"),
				})
			);
		}
	};

	return (
		<div>
			<div className="create-solana">
				<button className="button" onClick={createSolana}>Generate Solana Wallet</button>
				<div className="sol-wallets">
					<div className="publicKey key">
						<span className="text">{curPublicKey}</span>
						<BiCopy
							onClick={() => copyToClipboard(curPublicKey)}
							title="Copy Public Key"
						/>
					</div>
					<div className="privateKey key">
						<input
							type={!solVisible ? "password" : "text"}
							className="text"
							value={curPrivateKey}
							readOnly
						/>
						<div className="icons">
							{!solVisible ? (
								<VisibilityIcon onClick={handleSolVisible} />
							) : (
								<VisibilityOffIcon onClick={handleSolVisible} />
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

export default Solana;

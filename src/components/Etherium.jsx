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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


function Etherium({ mnemonic }) {
	const dispatch = useDispatch();

	const [currentIndex, setCurrentIndex] = useState(0);
	const [curPublicKey, setCurPublicKey] = useState("");
	const [curPrivateKey, setCurPrivateKey] = useState("");
	const [ethVisible, setEthVisible] = useState(false);

	const handleEthVisible = () => {
		setEthVisible(!ethVisible);
	};

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

export default Etherium;

import React, { useState } from 'react';
import '../components/phrasebox.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { BiCopy } from 'react-icons/bi';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function PhraseBox({ seedArray }) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);


  const toggleSeedVisibility = () => {
    setHidden(!hidden);
  };

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

  return (
    <>
      <div className="seedDisplay">
        <div className="mnemonicHeader">
          <p>Mnemonic</p>
          <span onClick={toggleSeedVisibility}>
            {hidden ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
          </span>
          
        </div>
          <div className={`seedDisplay-grid ${hidden ? 'hide' : 'show'}`}>
            {seedArray.map((value, index) => (
              <div key={index} className="seedDisplay-grid-item">
                {value}
              </div>
            ))}
			<div className="copyIcon">
			<BiCopy onClick={copyToClipboard} title="Copy to Clipboard" />
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
    </>
  );
}

export default PhraseBox;

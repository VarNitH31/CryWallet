import React, { useState } from 'react';
import '../components/phrasebox.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { BiCopy } from 'react-icons/bi'; // Importing an icon for the copy button

function PhraseBox({ seedArray }) {
  const [hidden, setHidden] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const toggleSeedVisibility = () => {
    setHidden(!hidden);
  };

  const copyToClipboard = () => {
    const textToCopy = seedArray.join(' '); // Combine the seed array into a single string
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000); // Clear the success message after 2 seconds
    }, (err) => {
      setCopySuccess('Failed to copy!');
    });
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
			{copySuccess && <div className="copySuccess">{copySuccess}</div>}
			</div>
          </div>
       
        
      </div>
    </>
  );
}

export default PhraseBox;

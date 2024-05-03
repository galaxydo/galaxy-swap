import React, { useState } from "react";
import { FiClipboard, FiCheck } from "react-icons/fi";
import { CopyToClipboard } from 'react-copy-to-clipboard';

function CopyToClipboardButton({ textToCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CopyToClipboard text={textToCopy} onCopy={handleCopy}>
      <button
        className="bg-indigo-600 hover:bg-indigo-700  font-semibold rounded p-2 ml-2"
      >
        {copied ? <FiCheck size={16} /> : <FiClipboard size={16} />}
      </button>
    </CopyToClipboard>
  );
}

export default CopyToClipboardButton;
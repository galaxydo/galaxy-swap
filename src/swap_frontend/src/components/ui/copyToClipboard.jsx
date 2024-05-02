import React, { useState } from "react";
import { FiClipboard, FiCheck } from "react-icons/fi";

function CopyToClipboardButton({ textToCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-indigo-600 hover:bg-indigo-700  font-semibold rounded p-2 ml-2"
    >
      {copied ? <FiCheck size={16} /> : <FiClipboard size={16} />}
    </button>
  );
}

export default CopyToClipboardButton;

'use client';
import { CheckCheck, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 15000);
  };

  return (
    <button
      onClick={copy}
      className="px-2 py-1 ml-2 text-sm text-white bg-orange-600 rounded font-semibold
       hover:bg-orange-500 cursor-pointer"
    >
      {copied ? <CheckCheck size={17} /> : <Copy size={17} />}
    </button>
  );
}
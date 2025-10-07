'use client';

import { useState, useEffect } from 'react';
import CopyButton from './CopyButton';

export default function VaultItem({ item, onDelete }) {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="p-4 border rounded-lg hover:shadow-sm transition">
      <h3 className="font-bold text-lg">{item.title || 'Untitled'}</h3>
      
      {item.username && (
        <p className="mt-1">
          <span className="text-gray-600">Username:</span> {item.username}{' '}
          <CopyButton text={item.username} />
        </p>
      )}

      {item.password && (
        <p className="mt-1">
          <span className="text-gray-600">Password:</span> ••••••••{' '}
          <CopyButton text={item.password} />
        </p>
      )}

      {item.url && (
        <p className="mt-1">
          <span className="text-gray-600">URL:</span>{' '}
          <a
            href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {item.url}
          </a>
        </p>
      )}

      {item.notes && (
        <div className="mt-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {showNotes ? 'Hide notes' : 'Show notes'}
          </button>
          {showNotes && <p className="mt-1 bg-gray-100 p-2 rounded">{item.notes}</p>}
        </div>
      )}

      <button
        onClick={onDelete}
        className="mt-3 text-sm text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
}
import { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';

interface Props {
  inviteCode: string;
  groupName: string;
  onClose: () => void;
}

export function InviteModal({ inviteCode, groupName, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const inviteUrl = `${window.location.origin}/join/${inviteCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Invite to {groupName}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <p className="mb-4 text-sm text-gray-600">Share this link with people you want to invite:</p>
        <div className="flex items-center gap-2">
          <input type="text" readOnly value={inviteUrl}
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700" />
          <button onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-400">Invite code: {inviteCode}</p>
      </div>
    </div>
  );
}

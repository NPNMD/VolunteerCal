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
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      {/* Mobile: bottom sheet, Desktop: centered modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white p-5 shadow-2xl animate-slide-up sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:animate-fade-in"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 1.25rem)' }}>
        {/* Mobile drag handle */}
        <div className="flex justify-center pb-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Invite to {groupName}</h3>
          <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-600">Share this link with people you want to invite:</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input type="text" readOnly value={inviteUrl}
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700" />
          <button onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 active:bg-indigo-800">
            {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Link</>}
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-400">Invite code: {inviteCode}</p>
      </div>
    </>
  );
}

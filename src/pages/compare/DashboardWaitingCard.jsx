import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function DashboardWaitingCard({ invite, currentUserId, onRemove }) {
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);
  const removeTimeoutRef = useRef(null);

  const isInviter = invite.inviterId?._id === currentUserId;
  const inviterName = invite.inviterId?.username || 'You';
  const inviteeName = invite.inviteeId?.username || 'Friend';
  const primaryName = isInviter ? inviteeName : inviterName;
  const secondaryName = isInviter ? inviterName : inviteeName;

  let statusText = 'Waiting for your friend to join';
  let progress = 1;

  if (invite.status === 'accepted') {
    statusText = 'Your friend joined and the comparison is being prepared';
    progress = 2;
  } else if (invite.status === 'completed') {
    statusText = 'Comparison ready';
    progress = 3;
  }

  const handleAction = () => {
    if (invite.status === 'completed') {
      navigate(`/compare/processing/${invite.token}`);
    } else if (isInviter && progress === 1) {
      navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.token}`);
      alert('Invite link copied to clipboard!');
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    removeTimeoutRef.current = window.setTimeout(() => {
      onRemove();
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (removeTimeoutRef.current) {
        window.clearTimeout(removeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Card className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-primary/20 transition-all duration-200 ease-out ${isRemoving ? 'opacity-0 scale-[0.98]' : 'opacity-100'}`}>
      <button
        type="button"
        onClick={handleRemove}
        className="absolute top-1 right-6 text-on-surface-variant hover:text-on-surface transition-colors w-1 h-1 text-xs"
        aria-label="Remove comparison "
      >
        <span className="material-symbols-outlined text-sm cursor-pointer">close</span>
      </button>

      <div className="flex-1 pr-8">
        <h4 className="font-headline-md font-bold text-lg mb-1">{primaryName} ↔ {secondaryName}</h4>
        <p className="text-on-surface-variant text-sm mb-3">{statusText}</p>

        <div className="flex items-center gap-2 mt-3 mb-1">
          <div className={`h-2 flex-1 rounded-full ${progress >= 1 ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
          <div className={`h-2 flex-1 rounded-full ${progress >= 2 ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
          <div className={`h-2 flex-1 rounded-full ${progress >= 3 ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
        </div>

        <div className="flex justify-between text-xs font-medium text-on-surface-variant opacity-70">
          <span>Invite Sent</span>
          <span>Friend Joined</span>
          <span>Comparison Ready</span>
        </div>
      </div>

      <div>
        {progress === 3 ? (
          <Button variant="primary" onClick={handleAction}>
            View Comparison
          </Button>
        ) : (
          isInviter && progress === 1 && (
            <Button variant="secondary" onClick={handleAction}>
              Copy Link
            </Button>
          )
        )}
      </div>
    </Card>
  );
}

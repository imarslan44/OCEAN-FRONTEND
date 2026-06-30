import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function DashboardWaitingCard({ invite, currentUserId }) {
  const navigate = useNavigate();
  
  const isInviter = invite.inviterId?._id === currentUserId;
  const otherPersonName = isInviter 
    ? (invite.inviteeId?.username || 'Friend') 
    : (invite.inviterId?.username || 'Friend');

  let statusText = 'Waiting for Friend';
  let progress = 1;
  
  if (invite.status === 'accepted') {
    statusText = 'Friend Joined, Waiting for Assessment';
    progress = 2;
  } else if (invite.status === 'completed') {
    statusText = 'Comparison Ready!';
    progress = 3;
  }

  const handleAction = () => {
    if (invite.status === 'completed') {
      navigate(`/compare/processing/${invite.token}`);
    } else {
      // Just copy link again if waiting and inviter
      if (isInviter && progress === 1) {
        navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.token}`);
        alert('Invite link copied to clipboard!');
      }
    }
  };

  return (
    <Card className="flex flex-col md:flex-row items-center justify-between gap-4 border-primary/20">
      <div className="flex-1">
        <h4 className="font-headline-md font-bold text-lg mb-1">{statusText}</h4>
        
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

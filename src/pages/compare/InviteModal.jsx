import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function InviteModal({ onClose }) {
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateLink = async () => {
      try {
        const token = localStorage.getItem('ocean_token') || localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/v1/invites/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.token) {
          const origin = window.location.origin;
          setInviteLink(`${origin}/invite/${data.token}`);
        }
      } catch (err) {
        console.error('Failed to generate invite link', err);
      } finally {
        setLoading(false);
      }
    };
    generateLink();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-gutter animate-fade-in">
      <Card className="max-w-sm w-full bg-surface-container-lowest text-center space-y-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="font-headline-md text-2xl font-bold mt-2">Invite a Friend</h2>
        <p className="text-on-surface-variant text-sm">
          Copy the invite link and send it to someone you want to compare with.
        </p>

        <div className="bg-surface-container-high rounded-lg p-3 flex items-center justify-between border border-outline/10">
          <span className="truncate text-sm font-medium mr-2 opacity-80">
            {loading ? 'Generating link...' : inviteLink}
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="primary" 
            className="flex-1" 
            onClick={handleCopy}
            disabled={loading}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button 
            variant="secondary" 
            className="flex-1" 
            disabled={loading}
            onClick={() => {
                if (navigator.share) {
                    navigator.share({
                        title: 'Compare with me',
                        url: inviteLink
                    })
                } else {
                    handleCopy();
                }
            }}
          >
            Share
          </Button>
        </div>
      </Card>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function InviteLanding() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/invites/${token}`);
        if (!res.ok) {
          setError('Invite not found or expired');
          return;
        }
        const data = await res.json();
        setInvite(data.invite);
      } catch (err) {
        setError('Failed to load invite');
      }
    };
    fetchInvite();
  }, [token]);

  const handleStart = async () => {
    if (!user) {
      localStorage.setItem('ocean_redirect', `/invite/${token}`);
      navigate('/auth');
      return;
    }

    // Accept invite
    try {
      const authToken = localStorage.getItem('token') || localStorage.getItem('ocean_token');
      const res = await fetch(`http://localhost:5000/api/v1/invites/${token}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // check if user has profile
        if (user.profile?.personalityResult) {
          navigate(`/compare/processing/${token}`);
        } else {
          localStorage.setItem('ocean_redirect', `/compare/processing/${token}`);
          navigate('/test-intro');
        }
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to accept invite');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (error) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-gutter">
        <Card className="text-center">
          <h2 className="font-headline-md text-xl font-bold mb-2 text-error">Oops!</h2>
          <p className="text-on-surface-variant mb-4">{error}</p>
          <Button onClick={() => navigate('/home')}>Go to Dashboard</Button>
        </Card>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant animate-pulse">Loading invite...</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-gutter">
      <main className="max-w-md w-full space-y-stack-lg animate-fade-in text-center">
        <Card className="bg-surface-container-lowest">
          <h1 className="font-headline-md text-3xl font-bold mb-2">
            Compare with {invite.inviterId?.username || 'a friend'}
          </h1>
          <p className="text-on-surface-variant mb-6">
            You've been invited to compare behavioral profiles.
          </p>
          
          <ul className="text-left space-y-2 mb-8 text-sm">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
              Discover communication style
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
              Explore thinking differences
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
              Find shared strengths
            </li>
          </ul>

          <p className="text-xs text-on-surface-variant mb-4">Estimated time: 4-5 minutes</p>

          <Button variant="primary" onClick={handleStart} className="w-full">
            {user ? 'Unlock Your Comparison' : 'Save Your Progress'}
          </Button>
        </Card>
      </main>
    </div>
  );
}

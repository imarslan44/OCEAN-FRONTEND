import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

export default function TestResume() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasInProgress, setHasInProgress] = useState(false);

  // On mount, check for an in‑progress test
  useEffect(() => {
    const fetchInProgress = async () => {
      try {
        const token = localStorage.getItem('ocean_token');
        if (!token) {
          navigate('/auth');
          return;
        }
        const res = await fetch('/api/v1/tests/in-progress', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setHasInProgress(true);
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchInProgress();
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col items-center px-margin-mobile pt-24">
      <Card className="w-full max-w-md p-gutter md:p-stack-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/test-intro')}
            className="material-symbols-outlined text-primary !text-[24px] cursor-pointer hover:opacity-70"
            aria-label="Back to test intro"
            type="button"
          >
            close
          </button>
          <h1 className="font-headline-md text-headline-md text-center flex-1">Resume Test</h1>
          <div className="w-6" />
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-center">
          You have a test in progress. Would you like to continue where you left off or start a new test?
        </p>

        <div className="flex flex-col gap-4">
          {hasInProgress && (
            <Button variant="primary" onClick={() => navigate('/test')}>Resume Test</Button>
          )}
          <Button variant="secondary" onClick={() => navigate('/test-intro')}>Start New Test</Button>


        </div>
      </Card>

    </div>
  );
}

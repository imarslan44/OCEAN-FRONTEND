import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import CompareRadarChart from './CompareRadarChart';

export default function CompareReport() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const authToken = localStorage.getItem('token') || localStorage.getItem('ocean_token');
        const res = await fetch(`http://localhost:5000/api/v1/invites/${token}/comparison`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const result = await res.json();
        
        if (res.ok) {
          setData(result.comparison);
        } else {
          setError(result.message || 'Failed to load comparison');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant animate-pulse">Loading Report...</p>
      </div>
    );
  }

  if (error || !data) {
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

  return (
    <div className="bg-background min-h-screen pb-24 font-body-md text-on-background">
      {/* Hero Section */}
      <section className="bg-surface-container-lowest pt-16 pb-12 px-gutter border-b border-primary/5">
        <div className="max-w-container-max mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="font-headline-md text-4xl md:text-5xl font-bold">Behavioral Comparison</h1>
          
          <div className="pt-4 pb-8">
            <CompareRadarChart 
              inviterScores={data.inviter.scores}
              inviteeScores={data.invitee.scores}
              inviterName={data.inviter.name}
              inviteeName={data.invitee.name}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6">
            <div className="flex-1 max-w-xs space-y-1">
              <h3 className="font-bold text-xl">{data.inviter.name}</h3>
              <p className="font-display-sm text-primary font-semibold">{data.inviter.archetype}</p>
            </div>
            
            <div className="hidden md:flex items-center justify-center font-bold text-outline-variant text-xl">
              VS
            </div>

            <div className="flex-1 max-w-xs space-y-1">
              <h3 className="font-bold text-xl">{data.invitee.name}</h3>
              <p className="font-display-sm text-secondary font-semibold">{data.invitee.archetype}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder for AI Summary / Dynamic Insights (To be integrated later) */}
      <section className="max-w-container-max mx-auto px-gutter pt-12 space-y-stack-md text-center opacity-50">
        <p className="text-sm font-label-sm uppercase tracking-widest text-outline font-bold">Deep Insights Coming Soon</p>
        <p className="text-on-surface-variant max-w-xl mx-auto italic">
          "AI-driven dynamic descriptions comparing communication styles, decision making, strengths, and growth opportunities will be added in the next iteration."
        </p>
      </section>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-surface/80 backdrop-blur-md border-t border-outline/10 flex justify-center z-50">
        <Button onClick={() => navigate('/home')} variant="primary" className="max-w-sm w-full shadow-lg">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

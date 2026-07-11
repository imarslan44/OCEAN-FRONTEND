import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import InviteModal from './InviteModal';
import { useAuth } from '../../context/AuthContext';

export default function CompareIntro() {
  const navigate = useNavigate();
  const { user, hasCompletedTest } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!hasCompletedTest(user)) {
    return (
      <div className="bg-background min-h-screen font-body-md text-on-background flex flex-col items-center justify-center p-gutter">
        <main className="max-w-md w-full space-y-stack-lg animate-fade-in text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-high text-primary">
            <span className="material-symbols-outlined !text-[40px]">lock</span>
          </div>

          <div>
            <h1 className="font-headline-md text-3xl font-bold">Complete your profile to compare.</h1>
            <p className="mt-3 text-on-surface-variant text-lg">
              Compare needs your baseline OCEAN result first. Take the assessment, then invite someone to compare behavioral dynamics.
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <Button variant="primary" icon="quiz" onClick={() => navigate('/test-intro')} className="w-full">
              Take Test
            </Button>
            <Button variant="tertiary" onClick={() => navigate('/home')} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen font-body-md text-on-background flex flex-col items-center justify-center p-gutter">
      <main className="max-w-md w-full space-y-stack-lg animate-fade-in text-center">
        
        {/* Illustration placeholder */}
        <div className="w-full h-48 bg-surface-container-high rounded-2xl flex items-center justify-center mb-8">
           <span className="material-symbols-outlined text-[64px] text-primary/50">compare_arrows</span>
        </div>

        <h1 className="font-headline-md text-3xl font-bold">Compare Behavioral Profiles</h1>
        <p className="text-on-surface-variant text-lg">
          Discover how you and another person naturally communicate, think, solve problems, and where you may experience strengths or friction.
        </p>

        <Card variant="flat" className="text-left space-y-3 mt-6">
          <h3 className="font-bold text-lg mb-2">You will discover:</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
              Communication compatibility
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
              Shared strengths
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
              Potential friction areas
            </li>
          </ul>
        </Card>

        <div className="pt-4 flex flex-col gap-4">
          <Button variant="primary" onClick={() => setIsModalOpen(true)} className="w-full">
            Invite Friend
          </Button>
          <Button variant="tertiary" onClick={() => navigate('/home')} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </main>

      {isModalOpen && <InviteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

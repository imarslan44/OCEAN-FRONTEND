import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';

const TRAIT_LABELS = {
  O: 'OPENNESS',
  C: 'CONSCIENTIOUSNESS',
  E: 'EXTRAVERSION',
  A: 'AGREEABLENESS',
  N: 'NEUROTICISM'
};

export default function TestQuestions() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // maps questionId -> selected answer (1-5)
  const [testType, setTestType] = useState('full'); // 'full' or 'short'

  // Fetch questions on mount, then check for saved progress
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/v1/tests/questions');
        if (!res.ok) throw new Error('Failed to load questions');
        const data = await res.json();
        setQuestions(data);

        // After loading questions, check for in-progress test to resume
        if (location.state?.startNew) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('ocean_token');
        if (token) {
          try {
            const ipRes = await fetch('/api/v1/tests/in-progress', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              if (ipData.testData && Array.isArray(ipData.testData) && ipData.testData.length > 0) {
                // Restore answers
                const restored = {};
                ipData.testData.forEach(item => {
                  restored[item.questionId] = item.answer;
                });
                setAnswers(restored);
                if (ipData.testType) setTestType(ipData.testType);
                // Jump to the first unanswered question
                const firstUnanswered = data.findIndex(q => !restored[q.id]);
                if (firstUnanswered >= 0) setCurrentIndex(firstUnanswered);
                else setCurrentIndex(data.length - 1);
              }
            }
          } catch (e) {
            console.error('Could not load saved progress:', e);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Filter questions based on testType
  const activeQuestions = questions.filter(q => {
    if (testType === 'short') return q.shortTest === true;
    return true;
  });

  const currentQuestion = activeQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = activeQuestions.length > 0 
    ? Math.round((answeredCount / activeQuestions.length) * 100) 
    : 0;

  const handleSelectAnswer = (value) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // All questions answered! Proceed to calculating screen
      // Convert answers into testData format: [{ questionId, questionText, answer }]
      const testData = activeQuestions.map(q => ({
        questionId: q.id,
        questionText: q.text,
        answer: answers[q.id] || 3 // default to 3 if somehow not answered
      }));

      // Navigate to calculating with state payload
      navigate('/calculating', {
        state: {
          testType,
          testData
        }
      });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSaveAndExit = async () => {
    // Save current progress to backend
    const testData = Object.keys(answers).map(qId => {
      const q = questions.find(item => item.id === qId);
      return {
        questionId: qId,
        questionText: q ? q.text : '',
        answer: answers[qId]
      };
    });

    try {
      const token = user?.token || localStorage.getItem('ocean_token');
      const res = await fetch('/api/v1/tests/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          testType,
          testData
        })
      });
      if (res.ok) {
        alert('Progress saved successfully!');
        navigate('/test-intro');
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      console.error(err);
      alert('Could not save progress: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-[48px] text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center p-gutter">
        <h2 className="font-headline-md text-error mb-2">Error Loading Assessment</h2>
        <p className="font-body-md text-on-surface-variant mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (activeQuestions.length === 0) return null;

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="w-full sticky top-0 z-50 bg-background border-b border-primary/5">
        <div className="flex items-center justify-between px-margin-mobile py-4 max-w-container-max mx-auto w-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/test-intro')}>
            <span className="material-symbols-outlined text-primary !text-[24px]">psychology</span>
            <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">
              OCEAN
            </span>
          </div>
          <div className="flex items-center gap-gutter">
            {/* Short/Full toggle */}
            <div className="hidden sm:flex items-center bg-surface-container rounded-lg p-1 text-[12px] border border-primary/5 mr-2">
              <button 
                onClick={() => {
                  setTestType('full');
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${testType === 'full' ? 'bg-background text-primary shadow-sm' : 'text-on-surface-variant'}`}
              >
                Full (50q)
              </button>
              <button 
                onClick={() => {
                  setTestType('short');
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${testType === 'short' ? 'bg-background text-primary shadow-sm' : 'text-on-surface-variant'}`}
              >
                Short (25q)
              </button>
            </div>
            
            <span className="font-label-sm text-label-sm text-outline">
              {currentIndex + 1} / {activeQuestions.length}
            </span>
            <button 
              onClick={handleSaveAndExit}
              className="font-label-sm text-label-sm text-primary hover:opacity-70 transition-opacity cursor-pointer font-bold"
            >
              Save & Exit
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-surface-container">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </header>

      {/* Main Questionnaire Card */}
      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile py-stack-lg max-w-[640px] mx-auto w-full">
        {/* Mobile testType indicator */}
        <div className="sm:hidden mb-4 bg-surface-container px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-outline">
          {testType} test mode
        </div>

        <div className="w-full bg-surface border border-primary/10 rounded-xl p-gutter md:p-stack-lg flex flex-col gap-stack-lg shadow-sm">
          {/* Question Content */}
          <div className="text-left">
            <span className="font-label-sm text-label-sm text-outline mb-stack-sm block uppercase tracking-widest font-bold">
              {TRAIT_LABELS[currentQuestion.trait]}
            </span>
            <h1 className="font-headline-md text-headline-md text-on-surface leading-relaxed font-bold min-h-[96px]">
              {currentQuestion.text}
            </h1>
          </div>

          {/* 1-5 Scale Selection */}
          <div className="flex flex-col gap-stack-md">
            <div className="flex justify-between items-end w-full px-2">
              <span className="font-label-sm text-[11px] text-outline-variant max-w-[80px] leading-tight">
                Strongly Disagree
              </span>
              <span className="font-label-sm text-[11px] text-outline-variant max-w-[80px] text-right leading-tight">
                Strongly Agree
              </span>
            </div>
            
            <div className="flex justify-between items-center w-full relative">
              {/* Connector line behind dots */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/30 -z-10"></div>
              
              {/* Likert Buttons */}
              {[1, 2, 3, 4, 5].map((val) => {
                const isSelected = answers[currentQuestion.id] === val;
                return (
                  <button
                    key={val}
                    onClick={() => handleSelectAnswer(val)}
                    className={`scale-btn group relative flex flex-col items-center justify-center w-12 h-12 rounded-lg border transition-all cursor-pointer active:scale-95 ${
                      isSelected 
                        ? 'bg-primary border-primary text-on-primary shadow-sm' 
                        : 'border-outline-variant bg-surface text-outline hover:border-primary hover:text-primary'
                    }`}
                  >
                    <span className="font-label-sm text-label-sm font-bold">{val}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full mt-stack-lg flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 border border-primary text-primary font-label-sm text-label-sm rounded-lg hover:bg-surface-container-low transition-all active:scale-95 cursor-pointer ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className={`flex items-center gap-2 px-8 py-3 bg-primary text-on-primary font-label-sm text-label-sm rounded-lg hover:opacity-90 transition-all active:scale-95 cursor-pointer ${
              answers[currentQuestion.id] === undefined ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            {currentIndex === activeQuestions.length - 1 ? 'Finish' : 'Next'}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </main>

      {/* Zen Garden Visual Decor */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile pb-stack-lg mt-auto">
        <div className="w-full aspect-[21/9] rounded-xl overflow-hidden grayscale opacity-15 contrast-125 border border-primary/5">
          <img 
            alt="Serene Zen Garden" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWF7c8PrrYu_aX6Q5g3yyQyeA82QUBv2rlOduumtNonP9UkDyo2TVO2aZIZV3-cB3rFPH1PlcRfnl7lLlXMIddO9sKc8GSknrC9Nxwr3X4O7VcBbbXY8XMQTFCtUijMp1wpktj9kytFX_qv6HUUldzYgym2kiArOde1o4Lerwcr0UZJNyf9rzbQkOgInKFBTwMxEgy32LHEL8IwhcA6WUCgRQv7jVMcRYNdAbSkhZfeoQOgOIEMbzPrNKq1YD4Jn3o0xwb8uB3ftQ"
          />
        </div>
      </section>
    </div>
  );
}

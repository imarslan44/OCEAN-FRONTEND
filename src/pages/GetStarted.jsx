import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import Button from '../components/Button';

/* ─── Data ───────────────────────────────────────────────────── */

const TRAITS = [
  { letter: 'O', label: 'Openness',          color: '#745b00', bg: 'rgba(253,217,119,0.18)' },
  { letter: 'C', label: 'Conscientiousness', color: '#525f71', bg: 'rgba(186,200,220,0.18)' },
  { letter: 'E', label: 'Extraversion',      color: '#745b00', bg: 'rgba(253,217,119,0.18)' },
  { letter: 'A', label: 'Agreeableness',     color: '#525f71', bg: 'rgba(186,200,220,0.18)' },
  { letter: 'N', label: 'Neuroticism',       color: '#745b00', bg: 'rgba(253,217,119,0.18)' },
];

const PILLARS = [
  {
    id: 'know',
    icon: 'neurology',
    tag: 'Know Yourself',
    title: 'Your personality, mapped with science.',
    body:
      'Take the Big Five assessment — the most rigorously validated model in personality psychology. Get a detailed breakdown across 5 real psychological spectrums, not a label slapped on your forehead.',
    cta: 'Take the assessment',
    route: '/auth',
    accent: 'primary',
  },
  {
    id: 'compare',
    icon: 'compare_arrows',
    tag: 'Compare',
    title: 'Understand the people around you.',
    body:
      'Share a private invite link with anyone. Once both of you have a baseline, unlock a side-by-side comparison of your personalities — what you share, where you clash, and how to work better together.',
    cta: 'Learn more',
    route: '/auth',
    accent: 'secondary',
  },
  {
    id: 'learn',
    icon: 'auto_stories',
    tag: 'Learn',
    title: 'Build better people-reading skills.',
    body:
      'Personality knowledge is only useful when it changes how you act. Guided exercises and behavioral observation missions teach you to spot traits in real conversations, at work, and in relationships.',
    cta: 'Explore lessons',
    route: '/auth',
    accent: 'primary',
  },
];

const STEPS = [
  {
    num: '01',
    icon: 'quiz',
    title: 'Take the 8-minute test',
    body: '50 honest statements. No right answers. Just rate how much each describes you.',
  },
  {
    num: '02',
    icon: 'bar_chart',
    title: 'Get your full profile',
    body: 'See your scores across all 5 dimensions with detailed trait insights and your personality archetype.',
  },
  {
    num: '03',
    icon: 'group',
    title: 'Learn & compare',
    body: 'Unlock guided learning missions and compare your profile with people you invite — privately.',
  },
];

const DIFFERENTIATORS = [
  {
    icon: 'science',
    label: 'Research-backed',
    desc: 'The Big Five (OCEAN) is the standard in academic psychology — not a pop quiz.',
  },
  {
    icon: 'moving',
    label: 'Spectrums, not boxes',
    desc: 'You get a position on a scale, not a 4-letter code that never quite fits.',
  },
  {
    icon: 'lock',
    label: 'Private by default',
    desc: 'Your data stays yours. Comparisons only happen when you choose to share.',
  },
  {
    icon: 'school',
    label: 'Built to teach',
    desc: 'Most tests give you results and leave you there. OCEAN teaches you what to do with them.',
  },
];

/* ─── Component ─────────────────────────────────────────────── */

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* ── Header ── */}
      <header className="fixed top-0 z-50 w-full border-b border-primary/10 bg-surface/85 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-margin-mobile md:px-gutter">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
            aria-label="OCEAN home"
          >
            <span className="material-symbols-outlined text-primary !text-[24px]">psychology</span>
            <span className="font-display-lg-mobile text-display-lg-mobile font-bold tracking-tighter text-primary">
              OCEAN
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/auth')}
            className="font-label-sm text-label-sm font-semibold text-primary hover:underline"
          >
            Log In
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-container-max px-margin-mobile pb-stack-lg pt-24 md:px-gutter">

        {/* ══ HERO ══ */}
        <section className="grid grid-cols-1 items-center gap-stack-lg pt-stack-md md:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="mb-stack-sm inline-flex items-center gap-2 rounded-full border border-primary/10 bg-surface-container-low px-3 py-1.5">
              <span className="material-symbols-outlined text-secondary !text-[16px]">verified</span>
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-secondary">
                Science-backed personality intelligence
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg font-bold leading-tight text-on-surface">
              Understand yourself.{' '}
              <span style={{ color: '#745b00' }}>Understand others.</span>{' '}
              Grow with confidence.
            </h1>

            <p className="mt-stack-md max-w-lg font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              OCEAN combines the Big Five personality model with interactive learning and personalized
              insights to help you understand how people think, feel, and behave — not just who they are.
            </p>

            {/* CTAs */}
            <div className="mt-stack-lg flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" icon="arrow_forward" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
              <Button variant="secondary" icon="quiz" onClick={() => navigate('/auth')}>
                Take the Assessment
              </Button>
            </div>

            {/* Quick stats */}
            <div className="mt-stack-lg grid grid-cols-3 gap-3">
              {[['8–12 min', 'to complete'], ['50 / 25', 'questions'], ['5', 'core spectrums']].map(
                ([value, label]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-primary/10 bg-surface-container-low px-4 py-3"
                  >
                    <div className="text-xl font-bold text-primary">{value}</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">{label}</div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-primary/10 bg-surface-container-lowest">
            <img
              src={heroImage}
              alt="Abstract OCEAN personality profile visualization"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-gutter text-on-primary">
              <div className="mb-3 flex items-center gap-2 opacity-90">
                <span className="material-symbols-outlined !text-[18px]">insights</span>
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest">
                  Personality insight
                </span>
              </div>
              <p className="max-w-sm text-2xl font-bold leading-snug">
                Your profile becomes more useful when it's connected to action.
              </p>
            </div>
          </div>
        </section>

        {/* ══ WHAT IS THE BIG FIVE? ══ */}
        <section className="mt-16 border-t border-primary/10 pt-12">
          <div className="flex flex-col items-start gap-stack-lg md:flex-row md:items-center md:gap-16">
            <div className="md:w-1/2">
              <p className="mb-2 font-label-sm text-label-sm font-bold uppercase tracking-widest text-secondary">
                The Science
              </p>
              <h2 className="mb-stack-md text-3xl font-bold leading-tight text-on-surface">
                What is the Big Five?
              </h2>
              <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                The Big Five (also called OCEAN) is the most widely used personality framework in
                academic psychology. Unlike Myers-Briggs or Enneagram, it doesn't put you in a fixed
                category — it measures where you fall on{' '}
                <strong className="text-on-surface">5 independent spectrums</strong>, each capturing
                a real dimension of human behavior.
              </p>
              <p className="mt-4 font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                It predicts real outcomes — career satisfaction, relationship dynamics, stress
                responses — with decades of peer-reviewed research behind it.
              </p>
            </div>

            {/* Trait spectrum pills */}
            <div className="w-full space-y-3 md:w-1/2">
              {TRAITS.map((t, i) => (
                <div
                  key={t.letter}
                  className="flex items-center gap-4 rounded-lg border border-primary/8 bg-surface-container-low px-4 py-3"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-base font-bold"
                    style={{ background: t.bg, color: t.color }}
                  >
                    {t.letter}
                  </span>
                  <div className="flex-grow">
                    <div className="font-label-sm text-label-sm font-semibold text-on-surface">
                      {t.label}
                    </div>
                    {/* Spectrum bar */}
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-surface-container-highest overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${[72, 58, 45, 81, 33][i]}%`,
                          background: t.color,
                          opacity: 0.6,
                        }}
                      />
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-right w-8">
                    {[72, 58, 45, 81, 33][i]}%
                  </span>
                </div>
              ))}
              <p className="pt-1 font-label-sm text-label-sm text-on-surface-variant text-center opacity-60">
                ↑ Example profile — yours will look different
              </p>
            </div>
          </div>
        </section>

        {/* ══ 3 PRODUCT PILLARS ══ */}
        <section className="mt-16 border-t border-primary/10 pt-12">
          <p className="mb-2 font-label-sm text-label-sm font-bold uppercase tracking-widest text-secondary">
            What OCEAN does
          </p>
          <h2 className="mb-stack-lg max-w-xl text-3xl font-bold leading-tight text-on-surface">
            Three tools. One goal: understand yourself and others.
          </h2>

          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
            {PILLARS.map((p) => (
              <article
                key={p.id}
                className="flex flex-col rounded-lg border border-primary/10 bg-surface p-gutter hover:border-primary/20 hover:shadow-sm transition-all"
              >
                <div className="mb-stack-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary !text-[26px]">{p.icon}</span>
                  <span className="rounded-full border border-primary/10 bg-surface-container-low px-2.5 py-0.5 font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider text-xs">
                    {p.tag}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold leading-snug text-on-surface">{p.title}</h3>
                <p className="flex-grow font-body-md text-body-md leading-relaxed text-on-surface-variant">
                  {p.body}
                </p>
                <button
                  type="button"
                  onClick={() => navigate(p.route)}
                  className="mt-stack-md flex items-center gap-1 font-label-sm text-label-sm font-semibold text-primary hover:underline cursor-pointer w-fit"
                >
                  {p.cta}
                  <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section className="mt-16 border-t border-primary/10 pt-12">
          <p className="mb-2 font-label-sm text-label-sm font-bold uppercase tracking-widest text-secondary">
            The journey
          </p>
          <h2 className="mb-stack-lg max-w-xl text-3xl font-bold leading-tight text-on-surface">
            From zero to self-aware in three steps.
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col gap-3">
                {/* connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-full w-8 h-px bg-primary/15 z-0" />
                )}
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-primary/15 bg-surface-container-low text-sm font-bold text-primary">
                    {step.num}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant !text-[20px]">
                    {step.icon}
                  </span>
                </div>
                <h3 className="text-base font-bold text-on-surface">{step.title}</h3>
                <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ WHY NOT MBTI / 16P? ══ */}
        <section className="mt-16 border-t border-primary/10 pt-12">
          <p className="mb-2 font-label-sm text-label-sm font-bold uppercase tracking-widest text-secondary">
            Why OCEAN?
          </p>
          <h2 className="mb-stack-lg max-w-xl text-3xl font-bold leading-tight text-on-surface">
            More than a personality label.
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {DIFFERENTIATORS.map((d) => (
              <div
                key={d.label}
                className="rounded-lg border border-primary/10 bg-surface-container-low p-5"
              >
                <span className="material-symbols-outlined mb-3 text-primary !text-[24px]">
                  {d.icon}
                </span>
                <div className="mb-1 font-label-sm text-label-sm font-bold text-on-surface">
                  {d.label}
                </div>
                <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant text-sm">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section className="mt-16 flex flex-col items-center rounded-lg border border-primary/10 bg-surface-container-low px-gutter py-12 text-center">
          <span className="material-symbols-outlined mb-4 text-primary !text-[36px]">psychology</span>
          <h2 className="mb-3 max-w-md text-2xl font-bold text-on-surface">
            Ready to meet yourself — and understand others?
          </h2>
          <p className="mb-stack-lg max-w-sm font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
            Free to use. Private by default. No personality box required.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" icon="arrow_forward" onClick={() => navigate('/auth')}>
              Get Started — it's free
            </Button>
            <Button variant="secondary" icon="quiz" onClick={() => navigate('/auth')}>
              Take the Assessment
            </Button>
          </div>
        </section>

        {/* ── footer note ── */}
        <p className="mt-8 pb-4 text-center font-label-sm text-label-sm text-on-surface-variant opacity-50">
          Built on the Big Five model · Used in research, coaching, and therapy
        </p>

      </main>
    </div>
  );
}

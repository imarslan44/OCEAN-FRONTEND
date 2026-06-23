/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║           OCEAN INSIGHTS ENGINE — CORE MODULE v2.0               ║
 * ║                                                                   ║
 * ║  This is the psychological intelligence layer of the OCEAN app.  ║
 * ║  Every word a user reads about themselves originates here.       ║
 * ║  Handle this file like the product depends on it — it does.      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HOW THE ALGORITHM WORKS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * STEP 1 — SCORE CLASSIFICATION
 * Each trait score (0–100) maps to one of three ranges:
 *   H (High) : score >= 60
 *   M (Mid)  : score 40–59
 *   L (Low)  : score <  40
 *
 * Mid is not "average" in a dismissive sense. It means the trait
 * is context-dependent — it activates or recedes based on situation,
 * stakes, and environment. This is reframed as range and flexibility
 * in all M-range insight content, never as the absence of a trait.
 *
 * STEP 2 — INDIVIDUAL TRAIT INSIGHTS  [getTraitInsights]
 * Maps each of the 5 traits to its H/M/L range and returns a content
 * block. 5 traits × 3 ranges = 15 written content blocks. Used on
 * the individual trait breakdown screen.
 *
 * STEP 3 — COMBINATION INSIGHTS  [getCombinationInsights]
 * Generates insights for all 10 trait pairs:
 *   O+C, O+E, O+A, O+N, C+E, C+A, C+N, E+A, E+N, A+N
 * Each pair has 9 possible range combinations:
 *   HH, HM, HL, MH, MM, ML, LH, LM, LL
 * 10 pairs × 9 combinations = 90 written content blocks.
 *
 * STEP 4 — RELEVANCE RANKING
 * Each combination card gets a confidence level:
 *   - Both traits H or L (extreme)   → high confidence
 *   - One trait extreme, one Mid     → medium confidence
 *   - Both traits Mid                → low confidence
 * Confidence determines display priority:
 *   default  = 4 most relevant pairs (shown immediately on results)
 *   detailed = remaining 6 pairs (shown in an expanded/detailed view)
 *
 * The 4 default pairs are selected using trait EXTREMITY — how far
 * each trait score sits from the midpoint (50). The 3 most extreme
 * traits anchor 3 pairs; a 4th pair is added from the most extreme
 * trait paired with the 4th-ranked trait. This means the insights
 * shown first are mathematically the ones most likely to describe
 * THIS specific user accurately — not an editorially fixed list.
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CONTENT PHILOSOPHY
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Every block is written in second person, present tense.
 * Not "people with high O tend to..." but "you seek novelty...".
 * The goal is recognition, not description.
 *
 * The watch_out field is the most important field in every block.
 * It is the uncomfortable accuracy that makes someone stop scrolling
 * and screenshot the card. Lead with it in UI design — do not bury it
 * below the positive description.
 *
 * M-range content never uses the words "average" or "normal". It uses
 * "range", "context-dependent", "selective", "flexible". A mid score
 * is not a weak signal — it is evidence of behavioral range. The
 * content is written to make that feel specific and interesting,
 * not like a placeholder for "nothing notable here."
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXPORTS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * getTraitInsights(scores)       — 5 individual trait insight cards
 * getCombinationInsights(scores) — { default: [4], detailed: [6], all: [10] }
 *
 * Both accept: { O: 0-100, C: 0-100, E: 0-100, A: 0-100, N: 0-100 }
 */

"use strict";

// ─────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────

const TRAITS = ["O", "C", "E", "A", "N"];

const TRAIT_NAMES = {
  O: "Openness",
  C: "Conscientiousness",
  E: "Extraversion",
  A: "Agreeableness",
  N: "Neuroticism",
};

// Canonical pair list — always in OCEAN position order.
// Used so 'C+O' and 'O+C' always resolve to the same key.
const ALL_PAIRS = [
  "O+C", "O+E", "O+A", "O+N",
  "C+E", "C+A", "C+N",
  "E+A", "E+N",
  "A+N",
];

const HIGH = 60; // score >= 60  -> High
const LOW  = 40; // score <  40  -> Low
                 // 40–59        -> Mid


// ─────────────────────────────────────────────
// INDIVIDUAL TRAIT INSIGHTS
// 5 traits × 3 ranges = 15 blocks
// ─────────────────────────────────────────────

const TRAIT_INSIGHTS = {

  // ── OPENNESS ──────────────────────────────
  O: {
    H: {
      title: "The Open One",
      summary: "Your mind is never fully settled — and that is your greatest asset.",
      detail: "You process the world through curiosity rather than certainty. New ideas, unusual people, and unconventional experiences do not unsettle you — they pull you forward. You think in possibilities rather than procedures, and you often see connections that others miss entirely. Your imagination is not a personality quirk; it is how you actually navigate reality.",
      watch_out: "Novelty can become an end in itself. The idea excites you more than the execution, which means you sometimes collect perspectives without going deep enough in any of them. Starting is not the same as arriving.",
    },
    M: {
      title: "The Selective Curious",
      summary: "You are curious on your own terms — and those terms tend to be very specific.",
      detail: "You do not chase novelty for its own sake, but when something genuinely captures you, you go deep and stay there. You move comfortably between the familiar and the new depending on what the situation calls for — convention does not bore you and disruption does not thrill you. You evaluate both on their merits. This makes you more intellectually versatile than people who lean hard in either direction.",
      watch_out: "Your selectivity can read as disinterest to people who haven't earned your curiosity yet. You may be more engaged than you appear — which means others often underestimate what you actually know.",
    },
    L: {
      title: "The Grounded Realist",
      summary: "You live in the world as it is, not as it might be imagined to be.",
      detail: "You trust the proven over the theoretical and the concrete over the abstract. When you make a decision, it is grounded in what has actually worked before — not in what might work if circumstances were different. You are consistent and resistant to hype in a world that rewards hype constantly. People come to you when they need something real rather than something clever.",
      watch_out: "The world rewards people who adapt to change even when change feels unnecessary. Your preference for the familiar is a strength until the environment shifts and you have not moved with it.",
    },
  },

  // ── CONSCIENTIOUSNESS ─────────────────────
  C: {
    H: {
      title: "The Self-Directed",
      summary: "You do not need external pressure to perform — you generate your own.",
      detail: "You plan, structure, and follow through with a consistency most people only manage in short bursts. Deadlines feel like floors, not ceilings. You take your commitments seriously — especially the ones you make to yourself — and people have come to rely on that in ways they may not have told you directly. The trust you have built is the result of a long chain of unremarkable, kept promises.",
      watch_out: "Your internal standards are easy to quietly project onto everyone around you. The disappointment you feel in others often comes from expecting your own level of discipline from people who were simply never built that way.",
    },
    M: {
      title: "The Context-Driven",
      summary: "Your discipline is real — it just needs the right conditions to show up fully.",
      detail: "You are not undisciplined and you are not rigidly structured. Your conscientiousness activates when the stakes are high, when you genuinely care about the outcome, or when external expectations are clearly defined. In low-stakes or ambiguous situations, things drift more than they should. You are capable of remarkable, sustained focus and remarkable, sustained drift — sometimes within the same week.",
      watch_out: "The gap between what you produce when you care and what you produce on average is wider than you want to admit to yourself. The things you keep meaning to get to are not going to get to themselves.",
    },
    L: {
      title: "The Unbound",
      summary: "Structure is something that happens to other people.",
      detail: "You are spontaneous, flexible, and genuinely unbothered by unfinished things. Plans feel like constraints. You respond to what is directly in front of you rather than what you scheduled three weeks ago. Your adaptability is real — you handle unexpected situations more fluidly than most. The cost is that the things requiring sustained, unsexy, boring effort are the ones that consistently do not get done.",
      watch_out: "Freedom from structure is not the same as effectiveness. The things most worth building in a life require long stretches of unglamorous consistency. This is the gap you keep running into and calling something else.",
    },
  },

  // ── EXTRAVERSION ──────────────────────────
  E: {
    H: {
      title: "The Social Engine",
      summary: "People are not just something you tolerate — they are what you run on.",
      detail: "Social interaction does not drain you; it restores you. You think out loud, process through conversation, and feel most alive in environments with energy, movement, and people. Silence that goes on too long feels like deprivation rather than rest. You build networks effortlessly not because you are strategic about it but because you are genuinely interested in people, and people feel the difference.",
      watch_out: "Your need for social energy can make solitude feel like punishment. The inner work — the reflection that only happens alone — is something you may be systematically avoiding without realizing that is what you are doing.",
    },
    M: {
      title: "The Situational Social",
      summary: "You can work the room or leave early — depending on what the day actually requires.",
      detail: "You are not meaningfully recharged by people and not meaningfully depleted by them. Social interaction is a tool you pick up when it is useful and put down when it is not. In the right setting with the right people, you are fully engaged and energetic. In the wrong setting, you would rather be elsewhere, and you are not particularly apologetic about it. This makes you genuinely versatile in ways that hard introverts and extraverts are not.",
      watch_out: "Your adaptability can read as inconsistency. People never quite know which version of you is going to show up, and that unpredictability — however reasonable to you — can make you harder to count on in settings that require sustained social energy.",
    },
    L: {
      title: "The Internal World",
      summary: "You live more richly inside your own head than most people realize or ever get to see.",
      detail: "Solitude is not something you endure — it is something you actively need. Your best thinking happens alone. Deep, one-on-one conversations carry more meaning than any social gathering, and the people who earn your full attention receive something most others never access. You are not shy and you are not antisocial. You are preserving something specific and choosing carefully who gets it.",
      watch_out: "The inner world can become a substitute for the outer one. Your clearest thinking and your most honest insights are only useful if they eventually find their way out of you and into the world.",
    },
  },

  // ── AGREEABLENESS ─────────────────────────
  A: {
    H: {
      title: "The Natural Ally",
      summary: "People feel safer around you — and that is not an accident.",
      detail: "You are attuned to others in a way that is not performative or strategic. You notice when someone is uncomfortable before they say anything. You defer when deference genuinely matters and push back when pushing is what someone actually needs to hear. Conflict carries a real emotional cost for you — not because you are weak, but because you experience the relational damage it does and that damage feels real.",
      watch_out: "Your care for others can quietly become a mechanism for sidestepping your own needs and opinions. The most agreeable person in most rooms is often also the least known. People like you without necessarily understanding you.",
    },
    M: {
      title: "The Selective Cooperator",
      summary: "You are warm when it earns something and firm when it costs something.",
      detail: "You do not default to either harmony or confrontation — you read situations and choose your approach deliberately. With people you trust or around causes you care about, you are patient, genuinely collaborative, and invested in the outcome for everyone. In situations that have not earned that from you, you are direct, efficient, and comfortable leaving some tension unresolved. People who know you well understand this. People who do not may find it inconsistent.",
      watch_out: "Your selectivity about who receives your warmth can be experienced as coldness by people who have not yet earned their way in. First impressions may be costing you relationships that would have been worth having.",
    },
    L: {
      title: "The Straight Line",
      summary: "You say what you think, and you do not spend much energy softening the landing.",
      detail: "Social friction does not cost you the way it costs others. You are direct, competitive when the situation calls for it, and comfortable leaving conversations in a state of productive disagreement. You prioritize getting to the accurate answer over making sure everyone feels good on the way there. This makes you highly effective in environments that reward clarity and genuinely difficult in ones that require ongoing diplomacy.",
      watch_out: "Not every situation is improved by maximum honesty delivered without packaging. Landing a difficult truth well is an entirely separate skill from being willing to say it — and the second without the first often costs more than silence would have.",
    },
  },

  // ── NEUROTICISM ───────────────────────────
  N: {
    H: {
      title: "The Deep Feeler",
      summary: "Your emotional world is loud, complex, and usually one step ahead of your reasoning.",
      detail: "You feel things before you process them, and processing takes real time. Stress registers fast and recovery is not quick. You notice emotional undercurrents in situations that other people walk through without sensing anything. This gives you genuine psychological depth — a capacity to understand suffering, complexity, and nuance that not everyone can access. The cost is that you carry more than you need to, for longer than is actually useful.",
      watch_out: "Feeling deeply is not the same as seeing clearly. Some of what your nervous system presents as insight is pattern-matching under stress. Not every dark interpretation of a situation is the accurate one, even when it feels irrefutable.",
    },
    M: {
      title: "The Responsive One",
      summary: "You feel things, recover from them, and move forward — mostly on schedule.",
      detail: "You are not immune to stress and you are not overwhelmed by it. You have emotional responses to difficulty that are real, proportionate, and do not tend to spiral. You worry sometimes without it taking over. You feel pressure without it becoming crisis. Most people who know you would describe you as steady — which is accurate, but it also means your emotional signals sometimes get managed before they get heard.",
      watch_out: "Being functionally stable can become a habit of processing emotions quickly rather than fully. Not everything that needs to be felt should be handled quietly and moved past. Some things deserve more room than you give them.",
    },
    L: {
      title: "The Unshakeable",
      summary: "While others spiral, you recalibrate.",
      detail: "Stress does not accumulate in you the way it does in most people. You process setbacks as problems to solve rather than as evidence that something is fundamentally wrong. Emotional volatility in your environment does not destabilize you — you are often the reference point others use to regulate themselves without telling you that is what they are doing. You recover quickly, move on completely, and rarely carry yesterday into today.",
      watch_out: "Your stability can look like indifference to people who need more from a moment than you tend to give it. Your inability to be rattled is a genuine asset that sometimes reads, to people who feel things more intensely, as a lack of care.",
    },
  },
};


// ─────────────────────────────────────────────
// COMBINATION INSIGHTS
// 10 pairs × 9 range combinations = 90 blocks
// ─────────────────────────────────────────────

const COMBINATION_INSIGHTS = {

  // ══════════════════════════════════════════
  // O + C — Openness × Conscientiousness
  // The execution axis: imagination vs discipline
  // ══════════════════════════════════════════
  "O+C": {
    HH: {
      title: "The Rare Innovator",
      summary: "You generate ideas that are worth pursuing — and you actually pursue them.",
      detail: "High Openness floods you with imagination. High Conscientiousness means you have the structure to channel it. This is the rarest combination in creative work — most people have one without the other. You can conceive something original and then do the unglamorous work of making it real. Teams built around you tend to produce things that neither over-cautious nor undisciplined teams ever manage.",
      watch_out: "Your ability to both imagine and execute can become a trap: you overcommit to too many things because you genuinely believe you can finish all of them. You probably cannot. Saying no early is a skill this combination rarely develops on its own.",
    },
    HM: {
      title: "The Inspired Builder",
      summary: "Your discipline shows up when you actually care — and when you care, the output is exceptional.",
      detail: "You are highly imaginative and selectively disciplined. When a project genuinely engages you, structure appears almost automatically — you plan, you execute, you see it through. When it does not engage you, things drift. The quality gap between work you care about and work you are indifferent to is noticeable, to you and to anyone paying attention.",
      watch_out: "You have learned to work on things you find interesting. You have not yet fully solved the problem of doing necessary, uninteresting work consistently. That gap will cost you at some point — and probably already has.",
    },
    HL: {
      title: "The Scattered Visionary",
      summary: "The gap between what you imagine and what you finish is the central tension of your productive life.",
      detail: "High Openness gives you a mind that generates faster than most people can follow. Low Conscientiousness means that generation rarely ends in completion. You are most effective in environments where someone else handles execution — or where external deadlines and accountability structures create the pressure your internal discipline does not. Alone, with no deadline, your best ideas often stay in the planning phase indefinitely.",
      watch_out: "Starting things has quietly become a substitute for finishing them. The feeling of beginning a new project is real and energizing. The feeling of being halfway through an old one is the thing you keep escaping by starting something new.",
    },
    MH: {
      title: "The Methodical Improver",
      summary: "You do not need to reinvent anything — you just make everything you touch measurably better.",
      detail: "Your Openness is selective rather than constant, which means you are not chasing novelty for its own sake. Your high Conscientiousness means that when you do decide something needs to change, you apply real structure to improving it. You are the person who takes an existing process and makes it 30% better in ways no one else noticed were possible. Steady, reliable, and underestimated until the results land.",
      watch_out: "Your comfort with existing frameworks can mean you optimize things that should be replaced entirely. Incremental improvement is valuable — it is also sometimes a sophisticated way of avoiding more disruptive but necessary change.",
    },
    MM: {
      title: "The Adaptable Contributor",
      summary: "You move between structure and freedom depending on what the moment asks — and that flexibility is genuinely useful.",
      detail: "Neither trait is pulling hard in either direction. Your curiosity surfaces selectively, your discipline shows up when stakes are clear. You are not the most creative person in most rooms and not the most structured, but you function effectively in both creative and operational contexts without significant friction. In environments that shift between modes, this is a real advantage.",
      watch_out: "Versatility without a strong direction of your own can mean you become whoever the current environment needs. Make sure the flexibility you have is a choice and not a default.",
    },
    ML: {
      title: "The Mild Wanderer",
      summary: "You are curious enough to explore but not structured enough to arrive anywhere specific.",
      detail: "You have genuine intellectual curiosity — you find things interesting, you read widely, you engage with ideas when they come to you. But Low Conscientiousness means that curiosity rarely converts into sustained effort toward anything in particular. You accumulate starting points. Completion requires a kind of sustained, boring commitment that does not currently come naturally to you.",
      watch_out: "Interesting is not the same as useful. The curiosity you have is real and worth keeping. The part where it needs to turn into something requires a structure you have not yet built for yourself.",
    },
    LH: {
      title: "The Reliable Executor",
      summary: "You do not need to reinvent anything — you need it done correctly, and you make sure it is.",
      detail: "Low Openness means you are not driven by novelty or drawn to experimentation. High Conscientiousness means you apply real discipline and rigor to doing existing things well. You are the backbone of every functional team you have ever been on — the person who can be trusted to execute without drama, without deviation, and without needing to make it interesting first. Results follow you reliably.",
      watch_out: "When the environment changes, your preference for proven methods becomes a liability. Reliability is only valuable as long as what you are reliably doing still applies to the problem in front of you.",
    },
    LM: {
      title: "The Comfortable Conventional",
      summary: "Familiar ground, moderate effort, sustainable pace — and no particular interest in changing that.",
      detail: "You prefer the known and you apply moderate structure to navigating it. You are not driven by ambition in either creative or organizational terms. You work at a pace that is maintainable long-term and in patterns that do not require much energy to sustain. Stable, consistent, and disinclined to rock anything that is not visibly broken.",
      watch_out: "Comfort and growth rarely share the same space. Make sure the pace you have settled into is actually what you want and not simply what requires the least effort to maintain.",
    },
    LL: {
      title: "The Still Point",
      summary: "Neither creativity nor discipline is pulling you anywhere in particular — and you are at peace with that.",
      detail: "Low Openness means you are not restless for novelty. Low Conscientiousness means you are not driven by goals or output. You exist in a quiet, stable equilibrium. This is sustainable and often underrated in a culture that rewards constant striving. The question is whether the stillness is chosen or simply the path of least resistance.",
      watch_out: "There is a version of this combination that is contentment and a version that is stagnation. They can feel identical from the inside for a long time.",
    },
  },

  // ══════════════════════════════════════════
  // O + E — Openness × Extraversion
  // The stimulation axis: where energy and curiosity meet
  // ══════════════════════════════════════════
  "O+E": {
    HH: {
      title: "The Idea Hunter",
      summary: "You need both intellectual stimulation and human energy — and you go looking for both simultaneously.",
      detail: "High Openness means you are constantly in search of the next interesting idea, perspective, or experience. High Extraversion means you pursue that search through people — conversations are where you think, learn, and feel alive. You are energized by environments that combine intellectual richness with social energy. Parties where no one talks about anything interesting drain you more than silence would.",
      watch_out: "Depth gets traded for breadth. You sample many ideas and many people, but mastery — of an idea, of a relationship — requires a kind of sustained, unsocial attention that does not come naturally to this combination.",
    },
    HM: {
      title: "The Thoughtful Socializer",
      summary: "You enjoy people, but only when the conversation goes somewhere worth going.",
      detail: "High Openness means your intellectual appetite is real and demanding. Moderate Extraversion means you have genuine social energy but you deploy it selectively — you are not trying to be in every room. When the intellectual and social overlap — when you find a person who thinks in interesting ways — you go deep quickly. Surface-level social interaction provides much less of what you are actually after.",
      watch_out: "Your standards for what makes social interaction worth having are high enough that you may be opting out of relationships that would have developed into something meaningful if you had stayed longer in the shallow end.",
    },
    HL: {
      title: "The Solitary Explorer",
      summary: "Your richest experiences happen inside your own head, and you have made your peace with that.",
      detail: "High Openness gives you a mind that runs continuously on ideas, connections, and abstract possibilities. Low Extraversion means you process all of it alone. You read, you think, you write — not because you are performing intellectualism but because this is genuinely how your mind works when left to itself. The inner world is not a retreat; it is your natural habitat.",
      watch_out: "Ideas that stay internal do not change anything. Your clearest thinking is only useful to the degree that it eventually connects with other people or the world outside your own head. Find the minimum viable exit for your ideas.",
    },
    MH: {
      title: "The Engaged Traditional",
      summary: "You are energized by people and social situations — the intellectual frontier is less of a draw.",
      detail: "High Extraversion gives you genuine social energy — you seek people, you feel restored by group environments, and you are often at the center of social momentum. Moderate Openness means you are not particularly driven by unconventional ideas or intellectual experimentation. You connect through shared experiences, familiar references, and existing common ground more than through the exploration of new territory.",
      watch_out: "Strong social intelligence without genuine intellectual curiosity can make you brilliant at reading rooms and thin on anything distinctive to contribute to them. The ideas you bring to conversations matter as much as how well you read them.",
    },
    MM: {
      title: "The Versatile Middle",
      summary: "You adapt to both social and solitary environments without paying a significant cost in either direction.",
      detail: "Neither trait is dominant, which means you are neither pulled strongly toward people nor toward solitude, neither toward novelty nor toward convention. You can collaborate or work alone. You can engage in intellectual conversations or skip them. This flexibility is practically useful in environments that shift between modes — which most environments do.",
      watch_out: "Adaptability without a strong personal direction can mean you reflect whatever environment you are currently in. Make sure the flexibility is serving something you actually want, not just making you easy to be around.",
    },
    ML: {
      title: "The Quiet Drifter",
      summary: "Neither ideas nor people pull hard at you — and you have built a quiet life around that.",
      detail: "You are not particularly driven by intellectual curiosity and not particularly energized by social engagement. You function well in both settings without being drawn to either. You are reliable, consistent, and unbothered by the things that occupy other people's ambitions. This is a stable way to exist. It is not a high-output one.",
      watch_out: "The absence of a strong pull in any direction is comfortable right up until the moment you notice you have not been anywhere in a while.",
    },
    LH: {
      title: "The Social Traditionalist",
      summary: "You thrive in social settings — as long as they stay on familiar, comfortable ground.",
      detail: "Low Openness means you are most comfortable in social situations that follow predictable patterns and involve shared conventional references. High Extraversion means you seek those situations out actively and feel genuinely restored by them. You connect through laughter, shared history, and common ground. Ideas that disrupt the expected course of a conversation are likely to leave you less interested rather than more.",
      watch_out: "Social energy is only part of what makes relationships sustaining over the long term. Without the dimension of genuine intellectual engagement, some of your connections may stay more surface-level than you realize.",
    },
    LM: {
      title: "The Reserved Conventional",
      summary: "Conventional in thought, moderate in social energy — self-contained and unhurried.",
      detail: "You do not seek novelty and you do not seek crowds. You have a moderate social appetite that you satisfy without drama and a conventional worldview you see no particular reason to challenge. You are stable, predictable in the best sense, and very easy to be around for people who are not looking for intellectual disruption or social intensity.",
      watch_out: "There is a version of this combination that is genuine contentment and a version that is a fairly quiet kind of boredom. It takes honesty to distinguish between them from the inside.",
    },
    LL: {
      title: "The Solitary Minimalist",
      summary: "You need neither novelty nor people to feel complete — and that is rarer than it sounds.",
      detail: "Low Openness means you are not restless for new ideas or experiences. Low Extraversion means solitude is not a deprivation — it is your preferred state. You are genuinely self-sufficient in a way most people describe as a goal but rarely achieve. The internal and external noise that occupies most people simply does not find much purchase in you.",
      watch_out: "Self-sufficiency that goes unchecked can become a kind of enclosure. The question worth occasionally asking is whether you are living small by choice or by habit.",
    },
  },

  // ══════════════════════════════════════════
  // O + A — Openness × Agreeableness
  // The engagement axis: how curiosity meets people
  // ══════════════════════════════════════════
  "O+A": {
    HH: {
      title: "The Empathetic Intellectual",
      summary: "You are as curious about people as you are about ideas — and that combination is genuinely rare.",
      detail: "High Openness makes you intellectually hungry and comfortable with complexity. High Agreeableness means that curiosity extends naturally into people — you want to understand others, not debate them. You build trust quickly because people sense that your interest in them is not strategic. This is the most common profile among therapists, teachers, ethnographers, and writers who are actually good at their work.",
      watch_out: "You can agree your way out of your own opinion. Not every perspective deserves equal weight, and your genuine interest in other people's views can cause you to defer when you should push back. Your opinion in the room matters.",
    },
    HM: {
      title: "The Selective Connector",
      summary: "You engage warmly and deeply — but only when the intellectual connection gives you something to work with.",
      detail: "High Openness means your curiosity is real and demanding. Moderate Agreeableness means you deploy warmth selectively — you are not trying to be everyone's ally. When intellectual and interpersonal interest align — when you find someone who thinks in ways you find genuinely interesting — you invest deeply and the relationship tends to be unusually rich. When the intellectual connection is absent, the warmth follows shortly after.",
      watch_out: "People who do not immediately engage your curiosity may not get the version of you that would have kept them. Some relationships that would have mattered needed more patience in the early stages than this combination tends to give.",
    },
    HL: {
      title: "The Intellectual Provocateur",
      summary: "You challenge ideas and the people who hold them — and you are not particularly apologetic about it.",
      detail: "High Openness makes you intellectually hungry and drawn to ideas that push limits. Low Agreeableness means you engage with those ideas combatively — you look for the flaw, the hidden assumption, the thing no one has said yet. You are not trying to upset people; you are trying to reach accurate conclusions. Most people experience this as confrontational regardless of your intention.",
      watch_out: "Being right and being useful are distinct skills, and this combination often develops the first while underinvesting in the second. Landing a difficult truth well requires craft that your natural directness can skip.",
    },
    MH: {
      title: "The Curious Cooperator",
      summary: "You are warm, genuinely easy to work with, and more intellectually curious than you tend to let on.",
      detail: "High Agreeableness makes you collaborative, attuned, and oriented toward group harmony. Moderate Openness means there is real curiosity underneath — you notice things, engage with ideas, and occasionally bring perspectives that surprise people who had categorized you as primarily a team player. You are more interesting than your agreeableness sometimes allows to surface.",
      watch_out: "Warmth is easy for you in a way that can quietly suppress the sharper, more interesting things you actually think. Make sure your agreeableness is not consistently editing out your most valuable observations.",
    },
    MM: {
      title: "The Balanced Adapter",
      summary: "You move between intellectual engagement and social warmth as situations require — comfortably and without friction.",
      detail: "Neither trait dominates, which gives you range. You can engage ideas critically when that is useful and cooperate warmly when that is what the moment asks. You do not have a strong default orientation toward either intellectual combat or social harmony. This makes you functional in a wide range of contexts and genuinely pleasant to work with in most of them.",
      watch_out: "The same flexibility that makes you broadly functional can mean you never go deep enough in either direction to be exceptional. Know which mode to prioritize and when.",
    },
    ML: {
      title: "The Independent Realist",
      summary: "You have real curiosity and you do not particularly soften it for anyone's comfort.",
      detail: "Moderate Openness means your intellectual curiosity surfaces selectively and specifically. Low Agreeableness means when it does surface, you do not adjust the delivery for social palatability. You say what you find interesting, you challenge what you find unconvincing, and you do not invest heavily in managing how that lands. You are an acquired taste that not everyone has the time or inclination to acquire.",
      watch_out: "Directness without warmth narrows the audience for your ideas to people who already have the patience for you. That is a smaller group than your ideas probably deserve.",
    },
    LH: {
      title: "The Steady Teammate",
      summary: "Reliable, warm, and happiest when things stay on familiar and cooperative ground.",
      detail: "Low Openness means you are most comfortable in environments that do not require you to engage with radical ideas or disruptive change. High Agreeableness means you navigate those environments with genuine care for the people around you. You are the person teams depend on not for innovation but for stability — for showing up, doing the work, and keeping the interpersonal environment functional.",
      watch_out: "Teams that run on stability alone eventually need someone to say the uncomfortable thing. You are often the person best positioned to say it because everyone trusts you — but your agreeableness makes it genuinely costly to do.",
    },
    LM: {
      title: "The Pragmatic Individual",
      summary: "Conventional thinking, moderate warmth, and no particular interest in being otherwise.",
      detail: "Low Openness means you trust what is proven and do not go looking for disruption. Moderate Agreeableness means you can work with people without significant friction but you are not particularly invested in managing their emotional experience of you. You are consistent, predictable, and self-contained in a way that makes you genuinely easy to rely on in most practical contexts.",
      watch_out: "Predictability is useful right up until the point where someone mistakes it for a lack of depth. There is more going on inside than this combination tends to put on display.",
    },
    LL: {
      title: "The Firm Pragmatist",
      summary: "Set in your ways, direct in your manner, and not particularly interested in accommodating either.",
      detail: "Low Openness means you are not drawn to new ideas or different approaches. Low Agreeableness means you do not adjust your behavior for others' comfort. You have strong, settled views about how things should be done and limited patience for people who do them differently. You work best with full autonomy in environments with clear, shared expectations that do not require frequent renegotiation.",
      watch_out: "Autonomy is only fully available to people whose output earns it. And most meaningful work, at some stage, requires navigating people whose perspectives you find inconvenient.",
    },
  },

  // ══════════════════════════════════════════
  // O + N — Openness × Neuroticism
  // The depth axis: curiosity meets emotional intensity
  // ══════════════════════════════════════════
  "O+N": {
    HH: {
      title: "The Depth Seeker",
      summary: "You feel everything deeply and think about it even more deeply — sometimes in the same breath.",
      detail: "High Openness draws you toward complexity, abstraction, and the edges of conventional thought. High Neuroticism means your inner life is correspondingly loud — rich, anxious, prone to rumination, and never fully quiet. You turn ideas over long after other people have moved on. Art, philosophy, and psychology are not interests for you; they are the closest thing to a native language.",
      watch_out: "Rumination disguises itself as reflection with enough frequency that distinguishing between them becomes a skill this combination needs to actively develop. Know when you have stopped thinking and started looping.",
    },
    HM: {
      title: "The Reflective Explorer",
      summary: "You go deep on ideas and carry some of the emotional weight of that — but you do not drown in it.",
      detail: "High Openness keeps your mind active, curious, and drawn to complexity. Moderate Neuroticism means you have real emotional responses to what you encounter intellectually and interpersonally — you feel things — but those responses do not consistently spiral into something that overrides your functioning. You have depth without being consumed by it, most of the time.",
      watch_out: "The moderation in your neuroticism is not structural — it is contextual. Under enough stress or in the right circumstances, the rumination can become more than moderate. Do not be surprised by that when it happens.",
    },
    HL: {
      title: "The Grounded Explorer",
      summary: "You pursue ideas wherever they lead without paying a heavy emotional price for the journey.",
      detail: "High Openness means your mind is always moving — toward new questions, new frameworks, new ways of understanding familiar things. Low Neuroticism means that movement does not produce anxiety or existential unsettledness. You can sit with ambiguity, engage with uncomfortable ideas, and change your mind without it costing you emotionally. This is a genuinely rare and adaptive combination.",
      watch_out: "Your ease with intellectual uncertainty can read as indifference to people who experience the same ideas as genuinely threatening. Not everyone processes novelty the way you do, and missing that gap has relational costs.",
    },
    MH: {
      title: "The Worried Adapter",
      summary: "You feel the emotional weight of situations without having the intellectual curiosity to reframe them.",
      detail: "Moderate Openness means you do not have a strong pull toward new frameworks or unconventional ways of seeing difficult situations. High Neuroticism means those situations carry significant emotional weight. The tools that help some people process anxiety — reframing, finding the interesting angle, sitting with uncertainty — do not come as naturally to you, which means you carry stress more directly.",
      watch_out: "Building a small vocabulary for reframing difficult situations is not optional for this combination — it is maintenance. Without it, your emotional reactivity does not have anywhere to go.",
    },
    MM: {
      title: "The Even Pragmatist",
      summary: "You process the world at face value, without strong pulls toward either intellectual depth or emotional intensity.",
      detail: "Neither trait is dominant, which means you engage with ideas when they come to you without going out of your way to seek them, and you respond to stress without it becoming significantly disruptive. You are functional, consistent, and steady in a way that requires very little maintenance. The world does not particularly unsettle you and you are not particularly trying to unsettle it.",
      watch_out: "There is a version of this combination where life is genuinely good and you know it. There is also a version where things feel fine because you have not asked them to be anything more. The difference is worth examining.",
    },
    ML: {
      title: "The Curious Stable",
      summary: "You wander intellectually without accumulating emotional weight from the wandering.",
      detail: "Moderate Openness means you have real intellectual interests that surface selectively. Low Neuroticism means engaging with complex or challenging ideas does not destabilize you emotionally. You can pick up a difficult idea, turn it over, engage with it genuinely, and put it back down without bringing any of it home in your body. A quietly useful way to exist.",
      watch_out: "Stability can mean you engage with ideas intellectually without fully feeling their implications. Some things deserve to cost something — that cost is part of understanding them.",
    },
    LH: {
      title: "The Anxious Conventionalist",
      summary: "You worry within familiar territory — and anything that threatens to move you out of it amplifies that worry significantly.",
      detail: "Low Openness means you are most comfortable in the familiar and feel genuinely unsettled by change or novelty. High Neuroticism amplifies that discomfort — unfamiliar situations do not register as interesting, they register as threatening. You function well in stable, predictable environments with clear expectations and are genuinely costly to place in environments that lack those things.",
      watch_out: "Some of what feels like a threat to you is simply unfamiliar. The gap between those two categories is worth learning to identify, because conflating them limits your range significantly.",
    },
    LM: {
      title: "The Settled Pragmatist",
      summary: "Conventional in approach, moderate in emotional response, and comfortable with the life that produces.",
      detail: "Low Openness means you trust what works and see no particular reason to complicate it. Moderate Neuroticism means you respond to difficulty with some emotional weight but do not tend to spiral. You are stable in a conventional sort of way — not searching for anything, not particularly troubled by anything, doing the thing in front of you.",
      watch_out: "Settled is not the same as finished. Make sure the groundedness is genuine and not the feeling you get when you stop looking at things that might require a different answer.",
    },
    LL: {
      title: "The Even-Keeled Realist",
      summary: "Low drama, low disruption, high consistency — and genuinely uninterested in any of the alternatives.",
      detail: "Low Openness means you do not seek novelty or engage with abstraction for its own sake. Low Neuroticism means you do not carry significant emotional weight from what happens to you. You take what comes, deal with it practically, and move on. In environments that reward stability and reliability, this combination is an asset. In environments that reward creativity or emotional range, it reads as flat.",
      watch_out: "Even-keeled can become emotionally unavailable without you noticing the transition. The people close to you may be experiencing a consistency that occasionally looks like absence.",
    },
  },

  // ══════════════════════════════════════════
  // C + E — Conscientiousness × Extraversion
  // The output axis: how effort meets visibility
  // ══════════════════════════════════════════
  "C+E": {
    HH: {
      title: "The Natural Leader",
      summary: "You get things done — and you make other people want to get things done too.",
      detail: "High Conscientiousness gives you the organization, reliability, and follow-through to execute consistently. High Extraversion means you project that energy outward — you communicate clearly, build momentum through people, and are often at the front of whatever is moving. This is the most common profile in functional leadership. The trust you build comes from delivering on what you say in settings where people can see you doing it.",
      watch_out: "Not everyone operates at your pace or with your level of visible engagement. Your impatience with people who take longer or work more quietly can cost you access to contributions you would have found valuable if you had waited for them.",
    },
    HM: {
      title: "The Productive Professional",
      summary: "Disciplined output, selective social energy — you produce reliably without needing an audience for it.",
      detail: "High Conscientiousness gives you the internal structure to execute consistently. Moderate Extraversion means you engage socially when the context calls for it without depending on social environments to stay motivated. You can collaborate effectively and you can work alone effectively. The output does not change much based on who is watching, which is a more functional relationship with work than most people have.",
      watch_out: "The combination of reliable output and moderate social investment means you may be systematically underrepresented in the rooms where decisions about your work get made. Visibility requires more deliberate effort than this combination tends to generate naturally.",
    },
    HL: {
      title: "The Focused Executor",
      summary: "You deliver — consistently, correctly, and without requiring anyone to watch you do it.",
      detail: "High Conscientiousness gives you the structure, discipline, and follow-through to produce reliably. Low Extraversion means you do your best work alone, with deep focus and minimal interruption. You are the person who produces something extraordinary in a quiet room and then puts it on the table without ceremony. Often underestimated until the results arrive. Often correctly estimated after that.",
      watch_out: "Visibility matters for career growth whether you believe it should or not. Delivering quietly has a ceiling. At some point the work requires you to put yourself in a room you did not need to be in and say something you did not need to say.",
    },
    MH: {
      title: "The Energetic Connector",
      summary: "You bring social energy and momentum — the follow-through depends on how much you care.",
      detail: "High Extraversion makes you a natural connector — you bring energy, generate enthusiasm, and build the social momentum that makes collaborative work feel worth doing. Moderate Conscientiousness means your follow-through is uneven: strong when the stakes are clear and the work feels meaningful, inconsistent when it does not. People enjoy working with you before they have seen enough of your track record.",
      watch_out: "Charisma without reliability is a credit account with a limit. The goodwill you build through social energy gets spent every time something you said you would do does not materialize.",
    },
    MM: {
      title: "The Functional Contributor",
      summary: "You contribute reliably in both work output and team engagement — without standing out in either.",
      detail: "Neither trait pulls hard in any direction. You work at a moderate pace, engage with people when the context calls for it, and deliver without drama or distinction. Consistent and unremarkable in the best sense — low maintenance, low friction, reasonable output. In environments that need reliable contributors more than stars, this is genuinely valuable.",
      watch_out: "There is a version of this combination that is contentment with a sustainable pace, and a version that is the absence of ambition. They can feel identical until circumstances require you to distinguish between them.",
    },
    ML: {
      title: "The Quiet Contributor",
      summary: "Moderate output, low profile — you do your work and do not particularly need anyone to notice.",
      detail: "Moderate Conscientiousness means your work is adequate and sometimes better than that when you care. Low Extraversion means you do that work without social fanfare or visible engagement. You are self-contained, consistent, and probably underutilized in environments that require visible participation to earn influence. Your contributions are real. They are also frequently invisible.",
      watch_out: "In most organizational environments, contribution that goes unseen goes unrewarded. This is not how things should work. It is how they do work. Adjusting for that is a skill, not a compromise.",
    },
    LH: {
      title: "The Social Starter",
      summary: "You bring energy, enthusiasm, and momentum — and significantly fewer finished projects.",
      detail: "High Extraversion gives you social magnetism, the ability to generate excitement and build group momentum quickly. Low Conscientiousness means that momentum rarely sustains itself through the unglamorous middle stages of any project. You are at your best at the beginning and at the launch. The sustained, solo, unsexy work of completion is genuinely difficult for you.",
      watch_out: "Starting things is the most visible and enjoyable part of most projects. It is also the least valuable part if nothing gets finished. The people who depend on you have noticed the pattern even if you have not named it yet.",
    },
    LM: {
      title: "The Casual Connector",
      summary: "Loosely structured, moderately social — moving through environments without strong friction or strong impact.",
      detail: "Low Conscientiousness means structure and goal-orientation do not drive your behavior. Moderate Extraversion means you have some genuine social interest without being dependent on it. You participate in social environments comfortably without dominating them. You get things done eventually, without urgency, and usually with a relaxed affect that others either find reassuring or underestimating.",
      watch_out: "The relaxed pace you maintain is sustainable until it is not. Know the difference between choosing ease and drifting into it.",
    },
    LL: {
      title: "The Quiet Drifter",
      summary: "Low output, low visibility, low friction — and not particularly troubled by any of it.",
      detail: "Low Conscientiousness means sustained effort toward goals does not come naturally. Low Extraversion means you do not seek the social environments that might create external motivation for that effort. You operate in a relatively self-contained, low-output equilibrium. Stable and largely invisible in most organizational contexts. The question is whether that invisibility is chosen or accumulated.",
      watch_out: "Stability and stagnation can share the same address for a long time. The clearest sign you are in the second is that you cannot clearly articulate what you are moving toward.",
    },
  },

  // ══════════════════════════════════════════
  // C + A — Conscientiousness × Agreeableness
  // The team axis: how discipline meets people
  // ══════════════════════════════════════════
  "C+A": {
    HH: {
      title: "The Trusted Teammate",
      summary: "You deliver on your commitments and people genuinely like working with you — in that order.",
      detail: "High Conscientiousness means your follow-through is real and consistent. High Agreeableness means the way you work with people is warm, collaborative, and attuned. You do not run over people to hit targets and you do not sacrifice targets to manage feelings. Teams built around this profile are the most stable and most consistently functional. The trust you have built is the kind that accumulates without you actively trying to build it.",
      watch_out: "Being a reliable team player in environments that do not reciprocate can mean you absorb other people's unfinished work indefinitely. Know where your responsibility ends and where other people's begins.",
    },
    HM: {
      title: "The Reliable Professional",
      summary: "You consistently deliver and you work with people reasonably well — without needing everyone to like you.",
      detail: "High Conscientiousness means your output is reliable and your commitments are kept. Moderate Agreeableness means you work with people functionally without investing heavily in managing the social temperature. You are pleasant enough, direct when you need to be, and not particularly focused on whether people enjoy working with you as long as the work is getting done well.",
      watch_out: "Adequate social investment in professional settings leaves you functional but unlikely to build the kind of trust that creates real influence. Relationships are infrastructure. This combination tends to underinvest in it.",
    },
    HL: {
      title: "The Results Machine",
      summary: "Your output is undeniable. The relational cost is something you notice after the fact.",
      detail: "High Conscientiousness drives you toward targets, standards, and completion with real force. Low Agreeableness means you do not soften your approach for others' emotional comfort along the way. You are effective in ways that leave friction behind. People respect your work and find you difficult. Both of those things tend to be accurate simultaneously.",
      watch_out: "Results without relationships have a hard ceiling in almost every environment. The collaboration you bypass today becomes the support you cannot access when you need it.",
    },
    MH: {
      title: "The Cooperative Contributor",
      summary: "Warm, easy to work with, and reliably adequate — the backbone of most functional teams.",
      detail: "High Agreeableness makes you genuinely collaborative, attuned to team dynamics, and easy to be around. Moderate Conscientiousness means your output is real and generally dependable, though not always at the level your warmth makes people expect. You are the person everyone is glad is on the team. You are not always the person who delivers the most.",
      watch_out: "Warmth creates an implicit promise about reliability that moderate conscientiousness does not always fulfill. The gap between how much people trust you and how much your follow-through deserves that trust is worth examining.",
    },
    MM: {
      title: "The Functional Member",
      summary: "You get things done and work with people without friction — consistently and without distinction.",
      detail: "Neither trait is extreme, which means you are neither the most driven nor the most warm person on most teams. You contribute adequately, collaborate without difficulty, and maintain a sustainable pace. Low-maintenance and reliable in the most practical sense. In most environments, this is exactly what is needed from most people.",
      watch_out: "Functional is not aspirational. Make sure adequate output is the right gear for this stage of your work rather than the highest gear you currently have.",
    },
    ML: {
      title: "The Independent Contributor",
      summary: "You produce at a reasonable pace and do not particularly bend your approach for anyone.",
      detail: "Moderate Conscientiousness means your output is real and reasonably consistent. Low Agreeableness means you work on your own terms with limited investment in social dynamics or team cohesion. You deliver. You do not manage others' experience of you. In environments that care about output more than process, this works. In environments that value collaboration, you read as difficult.",
      watch_out: "Most meaningful work eventually requires buy-in from people whose cooperation you have not earned. This combination tends to need that buy-in before it has been built.",
    },
    LH: {
      title: "The Likeable Underdeliverer",
      summary: "Everyone wants to work with you. Fewer people would choose to depend on you.",
      detail: "High Agreeableness means people genuinely enjoy having you around — you are warm, attuned, easy to be with, and genuinely invested in others. Low Conscientiousness means your follow-through is inconsistent in ways that the goodwill you generate is gradually spending. You say yes more than you should. You mean it when you say it. The gap between intention and completion is where the trust erosion happens.",
      watch_out: "Saying no when you mean no is an act of care for the people who are counting on you. Every yes you cannot honor is a debt with compound interest.",
    },
    LM: {
      title: "The Casual Collaborator",
      summary: "Loosely structured, moderately warm — you work with people without friction and without urgency.",
      detail: "Low Conscientiousness means sustained, structured effort is not your default mode. Moderate Agreeableness means you navigate people reasonably well without either the warmth that creates strong relational bonds or the directness that creates productive friction. You are neither a problem on most teams nor a significant contributor. Comfortable, consistent, and unlikely to be the constraint or the accelerator.",
      watch_out: "Comfortable is a reasonable state to be in. It is less reasonable as the permanent target.",
    },
    LL: {
      title: "The Autonomous Agent",
      summary: "You operate on your own terms with neither strong structure nor strong social investment.",
      detail: "Low Conscientiousness means external goals and organizational structures do not particularly drive your behavior. Low Agreeableness means you do not adjust your approach for the people around you. You are self-directed in the truest sense — not bound by others' expectations of output or social norms. Highly functional in autonomous, creative work with no accountability infrastructure. Genuinely difficult in collaborative ones.",
      watch_out: "Full autonomy is rare and usually has to be earned. Most environments that offer it want evidence first that you can also operate within structures you find constraining.",
    },
  },

  // ══════════════════════════════════════════
  // C + N — Conscientiousness × Neuroticism
  // The pressure axis: how standards meet stress
  // ══════════════════════════════════════════
  "C+N": {
    HH: {
      title: "The Anxious Perfectionist",
      summary: "You hold yourself to standards that are genuinely high — and the emotional cost of not meeting them is real.",
      detail: "High Conscientiousness means you set demanding expectations for your work and take those expectations seriously. High Neuroticism means the gap between those expectations and reality is felt intensely. You notice every flaw in your output. You replay decisions. You carry the weight of things unfinished in a way that is not motivating — it is exhausting. This is the combination with the highest burnout rate in high-demand environments.",
      watch_out: "Done is better than perfect is not a productivity principle for you — it is a health one. The version of your work that gets submitted is almost always more than enough. Your internal assessment of it is reliably more critical than anyone else's.",
    },
    HM: {
      title: "The Driven Worrier",
      summary: "You perform at a high level and carry moderate emotional weight for it — which is sustainable until it is not.",
      detail: "High Conscientiousness means you are organized, disciplined, and genuinely invested in the quality of your work. Moderate Neuroticism means there is real emotional investment in that work — stress is present, worry is occasional, but they do not consistently derail you. You have found a way to be high-performing without being fully consumed. It is a fine line and you are walking it most of the time.",
      watch_out: "Moderate neuroticism under sustained high demand does not always stay moderate. Know what your early warning signs look like before they escalate.",
    },
    HL: {
      title: "The Calm Achiever",
      summary: "You produce at a high level without the emotional overhead that most high performers carry.",
      detail: "High Conscientiousness gives you the discipline, organization, and sustained effort to execute well and reliably. Low Neuroticism means the emotional cost of that execution is minimal. You deal with setbacks as practical problems rather than personal failures. You recover quickly, recalibrate without drama, and move on in ways that people under more emotional load genuinely cannot. This is one of the most functional combinations in high-demand contexts.",
      watch_out: "Your ease in high-pressure situations can make you seem unsympathetic to people who experience the same situations very differently. Not everyone processes performance pressure the way you do, and the gap is larger than you tend to account for.",
    },
    MH: {
      title: "The Stressed Middle",
      summary: "You carry real emotional reactivity without the clear direction to channel it productively.",
      detail: "Moderate Conscientiousness means you have some structure and some follow-through but neither is strong or consistent enough to provide the framework that would make your High Neuroticism more manageable. You feel the weight of undone things, the pressure of unclear expectations, and the anxiety of uncertain outcomes — without the organizational habits that would reduce those things systematically. The anxiety does not go into action; it goes in circles.",
      watch_out: "Building one small, consistent organizational habit — even a very simple one — does more for this combination than any amount of emotional processing. The anxiety needs somewhere to go. Give it a task.",
    },
    MM: {
      title: "The Balanced Middle",
      summary: "You work with moderate structure and moderate emotional investment — sustainable, functional, and unhurried.",
      detail: "Neither trait is dominant, which means you are neither driven by high standards nor burdened by high emotional reactivity. You work at a pace that does not stress you and that produces output that is generally adequate. You are not prone to burnout and not prone to exceptional performance. The equilibrium you have found is real and more valuable than it sounds in a culture that glorifies either extreme.",
      watch_out: "The absence of either drive or anxiety can mean very little movement in any direction for long periods. Make sure the balance you have found is chosen and not simply the state you arrived at by avoiding both.",
    },
    ML: {
      title: "The Relaxed Contributor",
      summary: "Moderate structure, low emotional charge — you get things done without it costing you much.",
      detail: "Moderate Conscientiousness means you produce adequately and have some organizational habits without being driven by high standards. Low Neuroticism means the process of producing does not generate significant stress or emotional weight. You work at a pace that suits you, meet your commitments without intense effort, and carry very little of it home. Sustainable, uncomplicated, and reliably present.",
      watch_out: "Low emotional investment in your work is a feature until the work requires you to care more than you currently do. Know what actually matters to you — because when it is required, the caring needs to already be there.",
    },
    LH: {
      title: "The Anxious Drifter",
      summary: "You feel the emotional weight of things undone without the structure to address them — which creates a particular kind of exhausting loop.",
      detail: "Low Conscientiousness means organization, planning, and follow-through do not come naturally. High Neuroticism means the disorder that results is genuinely distressing rather than merely inconvenient. You worry about the tasks you cannot make yourself do. The anxiety does not convert into action; it converts into more anxiety. This loop is real and it is harder to break than it looks from the outside.",
      watch_out: "One completed task — a genuinely finished one — does more for this loop than an hour of thinking about it. The anxiety is an indicator that something needs doing. Use it as a signal, not a weather system.",
    },
    LM: {
      title: "The Casual Worrier",
      summary: "You are loosely structured and mildly anxious — a combination that is livable but not particularly energizing.",
      detail: "Low Conscientiousness means you approach obligations flexibly and let things slide more than you should. Moderate Neuroticism means there is some background emotional weight to that — not consuming, but present. You are not in crisis and you are not particularly organized, and the mild ambient worry about the things not getting done is the consistent cost of that arrangement.",
      watch_out: "Mild anxiety about things you are not addressing is a tax, not a motivator. Either address the things or genuinely decide they are not worth addressing. Holding both simultaneously is expensive over time.",
    },
    LL: {
      title: "The Easygoing Pragmatist",
      summary: "You are relaxed about both obligations and outcomes — and genuinely fine with that.",
      detail: "Low Conscientiousness means you are not driven by goals or organizational structure. Low Neuroticism means you do not carry stress about what goes undone or how things turn out. You deal with what is in front of you, let the rest go, and find the overall arrangement comfortable. In a culture that over-values productivity anxiety, there is something worth respecting about this equilibrium.",
      watch_out: "Comfortable without direction is still without direction. The question worth occasionally asking is whether the ease is a value or a default.",
    },
  },

  // ══════════════════════════════════════════
  // E + A — Extraversion × Agreeableness
  // The social axis: how engagement meets warmth
  // ══════════════════════════════════════════
  "E+A": {
    HH: {
      title: "The Social Architect",
      summary: "You build communities and hold them together — usually without anyone noticing that is what you are doing.",
      detail: "High Extraversion gives you social energy, the pull toward people, and the presence that makes groups cohere. High Agreeableness means that social energy is warm, inclusive, and oriented toward others rather than toward your own visibility. You remember people. You create the conditions where others feel included. Groups with you in them function better — not because you lead them but because you make the space hospitable.",
      watch_out: "Keeping the peace and avoiding necessary conflict are different things, and this combination tends to conflate them. Not every friction should be smoothed. Some friction is the thing that actually moves people somewhere new.",
    },
    HM: {
      title: "The Charismatic Adapter",
      summary: "You have genuine social magnetism — and you deploy warmth selectively rather than universally.",
      detail: "High Extraversion gives you the social energy and presence to be a natural connector. Moderate Agreeableness means you are warm when the situation earns it and direct when it does not. You are not trying to be universally liked; you are trying to be effective, and you have the social fluency to do that in most rooms. People with actual power or interesting ideas tend to get more of you than people who do not.",
      watch_out: "Selective warmth is strategic but it tends to be visible to everyone except the person deploying it. People notice when the warmth is calibrated and respond to it differently than they do to the unconditional kind.",
    },
    HL: {
      title: "The Competitive Connector",
      summary: "You command social situations — and you are comfortable with the friction that comes with that.",
      detail: "High Extraversion makes you naturally dominant in social environments — expressive, energetic, and the person who sets the pace. Low Agreeableness means that energy has an edge. You are not trying to make everyone comfortable; you are trying to make things happen. You challenge, compete, and push in ways that others find either invigorating or exhausting depending on how much runway you give them.",
      watch_out: "Social dominance that goes unexamined can mean you are the reason rooms go quiet in ways you never intended. The energy that feels productive to you can feel overwhelming to people who have not told you that yet.",
    },
    MH: {
      title: "The Warm Middle",
      summary: "You are genuinely caring and moderately social — consistent, warm, and easy to be around.",
      detail: "High Agreeableness means you are attuned, warm, and oriented toward others in a way that people feel. Moderate Extraversion means you engage with people at a pace that does not overwhelm you — you have real social interest without needing social environments to sustain your energy. You are the person everyone is genuinely glad to see, without necessarily being the person everyone is looking for.",
      watch_out: "Being pleasant and consistent is genuinely valuable and consistently underappreciated. Make sure you are not substituting warmth for the harder kind of showing up that some of your relationships also need.",
    },
    MM: {
      title: "The Functional Social Player",
      summary: "You manage social situations adequately without being particularly magnetic or particularly cold.",
      detail: "Neither trait is dominant, which means you are neither the person who animates a room nor the one who creates friction in it. You engage appropriately, contribute to group dynamics without disrupting them, and maintain a steady, functional social presence. In most environments, this is exactly sufficient. In environments that require someone to step up socially, this is invisible.",
      watch_out: "Social adequacy is not the same as social investment, and over time, relationships require more than adequate functioning. The people who matter to you may not feel that they do from the input they are currently receiving.",
    },
    ML: {
      title: "The Independent Social",
      summary: "You have moderate social energy and limited interest in adjusting your behavior for others' comfort.",
      detail: "Moderate Extraversion means you can engage socially without it costing you significantly. Low Agreeableness means you do that on your own terms — you do not soften your edges or manage other people's experience of you as a priority. Social situations are navigable, not energizing. You are direct when you have something to say and disengaged when you do not.",
      watch_out: "Social settings where your directness reads as coldness or your disengagement reads as dismissiveness are costing you more than you may have noticed. Not all of that cost is recoverable.",
    },
    LH: {
      title: "The Silent Supporter",
      summary: "You care deeply about the people in your life and express almost none of it loudly.",
      detail: "Low Extraversion means you do not seek attention or large social environments — you are most yourself in one-on-one settings or small groups where depth is possible. High Agreeableness means your care for people is genuine and significant, just expressed quietly, through consistency and action rather than presence or performance. The people who know you well trust you completely. Getting to know you well takes more time than most relationships are given.",
      watch_out: "Your care is invisible until people are close enough to see it clearly. The time it takes to get there is longer than many potential relationships are willing to give. Some things worth showing earlier.",
    },
    LM: {
      title: "The Reserved Individual",
      summary: "Introverted, moderately warm — you engage meaningfully in small doses and on your own terms.",
      detail: "Low Extraversion means you are genuinely energized by solitude and find large or sustained social environments tiring. Moderate Agreeableness means you engage with people with real warmth when you choose to — you are not cold, you are selective. The people who do receive your full attention know the difference between that and what most people get from you.",
      watch_out: "The selectivity you have about social energy can read as unavailability to people who want more access to you than you are offering. Occasionally the cost of maintaining that selectivity is a relationship worth having differently.",
    },
    LL: {
      title: "The Self-Contained",
      summary: "You neither seek people nor adjust for them — and your life is built accordingly.",
      detail: "Low Extraversion means solitude is your natural state and social engagement is always somewhat effortful. Low Agreeableness means you do not soften your manner or adjust your priorities for others' comfort. You are fully self-contained in a way most people describe but few actually achieve. The things that absorb most people's social and emotional energy are simply not your landscape.",
      watch_out: "Self-containment that goes unexamined can become a very consistent excuse for never letting anyone close enough to matter. The question is whether the walls are protecting something or just keeping a shape.",
    },
  },

  // ══════════════════════════════════════════
  // E + N — Extraversion × Neuroticism
  // The exposure axis: how social engagement meets emotional reactivity
  // ══════════════════════════════════════════
  "E+N": {
    HH: {
      title: "The Reactive Social",
      summary: "You are energized by people and affected by them in equal measure.",
      detail: "High Extraversion means you seek social environments, thrive in them, and feel depleted without them. High Neuroticism means that same social exposure carries significant emotional risk — approval matters, rejection registers hard, and the absence of response feels like evidence of something. You read social signals constantly and often amplify them beyond what the situation warrants. The social world is your source of energy and your primary source of distress simultaneously.",
      watch_out: "Not all social friction is about you. Some of what you interpret as rejection is simply other people managing their own lives. The space between 'they didn't respond' and 'something is wrong' is worth learning to sit in without collapsing it.",
    },
    HM: {
      title: "The Engaged Social",
      summary: "You enjoy people and carry some emotional investment in those interactions — which is a reasonable and functional way to live.",
      detail: "High Extraversion gives you genuine social energy and a real pull toward people and environments. Moderate Neuroticism means you bring some emotional investment to those interactions — you care how they go, you notice when they do not go well, but you do not typically spiral from normal social friction. You have social depth without the volatility that can come when both traits are high.",
      watch_out: "The moderate emotional investment you bring to social situations is healthy. The risk is when 'moderate' escalates quietly under sustained social pressure without you noticing until it is higher than you expected.",
    },
    HL: {
      title: "The Naturally Confident",
      summary: "You enjoy social environments without needing them to validate you.",
      detail: "High Extraversion means you seek out people, social situations, and environments with energy — they restore you rather than draining you. Low Neuroticism means your sense of self is not contingent on how those interactions go. You can engage freely, recover quickly from friction, and move through social environments without carrying them afterward. This is the most functional version of high extraversion.",
      watch_out: "Your ease in social situations can read as breezy or shallow to people who experience social interactions with more emotional weight. They may need more from conversations that felt complete to you.",
    },
    MH: {
      title: "The Quietly Anxious",
      summary: "You have moderate social engagement and genuine underlying anxiety — a combination that is harder than it looks from the outside.",
      detail: "Moderate Extraversion means you engage socially when the context calls for it without being strongly drawn to social environments. High Neuroticism means the emotional undercurrent of that engagement is significant — you worry about how you came across, you replay interactions, and you carry more from social situations than most people realize is happening. The anxiety is internal, real, and rarely visible to the people causing it.",
      watch_out: "The version of you that other people see and the version experiencing the social interaction are quite different. Closing that gap requires either more disclosure or fewer interactions that produce the gap. Neither is easy with this combination.",
    },
    MM: {
      title: "The Social Middle",
      summary: "You engage with social situations at face value — neither strongly energized nor strongly affected by them.",
      detail: "Neither trait is dominant, which means social environments are simply contexts you navigate without strong emotional charge in either direction. You engage adequately, respond proportionally, and move on without carrying much of it. This is more functional than it sounds — a significant proportion of social difficulty comes from either of these traits being too high. You do not have that problem.",
      watch_out: "A flat emotional response to social situations can mean you miss things — in people, in relationships, in conversations — that would have mattered if you had been more present in them.",
    },
    ML: {
      title: "The Functional Extrovert",
      summary: "You have moderate social energy and strong emotional stability — social situations are navigable without much residue.",
      detail: "Moderate Extraversion means you have real but not overwhelming social interest. Low Neuroticism means the emotional cost of social interaction is minimal — things that unsettle others pass through you more easily. You engage when it is useful, disengage when it is not, and carry very little of it afterward. Steady, functional, and uncomplicated in social contexts.",
      watch_out: "Emotional stability in social situations can read as low investment in those situations. People who bring more to an interaction than they receive from it eventually stop bringing it.",
    },
    LH: {
      title: "The Anxious Loner",
      summary: "Social situations cost you energy AND generate anxiety — which means both states are uncomfortable.",
      detail: "Low Extraversion means you are genuinely energized by solitude and find social demands tiring. High Neuroticism means the solitude you go to for recovery does not always bring peace — it brings rumination, replayed conversations, and anticipated future discomfort. The place you escape to is also where the anxiety lives. You are between two uncomfortable states more often than the people around you realize.",
      watch_out: "More solitude is not the solution because the anxiety follows you there. And less solitude is not the solution because the social cost is real. The work is in changing what happens in your own head — which is genuinely harder than changing the external circumstances.",
    },
    LM: {
      title: "The Reserved Moderate",
      summary: "Introverted with mild emotional sensitivity — you engage on your own terms and carry a little of it afterward.",
      detail: "Low Extraversion means you prefer solitude and find social engagement tiring without being overwhelmed by it. Moderate Neuroticism means there is some emotional weight to social interactions — not consuming, but present. You are more socially thoughtful than you appear from the outside, more aware of dynamics, and more likely to revisit conversations afterward than the calm exterior suggests.",
      watch_out: "The gap between your internal social experience and what others see of it means people rarely know how much something mattered to you or how much it cost. That gap is sometimes useful and sometimes lonely.",
    },
    LL: {
      title: "The Contented Loner",
      summary: "You do not need people and you do not worry about not needing them — a genuinely uncommon combination.",
      detail: "Low Extraversion means solitude is your preferred state and social engagement is always somewhat effortful. Low Neuroticism means the absence of social connection does not produce anxiety, loneliness, or the sense that something is wrong. You are genuinely self-sufficient in a way that most people who describe themselves as introverts are not quite. The inner life is full enough that the outer one does not need to compensate for it.",
      watch_out: "Long-term social isolation has psychological costs that are not always immediately visible. The stability you feel now is real. Check whether it is still real in five years.",
    },
  },

  // ══════════════════════════════════════════
  // A + N — Agreeableness × Neuroticism
  // The care axis: how warmth meets emotional load
  // ══════════════════════════════════════════
  "A+N": {
    HH: {
      title: "The Emotional Sponge",
      summary: "You absorb the emotional weight of everyone around you — and carry most of it alone.",
      detail: "High Agreeableness means you are acutely attuned to others — their moods, needs, and discomfort register in you with real immediacy. High Neuroticism means you do not just notice these things; you internalize them. You say yes when you mean no because disappointing people feels genuinely costly. You apologize when you are not wrong because the discomfort of conflict outweighs the discomfort of misrepresenting yourself. Burnout is not a future risk — it is a recurring cycle.",
      watch_out: "The boundary you keep not setting is not protecting anyone. It is protecting the short-term feeling of being needed while creating the long-term cost of resentment you cannot quite name. The people who care about you know you need to set it before you do.",
    },
    HM: {
      title: "The Caring Moderate",
      summary: "You are warm and genuinely attuned to others — with moderate emotional investment in how it all goes.",
      detail: "High Agreeableness makes you caring, collaborative, and genuinely attuned. Moderate Neuroticism means there is real emotional investment in your relationships and in how people respond to you — you care how things go — but it does not consistently overwhelm your functioning. You feel things without being consumed by them. This is a stable and genuinely warm way to exist in relationship with other people.",
      watch_out: "The moderate emotional investment you bring is healthy most of the time. Under sustained relational pressure or accumulated emotional load, 'moderate' can shift upward quietly. Notice that before it is a pattern.",
    },
    HL: {
      title: "The Grounded Giver",
      summary: "You are genuinely kind and genuinely stable — giving from abundance rather than anxiety.",
      detail: "High Agreeableness means you are warm, caring, and oriented toward others in a way that is not performance and not strategic. Low Neuroticism means your generosity comes from a place of stability rather than a need to manage others' emotions or avoid their disapproval. You help people because you want to, not because saying no feels dangerous. You can sustain this in a way that people who help from anxiety cannot.",
      watch_out: "Being emotionally stable and consistently available makes people assume you are always available. That assumption is worth correcting before it becomes the arrangement.",
    },
    MH: {
      title: "The Selective Reactor",
      summary: "You are moderately warm and emotionally reactive — and the reactivity tends to show up before the warmth has a chance to.",
      detail: "Moderate Agreeableness means you are warm in some contexts and direct in others without strong pull in either direction. High Neuroticism means emotional situations escalate quickly for you — disagreement can feel like rejection, criticism can feel like attack. The warmth you have is real but it requires emotional stability to access, and under stress, the stability is the first thing to go.",
      watch_out: "Your emotional reactivity does not wait for your warmth to arrive first. In high-stakes interpersonal situations, the version of you that shows up first is not always the version you intended to bring.",
    },
    MM: {
      title: "The Functional Middle",
      summary: "You are neither particularly warm nor particularly reactive — which makes you stable and unremarkable in interpersonal terms.",
      detail: "Neither trait is dominant, which means you navigate interpersonal situations without strong emotional charge in either direction. You are adequately warm when warmth is appropriate, moderately affected when things go wrong, and consistent in a way that is neither especially comforting nor especially difficult. Most people find this combination easy to be around without finding it particularly memorable.",
      watch_out: "Functional in relationship is not the same as present in relationship. The people closest to you may be missing something they have not figured out how to ask you for yet.",
    },
    ML: {
      title: "The Stable Pragmatist",
      summary: "Moderate warmth, high stability — you engage with people from a place of genuine equilibrium.",
      detail: "Moderate Agreeableness means you have real warmth that surfaces when relationships earn it. Low Neuroticism means your emotional baseline is stable — things that produce significant reactivity in others pass through you without the same escalation. You are reliable in interpersonal situations in the sense that people always get a consistent version of you, regardless of the emotional weather.",
      watch_out: "Consistent stability can read as emotional unavailability to people who need more than equanimity from a close relationship. Know when the situation is asking for more than you are currently giving.",
    },
    LH: {
      title: "The Defensive Realist",
      summary: "Direct in manner and emotionally reactive — a combination that produces friction faster than you expect.",
      detail: "Low Agreeableness means you are competitive, direct, and not oriented toward social harmony as a goal. High Neuroticism means that directness is backed by real emotional intensity — disagreement registers quickly, criticism feels personal, and the emotional response tends to arrive before the measured one does. People experience you as both blunt and reactive, which is a combination that is difficult to stay close to for very long.",
      watch_out: "The instinct to defend arrives faster than the ability to assess whether defense is warranted. And it is warranted less often than it feels in the moment.",
    },
    LM: {
      title: "The Direct Moderate",
      summary: "You are blunt, self-directed, and carry mild emotional weight for the friction that creates.",
      detail: "Low Agreeableness means you say what you think and do not invest in managing how it lands. Moderate Neuroticism means you carry some emotional residue from the friction that directness sometimes produces — not enough to change your approach, but enough to notice it. You are not indifferent to how things go in relationships. You are just not willing to soften your communication style significantly to change them.",
      watch_out: "The mild anxiety you carry about interpersonal friction is the part of you that knows the directness sometimes goes further than necessary. That part is worth listening to slightly more often.",
    },
    LL: {
      title: "The Cold Pragmatist",
      summary: "You are neither warm nor troubled — and you process the world with a detachment most people find difficult to read.",
      detail: "Low Agreeableness means you prioritize your own goals over social harmony and do not soften your view for others' comfort. Low Neuroticism means none of that produces internal conflict or distress. You operate with a steady emotional detachment that others may experience as cold, transactional, or simply very hard to reach. From the inside, it reads as practical clarity. From the outside, it reads as absence.",
      watch_out: "The question is not whether you are actually cold — it is whether the people in your life have access to the parts of you that are not. If the answer is no, that is information worth doing something with.",
    },
  },

};


// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Classifies a single score into H, M, or L range.
 * Also returns a confidence label and the raw distance from 50 —
 * both used to decide how prominently to display the insight.
 *
 * @param  {number} score - trait score 0–100
 * @returns {{ range: string, confidence: string, distance: number }}
 */
function getRange(score) {
  const distance = Math.abs(score - 50);
  const confidence = distance >= 25 ? "high" : distance >= 10 ? "mid" : "low";

  if (score >= HIGH) return { range: "H", confidence, distance };
  if (score <  LOW)  return { range: "L", confidence, distance };
  return { range: "M", confidence: "low", distance };
}

/**
 * Validates that a scores object contains all 5 traits with values 0–100.
 * Throws descriptive errors if not — fail loud, not silent, since this
 * feeds directly into user-facing content.
 */
function validateScores(scores) {
  const missing = TRAITS.filter(t => scores[t] === undefined || scores[t] === null);
  if (missing.length) throw new Error(`Missing trait scores: ${missing.join(", ")}`);

  const invalid = TRAITS.filter(t => typeof scores[t] !== "number" || scores[t] < 0 || scores[t] > 100);
  if (invalid.length) throw new Error(`Scores must be numbers 0-100. Invalid: ${invalid.join(", ")}`);
}

/**
 * Normalizes a pair string to canonical OCEAN order.
 * Ensures 'C+O' resolves to 'O+C', 'N+A' resolves to 'A+N', etc.
 * This is what allows pair lookups to work regardless of the order
 * the two trait letters were passed in.
 */
function normalizePair(t1, t2) {
  const order = { O: 0, C: 1, E: 2, A: 3, N: 4 };
  return order[t1] <= order[t2] ? `${t1}+${t2}` : `${t2}+${t1}`;
}

/**
 * Returns all 5 traits ranked by how extreme their score is —
 * furthest from the midpoint (50) comes first. This ranking is
 * the basis for selecting which 4 combination pairs are most
 * relevant to a specific user (see getCombinationInsights).
 */
function rankByExtremity(scores) {
  return [...TRAITS].sort((a, b) => Math.abs(scores[b] - 50) - Math.abs(scores[a] - 50));
}

/**
 * Calculates confidence level for a pair based on both trait ranges.
 *   HH / HL / LH / LL  -> high   (both traits show a clear signal)
 *   HM / MH / LM / ML  -> medium (one trait clear, one flexible)
 *   MM                 -> low    (both traits are flexible/mid-range)
 */
function pairConfidence(r1, r2) {
  if (r1 === "M" && r2 === "M") return "low";
  if (r1 === "M" || r2 === "M") return "medium";
  return "high";
}


// ─────────────────────────────────────────────
// MAIN FUNCTION 1: getTraitInsights
// ─────────────────────────────────────────────

/**
 * Returns an individual insight for each of the 5 OCEAN traits,
 * based on the user's score range (H / M / L).
 *
 * Use this for the individual trait breakdown screen, where each
 * of the 5 traits gets its own card.
 *
 * @param  {Object} scores - { O: 0-100, C: 0-100, E: 0-100, A: 0-100, N: 0-100 }
 * @returns {Object} keyed by trait letter, e.g. result.O, result.C, etc.
 *
 * @example
 * const insights = getTraitInsights({ O: 78, C: 45, E: 62, A: 71, N: 34 });
 * insights.O.title    // "The Open One"
 * insights.O.range    // "H"
 * insights.N.range    // "L"
 */
function getTraitInsights(scores) {
  validateScores(scores);

  const result = {};

  TRAITS.forEach(trait => {
    const { range, confidence, distance } = getRange(scores[trait]);
    const content = TRAIT_INSIGHTS[trait][range];

    result[trait] = {
      trait,
      name:      TRAIT_NAMES[trait],
      score:     scores[trait],
      range,            // "H" | "M" | "L"
      confidence,       // "high" | "mid" | "low"
      distance,         // 0-50, how far from the midpoint
      title:     content.title,
      summary:   content.summary,
      detail:    content.detail,
      watch_out: content.watch_out,
    };
  });

  return result;
}


// ─────────────────────────────────────────────
// MAIN FUNCTION 2: getCombinationInsights
// ─────────────────────────────────────────────

/**
 * Returns insights for all 10 trait-pair combinations, ranked by
 * how confidently and how strongly each one describes this specific
 * user.
 *
 * The 4 most relevant pairs (selected by trait extremity — see the
 * algorithm note at the top of this file) are returned as `default`,
 * meant to be shown immediately on the results screen. The remaining
 * 6 are returned as `detailed`, meant for an expanded "see more" view.
 * `all` returns all 10, fully ranked, for any UI that wants the
 * complete ordered list in one array.
 *
 * @param  {Object} scores - { O: 0-100, C: 0-100, E: 0-100, A: 0-100, N: 0-100 }
 * @returns {{ default: Array<Object>, detailed: Array<Object>, all: Array<Object> }}
 *
 * @example
 * const combos = getCombinationInsights({ O: 78, C: 45, E: 62, A: 71, N: 34 });
 * combos.default[0].title   // most relevant combination insight for this user
 * combos.default.length     // 4
 * combos.detailed.length    // 6
 * combos.all.length         // 10
 */
function getCombinationInsights(scores) {
  validateScores(scores);

  // Classify all 5 traits once up front
  const ranges = {};
  TRAITS.forEach(t => { ranges[t] = getRange(scores[t]); });

  // Build all 10 combination insight cards
  const allCards = ALL_PAIRS.map(pair => {
    const [t1, t2]  = pair.split("+");
    const r1        = ranges[t1].range;
    const r2        = ranges[t2].range;
    const rangeKey  = `${r1}${r2}`;
    const content   = COMBINATION_INSIGHTS[pair]?.[rangeKey];
    const conf       = pairConfidence(r1, r2);
    const extremity  = ranges[t1].distance + ranges[t2].distance;

    return {
      pair,
      traits: {
        [t1]: { name: TRAIT_NAMES[t1], score: scores[t1], range: r1 },
        [t2]: { name: TRAIT_NAMES[t2], score: scores[t2], range: r2 },
      },
      rangeKey,           // e.g. "HM", "LL", "MH" — useful for debugging/QA
      confidence:  conf,  // "high" | "medium" | "low"
      extremity,          // higher = more relevant / sharper signal for this user
      title:       content?.title     || "Insight Unavailable",
      summary:     content?.summary   || "",
      detail:      content?.detail    || "",
      watch_out:   content?.watch_out || "",
    };
  });

  // Rank: confidence first, then by combined extremity of both traits
  const ranked = [...allCards].sort((a, b) => {
    const confOrder = { high: 3, medium: 2, low: 1 };
    if (confOrder[b.confidence] !== confOrder[a.confidence]) {
      return confOrder[b.confidence] - confOrder[a.confidence];
    }
    return b.extremity - a.extremity;
  });

  // Select the 4 "default" pairs from this user's 3 most extreme traits.
  // top3 traits -> 3 pairs between them, plus a 4th pair anchored on the
  // single most extreme trait paired with the 4th-ranked trait.
  const rankedTraits = rankByExtremity(scores);
  const top3         = rankedTraits.slice(0, 3);

  const defaultPairSet = new Set([
    normalizePair(top3[0], top3[1]),
    normalizePair(top3[0], top3[2]),
    normalizePair(top3[1], top3[2]),
    normalizePair(rankedTraits[0], rankedTraits[3]),
  ]);

  const defaultCards  = [];
  const detailedCards = [];

  for (const card of ranked) {
    if (defaultPairSet.has(card.pair) && defaultCards.length < 4) {
      defaultCards.push(card);
    } else {
      detailedCards.push(card);
    }
  }

  // Edge case safety net: if the set produced fewer than 4 unique pairs
  // (can happen with ties), fill remaining default slots from the top
  // of the ranked list so the UI always gets exactly 4.
  while (defaultCards.length < 4 && detailedCards.length > 0) {
    defaultCards.push(detailedCards.shift());
  }

  return {
    default:  defaultCards,   // 4 cards — show immediately
    detailed: detailedCards,  // 6 cards — show in expanded view
    all:      ranked,         // all 10, fully ranked
  };
}


// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export { getTraitInsights, getCombinationInsights, TRAIT_NAMES, ALL_PAIRS, getRange };


/*
 * ─────────────────────────────────────────────
 * QUICK TEST — uncomment this block and run:  node ocean-insights-v2.js
 * ─────────────────────────────────────────────

const scores = { O: 78, C: 45, E: 62, A: 71, N: 34 };

console.log("\n━━━ INDIVIDUAL TRAIT INSIGHTS ━━━");
const traits = getTraitInsights(scores);
Object.values(traits).forEach(t => {
  console.log(`\n${t.name} - ${t.score}% - ${t.range} - (${t.confidence} confidence)`);
  console.log(`  Title:     ${t.title}`);
  console.log(`  Summary:   ${t.summary}`);
  console.log(`  Watch out: ${t.watch_out}`);
});

console.log("\n━━━ DEFAULT COMBINATIONS (4) ━━━");
const combos = getCombinationInsights(scores);
combos.default.forEach((c, i) => {
  console.log(`\n[${i + 1}] ${c.pair} - ${c.rangeKey} - ${c.confidence} confidence`);
  console.log(`  Title:     ${c.title}`);
  console.log(`  Summary:   ${c.summary}`);
  console.log(`  Watch out: ${c.watch_out}`);
});

console.log("\n━━━ DETAILED COMBINATIONS (6) ━━━");
combos.detailed.forEach((c, i) => {
  console.log(`\n[${i + 1}] ${c.pair} - ${c.rangeKey} - ${c.confidence} confidence`);
  console.log(`  Title: ${c.title}`);
});

 */


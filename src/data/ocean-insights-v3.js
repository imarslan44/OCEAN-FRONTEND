/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║           OCEAN INSIGHTS ENGINE — CORE MODULE v3.0               ║
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
 * H (High) : score >= 60
 * M (Mid)  : score 40–59
 * L (Low)  : score <  40
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
 * O+C, O+E, O+A, O+N, C+E, C+A, C+N, E+A, E+N, A+N
 * Each pair has 9 possible range combinations:
 * HH, HM, HL, MH, MM, ML, LH, LM, LL
 * 10 pairs × 9 combinations = 90 written content blocks.
 *
 * STEP 4 — RELEVANCE RANKING
 * Each combination card gets a confidence level:
 * - Both traits H or L (extreme)   → high confidence
 * - One trait extreme, one Mid     → medium confidence
 * - Both traits Mid                → low confidence
 * Confidence determines display priority:
 * default  = 4 most relevant pairs (shown immediately on results)
 * detailed = remaining 6 pairs (shown in an expanded/detailed view)
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
      title: "The Open Mind",
      summary: "Your mind rarely stays in one place, which serves as one of your greatest strengths.",
      detail: "Rather than looking for strict answers, you explore the world with genuine curiosity. New ideas, unusual people, and unfamiliar experiences rarely make you uncomfortable; instead, they draw you in. Focusing on what is possible comes more naturally to you than following strict rules. You easily see connections that other people miss entirely. Your active imagination is not just a habit—it is the main way you make sense of reality.",
      watch_out: "Exploring new ideas can easily become your only goal. The concept itself often excites you more than doing the actual work. Because of this, there is a tendency to collect many different viewpoints without exploring any of them deeply. Starting a project feels great, but it requires a different kind of energy to finish it.",
    },
    M: {
      title: "The Selective Explorer",
      summary: "Your curiosity operates on its own terms, and those terms tend to be very specific.",
      detail: "Chasing new experiences just for the thrill is rare for you. However, when something genuinely catches your interest, you explore it deeply. Moving between familiar routines and new ideas feels seamless, depending simply on what the situation requires. Normal routines rarely bore you, and sudden changes rarely shake you. You judge both fairly, making you more mentally flexible than people who strongly prefer just one way.",
      watch_out: "Having highly specific interests can look like boredom to people who do not know you well. You are frequently paying closer attention than your face shows. Because of this quiet observation, others tend to underestimate how much you actually know.",
    },
    L: {
      title: "The Grounded Realist",
      summary: "Your focus stays firmly in the real world, prioritizing what is happening now over what might happen later.",
      detail: "Proven facts hold more weight for you than broad ideas. When making a decision, you base it on what has worked before rather than guessing what might work in different circumstances. You remain steady and consistent, rarely getting caught up in the excitement when everyone else does. People rely on you when they need practical advice instead of clever theories.",
      watch_out: "The world rewards people who adapt to change, even when that change feels unnecessary. A preference for familiar things serves as a strong advantage most of the time, but it becomes a barrier if the environment shifts and you refuse to adjust your habits.",
    },
  },

  // ── CONSCIENTIOUSNESS ─────────────────────
  C: {
    H: {
      title: "The Self-Directed",
      summary: "External pressure is rarely necessary to get you moving. You create your own motivation.",
      detail: "Planning, organizing, and finishing tasks with strong consistency is your baseline. Deadlines feel like a starting point rather than a final goal. You take your promises seriously, especially the ones you make to yourself. People rely on this trait, even if they do not say it out loud. You have built deep trust simply through a long history of keeping your word.",
      watch_out: "It is easy to expect everyone else to match your high personal standards. When disappointment in others arises, it is frequently because you expect your exact level of discipline from them. Many people simply do not operate that way.",
    },
    M: {
      title: "The Context-Driven",
      summary: "Your discipline is highly real, but it requires the right situation to fully appear.",
      detail: "You are not lazy, nor are you strictly organized. Sharp focus appears when the results truly matter to you, or when people set clear expectations. In casual or unclear situations, things tend to slide more than they should. You are capable of amazing dedication, but also capable of losing focus entirely. Sometimes, both happen in the same week.",
      watch_out: "The gap between your best work and your average work is wider than you might want to admit. There are likely tasks you keep meaning to finish that remain untouched. Those tasks will not finish themselves without a deliberate shift in focus.",
    },
    L: {
      title: "The Unbound",
      summary: "Strict planning is something that happens to other people, not you.",
      detail: "Acting in the moment is your natural state. You stay flexible and rarely worry about unfinished tasks, as strict plans feel confining. Responding to whatever is happening right now makes more sense to you than following a schedule written last week. Your ability to adapt is a real strength, allowing you to handle surprises better than most. The downside is that tasks requiring long, steady effort are easily forgotten.",
      watch_out: "Being free from rules does not automatically mean being effective. Building a meaningful life requires periods of boring, steady work. Avoiding this specific challenge and calling it 'spontaneity' will eventually limit your options.",
    },
  },

  // ── EXTRAVERSION ──────────────────────────
  E: {
    H: {
      title: "The Social Engine",
      summary: "People are not just something you tolerate; they provide your main source of energy.",
      detail: "Social events rarely make you tired; instead, they recharge you. Thinking out loud and processing feelings through conversation is how your mind works best. You feel most alive in busy, active places, while being quiet for too long feels uncomfortable rather than relaxing. Connecting with people happens easily because your genuine interest in them is obvious.",
      watch_out: "Because you thrive on social energy, being alone can feel like a punishment. True personal growth requires quiet time to think. There is a chance you are avoiding this alone time without realizing it.",
    },
    M: {
      title: "The Situational Social",
      summary: "Talking to everyone in the room or going home early are both easy for you. It depends entirely on the day.",
      detail: "You do not constantly need people, but you also do not avoid them. Social energy is a tool you use when it helps and put away when it does not. In the right place with the right people, you become highly active and focused. In the wrong place, you are ready to leave—and you rarely feel bad about it. This balance gives you great flexibility.",
      watch_out: "Your social flexibility can look like mixed signals. People cannot always predict which version of you will show up. While this makes perfect sense to you, it can make you seem less reliable to others in highly social environments.",
    },
    L: {
      title: "The Internal World",
      summary: "Your inner life is rich and detailed. Most people never get to see it completely.",
      detail: "Being alone is not something you merely handle; it is something you actively need. Your clearest thinking happens in quiet spaces. Deep talks with one person carry far more weight than a large party. You carefully choose who receives your full attention, and when someone earns it, they see a focus that most others never experience. You are not simply shy—you are protecting your energy.",
      watch_out: "Living heavily in your own head can sometimes replace living in the real world. Your clear thoughts and honest feelings are valuable, but they only create change if you eventually share them with the people around you.",
    },
  },

  // ── AGREEABLENESS ─────────────────────────
  A: {
    H: {
      title: "The Natural Ally",
      summary: "People feel safe around you, and that is not an accident.",
      detail: "Understanding how others feel happens effortlessly for you. You notice when someone is uncomfortable long before they speak up. Stepping back when harmony is needed is your default, and you only push back when someone truly needs to hear the truth. Arguing takes a heavy emotional toll on you, not because you are weak, but because you clearly feel the damage that conflict causes to a relationship.",
      watch_out: "Caring for others easily becomes a quiet excuse to ignore your own needs. The kindest person in the room is often the least understood. People appreciate you, but they do not always truly know what you want or need.",
    },
    M: {
      title: "The Selective Cooperator",
      summary: "Warmth comes easily when it builds connection, and firmness arrives when necessary.",
      detail: "Forcing peace or picking fights for no reason is not your style. You read the room and choose the best response. With people you trust, you are highly patient and deeply care about good results for everyone. In situations lacking trust, you are direct and efficient, comfortable leaving some tension in the air without feeling guilty. Close friends understand this balance, though strangers might find it confusing.",
      watch_out: "You carefully select who gets to see your warm side. This boundary can feel like coldness to people who are just meeting you. Relying too heavily on first impressions might cost you friendships that would have been valuable.",
    },
    L: {
      title: "The Straight Line",
      summary: "Saying exactly what you think comes naturally. Wasting energy softening the message does not.",
      detail: "Disagreeing with people rarely hurts your feelings. You are direct and naturally competitive when a situation requires it, perfectly fine ending a conversation while people still disagree. Finding the correct answer matters more to you than making sure everyone feels happy. This makes you highly effective when facts matter most, though it creates friction in sensitive situations.",
      watch_out: "Honesty without kindness does not fix every problem. Delivering bad news gently is a distinct skill from just stating facts. Refusing to learn this skill will cost you more opportunities than staying quiet would have.",
    },
  },

  // ── NEUROTICISM ───────────────────────────
  N: {
    H: {
      title: "The Deep Feeler",
      summary: "Emotions run deep and complex for you, frequently arriving much faster than your logical thoughts.",
      detail: "You feel emotions long before you can clearly explain them, and processing them takes real time. Stress hits quickly, and bouncing back is rarely immediate. Noticing hidden tensions in a room that other people miss gives you a deep understanding of human struggles. The downside is carrying emotional weight for much longer than is actually necessary.",
      watch_out: "Feeling something deeply does not mean you are seeing the whole truth. Under stress, the mind connects the wrong dots. A dark feeling about a situation is not always a fact, even when your body tells you it is real.",
    },
    M: {
      title: "The Responsive One",
      summary: "When hard things happen, your emotional reactions remain balanced and proportionate.",
      detail: "You are not free from stress, but it rarely ruins your day. Your emotional reactions to difficult moments are fair and grounded. Bad feelings rarely spin out of control, and while you worry sometimes, it does not take over your life. You feel pressure without turning it into a disaster, leading most people to view you as emotionally steady.",
      watch_out: "Because you handle things well, there is a risk of quietly rushing past your feelings instead of actually processing them. Emotions do not always need an immediate fix. Sometimes, you simply need to let yourself feel sad or angry.",
    },
    L: {
      title: "The Unshakeable",
      summary: "While other people panic, you quietly adjust your plans.",
      detail: "Stress rarely builds up inside you the way it does for most people. Problems look like puzzles to fix rather than proof that life is falling apart. When people around you panic, you stay calm, and others use your energy to relax themselves. Bouncing back fast and moving forward quickly means you rarely drag yesterday's problems into today.",
      watch_out: "Staying perfectly calm can make people think you do not care. Certain situations require a strong emotional reaction. Your steady nature is a great strength, but it can look like a lack of empathy to people who feel things deeply.",
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
      summary: "Generating ideas worth pursuing is only half your strength; you also put in the work to finish them.",
      detail: "High Openness fills your mind with imagination, while High Conscientiousness provides the structure to organize it. This combination is rare in creative work. You invent something new and then do the hard work to make it real. Teams that follow your lead build things that other groups struggle to conceptualize.",
      watch_out: "The ability to both imagine and finish easily becomes a trap. Agreeing to do too many things happens because you genuinely believe you can finish them all. In reality, time is limited. Learning to say no early is a skill worth actively developing.",
    },
    HM: {
      title: "The Inspired Builder",
      summary: "Discipline appears when you actually care. When it does, your work is outstanding.",
      detail: "You are highly creative, but your discipline remains selective. When a project genuinely interests you, structure appears automatically—you plan, work hard, and finish it. When a project bores you, your focus drifts away. The difference in quality between work you love and work you dislike is obvious to anyone paying attention.",
      watch_out: "You have learned how to focus on things you find interesting, but struggling through boring, necessary work remains an issue. Avoiding tedious tasks will eventually create roadblocks. Building tolerance for the boring parts is essential.",
    },
    HL: {
      title: "The Scattered Visionary",
      summary: "The gap between what you imagine and what you actually finish is your biggest challenge.",
      detail: "High Openness gives you a mind that creates ideas faster than most people can follow. Low Conscientiousness means finishing what you start is a struggle. You are most effective when someone else handles the small details, or when strict deadlines force you to focus. Working alone without rules means your best ideas often stay as ideas forever.",
      watch_out: "Starting new things has likely become your way of avoiding finishing old things. The feeling of a fresh project provides a rush of energy, but it is often just an escape from the tedious middle phase of an older project.",
    },
    MH: {
      title: "The Methodical Improver",
      summary: "Inventing new things is rarely your goal. You prefer making everything you touch significantly better.",
      detail: "Your curiosity is specific; chasing new ideas just to be different holds no appeal. High Conscientiousness means that when you decide something needs to change, you create a strict plan to fix it. You take broken processes and refine them. People underestimate your impact until they see the solid results.",
      watch_out: "A preference for familiar routines means you sometimes try to fix old systems that should be thrown away entirely. Making small improvements is valuable, but it can also be a clever way to avoid making necessary, sweeping changes.",
    },
    MM: {
      title: "The Adaptable Contributor",
      summary: "Moving between structure and freedom based on what the moment needs makes you highly useful.",
      detail: "You are not strongly pulled to the extremes. Curiosity appears when needed, and discipline shows up when goals are clear. While rarely the most creative or the most strict person in the room, you work exceptionally well in both environments. When a workplace constantly shifts its rules, your flexibility becomes a massive advantage.",
      watch_out: "Being flexible without having your own clear goals carries a risk. There is a tendency to simply become whatever the people around you need. Ensure your adaptability is a choice, not just a habit.",
    },
    ML: {
      title: "The Mild Wanderer",
      summary: "Curiosity pushes you to explore, but organization rarely helps you finish.",
      detail: "You possess genuine curiosity, reading widely and thinking about new topics. However, Low Conscientiousness means this curiosity rarely turns into serious, sustained effort. You collect starting points. Actually finishing things requires a type of boring, steady work that does not come naturally to you.",
      watch_out: "Finding something interesting is not the same as making it useful. Your curiosity is a great asset, but turning ideas into real results requires building strict routines that feel uncomfortable at first.",
    },
    LH: {
      title: "The Reliable Executor",
      summary: "Focusing on doing things perfectly appeals to you far more than doing things differently.",
      detail: "Low Openness means looking for wild new ideas is rare. High Conscientiousness means applying intense discipline to doing standard tasks perfectly. You are the backbone of a good team. People trust you to do the work correctly without creating drama or breaking the rules. Reliable results follow you.",
      watch_out: "When the workplace changes suddenly, a love for old methods becomes a weakness. Being reliable is only valuable if you are doing the right tasks. Willingness to learn new skills when the old ones stop working is crucial.",
    },
    LM: {
      title: "The Comfortable Conventional",
      summary: "Preferring familiar ground, steady effort, and a calm pace is your natural state.",
      detail: "You apply a reasonable amount of effort to get things done, avoiding the stress of massive ambition or the need to be highly creative. Working at a pace you can maintain for years appeals to you. You are generally stable, consistent, and happy to leave things exactly as they are.",
      watch_out: "Staying comfortable and growing as a person rarely happen at the same time. Ensure your relaxed pace is what you actually want out of life, rather than just the path of least resistance.",
    },
    LL: {
      title: "The Still Point",
      summary: "Sudden bursts of creativity or strict discipline rarely disrupt your peace.",
      detail: "Low Openness keeps you from constantly searching for new experiences, while Low Conscientiousness keeps you from obsessing over strict goals. You live in a quiet, stable balance. This is highly sustainable, even if society praises constant hustle. The main question is whether this quiet life is a conscious choice or simply the easiest option.",
      watch_out: "There is a version of this life that brings true happiness, and another version that is simply being stuck. From the inside, both feelings can seem identical for a very long time.",
    },
  },

  // ══════════════════════════════════════════
  // O + E — Openness × Extraversion
  // The stimulation axis: where energy and curiosity meet
  // ══════════════════════════════════════════
  "O+E": {
    HH: {
      title: "The Idea Hunter",
      summary: "Mental excitement and social energy are requirements for you, and you search for both simultaneously.",
      detail: "High Openness keeps you looking for new and interesting ideas. High Extraversion means you find those ideas by engaging with people. Conversations are where your best thinking happens. You feel most alive in places that are both intellectually stimulating and energetic. Environments lacking interesting dialogue drain your energy quickly.",
      watch_out: "Choosing to know a little about many things rather than a lot about one thing is common for you. Mastering a skill or building a truly deep relationship requires quiet, unsocial focus, which goes against your natural momentum.",
    },
    HM: {
      title: "The Thoughtful Socializer",
      summary: "Being around people is enjoyable, provided the conversation is genuinely interesting.",
      detail: "High Openness brings a deep hunger for ideas, while Moderate Extraversion means you manage your social energy carefully. You rarely try to attend every event. When you meet someone who thinks in fascinating ways, connection happens quickly. Casual small talk, however, rarely provides the energy you are looking for.",
      watch_out: "Your standards for a good conversation are high, which means you might walk away from people too quickly. Some relationships become highly meaningful only after surviving the superficial small talk at the beginning.",
    },
    HL: {
      title: "The Solitary Explorer",
      summary: "Your richest experiences happen inside your own head, and you are at peace with that.",
      detail: "High Openness gives you a mind that constantly explores possibilities, while Low Extraversion means you process these ideas alone. Reading, thinking, and writing are not performed for an audience; they are simply how your mind works. Your inner world is not a hiding place—it is your preferred habitat.",
      watch_out: "Great ideas that stay hidden in your mind do not change the world. Your clear thinking is only helpful if it eventually reaches others. Finding simple ways to share your thoughts is an important step.",
    },
    MH: {
      title: "The Engaged Traditional",
      summary: "People and social events energize you, while exploring abstract ideas holds less appeal.",
      detail: "High Extraversion provides strong social energy. You actively seek out people, feel great in group settings, and are often the center of the action. Moderate Openness means spending time on deeply unusual ideas is rare. You connect with people through shared memories, common jokes, and familiar topics.",
      watch_out: "While your social skills are strong, a lack of interest in learning new things might make it harder to add unique value to deep conversations. The ideas you bring to the table matter just as much as your delivery.",
    },
    MM: {
      title: "The Versatile Middle",
      summary: "Handling social events and quiet time without feeling stressed in either direction comes naturally.",
      detail: "Neither extreme controls your life. You are not desperate for crowds, nor do you hide from them. You are neither obsessed with new ideas nor stuck in old habits. Working well with a team or functioning perfectly alone are both easy for you. This balanced flexibility is a huge advantage in dynamic environments.",
      watch_out: "Being highly adaptable can sometimes mean mirroring the people around you too closely. Ensure your flexibility is helping you reach your own goals, not just making others feel comfortable.",
    },
    ML: {
      title: "The Quiet Drifter",
      summary: "Big ideas and large crowds hold little appeal, allowing you to build a quiet life.",
      detail: "A deep need to learn everything or meet everyone does not drive you. Functioning well in most situations without strong emotional attachment is your standard mode. You are reliable, steady, and unbothered by the chaotic ambitions of others. It is a peaceful way to live, though it rarely leads to high-profile achievements.",
      watch_out: "Not caring deeply feels comfortable, but eventually, you might realize you have not grown or changed in years. Comfort is a pleasant state, but it can also be a quiet trap.",
    },
    LH: {
      title: "The Social Traditionalist",
      summary: "Thriving in social settings is easy for you, as long as the people and topics feel familiar.",
      detail: "Low Openness means feeling safest when social events follow predictable rules. High Extraversion means you actively look for these events and truly enjoy them. Connecting through laughter and shared experiences is your forte. However, if someone introduces a highly unusual or strange topic, your interest fades quickly.",
      watch_out: "Social energy is only one element of a good relationship. Without sharing deeper or newer ideas, friendships might stay largely on the surface, causing you to miss out on stronger connections.",
    },
    LM: {
      title: "The Reserved Conventional",
      summary: "Thinking practically, enjoying a moderate social life, and avoiding rushed decisions define your style.",
      detail: "Seeking out wild new ideas or large crowds is rare for you. A normal social life satisfies you without requiring any drama, and challenging the standard rules seems unnecessary. You are stable and predictable in the best possible way. People seeking a calm, easy friend appreciate your presence.",
      watch_out: "There is a version of this life that is deeply fulfilling, and another version that is secretly quite dull. Honesty with yourself is required to know which one you are actually living.",
    },
    LL: {
      title: "The Solitary Minimalist",
      summary: "Wild ideas and large crowds are unnecessary for your happiness—a trait less common than it sounds.",
      detail: "Low Openness keeps you from constantly searching for new thrills. Low Extraversion ensures that being alone never feels like a punishment; it is your favorite choice. You possess true independence. The social drama that exhausts the rest of the world simply bounces off you.",
      watch_out: "Complete independence can turn into building an unnecessary wall around yourself. Occasionally ask yourself if you are living a small life by choice, or merely out of habit.",
    },
  },

  // ══════════════════════════════════════════
  // O + A — Openness × Agreeableness
  // The engagement axis: how curiosity meets people
  // ══════════════════════════════════════════
  "O+A": {
    HH: {
      title: "The Empathetic Intellectual",
      summary: "Being equally curious about people and abstract ideas is a rare and powerful combination.",
      detail: "High Openness makes you hungry for deep knowledge, while High Agreeableness naturally applies that curiosity to understanding others. You genuinely want to understand people, rather than argue with them. Trust builds quickly because people feel your interest is authentic. This profile frequently belongs to great teachers, writers, and therapists.",
      watch_out: "Agreeing too readily can cause you to lose your own voice. Not every opinion holds equal weight. Deep care for others might make you stay quiet when you should strongly disagree. Your perspective matters in the room.",
    },
    HM: {
      title: "The Selective Connector",
      summary: "Treating people with warmth is conditional upon them offering interesting thoughts.",
      detail: "High Openness brings intense curiosity, but Moderate Agreeableness means you choose carefully who receives your kindness. Trying to be everyone's best friend is not your goal. When you find someone who thinks in fascinating ways, you invest heavily. If a person fails to stimulate your mind, your warm behavior fades quickly.",
      watch_out: "People who take time to show their intelligence rarely get to know the real you. Some relationships require more patience in the beginning than you naturally offer, meaning you might walk away from good people too soon.",
    },
    HL: {
      title: "The Direct Challenger",
      summary: "Challenging big ideas and the people who hold them happens naturally, and you rarely apologize for it.",
      detail: "High Openness creates a hunger for complex concepts. Low Agreeableness means you test those ideas by arguing and looking for hidden mistakes. The goal is rarely to hurt feelings; you simply want to find the exact truth. However, most people experience your style as aggressive, even when your intentions are purely logical.",
      watch_out: "Being perfectly right and being actually helpful are two distinct skills. Focus tends to fall entirely on being right. Delivering a hard truth requires a gentle touch, and your direct style causes damage that could be avoided.",
    },
    MH: {
      title: "The Curious Cooperator",
      summary: "Warm, easy to work with, and much smarter than you let people see.",
      detail: "High Agreeableness makes you a great team player who values peace. Moderate Openness means real curiosity hides underneath. You notice small details and grasp complex ideas perfectly. People are sometimes surprised by your sharp thoughts because they primarily view you as a nice, helpful person. You are far more interesting than your polite exterior suggests.",
      watch_out: "Politeness comes so easily that it often conceals your best ideas. Editing your own words to avoid making anyone uncomfortable is a common habit. Ensure your kindness is not silencing your sharpest thoughts.",
    },
    MM: {
      title: "The Balanced Adapter",
      summary: "Shifting between deep thinking and warm teamwork happens exactly when needed.",
      detail: "Neither extreme dictates your behavior. You argue about complex ideas when useful, and offer strong support when someone needs a friend. You are not locked into being strictly a fighter or a peacemaker. This balance makes you highly effective in diverse situations, and people find you very easy to work with.",
      watch_out: "Adapting so well means you might never push yourself to be truly exceptional in one specific direction. Recognizing when to stop blending in and start taking a strong stand is an important step.",
    },
    ML: {
      title: "The Independent Realist",
      summary: "Genuine curiosity drives you, and softening your words to comfort others is rarely a priority.",
      detail: "Moderate Openness means you enjoy learning about specific interests. Low Agreeableness means sugarcoating thoughts is not your style. You say what you think, question what you doubt, and spend little energy worrying about how your words make others feel. People generally need time to get used to your approach.",
      watch_out: "Brutal honesty without warmth pushes people away. Your ideas might be brilliant, but if delivered coldly, very few people will stay around long enough to listen and appreciate them.",
    },
    LH: {
      title: "The Steady Teammate",
      summary: "Reliability and warmth define you, and you are happiest when life stays friendly and predictable.",
      detail: "Low Openness keeps you away from chaotic changes or strange ideas. High Agreeableness means you care deeply about the people you work with. You act as the glue that holds a team together. Trust builds because you show up, do your job, and keep everyone feeling supported, providing true stability.",
      watch_out: "Teams focused only on harmony eventually stumble. Sometimes, pointing out a difficult truth is necessary. You are often the best person to do this because everyone trusts you, but a fear of conflict usually stops you.",
    },
    LM: {
      title: "The Pragmatic Individual",
      summary: "Thinking practically, showing moderate warmth, and avoiding the spotlight is your standard mode.",
      detail: "Low Openness means trusting proven facts and ignoring wild theories. Moderate Agreeableness means getting along with people without stressing over their feelings. You are highly consistent and practical, making it clear exactly what others can expect from you. This reliability is your greatest asset in everyday life.",
      watch_out: "High predictability is excellent, but people might mistakenly assume you lack deep thoughts. There is likely much more going on inside your head than you present to the world.",
    },
    LL: {
      title: "The Firm Pragmatist",
      summary: "Being set in your ways and highly direct suits you, and you see no reason to change.",
      detail: "Low Openness means new theories or strange ideas hold no interest. Low Agreeableness means changing your behavior to please others does not happen. You operate with strict rules for how things should be done and lose patience with those who work differently. Total control and clear rules bring out your best work.",
      watch_out: "Total control is rarely given freely; it must be earned. Big projects require working with people whose ideas might annoy you. Learning the art of compromise is eventually necessary for larger success.",
    },
  },

  // ══════════════════════════════════════════
  // O + N — Openness × Neuroticism
  // The depth axis: curiosity meets emotional intensity
  // ══════════════════════════════════════════
  "O+N": {
    HH: {
      title: "The Depth Seeker",
      summary: "Feeling everything deeply and thinking about it intensely happens simultaneously for you.",
      detail: "High Openness draws you to complex ideas, while High Neuroticism makes your inner world incredibly loud. Anxiety, rich thoughts, and constant analysis fill your mind. You examine ideas long after others have forgotten them. Art, philosophy, and human psychology are not merely hobbies; they are the tools you use to make sense of life.",
      watch_out: "Confusing endless worrying with deep thinking is a common trap. Distinguishing between the two is a necessary skill. Recognizing when you have stopped analyzing a problem and started looping is vital for your peace of mind.",
    },
    HM: {
      title: "The Reflective Explorer",
      summary: "Exploring deep ideas and feeling their emotional weight happens without letting them overwhelm you.",
      detail: "High Openness keeps your mind hungry for complexity. Moderate Neuroticism means you truly feel the emotional impact of these ideas without losing control. Strong feelings rarely ruin your day. You experience deep emotional reactions but manage to maintain balance perfectly most of the time.",
      watch_out: "The ability to handle stress depends heavily on your environment. Under intense pressure, mild worry can escalate into severe overthinking. Recognizing the early signs of this shift is important.",
    },
    HL: {
      title: "The Grounded Explorer",
      summary: "Chasing ideas wherever they lead happens without paying a heavy emotional price.",
      detail: "High Openness keeps your mind hunting for better explanations. Low Neuroticism ensures this constant searching rarely makes you anxious. Sitting with unproven ideas and changing your mind without feeling stressed is easy for you. You explore the unknown without fear, making this a highly resilient combination.",
      watch_out: "Handling strange ideas without fear can make you seem cold to people who easily feel threatened. Not everyone processes chaotic changes as calmly as you do. Forgetting this difference can damage relationships.",
    },
    MH: {
      title: "The Anxious Adapter",
      summary: "The heavy stress of a situation is felt intensely, but finding a new perspective is a struggle.",
      detail: "Moderate Openness means inventing new ways to solve a problem is not your first instinct. High Neuroticism means problems hit with significant emotional force. While some use creative thinking to escape anxiety, stress hits you directly. You carry this heavy weight without an easy mechanism to release it.",
      watch_out: "Learning to look at bad situations from different angles is basic survival. Without practicing how to change your perspective, the anxiety simply has nowhere to go and continues to build.",
    },
    MM: {
      title: "The Even Pragmatist",
      summary: "Seeing the world exactly as it is, you avoid both extreme deep thoughts and extreme panic.",
      detail: "Neither trait dominates your approach. Complex ideas are considered only when they appear directly in front of you. Normal stress is handled without destroying your routine. You are highly functional, steady, and require very little emotional maintenance. The world rarely terrifies you, and you rarely try to upend it.",
      watch_out: "There is a version of this life filled with true contentment, and another where you feel fine simply because you never aim higher. Figuring out which one is true for you is a worthwhile exercise.",
    },
    ML: {
      title: "The Curious Stable",
      summary: "Complex ideas are explored without letting them disrupt your emotional peace.",
      detail: "Moderate Openness means you have genuine interests you occasionally explore. Low Neuroticism ensures reading about difficult topics rarely upsets you. You analyze a stressful problem, understand it, and walk away without carrying the pain in your chest. This is a quiet, highly useful way to navigate life.",
      watch_out: "Remaining incredibly calm means you might study difficult human problems without truly empathizing with the pain involved. Some ideas are supposed to hurt, and feeling that hurt is part of truly understanding them.",
    },
    LH: {
      title: "The Anxious Conventionalist",
      summary: "Normal things cause worry, and anything strange or new makes that worry significantly worse.",
      detail: "Low Openness means feeling safest when life is entirely predictable. High Neuroticism amplifies this need for safety. Sudden changes are viewed as direct threats rather than exciting opportunities. You work beautifully in stable environments with clear rules, but chaotic environments cause severe stress.",
      watch_out: "Confusing 'new' with 'dangerous' happens frequently. Many things that feel threatening are simply unfamiliar. Learning to see the difference will make life easier and provide much more freedom.",
    },
    LM: {
      title: "The Settled Pragmatist",
      summary: "Trusting standard routines, handling stress normally, and enjoying a quiet life define you.",
      detail: "Low Openness means trusting what already works rather than complicating life for fun. Moderate Neuroticism means feeling normal stress during bad times without panicking. You are generally stable, rarely searching for hidden meanings, and rarely deeply upset. Focusing on the task directly in front of you is your strength.",
      watch_out: "Feeling settled is not always the same as being finished. Ensure your quiet life is built on true satisfaction, rather than using it to avoid looking at harder questions you should be asking.",
    },
    LL: {
      title: "The Steady Realist",
      summary: "Avoiding drama, ignoring strange ideas, and staying highly consistent is your standard operation.",
      detail: "Low Openness keeps you away from deep philosophy or chaotic changes. Low Neuroticism ensures you rarely carry emotional pain from the past. Dealing with whatever happens today, fixing it, and moving on is your process. In roles requiring pure reliability, you are highly valuable, even if highly creative groups find you less engaging.",
      watch_out: "Being perfectly steady can slowly drift into becoming emotionally numb. The people close to you might eventually feel like you are slowly retreating from the deeper parts of the relationship.",
    },
  },

  // ══════════════════════════════════════════
  // C + E — Conscientiousness × Extraversion
  // The output axis: how effort meets visibility
  // ══════════════════════════════════════════
  "C+E": {
    HH: {
      title: "The Natural Leader",
      summary: "Getting things done and making other people want to help you happens naturally.",
      detail: "High Conscientiousness makes you organized and reliable, while High Extraversion pushes this energy out into the world. Speaking clearly, building excitement, and leading the charge come easily. This is a classic profile for strong leadership. Trust builds quickly because people actually see you executing exactly what you promised.",
      watch_out: "Not everyone shares your endless energy or intense focus. Losing patience with people who work quietly or slowly is common, which costs you their best contributions. Learning to wait for them often reveals amazing quiet skills.",
    },
    HM: {
      title: "The Productive Professional",
      summary: "Producing great work without needing an audience to cheer for you is your standard mode.",
      detail: "High Conscientiousness provides the strict rules needed for success. Moderate Extraversion means talking to people is easy when needed, but you never depend on them to keep you working. Functioning perfectly on a team or completely alone is natural. Your effort remains consistent regardless of who is watching.",
      watch_out: "Working steadily without demanding attention can make you invisible. In many environments, quiet hard work goes unrewarded. Forcing yourself to showcase your results is often necessary, even if it feels uncomfortable.",
    },
    HL: {
      title: "The Focused Executor",
      summary: "Delivering perfect results happens best when no one is watching you do it.",
      detail: "High Conscientiousness provides the strict discipline to finish hard tasks. Low Extraversion means doing your absolute best work completely alone. You are the person who quietly builds something amazing in a dark room. People underestimate you until they see the final product, after which they offer immense respect.",
      watch_out: "Being noticed is usually required for career advancement. Working quietly in a corner has a hard limit. Eventually, stepping into a crowded room and speaking up for yourself becomes a professional necessity.",
    },
    MH: {
      title: "The Energetic Connector",
      summary: "Massive energy is brought to a group, but finishing the task depends entirely on your interest level.",
      detail: "High Extraversion makes you a natural magnet, easily creating excitement and making teamwork feel fun. Moderate Conscientiousness means work habits are uneven. Hard work appears when the goal excites you, but important details are forgotten when the task bores you. People love working with you before they see the final results.",
      watch_out: "Relying on charm without strict reliability is a dangerous game. People offer trust because you are engaging, but that trust burns rapidly every time you fail to deliver on a promise.",
    },
    MM: {
      title: "The Functional Contributor",
      summary: "Doing your fair share of work and socializing normally keeps you out of trouble.",
      detail: "Neither extreme dictates your behavior. Working at a normal pace, talking to coworkers when necessary, and delivering decent results without drama is your style. You are highly consistent and completely reliable in the best way possible. Many organizations desperately need steady people who simply show up and do the job.",
      watch_out: "There is a version of this life where a normal pace brings happiness, and another where it indicates a lack of ambition. Clarifying which one describes you will eventually become important.",
    },
    ML: {
      title: "The Quiet Contributor",
      summary: "Work gets done quietly, and seeking praise for it rarely crosses your mind.",
      detail: "Moderate Conscientiousness means your work is solid. Low Extraversion means you perform this work completely out of the spotlight. Quiet, steady, and keeping to yourself, your hard work is real but frequently invisible. Because you never brag, organizations often fail to utilize your full potential.",
      watch_out: "In the professional world, unseen hard work rarely leads to advancement. Learning to present your work to decision-makers is a skill you must practice, even if it feels unnatural.",
    },
    LH: {
      title: "The Social Starter",
      summary: "Intense excitement is brought to a new project, but sticking around to finish it is rare.",
      detail: "High Extraversion provides massive social charm, allowing you to easily convince a group to start a new adventure. Low Conscientiousness means this excitement usually fades halfway through. You shine on day one, but the boring, quiet work required to cross the finish line feels nearly impossible.",
      watch_out: "Starting a project is the most fun part, but it yields nothing if it remains unfinished. Friends and coworkers have noticed this pattern, even if you try to ignore it.",
    },
    LM: {
      title: "The Casual Connector",
      summary: "Staying relaxed, chatting with people, and eventually getting things done at your own pace is your style.",
      detail: "Low Conscientiousness means strict goals rarely provide motivation. Moderate Extraversion means enjoying conversation without needing to be the center of attention. Floating through tasks without rushing, you eventually finish them, though rarely early. Some find this relaxed energy calming; others find it frustrating.",
      watch_out: "A highly relaxed pace functions well until a real emergency arises. Understanding the difference between choosing a calm life and simply avoiding effort is crucial for your long-term success.",
    },
    LL: {
      title: "The Calm Observer",
      summary: "Working quietly, avoiding attention, and ignoring strict goals defines your approach.",
      detail: "Low Conscientiousness means strict plans hold no power over you. Low Extraversion means avoiding the busy social events that force others to work hard. Living in a quiet, slow-moving world, you remain largely invisible in busy environments. The important question is whether you chose this invisibility, or if it happened by accident.",
      watch_out: "Living a calm life easily turns into being entirely stuck. The simplest way to check your trajectory is to ask what you are aiming for. If there is no answer, you are likely just drifting.",
    },
  },

  // ══════════════════════════════════════════
  // C + A — Conscientiousness × Agreeableness
  // The team axis: how discipline meets people
  // ══════════════════════════════════════════
  "C+A": {
    HH: {
      title: "The Trusted Teammate",
      summary: "Delivering great work while ensuring people genuinely enjoy working with you is your signature.",
      detail: "High Conscientiousness ensures promises are kept. High Agreeableness guarantees people are treated with deep kindness in the process. Destroying relationships to hit a deadline is unacceptable, as is missing a deadline just to be nice. Teams thrive with your presence because you build massive trust by being capable and kind.",
      watch_out: "Because you are reliable and kind, others will frequently try to hand you their unfinished work. Defining exactly where your job ends and someone else's begins is necessary. Avoid doing their work for them.",
    },
    HM: {
      title: "The Reliable Professional",
      summary: "Delivering perfect results and working well with people happens without needing them to love you.",
      detail: "High Conscientiousness guarantees excellent work. Moderate Agreeableness means being polite without wasting time trying to be everyone's best friend. Pleasant and highly direct, whether people like you matters less than whether the work is completed to a high standard.",
      watch_out: "Perfect politeness maintains the peace, but it rarely builds deep trust. Strong relationships are frequently the secret to significant success. Focusing solely on the work can cause you to neglect the human infrastructure.",
    },
    HL: {
      title: "The Results Machine",
      summary: "Your work is undeniable, though the feelings hurt along the way frequently go unnoticed.",
      detail: "High Conscientiousness pushes you to achieve goals with intense force. Low Agreeableness means softening words to protect feelings is not a priority. Highly effective, you often leave a trail of friction behind you. People respect your skills, but find working closely with you incredibly difficult.",
      watch_out: "Achieving perfect results while damaging relationships eventually stalls a career. The teamwork bypassed today is precisely the support you will need tomorrow.",
    },
    MH: {
      title: "The Cooperative Contributor",
      summary: "Warm, helpful, and delivering decent work makes you the glue of most teams.",
      detail: "High Agreeableness makes you a joy to be around, deeply caring about team harmony. Moderate Conscientiousness means the actual work is solid, but rarely groundbreaking. People love having you on their team because you improve the atmosphere, even if you are not the one driving the hardest tasks.",
      watch_out: "Extreme kindness leads people to assume a higher level of reliability than you might deliver. When the work is only average, people feel slightly disappointed. Ensure the actual output matches the friendly promises.",
    },
    MM: {
      title: "The Functional Member",
      summary: "Finishing work and getting along with everyone happens without needing to stand out.",
      detail: "Neither extreme controls your actions. You are rarely the hardest worker or the most vocal friend. Doing the job nicely, avoiding conflict, and maintaining boundaries is your approach. Highly low-maintenance, this is exactly what most organizations need to function smoothly day-to-day.",
      watch_out: "Being perfectly functional is reliable, but rarely exciting. Ensure you are choosing to operate at this average pace for now, rather than letting your best skills fade from lack of use.",
    },
    ML: {
      title: "The Independent Contributor",
      summary: "Working at a steady pace without changing your style to please others is your standard.",
      detail: "Moderate Conscientiousness ensures steady work. Low Agreeableness means completing tasks exactly how you want to do them. Team bonding or making people smile holds little interest; delivering the work is the only focus. This succeeds in roles focused purely on output, but seems stubborn in team environments.",
      watch_out: "Significant projects require cooperation from people who are not obligated to help. If warm relationships are never built, those people will likely refuse assistance when you finally need it.",
    },
    LH: {
      title: "The Friendly Starter",
      summary: "Everyone wants to work with you, but very few actually rely on you for the final details.",
      detail: "High Agreeableness makes you incredibly warm and fun. Low Conscientiousness means your actual work output is highly unpredictable. Saying yes to favors you cannot finish happens because you truly mean well in the moment. However, failing to deliver destroys the trust built by your charm.",
      watch_out: "Saying no is frequently the kindest thing you can do. Every yes that turns into a failure to deliver damages the relationship. Learning to stop making promises you cannot keep is essential.",
    },
    LM: {
      title: "The Casual Collaborator",
      summary: "Lacking strict goals, showing normal politeness, and never rushing anything is your approach.",
      detail: "Low Conscientiousness means sticking to a strict schedule is rare. Moderate Agreeableness ensures normal interactions without extreme warmth or anger. Causing problems is rare, but solving major ones is equally uncommon. You remain comfortable, steady, and unhurried in almost every situation.",
      watch_out: "Being entirely comfortable is pleasant for a weekend, but dangerous for an entire life. Eventually, aiming for a higher standard or a more difficult goal will be necessary for growth.",
    },
    LL: {
      title: "The Independent Worker",
      summary: "Working strictly on your own terms, you care little about rules or pleasing others.",
      detail: "Low Conscientiousness means company rules fail to motivate you. Low Agreeableness means the opinions of others are easily ignored. True independence defines your style. You work brilliantly when unobserved and unrestricted, but surviving in a standard team environment is a nightmare for everyone involved.",
      watch_out: "True professional freedom is rare and must be earned. Earning it requires first proving you can survive and contribute within a standard, structured team without causing chaos.",
    },
  },

  // ══════════════════════════════════════════
  // C + N — Conscientiousness × Neuroticism
  // The pressure axis: how standards meet stress
  // ══════════════════════════════════════════
  "C+N": {
    HH: {
      title: "The Anxious Perfectionist",
      summary: "Setting incredibly high standards for yourself means failing to meet them causes real pain.",
      detail: "High Conscientiousness demands perfect work. High Neuroticism ensures that any flaw generates intense stress. Every mistake is noticed, and old decisions are endlessly overthought. Carrying this heavy weight exhausts rather than motivates. This pattern leads to exhaustion faster than almost any other.",
      watch_out: "Accepting that finished work is better than perfect work is a necessity. The project you are nervous to submit is likely already excellent. You remain your own harshest judge, and that judgment is rarely fair.",
    },
    HM: {
      title: "The Driven Worrier",
      summary: "Working at a very high level while carrying moderate stress works, until it doesn't.",
      detail: "High Conscientiousness brings deep organization and a focus on quality. Moderate Neuroticism means the stress of hard work is definitely felt. Worry appears, but rarely stops the job from being finished. A method has been found to perform exceptionally well without completely destroying mental health.",
      watch_out: "Moderate stress is manageable in the short term. However, prolonged periods of intense work will quietly turn that moderate stress into a breaking point. Recognizing warning signs before a crash is vital.",
    },
    HL: {
      title: "The Calm Achiever",
      summary: "Producing amazing work without feeling the heavy stress that most people experience is your superpower.",
      detail: "High Conscientiousness provides incredible focus and strict discipline. Low Neuroticism ensures that working this hard rarely causes anxiety. Failures are viewed as puzzles to fix, not disasters. Recovering instantly and moving forward leaves others wondering how you remain so calm under pressure.",
      watch_out: "Handling stress perfectly can make you appear cold to those who panic easily. Most people cannot manage pressure the way you do. Expecting them to match your calm will only alienate them.",
    },
    MH: {
      title: "The Stressed Middle",
      summary: "Heavy anxiety is a frequent visitor, but the strict habits needed to fix the underlying problems are missing.",
      detail: "Moderate Conscientiousness means work habits are only average. High Neuroticism causes massive stress when things go wrong. Panicking about unfinished tasks and unclear goals is common, but the planning skills to resolve them are lacking. The anxiety rarely converts into hard work; it merely generates more anxiety.",
      watch_out: "Attempting to fix anxiety purely by thinking about it fails. Physical action—cleaning a desk or writing a simple list—is required. Fear needs a physical task to focus on. Start very small.",
    },
    MM: {
      title: "The Balanced Middle",
      summary: "Working with normal effort and feeling normal stress makes you deeply steady.",
      detail: "Neither extreme dictates your life. Obsessing over perfect work or panicking when things go wrong are both rare. Working at a calm pace and producing fine results is your standard. Burning out is uncommon, as is winning intense competitions. This quiet balance is incredibly valuable, despite society's praise for extremes.",
      watch_out: "A balanced life is wonderful, provided it is not an excuse to avoid difficult challenges. Ensure this balance is a conscious choice, not just a result of avoiding effort.",
    },
    ML: {
      title: "The Relaxed Contributor",
      summary: "Getting work done easily rarely costs you any emotional pain.",
      detail: "Moderate Conscientiousness ensures the work is decent. Low Neuroticism means the effort of working rarely causes stress. Working at a comfortable speed, finishing what is required, and going home happy is the routine. Work problems stay at work. It is a highly sustainable and simple approach to life.",
      watch_out: "Not caring deeply about work is fine until a real emergency happens. When intense focus is suddenly required, stepping up might be a struggle. Knowing what actually matters to you is important.",
    },
    LH: {
      title: "The Anxious Drifter",
      summary: "Panicking about undone tasks is common, but finding the focus to start them is a daily struggle.",
      detail: "Low Conscientiousness makes organizing life a deep struggle. High Neuroticism means the resulting chaos causes intense daily pain. Endlessly worrying about chores you cannot force yourself to do is the standard loop. The fear fails to initiate action; it only breeds more fear. This trap is incredibly hard to escape.",
      watch_out: "Thinking about chores for an hour is worse than doing one chore for five minutes. Anxiety is an alarm bell. Use the alarm to wash a single dish, rather than just listening to it ring.",
    },
    LM: {
      title: "The Casual Worrier",
      summary: "Weak habits and mild anxiety combine to create a constant, annoying background noise.",
      detail: "Low Conscientiousness means important tasks are frequently delayed. Moderate Neuroticism creates a quiet, constant guilt about that delay. Massive crises are rare, but so is being truly organized. The mild fear of unfinished work acts as the permanent background noise of your day.",
      watch_out: "Feeling slightly guilty without taking action is useless. Either finish the task, or truly decide you do not care about it. Holding onto guilt while avoiding the work serves no purpose.",
    },
    LL: {
      title: "The Easygoing Pragmatist",
      summary: "Strict goals hold no appeal, and failing to meet them causes zero stress.",
      detail: "Low Conscientiousness means planning the future is rarely a priority. Low Neuroticism ensures that when things go wrong, anxiety is absent. Dealing only with the exact moment in front of you and ignoring the rest is your strategy. In a world obsessed with stress, your pure relaxation is remarkable.",
      watch_out: "Complete relaxation frequently indicates drifting aimlessly. Occasionally asking yourself if you actually like your destination, or if you are simply enjoying the smooth ride, is a necessary reality check.",
    },
  },

  // ══════════════════════════════════════════
  // E + A — Extraversion × Agreeableness
  // The social axis: how engagement meets warmth
  // ══════════════════════════════════════════
  "E+A": {
    HH: {
      title: "The Social Architect",
      summary: "Building amazing groups and holding them together comes naturally, and you rarely ask for credit.",
      detail: "High Extraversion provides the energy to gather people. High Agreeableness ensures this energy is used purely to make others feel valued. Remembering small details and ensuring everyone feels included is your specialty. Groups function better with your presence because you make the space feel safe and welcoming.",
      watch_out: "Confusing keeping the peace with avoiding real problems happens easily. Not every argument should be stopped. Sometimes, allowing friction is the only way a group can resolve a deep issue.",
    },
    HM: {
      title: "The Charismatic Adapter",
      summary: "Massive social charm is at your disposal, but you only share your warmth when it serves a purpose.",
      detail: "High Extraversion provides strong social energy, while Moderate Agreeableness means warmth is applied selectively. Trying to be loved by everyone is not the goal; being effective is. Charming a room is easy. People with power or interesting ideas see your best side, while those who bore you see a much colder version.",
      watch_out: "Selective charm is rarely a secret. People notice when warmth is turned on and off depending on the audience. Trust diminishes quickly when others realize your kindness is conditional.",
    },
    HL: {
      title: "The Competitive Connector",
      summary: "Dominating social events is your style, and the friction it causes bothers you very little.",
      detail: "High Extraversion makes you loud, active, and impossible to ignore. Low Agreeableness means your energy carries a sharp edge. Making people comfortable is not the priority; making things happen is. Pushing people hard is your default, which some find inspiring and others find totally exhausting.",
      watch_out: "Loud confidence easily silences a room without intent. The aggressive energy that feels productive to you frequently feels like an attack to quieter people. Learning to consciously leave space for others is a necessary skill.",
    },
    MH: {
      title: "The Warm Middle",
      summary: "Kindness and normal socialization make you incredibly easy to be around.",
      detail: "High Agreeableness makes you deeply caring and warm. Moderate Extraversion means enjoying people without needing to be the center of attention. Socializing happens without exhaustion. You are the person everyone is deeply happy to see, even if you are not the loudest voice at the gathering.",
      watch_out: "Being perfectly nice is wonderful, but it is not always enough for deep connection. Ensure pleasant behavior is not acting as a shield. Deep relationships eventually require showing your messy, complicated, or angry sides.",
    },
    MM: {
      title: "The Functional Social Player",
      summary: "Handling social events normally keeps you from being a magnet, but also keeps you from being a problem.",
      detail: "Neither extreme dictates your social life. Walking into a room, talking to people, and going home without drama is the routine. You maintain a steady, normal social life. In most environments, this is exactly what is needed, though you fade into the background when a loud leader is required.",
      watch_out: "Acting normal in social settings means deep energy is rarely invested. Friendships eventually require more than just polite behavior. Close friends might eventually request more emotional depth from you.",
    },
    ML: {
      title: "The Independent Social",
      summary: "Socializing is easy, but changing your blunt behavior for someone else's comfort is not.",
      detail: "Moderate Extraversion allows easy interaction with crowds when needed. Low Agreeableness means refusing to soften your words. Social events are viewed as practical tasks, not fun games. Speaking directly when you have a point, and walking away when you do not, is your standard approach.",
      watch_out: "High directness frequently looks like meanness. Completely ignoring social manners damages relationships permanently. The cost might not be apparent today, but those missed connections will be felt later.",
    },
    LH: {
      title: "The Silent Supporter",
      summary: "Caring deeply about friends is your core, but you express it very quietly.",
      detail: "Low Extraversion means avoiding crowds and preferring quiet talks. High Agreeableness means your love for others is significant. Showing this love happens through helpful actions rather than loud speeches. The few who know you well trust you completely, but new people take years to truly understand you.",
      watch_out: "Showing love quietly means most new people miss it entirely. The time it takes to build trust is too long for casual acquaintances. Finding ways to demonstrate warmth earlier in a relationship will serve you well.",
    },
    LM: {
      title: "The Reserved Individual",
      summary: "Preferring quiet time is your baseline, but deep warmth appears when you choose to engage.",
      detail: "Low Extraversion means large groups are exhausting. Moderate Agreeableness means rudeness is rare; friends are simply chosen very carefully. When energy is spent on someone, it is warm and present. Those who receive your focus understand it is a rare and valuable gift.",
      watch_out: "Being highly selective about sharing energy makes you appear completely unavailable. Guarding energy is smart, but it frequently costs friendships that would have been worth the effort.",
    },
    LL: {
      title: "The Self-Contained",
      summary: "Avoiding people and refusing to soften your words creates a highly guarded life.",
      detail: "Low Extraversion indicates a true preference for being alone. Low Agreeableness means caring about politeness is rare. You operate with an independence most people cannot imagine. The social drama and forced smiles that exhaust the rest of the world simply do not exist in your reality.",
      watch_out: "Complete independence easily turns into an excuse for pushing everyone away. The difficult question must be asked: Are strong walls protecting you, or are they simply keeping you trapped?",
    },
  },

  // ══════════════════════════════════════════
  // E + N — Extraversion × Neuroticism
  // The exposure axis: how social engagement meets emotional reactivity
  // ══════════════════════════════════════════
  "E+N": {
    HH: {
      title: "The Reactive Social",
      summary: "People provide your energy, but they also cause you significant stress.",
      detail: "High Extraversion dictates a need for social events to feel alive. High Neuroticism ensures these same events often cause terror. The opinions of others matter deeply; a strange look from a friend can ruin a week. Analyzing social clues constantly and assuming the worst is standard. The social world serves as both a source of energy and a significant source of stress.",
      watch_out: "Assuming every quiet moment is a rejection is a painful habit. Sometimes a friend is just tired or busy. Learning to stop turning normal quiet moments into emotional disasters is crucial for your peace.",
    },
    HM: {
      title: "The Engaged Social",
      summary: "Loving people and caring about their opinions happens without panicking over them.",
      detail: "High Extraversion provides wonderful social energy. Moderate Neuroticism means genuinely caring if people like you. A bad conversation is noticed, but it rarely ruins the month. Normal social pain is felt without destroying confidence. Deep social feelings exist while mostly remaining stable.",
      watch_out: "Moderate worry is healthy in safe environments. However, spending too much time around cruel or chaotic people will slowly elevate that moderate worry into severe anxiety. Notice the shift before it takes hold.",
    },
    HL: {
      title: "The Naturally Confident",
      summary: "Loving social events and rarely caring about judgment makes you highly resilient.",
      detail: "High Extraversion means hunting for lively crowds to gain energy. Low Neuroticism means self-worth is never tied to these events. If someone dislikes you, ignoring them and finding someone else is easy. Walking through tough social crowds without getting hurt is the healthiest version of extreme social energy.",
      watch_out: "Because nothing hurts your feelings, you can appear fake or dismissive to nervous people. They need reassurance that everything is fine. Ignoring their fear just because you are fearless damages the friendship.",
    },
    MH: {
      title: "The Quietly Anxious",
      summary: "Socializing normally is a skill you have mastered, but it hides a significant amount of secret anxiety.",
      detail: "Moderate Extraversion allows for necessary social interaction. High Neuroticism means overthinking everything said during those interactions. Replaying normal conversations to look for mistakes is a daily routine. You feel much more pain than anyone realizes, as the fear is very real, but hidden beautifully.",
      watch_out: "The calm exterior shown to the world conflicts sharply with the panicked interior. To resolve this, you must either communicate your fears to trusted people or stop socializing in environments that trigger the panic.",
    },
    MM: {
      title: "The Social Middle",
      summary: "Viewing social events as perfectly normal means they rarely excite or scare you.",
      detail: "Neither trait dominates. Walking into a room, conversing, and going home is a simple process. Massive thrills and crushing anxiety are both absent. While it sounds boring, it is highly effective. Extreme social energy or fear frequently ruins lives, and you are safely insulated from both.",
      watch_out: "Feeling no strong emotions in crowds means missing important hidden signals. If a friend is secretly hurting, a perfectly normal mood might make you blind to their pain. Active observation is required.",
    },
    ML: {
      title: "The Functional Extrovert",
      summary: "Enjoying a normal social life and letting insults bounce off you is your superpower.",
      detail: "Moderate Extraversion allows for enjoyable occasional socializing. Low Neuroticism means social mistakes are rarely taken seriously. Situations that make others cry often make you laugh. Engaging when desired, walking away when bored, and carrying no heavy feelings home is the pattern.",
      watch_out: "Perfect calm during arguments makes you appear uncaring. When a friend is upset, they look for an emotional response. Staying entirely flat will likely escalate their frustration.",
    },
    LH: {
      title: "The Anxious Loner",
      summary: "Large crowds are draining, but being alone frequently brings its own deep fear.",
      detail: "Low Extraversion dictates a preference for being alone. High Neuroticism means that quiet room is often filled with dark thoughts. Running away from crowds to feel safe is the instinct, but once alone, overthinking old conversations and worrying about the future begins. You are caught between two uncomfortable states.",
      watch_out: "Spending more time alone cannot cure fear that lives in the mind, and forcing attendance at parties only exhausts you. Focus must be placed entirely on addressing the anxious thought patterns themselves.",
    },
    LM: {
      title: "The Reserved Moderate",
      summary: "Preferring quiet time is normal, and it often comes with a small amount of social guilt.",
      detail: "Low Extraversion means crowds are tiring. Moderate Neuroticism adds a slight worry about your social life. Terror is rare, but perfect calm is also uncommon. Reading social clues is a hidden strength, and replaying quiet conversations in your head happens frequently.",
      watch_out: "Hiding mild anxiety so well means people never know when they have hurt your feelings, nor do they know when you truly enjoyed their company. Learning to show feelings slightly more often builds better connections.",
    },
    LL: {
      title: "The Contented Loner",
      summary: "Needing people is rare, and worrying about being alone is even rarer.",
      detail: "Low Extraversion makes solitude the natural preference. Low Neuroticism ensures this loneliness never causes sadness or anxiety. Most introverts secretly wish for more friends, but your inner world is completely full. Needing anyone else to fix or validate it is entirely unnecessary.",
      watch_out: "Long-term isolation carries a hidden cost. The perfect peace felt now is real, but checking in occasionally to ensure it is still happiness—and not just numbness—is a healthy practice.",
    },
  },

  // ══════════════════════════════════════════
  // A + N — Agreeableness × Neuroticism
  // The care axis: how warmth meets emotional load
  // ══════════════════════════════════════════
  "A+N": {
    HH: {
      title: "The Emotional Sponge",
      summary: "Absorbing everyone's pain is your default, and you carry it almost entirely alone.",
      detail: "High Agreeableness means instantly noticing when others are hurting. High Neuroticism means absorbing their pain into your own body. Saying yes when you desperately want to say no happens because disappointing someone feels like physical pain. Apologizing even when you are right is a defense mechanism. Severe burnout is a constant threat.",
      watch_out: "Refusing to say 'no' does not protect anyone; it simply builds a wall of secret resentment inside you. Those who truly care want you to protect yourself. Setting small boundaries immediately is necessary.",
    },
    HM: {
      title: "The Caring Moderate",
      summary: "Being very kind and caring deeply about others happens without losing control over your own life.",
      detail: "High Agreeableness makes you highly loving and warm. Moderate Neuroticism means feeling the pain of friends without letting it destroy your own stability. Caring deeply about relationships without constantly panicking over them is your strength. You offer comfort without falling into severe depression yourself.",
      watch_out: "This healthy balance works well in normal times. However, if a close friend experiences a massive tragedy, moderate worry can escalate into severe pain. Extra care is required during these hard times.",
    },
    HL: {
      title: "The Grounded Giver",
      summary: "Incredible kindness and perfect stability allow you to give without fear.",
      detail: "High Agreeableness means constantly focusing on helping others. Low Neuroticism means doing this purely from love, not from a fear of being rejected. Helping people happens because you want to, not because you are terrified they will leave you. Caring for difficult people for years without burning out is possible for you.",
      watch_out: "Because you are so stable and kind, people assume you can fix all their problems and will lean on you endlessly. Boldly stating when you have reached your limit is required to protect your energy.",
    },
MH: {
       title: "The Selective Reactor",
       summary: "Warmth is present, but defensive anger frequently arrives first when under stress.",
       detail: "Moderate Agreeableness allows for kindness in safe situations. High Neuroticism causes panic when things get slightly difficult. Feeling easily attacked turns small disagreements into perceived insults. Natural warmth is real, but it requires a calm room to appear; under stress, lashing out is the immediate response.",
       watch_out: "Defensive anger moves faster than kindness. During an argument, the angry version of you speaks before the rational one. Practicing a ten-second pause before replying to a perceived insult changes the dynamic entirely.",
     },
MM: {
       title: "The Functional Middle",
       summary: "Normal politeness and normal calm make you highly stable in relationships.",
       detail: "Neither extreme controls the reaction. Being nice when the situation requires it and getting slightly upset when friends fight—without losing your mind—is the pattern. High consistency means rarely offering massive comfort, but also rarely causing massive fights. People find this predictability very easy to live with.",
       watch_out: "Perfectly normal behavior is stable, but rarely creates deep passion. Close people in your life might eventually misinterpret this steadiness as disengagement. Consciously showing deep, strong emotion occasionally is necessary.",
     },
     ML: {
      title: "The Stable Pragmatist",
      summary: "Moderate warmth and high calm keep you from losing your steady balance.",
      detail: "Moderate Agreeableness allows kindness toward those who earn it. Low Neuroticism means almost never panicking. When a relationship gets rocky, staying completely flat is the natural response. The drama that ruins most relationships bounces off you, making you incredibly reliable day after day.",
      watch_out: "Perfect calm frequently looks like a lack of care. When someone close is upset, they look for an emotional response. Staying entirely flat makes them feel completely alone in the problem.",
    },
    LH: {
      title: "The Defensive Realist",
      summary: "High bluntness and high defensiveness combine to easily create endless friction.",
      detail: "Low Agreeableness brings a natural love for arguing and winning. High Neuroticism ensures these arguments carry significant emotional pain. Dishing out harsh truths is easy, but panicking when criticized in return is common. Being experienced as both mean and highly sensitive makes long-term relationships very difficult.",
      watch_out: "The instinct to fight back instantly triggers before understanding the actual problem. Most people are not attacking. Learning to stop viewing every comment as an act of war is essential for peace.",
    },
    LM: {
      title: "The Direct Moderate",
      summary: "High bluntness is followed by a small amount of guilt after speaking.",
      detail: "Low Agreeableness means saying exactly what you think, regardless of feelings. Moderate Neuroticism brings a slight sting when those words cause hurt. You notice the damage caused, but simply refuse to alter the honest words just to fix it.",
      watch_out: "That tiny bit of guilt is a signal that a line was crossed. Listening to that guilt is advisable. It is entirely possible to be perfectly honest without being unnecessarily cruel.",
    },
    LL: {
      title: "The Detached Pragmatist",
      summary: "Rarely warm and rarely anxious, the world looks like a chess game to be managed.",
      detail: "Low Agreeableness allows social rules to be ignored to achieve a goal. Low Neuroticism means zero guilt or stress is felt while doing so. Operating with pure logic and cold efficiency feels like perfect clarity internally, but externally, it feels like dealing with a highly effective machine.",
      watch_out: "Getting exactly what is desired is a frequent success. The problem arises when the people around you realize the connection lacks genuine care. Building true loyalty eventually requires learning to show warmth.",
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
 * HH / HL / LH / LL  -> high   (both traits show a clear signal)
 * HM / MH / LM / ML  -> medium (one trait clear, one flexible)
 * MM                 -> low    (both traits are flexible/mid-range)
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
 * QUICK TEST — uncomment this block and run:  node ocean-insights-v3.js
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
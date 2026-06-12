import questions from '../data/questions.json' with { type: 'json' };

/**
 * Calculates the OCEAN scores based on user responses.
 * 
 * @param {Object} answers - Object mapping question ID (e.g., "q1") to Likert response (1 to 5).
 * @returns {Object} Calculated scores and insights.
 */
export function calculatePersonality(answers) {
  // Initialize scores structure
  const traits = {
    O: { sum: 0, count: 0 },
    C: { sum: 0, count: 0 },
    E: { sum: 0, count: 0 },
    A: { sum: 0, count: 0 },
    N: { sum: 0, count: 0 }
  };

  // Loop through questions to compute sums and counts
  questions.forEach(q => {
    const answer = answers[q.id];
    // Only count questions that have been answered (answers should be 1, 2, 3, 4, or 5)
    if (answer !== undefined && answer !== null && answer >= 1 && answer <= 5) {
      const keyedScore = q.direction === 1 ? answer : (6 - answer);
      traits[q.trait].sum += keyedScore;
      traits[q.trait].count += 1;
    }
  });

  // Calculate percentage scores (0 to 100) using Min-Max normalization
  const scores = {};
  Object.keys(traits).forEach(trait => {
    const { sum, count } = traits[trait];
    if (count > 0) {
      const minPossible = count * 1;
      const maxPossible = count * 5;
      scores[trait] = Math.round(((sum - minPossible) / (maxPossible - minPossible)) * 100);
    } else {
      scores[trait] = 0; // Default to 0 if no questions answered for this trait
    }
  });

  // Generate textual categories and descriptions
  const traitDetails = {};
  Object.keys(scores).forEach(trait => {
    const score = scores[trait];
    let level = 'Medium';
    if (score >= 70) {
      level = 'High';
    } else if (score < 40) {
      level = 'Low';
    }
    
    traitDetails[trait] = {
      score,
      level,
      label: TRAIT_INFO[trait].label,
      description: TRAIT_INFO[trait].levels[level],
      bullets: TRAIT_INFO[trait].bullets[level]
    };
  });

  // Determine composite archetype based on key trait interactions
  const archetype = getArchetype(scores);

  return {
    scores,
    traitDetails,
    archetype
  };
}

// Static Trait Information (Text descriptions matching professional minimalism)
export const TRAIT_INFO = {
  O: {
    label: "Openness to Experience",
    levels: {
      High: "You are highly curious, imaginative, and open to new experiences. You seek novelty, think unconventionally, and are energized by abstract ideas, art, and intellectual discussions.",
      Medium: "You maintain a healthy balance between sticking to comfortable routines and exploring new, creative ideas. You appreciate practical matters but are open to abstract thinking when relevant.",
      Low: "You prefer stability, routine, and concrete realities over abstract theories. You find comfort in the familiar, enjoy practical facts, and prefer straightforward solutions to problems."
    },
    bullets: {
      High: ["Highly imaginative", "Intellectually curious", "Appreciates art and novelty"],
      Medium: ["Pragmatic yet open-minded", "Adapts to routine or novelty", "Balanced perspective"],
      Low: ["Practical and down-to-earth", "Comforted by routines", "Prefers concrete facts"]
    }
  },
  C: {
    label: "Conscientiousness",
    levels: {
      High: "You are highly disciplined, organized, and detail-oriented. You follow a schedule, take your obligations seriously, and work systematically toward long-term goals.",
      Medium: "You are generally dependable and organized, but can adapt and be spontaneous when circumstances change. You balance structure with flexibility.",
      Low: "You prefer flexibility and spontaneity over rigid schedules. You are comfortable with ambiguity, but may struggle with procrastination, details, or completing long-term plans."
    },
    bullets: {
      High: ["Highly organized", "Goal-oriented and disciplined", "Attentive to details"],
      Medium: ["Moderately organized", "Flexible plan follower", "Balances duty and fun"],
      Low: ["Spontaneous and adaptive", "Prefers flow over schedules", "Comfortable with loose ends"]
    }
  },
  E: {
    label: "Extraversion",
    levels: {
      High: "You are outgoing, social, and gain energy by interacting with people. You start conversations easily, enjoy being active, and thrive in collaborative, high-energy settings.",
      Medium: "You are an ambivert, comfortable in social gatherings but also deeply valuing quiet, solitary recharge time. You balance quiet contemplation with social engagement.",
      Low: "You are quiet, reserved, and draw energy from solitary reflection. You prefer small, intimate group settings and find large social gatherings draining."
    },
    bullets: {
      High: ["Energized by crowds", "Outgoing and talkative", "Assertive and expressive"],
      Medium: ["Balanced social battery", "Enjoys both groups and solitude", "Flexible communicator"],
      Low: ["Recharges in quiet settings", "Thoughtful and reserved", "Prefers deep, 1-on-1 connections"]
    }
  },
  A: {
    label: "Agreeableness",
    levels: {
      High: "You are highly empathetic, compassionate, and cooperative. You value harmony, build trust easily, and actively look for ways to help and support others.",
      Medium: "You are generally polite and supportive, but are not afraid to stand your ground or challenge others' opinions when necessary. You balance empathy with assertiveness.",
      Low: "You prioritize logic, objective truths, and individual goals over social harmony. You are competitive and direct, but may sometimes come across as critical or argumentative."
    },
    bullets: {
      High: ["Deeply empathetic", "Cooperative consensus-builder", "Altruistic and trusting"],
      Medium: ["Fair and cooperative", "Capable of directness", "Balanced trust levels"],
      Low: ["Direct and objective", "Competitive and independent", "Challenges assumptions"]
    }
  },
  N: {
    label: "Neuroticism",
    levels: {
      High: "You are emotionally sensitive and highly reactive to stress. You feel things deeply and worry about potential setbacks, which makes you vigilant but prone to anxiety.",
      Medium: "You experience normal emotional ups and downs but generally handle stress well. You are resilient under typical life pressures, maintaining basic stability.",
      Low: "You are exceptionally calm, resilient, and stable under pressure. You rarely worry about things going wrong, bounce back quickly, and maintain a steady, positive outlook."
    },
    bullets: {
      High: ["Highly sensitive to stress", "Vigilant and cautious", "Deeply registers threats"],
      Medium: ["Normally resilient", "Handles typical stress well", "Stablizes quickly"],
      Low: ["Extremely calm and steady", "Bounces back immediately", "Low vulnerability to worry"]
    }
  }
};

/**
 * Computes composite archetype based on key trait interactions.
 */
function getArchetype(scores) {
  const { O, C, E, A, N } = scores;

  // Archetype combinations
  if (O >= 70 && C < 40) {
    return {
      title: "The Creative Explorer",
      description: "You possess a rich imagination and a passion for novelty, but you find structured execution challenging. You thrive when brainstorming and ideating, but need external support or systems to stay on track and finish what you start.",
      strengths: ["Out-of-the-box thinking", "Passion for learning", "Adaptability"],
      blindspots: ["Difficulty with follow-through", "Losing focus easily", "Procrastination"]
    };
  }
  
  if (C >= 70 && N < 40) {
    return {
      title: "The Resilient Anchor",
      description: "Highly disciplined and emotionally steady, you are the rock of any team. You bring organization and high execution capabilities while remaining unshakeable in high-stress scenarios.",
      strengths: ["Dependable execution", "Crisis management", "Attention to detail"],
      blindspots: ["Rigidity to sudden changes", "Over-responsibility", "Reluctance to pivot"]
    };
  }

  if (E >= 70 && A >= 70) {
    return {
      title: "The Harmonizer",
      description: "You are warm, social, and naturally group-oriented. People trust you because of your genuine empathy and collaborative approach, making you a natural bridge-builder.",
      strengths: ["Relationship building", "Consensus gathering", "Active listening"],
      blindspots: ["Avoiding crucial conflicts", "People-pleasing tendencies", "Sustained social exhaustion"]
    };
  }

  if (O >= 70 && E < 40) {
    return {
      title: "The Quiet Visionary",
      description: "You combine deep intellectual curiosity with a preference for solitary reflection. You process ideas deeply, preferring to work independently on complex problems rather than talking them through in large groups.",
      strengths: ["Deep focus", "Original insights", "Self-reliance"],
      blindspots: ["Reluctance to share ideas early", "Social isolation", "Appearing detached"]
    };
  }

  if (C >= 70 && O < 40) {
    return {
      title: "The Practical Builder",
      description: "You thrive on concrete execution, systems, and proven methods. You excel at taking loose concepts and turning them into structured, reliable processes, preferring order and clarity over abstract ambiguity.",
      strengths: ["Operational excellence", "Execution consistency", "Pragmatism"],
      blindspots: ["Resistance to change", "Skeptical of new methods", "Struggles with ambiguity"]
    };
  }

  // Default fallback archetype based on highest score
  const highestTrait = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  switch (highestTrait) {
    case 'O':
      return {
        title: "The Free Thinker",
        description: "Your personality is anchored by a high openness to ideas, beauty, and discovery. You approach life with a curious mind and value abstract learning.",
        strengths: ["Curiosity", "Creativity", "Tolerance of ambiguity"],
        blindspots: ["Over-conceptualization", "Boredom with routine"]
      };
    case 'C':
      return {
        title: "The Diligent Achiever",
        description: "Your personality is anchored by detail, reliability, and planning. You take pride in being orderly, purposeful, and structured.",
        strengths: ["Consistency", "Goal-attainment", "Organization"],
        blindspots: ["Perfectionism", "Difficulty relaxing"]
      };
    case 'E':
      return {
        title: "The Social Catalyst",
        description: "Your personality is anchored by interaction, speech, and activity. You bring life and animation to spaces and thrive when engaging with others.",
        strengths: ["Engaging style", "Team building", "High action orientation"],
        blindspots: ["impulsiveness", "Need for constant stimulation"]
      };
    case 'A':
      return {
        title: "The Compassionate Guide",
        description: "Your personality is anchored by empathy, trust, and service. You look out for others and place value on interpersonal harmony.",
        strengths: ["Altruism", "Supportiveness", "Conflict resolution"],
        blindspots: ["Agreeing too quickly", "Sacrificing self-needs"]
      };
    case 'N':
      default:
      if (scores.N >= 60) {
        return {
          title: "The Vigilant Guard",
          description: "Your personality is highly sensitive to environment, risk, and change. You notice potential problems early, making you exceptionally thorough.",
          strengths: ["Risk mitigation", "Empathy to suffering", "Diligence"],
          blindspots: ["Overthinking", "High stress vulnerability"]
        };
      } else {
        return {
          title: "The Balanced Centrist",
          description: "You possess a balanced personality that avoids extreme high/low behaviors. You adapt fluidly to change and work well in moderate environments.",
          strengths: ["Emotional adaptability", "Balanced focus", "Flexibility"],
          blindspots: ["May lack strong specialization", "Indecision in extremes"]
        };
      }
  }
}

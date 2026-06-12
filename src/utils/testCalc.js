import { calculatePersonality } from './personalityCalc.js';

console.log("=========================================");
console.log("RUNNING PERSONALITY CALCULATION TESTS...");
console.log("=========================================\n");

// Test Case 1: Neutral answers (all 3s)
// Since neutral responses map to the midpoint, all traits should calculate to exactly 50%
const neutralAnswers = {};
for (let i = 1; i <= 50; i++) {
  neutralAnswers[`q${i}`] = 3;
}
const neutralResult = calculatePersonality(neutralAnswers);
console.log("TEST 1: Neutral Answers (All 3s)");
console.log("Calculated Scores:", neutralResult.scores);
const test1Passed = Object.values(neutralResult.scores).every(score => score === 50);
console.log(`Result: ${test1Passed ? "PASSED ✅" : "FAILED ❌"}\n`);

// Test Case 2: Maximum positive traits / Minimum negative traits (all 5s)
// O: 6 positive, 4 negative -> (6*5 + 4*1) = 34 -> (34 - 10) / 40 * 100 = 60%?
// Wait, let's verify if all 5s are passed:
// If a question is direction +1, answer 5 is keyed to 5.
// If a question is direction -1, answer 5 is keyed to 6 - 5 = 1.
// Let's check for O: 6 positive (6 * 5 = 30) and 4 negative (4 * 1 = 4) -> sum = 34.
// Min possible = 10 * 1 = 10, Max possible = 10 * 5 = 50.
// (34 - 10) / (50 - 10) = 24 / 40 = 60%.
// This is exactly correct! Since the test is a mix of positive and negative questions, 
// answering all 5s does not give 100% for all traits (because you agreed to things like
// "I prefer routines rather than trying new things" which is negative-keyed for Openness).
// This proves the direction-keying is mathematically correct!
console.log("TEST 2: All 5s (Agreement with both positive and negative statements)");
const allFivesAnswers = {};
for (let i = 1; i <= 50; i++) {
  allFivesAnswers[`q${i}`] = 5;
}
const allFivesResult = calculatePersonality(allFivesAnswers);
console.log("Calculated Scores:", allFivesResult.scores);
console.log("O should be 60% (6 * 5 + 4 * 1 = 34 -> 24/40 = 60%):", allFivesResult.scores.O === 60 ? "PASSED ✅" : "FAILED ❌");
console.log("C should be 60% (6 * 5 + 4 * 1 = 34 -> 24/40 = 60%):", allFivesResult.scores.C === 60 ? "PASSED ✅" : "FAILED ❌");
console.log("E should be 60% (6 * 5 + 4 * 1 = 34 -> 24/40 = 60%):", allFivesResult.scores.E === 60 ? "PASSED ✅" : "FAILED ❌");
console.log("A should be 60% (6 * 5 + 4 * 1 = 34 -> 24/40 = 60%):", allFivesResult.scores.A === 60 ? "PASSED ✅" : "FAILED ❌");
console.log("N should be 60% (6 * 5 + 4 * 1 = 34 -> 24/40 = 60%):", allFivesResult.scores.N === 60 ? "PASSED ✅" : "FAILED ❌");
console.log("");

// Test Case 3: Fully Keyed Responses (100% for all traits)
// To get 100%, we answer 5 for direction 1, and 1 for direction -1
const maxAnswers = {
  // Openness (O): 1(+), 2(+), 3(-), 4(+), 5(-), 6(+), 7(-), 8(+), 9(-), 10(+)
  q1: 5, q2: 5, q3: 1, q4: 5, q5: 1, q6: 5, q7: 1, q8: 5, q9: 1, q10: 5,
  // Conscientiousness (C): 11(+), 12(-), 13(+), 14(-), 15(+), 16(-), 17(+), 18(-), 19(+), 20(+)
  q11: 5, q12: 1, q13: 5, q14: 1, q15: 5, q16: 1, q17: 5, q18: 1, q19: 5, q20: 5,
  // Extraversion (E): 21(+), 22(-), 23(+), 24(-), 25(+), 26(-), 27(+), 28(-), 29(+), 30(+)
  q21: 5, q22: 1, q23: 5, q24: 1, q25: 5, q26: 1, q27: 5, q28: 1, q29: 5, q30: 5,
  // Agreeableness (A): 31(+), 32(-), 33(+), 34(+), 35(-), 36(+), 37(-), 38(+), 39(-), 40(+)
  q31: 5, q32: 1, q33: 5, q34: 5, q35: 1, q36: 5, q37: 1, q38: 5, q39: 1, q40: 5,
  // Neuroticism (N): 41(+), 42(-), 43(+), 44(+), 45(-), 46(+), 47(-), 48(+), 49(-), 50(+)
  q41: 5, q42: 1, q43: 5, q44: 5, q45: 1, q46: 5, q47: 1, q48: 5, q49: 1, q50: 5
};
const maxResult = calculatePersonality(maxAnswers);
console.log("TEST 3: Maximum Target Answers (Direction-Keyed 100% Scores)");
console.log("Calculated Scores:", maxResult.scores);
const test3Passed = Object.values(maxResult.scores).every(score => score === 100);
console.log(`Result: ${test3Passed ? "PASSED ✅" : "FAILED ❌"}\n`);

// Test Case 4: Archetype check for "Creative Explorer" (O >= 70, C < 40)
const creativeExplorerAnswers = {
  // High Openness: answers favoring + direction and opposing - direction
  q1: 5, q2: 5, q3: 1, q4: 5, q5: 1, q6: 5, q7: 1, q8: 5, q9: 1, q10: 5, // 100% Openness
  // Low Conscientiousness: answers opposing + direction and favoring - direction
  q11: 1, q12: 5, q13: 1, q14: 5, q15: 1, q16: 5, q17: 1, q18: 5, q19: 1, q20: 1, // 0% Conscientiousness
};
const creativeExplorerResult = calculatePersonality(creativeExplorerAnswers);
console.log("TEST 4: Archetype Check (The Creative Explorer)");
console.log("Scores: O:", creativeExplorerResult.scores.O, "C:", creativeExplorerResult.scores.C);
console.log("Archetype Title:", creativeExplorerResult.archetype.title);
console.log("Archetype Description:", creativeExplorerResult.archetype.description);
const test4Passed = creativeExplorerResult.archetype.title === "The Creative Explorer";
console.log(`Result: ${test4Passed ? "PASSED ✅" : "FAILED ❌"}\n`);

console.log("=========================================");
console.log("TEST SUITE COMPLETED!");
console.log("=========================================");

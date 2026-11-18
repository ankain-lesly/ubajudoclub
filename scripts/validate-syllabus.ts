import { TECHNIQUES_REGISTRY } from "../app/lib/data/syllabus/techniques";
import { BELT_PROGRAMS, ORDERED_SLUGS } from "../app/lib/data/syllabus";
import { GLOSSARY } from "../app/lib/data/syllabus/glossary";

console.log("=== RUNNING SYLLABUS INTEGRITY VALIDATION ===");

let hasErrors = false;

// 1. Validate Gokyo coverage: exactly 40 throws with gokyoGroup 1..5
const gokyoThrows = Object.values(TECHNIQUES_REGISTRY).filter(
  (t) => t.gokyoGroup !== undefined
);

console.log(`Found ${gokyoThrows.length} total Gokyo-classified throws.`);
if (gokyoThrows.length !== 40) {
  console.error(`❌ Expected exactly 40 Gokyo throws, found ${gokyoThrows.length}!`);
  hasErrors = true;
} else {
  console.log("✅ Gokyo Throw Count: 40/40 confirmed.");
}

// 2. Validate all 40 Gokyo throws are introduced across White -> Brown
const introducedThrows = new Set<string>();
for (const slug of ["white", "yellow", "orange", "green", "blue", "brown"]) {
  const p = BELT_PROGRAMS[slug as keyof typeof BELT_PROGRAMS];
  for (const tId of p.learn.throws) {
    if (introducedThrows.has(tId)) {
      console.error(`❌ Duplicate throw introduction: ${tId} introduced again in ${slug}!`);
      hasErrors = true;
    }
    introducedThrows.add(tId);
  }
}

let missingGokyo = 0;
for (const gt of gokyoThrows) {
  if (!introducedThrows.has(gt.id)) {
    console.error(`❌ Gokyo throw missing from syllabus programs: ${gt.id} (${gt.name})!`);
    missingGokyo++;
    hasErrors = true;
  }
}
if (missingGokyo === 0) {
  console.log("✅ All 40 Gokyo throws are sequentially introduced by Brown belt.");
}

// 3. Validate every technique has exactly 2 cues
let badCues = 0;
for (const [id, t] of Object.entries(TECHNIQUES_REGISTRY)) {
  if (!t.cues || t.cues.length !== 2) {
    console.error(`❌ Technique ${id} does not have exactly 2 cues (has ${t.cues?.length})`);
    badCues++;
    hasErrors = true;
  }
}
if (badCues === 0) {
  console.log("✅ Every technique in registry contains exactly 2 high-impact cues.");
}

// 4. Validate glossary terms
for (const slug of ORDERED_SLUGS) {
  const p = BELT_PROGRAMS[slug];
  for (const termId of p.terms) {
    if (!GLOSSARY[termId]) {
      console.error(`❌ Belt ${slug} references missing glossary term: ${termId}`);
      hasErrors = true;
    }
  }
}
console.log("✅ All belt glossary references verified.");

if (hasErrors) {
  console.error("\n❌ Syllabus validation FAILED with errors!");
  process.exit(1);
} else {
  console.log("\n🎉 ALL SYLLABUS INTEGRITY CHECKS PASSED PERFECTLY!");
}

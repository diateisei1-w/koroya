/**
 * KOROYA Phase 5 Automated Test Suite
 * Validates search filters, accent insensitivity, recommendation engine,
 * data integrity, and security rules.
 */

import { DEMO_OPPORTUNITIES } from '../src/data/opportunities';
import { trackingService } from '../src/lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

// Accent and apostrophe normalization helper for testing
function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, ' ')
    .toLowerCase()
    .trim();
}

console.log('========================================================');
console.log('KOROYA PHASE 5: RUNNING AUTOMATED VERIFICATION SUITE');
console.log('========================================================\n');

// TEST SUITE 1: DATA INTEGRITY & HONESTY RULES
console.log('--- Test Suite 1: Data Integrity & Honesty Rules ---');
assert(DEMO_OPPORTUNITIES.length >= 8, `Dataset contains ${DEMO_OPPORTUNITIES.length} opportunities`);

DEMO_OPPORTUNITIES.forEach((opp) => {
  assert(Boolean(opp.id && opp.title && opp.organization), `Opportunity ${opp.id} has valid title & organization`);
  assert(Boolean(opp.fundingAmount && (opp.fundingAmount.includes('FCFA') || opp.fundingAmount.includes('intégrale') || opp.fundingAmount.includes('Non rémunéré'))), `${opp.id} funding is specified in FCFA or clear terms`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(opp.deadline), `${opp.id} deadline follows ISO YYYY-MM-DD format (${opp.deadline})`);
  assert(Boolean(opp.source && opp.lastVerifiedDate), `${opp.id} has documented official source and verification date`);
  assert(opp.isDemo === true, `${opp.id} is explicitly labeled as DEMO per honesty rules`);
  assert(opp.officialUrl.startsWith('https://'), `${opp.id} official URL uses secure HTTPS protocol`);
});

// TEST SUITE 2: SEARCH ENGINE & ACCENT-INSENSITIVE MATCHING
console.log('\n--- Test Suite 2: Search Engine & Accent Normalization ---');

function searchMatches(query: string, opp: typeof DEMO_OPPORTUNITIES[0]): boolean {
  const queryTokens = normalizeText(query).split(/\s+/).filter(Boolean);
  const targets = [
    opp.title,
    opp.organization,
    opp.description,
    opp.field,
    opp.targetAudience,
    opp.location,
    opp.fundingAmount,
    ...opp.eligibleCountries,
    ...opp.eligibility
  ].map((t) => normalizeText(t)).join(' ');

  return queryTokens.every((token) => targets.includes(token));
}

// Test accent normalization: 'cote d ivoire' should match 'Côte d’Ivoire'
const ciMatches = DEMO_OPPORTUNITIES.filter((opp) => searchMatches('cote d ivoire', opp));
assert(ciMatches.length > 0, `Search query 'cote d ivoire' matches ${ciMatches.length} items without accent sensitivity`);

// Test accent normalization: 'ingenieur' should match 'Ingénieur'
const ingMatches = DEMO_OPPORTUNITIES.filter((opp) => searchMatches('ingenieur', opp));
assert(ingMatches.length > 0, `Search query 'ingenieur' matches ${ingMatches.length} engineering listings`);

// Test search on MESRS
const mesrsMatches = DEMO_OPPORTUNITIES.filter((opp) => searchMatches('mesrs', opp));
assert(mesrsMatches.length >= 1, `Search query 'mesrs' correctly retrieves MESRS CI opportunities`);

// Test search on CAMES
const camesMatches = DEMO_OPPORTUNITIES.filter((opp) => searchMatches('cames', opp));
assert(camesMatches.length >= 1, `Search query 'cames' correctly retrieves CAMES opportunities`);

// Test search on FCFA
const fcfaMatches = DEMO_OPPORTUNITIES.filter((opp) => searchMatches('fcfa', opp));
assert(fcfaMatches.length >= 5, `Search query 'fcfa' finds funded listings (${fcfaMatches.length} found)`);

// TEST SUITE 3: DETERMINISTIC RECOMMENDATION ENGINE
console.log('\n--- Test Suite 3: Deterministic Recommendation Engine ---');
const sampleProfile = {
  id: 'test-user',
  email: 'aya@koroya.ci',
  fullName: 'Aya Koffi',
  educationLevel: 'Bac+5 (Master)' as const,
  interests: ['Bourses d’Études MESRS', 'Informatique & Cloud'],
  preferredCountries: ['Côte d’Ivoire']
};

const scored = DEMO_OPPORTUNITIES.map((opp) => {
  const match = trackingService.calculateOpportunityMatch(sampleProfile, opp);
  return { id: opp.id, title: opp.title, score: match.score, reasons: match.reasons };
});

const topScore = scored.reduce((max, s) => Math.max(max, s.score), 0);
assert(topScore >= 80, `Profile matching engine successfully awards top relevance scores (Max: ${topScore}%)`);
assert(scored.every((s) => s.score >= 30 && s.score <= 100), 'All match scores strictly bound between 30% and 100%');
assert(scored.some((s) => s.reasons.length > 0), 'Explanations generated for matched recommendations');

// TEST SUITE 4: SECURITY AUDIT & CONFIGURATION
console.log('\n--- Test Suite 4: Security Rules & Vulnerability Audit ---');

// Check .gitignore excludes .env
const gitignoreContent = fs.readFileSync(path.resolve('.gitignore'), 'utf-8');
assert(gitignoreContent.includes('.env*') && gitignoreContent.includes('!.env.example'), '.gitignore properly excludes .env while keeping .env.example');

// Check .env.example does not contain real secret keys
const envExampleContent = fs.readFileSync(path.resolve('.env.example'), 'utf-8');
assert(!envExampleContent.includes('service_role') || envExampleContent.includes('NEVER put your "service_role"'), '.env.example warns against service_role key');
assert(!envExampleContent.includes('eyJh') && !envExampleContent.includes('secret_'), '.env.example has zero hardcoded secret tokens');

// Check vercel.json headers
const vercelContent = fs.readFileSync(path.resolve('vercel.json'), 'utf-8');
const vercelJson = JSON.parse(vercelContent);
const headers = vercelJson.headers?.[0]?.headers || [];
const cspHeader = headers.find((h: any) => h.key === 'Content-Security-Policy');
const frameHeader = headers.find((h: any) => h.key === 'X-Frame-Options');
const typeHeader = headers.find((h: any) => h.key === 'X-Content-Type-Options');

assert(Boolean(cspHeader), 'vercel.json contains Content-Security-Policy');
assert(frameHeader?.value === 'DENY', 'vercel.json enforces X-Frame-Options: DENY');
assert(typeHeader?.value === 'nosniff', 'vercel.json enforces X-Content-Type-Options: nosniff');

// Check source code for forbidden methods: dangerouslySetInnerHTML and eval
const appTsxContent = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
assert(!appTsxContent.includes('dangerouslySetInnerHTML'), 'src/App.tsx does NOT use dangerouslySetInnerHTML');
assert(!appTsxContent.includes('eval('), 'src/App.tsx does NOT use eval');

console.log('\n========================================================');
console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('========================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

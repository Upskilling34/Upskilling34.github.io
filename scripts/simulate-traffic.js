#!/usr/bin/env node

/*
 * Sends anonymized sample usage to PostHog so the ABC Tutoring dashboard has
 * realistic data to demonstrate. Run locally with: node scripts/simulate-traffic.js
 *
 * The script reads POSTHOG_PROJECT_API_KEY from the Git-ignored .env file.
 */
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  throw new Error('Missing .env. Add POSTHOG_PROJECT_API_KEY before running this script.');
}

const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
    .filter(line => line && !line.trim().startsWith('#'))
    .map(line => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    })
);
const apiKey = env.POSTHOG_PROJECT_API_KEY;
if (!apiKey) throw new Error('POSTHOG_PROJECT_API_KEY is not set in .env.');

const endpoint = 'https://us.i.posthog.com/i/v0/e/';
const now = Date.now();
const tutors = [
  ['maya-chen', 'Maya Chen'], ['marcus-johnson', 'Marcus Johnson'],
  ['elena-rodriguez', 'Elena Rodriguez'], ['david-kim', 'David Kim'],
  ['aisha-patel', 'Aisha Patel'], ['noah-williams', 'Noah Williams']
];
// Math-heavy interest reflects Dana's current demand; a few incomplete journeys
// ensure the funnel also demonstrates booking drop-off.
const journeys = [
  ['Elementary Math', '6–8', 'Online', true], ['Elementary Math', '3–5', 'In person', true],
  ['Algebra II', '9–12', 'Online', true], ['Science', '6–8', 'In person', true],
  ['Elementary Reading', 'K–2', 'Online', false], ['Elementary Math', '6–8', 'In person', false],
  ['Science', '3–5', 'Online', false], ['Pre-Algebra / Algebra I', '6–8', 'In person', true],
  ['Elementary Math', 'K–2', 'Online', false], ['Algebra II', '9–12', 'In person', false],
  ['Elementary Math', '3–5', 'Online', true], ['Science', '6–8', 'Online', false]
];

async function capture(event, distinctId, properties = {}) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      event,
      properties: {
        distinct_id: distinctId,
        $insert_id: `${distinctId}-${event}-${Math.random().toString(36).slice(2)}`,
        $time: new Date(now - Math.floor(Math.random() * 7 * 86400000)).toISOString(),
        source: 'assessment_demo_simulation',
        ...properties
      }
    })
  });
  if (!response.ok) throw new Error(`${event} failed: ${response.status} ${await response.text()}`);
}

async function simulateJourney(journey, index) {
  const [subject, grade, format, completes] = journey;
  const [tutorId, tutorName] = tutors[index % tutors.length];
  const distinctId = `demo-parent-${String(index + 1).padStart(2, '0')}`;
  const base = { tutor_id: tutorId, tutor_name: tutorName };
  await capture('tutor_directory_viewed', distinctId, { page: 'home' });
  await capture('tutor_profile_viewed', distinctId, base);
  await capture('booking_started', distinctId, base);
  await capture('subject_selected', distinctId, { ...base, subject, booking_completed: false });
  if (!completes) return;
  const selectedDateTime = `Demo slot ${index + 1}, 5:00 PM`;
  const booking = { ...base, subject, student_grade: grade, session_format: format, selected_date_time: selectedDateTime };
  await capture('availability_slot_selected', distinctId, { ...base, selected_date_time: selectedDateTime });
  await capture('booking_submitted', distinctId, booking);
  await capture('booking_confirmed', distinctId, booking);
  await capture('subject_selected', distinctId, { ...base, subject, booking_completed: true });
}

(async () => {
  for (let index = 0; index < journeys.length; index += 1) await simulateJourney(journeys[index], index);
  console.log(`Sent ${journeys.length} anonymized demo visitor journeys to PostHog.`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });

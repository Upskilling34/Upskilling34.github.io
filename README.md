# ABC Tutoring

A warm, parent-focused booking prototype for a local K-12 tutoring service.

**Live website:** [upskilling34.github.io](https://upskilling34.github.io/)
**Customer presentation:** [ABC Tutoring follow-up PDF](output/pdf/ABC_Tutoring_Follow_Up.pdf)

## What families can do

- Browse all six tutors.
- Compare subjects, grade levels, hourly rates, and upcoming availability.
- Book a 60-minute online or in-person session.
- Share parent and student details with the booking request.
- Receive a clear booking confirmation.

Booked times disappear immediately and remain unavailable after refresh using browser `localStorage`. This keeps the GitHub Pages prototype simple while demonstrating the intended scheduling behavior.

## Designed for Dana's service

ABC Tutoring serves K-12 students, especially middle-school families, with elementary math through Algebra II, science, and elementary reading. The site emphasizes the things parents said they need to decide quickly:

- The right tutor for their child's subject and grade
- Clear pricing ($40-$55 per hour)
- After-school and early-evening availability
- A choice between online and in-person sessions

## Analytics with PostHog

The prototype records the key moments Dana wants to understand:

| Event | What it helps Dana learn |
| --- | --- |
| `tutor_directory_viewed` | Overall interest in the tutor directory |
| `tutor_profile_viewed` | Which tutors families explore |
| `booking_started` | How many families begin a booking |
| `subject_selected` | Subject demand, including unfinished bookings |
| `availability_slot_selected` | Which times families consider |
| `booking_submitted` / `booking_confirmed` | Completed bookings and conversion |

Booking events include useful context such as tutor, subject, student grade, session format, and selected time. The project uses the PostHog browser project token, which is intentionally write-only and safe to expose in a client-side app. The local `.env` backup is excluded from Git.

## Demo traffic

To populate a customer-facing PostHog dashboard with anonymized sample activity, run:

```sh
node scripts/simulate-traffic.js
```

The script reads the token from the ignored `.env` file and sends twelve synthetic parent journeys. It includes both completed and unfinished bookings to demonstrate subject demand and booking drop-off.

## Assessment materials

- [Customer requirements summary](DANA_REQUIREMENTS_SUMMARY.md)
- [Customer presentation PDF](output/pdf/ABC_Tutoring_Follow_Up.pdf)
- [Traffic simulation script](scripts/simulate-traffic.js)

## Local preview

This is a dependency-free static site. Serve the project directory with any static server, then open the local address in a browser:

```sh
python3 -m http.server 4173
```

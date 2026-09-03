# ABC Tutoring — Dana Requirements Summary

## Purpose

ABC Tutoring needs a simple website that lets parents find a suitable tutor and book a session, reducing Dana's current phone-based booking workload.

## Audience and services

- Primary audience: parents; students are the secondary audience.
- Students served: K–12, with a particular focus on middle-school students.
- Subjects: elementary math through Algebra II, science, and elementary reading.
- Priority subject: math, because it generates the most parent interest.
- Delivery options: online and in-person sessions.
- Service area: describe ABC Tutoring as a local tutoring service; do not name the suburb in the prototype.
- Differentiator: a small, local tutoring service where parents select an individual tutor based on their child's subject and needs—not a large test-prep chain.

## Website experience

The website should feel warm, friendly, clean, local, and professional. It should avoid a dark or corporate appearance.

Homepage introduction: “Personalized tutoring for students in grades K–12, online or in person.”

The primary visitor journey is:

1. Browse tutors.
2. Compare their subjects, grade levels, prices, and availability.
3. Select a suitable tutor and an open appointment time.
4. Submit the booking details.
5. See a confirmation with the selected tutor and scheduled time.

Browsing a tutor directory is sufficient; Dana does not need a recommendation quiz, ratings system, or advanced filtering/search for this prototype.

## Tutor information

Each tutor card or profile should show:

- Name
- Photo
- Subjects
- Grade levels served
- Hourly rate
- Availability

The prototype should represent all six tutors. Use realistic sample names and photos until Dana provides the real ones. Use the broad subject categories above for now. Tutor rates should vary from $40–$55 per hour, and sessions should be presented as 60 minutes long.

Use sample, tutor-specific availability that is mostly after school and in the early evening.

Parents especially need to know whether the right tutor is available for their child's subject and what the session costs.

## Booking requirements

Parents should be able to select:

- Tutor
- Available date and time
- Requested subject
- Session format: online or in person
- Parent name and email
- Student first name and grade

After booking, the experience should:

- Confirm that the request was received.
- Display the tutor and scheduled time.
- Remove or mark the selected slot as booked to prevent double-booking.
- Remove the selected availability slot immediately after booking, so another visitor cannot select it.
- Indicate that Dana receives an email and text notification. Email is essential. (For a static prototype, these notifications can be simulated.)

For GitHub Pages, client-side state such as `localStorage` is suitable for keeping booked slots unavailable in the prototype.

## Analytics goals

Dana most wants to understand which subjects parents are looking for. She also wants to know:

- Which tutors receive the most views.
- Whether visitors complete a booking or leave.
- Which tutor, subject, student grade, and appointment time are associated with bookings.

Suggested PostHog events:

- `tutor_directory_viewed`
- `tutor_profile_viewed` with tutor, subjects, and grade levels
- `booking_started` with tutor and subject
- `availability_slot_selected` with tutor, subject, and selected date/time
- `booking_submitted` with tutor, subject, student grade, and selected date/time
- `booking_confirmed` with the same booking details

Suggested dashboard views:

- Subject demand (highest priority), based on selected/requested subjects in both completed and unfinished booking flows.
- Most-viewed tutors.
- Booking conversion funnel: directory/profile view → booking started → booking confirmed.
- Booking details by tutor, subject, student grade, and selected appointment time.

## Open questions

No outstanding questions are required to build the prototype. Use realistic sample tutor names, photos, details, and availability until Dana provides real information.

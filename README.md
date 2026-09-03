# ABC Tutoring prototype

A static GitHub Pages prototype for ABC Tutoring. Parents can browse six tutors, select an available 60-minute session, choose online or in-person delivery, and submit a booking. Booked slots are stored in browser `localStorage` so they disappear from availability after confirmation.

## PostHog events

The site sends these events to PostHog US Cloud: `tutor_directory_viewed`, `tutor_profile_viewed`, `booking_started`, `subject_selected`, `availability_slot_selected`, `booking_submitted`, and `booking_confirmed`.

The client-side PostHog project token is intentionally public: PostHog specifies this write-only project token for browser SDKs. A local copy is retained in the Git-ignored `.env` file.

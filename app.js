const POSTHOG_KEY = 'phc_tNFtyCLRViiG9He2zQSqe3PPkZAmNc8RupzakrK2rDjB';

if (window.posthog) {
  posthog.init(POSTHOG_KEY, { api_host: 'https://us.i.posthog.com', capture_pageview: false, autocapture: true });
  posthog.capture('tutor_directory_viewed', { page: 'home' });
}

const tutors = [
  { id: 'maya-chen', name: 'Maya Chen', subjects: 'Elementary Math · Reading', grades: 'K–5', rate: 40, availability: ['Tue, 4:00 PM', 'Thu, 5:00 PM', 'Sat, 10:00 AM'], photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80' },
  { id: 'marcus-johnson', name: 'Marcus Johnson', subjects: 'Pre-Algebra · Algebra I', grades: '6–9', rate: 50, availability: ['Mon, 5:00 PM', 'Wed, 6:00 PM', 'Fri, 4:00 PM'], photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' },
  { id: 'elena-rodriguez', name: 'Elena Rodriguez', subjects: 'Science · Elementary Math', grades: '3–8', rate: 45, availability: ['Tue, 5:00 PM', 'Thu, 4:00 PM', 'Sun, 3:00 PM'], photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { id: 'david-kim', name: 'David Kim', subjects: 'Algebra I · Algebra II', grades: '8–12', rate: 55, availability: ['Mon, 6:00 PM', 'Wed, 4:30 PM', 'Sat, 1:00 PM'], photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80' },
  { id: 'aisha-patel', name: 'Aisha Patel', subjects: 'Elementary Reading · Science', grades: 'K–6', rate: 45, availability: ['Tue, 4:30 PM', 'Fri, 5:00 PM', 'Sun, 11:00 AM'], photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80' },
  { id: 'noah-williams', name: 'Noah Williams', subjects: 'Math · Science', grades: '6–10', rate: 50, availability: ['Mon, 4:00 PM', 'Thu, 6:00 PM', 'Sat, 11:30 AM'], photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80' }
];

const grid = document.querySelector('#tutor-grid');
const dialog = document.querySelector('#booking-dialog');
const bookingContent = document.querySelector('#booking-content');
const bookedSlots = () => JSON.parse(localStorage.getItem('abc-tutoring-bookings') || '[]');
const track = (event, properties = {}) => window.posthog?.capture(event, properties);

function renderTutors() {
  grid.innerHTML = tutors.map(tutor => `<article class="tutor-card"><img class="tutor-photo" src="${tutor.photo}" alt="${tutor.name}" /><div class="tutor-card-content"><div class="tutor-top"><h3>${tutor.name}</h3><span class="rate">$${tutor.rate}/hr</span></div><p class="tutor-meta">${tutor.subjects}<br>Grades ${tutor.grades}</p><p class="tutor-availability"><strong>Next availability</strong><br>${tutor.availability[0]}</p><button class="button card-button" data-tutor-id="${tutor.id}">View times & book</button></div></article>`).join('');
}

function openBooking(tutor) {
  track('tutor_profile_viewed', { tutor_id: tutor.id, tutor_name: tutor.name, subjects: tutor.subjects, grade_levels: tutor.grades });
  bookingContent.innerHTML = '';
  bookingContent.append(document.querySelector('#booking-template').content.cloneNode(true));
  bookingContent.querySelector('.tutor-name').textContent = tutor.name;
  const slots = bookingContent.querySelector('.slots');
  const unavailable = new Set(bookedSlots().filter(b => b.tutorId === tutor.id).map(b => b.slot));
  const available = tutor.availability.filter(slot => !unavailable.has(slot));
  slots.innerHTML = available.length ? available.map(slot => `<button class="slot" type="button" data-slot="${slot}">${slot}</button>`).join('') : '<p class="tutor-availability">No times are currently available for this tutor.</p>';
  const form = bookingContent.querySelector('#booking-form');
  const submit = form.querySelector('.submit-booking');
  let selectedSlot = '';
  track('booking_started', { tutor_id: tutor.id, tutor_name: tutor.name });
  slots.addEventListener('click', event => {
    const button = event.target.closest('.slot'); if (!button) return;
    slots.querySelectorAll('.slot').forEach(item => item.classList.remove('selected'));
    button.classList.add('selected'); selectedSlot = button.dataset.slot; submit.disabled = false;
    track('availability_slot_selected', { tutor_id: tutor.id, tutor_name: tutor.name, selected_date_time: selectedSlot });
  });
  form.subject.addEventListener('change', () => { if (form.subject.value) track('subject_selected', { subject: form.subject.value, tutor_id: tutor.id, tutor_name: tutor.name, booking_completed: false }); });
  form.addEventListener('submit', event => {
    event.preventDefault(); if (!form.reportValidity() || !selectedSlot) return;
    const data = Object.fromEntries(new FormData(form));
    const properties = { tutor_id: tutor.id, tutor_name: tutor.name, subject: data.subject, student_grade: data.grade, session_format: data.format, selected_date_time: selectedSlot };
    localStorage.setItem('abc-tutoring-bookings', JSON.stringify([...bookedSlots(), { tutorId: tutor.id, slot: selectedSlot }]));
    track('booking_submitted', properties); track('booking_confirmed', properties); track('subject_selected', { subject: data.subject, tutor_id: tutor.id, tutor_name: tutor.name, booking_completed: true });
    showConfirmation(tutor, selectedSlot); renderTutors();
  });
  dialog.showModal();
}

function showConfirmation(tutor, slot) {
  bookingContent.innerHTML = ''; bookingContent.append(document.querySelector('#confirmation-template').content.cloneNode(true));
  bookingContent.querySelector('.confirmation-tutor').textContent = tutor.name;
  bookingContent.querySelector('.confirmation-slot').textContent = slot;
  bookingContent.querySelector('.done-button').addEventListener('click', () => dialog.close());
}

grid.addEventListener('click', event => { const button = event.target.closest('[data-tutor-id]'); if (button) openBooking(tutors.find(tutor => tutor.id === button.dataset.tutorId)); });
document.querySelector('.close-button').addEventListener('click', () => dialog.close());
document.querySelectorAll('[data-cta]').forEach(link => link.addEventListener('click', () => track('cta_clicked', { cta: link.dataset.cta })));
renderTutors();

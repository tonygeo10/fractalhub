
 const teamMembers = [
    {
        name: "Νίκος Σίμος",
        role: "Χρηματοοικονομική Στρατηγική",
        bio: "Επικεντρώνεται σε στρατηγική βιωσιμότητας και ανάπτυξης με ορατές επιπτώσεις. Ειδικός στη δημιουργία βιώσιμων επιχειρηματικών μοντέλων.",
        image: "images/nikos.webp" // Η εικόνα σου εδώ
    },
    {
        name: "Ειρήνη Μπρεκουλάκη",
        role: "Marketing & UX/UI",
        bio: "Σχεδιάζει περιεχόμενο και αναλύει δεδομένα για τη δημιουργία εμπειριών που συνδέουν εταιρείες με ανθρώπους.",
        image: "images/eirini.webp.jpg" // Η εικόνα σου εδώ
    },
    {
        name: "Αντώνης Γεωργίου",
        role: "Ανάπτυξη Ιστοσελίδων",
        bio: "Μετατρέπει τη στρατηγική σε λειτουργικά websites και εφαρμογές με τελευταία τεχνολογία.",
        image: "images/antonis.webp.jpg" // Η εικόνα σου εδώ
    }
];

let currentIndex = 0;

// Αρχικοποίηση του Carousel
function initCarousel() {
    const carousel = document.getElementById('carousel-inner');
    const indicators = document.getElementById('indicators');

    if (!carousel || !indicators) return;

    // Δημιουργία των καρτών (slides)
    teamMembers.forEach((member, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.innerHTML = `
            <div class="team-card">
                <img src="${member.image}" alt="${member.name}" class="team-image" onerror="this.src='https://via.placeholder.com/300?text=Error';">
                <div class="team-content">
                    <h3 class="team-name">${member.name}</h3>
                    <p class="team-role">${member.role}</p>
                    <p class="team-bio">${member.bio}</p>
                </div>
            </div>
        `;
        carousel.appendChild(item);

        // Δημιουργία των indicators (dots)
        const dot = document.createElement('div');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(dot);
    });

    // Event Listeners για τα κουμπιά
    document.getElementById('prev-btn').addEventListener('click', prevSlide);
    document.getElementById('next-btn').addEventListener('click', nextSlide);
}

function updateCarousel() {
    const carousel = document.getElementById('carousel-inner');
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;

    // Ενημέρωση των dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % teamMembers.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + teamMembers.length) % teamMembers.length;
    updateCarousel();
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

// Εκκίνηση όταν φορτώσει το DOM
document.addEventListener('DOMContentLoaded', initCarousel);
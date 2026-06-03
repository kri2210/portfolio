const body = document.body;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const form = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const typedRole = document.querySelector("#typedRole");
const counters = document.querySelectorAll(".counter");

const roles = [
    "Full Stack Developer",
    "Machine Learning Enthusiast",
    "Computer Science Student"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function updateHeader() {
    const isScrolled = window.scrollY > 24;
    header.classList.toggle("scrolled", isScrolled);
}

function closeMenu() {
    body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
    const isOpen = body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
}

function typeRole() {
    const currentRole = roles[roleIndex];
    const visibleText = currentRole.slice(0, charIndex);
    typedRole.textContent = visibleText;

    if (!deleting && charIndex < currentRole.length) {
        charIndex += 1;
        setTimeout(typeRole, 70);
        return;
    }

    if (!deleting && charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeRole, 1200);
        return;
    }

    if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeRole, 38);
        return;
    }

    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeRole, 260);
}

function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    const decimal = counter.dataset.decimal === "true";
    const duration = 1300;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        counter.textContent = decimal ? value.toFixed(2) : Math.round(value);

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            counter.textContent = decimal ? target.toFixed(2) : String(target);
        }
    }

    requestAnimationFrame(tick);
}

menuButton.addEventListener("click", toggleMenu);
window.addEventListener("scroll", updateHeader, { passive: true });

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Thank You for reaching out";
    form.reset();
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { rootMargin: "-42% 0px -52% 0px", threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.counted) {
            return;
        }

        entry.target.dataset.counted = "true";
        animateCounter(entry.target);
    });
}, { threshold: 0.45 });

counters.forEach((counter) => counterObserver.observe(counter));

updateHeader();
typeRole();

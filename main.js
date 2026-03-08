/* ========================================
   PSLAB – Website Interactivity
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Navbar scroll effect ---------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("navBurger");
  const navLinks = document.getElementById("navLinks");

  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      burger.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navItems = navLinks.querySelectorAll("a");

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(a => {
          a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
        });
      }
    });
  };
  window.addEventListener("scroll", highlightNav, { passive: true });

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  const observerOptions = {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => revealObserver.observe(el));

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = current + "+";
        }, 35);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("formSuccess");
  const errorMsg = document.getElementById("formError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Gather form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Simple client-side validation is already handled by required attributes
    // In production, you'd POST to a backend or service like Formspree/EmailJS
    // Here we simulate a successful submission
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Wysyłanie…";

    // Build mailto fallback
    const subject = encodeURIComponent(`[PSLAB Website] Zapytanie: ${data.service || 'Ogólne'}`);
    const body = encodeURIComponent(
      `Imię i nazwisko: ${data.name}\nE-mail: ${data.email}\nUsługa: ${data.service}\n\nWiadomość:\n${data.message}`
    );
    const mailtoLink = `mailto:kontakt@pslab.eu?subject=${subject}&body=${body}`;

    // Open mailto and show success
    setTimeout(() => {
      window.location.href = mailtoLink;
      successMsg.style.display = "block";
      errorMsg.style.display = "none";
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Wyślij wiadomość
      `;
      form.reset();
    }, 600);
  });

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

});

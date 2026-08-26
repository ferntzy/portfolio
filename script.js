/* ── Scroll reveal ── */
const revealTargets = document.querySelectorAll(
  ".work-item, .skills-row, .exp-list li"
);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

/* ── Contact form (EmailJS) ── */
emailjs.init("Ocol9-ye4mrd2ulbR");
const EMAILJS_SERVICE = "service_3rhlchh";
const EMAILJS_TEMPLATE = "template_faxhqvv";

const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const btnSpinner = document.getElementById("btnSpinner");
const formStatus = document.getElementById("formStatus");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  submitBtn.disabled = true;
  btnText.hidden = true;
  btnSpinner.hidden = false;
  formStatus.textContent = "";
  formStatus.removeAttribute("data-state");

  const templateParams = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams).then(
    function () {
      submitBtn.disabled = false;
      btnText.hidden = false;
      btnSpinner.hidden = true;
      form.reset();
      formStatus.textContent = "Message sent — thanks for reaching out.";
      formStatus.setAttribute("data-state", "success");
    },
    function (error) {
      submitBtn.disabled = false;
      btnText.hidden = false;
      btnSpinner.hidden = true;
      console.error("EmailJS error:", error);
      formStatus.textContent = "Something went wrong — please try again.";
      formStatus.setAttribute("data-state", "error");
    }
  );
});
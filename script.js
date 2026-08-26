/* ── Scroll reveal ── */
const revealTargets = document.querySelectorAll(
  ".work-item, .skills-row, .exp-list li, .job, .more-projects-list li"
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactForm(name, email, message) {
  if (!name) {
    return "Please enter your name.";
  }
  if (!email) {
    return "Please enter your email.";
  }
  if (!EMAIL_PATTERN.test(email)) {
    return "That email address doesn't look right.";
  }
  if (!message) {
    return "Please add a short message.";
  }
  return null;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  formStatus.textContent = "";
  formStatus.removeAttribute("data-state");

  const validationError = validateContactForm(name, email, message);
  if (validationError) {
    formStatus.textContent = validationError;
    formStatus.setAttribute("data-state", "error");
    Swal.fire({
      icon: "warning",
      title: "Missing details",
      text: validationError,
      confirmButtonColor: "#7a2e2e",
    });
    return;
  }

  submitBtn.disabled = true;
  btnText.hidden = true;
  btnSpinner.hidden = false;

  const templateParams = { name, email, message };

  emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams).then(
    function () {
      submitBtn.disabled = false;
      btnText.hidden = false;
      btnSpinner.hidden = true;
      form.reset();
      formStatus.textContent = "Message sent — thanks for reaching out.";
      formStatus.setAttribute("data-state", "success");
      Swal.fire({
        icon: "success",
        title: "Message sent",
        text: "Thanks for reaching out — I'll get back to you soon.",
        confirmButtonColor: "#7a2e2e",
      });
    },
    function (error) {
      submitBtn.disabled = false;
      btnText.hidden = false;
      btnSpinner.hidden = true;
      console.error("EmailJS error:", error);
      formStatus.textContent = "Something went wrong — please try again.";
      formStatus.setAttribute("data-state", "error");
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Your message didn't send — please try again.",
        confirmButtonColor: "#7a2e2e",
      });
    }
  );
});
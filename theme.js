document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector(".ak-menu-toggle");
  const nav = document.querySelector(".ak-nav");

  if (!button || !nav) return;

  button.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
});

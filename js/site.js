(async function () {

  async function inject(id, url) {
    const el = document.querySelector(id);
    if (!el) return;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error();
      el.innerHTML = await res.text();

      // Depois que o nav for carregado, ativa o link correto + inicia mobile nav
      if (id === "#site-nav") {
        activateCurrentNav();
        initMobileNav(); // ✅ necessário
      }

    } catch (e) {
      el.innerHTML = "";
    }
  }

  function activateCurrentNav() {
    const normalize = (p) => p.replace(/\/+$/, "") || "/";
    const currentPath = normalize(window.location.pathname);

    const links = document.querySelectorAll("[data-nav]");

    links.forEach(link => {
      const href = link.getAttribute("href");
      const linkPath = normalize(new URL(href, window.location.origin).pathname);

      if (currentPath === linkPath) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  await inject("#site-nav", "../partials/nav.html");
  await inject("#site-footer", "../partials/footer.html");

})();

function initMobileNav() {
  const header = document.querySelector(".header");
  if (!header) return;

  const toggle = header.querySelector(".nav-toggle");
  const nav = header.querySelector("[data-nav-menu]");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    setOpen(!isOpen);
  });

  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    setOpen(false);
  });

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    if (header.contains(e.target)) return;
    setOpen(false);
  });

  window.addEventListener("scroll", () => {
    if (nav.classList.contains("is-open")) setOpen(false);
  }, { passive: true });
}

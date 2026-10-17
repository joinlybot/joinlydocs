/*
 * Joinly documentation site JavaScript
 * Loads navbar.html once per page, then initialises shared interactions.
 */

async function loadNavbar() {
    const container = document.getElementById("site-navbar") ||
        document.getElementById("navbar-container");

    if (!container) {
        initialisePage();
        return;
    }

    try {
        const response = await fetch("/navbar.html", { cache: "no-cache" });

        if (!response.ok) {
            throw new Error(`Failed to load navbar: HTTP ${response.status}`);
        }

        container.innerHTML = await response.text();
    } catch (error) {
        console.error("Could not load Joinly navbar:", error);
    }

    initialisePage();
}

function initialisePage() {
    /* MAIN NAVBAR DROPDOWN */
    const dropdown = document.querySelector(".dropdown");
    const button = document.querySelector(".dropdown-btn");
    const menu = document.querySelector(".dropdown-menu");

    if (dropdown && button && menu) {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            dropdown.classList.toggle("active");
        });

        document.addEventListener("click", (event) => {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove("active");
            }
        });

        menu.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        /* FEATURES SUBMENU */
        document.querySelectorAll(".features-dropdown").forEach((item) => {
            const submenu = item.querySelector(".features-menu");
            if (!submenu) return;

            item.addEventListener("mouseenter", () => {
                item.classList.add("active");
            });

            item.addEventListener("mouseleave", () => {
                item.classList.remove("active");
            });
        });
    }

    /* NAVBAR SCROLL EFFECT */
    const navbar = document.querySelector(".navbar");

    if (navbar) {
        const updateNavbar = () => {
            if (window.scrollY > 15) {
                navbar.style.background = "rgba(11,15,22,.90)";
                navbar.style.boxShadow = "0 10px 35px rgba(0,0,0,.35)";
            } else {
                navbar.style.background = "rgba(11,15,22,.65)";
                navbar.style.boxShadow = "none";
            }
        };

        window.addEventListener("scroll", updateNavbar);
        updateNavbar();
    }

    /* FEATURE CARD ANIMATIONS */
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll(".feature-card").forEach((card) => {
            card.classList.add("hidden");
            observer.observe(card);
        });
    }

    /* SMOOTH ANCHOR SCROLLING */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (event) {
            const href = this.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* ESCAPE KEY */
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;

        if (dropdown) dropdown.classList.remove("active");

        document.querySelectorAll(".features-dropdown").forEach((item) => {
            item.classList.remove("active");
        });

        closeJoinLogModal();
    });

    /* ACTIVE NAVBAR LINK */
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/";

    document.querySelectorAll(".dropdown-menu a").forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        let url;
        try {
            url = new URL(href, window.location.origin);
        } catch {
            return;
        }

        if (url.origin !== window.location.origin) return;

        const linkPath = url.pathname.replace(/\/$/, "") || "/";
        if (linkPath === currentPath) link.classList.add("active-link");
    });

    /* PAGE LOAD */
    const markPageLoaded = () => document.body.classList.add("loaded");

    if (document.readyState === "complete") {
        markPageLoaded();
    } else {
        window.addEventListener("load", markPageLoaded, { once: true });
    }

    /* JOIN LOG MODAL */
    const joinLogExample = document.querySelector(".join-log-reference");
    const joinLogModal = document.querySelector("#join-log-modal");
    const closeButtons = document.querySelectorAll("[data-close-join-log]");

    if (joinLogExample && joinLogModal) {
        joinLogExample.addEventListener("click", openJoinLogModal);

        joinLogExample.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openJoinLogModal();
            }
        });

        closeButtons.forEach((closeButton) => {
            closeButton.addEventListener("click", closeJoinLogModal);
        });

        joinLogModal.addEventListener("click", (event) => {
            if (event.target === joinLogModal) closeJoinLogModal();
        });
    }
}

function openJoinLogModal() {
    const modal = document.querySelector("#join-log-modal");
    if (!modal) return;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeJoinLogModal() {
    const modal = document.querySelector("#join-log-modal");
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadNavbar, { once: true });
} else {
    loadNavbar();
}

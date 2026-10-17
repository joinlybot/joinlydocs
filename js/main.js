
async function loadNavbar() {
    const container = document.getElementById("navbar-container");

    if (!container) return;

    try {
        const response = await fetch("/navbar.html");

        if (!response.ok) {
            throw new Error(`Failed to load navbar: ${response.status}`);
        }

        container.innerHTML = await response.text();

        initialiseNavbar();
    } catch (error) {
        console.error("Failed to load navbar:", error);
    }
}

function initialiseNavbar() {

    /*
        MAIN NAVBAR DROPDOWN
    */

    const dropdown = document.querySelector(".dropdown");
    const button = document.querySelector(".dropdown-btn");
    const menu = document.querySelector(".dropdown-menu");

    if (dropdown && button && menu) {

        button.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove("active");
            }
        });

        menu.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        /*
            FEATURES SUBMENU
        */

        const featuresItems =
            document.querySelectorAll(".features-dropdown");

        featuresItems.forEach(featuresItem => {

            const featuresMenu =
                featuresItem.querySelector(".features-menu");

            if (!featuresMenu) return;

            featuresItem.addEventListener("mouseenter", () => {
                featuresItem.classList.add("active");
            });

            featuresItem.addEventListener("mouseleave", () => {
                featuresItem.classList.remove("active");
            });

        });
    }

    /*
        NAVBAR SCROLL EFFECT
    */

    const navbar = document.querySelector(".navbar");

    if (navbar) {

        const updateNavbar = () => {

            if (window.scrollY > 15) {
                navbar.style.background = "rgba(11,15,22,.90)";
                navbar.style.boxShadow =
                    "0 10px 35px rgba(0,0,0,.35)";
            } else {
                navbar.style.background = "rgba(11,15,22,.65)";
                navbar.style.boxShadow = "none";
            }

        };

        window.addEventListener("scroll", updateNavbar);
        updateNavbar();
    }

    /*
        FEATURE CARD ANIMATIONS
    */

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }

            });

        }, {
            threshold: 0.15
        });

        document.querySelectorAll(".feature-card").forEach(card => {
            card.classList.add("hidden");
            observer.observe(card);
        });

    }

    /*
        SMOOTH ANCHOR SCROLLING
    */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const href = this.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });

    });

    /*
        ESCAPE KEY
    */

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            if (dropdown) {
                dropdown.classList.remove("active");
            }

            document
                .querySelectorAll(".features-dropdown")
                .forEach(item => {
                    item.classList.remove("active");
                });

        }

    });

    /*
        ACTIVE DROPDOWN LINK
    */

    const current = window.location.pathname.replace(/\/$/, "");

    document.querySelectorAll(".dropdown-menu a").forEach(link => {

        const href = link.getAttribute("href");

        if (!href) return;

        let linkUrl;

        try {
            linkUrl = new URL(href, window.location.origin);
        } catch {
            return;
        }

        if (linkUrl.origin !== window.location.origin) return;

        const normalizedHref = linkUrl.pathname.replace(/\/$/, "");

        if (normalizedHref === current) {
            link.classList.add("active-link");
        }

    });

    /*
        PAGE LOAD
    */

    const markLoaded = () => {
        document.body.classList.add("loaded");
    };

    if (document.readyState === "complete") {
        markLoaded();
    } else {
        window.addEventListener("load", markLoaded, { once: true });
    }

    /*
        JOIN LOG MODAL
    */

    const joinLogExample =
        document.querySelector(".join-log-reference");

    const joinLogModal =
        document.querySelector("#join-log-modal");

    const closeJoinLogButtons =
        document.querySelectorAll("[data-close-join-log]");

    if (joinLogExample && joinLogModal) {

        const openJoinLog = () => {

            joinLogModal.classList.add("active");

            joinLogModal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add("modal-open");

        };

        const closeJoinLog = () => {

            joinLogModal.classList.remove("active");

            joinLogModal.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove("modal-open");

        };

        joinLogExample.addEventListener("click", openJoinLog);

        joinLogExample.addEventListener("keydown", (e) => {

            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openJoinLog();
            }

        });

        closeJoinLogButtons.forEach(button => {
            button.addEventListener("click", closeJoinLog);
        });

        document.addEventListener("keydown", (e) => {

            if (e.key === "Escape") {
                closeJoinLog();
            }

        });

        // Close the modal when clicking its backdrop.
        joinLogModal.addEventListener("click", (e) => {

            if (e.target === joinLogModal) {
                closeJoinLog();
            }

        });

    }

}

/*
    INITIALISE THE WEBSITE
*/

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
});

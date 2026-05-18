window.addEventListener("load", () => {
    console.log("Philadelphia Chikalimba Portfolio Loaded Successfully");
});

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
    });

    card.addEventListener("mouseleave", () => {
        card.style.boxShadow = "none";
    });
});

const footer = document.querySelector("footer p");
const currentYear = new Date().getFullYear();

footer.innerHTML = `Portfolio created by Philadelphia Chikalimba © ${currentYear}`;

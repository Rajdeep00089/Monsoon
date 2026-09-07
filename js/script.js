const cards = document.querySelectorAll(".animate-card");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.08}s`;
    observer.observe(card);
});

const needle = document.getElementById("needle");

window.addEventListener("load", () => {
    setTimeout(() => {
        needle.style.transform = "rotate(25deg)";
    }, 500);
});

const hours = document.querySelectorAll(".hour");

hours.forEach((hour) => {
    hour.addEventListener("click", () => {
        hours.forEach((item) => item.classList.remove("active"));
        hour.classList.add("active");
    });
});

const alertBtn = document.getElementById("alertBtn");
const notification = document.getElementById("notification");

alertBtn.addEventListener("click", () => {
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
});

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
    searchBtn.classList.add("rotate");

    setTimeout(() => {
        searchBtn.classList.remove("rotate");
    }, 500);
});

const hoverElements = document.querySelectorAll(
    ".card, .detail, .hour, .forecast-row, .action-btn, .alert-button, .aqi-status, .temperature, .compass"
);

hoverElements.forEach((element) => {

    element.addEventListener("mouseenter", () => {
        element.classList.add("hover-expand");
    });

    element.addEventListener("mouseleave", () => {
        element.classList.remove("hover-expand");
    });

});
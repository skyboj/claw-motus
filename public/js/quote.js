// Quote Panel Interaction & Form Handling

document.addEventListener("DOMContentLoaded", () => {
    const fab = document.getElementById("fab");
    const quotePanel = document.getElementById("quote-panel");
    const closeBtn = document.getElementById("close-panel");
    const triggers = document.querySelectorAll(".quote-trigger");

    const formContainer = document.getElementById("quote-form-container");
    const quoteForm = document.getElementById("quote-form");
    const submitBtn = document.getElementById("submit-btn");
    const successMessage = document.getElementById("success-message");

    // 1. Toggle Panel state
    const openPanel = (e) => {
        if (e) e.preventDefault();
        quotePanel.classList.add("open");
        fab.classList.remove("pulse");
        fab.classList.remove("show-tooltip");
    };

    const closePanel = () => {
        quotePanel.classList.remove("open");
    };

    fab.addEventListener("click", openPanel);
    closeBtn.addEventListener("click", closePanel);
    triggers.forEach(t => t.addEventListener("click", openPanel));

    // 2. URL Parameter checking for shared videos
    const params = new URLSearchParams(window.location.search);
    if (params.has("ref") || params.has("v")) {
        setTimeout(() => {
            if (!quotePanel.classList.contains("open")) {
                fab.classList.add("pulse");
                fab.classList.add("show-tooltip");
                setTimeout(() => {
                    fab.classList.remove("pulse");
                    fab.classList.remove("show-tooltip");
                }, 6000);
            }
        }, 3000);
    }

    // 3. Form Submission Handling
    quoteForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Honeypot check (silently reject if filled)
        const formData = new FormData(quoteForm);
        if (formData.get("website")) {
            console.log("Submission ignored.");
            return;
        }

        // Prepare payload
        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            company: formData.get("company"),
            projectType: formData.get("projectType"),
            eventDate: formData.get("eventDate"),
            location: formData.get("location"),
            budget: formData.get("budget"),
            description: formData.get("description")
        };

        // UI Feedback
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Analyzing your project...";
        submitBtn.disabled = true;

        try {
            // NOTE: Adjust the fetch URL during production if not using rewrites correctly,
            // but 'firebase.json' rewrites '/api/quote' to the 'api' function.
            const response = await fetch('/api/quote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            // Show success state
            quoteForm.style.display = "none";
            successMessage.classList.add("active");

        } catch (error) {
            console.error("Submission failed:", error);
            submitBtn.innerText = "Error. Try again.";
            submitBtn.disabled = false;

            setTimeout(() => {
                submitBtn.innerText = originalText;
            }, 3000);
        }
    });
});

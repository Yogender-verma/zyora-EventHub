const speakerList = document.getElementById("speakerList");

async function loadSpeakers() {

    speakerList.innerHTML = "<p>Loading speakers...</p>";

    try {

        const response = await fetch("data/speakers.json");

        if (!response.ok) {
            throw new Error("Failed to load speakers");
        }

        const speakers = await response.json();

        speakerList.innerHTML = "";

        speakers.forEach((speaker) => {

            speakerList.innerHTML += `
<article class="speaker-card" data-search="${speaker.name} ${speaker.session}">
    <img
        src="${speaker.image}"
        alt="${speaker.name}"
        loading="lazy"
        decoding="async"
        height="450"
        width="400">

    <h3>${speaker.name}</h3>

    <p><strong>${speaker.role}</strong></p>

    <p>
        <strong>Session:</strong>
        ${speaker.session}
    </p>
</article>

<hr>
`;

        });

    } catch (error) {

        speakerList.innerHTML = `
            <p style="color:red;">
                Unable to load speakers.
            </p>
        `;

    }

}

loadSpeakers();
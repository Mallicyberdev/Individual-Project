document.addEventListener('DOMContentLoaded', () => {
    const bestPractices = [
        { name: 'Semantic HTML', description: 'Using appropriate HTML tags for content structure.', section: 'section-1' },
        { name: 'Responsive Design', description: 'Adapting to different screen sizes using media queries.', section: 'section-2' },
        { name: 'Accessibility (ARIA)', description: 'Making the website accessible to users with disabilities.', section: 'section-2' },
        { name: 'Performance Optimization', description: 'Minifying CSS/JS, optimizing images, using browser caching.', section: 'section-3' },
        { name: 'Clean CSS (BEM)', description: 'Following a consistent naming convention for CSS classes.', section: 'section-1' },
        { name: 'Modular JavaScript', description: 'Organizing JavaScript code into reusable modules.', section: 'section-3' },
        { name: 'Form Validation', description: 'Validating form inputs to prevent errors.', section: 'section-1' },
        { name: 'Version Control (Git)', description: 'Using Git for version control.', section: 'section-1' },
        { name: 'Code Linting', description: 'Using linters to maintain code quality.', section: 'section-3' },
        { name: 'Cross-Browser Compatibility', description: 'Testing the website in multiple browsers.', section: 'section-2' },
        { name: 'Using alt tags', description: 'Using alt tags to describe images, for accessibility.', section: 'section-2' },
        { name: 'Proper indentation', description: 'Using proper indentation in html, css and js files.', section: 'section-3' }
    ];

    let hasReceivedReward = false;

    function showRewardPopup(imageUrl) {
        const popup = document.createElement('div');
        popup.classList.add('reward-popup');
        popup.innerHTML = `
            <img src="${imageUrl}" alt="Reward Animal">
            <span class="badge-text">Awesome!</span>
        `;
        document.body.appendChild(popup);
        triggerPartyPop();
        const audio = new Audio('https://www.soundjay.com/buttons/sounds/beep-01a.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => console.log('Audio blocked by browser'));
        popup.addEventListener('click', () => popup.remove());
        setTimeout(() => popup.remove(), 5000);
    }

    function triggerPartyPop() {
        const partyContainer = document.createElement('div');
        partyContainer.classList.add('party-pop');
        document.body.appendChild(partyContainer);
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            partyContainer.appendChild(confetti);
        }
        setTimeout(() => partyContainer.remove(), 4000);
    }

    const practicesList = document.getElementById('best-practices-list');
    const practicesMetElement = document.getElementById('total-practices-met');
    const totalPracticesElement = document.getElementById('total-practices');
    const successMessageElement = document.getElementById('success-message');
    const animalRewardElement = document.getElementById('animal-reward');
    const sectionSummaryElement = document.getElementById('section-summary');

    totalPracticesElement.textContent = bestPractices.length;

    bestPractices.forEach((practice, index) => {
        const practiceDiv = document.createElement('div');
        practiceDiv.classList.add('section-practice');
        practiceDiv.innerHTML = `
            <label data-tooltip="${practice.description}">
                <input type="checkbox" data-index="${index}" data-section="${practice.section}">
                <strong>${practice.name}:</strong> ${practice.description}
            </label>
        `;
        document.getElementById(practice.section).appendChild(practiceDiv);
    });

    const checkboxes = document.querySelectorAll('#best-practices-list input[type="checkbox"]');

    function updateSummary() {
        let metCount = 0;
        const sectionCounts = {
            'section-1': { met: 0, total: 0 },
            'section-2': { met: 0, total: 0 },
            'section-3': { met: 0, total: 0 }
        };

        checkboxes.forEach(checkbox => {
            const section = checkbox.dataset.section;
            sectionCounts[section].total++;
            if (checkbox.checked) {
                metCount++;
                sectionCounts[section].met++;
                checkbox.parentElement.parentElement.classList.add('checked');
            } else {
                checkbox.parentElement.parentElement.classList.remove('checked');
            }
        });

        practicesMetElement.textContent = `Total Practices Met: ${metCount} / ${bestPractices.length}`;
        sectionSummaryElement.innerHTML = '';
        for (const section in sectionCounts) {
            const sectionHeading = document.querySelector(`#${section} h2`).textContent;
            sectionSummaryElement.innerHTML += `<p>${sectionHeading}: ${sectionCounts[section].met} / ${sectionCounts[section].total}</p>`;
        }

        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = (metCount / 10) * 100;
        progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;

        if (metCount >= 10 && !hasReceivedReward) {
            successMessageElement.textContent = 'Congratulations! You meet the success criteria!';
            hasReceivedReward = true;
            fetchRandomAnimal();
        } else if (metCount < 10) {
            successMessageElement.textContent = '';
            animalRewardElement.innerHTML = '';
            hasReceivedReward = false;
        }

        localStorage.setItem('bestPracticesState', JSON.stringify(Array.from(checkboxes).map(cb => cb.checked)));
    }

    function fetchRandomAnimal() {
        fetch('https://some-random-api.com/animal/cat')
            .then(response => response.json())
            .then(data => showRewardPopup(data.image))
            .catch(error => {
                console.error('Error fetching animal:', error);
                showRewardPopup('https://via.placeholder.com/300?text=Sorry,+No+Animal+Today');
            });
    }

    const resetButton = document.getElementById('fab-reset');
    resetButton.addEventListener('click', () => {
        checkboxes.forEach(checkbox => checkbox.checked = false);
        hasReceivedReward = false;
        updateSummary();
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSummary);
    });

    const savedState = JSON.parse(localStorage.getItem('bestPracticesState'));
    if (savedState) {
        checkboxes.forEach((checkbox, index) => {
            checkbox.checked = savedState[index];
        });
        updateSummary();
    }
});
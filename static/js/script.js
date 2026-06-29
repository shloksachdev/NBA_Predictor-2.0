document.addEventListener('DOMContentLoaded', () => {
    const gameDateInput = document.getElementById('gameDate');
    const predictDateBtn = document.getElementById('predictDateBtn');
    const gamesGrid = document.getElementById('gamesGrid');
    const drilldownCard = document.getElementById('drilldownCard');
    const ddEmptyState = document.getElementById('ddEmptyState');

    predictDateBtn.addEventListener('click', () => {
        const dateVal = gameDateInput.value;
        if (!dateVal) {
            alert("Please select a date.");
            return;
        }

        predictDateBtn.disabled = true;
        predictDateBtn.textContent = "Loading Schedule...";
        
        // Hide drilldown on new search
        drilldownCard.classList.add('hidden');
        ddEmptyState.classList.remove('hidden');

        fetch('/api/predict_date', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: dateVal })
        })
        .then(res => res.json())
        .then(data => {
            predictDateBtn.disabled = false;
            predictDateBtn.textContent = "Get Predictions";
            
            if (data.error) {
                alert("Error: " + data.error);
                return;
            }

            gamesGrid.innerHTML = ''; // Clear previous

            if (!data.games || data.games.length === 0) {
                gamesGrid.innerHTML = '<p style="color:var(--text-secondary); grid-column: 1/-1;">No games found for this date. Try another date like 2026-04-12.</p>';
                return;
            }

            // Render each game as a card
            data.games.forEach((game, index) => {
                const hProb = game.home_prob.toFixed(1);
                const aProb = game.away_prob.toFixed(1);
                
                let favoredLabelTxt = 'TOSSUP';
                let favoredColor = '';
                if (game.home_prob > game.away_prob) {
                    favoredLabelTxt = `${game.home_team} FAVORED`;
                    favoredColor = 'var(--home-color)';
                } else {
                    favoredLabelTxt = `${game.away_team} FAVORED`;
                    favoredColor = 'var(--away-color)';
                }

                const cardHTML = `
                    <div class="matchup-card" data-index="${index}">
                        <div class="teams-row">
                            <div class="team away"><span class="color-dot away-dot"></span> <span>${game.away_team}</span></div>
                            <div class="status">@</div>
                            <div class="team home"><span>${game.home_team}</span> <span class="color-dot home-dot"></span></div>
                        </div>
                        <div class="prob-bar-container">
                            <div class="prob-labels">
                                <span>${aProb}%</span>
                                <span>${hProb}%</span>
                            </div>
                            <div class="prob-bar">
                                <div class="prob-fill away-fill" style="width: ${aProb}%;"></div>
                                <div class="prob-fill home-fill" style="width: ${hProb}%;"></div>
                            </div>
                            <div class="favored-label" style="color: ${favoredColor};">${favoredLabelTxt}</div>
                        </div>
                    </div>
                `;
                gamesGrid.insertAdjacentHTML('beforeend', cardHTML);
            });

            // Add click listeners to cards to populate stats drilldown
            document.querySelectorAll('.matchup-card').forEach(card => {
                card.addEventListener('click', function() {
                    const idx = this.getAttribute('data-index');
                    const game = data.games[idx];
                    
                    ddEmptyState.classList.add('hidden');
                    drilldownCard.classList.remove('hidden');

                    const statsContainer = document.getElementById('statsComparisonContainer');
                    
                    // Create Header
                    let html = `
                        <div class="drilldown-header">
                            <div class="drilldown-team home">
                                <span class="color-dot home-dot"></span> <span>${game.home_team}</span>
                            </div>
                            <div class="drilldown-team away">
                                <span>${game.away_team}</span> <span class="color-dot away-dot"></span>
                            </div>
                        </div>
                        <div class="stats-comparison-grid">
                    `;

                    // Lower is better for these stats
                    const lowerIsBetter = ['TOV_EMA_10', 'PF_EMA_10', 'TOV_PCT_EMA_10'];

                    // Helper to format stat names nicely
                    const formatStatName = (name) => {
                        return name.replace('_EMA_10', '').replace('_EMA_15', '').replace(/_/g, ' ');
                    };

                    const homeStats = game.home_stats;
                    const awayStats = game.away_stats;

                    for (const key in homeStats) {
                        const hVal = homeStats[key];
                        const aVal = awayStats[key];
                        
                        let hClass = 'stat-val-home';
                        let aClass = 'stat-val-away';

                        // Determine who is better
                        if (hVal !== aVal) {
                            if (lowerIsBetter.includes(key)) {
                                if (hVal < aVal) hClass += ' highlight-home';
                                else aClass += ' highlight-away';
                            } else {
                                if (hVal > aVal) hClass += ' highlight-home';
                                else aClass += ' highlight-away';
                            }
                        }

                        // Format values
                        const formatVal = (val) => {
                            if (key.includes('PCT') || key.includes('RATIO')) return val.toFixed(3);
                            return val.toFixed(1);
                        };

                        html += `
                            <div class="stat-row">
                                <div class="${hClass}">${formatVal(hVal)}</div>
                                <div class="stat-name">${formatStatName(key)}</div>
                                <div class="${aClass}">${formatVal(aVal)}</div>
                            </div>
                        `;
                    }

                    html += `</div>`;
                    statsContainer.innerHTML = html;

                    // Scroll down to the drilldown section smoothly
                    statsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            });
        })
        .catch(err => {
            console.error(err);
            predictDateBtn.disabled = false;
            predictDateBtn.textContent = "Get Predictions";
            alert("Failed to reach prediction engine.");
        });
    });
});

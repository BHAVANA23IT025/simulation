// Lesson: Matter in Our Surroundings
// Model 4: Full Multi-Scene Engine
(function() {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        colors: { hot: [239, 68, 68], neutral: [255, 215, 0], cool: [59, 130, 246], lattice: [245, 158, 11] },
        particleCount: 20
    };

    // --- BLOOM'S TAXONOMY CHALLENGES ---
    const BLOOM_GUIDES = {
        1: [ // Dilution
            { level: 'remember', tag: 'Observe', text: 'Set "Drop Count" to 1. How does the color of the water change?' },
            { level: 'understand', tag: 'Compare', text: 'How does increasing the "Mixing Speed" (Wind) affect how fast the color spreads?' },
            { level: 'apply', tag: 'Experiment', text: 'What is the minimum "Drop Count" needed for the color to be clearly visible?' },
            { level: 'analyze', tag: 'Analyze', text: 'Explain the relationship between the number of drops and the concentration of the solution.' },
            { level: 'evaluate', tag: 'Challenge', text: 'If the beaker volume were doubled, how many drops would you need to get the same color as 2 drops in the original beaker?' }
        ],
        2: [ // Diffusion
            { level: 'remember', tag: 'Identify', text: 'At 10°C, observe how long it takes for the particles to spread out.' },
            { level: 'understand', tag: 'Explain', text: 'Why do the particles spread out faster when you increase the Temperature?' },
            { level: 'apply', tag: 'Simulate', text: 'Find the temperature required to make the particles diffuse twice as fast as they do at 20°C.' },
            { level: 'analyze', tag: 'Connect', text: 'Besides temperature, what other factors in real life might affect the rate of diffusion in a liquid?' },
            { level: 'create', tag: 'Design', text: 'Imagine you have two different dyes. How would you design an experiment to see which one diffuses faster?' }
        ],
        3: [ // States Comparison
            { level: 'remember', tag: 'Define', text: 'Describe the particle arrangement for a Solid, a Liquid, and a Gas based on the Micro View.' },
            { level: 'understand', tag: 'Observe', text: 'What happens to the kinetic energy (KE) of the particles as you move from Solid to Gas?' },
            { level: 'apply', tag: 'Predict', text: 'If you could apply extreme pressure to the Gas particles, what state would they most likely turn into?' },
            { level: 'analyze', tag: 'Deduce', text: 'Why does the volume change so much for a Gas but very little for a Solid or Liquid?' },
            { level: 'evaluate', tag: 'Judge', text: 'Which state of matter do you think is most common in the universe? Justify your answer.' }
        ],
        4: [ // State Change
            { level: 'remember', tag: 'Recall', text: 'At what two temperatures does the graph plateau? What are these points called?' },
            { level: 'understand', tag: 'Relate', text: 'During melting, the temperature stays constant. Where is the heat energy going?' },
            { level: 'apply', tag: 'Solve', text: 'Increase the "Heat Input" (Surface Area). How does this affect the time it takes to boil the water?' },
            { level: 'analyze', tag: 'Compare', text: 'Why is the plateau for boiling much longer than the plateau for melting?' },
            { level: 'create', tag: 'Propose', text: 'How could you use the concept of latent heat to design a better system for keeping food warm?' }
        ],
        5: [ // Evaporation Factors
            { level: 'remember', tag: 'Check', text: 'What is the effect of increasing the "Surface Area" on the evaporation rate?' },
            { level: 'understand', tag: 'Clarify', text: 'Why does increasing "Ambient Humidity" cause the evaporation rate to decrease?' },
            { level: 'apply', tag: 'Model', text: 'Find the settings that would cause a puddle of water to dry up the fastest.' },
            { level: 'analyze', tag: 'Contrast', text: 'Which factor has a greater impact on the evaporation rate: Wind Speed or Temperature? Explain.' },
            { level: 'evaluate', tag: 'Debunk', text: 'A friend says that water only evaporates when it\'s hot. Use the simulation to show them why that is incorrect.' }
        ]
    };

    // --- SCENE & VISUAL DEFINITIONS ---
    const SCENES = {
        1: { name: "Dilution", readoutLabel: "Concentration", readoutUnit: "%", svg: `<svg class="sim-svg" viewBox="0 0 100 100" style="width:70%; height:70%;"><rect x="10" y="20" width="80" height="70" rx="5" fill="#e0f7fa" stroke="#00bcd4" stroke-width="2"/><circle cx="50" cy="55" r="30" fill="#add8e6" opacity="0.6" class="surface-fill"/><rect x="45" y="10" width="10" height="15" fill="#666"/><text x="50" y="95" text-anchor="middle" font-size="8" fill="#555">Beaker of Water</text></svg>` },
        2: { name: "Diffusion", readoutLabel: "Diffusion Time", readoutUnit: "s", svg: `<svg class="sim-svg" viewBox="0 0 100 100" style="width:80%; height:80%;"><rect x="10" y="10" width="80" height="80" rx="5" fill="#f5f5f5" stroke="#ccc" stroke-width="2"/><text x="50" y="95" text-anchor="middle" font-size="8" fill="#555">Container</text></svg>` },
        3: { name: "States Comparison", readoutLabel: "Current State", readoutUnit: "", svg: `<svg class="sim-svg" viewBox="0 0 100 100" style="width:50%; height:80%;"><rect x="10" y="10" width="80" height="80" rx="5" fill="#f5f5f5" stroke="#ccc" stroke-width="2"/><rect x="15" y="15" width="70" height="70" rx="3" fill="#add8e6" opacity="0.4" class="substance-container"/><text x="50" y="95" text-anchor="middle" font-size="8" fill="#555">Sealed Container</text></svg>` },
        4: { name: "State Change", readoutLabel: "Heat Added", readoutUnit: "kJ", svg: `<div class="heating-curve"><canvas id="heating-curve-canvas"></canvas></div>` },
        5: { name: "Evaporation Factors", readoutLabel: "Evap. Rate", readoutUnit: "g/s", svg: `<svg class="sim-svg" viewBox="0 0 100 100" style="width:70%; height:70%;"><rect x="25" y="50" width="50" height="40" fill="#e0f7fa" stroke="#00bcd4" stroke-width="2"/><rect x="25" y="45" width="50" height="5" class="surface-fill" fill="#add8e6" opacity="0.8"/><text x="50" y="95" text-anchor="middle" font-size="8" fill="#555">Liquid Surface</text></svg>` }
    };

    // --- STATE AND ELEMENTS ---
    const state = {
        scene: 1, temp: 30, humidity: 50, wind: 2, area: 5,
        running: false,
        rateMetric: 0,
        secondaryMetric: 0,
        currentState: 'Liquid',
        heatingTime: 0
    };
    let animFrame; let lastParticleTime = 0; let microDotData = [];

    const els = {
        stage: document.getElementById('scene-stage'), particles: document.getElementById('particle-layer'), hazeLayer: document.getElementById('haze-layer'), tabContent: document.getElementById('tab-content'),
        gaugeReadout: document.getElementById('gauge-val'), gaugeLiquid: document.getElementById('gauge-liquid'), chillBadge: document.getElementById('chill-badge'),
        scopeLens: document.getElementById('scope-lens'), guideContent: document.getElementById('guide-content'), legendState: document.getElementById('legend-state'),
        inpTemp: document.getElementById('inp-temp'), valTemp: document.getElementById('val-temp'), inpPressure: document.getElementById('inp-pressure'), valPressure: document.getElementById('val-pressure'), inpWind: document.getElementById('inp-wind'), valWind: document.getElementById('val-wind'), inpArea: document.getElementById('inp-area'), valArea: document.getElementById('val-area'), inpSubstance: document.getElementById('inp-substance'),
        outRate: document.getElementById('out-rate'), outRateLabel: document.getElementById('out-rate-label'), outMetric: document.getElementById('out-metric'), outMetricLabel: document.getElementById('out-metric-label'),
        btnRun: document.getElementById('btn-run'), btnPause: document.getElementById('btn-pause'), btnReset: document.getElementById('btn-reset')
    };

    // --- UTILITIES ---
    function lerp(a, b, t) { return a + (b - a) * t; }
    function interpolateColor(value, minVal, maxVal, lowColor, highColor) {
        const t = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)));
        const r = lerp(lowColor[0], highColor[0], t);
        const g = lerp(lowColor[1], highColor[1], t);
        const b = lerp(lowColor[2], highColor[2], t);
        return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
    }

    function updateSliderDisplay() {
        els.valTemp.innerText = Math.round(state.temp);
        els.valPressure.innerText = state.humidity.toFixed(0); // Repurposed for Humidity
        els.valWind.innerText = Math.round(state.wind);
        els.valArea.innerText = state.area.toFixed(0);
    }

    // --- MICRO VIEW LOGIC ---
    function initMicroDots() {
        els.scopeLens.innerHTML = ''; microDotData.length = 0;
        for(let i=0; i < CONFIG.particleCount; i++) {
            const d = document.createElement('div'); d.className = 'micro-dot';
            els.scopeLens.appendChild(d);
            microDotData.push({ el: d, x: 40, y: 40, angle: Math.random() * 2 * Math.PI });
        }
        updateMicroDots();
    }

    function updateMicroDots() {
        const T_norm = state.temp / 100;
        const KE_speed = 1.0 + T_norm * 2;

        microDotData.forEach((dot, i) => {
            let dx, dy;

            if (state.currentState === 'Solid') {
                const row = Math.floor(i / 5);
                const col = i % 5;
                const targetX = 15 + col * 12;
                const targetY = 15 + row * 12;
                dot.el.classList.remove('liquid', 'gas'); dot.el.classList.add('solid', 'dot-fixed');
                dx = targetX + (Math.sin(dot.angle + performance.now() / 200) * T_norm * 2);
                dy = targetY + (Math.cos(dot.angle + performance.now() / 200) * T_norm * 2);
                dot.angle += 0.01 * T_norm;
            } else if (state.currentState === 'Liquid') {
                dot.el.classList.remove('solid', 'gas', 'dot-fixed'); dot.el.classList.add('liquid');
                dx = dot.x + (Math.random() - 0.5) * KE_speed * 1.5;
                dy = dot.y + (Math.random() - 0.5) * KE_speed * 1.5;
                if (dx < 5 || dx > 75) dx = dot.x;
                if (dy < 5 || dy > 75) dy = dot.y;
                dot.x = dx; dot.y = dy;
            } else { // Gas
                dot.el.classList.remove('solid', 'liquid', 'dot-fixed'); dot.el.classList.add('gas');
                dx = dot.x + (Math.random() - 0.5) * KE_speed * 3;
                dy = dot.y + (Math.random() - 0.5) * KE_speed * 3;
                if (dx < 0 || dx > 78) dot.x = dx < 0 ? 78 : 0; else dot.x = dx;
                if (dy < 0 || dy > 78) dot.y = dy < 0 ? 78 : 0; else dot.y = dy;
            }
            dot.el.style.transform = `translate(${dx}px, ${dy}px)`;
        });

        const stateClass = state.currentState.toLowerCase();
        els.legendState.innerHTML = `<span class="dot state-${stateClass}"></span> Current State: ${state.currentState}`;
    }

    // --- PHYSICS CALCULATION ---
    function calculatePhysics() {
        const T = state.temp;

        // Determine State (for scenes 3 & 5)
        if (state.scene !== 4) { // Scene 4 state is handled by the heating curve
             if (T < 0) { state.currentState = 'Solid'; }
             else if (T >= 0 && T < 100) { state.currentState = 'Liquid'; }
             else { state.currentState = 'Gas'; }
        }

        // Scene-Specific Calculations
        switch(state.scene) {
            case 1: // Dilution
                const concentration = state.area * 5; // Area slider as "Drop Count"
                state.rateMetric = concentration.toFixed(1);
                state.secondaryMetric = (1 + state.wind * 2); // Wind as "Mixing Speed"
                break;
            case 2: // Diffusion
                const T_kelvin = T + 273.15;
                const diffusionTime = 100 / (Math.sqrt(T_kelvin) + 0.5 * state.wind);
                state.rateMetric = Math.max(1, diffusionTime).toFixed(1);
                state.secondaryMetric = Math.round(T * 10 / 120); // Relative KE
                break;
            case 3: // States Comparison
                let volume = 50; // Base solid volume
                if (state.currentState === 'Liquid') volume = 55;
                else if (state.currentState === 'Gas') volume = (50 + T * 0.5);
                state.rateMetric = state.currentState;
                state.secondaryMetric = volume.toFixed(1);
                break;
            case 4: // State Change
                // Logic is primarily in drawHeatingCurve
                const totalHeat = state.heatingTime * state.area * 0.1;
                state.rateMetric = totalHeat.toFixed(1);
                state.secondaryMetric = (state.currentState.includes('Melting') || state.currentState.includes('Solid')) ? 334 : 2260; // Lf/Lv for water
                break;
            case 5: // Evaporation Factors
                const T_evap = Math.max(0, state.temp / 100);
                const A = state.area;
                const W = 1 + (state.wind / 10);
                const H = 1 - (state.humidity / 100);
                const evapRate = (A * T_evap * W * H * 0.1);
                state.rateMetric = evapRate.toFixed(2);
                const coolingEffect = evapRate * 2260 * 0.001 * 2;
                state.secondaryMetric = coolingEffect.toFixed(2);
                break;
        }
    }

    // --- VISUAL UPDATE ---
    function updateVisuals() {
        calculatePhysics();

        // Update Readouts
        els.outRate.innerText = state.rateMetric;
        els.outRateLabel.innerText = SCENES[state.scene].readoutLabel;
        const secondaryUnit = (state.scene === 5) ? "°C Cooler" : (state.scene === 3 ? "mL" : SCENES[state.scene].readoutUnit);
        els.outMetric.innerText = `${state.secondaryMetric} ${secondaryUnit}`;
        const secondaryLabel = (state.scene === 1) ? "Mixing Speed" : (state.scene === 2) ? "Kinetic Energy" : (state.scene === 3) ? "Volume" : (state.scene === 4) ? "Latent Heat (J/g)" : "Cooling Effect";
        els.outMetricLabel.innerText = secondaryLabel;

        // Update Gauge (KE)
        const keNorm = Math.min(100, Math.max(0, state.temp / 1.2));
        els.gaugeLiquid.style.height = `${keNorm}%`;
        els.gaugeReadout.innerText = `KE: ${Math.round(keNorm)}/100`;
        els.gaugeLiquid.style.background = interpolateColor(keNorm, 0, 100, CONFIG.colors.cool, CONFIG.colors.hot);

        // Scene-specific visuals
        if (state.scene === 1) { // Dilution
             const conc = parseFloat(state.rateMetric) / 50; // Normalize concentration
             els.hazeLayer.style.background = `rgba(139, 92, 246, ${Math.min(0.7, conc)})`;
        } else {
             els.hazeLayer.style.background = 'transparent';
        }

        updateTabs();
    }

    // --- ANIMATION LOOP ---
    function animLoop(timestamp) {
        if (!state.running) return;

        if (state.scene === 4) {
            state.heatingTime += 0.5;
            drawHeatingCurve();
            els.inpTemp.value = state.temp;
        }

        if (state.scene === 5 && state.rateMetric > 0.01) {
            const interval = 800 / (parseFloat(state.rateMetric) * 50);
            if (timestamp - lastParticleTime > interval) { spawnParticle(); lastParticleTime = timestamp; }
        }

        updateMicroDots();
        updateVisuals();
        animFrame = requestAnimationFrame(animLoop);
    }

    function spawnParticle() {
        const p = document.createElement('div'); p.className = 'particle vapor-particle';
        const offset = (Math.random() - 0.5) * 40 * state.area;
        p.style.left = `calc(50% + ${offset}px)`; p.style.top = '50%';

        const driftX = state.wind * 30 * Math.random();
        const driftY = -120 * (1 + Math.random() * 0.5);
        p.style.setProperty('--dx', `${driftX}px`);
        p.style.setProperty('--dy', `${driftY}px`);
        p.style.animation = `riseAndDrift ${3 - state.wind/3}s linear forwards`;

        els.particles.appendChild(p); setTimeout(() => p.remove(), 3000);
    }

    // --- SCENE 4 SPECIFIC LOGIC (Heating Curve) ---
    let heatingCurveCtx;
    const waterCurve = [
        { temp: -20, time: 0 }, { temp: 0, time: 40 },
        { temp: 0, time: 40 + 33.4 },
        { temp: 100, time: 40 + 33.4 + 100 },
        { temp: 100, time: 40 + 33.4 + 100 + 226 },
        { temp: 120, time: 40 + 33.4 + 100 + 226 + 20 }
    ];

    function setupHeatingCurve() {
        const canvas = document.getElementById('heating-curve-canvas');
        if (!canvas) return;
        heatingCurveCtx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
        drawHeatingCurve();
    }

    function drawHeatingCurve() {
        if (!heatingCurveCtx) return;
        const ctx = heatingCurveCtx;
        const W = ctx.canvas.width; const H = ctx.canvas.height;
        ctx.clearRect(0, 0, W, H);

        const curve = waterCurve;
        const maxTime = curve[curve.length - 1].time;

        const timeToX = (t) => t / maxTime * W;
        const tempToY = (t) => H - (t + 20) / 140 * H;

        ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 2;
        ctx.beginPath();
        curve.forEach((p, i) => i === 0 ? ctx.moveTo(timeToX(p.time), tempToY(p.temp)) : ctx.lineTo(timeToX(p.time), tempToY(p.temp)));
        ctx.stroke();

        let currentTime = state.heatingTime * state.area * 0.2;
        currentTime = Math.min(currentTime, maxTime);
        let currentTemp = -20;

        for (let i = 1; i < curve.length; i++) {
            if (currentTime <= curve[i].time) {
                const t = (currentTime - curve[i-1].time) / (curve[i].time - curve[i-1].time);
                currentTemp = lerp(curve[i-1].temp, curve[i].temp, t);
                break;
            }
        }

        ctx.fillStyle = 'rgb(239, 68, 68)'; ctx.beginPath();
        ctx.arc(timeToX(currentTime), tempToY(currentTemp), 5, 0, 2 * Math.PI);
        ctx.fill();

        state.temp = currentTemp;
        updateSliderDisplay();

        if (currentTemp < 0) state.currentState = 'Solid';
        else if (currentTemp === 0 && currentTime > curve[1].time) state.currentState = 'Melting';
        else if (currentTemp < 100) state.currentState = 'Liquid';
        else if (currentTemp === 100 && currentTime > curve[3].time) state.currentState = 'Boiling';
        else state.currentState = 'Gas';

        els.chillBadge.hidden = !state.currentState.match(/Melting|Boiling/);
        if (!els.chillBadge.hidden) els.chillBadge.innerText = `🌡️ ${state.currentState}!`;
    }

    // --- TAB CONTENT ---
    function updateTabs() {
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        let content = "";

        if (activeTab === 'model') {
            content = `
                <h4>The Particle Model</h4>
                <p>This simulation is based on several key principles of the particle theory of matter:</p>
                <ul>
                  <li><strong>Kinetic Energy:</strong> All particles have kinetic energy. Temperature is a measure of the average KE of the particles. ($KE \propto T$)</li>
                  <li><strong>Intermolecular Forces:</strong> Particles are attracted to each other. These forces are strong in solids, weaker in liquids, and negligible in gases.</li>
                  <li><strong>Latent Heat:</strong> During a state change, added heat energy is used to overcome intermolecular forces, not to raise the temperature. ($Q = m L$)</li>
                  <li><strong>Evaporation:</strong> A cooling process where high-KE particles escape from a liquid's surface, lowering the average KE of the remaining liquid.</li>
                </ul>
            `;
        } else {
            switch(activeTab) {
                case 'visual':
                    content = `
                        <h4>Visual Decoding</h4>
                        <ul>
                          <li><strong>Micro View:</strong> Shows how particles are arranged and move. Solids vibrate, Liquids slide past each other, Gases move randomly.</li>
                          <li><strong>KE Gauge:</strong> A direct measure of the average Kinetic Energy of the particles, which is related to Temperature.</li>
                          <li><strong>Particle Layer:</strong> Visualizes particles that are diffusing (spreading out) or evaporating (escaping the surface).</li>
                        </ul>
                    `;
                    break;
                case 'analogy':
                    content = `
                        <h4>States of Matter: The Dance Floor Analogy</h4>
                        <ul>
                          <li><strong>Solid:</strong> Dancers are in fixed spots, only able to wiggle or vibrate to the music.</li>
                          <li><strong>Liquid:</strong> Dancers are in a crowded room, able to move around and slide past each other but still close together.</li>
                          <li><strong>Gas:</strong> Dancers have a huge, open space to run and bounce around in freely.</li>
                        </ul>
                    `;
                    break;
                case 'cause':
                    content = `
                        <h4>Chain of Events: Heating Water</h4>
                        <p>Adding Heat $\rightarrow$ Increases Particle KE $\rightarrow$ Particles Vibrate Faster $\rightarrow$ Forces are Overcome $\rightarrow$ Melting (Solid to Liquid) $\rightarrow$ More Heat $\rightarrow$ Particles Move Faster $\rightarrow$ More Forces Overcome $\rightarrow$ Boiling (Liquid to Gas).</p>
                    `;
                    break;
                case 'fix':
                    content = `
                        <h4>Common Misconceptions</h4>
                        <ul>
                          <li><strong>"Cold" is a substance:</strong> Cold is the absence of heat. Objects feel cold because they are drawing heat away from your hand.</li>
                          <li><strong>Boiling and Evaporation are the same:</strong> Evaporation can happen at any temperature from a liquid's surface. Boiling happens at a specific temperature throughout the entire liquid.</li>
                          <li><strong>Particles "expand" when heated:</strong> The particles themselves do not get bigger. They just move faster and further apart, causing the substance to expand.</li>
                        </ul>
                    `;
                    break;
            }
        }
        els.tabContent.innerHTML = content;
    }

    // --- INITIALIZATION AND EVENT HANDLER ---
    function renderScene() {
        els.stage.innerHTML = SCENES[state.scene].svg;
        els.particles.innerHTML = '';
        state.heatingTime = 0;

        const phenomenon = els.inpSubstance.options[state.scene - 1].value;
        els.inpSubstance.value = phenomenon;

        document.querySelectorAll('.scene-btn').forEach((btn, i) => {
            btn.classList.toggle('active', (i + 1) === state.scene);
        });

        if (state.scene === 4) {
            setupHeatingCurve();
            els.inpTemp.disabled = true;
        } else {
            els.chillBadge.hidden = true;
            els.inpTemp.disabled = false;
        }

        const guides = BLOOM_GUIDES[state.scene] || [];
        els.guideContent.innerHTML = `<ul class="guide-list">
            ${guides.map(g => `
                <li class="guide-item">
                    <span class="bloom-tag ${g.level}">${g.tag}</span>
                    <span class="guide-text">${g.text}</span>
                </li>
            `).join('')}
        </ul>`;
        updateVisuals();
    }

    function init() {
        // Sliders
        els.inpTemp.addEventListener('input', (e) => { state.temp = parseFloat(e.target.value); updateSliderDisplay(); updateVisuals(); });
        els.inpPressure.addEventListener('input', (e) => { state.humidity = parseFloat(e.target.value); updateSliderDisplay(); updateVisuals(); });
        els.inpWind.addEventListener('input', (e) => { state.wind = parseFloat(e.target.value); updateSliderDisplay(); updateVisuals(); });
        els.inpArea.addEventListener('input', (e) => { state.area = parseFloat(e.target.value); updateSliderDisplay(); updateVisuals(); });

        // Phenomenon Selector (Dropdown)
        els.inpSubstance.addEventListener('change', (e) => {
            const selectedIndex = e.target.selectedIndex;
            state.scene = selectedIndex + 1;
            renderScene();
        });

        // Scene Buttons
        document.querySelectorAll('.scene-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.scene = parseInt(btn.dataset.scene);
                state.running = false;
                els.btnRun.disabled = false; els.btnPause.disabled = true;
                renderScene();
            });
        });

        // Action Buttons
        els.btnRun.addEventListener('click', () => {
            state.running = true;
            els.btnRun.disabled = true; els.btnPause.disabled = false;
            animLoop(performance.now());
        });
        els.btnPause.addEventListener('click', () => { state.running = false; els.btnRun.disabled = false; els.btnPause.disabled = true; });
        els.btnReset.addEventListener('click', () => {
            state.running = false;
            state.temp = 30; els.inpTemp.value = 30;
            state.humidity = 50; els.inpPressure.value = 50;
            state.wind = 2; els.inpWind.value = 2;
            state.area = 5; els.inpArea.value = 5;
            els.btnRun.disabled = false; els.btnPause.disabled = true;
            updateSliderDisplay();
            renderScene();
        });

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelector('.tab-btn.active').classList.remove('active');
                e.target.classList.add('active');
                updateTabs();
            });
        });

        initMicroDots();
        updateSliderDisplay();
        renderScene();
        updateTabs();
    }
    init();
})();

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        colors: { hot: [239, 68, 68], neutral: [255, 215, 0], cool: [59, 130, 246], lattice: [245, 158, 11] },
        particleCount: 25
    };

    // --- BLOOM'S TAXONOMY CHALLENGES ---
    const BLOOM_GUIDES = {
        1: [ // Solid
            { level: 'remember', tag: 'Observe', text: 'Describe the motion of particles in the Solid state.' },
            { level: 'understand', tag: 'Compare', text: 'Increase the Temperature. How does the vibration of the particles change?' },
            { level: 'apply', tag: 'Experiment', text: 'Decrease the Intermolecular Force. What happens to the structure of the solid?' },
            { level: 'analyze', tag: 'Analyze', text: 'Why do solids have a fixed shape and volume? Relate it to particle attraction and movement.' },
            { level: 'evaluate', tag: 'Challenge', text: 'Can a solid exist at a very high temperature? Explain what conditions would be necessary.' }
        ],
        2: [ // Liquid
            { level: 'remember', tag: 'Identify', text: 'How is the arrangement of particles different in a liquid compared to a solid?' },
            { level: 'understand', tag: 'Explain', text: 'Why can liquids take the shape of their container but maintain a fixed volume?' },
            { level: 'apply', tag: 'Simulate', text: 'What combination of Temperature and Intermolecular Force is needed to turn this liquid into a gas?' },
            { level: 'analyze', tag: 'Connect', text: 'Explain the concept of "viscosity" (resistance to flow) using the particle model.' },
            { level: 'create', tag: 'Design', text: 'If you wanted to design a liquid that flows very slowly, what properties would you give its particles?' }
        ],
        3: [ // Gas
            { level: 'remember', tag: 'Define', text: 'Describe the spacing and movement of particles in the Gas state.' },
            { level: 'understand', tag: 'Observe', text: 'Increase the Container Volume. How do the particles respond?' },
            { level: 'apply', tag: 'Predict', text: 'If you decrease the Container Volume, what will happen to the pressure inside the container?' },
            { level: 'analyze', tag: 'Deduce', text: 'Why do gases not have a fixed shape or volume? Use the sliders to support your answer.' },
            { level: 'evaluate', tag: 'Judge', text: 'Which is more compressible: a solid, a liquid, or a gas? Explain why using the simulation.' }
        ],
        4: [ // State Change
            { level: 'remember', tag: 'Recall', text: 'Identify the two plateaus on the heating curve. What is happening to the substance at these points?' },
            { level: 'understand', tag: 'Relate', text: 'During melting, where does the added heat energy go if not into raising the temperature?' },
            { level: 'apply', tag: 'Solve', text: 'Set the starting state to Solid. How much energy is needed to turn it completely into a liquid?' },
            { level: 'analyze', tag: 'Compare', text: 'Why is the "Latent Heat of Vaporization" (boiling) much larger than the "Latent Heat of Fusion" (melting)?' },
            { level: 'create', tag: 'Propose', text: 'Design an experiment to measure the latent heat of fusion of an unknown substance.' }
        ],
        5: [ // Particle Model
            { level: 'remember', tag: 'Check', text: 'What are the three main factors that determine the state of matter?' },
            { level: 'understand', tag: 'Clarify', text: 'Explain the relationship between Temperature and the Kinetic Energy of particles.' },
            { level: 'apply', tag: 'Model', text: 'Use the sliders to create a substance with a very low boiling point.' },
            { level: 'analyze', tag: 'Contrast', text: 'Compare the role of Intermolecular Force in solids versus gases.' },
            { level: 'evaluate', tag: 'Debunk', text: 'A friend says particles in a solid are not moving. Use the simulation to prove them wrong.' }
        ]
    };

    // --- SCENE & VISUAL DEFINITIONS ---
    const SCENES = {
        1: { name: "Solid", svg: `<svg class="sim-svg" viewBox="0 0 100 100" style="width:70%; height:70%;"><rect x="10" y="10" width="80" height="80" rx="5" fill="#e0f7fa" stroke="#00bcd4" stroke-width="2" /><text x="50" y="95" text-anchor="middle" font-size="8" fill="#555">Solid Block</text></svg>` },
        2: { name: "Liquid", svg: `<svg class="sim-svg" viewBox="0 0 100 100" style="width:70%; height:70%;"><path d="M10 80 Q 50 70, 90 80 L 90 90 L 10 90 Z" fill="#add8e6" /><rect x="10" y="10" width="80" height="80" rx="5" fill="none" stroke="#ccc" stroke-width="2" /><text x="50" y="95" text-anchor="middle" font-size="8" fill="#555">Container with Liquid</text></svg>` },
        3: { name: "Gas", svg: `<svg class="sim-svg" viewBox="0 0 100 100" style="width:70%; height:70%;"><rect x="10" y="10" width="80" height="80" rx="5" fill="#f5f5f5" stroke="#ccc" stroke-width="2" /><text x="50" y="95" text-anchor="middle" font-size="8" fill="#555">Sealed Container</text></svg>` },
        4: { name: "State Change", svg: `<div class="heating-curve"><canvas id="heating-curve-canvas"></canvas></div>` },
        5: { name: "Particle Model", svg: `<svg class="sim-svg" viewBox="0 0 100 100" style="width:70%; height:70%;"><rect x="10" y="10" width="80" height="80" rx="5" fill="#f0f0f0" stroke="#ccc" stroke-width="2" /><text x="50" y="95" text-anchor="middle" font-size="8" fill="#555">Interaction Space</text></svg>` }
    };

    // --- STATE AND ELEMENTS ---
    const state = {
        scene: 1, temp: -10, force: 80, volume: 30,
        running: true,
        distance: 0,
        kineticEnergy: 0,
        currentState: 'Solid',
        heatingTime: 0
    };
    let animFrame; let microDotData = [];

    const els = {
        stage: document.getElementById('scene-stage'), particles: document.getElementById('particle-layer'), tabContent: document.getElementById('tab-content'),
        gaugeReadout: document.getElementById('gauge-val'), gaugeLiquid: document.getElementById('gauge-liquid'), chillBadge: document.getElementById('chill-badge'),
        scopeLens: document.getElementById('scope-lens'), guideContent: document.getElementById('guide-content'), legendState: document.getElementById('legend-state'),
        inpTemp: document.getElementById('inp-temp'), valTemp: document.getElementById('val-temp'), inpPressure: document.getElementById('inp-pressure'), valPressure: document.getElementById('val-pressure'), inpWind: document.getElementById('inp-wind'), valWind: document.getElementById('val-wind'),
        outRate: document.getElementById('out-rate'), outMetric: document.getElementById('out-metric'),
        btnRun: document.getElementById('btn-run'), btnPause: document.getElementById('btn-pause'), btnReset: document.getElementById('btn-reset')
    };

    // --- UTILITIES ---
    function lerp(a, b, t) { return a + (b - a) * t; }
    function interpolateColor(value, minVal, maxVal, lowColor, highColor) {
        const t = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)));
        const r = lerp(lowColor[0], highColor[0], t);
        const g = lerp(lowColor[1], highColor[1], t);
        const b = lerp(lowColor[2], highColor[2], t);
        return \`rgb(\${Math.round(r)},\${Math.round(g)},\${Math.round(b)})\`;
    }

    function updateSliderDisplay() {
        els.valTemp.innerText = Math.round(state.temp);
        els.valPressure.innerText = state.force.toFixed(0);
        els.valWind.innerText = state.volume.toFixed(0);
    }

    // --- MICRO VIEW LOGIC ---
    function initMicroDots() {
        els.scopeLens.innerHTML = ''; microDotData.length = 0;
        for(let i=0; i < CONFIG.particleCount; i++) {
            const d = document.createElement('div'); d.className = 'micro-dot';
            els.scopeLens.appendChild(d);
            microDotData.push({ el: d, x: 40, y: 40, vx: 0, vy: 0, angle: Math.random() * 2 * Math.PI });
        }
        updateMicroDots();
    }

    function updateMicroDots() {
        const T_norm = (state.temp + 20) / 140; // Normalize temp from -20 to 120
        const force_norm = state.force / 100;
        const vol_norm = state.volume / 100;

        const spacing = 10 + (1 - force_norm) * 20 + vol_norm * 20;
        const speed = T_norm * 2.5;

        microDotData.forEach((dot, i) => {
            if (state.currentState === 'Solid') {
                const row = Math.floor(i / 5); const col = i % 5;
                const targetX = 20 + col * 10; const targetY = 20 + row * 10;
                dot.el.className = 'micro-dot solid dot-fixed';
                const vibX = Math.sin(dot.angle + performance.now() / 150) * T_norm * 3;
                const vibY = Math.cos(dot.angle + performance.now() / 150) * T_norm * 3;
                dot.x = targetX + vibX; dot.y = targetY + vibY;
            } else {
                // Repulsive force from other particles
                let forceX = 0; let forceY = 0;
                microDotData.forEach(otherDot => {
                    if (dot === otherDot) return;
                    const dx = dot.x - otherDot.x;
                    const dy = dot.y - otherDot.y;
                    const distSq = dx*dx + dy*dy;
                    if (distSq < spacing*spacing) {
                        const dist = Math.sqrt(distSq);
                        const force = (spacing - dist) * 0.1;
                        forceX += (dx / dist) * force;
                        forceY += (dy / dist) * force;
                    }
                });

                // Attraction to center (emulates intermolecular force)
                const centerForce = (force_norm - 0.5) * 0.05;
                forceX -= (dot.x - 40) * centerForce;
                forceY -= (dot.y - 40) * centerForce;

                // Random motion from kinetic energy
                dot.vx += (Math.random() - 0.5) * speed * 0.5;
                dot.vy += (Math.random() - 0.5) * speed * 0.5;

                dot.vx += forceX; dot.vy += forceY;

                // Damping
                dot.vx *= 0.8; dot.vy *= 0.8;

                dot.x += dot.vx; dot.y += dot.vy;

                // Boundary conditions based on volume
                const boundary = 40 + vol_norm * 40;
                if (dot.x < 80 - boundary || dot.x > boundary) { dot.x = Math.max(80 - boundary, Math.min(boundary, dot.x)); dot.vx *= -1; }
                if (dot.y < 80 - boundary || dot.y > boundary) { dot.y = Math.max(80 - boundary, Math.min(boundary, dot.y)); dot.vy *= -1; }

                dot.el.className = \`micro-dot \${state.currentState.toLowerCase()}\`;
            }
            dot.el.style.transform = \`translate(\${dot.x}px, \${dot.y}px)\`;
        });

        els.legendState.innerHTML = \`<span class="dot state-\${state.currentState.toLowerCase()}"></span> Current State: \${state.currentState}\`;
    }

    // --- PHYSICS CALCULATION ---
    function calculatePhysics() {
        const T = state.temp;
        const F = state.force;

        if (state.scene !== 4) {
            // Simplified state determination based on Temp and Force
            const energyThreshold = F * 1.2; // Higher force requires more energy to change state
            if (T < energyThreshold - 20) {
                state.currentState = 'Solid';
            } else if (T < energyThreshold + 50) {
                state.currentState = 'Liquid';
            } else {
                state.currentState = 'Gas';
            }
        }

        state.kineticEnergy = Math.max(0, (T + 20)).toFixed(1);

        let totalDist = 0; let pairs = 0;
        for(let i=0; i<microDotData.length; ++i) {
            for (let j=i+1; j<microDotData.length; ++j) {
                const dx = microDotData[i].x - microDotData[j].x;
                const dy = microDotData[i].y - microDotData[j].y;
                totalDist += Math.sqrt(dx*dx + dy*dy);
                pairs++;
            }
        }
        state.distance = pairs > 0 ? (totalDist / pairs).toFixed(1) : 0;
    }

    // --- VISUAL UPDATE ---
    function updateVisuals() {
        if (state.running) calculatePhysics();

        els.outRate.innerText = \`\${state.distance} pm\`;
        els.outMetric.innerText = \`\${state.kineticEnergy} zJ\`;

        const keNorm = Math.min(100, Math.max(0, (state.temp + 20) / 1.4));
        els.gaugeLiquid.style.height = \`\${keNorm}%\`;
        els.gaugeReadout.innerText = \`KE: \${Math.round(keNorm)}/100\`;
        els.gaugeLiquid.style.background = interpolateColor(keNorm, 0, 100, CONFIG.colors.cool, CONFIG.colors.hot);

        updateTabs();
    }

    // --- ANIMATION LOOP ---
    function animLoop() {
        if (state.scene === 4 && state.running) {
            state.heatingTime += 0.5;
            drawHeatingCurve();
            els.inpTemp.value = state.temp;
        }

        if (state.running) {
            updateMicroDots();
            updateVisuals();
        }
        animFrame = requestAnimationFrame(animLoop);
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

        let currentTime = state.heatingTime;
        currentTime = Math.min(currentTime, maxTime);
        let currentTemp = -20;

        for (let i = 1; i < curve.length; i++) {
            if (currentTime <= curve[i].time) {
                const t = (currentTime - curve[i-1].time) / (curve[i].time - curve[i-1].time);
                currentTemp = lerp(curve[i-1].temp, curve[i].temp, t || 0);
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
        if (!els.chillBadge.hidden) els.chillBadge.innerText = \`🌡️ \${state.currentState}!\`;
    }

    // --- TAB CONTENT ---
    function updateTabs() {
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        let content = "";

        switch(activeTab) {
            case 'model':
                content = \`<h4>The Particle Model of Matter</h4>
                <p>This model is based on three core ideas:</p>
                <ul>
                  <li><strong>Kinetic Energy (KE):</strong> Particles are always in motion. Temperature is a measure of their average KE. Higher temperature means faster movement.</li>
                  <li><strong>Intermolecular Forces (IMF):</strong> Attractive forces exist between particles. These forces are very strong in solids, weaker in liquids, and almost nonexistent in gases.</li>
                  <li><strong>Particle Spacing:</strong> The distance between particles determines the state. Solids are tightly packed, liquids are close but can move, and gases are far apart.</li>
                </ul>\`;
                break;
            case 'visual':
                content = \`<h4>Visual Decoding</h4>
                <ul>
                  <li><strong>Micro View:</strong> Shows a magnified view of particles. Observe their arrangement, spacing, and type of motion.</li>
                  <li><strong>KE Gauge:</strong> Directly represents the average kinetic energy of the particles, controlled by the Temperature slider.</li>
                  <li><strong>Readouts:</strong> Provide live data on the average distance between particles and their kinetic energy.</li>
                </ul>\`;
                break;
            case 'analogy':
                content = \`<h4>States of Matter: A Group of People</h4>
                <ul>
                  <li><strong>Solid:</strong> People standing shoulder-to-shoulder in a tight crowd, unable to move from their spot (High IMF, Low KE).</li>
                  <li><strong>Liquid:</strong> People walking around a room, able to move past each other but still contained within the walls (Medium IMF, Medium KE).</li>
                  <li><strong>Gas:</strong> People running freely in an open field, far apart and moving in all directions (Low IMF, High KE).</li>
                </ul>\`;
                break;
            case 'cause':
                content = \`<h4>Chain of Events: From Solid to Gas</h4>
                <p>Increased <strong>Temperature</strong> &rarr; Higher <strong>Kinetic Energy</strong> &rarr; Particles vibrate/move faster &rarr; Overcomes <strong>Intermolecular Forces</strong> &rarr; Particle <strong>Spacing</strong> Increases &rarr; State changes from Solid to Liquid to Gas.</p>\`;
                break;
            case 'fix':
                content = \`<h4>Common Misconceptions</h4>
                <ul>
                  <li><strong>Particles themselves expand when heated:</strong> False. The particles stay the same size; they just move faster and the space between them increases.</li>
                  <li><strong>Solids have no particle motion:</strong> False. Particles in a solid are constantly vibrating in a fixed position. Absolute zero is the only point of no motion.</li>
                  <li><strong>Pressure makes things solid:</strong> While pressure can force particles closer, Intermolecular Force is the primary reason solids hold their shape.</li>
                </ul>\`;
                break;
        }
        els.tabContent.innerHTML = content;
    }

    // --- INITIALIZATION AND EVENT HANDLER ---
    function renderScene() {
        els.stage.innerHTML = SCENES[state.scene].svg;

        document.querySelectorAll('.scene-btn').forEach((btn, i) => {
            btn.classList.toggle('active', (i + 1) === state.scene);
        });

        // Set slider states based on scene
        const isStateChangeScene = state.scene === 4;
        [els.inpTemp, els.inpPressure, els.inpWind].forEach(inp => inp.disabled = isStateChangeScene);

        if (isStateChangeScene) {
            state.heatingTime = 0;
            setupHeatingCurve();
        } else {
            // Set typical state values for each scene
            switch(state.scene) {
                case 1: state.temp = -10; state.force = 80; state.volume = 30; break; // Solid
                case 2: state.temp = 30; state.force = 50; state.volume = 40; break; // Liquid
                case 3: state.temp = 80; state.force = 20; state.volume = 80; break; // Gas
                case 5: break; // Particle Model - free control
            }
            els.inpTemp.value = state.temp;
            els.inpPressure.value = state.force;
            els.inpWind.value = state.volume;
            els.chillBadge.hidden = true;
        }

        const guides = BLOOM_GUIDES[state.scene] || [];
        els.guideContent.innerHTML = \`<ul class="guide-list">
            \${guides.map(g => \`
                <li class="guide-item">
                    <span class="bloom-tag \${g.level}">\${g.tag}</span>
                    <span class="guide-text">\${g.text}</span>
                </li>
            \`).join('')}
        </ul>\`;

        updateSliderDisplay();
        updateVisuals();
    }

    function init() {
        // Sliders
        els.inpTemp.addEventListener('input', (e) => { state.temp = parseFloat(e.target.value); updateSliderDisplay(); });
        els.inpPressure.addEventListener('input', (e) => { state.force = parseFloat(e.target.value); updateSliderDisplay(); });
        els.inpWind.addEventListener('input', (e) => { state.volume = parseFloat(e.target.value); updateSliderDisplay(); });

        // Scene Buttons
        document.querySelectorAll('.scene-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.scene = parseInt(btn.dataset.scene);
                renderScene();
            });
        });

        // Action Buttons
        els.btnRun.addEventListener('click', () => { state.running = true; els.btnRun.disabled = true; els.btnPause.disabled = false; });
        els.btnPause.addEventListener('click', () => { state.running = false; els.btnRun.disabled = false; els.btnPause.disabled = true; });
        els.btnReset.addEventListener('click', () => { renderScene(); });

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelector('.tab-btn.active').classList.remove('active');
                e.target.classList.add('active');
                updateTabs();
            });
        });

        initMicroDots();
        renderScene();
        animLoop(); // Start the animation loop immediately
        els.btnRun.disabled = true;
        els.btnPause.disabled = false;
    }
    init();
})();
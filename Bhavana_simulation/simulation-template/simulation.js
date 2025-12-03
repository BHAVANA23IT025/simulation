    
// Lesson: Matter in Our Surroundings
// Core Concepts: Particle Nature, States, State Change, Diffusion, Evaporation

(function() {
    'use strict';
    
    // --- CONFIGURATION ---
    const CONFIG = { 
        colors: { hot: [239, 68, 68], neutral: [255, 215, 0], cool: [59, 130, 246], lattice: [245, 158, 11] }, // Red, Gold, Blue, Amber
        substanceProps: { 
            water: { MP: 0, BP: 100, L_F: 334, L_V: 2260, volatility: 1.0 }, // L_F/L_V in J/g (simplified)
            alcohol: { MP: -114, BP: 78, L_F: 108, L_V: 855, volatility: 1.8 },
            mercury: { MP: -39, BP: 357, L_F: 11, L_V: 295, volatility: 0.1 },
            acetone: { MP: -95, BP: 56, L_F: 98, L_V: 539, volatility: 2.5 }
        },
        particleCount: 20
    };

    // --- BLOOM'S TAXONOMY CHALLENGES --- (Inferred based on Learning Objectives)
    const BLOOM_GUIDES = {
        1: [ // Scene 1: Particle Evidence
            { level: 'remember', tag: 'Observe', text: 'Drop one count of dye. How many micro-particles are visible in the lens? ($1\text{ drop} = 20\text{ particles}$).' },
            { level: 'understand', tag: 'Compare', text: 'What is the minimum dilution (highest drop count) needed before the color is indistinguishable?' },
            { level: 'apply', tag: 'Experiment', text: 'Can you use <strong>Mixing Speed</strong> to simulate increasing the particles\' kinetic energy?' },
            { level: 'analyze', tag: 'Analyze', text: 'Explain why adding more dye does not increase the size of the individual particles.' },
            { level: 'evaluate', tag: 'Challenge', text: 'If the system\'s volume doubles, how must the drop count change to maintain the original concentration?' }
        ],
        2: [ // Scene 2: Diffusion Rate
            { level: 'remember', tag: 'Identify', text: 'Set $T$ to 10°C. Observe the time it takes for particles to diffuse fully.' },
            { level: 'understand', tag: 'Explain', text: 'Increase $T$ to 50°C. Why does the diffusion time decrease drastically?' },
            { level: 'apply', tag: 'Simulate', text: 'Determine the temperature needed to halve the diffusion time from the initial setting (30°C).' },
            { level: 'analyze', tag: 'Connect', text: 'Diffusion shows particle motion. Where does the energy for this continuous motion come from?' },
            { level: 'create', tag: 'Design', text: 'If you could choose two gases, one light and one heavy, which would diffuse faster at 25°C?' }
        ],
        3: [ // Scene 3: States of Matter
            { level: 'remember', tag: 'Define', text: 'What is the difference in particle arrangement between the Solid and Liquid state?' },
            { level: 'understand', tag: 'Observe', text: 'Increase <strong>Temperature</strong> while keeping <strong>Pressure</strong> constant. At what point does the arrangement change?' },
            { level: 'apply', tag: 'Predict', text: 'If the substance is currently a Gas, how can you force it back into a Liquid state using the controls?' },
            { level: 'analyze', tag: 'Deduce', text: 'Why is the <strong>Volume</strong> readout nearly constant for a Solid, but highly variable for a Gas?' },
            { level: 'evaluate', tag: 'Judge', text: 'Can a substance exist as a Solid at 100°C? Use the Pressure slider to justify your answer.' }
        ],
        4: [ // Scene 4: Latent Heat
            { level: 'remember', tag: 'Recall', text: 'Identify the two plateaus on the heating curve. What temperatures do they correspond to for <strong>Water</strong>?' },
            { level: 'understand', tag: 'Relate', text: 'What is <strong>Latent Heat of Fusion</strong>? How is it visually represented in the Micro View?' },
            { level: 'apply', tag: 'Solve', text: 'If the substance is Ice at 0°C, and $20 \text{ kJ}$ of heat is added, how much liquid water is formed?' },
            { level: 'analyze', tag: 'Compare', text: 'Compare the energy ($\text{L}_F$ vs $\text{L}_V$) required for melting vs. boiling for the current substance.' },
            { level: 'create', tag: 'Propose', text: 'Design a system where $\text{L}_V$ (Latent Heat of Vaporisation) is used to cool another object.' }
        ],
        5: [ // Scene 5: Evaporation & Cooling
            { level: 'remember', tag: 'Check', text: 'What effect does increasing <strong>Surface Area</strong> have on the Evap Rate?' },
            { level: 'understand', tag: 'Clarify', text: 'Why is evaporation considered a cooling process, even though heat is absorbed during the process?' },
            { level: 'apply', tag: 'Model', text: 'Find the settings that simulate clothes drying fastest on a cold, windy day.' },
            { level: 'analyze', tag: 'Contrast', text: 'Compare the effect of <strong>Wind Speed</strong> and <strong>Substance Type</strong> (Volatility) on the evaporation rate.' },
            { level: 'evaluate', tag: 'Debunk', text: 'A student says "Evaporation and Boiling are the same thing." Use the Micro View to explain why they are wrong.' }
        ]
    };

    // --- SCENE & VISUAL DEFINITIONS ---
    const SCENES = {
        1: { name: "Particle Evidence", readoutLabel: "Dilution Factor", readoutUnit: "x", svg: `<svg class="sim-svg" viewBox="0 0 100 100" style="width:70%; height:70%;"><rect x="10" y="20" width="80" height="70" rx="5" fill="#e0f7fa" stroke="#00bcd4" stroke-width="2"/><circle cx="50" cy="55" r="30" fill="#add8e6" opacity="0.6" class="surface-fill"/><rect x="45" y="10" width="10" height="15" fill="#666"/><text x="50" y="95" text-anchor="middle" font-size="8" fill="#555">Beaker of Water</text></svg>` },
        2: { name: "Diffusion Rate", readoutLabel: "Diffusion Time", readoutUnit: "s", svg: `<svg class="sim-svg" viewBox="0 0 100 100" style="width:70%; height:70%;"><rect x="10" y="20" width="80" height="35" rx="5" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/><rect x="10" y="55" width="80" height="35" rx="5" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/><text x="50" y="40" text-anchor="middle" font-size="7" fill="#888">Hot Water ($T_{High}$)</text><text x="50" y="75" text-anchor="middle" font-size="7" fill="#888">Cold Water ($T_{Low}$)</text><circle cx="50" cy="40" r="5" fill="#ff0000" opacity="0.8" class="hot-diffusion-point"/><circle cx="50" cy="75" r="5" fill="#0000ff" opacity="0.8" class="cold-diffusion-point"/></svg>` },
        3: { name: "States of Matter", readoutLabel: "Volume", readoutUnit: "mL", svg: `<svg class="sim-svg" viewBox="0 0 100 100" style="width:50%; height:80%;"><rect x="10" y="10" width="80" height="80" rx="5" fill="#f5f5f5" stroke="#ccc" stroke-width="2"/><rect x="15" y="15" width="70" height="70" rx="3" fill="#add8e6" opacity="0.4" class="substance-container"/><text x="50" y="95" text-anchor="middle" font-size="8" fill="#555">Sealed Container</text></svg>` },
        4: { name: "Latent Heat", readoutLabel: "Latent Heat", readoutUnit: "kJ", svg: `<div class="heating-curve"><canvas id="heating-curve-canvas"></canvas></div>` },
        5: { name: "Evaporation & Cooling", readoutLabel: "Evap Rate", readoutUnit: "g/s", svg: `<svg class="sim-svg" viewBox="0 0 100 100" style="width:70%; height:70%;"><rect x="25" y="50" width="50" height="40" fill="#e0f7fa" stroke="#00bcd4" stroke-width="2"/><rect x="25" y="45" width="50" height="5" class="surface-fill" fill="#add8e6" opacity="0.8"/><text x="50" y="95" text-anchor="middle" font-size="8" fill="#555">Liquid Surface</text></svg>` }
    };
    
    // --- STATE AND ELEMENTS ---
    const state = { 
        scene: 1, temp: 30, pressure: 1.0, wind: 2, area: 1.0, substance: 'water', 
        running: false, 
        rateMetric: 0, // e.g., Dilution Factor, Diffusion Time, Evap Rate
        secondaryMetric: 0, // e.g., Particle Count, Volume, Latent Heat
        currentState: 'Solid',
        heatingTime: 0 // For Scene 4
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
    
    /**
     * Updates the visible numeric labels next to the sliders in the control panel.
     */
    function updateSliderDisplay() {
        // Temperature (0 decimal places)
        els.valTemp.innerText = Math.round(state.temp); 
        // Pressure (1 decimal place)
        els.valPressure.innerText = state.pressure.toFixed(1); 
        // Wind (0 decimal places)
        els.valWind.innerText = Math.round(state.wind);
        // Area (1 decimal place)
        els.valArea.innerText = state.area.toFixed(1);
    }
    
    // --- MICRO VIEW LOGIC ---
    function initMicroDots() {
        els.scopeLens.innerHTML = ''; microDotData.length = 0;
        const radius = 30; // Radius for arrangement
        for(let i=0; i < CONFIG.particleCount; i++) {
            const d = document.createElement('div'); d.className = 'micro-dot';
            els.scopeLens.appendChild(d);
            microDotData.push({ el: d, x: 0, y: 0, targetX: 0, targetY: 0, angle: Math.random() * 2 * Math.PI });
        }
        updateMicroDots(); // Initial placement
    }

    function updateMicroDots() {
        const T_norm = state.temp / 100;
        const KE_speed = 1.0 + T_norm * 2;
        // The arrangement is implicitly defined by the current state.

        microDotData.forEach((dot, i) => {
            let dx, dy;
            
            if (state.currentState === 'Solid') {
                // Fixed position in a lattice, slight vibration (motion about mean position)
                const row = Math.floor(i / 4);
                const col = i % 4;
                dot.targetX = 15 + col * 15;
                dot.targetY = 15 + row * 15;
                dot.el.classList.remove('liquid', 'gas'); dot.el.classList.add('solid', 'dot-fixed');
                
                dx = dot.targetX + (Math.sin(dot.angle + T_norm * 100) * 0.5 * T_norm * 5);
                dy = dot.targetY + (Math.cos(dot.angle + T_norm * 100) * 0.5 * T_norm * 5);
                dot.angle += 0.1 * T_norm;
                
            } else if (state.currentState === 'Liquid') {
                // Closer, random movement, changing neighbours
                dot.el.classList.remove('solid', 'gas', 'dot-fixed'); dot.el.classList.add('liquid');
                dx = dot.x + (Math.random() - 0.5) * KE_speed;
                dy = dot.y + (Math.random() - 0.5) * KE_speed;
                
                // Containment
                if (dx < 5) dx = 5; if (dx > 75) dx = 75;
                if (dy < 5) dy = 5; if (dy > 75) dy = 75;
                
                dot.x = dx; dot.y = dy;
                
            } else { // Gas
                // Far apart, rapid, chaotic motion (free movement)
                dot.el.classList.remove('solid', 'liquid', 'dot-fixed'); dot.el.classList.add('gas');
                dx = dot.x + (Math.random() - 0.5) * KE_speed * 2.5;
                dy = dot.y + (Math.random() - 0.5) * KE_speed * 2.5;
                
                // Boundary reflection
                if (dx < 0 || dx > 80) dot.x = dx < 0 ? 0 : 80; else dot.x = dx;
                if (dy < 0 || dy > 80) dot.y = dy < 0 ? 0 : 80; else dot.y = dy;
            }
            
            dot.el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        
        // Update state label in legend
        const stateClass = state.currentState.toLowerCase().replace('é', 'e').split(' ')[0];
        els.legendState.innerHTML = `<span class="dot state-${stateClass}"></span> Current State: ${state.currentState}`;
    }
    
    // --- PHYSICS CALCULATION ---
    function calculatePhysics() {
        const P = CONFIG.substanceProps[state.substance];
        const T = state.temp;
        const T_norm = Math.max(0, T - P.MP) / (P.BP - P.MP + 10); // Normalized temperature above MP
        
        // 1. Determine State (Used by Micro View & Scene 3)
        // Note: For Scene 4, state is updated by drawHeatingCurve, not here.
        if (state.scene !== 4) {
             if (T < P.MP) { state.currentState = 'Solid'; }
             else if (T < P.BP) { state.currentState = 'Liquid'; }
             else { state.currentState = 'Gas'; }
        }
        
        // 2. Scene-Specific Calculations
        if (state.scene === 1) {
            // Particle Evidence / Dilution
            const dilution = state.area; // Area (Drop Count) acts as dilution
            state.rateMetric = (10 / dilution).toFixed(1); // Relative Dilution Factor
            state.secondaryMetric = Math.round(dilution * CONFIG.particleCount * 10); // Particle count (relative)
            
        } else if (state.scene === 2) {
            // Diffusion Rate
            // Rate ∝ √T (Graham's Law approximation for KE)
            // Time ∝ 1/√T
            const T_kelvin = T + 273.15;
            const diffusionTime = 100 / (Math.sqrt(T_kelvin) + 0.5 * state.wind); 
            state.rateMetric = Math.max(1, diffusionTime).toFixed(1);
            state.secondaryMetric = Math.round(T * 10 / 120); // Relative KE (0-10)
            
        } else if (state.scene === 3) {
            // States of Matter
            let volume = 50; // Base solid volume
            if (state.currentState === 'Liquid') {
                 volume = 50 + T_norm * 5;
            } else if (state.currentState === 'Gas') {
                // Gas volume is highly dependent on T (directly) and P (inversely)
                volume = (50 + T * 0.5) / state.pressure;
            }
            state.rateMetric = state.currentState; // Primary readout is state
            state.secondaryMetric = Math.max(50, volume).toFixed(1);
            
        } else if (state.scene === 4) {
            // Latent Heat (Heating Curve & Energy Absorbed) - Primary logic in drawHeatingCurve
            const totalHeat = state.heatingTime * state.area * 0.1; // Heat in kJ (area acts as heat input rate)
            
            // Simplified metric
            state.rateMetric = totalHeat.toFixed(1); // Total Heat Added
            state.secondaryMetric = state.currentState.includes('Melting') || state.currentState.includes('Solid') ? P.L_F : P.L_V; // Latent Heat Value
            
        } else if (state.scene === 5) {
            // Evaporation & Cooling
            const V = P.volatility;
            const T_evap = state.temp / 100;
            const A = state.area;
            const W = 1 + (state.wind / 10);
            
            // Evap Rate (Volatility * Area * Temp * Wind)
            state.rateMetric = (V * A * T_evap * W * 0.5).toFixed(2); // Evap Rate
            
            // Cooling Effect ∝ Evap Rate * Latent Heat of Vaporisation
            const coolingEffect = parseFloat(state.rateMetric) * P.L_V * 0.001 * 2; 
            state.secondaryMetric = coolingEffect.toFixed(2);
        }
    }

    // --- VISUAL UPDATE ---
    function updateVisuals() {
        calculatePhysics();
        
        // Update Readouts
        els.outRate.innerText = state.rateMetric;
        els.outRateLabel.innerText = SCENES[state.scene].readoutLabel;
        els.outMetric.innerText = state.secondaryMetric + (state.scene === 5 ? " °C" : SCENES[state.scene].readoutUnit);
        els.outMetricLabel.innerText = state.scene === 5 ? "Cooling Effect" : (state.scene === 4 ? "Latent Heat (J/g)" : SCENES[state.scene].readoutLabel.split(' ')[0] + " Metric");

        // Update Gauge (Kinetic Energy Gauge)
        const keNorm = Math.min(100, Math.max(0, state.temp / 1.2));
        els.gaugeLiquid.style.height = `${keNorm}%`; 
        els.gaugeReadout.innerText = `KE: ${Math.round(keNorm)}/100`;
        els.gaugeLiquid.style.background = interpolateColor(keNorm, 0, 100, CONFIG.colors.cool, CONFIG.colors.hot);

        // Update Haze/Surface (Scene-specific visual adjustments)
        if (state.scene === 1) { 
             const hazeOp = 1 - (state.area / 3.0); // Higher area (drops) = less haze (more mixed)
             els.hazeLayer.style.background = `rgba(139, 92, 246, ${Math.max(0, hazeOp * 0.6)})`;
        } else if (state.scene === 5) {
            const cooling = parseFloat(state.secondaryMetric);
            const surfaceTemp = state.temp - (cooling * 5); // Simulated surface temp drop
            const color = interpolateColor(surfaceTemp, 0, 100, CONFIG.colors.cool, CONFIG.colors.hot);
            const target = els.stage.querySelector('.surface-fill');
            if (target) target.style.fill = color;
        } else {
            els.hazeLayer.style.background = 'transparent';
        }
        
        updateTabs();
    }
    
    // --- ANIMATION LOOP ---
    function animLoop(timestamp) {
        if (!state.running) return;
        
        // Scene 4: Update Heating Curve over time
        if (state.scene === 4) {
            state.heatingTime += 0.5; // Add heat over time (increased rate for visibility)
            drawHeatingCurve();
            // Need to update the temp slider value from the curve
            els.inpTemp.value = state.temp; 
        }

        // Scene 5: Spawn Evaporation Particles
        if (state.scene === 5 && state.rateMetric > 0.1) {
            const interval = 800 / (parseFloat(state.rateMetric) * 30); // Faster evap = shorter interval
            if (timestamp - lastParticleTime > interval) { spawnParticle(state.wind); lastParticleTime = timestamp; }
        }

        updateMicroDots();
        updateVisuals(); 
        animFrame = requestAnimationFrame(animLoop);
    }
    
    function spawnParticle(wind) {
        const p = document.createElement('div'); p.className = 'particle vapor-particle';
        const offset = (Math.random() - 0.5) * 40 * state.area; 
        p.style.left = `calc(50% + ${offset}px)`; p.style.top = '50%';
        
        // Drift effect based on wind
        const driftX = wind * 30 * Math.random(); 
        const driftY = -120 * (1 + Math.random() * 0.5); 
        p.style.setProperty('--dx', `${driftX}px`);
        p.style.setProperty('--dy', `${driftY}px`);
        p.style.animation = `riseAndDrift ${3 - wind/6}s linear forwards`;
        
        els.particles.appendChild(p); setTimeout(() => p.remove(), 3000);
    }

    // --- SCENE 4 SPECIFIC LOGIC (Heating Curve) ---
    let heatingCurveCtx;
    // Normalized curve for Water
    const waterCurve = [
        { temp: -20, time: 0 }, { temp: 0, time: 40 }, // Solid phase
        { temp: 0, time: 40 + 33.4 }, // Fusion Plateau (334 J/g)
        { temp: 100, time: 40 + 33.4 + 200 }, // Liquid phase
        { temp: 100, time: 40 + 33.4 + 200 + 226 }, // Vaporisation Plateau (2260 J/g)
        { temp: 120, time: 40 + 33.4 + 200 + 226 + 20 } // Gas phase
    ];
    
    function setupHeatingCurve() {
        const canvas = document.getElementById('heating-curve-canvas');
        if (!canvas) return;
        heatingCurveCtx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawHeatingCurve();
    }
    
    function drawHeatingCurve() {
        if (!heatingCurveCtx) return;
        const ctx = heatingCurveCtx;
        const W = ctx.canvas.width; const H = ctx.canvas.height;
        ctx.clearRect(0, 0, W, H);
        
        const curve = waterCurve;
        const maxTime = curve[curve.length - 1].time;
        const maxTemp = 120;
        
        const timeToX = (t) => t / maxTime * W;
        const tempToY = (t) => H - (t + 20) / (maxTemp + 20) * H; // -20 to 120

        // Draw static curve
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < curve.length; i++) {
            const x = timeToX(curve[i].time);
            const y = tempToY(curve[i].temp);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw Axes and Labels
        ctx.fillStyle = '#666'; ctx.font = '10px Inter';
        ctx.fillText('Temp (°C)', 5, 10); ctx.fillText('Time (Heat Added)', W - 70, H - 5);
        
        // Find current point on the curve
        let currentTemp = 0;
        let currentTime = state.heatingTime * state.area * 0.5;
        currentTime = Math.min(currentTime, maxTime);

        for (let i = 1; i < curve.length; i++) {
            const p1 = curve[i - 1];
            const p2 = curve[i];
            if (currentTime <= p2.time) {
                const t = (currentTime - p1.time) / (p2.time - p1.time);
                currentTemp = lerp(p1.temp, p2.temp, t);
                break;
            } else if (i === curve.length - 1) {
                currentTemp = p2.temp; // Max temp reached
            }
        }
        
        const currentX = timeToX(currentTime);
        const currentY = tempToY(currentTemp);

        // Draw Current Point
        ctx.fillStyle = CONFIG.colors.hot;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Update global state and UI elements based on curve position
        state.temp = currentTemp;
        updateSliderDisplay(); // Crucial update for temp label
        
        if (currentTemp < 0) state.currentState = 'Solid';
        else if (currentTemp === 0 && currentTime > curve[0].time && currentTime < curve[1].time) state.currentState = 'Melting';
        else if (currentTemp < 100) state.currentState = 'Liquid';
        else if (currentTemp === 100 && currentTime > curve[2].time && currentTime < curve[3].time) state.currentState = 'Boiling';
        else state.currentState = 'Gas';
        
        els.chillBadge.hidden = state.currentState !== 'Melting' && state.currentState !== 'Boiling';
        if (!els.chillBadge.hidden) els.chillBadge.innerText = `🌡️ ${state.currentState} Plateau!`;
    }

    // --- TAB CONTENT ---
    function updateTabs() {
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        let content = "";
        const P = CONFIG.substanceProps[state.substance];
        const L_F = P.L_F.toFixed(0);
        const L_V = P.L_V.toFixed(0);
        
        if (activeTab === 'model') {
            content = `
                <h4>The Particle Model Equations</h4>
                <div class="live-equation-container">
                    <p><strong>Kinetic Energy & Temperature (Scenes 1, 2, 3):</strong></p>
                    <div class="equation-row">KE $\propto$ $T$</div>
                    <p><strong>Diffusion Rate (Scene 2):</strong></p>
                    <div class="equation-row">Diffusion Rate $\propto \frac{\sqrt{T}}{Mass}$</div>
                    <p><strong>Latent Heat (Scene 4):</strong></p>
                    <div class="equation-row">$Q = m L$</div>
                    <div class="calc-breakdown">
                        <span class="cb-label">Where $Q$ is heat added, $m$ is mass, and $L$ is Latent Heat.</span>
                        <span class="cb-label">Fusion ($L_F$): ${L_F} J/g</span>
                        <span class="cb-label">Vaporisation ($L_V$): ${L_V} J/g</span>
                    </div>
                </div>
            `;
        } else {
            switch(activeTab) {
                case 'visual': 
                    content = `
                        <h4>Visual Decoding</h4>
                        <p><strong>Micro View:</strong> Shows particle movement (KE). Solid: Vibration; Liquid: Free movement, close; Gas: Chaotic, far apart.</p>
                        <p><strong>KE Gauge:</strong> Measures overall Kinetic Energy ($KE$). $\text{Higher } T \text{ means higher } KE \text{ and faster motion.}$</p>
                        <p><strong>Particle Layer:</strong> Shows dye diffusion (S1/S2) or energetic particles escaping (S5).</p>
                    `; 
                    break;
                case 'analogy': 
                    content = `
                        <h4>States of Matter: The Crowd Analogy</h4>
                        <p><strong>Solid:</strong> Like people seated in an auditorium. They vibrate slightly (KE) but stay fixed in position (strong attraction).</p>
                        <p><strong>Liquid:</strong> Like people walking through a crowded hallway. They are close but can move past each other (moderate attraction).</p>
                        <p><strong>Gas:</strong> Like people running freely outside a stadium. They are far apart and move chaotically (negligible attraction).</p>
                    `; 
                    break;
                case 'cause': 
                    content = `
                        <h4>Chain of Events</h4>
                        <p><strong>Heating:</strong> Heat Energy $\rightarrow$ Increased Kinetic Energy $\rightarrow$ Particles Vibrate/Move Faster $\rightarrow$ Inter-particle Attraction Overcome $\rightarrow$ State Change (Melting/Boiling).</p>
                        <p><strong>Evaporation (S5):</strong> Energetic surface particles escape $\rightarrow$ Average KE of remaining liquid drops $\rightarrow$ Cooling Effect is observed.</p>
                    `; 
                    break;
                case 'fix': 
                    content = `
                        <h4>Common Misconceptions</h4>
                        <p><strong>Evaporation vs. Boiling:</strong> Evaporation is a $\text{surface}$ phenomenon and occurs at $\text{all}$ temperatures. Boiling is a $\text{bulk}$ phenomenon and occurs only at the $\text{boiling point}$.</p>
                        <p><strong>Vapor vs. Gas:</strong> Vapor refers to the gaseous state of a substance that is a liquid at room temperature (like water). Gas refers to a substance that is naturally gaseous at room temperature (like Oxygen).</p>
                    `; 
                    break;
            }
        }
        els.tabContent.innerHTML = content;
    }

    // --- INITIALIZATION AND EVENT HANDLERS ---
    function renderScene() {
        els.stage.innerHTML = SCENES[state.scene].svg; 
        els.particles.innerHTML = '';
        state.heatingTime = 0; // Reset for Scene 4
        
        // Update readout labels based on scene
        els.outRateLabel.innerText = SCENES[state.scene].readoutLabel;
        updateSliderDisplay(); // Ensure sliders reflect state after scene change

        // Scene 4 specific setup
        if (state.scene === 4) { 
            setupHeatingCurve(); 
            els.inpTemp.disabled = true; // Temperature is controlled by heating curve
        } else { 
            els.chillBadge.hidden = true; 
            els.inpTemp.disabled = false;
        }

        // Render Guide List
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

    function triggerPulse() {
        const readouts = document.querySelectorAll('.pulse-target');
        readouts.forEach(r => { r.classList.remove('pulse-anim'); void r.offsetWidth; r.classList.add('pulse-anim'); });
    }

    function init() {
        // Sliders and Dropdown Handlers
        ['inpTemp', 'inpPressure', 'inpWind', 'inpArea'].forEach(id => { 
            els[id].addEventListener('input', (e) => { 
                state[id.replace('inp','').toLowerCase()] = parseFloat(e.target.value); 
                updateSliderDisplay(); // <--- FIXED: Update the label next to the slider
                updateVisuals(); 
                triggerPulse(); 
                if (state.scene === 4) setupHeatingCurve(); // Rerender static graph on param change
            }); 
        });
        els.inpSubstance.addEventListener('change', (e) => { 
            state.substance = e.target.value; 
            updateVisuals(); 
            triggerPulse(); 
            renderScene(); 
        });

        // Scene Buttons
        document.querySelectorAll('.scene-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('.scene-btn'); 
                document.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active')); 
                target.classList.add('active');
                state.scene = parseInt(target.dataset.scene); 
                state.running = false; 
                els.btnRun.disabled = false; 
                els.btnPause.disabled = true; 
                els.inpSubstance.disabled = false;
                renderScene();
            });
        });

        // Action Buttons
        els.btnRun.addEventListener('click', () => { 
            state.running = true; 
            els.btnRun.disabled = true; 
            els.btnPause.disabled = false; 
            els.inpSubstance.disabled = true; 
            animLoop(performance.now()); 
        });
        els.btnPause.addEventListener('click', () => { 
            state.running = false; 
            els.btnRun.disabled = false; 
            els.btnPause.disabled = true; 
            els.inpSubstance.disabled = false; 
        });
        els.btnReset.addEventListener('click', () => { 
            state.running = false; 
            // Reset state to initial values
            state.temp = 30; els.inpTemp.value = 30; 
            state.pressure = 1.0; els.inpPressure.value = 1.0; 
            state.wind = 2; els.inpWind.value = 2; 
            state.area = 1.0; els.inpArea.value = 1.0;
            state.substance = 'water'; els.inpSubstance.value = 'water';
            
            els.inpSubstance.disabled = false; 
            els.btnRun.disabled = false; 
            
            updateSliderDisplay(); // Ensure labels reset
            renderScene(); 
        });
        
        // Tab Selection
        document.querySelectorAll('.tab-btn').forEach(btn => { 
            btn.addEventListener('click', (e) => { 
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); 
                e.target.classList.add('active'); 
                updateTabs(); 
            }); 
        });
        
        initMicroDots(); 
        updateSliderDisplay(); // Initial display of all slider values
        renderScene();
        updateTabs();
    }
    init();
})();
// simulation.js
// Lesson: Cells: Structure, Membrane Transport, Organelles and Cell Division
// Based on Evaporation Simulation Architecture

(function() {
  'use strict';
  
  const CONFIG = { 
    cellColors: { nucleus: '#e53935', cytoplasm: '#fafafa', membrane: '#00bcd4', wall: '#8bc34a' }, 
    stainAffinity: { iodine: 0.8, methylene: 0.5, safranin: 0.3, none: 0.0 } // Affinity for Nucleus/Cell components
  };
  
  // BLOOM'S TAXONOMY CHALLENGES
  const BLOOM_GUIDES = {
    1: [ // Scene 1: Discovery & Microscopy
      { level: 'remember', tag: 'Observe', text: 'Select <strong>Onion Peel</strong>. What cell part is most visible without stain?' },
      { level: 'understand', tag: 'Compare', text: 'Switch between <strong>Iodine</strong> and <strong>Methylene Blue</strong>. Which stains the nucleus more intensely?' },
      { level: 'apply', tag: 'Experiment', text: 'Find the minimum <strong>Magnification</strong> to clearly distinguish a nucleus in the cheek cell.' },
      { level: 'analyze', tag: 'Analyze', text: 'Why is the onion cell boundary (cell wall) much more rigid than the cheek cell boundary?' },
      { level: 'evaluate', tag: 'Challenge', text: 'Based on the stain patterns, which cell part has higher concentrations of starch/cellulose (Iodine affinity)?' }
    ],
    2: [ // Scene 2: Plasma Membrane, Diffusion & Osmosis
      { level: 'remember', tag: 'Identify', text: 'Set the <strong>Tonicity</strong> to Hypotonic. What happens to the Cell Volume readout?' },
      { level: 'understand', tag: 'Explain', text: 'Increase <strong>Solute Concentration</strong> to 100 mM. Why does the Cell Volume drop sharply (Hypertonic)?' },
      { level: 'apply', tag: 'Simulate', text: 'Simulate the **Egg in Pure Water** experiment by setting Conc. to 0 mM and Tonicity to Hypotonic.' },
      { level: 'analyze', tag: 'Connect', text: 'Why is it dangerous for a paramedic to inject pure water (0 mM) into a patient\'s bloodstream?' },
      { level: 'create', tag: 'Design', text: 'Find the <strong>Isotonic Concentration</strong> where water transport (Rate) is minimized but not zero.' }
    ],
    3: [ // Scene 3: Organelles & Internal Organisation
      { level: 'remember', tag: 'Define', text: 'Select <strong>Mitochondria</strong>. What is the molecule shown moving in the Micro View?' },
      { level: 'understand', tag: 'Observe', text: 'Select <strong>ER/Golgi</strong>. Trace the path of the particle from ER to the cell exterior.' },
      { level: 'apply', tag: 'Predict', text: 'If the **Mitochondria** failed (ATP production stops), what would happen to the transport rate of the cell?' },
      { level: 'analyze', tag: 'Deduce', text: 'Why are **Lysosomes** essential for cell maintenance and recycling, even though they contain digestive enzymes?' },
      { level: 'evaluate', tag: 'Judge', text: 'In which organelle would a plant cell store large amounts of water and waste?' }
    ],
    4: [ // Scene 4: Prokaryote vs Eukaryote
      { level: 'remember', tag: 'Recall', text: 'Toggle <strong>Membrane Organelles</strong>. Which cell type is affected?' },
      { level: 'understand', tag: 'Relate', text: 'How does the difference in <strong>Size</strong> (slider) affect the relative surface area to volume ratio?' },
      { level: 'apply', tag: 'Solve', text: 'Use the <strong>Complexity</strong> toggle to explain why Eukaryotes can perform specialized functions like multicellularity.' },
      { level: 'analyze', tag: 'Compare', text: 'Compare the function of the Eukaryote <strong>Nucleus</strong> to the Prokaryote <strong>Nucleoid</strong>.' },
      { level: 'create', tag: 'Propose', text: 'If a Prokaryote suddenly evolved a mitochondria-like structure, what advantage would it gain?' }
    ],
    5: [ // Scene 5: Cell Division: Mitosis & Meiosis
      { level: 'remember', tag: 'Check', text: 'Select <strong>Mitosis: Metaphase</strong>. Describe the arrangement of chromosomes.' },
      { level: 'understand', tag: 'Clarify', text: 'Why does <strong>Meiosis</strong> need two sequential divisions (Reduction Division)?' },
      { level: 'analyze', tag: 'Contrast', text: 'When comparing <strong>Mitosis: Anaphase</strong> and **Meiosis: Anaphase I**, what fundamental difference in chromosome movement is observed?' },
      { level: 'evaluate', tag: 'Debunk', text: 'A student says "Meiosis produces two identical cells." Use the stages to explain why they are wrong.' },
      { level: 'create', tag: 'Model', text: 'Adjust the <strong>Speed</strong> to observe crossing over (Recombination) in Prophase I.' }
    ]
  };
  
  const SCENES = {
    1: { 
      name: "Discovery & Microscopy", 
      controls: ['magnification', 'stainType'], 
      svg: (stain, cell) => `
        <svg class="sim-svg" viewBox="0 0 100 100" style="width:90%; height:90%;">
          <rect x="5" y="5" width="90" height="90" fill="#f0f0f0" stroke="#ccc" stroke-width="1"/>
          ${cell === 'onion' ? 
            // Onion Cell (Plant Cell: Wall + Rectangular)
            `<rect x="10" y="10" width="80" height="30" rx="3" ry="3" class="onion-cell cell-boundary" fill="${stain.wallFill}" stroke-width="2"/>
             <rect x="12" y="12" width="76" height="26" fill="${stain.cytoFill}"/>
             <circle cx="20" cy="25" r="5" class="cell-nucleus" fill="${stain.nucFill}"/>
             <text x="50" y="95" text-anchor="middle" font-size="6" fill="#555">Onion Peel: ${stain.name}</text>`
            : 
            // Cheek Cell (Animal Cell: No Wall + Irregular)
            `<circle cx="50" cy="50" r="35" class="cheek-cell cell-boundary" fill="${stain.cytoFill}" stroke-width="1"/>
             <circle cx="50" cy="50" r="10" class="cell-nucleus" fill="${stain.nucFill}"/>
             <text x="50" y="95" text-anchor="middle" font-size="6" fill="#555">Cheek Cell: ${stain.name}</text>`
          }
        </svg>
      `, 
      initial: { selector: 'onion', stainType: 'none' } 
    },
    2: { 
      name: "Plasma Membrane, Diffusion & Osmosis", 
      controls: ['soluteConc', 'tonicity'], 
      svg: (state) => {
        const r = 30 + (state.volume * 10); // Volume factor changes radius
        const fill = state.volume > 1.05 ? '#f44336' : (state.volume < 0.95 ? '#2196F3' : '#4CAF50'); // Color based on volume change
        return `
          <svg class="sim-svg" viewBox="0 0 100 100" style="width:90%; height:90%;">
            <rect x="5" y="5" width="90" height="90" fill="#e3f2fd" stroke="#90caf9" stroke-width="2"/>
            <circle cx="50" cy="50" r="${r}" class="cheek-cell cell-boundary" fill="#fff3e0" stroke="${fill}" stroke-width="3" style="transition: r 0.5s ease;"/>
            <text x="50" y="95" text-anchor="middle" font-size="6" fill="#555">External Tonicity: ${state.tonicity}</text>
          </svg>
        `
      }, 
      initial: { selector: 'hypotonic', soluteConc: 10 } 
    },
    3: { 
      name: "Organelles & Internal Organisation", 
      controls: ['organelleSelect'], 
      svg: (selected) => `
        <svg class="sim-svg" viewBox="0 0 100 100" style="width:90%; height:90%;">
          <circle cx="50" cy="50" r="45" class="cell-boundary" fill="none" stroke-width="2"/>
          <rect x="5" y="5" width="90" height="90" fill="var(--color-cytoplasm)" rx="45" ry="45"/>
          <circle cx="50" cy="50" r="15" class="cell-nucleus ${selected === 'nucleus' ? 'organelle-highlight' : ''}" id="nucleus"/>
                    <ellipse cx="25" cy="75" rx="10" ry="6" fill="#f44336" class="organelle ${selected === 'mitochondria' ? 'organelle-highlight' : ''}" id="mitochondria"/>
                    <rect x="70" y="20" width="15" height="15" rx="2" fill="#9c27b0" class="organelle ${selected === 'er' ? 'organelle-highlight' : ''}" id="er"/>
          <rect x="75" y="40" width="10" height="10" rx="1" fill="#FFC107" class="organelle ${selected === 'golgi' ? 'organelle-highlight' : ''}" id="golgi"/>
                    <circle cx="30" cy="20" r="4" fill="#607d8b" class="organelle ${selected === 'lysosome' ? 'organelle-highlight' : ''}" id="lysosome"/>
          <text x="50" y="95" text-anchor="middle" font-size="6" fill="#555">Organelle: ${selected}</text>
        </svg>
      `, 
      initial: { selector: 'mitochondria' } 
    },
    4: { 
      name: "Prokaryote vs Eukaryote", 
      controls: ['comparisonToggle'], 
      svg: (state) => `
        <svg class="sim-svg" viewBox="0 0 100 100" style="width:90%; height:90%;">
                    <rect x="10" y="30" width="35" height="40" fill="#ffcc80" stroke="#ff9800" stroke-width="2"/>
          <circle cx="27.5" cy="50" r="8" fill="#e57373"/>
          <text x="27.5" y="80" text-anchor="middle" font-size="6" fill="#555">Prokaryote</text>
                    <circle cx="70" cy="50" r="30" fill="#c8e6c9" stroke="#4caf50" stroke-width="2"/>
          <circle cx="70" cy="50" r="10" fill="#e53935"/>
          ${state.toggle !== 'organelles' ? `
            <circle cx="55" cy="35" r="3" fill="#9c27b0"/>
            <ellipse cx="80" cy="70" rx="6" ry="4" fill="#f44336"/>
          ` : ''}
          <text x="70" y="80" text-anchor="middle" font-size="6" fill="#555">Eukaryote</text>
        </svg>
      `, 
      initial: { selector: 'size' } 
    },
    5: { 
      name: "Cell Division: Mitosis & Meiosis", 
      controls: ['stageSelect'], 
      svg: (stage) => {
        // Simplified Chromosome Visuals for each stage
        let elements = '';
        if (stage === 'mitosis-prophase' || stage === 'meiosis-prophase1') elements = `<line x1="30" y1="30" x2="70" y2="70" stroke="#00bcd4" stroke-width="3" /><line x1="70" y1="30" x2="30" y2="70" stroke="#00bcd4" stroke-width="3" />`;
        if (stage === 'mitosis-metaphase' || stage === 'meiosis-metaphase1') elements = `<rect x="30" y="45" width="40" height="10" fill="#00bcd4"/>`;
        if (stage === 'mitosis-anaphase') elements = `<circle cx="40" cy="40" r="5" fill="#f44336"/><circle cx="60" cy="60" r="5" fill="#f44336"/>`;
        if (stage === 'meiosis-anaphase1') elements = `<circle cx="30" cy="30" r="8" fill="#e53935"/><circle cx="70" cy="70" r="8" fill="#e53935"/>`;
        if (stage === 'mitosis-telophase') elements = `<rect x="25" y="20" width="50" height="10" fill="#4caf50"/><rect x="25" y="70" width="50" height="10" fill="#4caf50"/>`;

        return `
          <svg class="sim-svg" viewBox="0 0 100 100" style="width:90%; height:90%;">
            <rect x="5" y="5" width="90" height="90" fill="#f0f0f0" rx="10" ry="10" stroke="#ccc" stroke-width="1"/>
            <g id="division-stage">${elements}</g>
            <text x="50" y="95" text-anchor="middle" font-size="6" fill="#555">Stage: ${stage}</text>
        </svg>
      `
      }, 
      initial: { selector: 'mitosis-metaphase' } 
    }
  };

  const state = { 
    scene: 1, 
    mag: 100, 
    conc: 10, 
    speed: 1.0, 
    selector: 'onion', // For Scene 1, 2, 3, 4
    stainType: 'none', // Scene 1 specific
    tonicity: 'hypotonic', // Scene 2 specific
    organelle: 'mitochondria', // Scene 3 specific
    divisionStage: 'mitosis-metaphase', // Scene 5 specific
    running: false, 
    transportRate: 0, 
    cellVolume: 1.0 
  };
  
  let animFrame; 
  let lastParticleTime = 0;
  const microDots = [];
  
  const els = {
    stage: document.getElementById('scene-stage'), particles: document.getElementById('particle-layer'), transportLayer: document.getElementById('transport-layer'), stainLayer: document.getElementById('stain-layer'), tabContent: document.getElementById('tab-content'), readoutVal: document.getElementById('readout-val'), readoutLiquid: document.getElementById('readout-liquid'), focusBadge: document.getElementById('focus-badge'),
    scopeLens: document.getElementById('scope-lens'), guideContent: document.getElementById('guide-content'),
    inpMag: document.getElementById('inp-mag'), valMag: document.getElementById('val-mag'), inpConc: document.getElementById('inp-conc'), valConc: document.getElementById('val-conc'), inpSpeed: document.getElementById('inp-speed'), valSpeed: document.getElementById('val-speed'), inpSelector: document.getElementById('inp-selector'),
    outRate: document.getElementById('out-rate'), outVolume: document.getElementById('out-volume'),
    btnRun: document.getElementById('btn-run'), btnPause: document.getElementById('btn-pause'), btnReset: document.getElementById('btn-reset'),
    controlGrid: document.querySelector('.control-grid')
  };

  function updateControls() {
    els.controlGrid.innerHTML = '';
    let controls = [];
    let selectorOptions = [];
    let currentSelectorValue = '';

    switch (state.scene) {
      case 1:
        controls = [{id: 'inp-mag', label: 'Magnification', unit: 'x', min: 10, max: 400, step: 10, val: state.mag, cls: 'lbl-mag'}, 
                  {id: 'inp-speed', label: 'Animation Speed', unit: 'x', min: 0.1, max: 2.0, step: 0.1, val: state.speed, cls: 'lbl-speed'}];
        selectorOptions = [{val: 'onion', text: 'Onion Peel'}, {val: 'cheek', text: 'Cheek Cell'}, {val: 'iodine', text: 'Iodine Stain'}, {val: 'methylene', text: 'Methylene Blue'}];
        currentSelectorValue = state.selector;
        break;
      case 2:
        controls = [{id: 'inp-conc', label: 'Solute Conc.', unit: 'mM', min: 0, max: 100, step: 5, val: state.conc, cls: 'lbl-conc'}, 
                  {id: 'inp-speed', label: 'Animation Speed', unit: 'x', min: 0.1, max: 2.0, step: 0.1, val: state.speed, cls: 'lbl-speed'}];
        selectorOptions = [{val: 'hypotonic', text: 'Hypotonic (Swell)'}, {val: 'isotonic', text: 'Isotonic (Normal)'}, {val: 'hypertonic', text: 'Hypertonic (Shrink)'}];
        currentSelectorValue = state.tonicity;
        break;
      case 3:
        controls = [{id: 'inp-speed', label: 'Animation Speed', unit: 'x', min: 0.1, max: 2.0, step: 0.1, val: state.speed, cls: 'lbl-speed'}];
        selectorOptions = [{val: 'nucleus', text: 'Nucleus'}, {val: 'mitochondria', text: 'Mitochondria'}, {val: 'er', text: 'ER'}, {val: 'golgi', text: 'Golgi'}, {val: 'lysosome', text: 'Lysosome'}];
        currentSelectorValue = state.organelle;
        break;
      case 4:
        controls = [{id: 'inp-mag', label: 'Size Difference', unit: 'x', min: 1, max: 10, step: 1, val: state.mag/100, cls: 'lbl-mag'}]; // Repurpose Mag slider
        selectorOptions = [{val: 'size', text: 'Toggle Size'}, {val: 'organelles', text: 'Toggle Organelles'}, {val: 'complexity', text: 'Toggle Complexity'}];
        currentSelectorValue = state.selector;
        break;
      case 5:
        controls = [{id: 'inp-speed', label: 'Animation Speed', unit: 'x', min: 0.1, max: 2.0, step: 0.1, val: state.speed, cls: 'lbl-speed'}];
        selectorOptions = [{val: 'mitosis-prophase', text: 'Mitosis: Prophase'}, {val: 'mitosis-metaphase', text: 'Mitosis: Metaphase'}, {val: 'mitosis-anaphase', text: 'Mitosis: Anaphase'}, {val: 'meiosis-prophase1', text: 'Meiosis: Prophase I'}, {val: 'meiosis-anaphase1', text: 'Meiosis: Anaphase I'}, {val: 'meiosis-gametes', text: 'Meiosis: Four Gametes'}];
        currentSelectorValue = state.divisionStage;
        break;
    }

    // Render Sliders
    controls.forEach(c => {
      const group = document.createElement('div'); group.className = 'control-group';
      group.innerHTML = `
        <label class="${c.cls}">${c.label} (<span id="val-${c.id.slice(4)}">${c.val}</span>${c.unit})</label>
        <input type="range" id="${c.id}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${c.val}" class="slider-${c.id.slice(4)}">
      `;
      els.controlGrid.appendChild(group);
    });

    // Render Selector
    const selectorGroup = document.createElement('div'); selectorGroup.className = 'control-group full-width';
    const selectorHTML = `
      <label class="lbl-stain">Visual Selector</label>
      <select id="inp-selector">
        ${selectorOptions.map(opt => `<option value="${opt.val}" ${opt.val === currentSelectorValue ? 'selected' : ''}>${opt.text}</option>`).join('')}
      </select>
    `;
    selectorGroup.innerHTML = selectorHTML;
    els.controlGrid.appendChild(selectorGroup);

    // Re-attach event listeners for dynamic controls
    attachControlListeners();
    updateReadoutLabels();
  }

  function attachControlListeners() {
    // Listeners for sliders
    ['inp-mag', 'inp-conc', 'inp-speed'].forEach(id => { 
      const el = document.getElementById(id);
      if (el) {
        el.oninput = (e) => {
          const prop = id.replace('inp-',''); 
          state[prop] = parseFloat(e.target.value); 
          updateVisuals(); 
          triggerPulse(); 
        };
      }
    });

    // Listener for selector (re-map state based on scene)
    const sel = document.getElementById('inp-selector');
    if (sel) {
      sel.onchange = (e) => {
        const val = e.target.value;
        switch (state.scene) {
          case 1: state.selector = (val === 'onion' || val === 'cheek') ? val : state.selector; state.stainType = (val === 'iodine' || val === 'methylene') ? val : 'none'; break;
          case 2: state.tonicity = val; break;
          case 3: state.organelle = val; break;
          case 4: state.selector = val; break;
          case 5: state.divisionStage = val; break;
        }
        updateVisuals();
      };
    }
  }

  function updateReadoutLabels() {
    document.getElementById('val-mag') && (document.getElementById('val-mag').innerText = state.mag.toFixed(0));
    document.getElementById('val-conc') && (document.getElementById('val-conc').innerText = state.conc.toFixed(0));
    document.getElementById('val-speed') && (document.getElementById('val-speed').innerText = state.speed.toFixed(1));
  }

  function getStainData(stainType, cellType) {
    const affinity = CONFIG.stainAffinity[stainType] || 0;
    let nucColor = CONFIG.cellColors.nucleus;
    let cytoColor = CONFIG.cellColors.cytoplasm;
    let wallColor = CONFIG.cellColors.wall;

    if (stainType === 'iodine') {
      nucColor = `rgba(150, 75, 0, ${affinity})`; // Brownish for iodine/starch
      wallColor = cellType === 'onion' ? `rgba(150, 75, 0, ${affinity / 2 + 0.5})` : wallColor; // Wall stains less than nucleus but more than cytoplasm
    } else if (stainType === 'methylene') {
      nucColor = `rgba(0, 0, 200, ${affinity})`; // Blue for methylene blue
    }

    return { nucFill: nucColor, cytoFill: cytoColor, wallFill: wallColor, name: stainType };
  }

  function calculatePhysics() {
    state.transportRate = 0; state.cellVolume = 1.0;

    if (state.scene === 2) {
      // Osmosis Model: Rate proportional to concentration difference (C_ext - C_cell)
      const C_cell = 25; // Assume cell internal concentration is 25 mM
      const C_ext = state.conc;
      const T_factor = state.tonicity === 'hypotonic' ? -1 : (state.tonicity === 'hypertonic' ? 1 : 0);
      const T_offset = T_factor * 10; // Extra push from tonicity selector

      const diff = (C_ext - C_cell) * 0.05 + T_offset * 0.1;
      state.transportRate = -diff; // Positive rate means water is moving OUT (shrink)

      // Simple Volume change model (integral-like)
      state.cellVolume = Math.max(0.6, Math.min(1.4, 1.0 - state.transportRate * 0.5));
      state.transportRate = Math.abs(state.transportRate) * state.speed;
    } else if (state.scene === 3 && state.organelle === 'mitochondria') {
      state.transportRate = 0.8 * state.speed; // ATP production rate
    }
  }

  function updateVisuals() {
    calculatePhysics();
    els.outRate.innerText = state.transportRate.toFixed(2); 
    els.outVolume.innerText = state.cellVolume.toFixed(2);

    // Update controls/labels
    updateReadoutLabels();
    updateTabs();
    updateMicroDots();
    updateWidget();
    
    // Re-render scene stage for dynamic changes (like radius in Scene 2)
    let svgContent = '';
    if (state.scene === 1) {
      svgContent = SCENES[1].svg(getStainData(state.stainType, state.selector), state.selector);
    } else if (state.scene === 2) {
      svgContent = SCENES[2].svg(state);
    } else if (state.scene === 3) {
      svgContent = SCENES[3].svg(state.organelle);
    } else if (state.scene === 4) {
      svgContent = SCENES[4].svg(state);
    } else if (state.scene === 5) {
      svgContent = SCENES[5].svg(state.divisionStage);
    }
    els.stage.innerHTML = svgContent;
    
    els.focusBadge.hidden = !(state.transportRate > 0.5);
  }

  function updateWidget() {
    let displayValue = 0;
    if (state.scene === 2) {
      displayValue = state.cellVolume * 100;
      els.readoutVal.innerText = displayValue.toFixed(0);
      els.readoutLiquid.style.height = `${Math.min(100, displayValue)}%`;
      document.querySelector('.reading-widget .readout-label').innerHTML = `Cell Volume: <span id="readout-val">${state.cellVolume.toFixed(2)}</span>x`;
    } else {
      // Default to a simple speed/activity display
      displayValue = state.speed * 50;
      els.readoutVal.innerText = (state.speed * 10).toFixed(0);
      els.readoutLiquid.style.height = `${displayValue}%`;
      document.querySelector('.reading-widget .readout-label').innerHTML = `Activity: <span id="readout-val">${(state.speed * 10).toFixed(0)}</span>%`;
    }
  }

  function initMicroDots() {
    els.scopeLens.innerHTML = ''; microDots.length = 0;
    for(let i=0; i<15; i++) {
        const d = document.createElement('div'); d.className = 'micro-dot';
        d.style.left = (Math.random() * 50 + 10) + 'px'; d.style.top = (Math.random() * 50 + 10) + 'px';
        els.scopeLens.appendChild(d); microDots.push({ el: d, x: Math.random()*50, y: Math.random()*50, type: i % 2 === 0 ? 'water' : 'solute' });
    }
  }

  function updateMicroDots() {
    const generalSpeed = state.speed * 1.5;
    microDots.forEach(dot => {
        dot.x += (Math.random() - 0.5) * generalSpeed; dot.y += (Math.random() - 0.5) * generalSpeed;
        if(dot.x < 5) dot.x = 60; if(dot.x > 60) dot.x = 5; 
        if(dot.y < 5) dot.y = 60; if(dot.y > 60) dot.y = 5;
        
        dot.el.className = `micro-dot ${dot.type}`;

        if (state.scene === 1 && state.stainType !== 'none') {
          dot.el.className = `micro-dot solute ${Math.random() > (1 - CONFIG.stainAffinity[state.stainType]) ? 'stain-bind' : ''}`;
        } else if (state.scene === 3) {
          if (state.organelle === 'mitochondria') dot.el.className = `micro-dot atp`;
          if (state.organelle === 'er' || state.organelle === 'golgi') dot.el.className = `micro-dot protein`;
          if (state.organelle === 'lysosome') dot.el.className = `micro-dot solute`; // Waste
        }
        dot.el.style.transform = `translate(${dot.x}px, ${dot.y}px)`;
    });
  }

  function renderScene() {
    els.particles.innerHTML = '';
    els.transportLayer.innerHTML = '';
    els.stainLayer.style.background = 'none';

    // Reset state for the new scene
    state.running = false; els.btnRun.disabled = false; els.btnPause.disabled = true;
    if (SCENES[state.scene].initial) {
      if (SCENES[state.scene].initial.selector) state.selector = SCENES[state.scene].initial.selector;
      if (SCENES[state.scene].initial.stainType) state.stainType = SCENES[state.scene].initial.stainType;
      if (SCENES[state.scene].initial.soluteConc) state.conc = SCENES[state.scene].initial.soluteConc;
      if (SCENES[state.scene].initial.tonicity) state.tonicity = SCENES[state.scene].initial.tonicity;
      if (SCENES[state.scene].initial.organelle) state.organelle = SCENES[state.scene].initial.organelle;
    }
    updateControls();
    updateVisuals();
    
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
  }

  function triggerPulse() {
    const readouts = document.querySelectorAll('.pulse-target');
    readouts.forEach(r => { r.classList.remove('pulse-anim'); void r.offsetWidth; r.classList.add('pulse-anim'); });
  }

  function animLoop(timestamp) {
    if (!state.running) return;
    
    if (state.scene === 2) {
      const interval = 1000 / (state.transportRate * 5); // Faster rate means shorter interval
      if (timestamp - lastParticleTime > interval) { 
        spawnOsmosisParticle(); 
        lastParticleTime = timestamp; 
      }
    } else if (state.scene === 3 && (state.organelle === 'mitochondria' || state.organelle === 'er')) {
      const interval = 1000 / (state.transportRate * 5);
      if (timestamp - lastParticleTime > interval) { 
        spawnOrganelleParticle(); 
        lastParticleTime = timestamp; 
      }
    }
    
    updateMicroDots();
    animFrame = requestAnimationFrame(animLoop);
  }

  function spawnOsmosisParticle() {
    const p = document.createElement('div'); p.className = 'particle water'; 
    const targetR = 30 + (state.cellVolume * 10);
    let startX, startY, endX, endY;
    
    const rate = state.transportRate;

    if (rate < 0) { // Water moving IN (Hypotonic)
      startX = Math.random() * 100; startY = Math.random() * 100; // Outside the cell
      endX = 50; endY = 50; // Center of cell
    } else if (rate > 0) { // Water moving OUT (Hypertonic)
      startX = 50; startY = 50; // Center of cell
      endX = Math.random() * 100; endY = Math.random() * 100; // Outside cell
    } else { return; }

    p.style.left = `${startX}%`; p.style.top = `${startY}%`;
    p.style.setProperty('--dx', `${endX - startX}px`);
    p.style.setProperty('--dy', `${endY - startY}px`);
    p.style.animationDuration = `${1.5 / state.speed}s`;
    
    els.particles.appendChild(p); setTimeout(() => p.remove(), 2000 / state.speed);
  }

  function spawnOrganelleParticle() {
    const p = document.createElement('div'); 
    let startX, startY, endX, endY, type;
    const rate = state.transportRate;

    if (state.organelle === 'mitochondria') {
      // ATP production (Mitochondria)
      type = 'solute'; p.style.background = 'radial-gradient(circle, #E91E63, transparent)';
      startX = 25; startY = 75; // Mitochondria center
      endX = 50; endY = 50; // Cytoplasm
    } else if (state.organelle === 'er') {
      // Protein transport (ER to Golgi)
      type = 'solute'; p.style.background = 'radial-gradient(circle, #FFC107, transparent)';
      startX = 70; startY = 20; // ER
      endX = 75; endY = 40; // Golgi
    } else { return; }

    p.style.left = `${startX}%`; p.style.top = `${startY}%`;
    p.style.setProperty('--dx', `${endX - startX}px`);
    p.style.setProperty('--dy', `${endY - startY}px`);
    p.style.animationDuration = `${2 / state.speed}s`;
    p.style.animationName = 'moveSolute';

    els.particles.appendChild(p); setTimeout(() => p.remove(), 2500 / state.speed);
  }


  function updateTabs() {
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    let content = "";
    const S = SCENES[state.scene].name.split(': ')[1] || SCENES[state.scene].name;

    switch(activeTab) {
      case 'visual': 
        const visualContent = {
          1: `<h4>Microscopy Staining</h4><p>Stains like <strong>Iodine</strong> bind strongly to starch/cellulose (plant cell wall/starch granules) and the nucleus, providing contrast.</p>`,
          2: `<h4>Osmosis Diagrams</h4><p>Shows cell volume change (e.g., egg swelling/shrinking) based on external tonicity. ${state.tonicity} causes a net flow of water ${state.cellVolume > 1.0 ? 'IN' : (state.cellVolume < 1.0 ? 'OUT' : 'balanced')}.</p>`,
          3: `<h4>Organelle Functions</h4><p>Highlighting <strong>${state.organelle}</strong>. Micro-view shows its key process (e.g., ATP production in Mitochondria, Protein modification in Golgi).</p>`,
          4: `<h4>Prokaryote vs Eukaryote Table</h4><p>Compares organization: Prokaryotes lack a <strong>true nucleus</strong> and membrane-bound organelles. Eukaryotes are typically 10-100x larger.</p>`,
          5: `<h4>Cell Division Stages: ${S}</h4><p>Sequential frames illustrate <strong>chromosome movement</strong>. Mitosis for growth (2 identical cells), Meiosis for reproduction (4 unique gametes).</p>`,
        };
        content = visualContent[state.scene];
        break;
      case 'analogy': 
        const analogyContent = {
          1: `<h4>Microscope Analogy</h4><p>The microscope acts like magnifying tiny print. Different <strong>stains</strong> are like color-coding the text to find specific paragraphs (organelles).</p>`,
          2: `<h4>Osmosis Analogy</h4><p>Water movement is like people moving toward the <strong>less crowded exit</strong> (higher water concentration) across a selective turnstile (membrane).</p>`,
          3: `<h4>Organelles = City Factories</h4><p><strong>Nucleus</strong> = City Hall (DNA instructions), <strong>ER/Golgi</strong> = Manufacturing/Shipping Dept., <strong>Mitochondria</strong> = Power Plant, <strong>Lysosome</strong> = Waste Disposal.</p>`,
          4: `<h4>Prokaryote vs Eukaryote Analogy</h4><p><strong>Prokaryote</strong> = Single-room workshop, all tools mixed. <strong>Eukaryote</strong> = Multi-department factory, tasks are compartmentalized.</p>`,
          5: `<h4>Division Analogy</h4><p><strong>Mitosis</strong> = Photocopy (2 identical, full sets of instructions). <strong>Meiosis</strong> = Four pamphlets with half instructions (gametes).</p>`,
        };
        content = analogyContent[state.scene];
        break;
      case 'cause': 
        const causeContent = {
          1: `<h4>Causation: Staining Affinity</h4><p>Stains work because of **chemical affinity**. E.g., Basic dyes like Methylene Blue are attracted to acidic parts of the cell (DNA in the nucleus).</p>`,
          2: `<h4>Causation: Gradients</h4><p>The net movement of water (Osmosis) is caused by a **water potential gradient** across the selectively permeable membrane, aiming for equilibrium.</p>`,
          3: `<h4>Causation: Compartmentalisation</h4><p>Organelles enable **compartmentalisation**, allowing incompatible or complex reactions (like digestion in lysosomes or respiration in mitochondria) to occur safely and efficiently.</p>`,
          4: `<h4>Causation: Evolution of Organelles</h4><p>Prokaryotes lack internal membranes because they evolved simpler, smaller structures. Eukaryotes evolved complex compartmentalization (likely via **endosymbiosis**) to manage larger volumes.</p>`,
          5: `<h4>Causation: Chromosomal Behavior</h4><p>Chromosome movement is driven by **spindle fibers**. Mitosis separates sister chromatids; Meiosis separates homologous pairs first, then sister chromatids.</p>`,
        };
        content = causeContent[state.scene];
        break;
      case 'model': 
        const modelContent = {
          1: `<h4>Selective Permeability Model</h4><p>The <strong>plasma membrane</strong> is a phospholipid bilayer with embedded proteins that regulates the passage of substances, acting as a **selectively permeable barrier**.</p>`,
          2: `<h4>Osmosis Gradient Model</h4><div class="equation-row">Net Water Flow $\propto$ $\Psi_{\text{external}} - \Psi_{\text{cell}}$</div><p>Water potential ($\Psi$) drives osmosis. $\Psi_{\text{external}} < \Psi_{\text{cell}}$ (hypertonic) causes water to leave.</p>`,
          3: `<h4>ER-Golgi Pathway Model</h4><p>Proteins are synthesized on the **ER**, modified and sorted in the **Golgi apparatus**, and packaged into vesicles for transport to the destination (e.g., lysosome or cell exterior).</p>`,
          4: `<h4>Prokaryote vs Eukaryote Organisation</h4><p><strong>Prokaryote:</strong> DNA in nucleoid, ribosomes, cytoplasm, cell membrane/wall. <strong>Eukaryote:</strong> True nucleus, extensive internal organelles (Mitochondria, ER, etc.).</p>`,
          5: `<h4>Mitosis vs Meiosis Chromosome Models</h4><p><strong>Mitosis:</strong> Chromosome number remains the same (2n $\to$ 2n). <strong>Meiosis:</strong> Chromosome number is halved (2n $\to$ 1n) over two divisions.</p>`,
        };
        content = modelContent[state.scene];
        break;
      case 'fix': 
        const fixContent = {
          1: `<h4>Misconception: Nucleus is a dot</h4><p>The nucleus is not just a dark dot; it is the **control center** containing DNA, bounded by a double membrane (nuclear envelope).</p>`,
          2: `<h4>Misconception: Osmosis = Solute Movement</h4><p>Osmosis is the net movement of **water**, not solute, across a selectively permeable membrane. Solute movement is **diffusion** (or active transport).</p>`,
          3: `<h4>Misconception: Plant Cells Burst</h4><p>Plant cells rarely burst in hypotonic solutions because the **rigid cell wall** prevents excessive swelling (turgor pressure), unlike animal cells.</p>`,
          4: `<h4>Misconception: Prokaryotes are "Simple"</h4><p>Prokaryotes are not "simple" organisms. They possess **complex metabolic pathways** and genetic mechanisms, and are highly adaptable.</p>`,
          5: `<h4>Misconception: Lysosomes are Harmful</h4><p>Lysosomes contain potent enzymes but are usually **membrane-bound**, protecting the cell. They are only harmful if the cell is damaged or ruptures (autolysis).</p>`,
        };
        content = fixContent[state.scene];
        break;
    }
    els.tabContent.innerHTML = content;
  }

  function init() {
    // Scene button listeners
    document.querySelectorAll('.scene-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target.closest('.scene-btn'); 
        document.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active')); 
        target.classList.add('active');
        state.scene = parseInt(target.dataset.scene); 
        renderScene();
      });
    });

    // Action button listeners
    els.btnRun.addEventListener('click', () => { 
      state.running = true; els.btnRun.disabled = true; els.btnPause.disabled = false; animLoop(); 
    });
    els.btnPause.addEventListener('click', () => { 
      state.running = false; els.btnRun.disabled = false; els.btnPause.disabled = true; 
    });
    els.btnReset.addEventListener('click', () => { 
      state.running = false; 
      state.mag = 100; state.conc = 10; state.speed = 1.0; state.cellVolume = 1.0; state.transportRate = 0;
      renderScene(); 
    });
    
    // Tab listeners
    document.querySelectorAll('.tab-btn').forEach(btn => { 
      btn.addEventListener('click', (e) => { 
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); 
        e.target.classList.add('active'); 
        updateTabs(); 
      }); 
    });
    
    initMicroDots(); 
    renderScene();
  }
  init();
})();
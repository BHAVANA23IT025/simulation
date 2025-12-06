// simulation.js
// Logic for Sublimation & Pressure Effect on States of Matter Simulation.

(function () {
  const root = document.querySelector('[data-sim-root]');
  if (!root) {
    console.error('❌ [simulation.js] data-sim-root not found. Simulation cannot start.');
    return;
  }

  const controlsContainer = root.querySelector('#sim-dynamic-controls');
  const sceneSelector = root.querySelector('#scene-selector');
  const sceneControls = root.querySelector('#scene-controls');
  const tabContent = root.querySelector('#sim-tab-content');
  const notesContainer = root.querySelector('#sim-notes-content');
  const particleModel = root.querySelector('#particle-model');
  const sceneTitle = root.querySelector('#scene-title');
  const visualizationStatus = root.querySelector('#visualization-status');
  
  // Simulation State
  let currentScene = 'camphor';
  let particleCount = 10; // For simple visualization
  let temperature = 50;   // In arbitrary units
  let pressure = 1.0;     // In arbitrary units (e.g., atm)

  // --- Utility Functions ---

  function renderParticleState(state) {
    let html = '';
    
    // Simple visual representation using emojis/text based on state
    if (state === 'SOLID') {
      html = '<div style="display: flex; gap: 4px; flex-wrap: wrap; justify-content: center;">';
      for (let i = 0; i < particleCount; i++) {
        html += '<span style="font-size: 1.2rem; margin: 2px;">🧱</span>'; // Fixed, organized particles
      }
      html += '</div>';
      visualizationStatus.innerHTML = '<p><strong>State:</strong> Solid. Particles are tightly packed in an orderly arrangement.</p>';
    } else if (state === 'GAS') {
      html = '<div style="position: absolute; width: 90%; height: 90%;">';
      for (let i = 0; i < particleCount; i++) {
        // Randomly scatter particles for gas
        const top = Math.random() * 80 + 5; 
        const left = Math.random() * 80 + 5;
        html += `<span style="position: absolute; top: ${top}%; left: ${left}%; font-size: 1.2rem;">💨</span>`; // Far apart, random movement
      }
      html += '</div>';
      visualizationStatus.innerHTML = '<p><strong>State:</strong> Gas. Particles are moving rapidly and are very far apart.</p>';
    } else if (state === 'LIQUID') {
      html = '<div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">';
      for (let i = 0; i < particleCount; i++) {
        html += '<span style="font-size: 1.2rem; margin: 4px;">💧</span>'; // Close, but disorganized and mobile
      }
      html += '</div>';
      visualizationStatus.innerHTML = '<p><strong>State:</strong> Liquid. Particles are close together but move randomly over each other.</p>';
    }

    particleModel.innerHTML = html;
  }

  function createSlider(id, label, min, max, step, initialValue, onChange) {
    const container = document.createElement('div');
    container.style.marginBottom = '10px';

    const labelElement = document.createElement('label');
    labelElement.className = 'sim-label';
    labelElement.setAttribute('for', id);
    labelElement.textContent = `${label} (${initialValue})`;

    const input = document.createElement('input');
    input.type = 'range';
    input.id = id;
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = initialValue;

    input.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      labelElement.textContent = `${label} (${value})`;
      onChange(value);
    });

    container.appendChild(labelElement);
    container.appendChild(input);
    return container;
  }

  // --- Scene Logic ---

  const scenes = {
    camphor: {
      title: 'Camphor Sublimation & Deposition (Solid ↔ Gas)',
      notes: `
        <p><strong>Observation/Experiment (Activity 1.13):</strong></p>
        <p>In this setup (China dish, inverted funnel, cotton plug), increasing the temperature **(T)** of solid camphor increases the particles' kinetic energy, allowing them to escape directly into the gas phase **(Sublimation)** without melting. The vapour then cools on the funnel walls and turns back into a solid **(Deposition)**.</p>
        <p><strong>Cause/Analogy:</strong> Sublimation is like solid perfume evaporating. The Camphor's high vapour pressure allows it to "skip" the liquid phase.</p>
        <p><strong>Challenge:</strong> Observe and record the state change as you increase the temperature.</p>
      `,
      render: () => {
        sceneControls.innerHTML = '';
        sceneControls.appendChild(createSlider('camphor-temp', 'Temperature (Heating)', 10, 100, 1, temperature, (val) => {
          temperature = val;
          if (temperature < 40) {
            renderParticleState('SOLID');
          } else if (temperature < 80) {
            renderParticleState('SOLID'); // Simulates mild sublimation
            visualizationStatus.innerHTML += '<p style="color: var(--color-primary); font-weight: 500;">Sublimation is occurring (Solid particles escaping into Gas).</p>';
          } else {
            renderParticleState('GAS'); // Simulates rapid sublimation
          }
        }));
        // Initial state
        if (temperature < 40) renderParticleState('SOLID'); else renderParticleState('GAS');
        
        // Add image of the setup
        tabContent.insertAdjacentHTML('afterbegin', '<div style="text-align: center; margin-bottom: 10px;"></div>');
      }
    },
    compression: {
      title: 'Gas Compression & Liquefaction (Gas → Liquid)',
      notes: `
        <p><strong>Model/Cause (Fig. 1.8):</strong></p>
        <p>Gases can be converted into liquids by either **lowering the temperature** or **increasing the pressure (P)**. Increasing pressure forces the gas particles closer together. If the temperature is low enough, the intermolecular forces become strong enough to hold the particles in the liquid state.</p>
        <p><strong>Analogy:</strong> This is like squeezing cotton until the fibres are packed tightly. In real life, gases like $\text{LPG}$ are stored this way.</p>
        <p><strong>Challenge:</strong> Find the minimum pressure required to turn the gas into a liquid at the current temperature.</p>
      `,
      render: () => {
        sceneControls.innerHTML = '';
        
        // Reset/Update Temperature
        sceneControls.appendChild(createSlider('comp-temp', 'Temperature (Cooling)', 10, 100, 1, 50, (val) => {
          temperature = val;
          renderCompressionState();
        }));
        
        // Reset/Update Pressure
        sceneControls.appendChild(createSlider('comp-pressure', 'Pressure (Atmospheres)', 1.0, 10.0, 0.5, pressure, (val) => {
          pressure = val;
          renderCompressionState();
        }));
        
        function renderCompressionState() {
          sceneControls.querySelector('#comp-pressure').previousElementSibling.textContent = `Pressure (Atmospheres) (${pressure.toFixed(1)})`;
          sceneControls.querySelector('#comp-temp').previousElementSibling.textContent = `Temperature (Cooling) (${temperature})`;

          // Simple P-T model for demonstration: liquefaction occurs if P/T > 0.1
          if (pressure / temperature > 0.15) {
            renderParticleState('LIQUID');
            visualizationStatus.innerHTML = '<p style="color: #0078ff; font-weight: 500;">Liquefaction achieved! High pressure and/or low temperature forced particles into the liquid state.</p>';
          } else {
            renderParticleState('GAS');
          }
        }
        
        renderCompressionState();
        // Add image of the concept
        tabContent.insertAdjacentHTML('afterbegin', '<div style="text-align: center; margin-bottom: 10px;"></div>');
      }
    },
    dryice: {
      title: 'Dry Ice Sublimation (P-T Control)',
      notes: `
        <p><strong>Fix Misconception/Analyze:</strong></p>
        <p>Dry ice is solid carbon dioxide ($\text{CO}_2$), not frozen water. At normal atmospheric pressure ($\mathbf{1}$ atm), the pressure is too low for $\text{CO}_2$ to exist as a liquid. Therefore, it undergoes **Sublimation** (Solid $\to$ Gas) directly, skipping the liquid phase entirely.</p>
        <p><strong>Particle Model:</strong> Observe how the solid particles transition directly to the widely-spaced gas state.</p>
        <p><strong>Challenge:</strong> To see liquid $\text{CO}_2$, you would need to increase the pressure to over $\mathbf{5.11}$ atm (the triple point pressure).</p>
      `,
      render: () => {
        sceneControls.innerHTML = '';
        sceneControls.appendChild(createSlider('dryice-pressure', 'Pressure (atm)', 0.5, 6.0, 0.1, pressure, (val) => {
          pressure = val;
          renderDryIceState();
        }));

        function renderDryIceState() {
          sceneControls.querySelector('#dryice-pressure').previousElementSibling.textContent = `Pressure (atm) (${pressure.toFixed(1)})`;

          if (pressure < 5.1) {
            renderParticleState('GAS');
            visualizationStatus.innerHTML = '<p style="color: #ff5252; font-weight: 500;">Sublimation (Solid $\to$ Gas). Pressure is below $5.11$ atm, liquid phase is skipped.</p>';
          } else {
            renderParticleState('LIQUID');
            visualizationStatus.innerHTML = '<p style="color: #0078ff; font-weight: 500;">Liquid $\text{CO}_2$ formed! Pressure is above $5.11$ atm.</p>';
          }
        }
        
        renderDryIceState();
        // Add image of the concept
        tabContent.insertAdjacentHTML('afterbegin', '<div style="text-align: center; margin-bottom: 10px;"></div>');
      }
    }
  };

  // --- Core Simulation Functions ---

  function loadScene(sceneKey) {
    if (scenes[sceneKey]) {
      currentScene = sceneKey;
      
      // Update scene buttons
      document.querySelectorAll('.sim-scene-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.scene === sceneKey) {
          btn.classList.add('active');
        }
      });

      // Clear previous visualization and controls/notes
      sceneTitle.textContent = scenes[sceneKey].title;
      notesContainer.innerHTML = scenes[sceneKey].notes;
      particleModel.innerHTML = '';
      tabContent.innerHTML = ''; // Clear main content including previous image

      // Render the new scene
      scenes[sceneKey].render();
      console.log(`✅ [simulation.js] Switched to scene: ${sceneKey}`);
    } else {
      console.error(`❌ Unknown scene key: ${sceneKey}`);
    }
  }

  function init() {
    // Add styling for active button
    const style = document.createElement('style');
    style.textContent = `
      .sim-scene-button.active {
        background: var(--color-secondary);
        box-shadow: 0 4px 10px rgba(0, 212, 255, 0.25);
      }
      .sim-scene-button {
        width: 100%;
        text-align: left;
      }
    `;
    document.head.appendChild(style);

    // Attach event listeners for scene switching
    document.querySelectorAll('.sim-scene-button').forEach(button => {
      button.addEventListener('click', (e) => {
        loadScene(e.target.dataset.scene);
      });
    });

    // Load the default scene
    loadScene(currentScene);
    console.log('✅ [simulation.js] Simulation initialized.');
  }

  init();
})();
const weather = document.getElementById("weather");
const humidity = document.getElementById("humidity");
const resultText = document.getElementById("resultText");
const humValue = document.getElementById("humValue");
const runSim = document.getElementById("runSim");
const btnRootNode = document.getElementById("btnRootNode");
const btnDecisionNode = document.getElementById("btnDecisionNode");
const btnLeafNo = document.getElementById("btnLeafNo");
const btnLeafYes = document.getElementById("btnLeafYes");
const treeExplanation = document.getElementById("treeExplanation");

function updateLabels() {
  humValue.textContent = humidity.value;
}

function setActiveButton(button) {
  document.querySelectorAll(".tree-node-btn").forEach((btn) => {
    btn.classList.toggle("active", btn === button);
  });
}

function setTreeExplanation(mode) {
  switch (mode) {
    case "root":
      treeExplanation.textContent =
        "Root Node (Akar): Titik awal pengambilan keputusan. Di sini kita memeriksa 'Cuaca Cerah?' sebagai kondisi pertama.";
      setActiveButton(btnRootNode);
      break;
    case "decision":
      treeExplanation.textContent =
        "Decision Node (Node Keputusan): Node yang berisi pertanyaan atau kondisi tertentu. Pada cabang ini ditanyakan 'Kelembapan Tinggi?'. Jika ya, hasilnya 'Tidak Main'. Jika tidak, hasilnya 'Main Tennis'.";
      setActiveButton(btnDecisionNode);
      break;
    case "leaf-no":
      treeExplanation.textContent =
        "Leaf Node (Node Daun): Titik akhir yang menghasilkan keputusan akhir. Dalam kasus ini, 'Tidak Main' adalah hasil akhir dari keputusannya.";
      setActiveButton(btnLeafNo);
      break;
    case "leaf-yes":
      treeExplanation.textContent =
        "Leaf Node (Node Daun): Titik akhir yang menghasilkan keputusan akhir. Di sini 'Main Tennis' adalah hasil akhir ketika kondisi cuaca mendukung.";
      setActiveButton(btnLeafYes);
      break;
    default:
      treeExplanation.textContent =
        "Klik tombol di atas untuk mempelajari struktur Decision Tree: root, decision node, dan leaf node.";
      setActiveButton(null);
  }
}

btnRootNode.addEventListener("click", () => setTreeExplanation("root"));
btnDecisionNode.addEventListener("click", () => setTreeExplanation("decision"));
btnLeafNo.addEventListener("click", () => setTreeExplanation("leaf-no"));
btnLeafYes.addEventListener("click", () => setTreeExplanation("leaf-yes"));

function evaluateDecisionTree() {
  const weatherValue = weather.value;
  const hum = Number(humidity.value);

  // Jika cuaca tidak cerah, boleh main tennis
  if (weatherValue === "tidak-cerah") {
    return {
      text: "Cuaca tidak cerah, tidak ada hambatan dari matahari. Silakan main tennis!",
      path: "main-tidakcerah",
    };
  }

  // Jika cuaca cerah, periksa kelembapan
  if (hum > 70) {
    return {
      text: "Kelembapan tinggi saat cuaca cerah. Sebaiknya tidak main tennis untuk menghindari kelelahan.",
      path: "tidak-main",
    };
  }

  // Cuaca cerah dan kelembapan rendah
  return {
    text: "Cuaca cerah dan kelembapan rendah. Kondisi ideal untuk bermain tennis!",
    path: "main",
  };
}

function generateSimulationTree(resultPath) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 600 340");
  svg.setAttribute("class", "sim-tree-svg");

  const activePath = "rgba(72, 218, 156, 0.95)";
  const inactivePath = "rgba(72, 218, 156, 0.15)";
  const activeNode = "rgba(72, 218, 156, 0.9)";
  const inactiveNode = "rgba(72, 218, 156, 0.25)";
  const activeStroke = "rgba(72, 218, 156, 0.95)";
  const inactiveStroke = "rgba(72, 218, 156, 0.3)";

  const isLeftPath = resultPath === "tidak-main" || resultPath === "main";
  const isRightPath = resultPath === "main-tidakcerah";

  svg.innerHTML = `
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Branches from root -->
    <path class="branch-line" d="M300 70 L180 160" stroke="${isLeftPath ? activePath : inactivePath}" stroke-width="3" fill="none" stroke-linecap="round" ${isLeftPath ? 'filter="url(#glow)" stroke-width="4"' : ""}/>
    <path class="branch-line" d="M300 70 L450 160" stroke="${isRightPath ? activePath : inactivePath}" stroke-width="3" fill="none" stroke-linecap="round" ${isRightPath ? 'filter="url(#glow)" stroke-width="4"' : ""}/>
    
    <!-- Branches from left node (Kelembapan?) -->
    <path class="branch-line" d="M180 160 L80 260" stroke="${resultPath === "tidak-main" ? activePath : inactivePath}" stroke-width="3" fill="none" stroke-linecap="round" ${resultPath === "tidak-main" ? 'filter="url(#glow)" stroke-width="4"' : ""}/>
    <path class="branch-line" d="M180 160 L280 260" stroke="${resultPath === "main" ? activePath : inactivePath}" stroke-width="3" fill="none" stroke-linecap="round" ${resultPath === "main" ? 'filter="url(#glow)" stroke-width="4"' : ""}/>

    <!-- Root Node: Cuaca Cerah? -->
    <circle cx="300" cy="70" r="32" fill="${activeNode}" stroke="${activeStroke}" stroke-width="2.5" filter="url(#glow)"/>
    <text x="300" y="74" text-anchor="middle" font-size="11" font-weight="bold" fill="#fff">Cuaca</text>
    <text x="300" y="86" text-anchor="middle" font-size="11" font-weight="bold" fill="#fff">Cerah?</text>

    <!-- Left Branch Node: Kelembapan Tinggi? -->
    <circle cx="180" cy="160" r="28" fill="${isLeftPath ? activeNode : inactiveNode}" stroke="${isLeftPath ? activeStroke : inactiveStroke}" stroke-width="2" ${isLeftPath ? 'filter="url(#glow)"' : ""}/>
    <text x="180" y="163" text-anchor="middle" font-size="9" fill="#edf8ee">Kelembapan</text>
    <text x="180" y="173" text-anchor="middle" font-size="9" fill="#edf8ee">Tinggi?</text>

    <!-- Right Leaf Node: Main Tennis (jika tidak cerah) -->
    <rect x="390" y="130" width="120" height="60" rx="12" fill="${resultPath === "main-tidakcerah" ? activeNode : inactiveNode}" stroke="${resultPath === "main-tidakcerah" ? activeStroke : inactiveStroke}" stroke-width="2" ${resultPath === "main-tidakcerah" ? 'filter="url(#glow)"' : ""}/>
    <text x="450" y="158" text-anchor="middle" font-size="10" font-weight="bold" fill="#edf8ee">Main</text>
    <text x="450" y="172" text-anchor="middle" font-size="10" font-weight="bold" fill="#edf8ee">Tennis</text>

    <!-- Left Leaf Node: Tidak Main (kelembapan tinggi) -->
    <rect x="20" y="260" width="120" height="60" rx="12" fill="${resultPath === "tidak-main" ? activeNode : inactiveNode}" stroke="${resultPath === "tidak-main" ? activeStroke : inactiveStroke}" stroke-width="2" ${resultPath === "tidak-main" ? 'filter="url(#glow)"' : ""}/>
    <text x="80" y="288" text-anchor="middle" font-size="10" font-weight="bold" fill="#edf8ee">Tidak</text>
    <text x="80" y="302" text-anchor="middle" font-size="10" font-weight="bold" fill="#edf8ee">Main</text>

    <!-- Right Leaf Node: Main Tennis (kelembapan rendah) -->
    <rect x="220" y="260" width="120" height="60" rx="12" fill="${resultPath === "main" ? activeNode : inactiveNode}" stroke="${resultPath === "main" ? activeStroke : inactiveStroke}" stroke-width="2" ${resultPath === "main" ? 'filter="url(#glow)"' : ""}/>
    <text x="280" y="288" text-anchor="middle" font-size="10" font-weight="bold" fill="#edf8ee">Main</text>
    <text x="280" y="302" text-anchor="middle" font-size="10" font-weight="bold" fill="#edf8ee">Tennis</text>
  `;

  return svg;
}

runSim.addEventListener("click", () => {
  const result = evaluateDecisionTree();
  resultText.textContent = result.text;

  const simTreeContainer = document.getElementById("simTreeContainer");
  simTreeContainer.innerHTML = "";
  const treeSvg = generateSimulationTree(result.path);
  simTreeContainer.appendChild(treeSvg);
});

humidity.addEventListener("input", updateLabels);

const revealSections = document.querySelectorAll(".content-section");
let lastScrollY = window.scrollY;
let scrollDirection = "down";

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  scrollDirection = currentScrollY > lastScrollY ? "down" : "up";
  lastScrollY = currentScrollY;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (scrollDirection === "up") {
          entry.target.classList.add("slide-in-up");
        } else {
          entry.target.classList.add("slide-in-right");
        }
        entry.target.classList.add("reveal-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  },
);

revealSections.forEach((section) => revealObserver.observe(section));

updateLabels();

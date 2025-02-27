let criteria = [];
let criteriaMatrix = [];
let criteriaWeights = [];

// Добавление критерия
function addCriterion() {
  const input = document.getElementById('criteria-input');
  const criterion = input.value.trim();
  if (criterion && !criteria.includes(criterion)) {
    criteria.push(criterion);
    input.value = '';
    renderCriteriaList();
    if (criteria.length > 1) {
      document.getElementById('criteria-comparison').style.display = 'block';
      initializeCriteriaMatrix();
    }
  }
}

// Отображение списка критериев
function renderCriteriaList() {
  const list = document.getElementById('criteria-list');
  list.innerHTML = criteria.map(criterion => `<li>${criterion}</li>`).join('');
}

// Инициализация матрицы сравнения критериев
function initializeCriteriaMatrix() {
  criteriaMatrix = new Array(criteria.length);
  for (let i = 0; i < criteria.length; i++) {
    criteriaMatrix[i] = new Array(criteria.length).fill(1);
  }
  renderCriteriaMatrix();
}

// Отображение матрицы сравнения критериев
function renderCriteriaMatrix() {
  const matrixDiv = document.getElementById('criteria-matrix');
  matrixDiv.innerHTML = '';

  for (let i = 0; i < criteria.length; i++) {
    for (let j = 0; j < criteria.length; j++) {
      if (i < j) {
        const row = document.createElement('div');
        row.innerHTML = `
          <label>${criteria[i]} vs ${criteria[j]}:</label>
          <input type="number" min="1" max="9" value="1" id="matrix-${i}-${j}">
        `;
        matrixDiv.appendChild(row);
      }
    }
  }
}

// Расчёт весов критериев
function calculateCriteriaWeights() {
  // Заполнение матрицы
  for (let i = 0; i < criteria.length; i++) {
    for (let j = 0; j < criteria.length; j++) {
      if (i < j) {
        const value = parseFloat(document.getElementById(`matrix-${i}-${j}`).value);
        criteriaMatrix[i][j] = value;
        criteriaMatrix[j][i] = 1 / value;
      } else if (i === j) {
        criteriaMatrix[i][j] = 1;
      }
    }
  }

  // Расчёт весов
  criteriaWeights = new Array(criteria.length).fill(0);
  for (let i = 0; i < criteria.length; i++) {
    let sum = 0;
    for (let j = 0; j < criteria.length; j++) {
      sum += criteriaMatrix[i][j];
    }
    criteriaWeights[i] = sum / criteria.length;
  }

  // Нормализация весов
  const totalWeight = criteriaWeights.reduce((acc, weight) => acc + weight, 0);
  criteriaWeights = criteriaWeights.map(weight => (weight / totalWeight).toFixed(2));

  // Отображение результатов
  renderResults();
}

// Отображение результатов
function renderResults() {
  const resultsDiv = document.getElementById('results');
  const weightsList = document.getElementById('criteria-weights');
  weightsList.innerHTML = criteria.map((criterion, index) => `
    <li>${criterion}: ${criteriaWeights[index]}</li>
  `).join('');
  resultsDiv.style.display = 'block';
}
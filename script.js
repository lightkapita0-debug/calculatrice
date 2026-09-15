// Récupère l'écran et toutes les touches de la calculatrice.
const display = document.querySelector('input');
const buttons = document.querySelectorAll('.btn');
const scientificButtons = document.querySelectorAll(
	'.bt-square-root, .bt-power, .bt-power2, .bt-exponation'
);

// Stocke l'expression saisie avant son calcul.
let expression = '';

// Affiche l'expression en cours ou le résultat à l'écran.
function updateDisplay(value = expression) {
	display.value = value;
}

// Transforme l'expression saisie et calcule son résultat.
function calculate() {
	// Adapte les symboles de l'interface à la syntaxe JavaScript.
	const normalizedExpression = expression
		.replace(/x²/g, '**2')
		.replace(/x³/g, '**3')
		.replace(/√\(([^()]*)\)/g, 'Math.sqrt($1)')
		.replace(/x/g, '*')
		.replace(/\^/g, '**')
		.replace(/%/g, '/100');

	if (!normalizedExpression) {
		return;
	}

	try {
		// Évalue uniquement l'expression construite par les touches autorisées.
		const result = Function(`"use strict"; return (${normalizedExpression})`)();
		expression = Number.isFinite(result) ? String(result) : '';
		updateDisplay(expression || 'Erreur');
	} catch {
		// Affiche une erreur si l'expression ne peut pas être calculée.
		expression = '';
		updateDisplay('Erreur');
	}
}

// Traite une action venant d'un bouton ou du clavier.
function handleInput(value) {
	if (value === 'C') {
		expression = '';
		updateDisplay();
		return;
	}

	if (value === 'DEL') {
		expression = expression.slice(0, -1);
		updateDisplay();
		return;
	}

	if (value === '=') {
		calculate();
		return;
	}

	if (value === '√') {
		if (expression) {
			expression = `√(${expression})`;
			updateDisplay();
		}
		return;
	}

	if (value === 'x²' || value === 'x³') {
		if (expression) {
			expression = `(${expression})${value}`;
			updateDisplay();
		}
		return;
	}

	if (value === '%') {
		expression += '%';
	} else if ('+-x/'.includes(value)) {
		// Remplace un opérateur final pour éviter deux opérateurs consécutifs.
		expression = expression.replace(/[+\-x/]$/, '') + value;
	} else {
		expression += value;
	}

	updateDisplay();
}

// Les clics sur les touches de la calculatrice utilisent le même traitement.
buttons.forEach((button) => {
	button.addEventListener('click', () => {
		handleInput(button.textContent.trim());
	});
});


// Permet d'utiliser les chiffres, les opérateurs et les commandes au clavier.
document.addEventListener('keydown', (event) => {
	// Convertit les touches du clavier en commandes de la calculatrice.
	const keyMap = {
		Enter: '=',
		' ': '=',
		Backspace: 'DEL',
		Delete: 'C',
		Escape: 'C',
		'*': 'x',
		',': '.',
	};
	const value = keyMap[event.key] || event.key;

	if (/^[0-9.+\-x/%/]$/.test(value) || ['=', 'DEL', 'C'].includes(value)) {
		event.preventDefault();
		handleInput(value);
	}
});

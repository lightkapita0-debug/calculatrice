// Sélectionne les boutons de mode : Standard et Scientifique
const modeButtons = document.querySelectorAll('.mode-btn');

// Sélectionne la zone qui contient les boutons scientifiques
const scientificSection = document.querySelector('.scientific');

// Fonction qui active le bon bouton et affiche/masque la partie scientifique
function setMode(mode) {
    modeButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.mode === mode);
    });

    if (scientificSection) {
        scientificSection.classList.toggle('visible', mode === 'scientifique');
    }
}

// Ajoute un clic sur chaque bouton de mode pour changer l'état
modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        setMode(button.dataset.mode);
    });
});
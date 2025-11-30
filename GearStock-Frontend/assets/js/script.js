document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('mode-toggle');
    const body = document.body;

    // 1. Função para salvar o estado no LocalStorage
    const setMode = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            modeToggle.querySelector('i').className = 'fas fa-sun'; // Ícone do Sol no modo escuro
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            modeToggle.querySelector('i').className = 'fas fa-moon'; // Ícone da Lua no modo claro
        }
    };

    // 2. Carrega o estado salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || !savedTheme) { // Modo escuro como padrão, se não houver preferência
        setMode(true);
    } else {
        setMode(false);
    }

    // 3. Listener do Botão
    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            const isDark = body.classList.contains('dark-mode');
            setMode(!isDark);
        });
    }
});
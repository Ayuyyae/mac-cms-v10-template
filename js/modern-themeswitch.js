document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.querySelector('#theme-switch');
    const body = document.body;
  
    if (!themeSwitch) {
      console.error('Theme switch element not found.');
      return;
    }
  
    const THEMES = {
      LIGHT: 'light-theme',
      DARK: 'dark-theme'
    };
  
    // Function to get the saved theme or fallback to default theme
    const getSavedTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme && Object.values(THEMES).includes(savedTheme) ? savedTheme : THEMES.DARK;
    };
  
    // Function to apply the specified theme
    const applyTheme = (theme) => {
      if (!Object.values(THEMES).includes(theme)) {
        console.error(`Invalid theme: ${theme}`);
        return;
      }
      
      body.classList.toggle(THEMES.LIGHT, theme === THEMES.LIGHT);
      body.classList.toggle(THEMES.DARK, theme === THEMES.DARK);
      themeSwitch.checked = (theme === THEMES.DARK);
      localStorage.setItem('theme', theme);
    };
  
    // Initialize the theme
    applyTheme(getSavedTheme());
  
    // Event listener for theme switch
    themeSwitch.addEventListener('change', () => {
      const newTheme = themeSwitch.checked ? THEMES.DARK : THEMES.LIGHT;
      applyTheme(newTheme);
    });
  });
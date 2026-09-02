export function ThemeScript() {
  const scriptSrc = `
    (function() {
      try {
        var savedTheme = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      } catch (e) {}
    })();
  `;

  return (
    <script
      id="theme-initializer"
      dangerouslySetInnerHTML={{ __html: scriptSrc }}
    />
  );
}

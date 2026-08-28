export function cssThemeVars(theme) {
  return {
    '--ink': theme.background,
    '--black': theme.surface,
    '--orange': theme.primary,
    '--flame-light': theme.accent,
    '--ember': theme.button,
    '--white': theme.text,
    '--smoke': `color-mix(in srgb, ${theme.text} 54%, ${theme.background} 46%)`,
  };
}

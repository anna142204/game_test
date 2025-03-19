// js/constants.js


export const COLORS_dark = {
  1: 0xff4444,  // Rouge
  2: 0x4488ff,  // Bleu
  3: 0x44ff44,  // Vert
  4: 0xffff44,  // Jaune
  5: 0xff44ff,  // Rose
  6: 0x44ffff,  // Cyan
  7: 0xff8888,  // Rose clair
  8: 0x8888ff,  // Bleu clair
  9: 0x88ff88,  // Vert clair
  10: 0xff88ff, // Violet clair
  11: 0xff5500, // Orange foncé
  12: 0x55ff00, // Vert lime
  13: 0x00ffaa, // Turquoise
  14: 0xaa00ff, // Violet profond
  15: 0xffaa00, // Orange
  16: 0xaa5500, // Marron clair
  17: 0x00aa55, // Vert émeraude
  18: 0x5500aa, // Bleu foncé
  19: 0xaa0000, // Rouge foncé
  20: 0x0000aa, // Bleu profond
  default: 0xaaaaaa // Gris neutre pour les valeurs non définies
};

export const COLORS_light = {
  1: 0xFFB3B3,  // Rouge pastel
  2: 0xB3D1FF,  // Bleu pastel
  3: 0xB3FFB3,  // Vert pastel
  4: 0xFFFFB3,  // Jaune pastel
  5: 0xFFB3FF,  // Rose pastel
  6: 0xB3FFFF,  // Cyan pastel
  7: 0xFFC6C6,  // Rose clair pastel
  8: 0xC6C6FF,  // Bleu clair pastel
  9: 0xC6FFC6,  // Vert clair pastel
  10: 0xE6B3FF, // Violet pastel
  11: 0xFFCC99, // Orange pastel
  12: 0xCCFF99, // Vert lime pastel
  13: 0x99FFDD, // Turquoise pastel
  14: 0xD699FF, // Violet profond pastel
  15: 0xFFD699, // Orange doux pastel
  16: 0xC6A07E, // Marron clair pastel
  17: 0x80CC99, // Vert émeraude pastel
  18: 0xA080CC, // Bleu foncé pastel
  19: 0xCC8080, // Rouge foncé pastel
  20: 0x8080CC, // Bleu profond pastel
  default: 0xDDDDDD // Gris neutre clair
};

export const THEMES = {
  light: {
    background: 0xFAF3E0, // Beige clair
    titleText: "#ffffff",
    titleStroke: "#4C202F",
    text: "#4C202F", // Brun foncé
    stroke: "#9B5A71", // Rose foncé
    buttonFill: 0xFADADD, // Rose pastel
    buttonText: "#4C202F", // Brun foncé
    gameOverText: "#FFB3B3",
    gameOverButton: 0xB3FFB3,
  },
  dark: {
    background: 0x292039,
    titleText: "#FFFFFF",
    titleStroke: "#000000",
    text: "#FFFFFF",
    stroke: "#423953",
    buttonFill: 0x444444,
    buttonText: "#444444",
    gameOverText: "#ff4444",
    gameOverButton: 0x44ff44,
  }
};


export const GAME_KEY = "Pawgress";

export const fontStyle = {
  fontFamily: 'SourGummy',
  fontSize: '24px',
  fill: '#FFFFFF'
};

// Dans constants.js ou un nouveau fichier comme uiScaling.js
export const LAYOUT = {
  scaling: {
    mobile: 2,
    desktop: 0.8,
    breakpoint: 980  // Seuil en pixels pour basculer entre mobile/desktop
  },

  spacing: {
    element: 110,    // Espace vertical entre les éléments
    button: 100      // Espace entre les boutons
  },

  fonts: {
    title: 80,       // Taille de la police du titre
    button: 24,      // Taille de la police des boutons
    credit: 16,      // Taille de la police des crédits
    resource: 32
  },

  button: {
    width: 180,
    height: 60,
    strokeWidth: 3
  },

  styles: {
    strokeThickness: 26
  }
};
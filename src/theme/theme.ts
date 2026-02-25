export const Couleurs = {
  primaire: '#8F3400',
  secondaire: '#059EFF',
  accent: '#FFBF00',
  blanc: '#FFFFFF',
  noir: '#000000',
  fond: '#F5F5F5',
  carte: '#FFFFFF',
  texte: {
    primaire: '#1A1A1A',
    secondaire: '#666666',
    clair: '#AAAAAA',
    blanc: '#FFFFFF',
  },
  bordure: '#E8E8E8',
  succes: '#28A745',
  erreur: '#DC3545',
  avertissement: '#FFBF00',
  superposition: 'rgba(0,0,0,0.5)',
};

export const Espacement = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const RayonBordure = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  complet: 999,
};

export const Ombres = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Alias compatibilité anglais
export const Colors = Couleurs;
export const Spacing = Espacement;
export const BorderRadius = RayonBordure;
export const Shadows = Ombres;

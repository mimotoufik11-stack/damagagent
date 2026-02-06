export const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
};

export const isCapacitor = () => {
  return typeof window !== 'undefined' && window.Capacitor !== undefined;
};

export const getPlatform = () => {
  if (isElectron()) return 'electron';
  if (isCapacitor()) return 'capacitor';
  return 'web';
};

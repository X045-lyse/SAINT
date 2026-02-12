
import { LoveLetterData } from '../types';

/**
 * Encode les données de la lettre en Base64 compatible URL et Unicode
 */
export const encodeLetter = (data: LoveLetterData): string => {
  const json = JSON.stringify(data);
  // Utilisation de TextEncoder pour gérer correctement l'UTF-8
  const bytes = new TextEncoder().encode(json);
  const binary = String.fromCharCode(...bytes);
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Base64 URL-safe
};

/**
 * Décode les données depuis le hash de l'URL
 */
export const decodeLetter = (hash: string): LoveLetterData | null => {
  try {
    let base64 = hash.replace('#', '')
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Rajouter le padding si nécessaire
    while (base64.length % 4) base64 += '=';
    
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch (error) {
    console.error("Erreur de décodage du lien magique:", error);
    return null;
  }
};

export const getShareableLink = (encodedData: string): string => {
  // On s'assure d'avoir l'URL complète pour que le lien soit cliquable partout
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#${encodedData}`;
};

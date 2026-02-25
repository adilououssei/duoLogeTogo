// Types principaux de l'application LogeTogo

export type TypeUtilisateur = 'locataire' | 'proprietaire' | 'agent' | 'admin';

export type TypeBien = 'Chambre' | 'Studio' | 'Appartement' | 'Villa' | 'Bureau' | 'Terrain';

export type TypeTransaction = 'location' | 'vente';

export type StatutBien = 'disponible' | 'occupe' | 'vendu';

export interface Utilisateur {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  telephone: string;
  indicatifPays?: string;
  codePays?: string;
  type: TypeUtilisateur;
  avatar?: string;
  verifie: boolean;
  creeLe?: string;
}

export interface Agent {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  avatar?: string;
  note: number;
  annonces?: number;
  avis?: number;
  verifie?: boolean;
}

export interface InfosPrix {
  prixMensuel: number;          // Prix par mois en FCFA
  avanceMois: number;           // Nombre de mois d'avance
  cautionMois: number;          // Nombre de mois de caution gratuits
  commissionDemarcheur: number; // Commission de l'agent (souvent = prixMensuel)
}

export interface Bien {
  id: string;
  titre: string;
  type: TypeBien;
  typeTransaction: TypeTransaction;
  prix: number;                 // Prix mensuel (location) ou prix total (vente)
  infoPrix?: InfosPrix;
  localisation: string;
  quartier: string;
  description: string;
  images: string[];
  videos?: string[];
  statut: StatutBien;
  chambres: number;
  sallesDeBain: number;
  superficie: number;
  equipements: string[];
  agent: Agent;
  note: number;
  avis: number;
  distance: number;
  coordonnees: { latitude: number; longitude: number };
  creeLe: string;
  vues: number;
}

export interface Message {
  id: string;
  envoyeurId: string;
  texte?: string;
  typeMessage: 'texte' | 'vocal' | 'image' | 'video';
  urlMedia?: string;
  dureeVocal?: number;
  heure: string;
  lu: boolean;
}

export interface Conversation {
  id: string;
  idBien?: string;
  titreBien?: string;
  autreUtilisateur: Partial<Utilisateur> & { id: string; nom: string; avatar?: string; type?: TypeUtilisateur };
  messages: Message[];
  dernierMessage: string;
  heureDernierMessage: string;
  nonLus: number;
  enAppel?: boolean;
}

export interface Notification {
  id: string;
  type: 'nouvelle_annonce' | 'message' | 'mise_a_jour_statut' | 'avis';
  titre: string;
  corps: string;
  heure: string;
  lu: boolean;
  idBien?: string;
}

export interface FiltresRecherche {
  type: string;
  typeTransaction: string;
  quartier: string;
  prixMin: number;
  prixMax: number;
  equipements: string[];
  statut: string;
}

// Alias anglais pour compatibilité
export type Listing = Bien;
export type User = Utilisateur;
export type UserType = TypeUtilisateur;

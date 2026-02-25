// ─── Types Utilisateurs ───────────────────────────────────────────────────────
export type TypeUtilisateur = 'locataire' | 'proprietaire' | 'agent' | 'admin';

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  type: TypeUtilisateur;
  telephone?: string;
  codePays?: string;
  avatar?: string;
  verifie?: boolean;
}

// ─── Types Annonces ───────────────────────────────────────────────────────────
export type StatutAnnonce = 'disponible' | 'occupee';
export type TypeTransaction = 'location' | 'vente';
export type TypeBien =
  | 'Chambre'
  | 'Studio'
  | 'Appartement'
  | 'Villa'
  | 'Bureau'
  | 'Terrain'
  | 'Maison';

export interface PrixDetail {
  montantMensuel: number;
  avanceMois: number;       // Nombre de mois d'avance à payer
  cautionMois: number;      // Nombre de mois offerts (brûlés) avant paiement
  commissionAgent: number;  // Commission du démarcheur (généralement 1 mois)
  typeTransaction: TypeTransaction;
}

export interface Coordonnees {
  latitude: number;
  longitude: number;
}

export interface AgentInfo {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  avatar?: string;
  note: number;
}

export interface Annonce {
  id: string;
  titre: string;
  type: TypeBien;
  typeTransaction: TypeTransaction;
  prix: number;
  prixDetail?: PrixDetail;
  localisation: string;
  quartier: string;
  description: string;
  images: string[];
  videos?: string[];
  statut: StatutAnnonce;
  chambres: number;
  sallesBain: number;
  superficie: number;
  equipements: string[];
  agent: AgentInfo;
  note: number;
  avis: number;
  distance: number;
  coordonnees: Coordonnees;
  dateCreation: string;
  vues: number;
}

// ─── Types Messages ───────────────────────────────────────────────────────────
export type TypeMessage = 'texte' | 'vocal' | 'image' | 'video';

export interface Message {
  id: string;
  expediteurId: string;
  texte?: string;
  uriMedia?: string;
  typeMessage: TypeMessage;
  heure: string;
  lu: boolean;
}

export interface Conversation {
  id: string;
  annonceId?: string;
  titrAnnonce?: string;
  autreUtilisateur: { id: string; nom: string; avatar?: string; type?: string };
  messages: Message[];
  dernierMessage: string;
  heureMessage: string;
  nonLus: number;
}

// ─── Types Notifications ──────────────────────────────────────────────────────
export type TypeNotification =
  | 'nouvelle_annonce'
  | 'message'
  | 'mise_a_jour_statut'
  | 'avis';

export interface Notification {
  id: string;
  type: TypeNotification;
  titre: string;
  corps: string;
  heure: string;
  lu: boolean;
  annonceId?: string;
}

// ─── Filtres Recherche ────────────────────────────────────────────────────────
export interface FiltresRecherche {
  type: string;
  quartier: string;
  prixMin: number;
  prixMax: number;
  equipements: string[];
  statut: string;
  typeTransaction?: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export type ListeParametresNavigation = {
  Accueil: undefined;
  Onboarding: undefined;
  Auth: undefined;
  OngletLocataire: undefined;
  OngletAgent: undefined;
  OngletProprietaire: undefined;
  TableauBordAdmin: undefined;
  DetailAnnonce: { annonce: Annonce };
  Profil: undefined;
  Notifications: undefined;
  Carte: { annonce?: Annonce; annonces?: Annonce[] } | undefined;
  Chat: { conversation: Partial<Conversation> };
  AjouterAnnonce: undefined;
  ModifierAnnonce: { annonce: Annonce };
  Favoris: undefined;
  Recherche: undefined;
  // Alias anglais pour compatibilité
  ListingDetail: { listing: any };
  Map: { listing?: any; listings?: any[] } | undefined;
  AddListing: undefined;
  EditListing: { listing: any };
  Favorites: undefined;
  Search: undefined;
  Profile: undefined;
  AgentTabs: undefined;
  OwnerTabs: undefined;
  TenantTabs: undefined;
  AdminDashboard: undefined;
};

// Alias anglais
export type User = Utilisateur & { name: string; type: any; phone?: string; verified?: boolean };
export type Listing = Annonce & {
  title: string; location: string; district: string;
  bedrooms: number; bathrooms: number; area: number; amenities: string[];
  agent: any; rating: number; reviews: number; coordinates: any; createdAt: string; views: number;
};
export type SearchFilters = FiltresRecherche & { minPrice: number; maxPrice: number };
export type RootStackParamList = ListeParametresNavigation;

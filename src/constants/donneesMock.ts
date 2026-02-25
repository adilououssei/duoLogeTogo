import { Annonce, Conversation, Notification } from '../types';

export const ANNONCES_MOCK: Annonce[] = [
  {
    id: '1',
    titre: 'Chambre meublée à Adidogomé',
    type: 'Chambre',
    typeTransaction: 'location',
    prix: 25000,
    prixDetail: {
      montantMensuel: 25000,
      avanceMois: 6,
      cautionMois: 2,
      commissionAgent: 25000,
      typeTransaction: 'location',
    },
    localisation: 'Adidogomé, Lomé',
    quartier: 'Golfe',
    description: 'Belle chambre meublée avec climatisation, salle de bain privée et accès WiFi. Proche du campus universitaire de Lomé.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
    ],
    videos: [],
    statut: 'disponible',
    chambres: 1,
    sallesBain: 1,
    superficie: 15,
    equipements: ['WiFi', 'Climatisation', 'Salle de bain privée', 'Cuisine partagée'],
    agent: {
      id: 'a1',
      nom: 'Kofi Mensah',
      telephone: '+228 90 00 00 01',
      email: 'kofi@logetogo.tg',
      avatar: 'https://i.pravatar.cc/100?img=1',
      note: 4.8,
    },
    note: 4.5,
    avis: 12,
    distance: 0.5,
    coordonnees: { latitude: 6.1726, longitude: 1.2312 },
    dateCreation: '2026-02-10',
    vues: 145,
  },
  {
    id: '2',
    titre: 'Studio moderne à Bè',
    type: 'Studio',
    typeTransaction: 'location',
    prix: 45000,
    prixDetail: {
      montantMensuel: 45000,
      avanceMois: 3,
      cautionMois: 1,
      commissionAgent: 45000,
      typeTransaction: 'location',
    },
    localisation: 'Bè, Lomé',
    quartier: 'Golfe',
    description: 'Studio entièrement rénové avec salon, cuisine équipée et salle de bain moderne. Quartier animé.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
    ],
    videos: [],
    statut: 'disponible',
    chambres: 1,
    sallesBain: 1,
    superficie: 30,
    equipements: ['WiFi', 'Cuisine équipée', 'Parking', 'Sécurité 24/7'],
    agent: {
      id: 'a2',
      nom: 'Ama Koffi',
      telephone: '+228 90 00 00 02',
      email: 'ama@logetogo.tg',
      avatar: 'https://i.pravatar.cc/100?img=5',
      note: 4.9,
    },
    note: 4.7,
    avis: 8,
    distance: 1.2,
    coordonnees: { latitude: 6.1400, longitude: 1.2450 },
    dateCreation: '2026-02-12',
    vues: 89,
  },
  {
    id: '3',
    titre: 'Appartement F2 à Tokoin',
    type: 'Appartement',
    typeTransaction: 'location',
    prix: 75000,
    prixDetail: {
      montantMensuel: 75000,
      avanceMois: 10,
      cautionMois: 3,
      commissionAgent: 75000,
      typeTransaction: 'location',
    },
    localisation: 'Tokoin, Lomé',
    quartier: 'Golfe',
    description: 'Bel appartement F2 avec terrasse, vue dégagée, quartier calme et sécurisé. Idéal pour couple ou jeune professionnel.',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600',
    ],
    videos: [],
    statut: 'disponible',
    chambres: 2,
    sallesBain: 1,
    superficie: 55,
    equipements: ['WiFi', 'Terrasse', 'Parking', 'Climatisation', 'Sécurité'],
    agent: {
      id: 'a3',
      nom: 'Edem Agbo',
      telephone: '+228 90 00 00 03',
      email: 'edem@logetogo.tg',
      avatar: 'https://i.pravatar.cc/100?img=8',
      note: 4.6,
    },
    note: 4.8,
    avis: 20,
    distance: 2.1,
    coordonnees: { latitude: 6.1528, longitude: 1.2176 },
    dateCreation: '2026-02-08',
    vues: 210,
  },
  {
    id: '4',
    titre: 'Terrain à vendre à Agoe',
    type: 'Terrain',
    typeTransaction: 'vente',
    prix: 5000000,
    prixDetail: {
      montantMensuel: 0,
      avanceMois: 0,
      cautionMois: 0,
      commissionAgent: 250000,
      typeTransaction: 'vente',
    },
    localisation: 'Agoe, Lomé',
    quartier: 'Agoe',
    description: 'Beau terrain de 500m² dans une zone résidentielle calme à Agoe. Titre foncier disponible. Idéal pour construction.',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600',
    ],
    videos: [],
    statut: 'disponible',
    chambres: 0,
    sallesBain: 0,
    superficie: 500,
    equipements: ['Titre foncier', 'Zone résidentielle', 'Accès route goudronnée'],
    agent: {
      id: 'a2',
      nom: 'Ama Koffi',
      telephone: '+228 90 00 00 02',
      email: 'ama@logetogo.tg',
      avatar: 'https://i.pravatar.cc/100?img=5',
      note: 4.9,
    },
    note: 4.5,
    avis: 3,
    distance: 5.0,
    coordonnees: { latitude: 6.2100, longitude: 1.2234 },
    dateCreation: '2026-02-15',
    vues: 95,
  },
  {
    id: '5',
    titre: 'Villa 3 chambres à vendre à Agoe',
    type: 'Villa',
    typeTransaction: 'vente',
    prix: 45000000,
    prixDetail: {
      montantMensuel: 0,
      avanceMois: 0,
      cautionMois: 0,
      commissionAgent: 2250000,
      typeTransaction: 'vente',
    },
    localisation: 'Agoe, Lomé',
    quartier: 'Agoe',
    description: 'Magnifique villa avec jardin privatif, garage et résidence sécurisée. Parfait pour une famille.',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
    ],
    videos: [],
    statut: 'disponible',
    chambres: 3,
    sallesBain: 2,
    superficie: 120,
    equipements: ['Jardin', 'Garage', 'Climatisation', 'Sécurité 24/7', 'WiFi'],
    agent: {
      id: 'a2',
      nom: 'Ama Koffi',
      telephone: '+228 90 00 00 02',
      email: 'ama@logetogo.tg',
      avatar: 'https://i.pravatar.cc/100?img=5',
      note: 4.9,
    },
    note: 4.9,
    avis: 3,
    distance: 4.5,
    coordonnees: { latitude: 6.2100, longitude: 1.2234 },
    dateCreation: '2026-02-15',
    vues: 320,
  },
];

// Alias anglais pour compatibilité
export const MOCK_LISTINGS = ANNONCES_MOCK.map(a => ({
  ...a,
  title: a.titre,
  location: a.localisation,
  district: a.quartier,
  bedrooms: a.chambres,
  bathrooms: a.sallesBain,
  area: a.superficie,
  amenities: a.equipements,
  agent: { ...a.agent, name: a.agent.nom, phone: a.agent.telephone, rating: a.agent.note },
  rating: a.note,
  reviews: a.avis,
  coordinates: a.coordonnees,
  createdAt: a.dateCreation,
  views: a.vues,
  status: a.statut === 'disponible' ? 'available' : 'occupied',
}));

export const TYPES_BIENS: string[] = [
  'Tous', 'Chambre', 'Studio', 'Appartement', 'Villa', 'Bureau', 'Terrain', 'Maison'
];
export const PROPERTY_TYPES = TYPES_BIENS;

export const TYPES_TRANSACTION: string[] = ['Tous', 'Location', 'Vente'];

export const QUARTIERS: string[] = [
  'Tous', 'Golfe', 'Agoe', 'Bè', 'Akébou', 'Atakpamé', 'Kpalimé'
];
export const DISTRICTS = QUARTIERS;

export const LISTE_EQUIPEMENTS: string[] = [
  'WiFi', 'Climatisation', 'Parking', 'Sécurité 24/7', 'Cuisine équipée',
  'Terrasse', 'Jardin', 'Salle de bain privée', 'Eau courante',
  'Électricité', 'Groupe électrogène', 'Gardien', 'Piscine', 'Ascenseur',
];
export const AMENITIES_LIST = LISTE_EQUIPEMENTS;

export const CONVERSATIONS_MOCK: Conversation[] = [
  {
    id: 'c1',
    annonceId: '1',
    titrAnnonce: 'Chambre meublée à Adidogomé',
    autreUtilisateur: { id: 'a1', nom: 'Kofi Mensah', avatar: 'https://i.pravatar.cc/100?img=1', type: 'agent' },
    messages: [
      { id: 'm1', expediteurId: 'moi', texte: 'Bonjour, est-ce que la chambre est encore disponible?', typeMessage: 'texte', heure: '10:25', lu: true },
      { id: 'm2', expediteurId: 'a1', texte: 'Bonjour! Oui, la chambre est disponible.', typeMessage: 'texte', heure: '10:28', lu: true },
      { id: 'm3', expediteurId: 'a1', texte: 'La chambre est disponible dès maintenant.', typeMessage: 'texte', heure: '10:30', lu: false },
    ],
    dernierMessage: 'La chambre est disponible dès maintenant.',
    heureMessage: '10:30',
    nonLus: 2,
  },
];

export const MOCK_CONVERSATIONS = CONVERSATIONS_MOCK.map(c => ({
  ...c,
  listingTitle: c.titrAnnonce,
  otherUser: { ...c.autreUtilisateur, name: c.autreUtilisateur.nom },
  lastMessage: c.dernierMessage,
  lastMessageTime: c.heureMessage,
  unread: c.nonLus,
  messages: c.messages.map(m => ({ ...m, senderId: m.expediteurId, text: m.texte, time: m.heure, read: m.lu })),
}));

export const NOTIFICATIONS_MOCK: Notification[] = [
  { id: 'n1', type: 'nouvelle_annonce', titre: 'Nouvelle chambre disponible!', corps: 'Une chambre correspondant à vos critères vient d\'être publiée à Adidogomé.', heure: '5 min', lu: false, annonceId: '1' },
  { id: 'n2', type: 'message', titre: 'Nouveau message de Kofi Mensah', corps: 'La chambre est disponible dès maintenant.', heure: '10 min', lu: false },
  { id: 'n3', type: 'mise_a_jour_statut', titre: 'Statut mis à jour', corps: 'La chambre que vous suiviez à Djidjolé est maintenant occupée.', heure: '1h', lu: true },
  { id: 'n4', type: 'avis', titre: 'Nouvel avis reçu', corps: 'Vous avez reçu un nouvel avis de 5 étoiles.', heure: '2h', lu: true },
];
export const MOCK_NOTIFICATIONS = NOTIFICATIONS_MOCK.map(n => ({
  ...n,
  title: n.titre,
  body: n.corps,
  time: n.heure,
  read: n.lu,
}));

export const AGENTS_MOCK = [
  { id: 'a1', name: 'Kofi Mensah', avatar: 'https://i.pravatar.cc/100?img=1', listings: 8, reviews: 45, rating: 4.8, verified: true },
  { id: 'a2', name: 'Ama Koffi',   avatar: 'https://i.pravatar.cc/100?img=5', listings: 5, reviews: 30, rating: 4.9, verified: true },
  { id: 'a3', name: 'Edem Agbo',   avatar: 'https://i.pravatar.cc/100?img=8', listings: 3, reviews: 18, rating: 4.6, verified: false },
];
export const MOCK_AGENTS = AGENTS_MOCK;

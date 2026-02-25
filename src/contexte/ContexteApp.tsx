import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Utilisateur, FiltresRecherche, Notification } from '../types/modeles'; // ✅ CORRIGÉ
import { NOTIFICATIONS_MOCK } from '../constants/donneesMock'; // ✅ correct

interface TypeContexteApp {
  utilisateur: Utilisateur | null;
  connexion: (u: Utilisateur) => void;
  deconnexion: () => void;
  favoris: string[];
  basculerFavori: (id: string) => void;
  estFavori: (id: string) => boolean;
  notifications: Notification[];
  nombreNonLus: number;
  marquerToutLu: () => void;
  filtresRecherche: FiltresRecherche;
  definirFiltresRecherche: (f: FiltresRecherche) => void;
}

const ContexteApp = createContext<TypeContexteApp>({} as TypeContexteApp);

export const useApp = () => useContext(ContexteApp);

export const FournisseurApp = ({ children }: { children: ReactNode }) => {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [favoris, setFavoris] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_MOCK as any);
  const [filtresRecherche, setFiltresRecherche] = useState<FiltresRecherche>({
    type: 'Tous',
    quartier: 'Tous',
    prixMin: 0,
    prixMax: 500000,
    equipements: [],
    statut: 'Tous',
    typeTransaction: 'Tous',
  });

  const connexion = (u: Utilisateur) => setUtilisateur(u);
  const deconnexion = () => { setUtilisateur(null); setFavoris([]); };

  const basculerFavori = (id: string) =>
    setFavoris(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const estFavori = (id: string) => favoris.includes(id);

  const marquerToutLu = () =>
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));

  const nombreNonLus = notifications.filter(n => !n.lu).length;

  // Alias anglais pour compatibilité
  const login = connexion;
  const logout = deconnexion;
  const toggleFavorite = basculerFavori;
  const isFavorite = estFavori;
  const unreadCount = nombreNonLus;
  const markAllRead = marquerToutLu;

  return (
    <ContexteApp.Provider value={{
      utilisateur,
      connexion,
      deconnexion,
      favoris,
      basculerFavori,
      estFavori,
      notifications,
      nombreNonLus,
      marquerToutLu,
      filtresRecherche,
      definirFiltresRecherche: setFiltresRecherche,
      // @ts-ignore aliases
      login, logout, toggleFavorite, isFavorite,
      unreadCount, markAllRead,
    }}>
      {children}
    </ContexteApp.Provider>
  );
};
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Espacement, Ombres } from '../theme/theme';
import { Avatar } from './commun/Composants';

interface PropsEnTete {
  titre?: string;
  sousTitre?: string;
  onRetour?: () => void;
  onProfil?: () => void;
  onNotifications?: () => void;
  nombreNotifications?: number;
  nomUtilisateur?: string;
  avatarUtilisateur?: string;
  typeEnTete?: 'simple' | 'accueil' | 'minimal';
  actionDroite?: React.ReactNode;
}

/**
 * EnTete - Composant d'en-tête réutilisable pour toutes les pages
 * 
 * Types disponibles :
 * - 'accueil' : affiche le nom de l'utilisateur + icônes notifications et profil
 * - 'simple' : affiche un titre centré avec bouton retour optionnel
 * - 'minimal' : affiche juste le titre avec action droite optionnelle
 */
export const EnTete: React.FC<PropsEnTete> = ({
  titre,
  sousTitre,
  onRetour,
  onProfil,
  onNotifications,
  nombreNotifications = 0,
  nomUtilisateur,
  avatarUtilisateur,
  typeEnTete = 'simple',
  actionDroite,
}) => {
  if (typeEnTete === 'accueil') {
    const estConnecte = !!nomUtilisateur;

    return (
      <View style={s.enTeteAccueil}>
        <View>
          {estConnecte ? (
            <>
              <Text style={s.salutation}>Bonjour 👋</Text>
              <Text style={s.nomUtilisateur}>{nomUtilisateur}</Text>
            </>
          ) : (
            <>
              <Text style={s.salutation}>Bienvenue sur</Text>
              <Text style={s.nomUtilisateur}>LogeTogo 🏠</Text>
            </>
          )}
        </View>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          {onNotifications && (
            <TouchableOpacity style={s.boutonIcone} onPress={onNotifications}>
              <Ionicons name="notifications-outline" size={22} color={Couleurs.texte.primaire} />
              {nombreNotifications > 0 && (
                <View style={s.badgeNotif}>
                  <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>{nombreNotifications}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {/* ✅ Si connecté → avatar, sinon → bouton Se connecter */}
          {estConnecte ? (
            onProfil && (
              <TouchableOpacity onPress={onProfil}>
                <Avatar uri={avatarUtilisateur} nom={nomUtilisateur} taille={42} />
              </TouchableOpacity>
            )
          ) : (
            onProfil && (
              <TouchableOpacity style={s.boutonConnexion} onPress={onProfil}>
                <Ionicons name="person-outline" size={16} color={Couleurs.blanc} />
                <Text style={s.texteConnexion}>Connexion</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    );
  }

  if (typeEnTete === 'minimal') {
    return (
      <View style={s.enTeteMinimal}>
        {onRetour && (
          <TouchableOpacity onPress={onRetour} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={Couleurs.texte.primaire} />
          </TouchableOpacity>
        )}
        <Text style={s.titreMinimal}>{titre}</Text>
        {actionDroite ? actionDroite : null}
      </View>
    );
  }

  // Type 'simple' par défaut
  return (
    <View style={s.enTeteSimple}>
      {onRetour && (
        <TouchableOpacity onPress={onRetour} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color={Couleurs.texte.primaire} />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        {titre && <Text style={s.titreSimple}>{titre}</Text>}
        {sousTitre && <Text style={s.sousTitreSimple}>{sousTitre}</Text>}
      </View>
      {actionDroite ? actionDroite : null}
    </View>
  );
};

const s = StyleSheet.create({
  enTeteAccueil: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Espacement.base,
    paddingTop: Espacement.base,
    paddingBottom: Espacement.sm,
    backgroundColor: Couleurs.fond,

  },
  salutation: { fontSize: 13, color: Couleurs.texte.secondaire },
  nomUtilisateur: { fontSize: 20, fontWeight: '800', color: Couleurs.texte.primaire },
  boutonIcone: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Couleurs.blanc,
    alignItems: 'center', justifyContent: 'center',
    ...Ombres.sm,
  },
  badgeNotif: {
    position: 'absolute', top: -2, right: -2,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Couleurs.erreur,
    alignItems: 'center', justifyContent: 'center',
  },
  enTeteSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Espacement.base,
    paddingVertical: Espacement.md,
    backgroundColor: Couleurs.blanc,
    borderBottomWidth: 1,
    borderBottomColor: Couleurs.bordure,
  },
  titreSimple: { fontSize: 20, fontWeight: '800', color: Couleurs.texte.primaire },
  sousTitreSimple: { fontSize: 12, color: Couleurs.texte.secondaire, marginTop: 2 },
  enTeteMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Espacement.base,
    paddingVertical: Espacement.md,
    backgroundColor: Couleurs.blanc,
    borderBottomWidth: 1,
    borderBottomColor: Couleurs.bordure,
  },
  titreMinimal: { flex: 1, fontSize: 17, fontWeight: '700', color: Couleurs.texte.primaire },

  boutonConnexion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Couleurs.primaire,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  texteConnexion: {
    fontSize: 13,
    fontWeight: '700',
    color: Couleurs.blanc,
  },
});

export default EnTete;

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Couleurs, Espacement, RayonBordure, Ombres } from '../theme/theme';
import { Avatar } from '../components/commun/Composants';
import { useApp } from '../contexte/ContexteApp';
import { SafeAreaView } from 'react-native-safe-area-context';
import EcranNonConnecte from '../components/commun/EcranNonConnecte';


export default function EcranProfil({ navigation }: { navigation: any }) {
  const { utilisateur, deconnexion } = useApp();
  const [notifActives, setNotifActives] = useState(true);
  const [emailActif, setEmailActif] = useState(true);

  // ✅ GARDE D'AUTH : si non connecté → écran de connexion
  if (!utilisateur) {
    return (
      <EcranNonConnecte
        navigation={navigation}
        icone="person-outline"
        titre="Accédez à votre profil"
        description="Connectez-vous pour gérer vos informations, vos annonces et vos préférences."
      />
    );
  }

  const gererDeconnexion = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: () => {
          deconnexion();
          // Après déconnexion, on reste sur OngletLocataire (home publique)
          navigation.navigate('Accueil');
        },
      },
    ]);
  };

  const etiquettesType: Record<string, string> = {
    locataire: 'Locataire',
    proprietaire: 'Propriétaire',
    agent: 'Agent Immobilier',
  };
  const iconesType: Record<string, string> = {
    agent: 'briefcase',
    proprietaire: 'home',
    locataire: 'person',
  };

  const typeUser = utilisateur?.type ?? 'locataire';
  const etiquetteType = etiquettesType[typeUser] ?? 'Utilisateur';
  const iconeType = iconesType[typeUser] ?? 'person';

  const menuItems = [
    { icone: 'person-outline', etiquette: 'Modifier le profil', onPress: () => {} },
    { icone: 'heart-outline', etiquette: 'Mes favoris', onPress: () => navigation.navigate('Favoris') },
    { icone: 'time-outline', etiquette: 'Historique', onPress: () => {} },
    { icone: 'shield-checkmark-outline', etiquette: 'Vérification d\'identité', onPress: () => {} },
    { icone: 'language-outline', etiquette: 'Langue', onPress: () => {}, droite: 'Français' },
  ];

  return (
    <SafeAreaView style={s.conteneur}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[Couleurs.primaire, '#C44A00']} style={s.degrade}>
          <TouchableOpacity style={s.boutonParametres}>
            <Ionicons name="settings-outline" size={24} color={Couleurs.blanc} />
          </TouchableOpacity>
          <View style={{ position: 'relative' }}>
            <Avatar uri={utilisateur?.avatar} nom={utilisateur?.nom} taille={88} />
            <TouchableOpacity style={s.boutonCamera}>
              <Ionicons name="camera" size={16} color={Couleurs.blanc} />
            </TouchableOpacity>
          </View>
          <Text style={s.nom}>{utilisateur?.nom ?? ''} {utilisateur?.prenom ?? ''}</Text>
          <View style={s.badgeType}>
            <Ionicons name={iconeType as any} size={14} color={Couleurs.blanc} />
            <Text style={s.texteType}>{etiquetteType}</Text>
          </View>
        </LinearGradient>

        <View style={s.corps}>
          {/* Infos contact */}
          <View style={s.carte}>
            <Text style={s.titreCarte}>Informations</Text>
            {utilisateur?.email && (
              <View style={s.rangInfo}>
                <Ionicons name="mail-outline" size={18} color={Couleurs.texte.secondaire} />
                <Text style={s.texteInfo}>{utilisateur.email}</Text>
              </View>
            )}
            {utilisateur?.telephone && (
              <View style={s.rangInfo}>
                <Ionicons name="call-outline" size={18} color={Couleurs.texte.secondaire} />
                <Text style={s.texteInfo}>{utilisateur.telephone}</Text>
              </View>
            )}
          </View>

          {/* Menu */}
          <View style={s.carte}>
            {menuItems.map((item, i) => (
              <TouchableOpacity key={i} style={[s.elementMenu, i < menuItems.length - 1 && s.separateur]} onPress={item.onPress}>
                <Ionicons name={item.icone as any} size={20} color={Couleurs.primaire} />
                <Text style={s.texteMenu}>{item.etiquette}</Text>
                <View style={{ flex: 1 }} />
                {item.droite && <Text style={s.droiteMenu}>{item.droite}</Text>}
                <Ionicons name="chevron-forward" size={16} color={Couleurs.texte.clair} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Notifications */}
          <View style={s.carte}>
            <Text style={s.titreCarte}>Notifications</Text>
            <View style={s.rangSwitch}>
              <Text style={s.texteSwitch}>Notifications push</Text>
              <Switch value={notifActives} onValueChange={setNotifActives} trackColor={{ true: Couleurs.primaire }} />
            </View>
            <View style={[s.rangSwitch, { borderTopWidth: 1, borderTopColor: Couleurs.bordure }]}>
              <Text style={s.texteSwitch}>Emails</Text>
              <Switch value={emailActif} onValueChange={setEmailActif} trackColor={{ true: Couleurs.primaire }} />
            </View>
          </View>

          {/* Déconnexion */}
          <TouchableOpacity style={s.boutonDeconnexion} onPress={gererDeconnexion}>
            <Ionicons name="log-out-outline" size={20} color={Couleurs.erreur} />
            <Text style={s.texteDeconnexion}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  conteneur: { flex: 1, backgroundColor: Couleurs.fond },
  degrade: { paddingTop: 50, paddingBottom: 30, alignItems: 'center', gap: 10 },
  boutonParametres: { position: 'absolute', top: 16, right: 16, padding: 8 },
  boutonCamera: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: Couleurs.primaire, borderRadius: 12, padding: 5,
    borderWidth: 2, borderColor: Couleurs.blanc,
  },
  nom: { fontSize: 22, fontWeight: '800', color: Couleurs.blanc, marginTop: 4 },
  badgeType: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  texteType: { fontSize: 13, fontWeight: '600', color: Couleurs.blanc },
  corps: { padding: Espacement.base, gap: 14 },
  carte: {
    backgroundColor: Couleurs.blanc, borderRadius: RayonBordure.lg,
    padding: Espacement.base, ...Ombres.sm,
  },
  titreCarte: { fontSize: 14, fontWeight: '700', color: Couleurs.texte.secondaire, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  rangInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  texteInfo: { fontSize: 14, color: Couleurs.texte.primaire },
  elementMenu: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  separateur: { borderBottomWidth: 1, borderBottomColor: Couleurs.bordure },
  texteMenu: { fontSize: 15, color: Couleurs.texte.primaire },
  droiteMenu: { fontSize: 13, color: Couleurs.texte.clair, marginRight: 4 },
  rangSwitch: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  texteSwitch: { fontSize: 15, color: Couleurs.texte.primaire },
  boutonDeconnexion: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Couleurs.blanc, borderRadius: RayonBordure.lg, padding: 16,
    borderWidth: 1.5, borderColor: Couleurs.erreur + '40', ...Ombres.sm,
  },
  texteDeconnexion: { fontSize: 15, fontWeight: '700', color: Couleurs.erreur },
});
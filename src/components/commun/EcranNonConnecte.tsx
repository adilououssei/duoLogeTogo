import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Couleurs, RayonBordure, Espacement } from '../../theme/theme';

interface Props {
  navigation: any;
  icone?: string;
  titre?: string;
  description?: string;
}

/**
 * Écran affiché quand une action nécessite d'être connecté.
 * Redirige vers l'écran d'authentification.
 */
export default function EcranNonConnecte({
  navigation,
  icone = 'lock-closed-outline',
  titre = 'Connexion requise',
  description = 'Vous devez être connecté pour accéder à cette fonctionnalité.',
}: Props) {
  return (
    <View style={s.conteneur}>
      {/* Illustration */}
      <View style={s.illustration}>
        <LinearGradient
          colors={[Couleurs.primaire + '20', Couleurs.primaire + '05']}
          style={s.cercle}
        >
          <Ionicons name={icone as any} size={64} color={Couleurs.primaire} />
        </LinearGradient>
      </View>

      {/* Texte */}
      <Text style={s.titre}>{titre}</Text>
      <Text style={s.description}>{description}</Text>

      {/* Boutons */}
      <View style={s.boutons}>
        <TouchableOpacity
          style={s.boutonConnexion}
          onPress={() => navigation.navigate('Authentification')}
          activeOpacity={0.85}
        >
          <LinearGradient colors={[Couleurs.primaire, '#C44A00']} style={s.degradeBouton}>
            <Ionicons name="log-in-outline" size={20} color="#fff" />
            <Text style={s.texteBoutonConnexion}>Se connecter</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.boutonInscription}
          onPress={() => navigation.navigate('Authentification')}
          activeOpacity={0.85}
        >
          <Text style={s.texteBoutonInscription}>Créer un compte</Text>
        </TouchableOpacity>
      </View>

      {/* Retour discret */}
      <TouchableOpacity style={s.lienParcourir} onPress={() => navigation.navigate('Accueil')}>
        <Text style={s.texteParcourir}>Continuer sans compte →</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: Couleurs.fond,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Espacement.xl,
  },
  illustration: {
    marginBottom: 32,
  },
  cercle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titre: {
    fontSize: 24,
    fontWeight: '800',
    color: Couleurs.texte.primaire,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Couleurs.texte.secondaire,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },
  boutons: {
    width: '100%',
    gap: 12,
  },
  boutonConnexion: {
    borderRadius: RayonBordure.lg,
    overflow: 'hidden',
  },
  degradeBouton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: RayonBordure.lg,
  },
  texteBoutonConnexion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  boutonInscription: {
    borderWidth: 1.5,
    borderColor: Couleurs.primaire,
    borderRadius: RayonBordure.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  texteBoutonInscription: {
    fontSize: 15,
    fontWeight: '600',
    color: Couleurs.primaire,
  },
  lienParcourir: {
    marginTop: 24,
  },
  texteParcourir: {
    fontSize: 13,
    color: Couleurs.texte.clair,
  },
});
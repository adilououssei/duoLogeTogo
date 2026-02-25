import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows } from '../constants/theme';

export interface OngletNav {
  nom: string;
  etiquette: string;
  icone: string;
  iconeActive: string;
}

interface PropsNavigation {
  onglets: OngletNav[];
  ongletActif: string;
  surChangement: (nom: string) => void;
}

/**
 * BARRE DE NAVIGATION BAS REUTILISABLE
 * Modifier ce fichier applique les changements sur tout le projet.
 */
export default function BarreNavigationBas({
  onglets,
  ongletActif,
  surChangement,
}: PropsNavigation) {
  return (
    <View style={s.conteneur}>
      {onglets.map(onglet => {
        const actif = ongletActif === onglet.nom;
        return (
          <TouchableOpacity
            key={onglet.nom}
            style={s.onglet}
            onPress={() => surChangement(onglet.nom)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={(actif ? onglet.iconeActive : onglet.icone) as any}
              size={24}
              color={actif ? Colors.primary : Colors.text.light}
            />
            <Text style={[s.etiquette, actif && s.etiquetteActive]}>
              {onglet.etiquette}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 18,
    paddingTop: 10,
    ...Shadows.lg,
  },
  onglet: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  etiquette: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.light,
  },
  etiquetteActive: {
    color: Colors.primary,
  },
});

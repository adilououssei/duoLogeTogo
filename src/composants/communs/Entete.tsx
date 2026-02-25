import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows } from '../constants/theme';

interface PropsEntete {
  titre: string;
  surRetour?: () => void;
  actionDroite?: {
    icone: string;
    surAppui: () => void;
    badge?: number;
  };
  labelDroite?: string;
  surActionDroite?: () => void;
}

/**
 * EN-TETE REUTILISABLE
 * Utilisé sur toutes les pages pour garantir la cohérence.
 * Modifier ce fichier applique les changements sur tout le projet.
 */
export default function Entete({
  titre,
  surRetour,
  actionDroite,
  labelDroite,
  surActionDroite,
}: PropsEntete) {
  return (
    <View style={s.conteneur}>
      {surRetour ? (
        <TouchableOpacity onPress={surRetour} style={s.boutonRetour}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 44 }} />
      )}

      <Text style={s.titre} numberOfLines={1}>
        {titre}
      </Text>

      {actionDroite ? (
        <TouchableOpacity onPress={actionDroite.surAppui} style={s.boutonDroite}>
          <Ionicons name={actionDroite.icone as any} size={24} color={Colors.text.primary} />
          {actionDroite.badge && actionDroite.badge > 0 ? (
            <View style={s.badge}>
              <Text style={s.badgeTexte}>{actionDroite.badge}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      ) : labelDroite ? (
        <TouchableOpacity onPress={surActionDroite}>
          <Text style={s.labelDroite}>{labelDroite}</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 44 }} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Shadows.sm,
  },
  titre: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text.primary,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  boutonRetour: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonDroite: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeTexte: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  labelDroite: {
    fontSize: 13,
    color: Colors.secondary,
    fontWeight: '600',
  },
});

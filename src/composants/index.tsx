import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  TextInput, ActivityIndicator, ViewStyle, TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';

// ─── BOUTON ──────────────────────────────────────────────────────────────────
type VarianteBouton = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
interface PropsBouton {
  title: string;
  onPress: () => void;
  variant?: VarianteBouton;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}
export const Button = ({ title, onPress, variant = 'primary', style, textStyle, disabled, loading, icon }: PropsBouton) => {
  const map: Record<VarianteBouton, { bg: string; text: string; border: string }> = {
    primary:   { bg: Colors.primary,   text: Colors.white, border: Colors.primary },
    secondary: { bg: Colors.secondary, text: Colors.white, border: Colors.secondary },
    accent:    { bg: Colors.accent,    text: Colors.black, border: Colors.accent },
    outline:   { bg: 'transparent',    text: Colors.primary, border: Colors.primary },
    ghost:     { bg: 'transparent',    text: Colors.primary, border: 'transparent' },
    danger:    { bg: Colors.error,     text: Colors.white, border: Colors.error },
  };
  const v = map[variant];
  return (
    <TouchableOpacity
      style={[s.btn, { backgroundColor: v.bg, borderColor: v.border }, disabled && { opacity: 0.5 }, style]}
      onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon ? <Ionicons name={icon as any} size={18} color={v.text} /> : null}
          <Text style={[s.btnText, { color: v.text }, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── CHAMP DE SAISIE ─────────────────────────────────────────────────────────
interface PropsChamp {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  icon?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  editable?: boolean;
}
export const Input = ({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, icon, error, multiline, numberOfLines, style, editable = true }: PropsChamp) => {
  const [show, setShow] = useState(false);
  return (
    <View style={[s.inputContainer, style]}>
      {label ? <Text style={s.inputLabel}>{label}</Text> : null}
      <View style={[s.inputWrapper, error ? { borderColor: Colors.error } : {}, !editable ? { backgroundColor: '#F5F5F5' } : {}]}>
        {icon ? <Ionicons name={icon as any} size={20} color={Colors.text.secondary} style={{ marginRight: 8 }} /> : null}
        <TextInput
          style={[s.input, multiline ? { height: (numberOfLines ?? 4) * 22, textAlignVertical: 'top' } : {}]}
          placeholder={placeholder} placeholderTextColor={Colors.text.light}
          value={value} onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !show}
          keyboardType={keyboardType} multiline={multiline} editable={editable}
        />
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setShow(!show)}>
            <Ionicons name={show ? 'eye-off' : 'eye'} size={20} color={Colors.text.light} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={s.inputError}>{error}</Text> : null}
    </View>
  );
};

// ─── BADGE ───────────────────────────────────────────────────────────────────
export const Badge = ({ label, color = Colors.primary, textColor = Colors.white }: { label: string; color?: string; textColor?: string }) => (
  <View style={[s.badge, { backgroundColor: color }]}>
    <Text style={[s.badgeText, { color: textColor }]}>{label}</Text>
  </View>
);

// ─── PUCE ────────────────────────────────────────────────────────────────────
export const Chip = ({ label, selected, onPress, icon }: { label: string; selected?: boolean; onPress?: () => void; icon?: string }) => (
  <TouchableOpacity
    style={[s.chip, selected ? { backgroundColor: Colors.primary, borderColor: Colors.primary } : {}]}
    onPress={onPress} activeOpacity={0.7}
  >
    {icon ? <Ionicons name={icon as any} size={14} color={selected ? Colors.white : Colors.text.secondary} style={{ marginRight: 4 }} /> : null}
    <Text style={[s.chipText, selected ? { color: Colors.white } : {}]}>{label}</Text>
  </TouchableOpacity>
);

// ─── AVATAR ──────────────────────────────────────────────────────────────────
export const Avatar = ({ uri, name, size = 40 }: { uri?: string; name?: string; size?: number }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  return uri
    ? <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
    : (
      <View style={[s.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={[s.avatarText, { fontSize: size / 3 }]}>{initials}</Text>
      </View>
    );
};

// ─── ETOILES DE NOTE ─────────────────────────────────────────────────────────
export const RatingStars = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Ionicons key={i}
        name={i <= Math.floor(rating) ? 'star' : i - 0.5 <= rating ? 'star-half' : 'star-outline'}
        size={size} color={Colors.accent}
      />
    ))}
  </View>
);

// ─── CARTE ANNONCE ───────────────────────────────────────────────────────────
interface PropsCarteAnnonce {
  item: any;
  onPress: () => void;
  onFavorite: () => void;
  isFav: boolean;
  compact?: boolean;
}
export const ListingCard = ({ item, onPress, onFavorite, isFav, compact }: PropsCarteAnnonce) => {
  const disponible = item.status === 'available' || item.statut === 'disponible';
  const estVente = item.typeTransaction === 'vente';
  return (
    <TouchableOpacity style={[s.card, compact ? s.cardCompact : {}, Shadows.md]} onPress={onPress} activeOpacity={0.9}>
      <View style={[s.cardImg, compact ? s.cardImgCompact : {}]}>
        <Image source={{ uri: item.images[0] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        <View style={s.cardImgOverlay}>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Badge label={disponible ? 'Disponible' : 'Occupée'} color={disponible ? Colors.success : Colors.error} />
            <Badge label={estVente ? 'Vente' : 'Location'} color={estVente ? Colors.accent : Colors.secondary} textColor={estVente ? Colors.black : Colors.white} />
          </View>
          <TouchableOpacity onPress={onFavorite} style={s.favBtn}>
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? '#FF4757' : Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={s.cardBody}>
        <Text style={s.cardTitle} numberOfLines={1}>{item.title || item.titre}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <Ionicons name="location-outline" size={13} color={Colors.secondary} />
          <Text style={s.cardLoc} numberOfLines={1}>{item.location || item.localisation}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text style={s.cardPrice}>{(item.price || item.prix).toLocaleString()} FCFA</Text>
            <Text style={s.cardPriceSub}>{estVente ? '' : '/mois'}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="star" size={13} color={Colors.accent} />
            <Text style={s.cardRating}>{item.rating || item.note}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── EN-TETE DE SECTION ──────────────────────────────────────────────────────
export const SectionHeader = ({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) => (
  <View style={s.sectionHeader}>
    <Text style={s.sectionTitle}>{title}</Text>
    {actionLabel ? <TouchableOpacity onPress={onAction}><Text style={s.sectionAction}>{actionLabel}</Text></TouchableOpacity> : null}
  </View>
);

// ─── ETAT VIDE ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, description, actionLabel, onAction }: { icon?: string; title: string; description?: string; actionLabel?: string; onAction?: () => void }) => (
  <View style={s.empty}>
    <View style={s.emptyIcon}>
      <Ionicons name={(icon ?? 'search-outline') as any} size={44} color={Colors.primary} />
    </View>
    <Text style={s.emptyTitle}>{title}</Text>
    {description ? <Text style={s.emptyDesc}>{description}</Text> : null}
    {actionLabel ? <Button title={actionLabel} onPress={onAction!} style={{ marginTop: 20 }} /> : null}
  </View>
);

// ─── CARTE STATISTIQUE ───────────────────────────────────────────────────────
export const StatsCard = ({ icon, label, value, color = Colors.primary }: { icon: string; label: string; value: string | number; color?: string }) => (
  <View style={[s.statsCard, Shadows.sm]}>
    <View style={[s.statsIcon, { backgroundColor: color + '22' }]}>
      <Ionicons name={icon as any} size={22} color={color} />
    </View>
    <Text style={[s.statsValue, { color }]}>{value}</Text>
    <Text style={s.statsLabel}>{label}</Text>
  </View>
);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  btn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: BorderRadius.lg, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
  inputContainer: { marginBottom: Spacing.base },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colors.text.primary, marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: 14, backgroundColor: Colors.white, minHeight: 52 },
  input: { flex: 1, fontSize: 15, color: Colors.text.primary, paddingVertical: 12 },
  inputError: { fontSize: 12, color: Colors.error, marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  badgeText: { fontSize: 11, fontWeight: '700' },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white, marginRight: 8 },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.text.secondary },
  avatarFallback: { backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.white, fontWeight: '700' },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, marginBottom: Spacing.base, overflow: 'hidden' },
  cardCompact: { width: 220, marginRight: Spacing.md, marginBottom: 0 },
  cardImg: { height: 180, position: 'relative' },
  cardImgCompact: { height: 150 },
  cardImgOverlay: { position: 'absolute', top: 10, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  favBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: Spacing.md },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text.primary, marginBottom: 4 },
  cardLoc: { fontSize: 12, color: Colors.text.secondary, flex: 1 },
  cardPrice: { fontSize: 17, fontWeight: '800', color: Colors.primary },
  cardPriceSub: { fontSize: 10, color: Colors.text.light },
  cardRating: { fontSize: 13, fontWeight: '600', color: Colors.text.primary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text.primary },
  sectionAction: { fontSize: 13, color: Colors.secondary, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingVertical: 60 },
  emptyIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.primary + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text.primary, textAlign: 'center', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: Colors.text.secondary, textAlign: 'center', lineHeight: 22 },
  statsCard: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 14, alignItems: 'center' },
  statsIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statsValue: { fontSize: 22, fontWeight: '800' },
  statsLabel: { fontSize: 11, color: Colors.text.secondary, textAlign: 'center', marginTop: 2 },
});

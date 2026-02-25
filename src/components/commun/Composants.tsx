import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  TextInput, ActivityIndicator, ViewStyle, TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Espacement, RayonBordure, Ombres } from '../../theme/theme';
import { Bien } from '../../types/modeles';

// ─── BOUTON ─────────────────────────────────────────────────────────────────
type VarianteBouton = 'primaire' | 'secondaire' | 'accent' | 'contour' | 'fantome' | 'danger';

interface PropsBouton {
  titre: string;
  onPress: () => void;
  variante?: VarianteBouton;
  style?: ViewStyle;
  styleTexte?: TextStyle;
  desactive?: boolean;
  chargement?: boolean;
  icone?: string;
}

export const Bouton = ({ titre, onPress, variante = 'primaire', style, styleTexte, desactive, chargement, icone }: PropsBouton) => {
  const carte: Record<VarianteBouton, { bg: string; texte: string; bordure: string }> = {
    primaire:   { bg: Couleurs.primaire,    texte: Couleurs.blanc, bordure: Couleurs.primaire },
    secondaire: { bg: Couleurs.secondaire,  texte: Couleurs.blanc, bordure: Couleurs.secondaire },
    accent:     { bg: Couleurs.accent,      texte: Couleurs.noir,  bordure: Couleurs.accent },
    contour:    { bg: 'transparent',        texte: Couleurs.primaire, bordure: Couleurs.primaire },
    fantome:    { bg: 'transparent',        texte: Couleurs.primaire, bordure: 'transparent' },
    danger:     { bg: Couleurs.erreur,      texte: Couleurs.blanc, bordure: Couleurs.erreur },
  };
  const v = carte[variante];
  return (
    <TouchableOpacity
      style={[s.bouton, { backgroundColor: v.bg, borderColor: v.bordure }, desactive && { opacity: 0.5 }, style]}
      onPress={onPress}
      disabled={desactive || chargement}
      activeOpacity={0.8}
    >
      {chargement ? (
        <ActivityIndicator color={v.texte} size="small" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icone ? <Ionicons name={icone as any} size={18} color={v.texte} /> : null}
          <Text style={[s.texteBouton, { color: v.texte }, styleTexte]}>{titre}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Alias anglais
export const Button = (props: PropsBouton & { title?: string; disabled?: boolean; loading?: boolean; icon?: string }) => (
  <Bouton
    titre={props.title ?? props.titre}
    onPress={props.onPress}
    variante={props.variante as any}
    style={props.style}
    desactive={props.disabled ?? props.desactive}
    chargement={props.loading ?? props.chargement}
    icone={props.icon ?? props.icone}
  />
);

// ─── CHAMP DE SAISIE ─────────────────────────────────────────────────────────
interface PropsChamp {
  etiquette?: string;
  placeholder?: string;
  valeur: string;
  onChangerTexte: (v: string) => void;
  motDePasse?: boolean;
  clavier?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  icone?: string;
  erreur?: string;
  multiLigne?: boolean;
  nombreLignes?: number;
  style?: ViewStyle;
  modifiable?: boolean;
}

export const ChampSaisie = ({ etiquette, placeholder, valeur, onChangerTexte, motDePasse, clavier, icone, erreur, multiLigne, nombreLignes, style, modifiable = true }: PropsChamp) => {
  const [afficher, setAfficher] = useState(false);
  return (
    <View style={[s.conteneurChamp, style]}>
      {etiquette ? <Text style={s.etiquetteChamp}>{etiquette}</Text> : null}
      <View style={[s.enveloppeChamp, erreur ? { borderColor: Couleurs.erreur } : {}, !modifiable ? { backgroundColor: '#F5F5F5' } : {}]}>
        {icone ? <Ionicons name={icone as any} size={20} color={Couleurs.texte.secondaire} style={{ marginRight: 8 }} /> : null}
        <TextInput
          style={[s.champTexte, multiLigne ? { height: (nombreLignes ?? 4) * 22, textAlignVertical: 'top' } : {}]}
          placeholder={placeholder}
          placeholderTextColor={Couleurs.texte.clair}
          value={valeur}
          onChangeText={onChangerTexte}
          secureTextEntry={motDePasse && !afficher}
          keyboardType={clavier}
          multiline={multiLigne}
          editable={modifiable}
        />
        {motDePasse ? (
          <TouchableOpacity onPress={() => setAfficher(!afficher)}>
            <Ionicons name={afficher ? 'eye-off' : 'eye'} size={20} color={Couleurs.texte.clair} />
          </TouchableOpacity>
        ) : null}
      </View>
      {erreur ? <Text style={s.erreurChamp}>{erreur}</Text> : null}
    </View>
  );
};

// Alias anglais
export const Input = (props: any) => (
  <ChampSaisie
    etiquette={props.label}
    placeholder={props.placeholder}
    valeur={props.value}
    onChangerTexte={props.onChangeText}
    motDePasse={props.secureTextEntry}
    clavier={props.keyboardType}
    icone={props.icon}
    erreur={props.error}
    multiLigne={props.multiline}
    nombreLignes={props.numberOfLines}
    style={props.style}
    modifiable={props.editable}
  />
);

// ─── BADGE ───────────────────────────────────────────────────────────────────
interface PropsBadge { etiquette: string; couleur?: string; couleurTexte?: string; }
export const Badge = ({ etiquette, couleur = Couleurs.primaire, couleurTexte = Couleurs.blanc }: PropsBadge) => (
  <View style={[s.badge, { backgroundColor: couleur }]}>
    <Text style={[s.texteBadge, { color: couleurTexte }]}>{etiquette}</Text>
  </View>
);

// ─── PUCE ─────────────────────────────────────────────────────────────────────
interface PropsPuce { etiquette: string; selectionnee?: boolean; onPress?: () => void; icone?: string; }
export const Puce = ({ etiquette, selectionnee, onPress, icone }: PropsPuce) => (
  <TouchableOpacity
    style={[s.puce, selectionnee ? { backgroundColor: Couleurs.primaire, borderColor: Couleurs.primaire } : {}]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {icone ? <Ionicons name={icone as any} size={14} color={selectionnee ? Couleurs.blanc : Couleurs.texte.secondaire} style={{ marginRight: 4 }} /> : null}
    <Text style={[s.textePuce, selectionnee ? { color: Couleurs.blanc } : {}]}>{etiquette}</Text>
  </TouchableOpacity>
);

// Alias anglais
export const Chip = (props: any) => <Puce etiquette={props.label} selectionnee={props.selected} onPress={props.onPress} icone={props.icon} />;

// ─── AVATAR ──────────────────────────────────────────────────────────────────
interface PropsAvatar { uri?: string; nom?: string; taille?: number; }
export const Avatar = ({ uri, nom, taille = 40 }: PropsAvatar) => {
  const initiales = nom ? nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  return uri
    ? <Image source={{ uri }} style={{ width: taille, height: taille, borderRadius: taille / 2 }} />
    : (
      <View style={[s.avatarSecours, { width: taille, height: taille, borderRadius: taille / 2 }]}>
        <Text style={[s.texteAvatar, { fontSize: taille / 3 }]}>{initiales}</Text>
      </View>
    );
};

// ─── ÉTOILES DE NOTE ─────────────────────────────────────────────────────────
interface PropsEtoiles { note: number; taille?: number; }
export const EtoilesNote = ({ note, taille = 16 }: PropsEtoiles) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Ionicons
        key={i}
        name={i <= Math.floor(note) ? 'star' : i - 0.5 <= note ? 'star-half' : 'star-outline'}
        size={taille}
        color={Couleurs.accent}
      />
    ))}
  </View>
);

// Alias anglais
export const RatingStars = EtoilesNote;

// ─── CARTE ANNONCE ─────────────────────────────────────────────────────────────
interface PropsCarteAnnonce {
  bien: Bien;
  onPress: () => void;
  onFavori: () => void;
  estFavori: boolean;
  compact?: boolean;
}
export const CarteAnnonce = ({ bien, onPress, onFavori, estFavori: fav, compact }: PropsCarteAnnonce) => {
  const disponible = bien.statut === 'disponible';
  const etiquetteStatut = bien.typeTransaction === 'vente' ? 'À vendre' : disponible ? 'Disponible' : 'Occupée';
  const couleurStatut = bien.typeTransaction === 'vente' ? Couleurs.secondaire : disponible ? Couleurs.succes : Couleurs.erreur;
  const labelPrix = bien.typeTransaction === 'vente' 
    ? `${bien.prix.toLocaleString()} FCFA` 
    : `${bien.prix.toLocaleString()} FCFA/mois`;

  return (
    <TouchableOpacity
      style={[s.carte, compact ? s.carteCompact : {}, Ombres.md]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[s.imageCarte, compact ? s.imageCarteCompact : {}]}>
        <Image source={{ uri: bien.images[0] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        <View style={s.superpositionImage}>
          <Badge etiquette={etiquetteStatut} couleur={couleurStatut} />
          <TouchableOpacity onPress={onFavori} style={s.boutonFavori}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? Couleurs.erreur : Couleurs.blanc} />
          </TouchableOpacity>
        </View>
        {bien.videos && bien.videos.length > 0 && (
          <View style={s.indicateurVideo}>
            <Ionicons name="videocam" size={12} color={Couleurs.blanc} />
          </View>
        )}
      </View>
      <View style={s.corpsCarte}>
        <Text style={s.titreCarte} numberOfLines={1}>{bien.titre}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <Ionicons name="location-outline" size={13} color={Couleurs.secondaire} />
          <Text style={s.localisationCarte} numberOfLines={1}>{bien.localisation}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Text style={s.prixCarte}>{labelPrix}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="star" size={13} color={Couleurs.accent} />
            <Text style={s.noteCarte}>{bien.note}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Alias anglais
export const ListingCard = (props: any) => (
  <CarteAnnonce
    bien={props.item}
    onPress={props.onPress}
    onFavori={props.onFavorite}
    estFavori={props.isFav}
    compact={props.compact}
  />
);

// ─── EN-TÊTE DE SECTION ──────────────────────────────────────────────────────
interface PropsEnTetSection { titre: string; etiquetteAction?: string; onAction?: () => void; }
export const EnTeteSection = ({ titre, etiquetteAction, onAction }: PropsEnTetSection) => (
  <View style={s.enTeteSection}>
    <Text style={s.titreSection}>{titre}</Text>
    {etiquetteAction ? (
      <TouchableOpacity onPress={onAction}>
        <Text style={s.actionSection}>{etiquetteAction}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

export const SectionHeader = (props: any) => <EnTeteSection titre={props.title} etiquetteAction={props.actionLabel} onAction={props.onAction} />;

// ─── ÉTAT VIDE ─────────────────────────────────────────────────────────────
interface PropsEtatVide { icone?: string; titre: string; description?: string; etiquetteAction?: string; onAction?: () => void; }
export const EtatVide = ({ icone, titre, description, etiquetteAction, onAction }: PropsEtatVide) => (
  <View style={s.vide}>
    <View style={s.iconeVide}>
      <Ionicons name={(icone ?? 'search-outline') as any} size={44} color={Couleurs.primaire} />
    </View>
    <Text style={s.titreVide}>{titre}</Text>
    {description ? <Text style={s.descriptionVide}>{description}</Text> : null}
    {etiquetteAction ? <Bouton titre={etiquetteAction} onPress={onAction!} style={{ marginTop: 20 }} /> : null}
  </View>
);

export const EmptyState = (props: any) => <EtatVide icone={props.icon} titre={props.title} description={props.description} etiquetteAction={props.actionLabel} onAction={props.onAction} />;

// ─── CARTE STATISTIQUE ───────────────────────────────────────────────────────
interface PropsCarteStats { icone: string; etiquette: string; valeur: string | number; couleur?: string; }
export const CarteStats = ({ icone, etiquette, valeur, couleur = Couleurs.primaire }: PropsCarteStats) => (
  <View style={[s.carteStats, Ombres.sm]}>
    <View style={[s.iconeStats, { backgroundColor: couleur + '22' }]}>
      <Ionicons name={icone as any} size={22} color={couleur} />
    </View>
    <Text style={[s.valeurStats, { color: couleur }]}>{valeur}</Text>
    <Text style={s.etiquetteStats}>{etiquette}</Text>
  </View>
);

export const StatsCard = (props: any) => <CarteStats icone={props.icon} etiquette={props.label} valeur={props.value} couleur={props.color} />;

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  bouton: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: RayonBordure.lg, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  texteBouton: { fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
  conteneurChamp: { marginBottom: Espacement.base },
  etiquetteChamp: { fontSize: 13, fontWeight: '600', color: Couleurs.texte.primaire, marginBottom: 6 },
  enveloppeChamp: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Couleurs.bordure, borderRadius: RayonBordure.md, paddingHorizontal: 14, backgroundColor: Couleurs.blanc, minHeight: 52 },
  champTexte: { flex: 1, fontSize: 15, color: Couleurs.texte.primaire, paddingVertical: 12 },
  erreurChamp: { fontSize: 12, color: Couleurs.erreur, marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RayonBordure.complet },
  texteBadge: { fontSize: 11, fontWeight: '700' },
  puce: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: RayonBordure.complet, borderWidth: 1.5, borderColor: Couleurs.bordure, backgroundColor: Couleurs.blanc, marginRight: 8 },
  textePuce: { fontSize: 13, fontWeight: '600', color: Couleurs.texte.secondaire },
  avatarSecours: { backgroundColor: Couleurs.primaire, alignItems: 'center', justifyContent: 'center' },
  texteAvatar: { color: Couleurs.blanc, fontWeight: '700' },
  carte: { backgroundColor: Couleurs.blanc, borderRadius: RayonBordure.xl, marginBottom: Espacement.base, overflow: 'hidden' },
  carteCompact: { width: 220, marginRight: Espacement.md, marginBottom: 0 },
  imageCarte: { height: 180, position: 'relative' },
  imageCarteCompact: { height: 150 },
  superpositionImage: { position: 'absolute', top: 10, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  boutonFavori: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  indicateurVideo: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, padding: 4 },
  corpsCarte: { padding: Espacement.md },
  titreCarte: { fontSize: 15, fontWeight: '700', color: Couleurs.texte.primaire, marginBottom: 4 },
  localisationCarte: { fontSize: 12, color: Couleurs.texte.secondaire, flex: 1 },
  prixCarte: { fontSize: 15, fontWeight: '800', color: Couleurs.primaire },
  noteCarte: { fontSize: 13, fontWeight: '600', color: Couleurs.texte.primaire },
  enTeteSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titreSection: { fontSize: 17, fontWeight: '700', color: Couleurs.texte.primaire },
  actionSection: { fontSize: 13, color: Couleurs.secondaire, fontWeight: '600' },
  vide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingVertical: 60 },
  iconeVide: { width: 90, height: 90, borderRadius: 45, backgroundColor: Couleurs.primaire + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  titreVide: { fontSize: 18, fontWeight: '700', color: Couleurs.texte.primaire, textAlign: 'center', marginBottom: 8 },
  descriptionVide: { fontSize: 14, color: Couleurs.texte.secondaire, textAlign: 'center', lineHeight: 22 },
  carteStats: { flex: 1, backgroundColor: Couleurs.blanc, borderRadius: RayonBordure.lg, padding: 14, alignItems: 'center' },
  iconeStats: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  valeurStats: { fontSize: 22, fontWeight: '800' },
  etiquetteStats: { fontSize: 11, color: Couleurs.texte.secondaire, textAlign: 'center', marginTop: 2 },
});

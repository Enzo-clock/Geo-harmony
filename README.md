# 🎵 Geo-Harmony

Une application web interactive explorant la **fusion entre géométrie et musique**. Visualisez les notes musicales en tant que points sur un cercle chromatique, créez des polygones en reliant les notes, et écoutez les accords harmoniques qu'ils génèrent.

## 🎯 Fonctionnalités

- **🎹 Clavier interactif** : 12 notes de la gamme chromatique prêtes à être jouées
- **🔊 Synthèse audio Web Audio API** : Génération en temps réel de sons musicaux avec enveloppe ADSR
- **🎨 Mode Polygone** : Reliez les notes pour créer des formes géométriques et écoutez les accords résultants
- **🌈 Thème couleur dynamique** : Chaque polygone se voit attribuer automatiquement une couleur unique (6 thèmes disponibles)
- **📐 Visualisation géométrique** : Les notes sont disposées en cercle chromatique pour une meilleure compréhension de la théorie musicale
- **🎭 Modes interactifs** : Basculez entre le mode de lecture simple et le mode de composition polygonale

## 🚀 Démarrage rapide

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone https://github.com/username/geo-harmony.git
cd geo-harmony

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

### Build pour la production

```bash
npm run build
```

## 🛠️ Stack technologique

- **React 19** : Gestion de l'état et composants réactifs
- **Vite** : Build rapide et HMR (Hot Module Replacement)
- **Web Audio API** : Synthèse audio en temps réel
- **CSS3** : Animations et visualisations
- **ESLint** : Qualité du code

## 📚 Comment utiliser

1. **Mode Normal** : Cliquez sur les notes pour les jouer individuellement
2. **Mode Polygon** : 
   - Sélectionnez le mode polygon
   - Cliquez sur les notes pour créer un polygone
   - Fermez le polygone en cliquant de nouveau sur la première note
   - Écoutez l'accord généré par votre polygone
3. **Gestion des polygones** : Sélectionnez, écoutez ou supprimez les polygones créés

## 🎓 Concepts musicaux

L'application illustre :
- Les **fréquences** des notes (A4=440Hz comme référence)
- La **circularité** du système tonal
- Les **intervalles harmoniques** entre les notes
- La **synthèse des accords** par superposition de fréquences

## 🔄 Fonctionnalités en développement

- Mode arpège (jouer les notes du polygone en séquence)
- Gestion du volume global
- Sélection de différents instruments/timbres
- Cercle microtonale (notes au-delà de la gamme chromatique)
- Enregistrement et partage des compositions

## 📝 Notes de développement

Voir [notes.md](notes.md) pour les idées de futures fonctionnalités et améliorations.

## 📄 Licence

Ce projet est fourni à titre d'exemple pédagogique.

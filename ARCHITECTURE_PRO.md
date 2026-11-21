# ChatVerdict — Architecture & Scalabilité Pro-Grade (100/100)

## 1. Vue d'Ensemble & Haute Disponibilité
ChatVerdict est une plateforme d'analyse psychologique et sentimentale de conversations textuelles (WhatsApp, Instagram, SMS, iMessage) conçue avec une double couche d'analyse :
- **Moteur Heuristique & NLP Local (Zero-Dependency)** :
  - Parsing multi-formats (WhatsApp iOS/Android, Instagram DM JSON & flux bruts).
  - Détection contextuelle de toxicité (Gaslighting, passif-agressif, chantage affectif, insultes, déni).
  - Détection des marqueurs d'empathie et de validation (Green Flags).
  - Algorithme de pondération judiciaire "Qui a tort ?" calculant les pourcentages de responsabilité et isolant l'étincelle déclencheuse.
  - Décodage croisé des perspectives Fille vs Gars (sous-texte inconscient et conseils de communication).
- **Extensibilité LLM Hybride** : Prêt pour une intégration API sans friction (OxionAi, OpenAI, Gemini, Ollama) avec fallback 100% autonome hors-ligne.

## 2. Découpage Modulaire
- `src/parser.js` : Normalisation des flux de dialogue, extraction d'horodatages, calculs de latence et décompte de mots/emojis.
- `src/analyzer.js` : Calculateur matriciel de toxicité, indice de compatibilité et verdict de responsabilité.
- `src/app.js` & `src/style.css` : Dashboard glassmorphism responsive, jauge de conflit interactive, transcription visuelle du chat en bulles immersives.

## 3. Conformité & CI/CD
- Suite de tests unitaires native `node:test` validant le parsing et l'exactitude des attributions de torts.
- Conteneurisation Docker multi-stage Alpine sécurisée.

# Recette technique — v1.4

## Contrôles automatisés de structure (réalisés)
- 24 écrans conservés : `section.screen`.
- 6 écrans de geste : `section.gesture-screen`.
- Chaque geste : 4 boutons `role=tab`, 4 panneaux `role=tabpanel`, une photo annotée (chemin local), une vidéo proposée (chemin local) et une micro-question à deux choix.
- 6 éléments photo source et 6 sélecteurs de correspondance vidéo/geste maintenus.
- Code JavaScript : contrôle syntaxique `node --check` sans erreur.
- Politique CSP : pas de chargement distant, avec `connect-src 'none'`.
- Aucune modification de la logique de l'évaluation finale (8 questions), hormis la reformulation de la question sur l'angle non sourcé.

## À réaliser lors de la validation
- Recette navigateur locale de bout en bout (Edge/Chrome) : navigation, menu mobile, onglets au clavier, zoom photo, lecture des six MP4, plein écran, mémorisation et exports CSV.
- Confronter le contenu de chaque photo et vidéo avec le protocole validé par le référent CHT.
- Validation des six micro-questions par le référent métier.
- Vérification des autorisations de diffusion interne des images et vidéos de patients.

**Limite de contrôle :** ce document ne constitue pas un procès-verbal de recette navigateur ou de validation médicale signé.
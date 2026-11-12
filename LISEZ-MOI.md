# Massage abdominal en néonatologie — v1.4 (validation interne CHT)

**Statut : prototype à valider. Ne constitue pas un protocole clinique approuvé.**

## Démarrage local
1. Extraire l'intégralité du ZIP sur un ordinateur ou espace local autorisé par le CHT.
2. Ouvrir `index.html` dans un navigateur compatible (Edge/Chrome). Pour Windows, `OUVRIR-LE-SITE.cmd` effectue l'ouverture.
3. Depuis le menu « Les six gestes », parcourir les six écrans. Chacun comporte quatre temps : **Découvrir → Observer → Vigilances → Vérifier**.
4. Les réponses d'entraînement aux six gestes n'entrent **pas** dans le score de l'évaluation finale de huit questions.
5. Faire vérifier chaque correspondance vidéo/geste dans le menu « Médias » ; exporter le fichier CSV de correspondance puis les avis par écran.

## Changement v1.4
- Refonte des six écrans de gestes en quatre temps explicites ; onglets accessibles au clavier et boutons de progression.
- Six micro-questions formatives documentées (protocole CHT, pages 3, 4, 11, 15 ; autres précisions héritées de v1.3 signalées comme provisoires).
- Conservation : 24 écrans, navigation, plein écran, progression locale, évaluation finale de huit questions, avis et export CSV, médias CHT locaux.
- Retrait de l'évaluation finale d'une valeur d'angle de 45° **non étayée par le PDF fourni**. Une mention d'arbitrage métier reste visible dans le contenu associé au bassin.

## Médias — confidentialité
Le **ZIP local complet** contient les six fichiers MP4 optimisés ainsi que 15 extraits WebP issus du protocole CHT. Il est réservé aux personnes autorisées. Les originaux sont conservés sur Drive dans le coffre `Obsidian CHT / 02_Corpus_source / 01_Neonatologie / Massage_abdominal / Videos_originales_CHT`.

**La branche GitHub contient uniquement le code et les fichiers techniques.** Elle ne doit pas héberger les photographies ou vidéos du CHT. Le code seul affiche des messages explicites lorsque les ressources locales sont absentes. Aucune vidéo n'est publiée sur Internet, aucun site public n'est déployé. Le caractère privé d'un dépôt ne remplace pas les règles de confidentialité propres au CHT.

## Validation restant à obtenir
- Confirmation clinique des six associations vidéo–geste ; précision des photographies de détail non légendées.
- Relecture du contenu médical, indications et exclusions, techniques et pressions, et du schéma de conduite à tenir de la page 16.
- Vérification de l'usage des médias et des autorisations par les responsables CHT.
- Recette sur un poste réel CHT, y compris les contenus locaux et les navigateurs utilisés par le service.
- Puis, si validé, préparation de l'export SCORM et essai Moodle (non inclus dans v1.4).

## Traçabilité
- `matrice_correspondance_a_valider.csv` : correspondances proposées et non certifiées.
- `inventaire_medias.csv` et `inventaire_photos_source.csv` : inventaires des sources.
- `RECETTE_V1_4.md` : contrôles statiques exécutés et points en attente.

Source : *Protocole massage abdominal chez le prématuré et le nouveau-né à terme* — BRIEDA Marion, LESSIRE Véronique, LAVALLEE Lucie. Conservation du circuit interne CHT uniquement.
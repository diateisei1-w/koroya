# KOROYA — Talent Meets Opportunity (Phase 1)

Plateforme web moderne, rapide et fiable pour la jeunesse africaine, permettant de découvrir des opportunités d'excellence vérifiées : **bourses d'études supérieures (MESRS CI & CAMES)**, **stages rémunérés**, **emplois qualifiés**, **financements d'amorçage en FCFA (XOF)**, formations et mobilité académique intra-africaine et internationale.

- **Marché de lancement** : Côte d’Ivoire (Abidjan, Yamoussoukro, Bouaké, Korhogo, San-Pedro).
- **Extension future** : Sénégal, Bénin, Togo, Cameroun, Ghana, Nigeria.

---

## 🚀 Fonctionnalités Implémentées en Phase 1

1. **Navigation Responsive & Menu Mobile**
   - Logo KOROYA avec palette *Deep Navy* (`#0A192F`), *Blanc*, et accents *Vert Émeraude* (`#10B981`).
   - Liens directs : Découvrir, Bourses MESRS & CAMES, Emplois & Stages, Financements en FCFA, Guides & Référentiels.
   - Menu tiroir mobile optimisé pour téléphones Android d'entrée de gamme.

2. **Page d'Accueil Institutionnelle**
   - Titre principal : « *Votre prochaine opportunité commence ici.* »
   - Barre de recherche instantanée avec suggestions rapides.
   - **Recherches Récentes (Local Storage)** : Conservation automatique des 3 dernières requêtes uniques dans le navigateur (`koroya_recent_searches`) avec déclenchement en 1 clic et option pour effacer l'historique.
   - Raccourcis par catégories et boutons d'action : « *Explorer les opportunités* » et « *Rejoindre KOROYA* ».
   - Section Sélection à la une (opportunités prioritaires vérifiées).
   - Section Clôture imminente (décompte dynamique des jours restants avant expiration).
   - Section Étudiants & Jeunes diplômés (Bourses nationales MESRS et sous-régionales CAMES).
   - Section Financements & Subventions libellés en FCFA (BOAD, AEJ, dotations non remboursables).
   - Section Guides & Référentiels Officiels (accréditation des filières, équivalences de diplômes).
   - Section Témoignages de démonstration (explicitement étiquetés *DEMO*).
   - Formulaire Newsletter avec validation regex d'email et gestion des états d'erreur/succès.
   - Pied de page institutionnel complet (mentions légales, traçabilité des données, liens officiels).

3. **Moteur de Recherche & Filtres Multi-Critères (Explore)**
   - Filtre par catégorie (Bourses, Stages, Emplois, Financements, Concours, Mobilité, Formations).
   - Filtre par pays éligible (Côte d’Ivoire, Sénégal, Cameroun, Bénin, Togo).
   - Filtre par niveau d’études (Bac, Bac+2, Bac+3 Licence, Bac+5 Master, Doctorat).
   - Filtre par format (Présentiel, Hybride, Télétravail).
   - Filtre par échéance (&lt; 15 jours, &lt; 30 jours, &lt; 60 jours).
   - Filtre par rémunération (Rémunéré / Financé uniquement).
   - Tri par date limite croissante, décroissante ou pertinence.
   - Bouton d'effacement rapide des filtres avec indicateur de filtres actifs.
   - Pagination progressive (« Charger plus »).

4. **Fiche Détail Complète (Modal)**
   - Montant garanti en FCFA et modalité de travail.
   - Organisme responsable et statut de vérification documentaire avec source officielle et date.
   - Checklist détaillée des critères d'éligibilité.
   - Liste des pièces requises pour le dossier de candidature.
   - Avantages et prises en charge (allocations, billets de voyage, assurance).
   - Étapes de la procédure de candidature.
   - Bouton de candidature externe sécurisé (`rel="noopener noreferrer"`).
   - Enregistrement en favoris et partage natif ou copie de lien.

5. **Système de Favoris (Local Storage)**
   - Conservation locale des opportunités sélectionnées sous la clé `koroya_saved_opportunities`.
   - Compteur en direct sur la barre de navigation.
   - Vue dédiée permettant de consulter ou de vider ses enregistrements.

---

## 🔒 Conformité aux Règles de Sécurité

- **Aucun secret dans le code** : les variables sont isolées dans `.env.example` sans valeurs réelles. `.gitignore` exclut tous les fichiers `.env*`.
- **En-têtes de sécurité dans `vercel.json`** :
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- **Liens externes protégés** : tous les liens sortants utilisent `rel="noopener noreferrer"`.
- **Interdictions respectées** : aucun `dangerouslySetInnerHTML`, aucun `eval`, aucune concaténation SQL.
- **Règles d'honnêteté** :
  - Données modèles explicitement marquées `DEMO`.
  - Date de contrôle et source officielle indiquées systématiquement.
  - Aucun faux compte ni fausse transaction.

---

## 💻 Commandes d'Exécution

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement (Port 3000)
npm run dev

# Validation TypeScript et linting
npm run lint

# Compilation pour production (Vite)
npm run build
```

---

## 📋 Rapport de Test de la Phase 1

### Ce qui a été testé et vérifié :
- Compilation TypeScript sans aucune erreur (`tsc --noEmit`).
- Build de production Vite réussi (`npm run build`).
- Sauvegarde et restitution des 3 dernières recherches dans `localStorage`.
- Sauvegarde et suppression des favoris dans `localStorage`.
- Validation regex et état de confirmation du formulaire Newsletter.
- Filtrage combiné (catégories, pays, échéances, montants FCFA, formats).
- Affichage modal des fiches détaillées et fermeture par touche ou clic extérieur.
- Liens sortants avec protection `rel="noopener noreferrer"`.
- En-têtes de sécurité configurés dans `vercel.json`.

### Ce qui n'est PAS encore testé (Prévu en Phase 2) :
- Base de données PostgreSQL / Supabase et authentification utilisateur.
- Migration des favoris locaux vers la table distante `saved_opportunities`.
- Envoi effectif d'emails transactionnels (API tierce).
- Espace d'administration et rôles utilisateurs RLS.

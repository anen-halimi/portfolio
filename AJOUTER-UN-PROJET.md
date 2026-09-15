# Ajouter un projet en quelques minutes

Le portfolio lit ses études de cas depuis `src/content.json`. Pour ajouter un sixième projet :

1. Ouvre `src/content.json`.
2. Ajoute son identifiant dans l’ordre souhaité de chaque profil (`all`, `vision`, `data`, `genai`).
3. Ajoute un objet dans le tableau `projects` en reprenant ce modèle :

```json
{
  "id": "mon-projet",
  "number": "06",
  "kind": "Domaine · Type de projet",
  "title": "Un titre court.<br>Une idée <em>forte.</em>",
  "shortTitle": "Nom lisible du projet",
  "description": "Le résultat en une phrase.",
  "tags": ["Python", "Outil", "Domaine"],
  "repo": "nom-du-depot-github",
  "file": "script_principal.py",
  "challenge": "Le problème traité et ses contraintes.",
  "approach": ["Choix technique 1.", "Choix technique 2."],
  "outcome": "Ce que le projet permet de faire.",
  "limit": "Le périmètre et les limites à connaître.",
  "pipeline": ["Entrée", "Traitement", "Sortie"]
}
```

4. Si le projet a un visuel spécifique, ajoute une branche dans `visual()` de `src/app.js`; sinon le visuel de schéma de principe peut être réutilisé.
5. Ajoute le dépôt et les limites dans `SOURCES.md` si nécessaire.
6. Regénère les fichiers et publie :

```bash
python3 build.py
git add .
git commit -m "Add project: nom du projet"
git push
```

Le bouton **Adapter à une offre** réordonnera automatiquement les projets selon l’angle sélectionné. Vérifie toujours les textes et les limites du nouveau projet avant de le partager.

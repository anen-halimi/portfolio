# Portfolio d’Anen Halimi

Ouvre **index.html** dans ton navigateur. Le portfolio fonctionne sans installation et sans connexion, avec ses illustrations, études de cas et comparateur avant/après.

## Adapter une candidature

1. Clique sur **Adapter à une offre** en bas du portfolio.
2. Colle l’offre et clique sur **Repérer les correspondances**.
3. Choisis l’angle conseillé ou un autre angle : Data & IA, Computer Vision, Data & automatisation ou IA générative.
4. Relis et adapte le titre et la présentation. Tu peux ajouter l’entreprise visée.
5. Utilise **Appliquer au portfolio**, puis **Exporter la version HTML** pour conserver une version autonome à partager ou à héberger.

L’analyse est un repérage local de mots-clés, pas un modèle d’IA ni un score de compatibilité. Elle ne valide pas les qualifications exigées. L’offre n’est ni envoyée à un service ni enregistrée dans le stockage local. Seuls les champs du profil sont sauvegardés dans le navigateur, quand celui-ci le permet.

La version exportée embarque toutes les images et tous les textes. Elle retire le panneau de personnalisation et ne recharge pas les données locales du propriétaire. Garde la version originale pour les prochaines candidatures.

## Contact et parcours

Dans l’atelier, ouvre **Compléter mes informations et mon parcours** pour ajouter l’e-mail, le nom de la startup et les missions détaillées. Le contact utilise LinkedIn tant qu’aucun e-mail n’a été renseigné.

Les durées d’expérience viennent de tes indications. Les projets et la formation viennent de GitHub et du LinkedIn public ; leur provenance est détaillée dans **SOURCES.md**.

## Version PDF

Clique sur **Mon profil en PDF**, puis choisis **Enregistrer au format PDF** dans la fenêtre d’impression. La mise en page est adaptée à une impression A4.

## Développement

Le site n’a aucune dépendance JavaScript externe. Il est généré depuis `src/index.html`, `src/styles.css`, `src/app.js` et `src/content.json`.

Après une modification :

```bash
python3 /home/anen/portfolio/build.py
```

Pour servir localement le dossier, si nécessaire :

```bash
python3 -m http.server 8080 --bind 127.0.0.1 --directory /home/anen/portfolio
```

Ouvre alors `http://127.0.0.1:8080`. Sur un site hébergé, les liens `?focus=vision`, `?focus=data` et `?focus=genai` sélectionnent un angle. Un fichier exporté conserve aussi son titre et son introduction personnalisés.

Le portfolio reste local à ce stade ; aucun changement n’a été apporté aux comptes GitHub ou LinkedIn.

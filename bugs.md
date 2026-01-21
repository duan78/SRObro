# Registre des Bugs et Défis Techniques

## 🟢 Corrigé (Session du 20 Janvier)
- **Babylon.js 8 GUI** : La majorité des imports ont été migrés vers `@babylonjs/gui`. Les erreurs de constructeur `TextBlock` sont résolues dans les composants principaux.
- **Conflit Character** : Utilisation d'alias `SharedCharacter` pour éviter les collisions avec le client Prisma.
- **Port Inconsistency** : Le client pointe désormais vers le port `3001` du serveur.
- **Missing GameLoop** : Classe restaurée et intégrée dans le `GameServer`.

## 🟡 En cours / Mineurs
- **Alchemy Panel** : Utilise des placeholders pour `ComboBox` car ce composant a des spécificités dans Babylon 8.
- **Types JSON** : Certains champs JSON de Prisma dans `QuestManager` demandent encore des casts `any`.
- **Fichiers Nul** : Toujours présents dans `temp_extraction`, à supprimer avec les privilèges administrateur si nécessaire.

## 💡 Conseils pour les développements futurs
- **Imports GUI** : Si vous créez un nouveau composant UI, importez toujours `TextBlock`, `Rectangle`, etc., depuis `@babylonjs/gui`.
- **Assets** : Le dossier `client/public/assets` est la source de vérité. Ne pas rajouter d'assets à la racine de `client/`.
- **Shared Enums** : Préférer l'utilisation des Enums `EntityType.MONSTER` plutôt que des strings "monster" pour garantir la cohérence avec la base de données.

Packages NPM installés :

├──express@5.2.1
├── mysql2@3.17.1
├── nodemon@3.1.11
└── seedrandom@3.0.5

Fichier SQL pour l'initialisation de la base de données : /data/initatedb.sql
Fichier js pour la connexion a la bdd (Si ports/mdp differents) : /data/db.js

Endpoints disponibles :
    POST    /players
    GET     /players/:id
    GET     /players
    DELETE  /players/:id

    POST    /games/:id
    GET     /games/:id
    POST    /games/:id/move
    POST    /games/:id/attack

    POST    /admin/monsters
    GET     /admin/monsters/:id

    GET     /classes

Pour le système de combat, c'est normal si certaines classes ne prennent pas de dégats au début, c'est parce que la defense supprime entièrement les dégats des monstres des étages de bas niveau.

Si jamais vous voulez des sprites afin de créer un monstre, en voici deux :

Sprite defaut : https://i.imgur.com/fwzpB9X.png
Sprite blessé : https://i.imgur.com/ZdxcJLy.png

Les monstres crées rentrent automatiquement dans le jeu, et seront spawn de manières aléatoires pour tout les joueurs y compris vous
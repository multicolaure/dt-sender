# René

Cette application permet de soumettre des demandes de travaux facilement créée via https://www.reseaux-et-canalisations.ineris.fr/ à tous les exploitants des réseaux concernés par la demande.

## Variables d'environnement

**Obligatoires** 

* `SENDER_HOST` : Hôte SMTP à utiliser pour l'envoi d'emails. Attention, il doit être sécurisé (TLS) et utiliser le port 465
* `SENDER_EMAIL` : Adresse email à utiliser pour envoyer les demandes de travaux
* `SENDER_PASSWORD` : Mot de passe associé à l'email pour le server SMTP fournit dans SENDER_HOST.

**Optionnelles**
* `DEBUG_RECIPIENT` pour envoyer à une autre adresse email que celle proposée dans la demande de travaux, afin de tester l'envoi d'emails sur une adresse que vous connaissez

## Installation pour la production

1. Compiler l'application

`yarn build`

Le résultat est déployé dans `dist`.

2. Configurez les variables d'environnements. 

Elles peuvent être placées également dans un fichier `.env` à placer dans le répertoire d'où sera lancé l'application.

3. Lancer l'application node.js : `node ./dist/back.js`


## Installation pour le développement

Après avoir cloné ce projet :

1. Créer un fichier `.env` dans `packages/back`. Vous pouvez copier le fichier `.env.reference` pour vous aider.

2. Renseignez à l'intérieur les variables d'environnement pour configurer l'envoi d'email.

3. Optionnellement, vous pouvez remplir la variable `DEBUG_RECIPIENT` pour envoyer à une autre adresse email que celle proposée dans la demande de travaux, afin de tester l'envoi d'emails sur une adresse que vous connaissez.

4. Lancer les applications (back & front) : 

* `yarn dev` : compile le back et le front en mode développement, c'est-à-dire que le front est recompilé à la volée et servit par un serveur web
* `yarn dev:front`
* `yarn dev:back`


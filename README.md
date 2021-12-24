<div align="center">
  <h1>
    <br>
    <a href=""><img src="stealing-data.png" alt="Favicon" width="200"></a>
    <br>
    HTML Scrappy
    <br>
  </h1>
</div>

<div align="center">
  <a href="#a-propos">A propos</a> •
  <a href="#installation">Installation</a> •
  <a href="#resultat">Resultat</a> •
  <a href="#exemple">Exemple</a>
</div>

# A propos

Ce programme permet de récupérer du code de page web pour le transformer en component VUE avec seulement le code CSS nécessaire pour le chemin CSS donné.

## Installation

Depuis votre terminal de commande : 

```bash
# Cloner le repertoire
$ git clone https://github.com/Andy-d-g/HTML_scrappy.git

# Aller dans le repertoire src
$ cd HTML_scrappy/src

# Installer les package
$ npm run start

# Lancer le scrapper
$ node src/scrapper <url> <selector>

# Lancer le cleaner après nettoyage manuel de l'index.html
$ node src/sanitazer

```

## Resultat

Les fichiers `index.vue` + `index.html` + `styles.css` sont générés.

## Exemple

```node src/scrapper https://bootstrapmade.com/ #header```

```node src/sanitazer```

## Contributeurs

@Andy-d-g

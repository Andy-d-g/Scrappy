<div align="center">
  <h1>
    <br>
    <a href=""><img src="stealing-data.png" alt="Favicon" width="200"></a>
    <br>
      Scrappy
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
$ git clone https://github.com/Andy-d-g/Scrappy.git

# Aller dans le repertoire src
$ cd Scrappy

# Installer les package
$ npm run start

# Lancer le scrapper
$ node src/scrapper <url> <selector>

```

## Resultat

Les fichiers ```vue``` est généré dans le dossier out/.

## Exemple

```
  node src/scrapper https://bootstrapmade.com/demo/templates/OnePage/ #header
```

## Contributeurs

@Andy-d-g

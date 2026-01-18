# Guide de Création du Projet API Node.js (CI/CD & Tests)

Ce guide détaille toutes les étapes pour recréer ce projet de zéro, incluant la configuration de l'API, les tests unitaires et le pipeline d'Intégration Continue (CI) avec GitHub Actions.

## Prérequis

- Node.js installé
- Un terminal (bash/zsh)

---

## Étape 1 : Initialisation du projet

Créez le dossier du projet et initialisez `npm`.

```bash
# Créer le dossier (si ce n'est pas déjà fait)
mkdir cicd-with-tests
cd cicd-with-tests

# Initialiser le fichier package.json par défaut
npm init
```

## Étape 2 : Installation des dépendances

Nous avons besoin d'`express` pour le serveur, et de bibliothèques de développement pour les tests et le linting.

```bash
# Dépendance de production
npm install express

# Dépendances de développement
npm install --save-dev jest supertest eslint@8
```

## Étape 3 : Création de l'arborescence

Créez la structure des dossiers requise.

Structure :

```text
.
├── src/
├── test/
├── dist/
├── .github/
│   └── workflows/
└── package.json
```

## Étape 4 : Développement de l'API

### 4.1. Créer les routes (`src/routes.js`)

Créez le fichier `src/routes.js` :

```javascript
// Permet de charger le module express
const express = require('express')
// Crée un router pour les routes de l'API
const router = express.Router()

// Route pour vérifier si l'API est fonctionnelle
router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Route pour retourner l'heure actuelle
router.get('/time', (req, res) => {
  res.json({ time: new Date().toISOString() })
})

// Exporte le router pour être utilisé dans l'application
module.exports = router
```

### 4.2. Créer l'application principale (`src/app.js`)

Créez le fichier `src/app.js`. Ce fichier sépare la logique de l'app du démarrage du serveur (pour faciliter les tests).

```javascript
const express = require('express')
const routes = require('./routes')

const app = express()

app.use('/', routes)

// Démarre le serveur uniquement si le fichier est exécuté directement
if (require.main === module) {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

module.exports = app
```

## Étape 5 : Tests Unitaires

Créez le fichier de test `test/health.test.js` pour vérifier que l'API fonctionne comme prévu.

```javascript
// Permet de tester l'API avec supertest
const request = require('supertest')
// Permet de charger l'application principale
const app = require('../src/app')

// Définit le test pour l'API Endpoints
describe('API Endpoints', () => {
  // Test pour vérifier si l'API retourne le status ok
  it('GET /health should return status ok', async () => {
    // Test la route /health avec supertest
    const res = await request(app).get('/health')
    // Vérifie que le status code est 200
    expect(res.statusCode).toEqual(200)
    // Vérifie que le body est { status: 'ok' }
    expect(res.body).toEqual({ status: 'ok' })
  })

  it('GET /time should return a valid time', async () => {
    // Test la route /time avec supertest
    const res = await request(app).get('/time')
    // Vérifie que le status code est 200
    expect(res.statusCode).toEqual(200)
    // Vérifie que le body a une propriété time
    expect(res.body).toHaveProperty('time')
    // Vérifie que le format de la date est valide
    expect(new Date(res.body.time).toISOString()).toBe(res.body.time)
  })
})
```

## Étape 6 : Configuration

### 6.1. Configuration ESLint (`.eslintrc.json`)

Créez le fichier `.eslintrc.json` à la racine :

```json
{
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true,
    "jest": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "rules": {}
}
```

### 6.2. Scripts NPM (`package.json`)

Ouvrez le fichier `package.json` et modifiez la section `"scripts"` pour inclure les commandes suivantes :

```json
  "scripts": {
    "start": "node src/app.js",// Démarre le serveur
    "lint": "eslint src test",// Lint le code
    "test": "jest"// Exécute les tests
  },
```

## Étape 7 : Pipeline CI/CD (GitHub Actions)

Créez le fichier `.github/workflows/ci.yml`. Ce script lancera automatiquement l'installation, le linter et les tests à chaque push sur la branche `main`.

On veut ici que le pipeline CI/CD soit lancé à chaque push sur la branche `main`.

```yaml
name: Node.js CI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js 20.x
        uses: actions/setup-node@v3
        with:
          node-version: 20.x
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

## Étape 8 : Vérification finale

Vous pouvez maintenant tester votre projet localement :

1.  **Linter** (Analyse du code) :

    ```bash
    npm run lint
    ```

2.  **Tests** (Exécution de Jest) :

    ```bash
    npm test
    ```

3.  **Démarrage** (Lancer le serveur) :
    ```bash
    npm start
    ```

## Étape 9 : Lancer le pipeline CI/CD

Faite un push sur la branche `main` et le pipeline CI/CD sera lancé automatiquement.

## Étape 10 : Vérifier le pipeline CI/CD

Vous pouvez vérifier le pipeline CI/CD en allant sur le repository GitHub et en cliquant sur le bouton "Actions".

## Étape 11 : Vérifier le déroulement du pipeline CI/CD

Vous pouvez vérifier les tests

## Étape 12 : Modification du code pour provoquer un échec du pipeline CI/CD

Modifiez le code de l'API pour provoquer un échec du pipeline CI/CD.

```javascript
// Modifie la route /health pour retourner un status error
router.get('/health', (req, res) => {
  res.status(500).json({ status: 'error' })
})
```

Faite un push sur la branche `main` et le pipeline CI/CD sera lancé automatiquement.

## Etape 13 : Vérifier le résultat du pipeline CI/CD

# Suite

## Etape 1: ajout d'un paramètre à la route /health

Modifiez le code de l'API pour ajouter un paramètre à la route /health qui pemet d'authentifier l'utilisateur.

```javascript
// Ajoute un paramètre à la route /health qui permet d'authentifier l'utilisateur
router.get('/health', (req, res) => {
  const { token } = req.query
  if (token !== '1234567890') {
    res.status(401).json({ status: 'error', message: 'Unauthorized' })
  }
  res.json({ status: 'ok' })
})
```

Faite un push sur la branche `main` et le pipeline CI/CD sera lancé automatiquement.

## Etape 2: On passe par une variable d'environnement pour l'authentification

Modifiez le code de l'API pour passer par une variable d'environnement pour l'authentification.

```javascript
// Ajoute un paramètre à la route /health qui permet d'authentifier l'utilisateur
router.get('/health', (req, res) => {
  const { token } = req.query
  if (token !== process.env.TOKEN) {
    res.status(401).json({ status: 'error', message: 'Unauthorized' })
  }
  res.json({ status: 'ok' })
})
```

Faite un push sur la branche `main` et le pipeline CI/CD sera lancé automatiquement.

## Etape 3: Modifier le pipeline CI/CD pour prendre en compte les variables d'environnement

Modifiez le pipeline CI/CD pour prendre en compte les variables d'environnement.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      TOKEN: 'brybry'
```

Faite un push sur la branche `main` et le pipeline CI/CD sera lancé automatiquement.

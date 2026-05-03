# Pharma Stock Manager

Mini-projet full-stack simulant un système de gestion de stock pour des pharmacies.

L’objectif est de démontrer une approche pragmatique du développement backend :

- structuration claire du code
- validation des données
- tests automatisés
- qualité et maintenabilité

---

## Contexte

Ce projet s’inspire de problématiques réelles rencontrées dans des systèmes de gestion de pharmacies :

- gestion des ruptures de stock
- suivi des dates de péremption
- fiabilité des données manipulées

Il vise à reproduire un socle technique simple mais réaliste.

---

## Stack

### Backend

- Node.js
- TypeScript
- Express
- Zod (validation)
- Vitest (tests)
- Supertest (tests API)

### Frontend

- React (à venir)
- TypeScript

---

## Fonctionnalités actuelles

- Health check API
- Création d’un médicament
- Validation des données entrantes
- Tests d’intégration API

---

## API

### Health check

GET /health

### Créer un médicament

POST /medicines

Exemple de payload :

{
"name": "Doliprane",
"stock": 100,
"threshold": 10,
"expirationDate": "2026-01-01"
}

---

## Architecture

Le backend est structuré selon une séparation claire des responsabilités :

- routes : définition des endpoints HTTP
- controllers : gestion des requêtes et réponses
- services : logique métier
- schemas : validation des données (Zod)
- types : définition des modèles

Cette organisation permet :

- une meilleure lisibilité du code
- une isolation de la logique métier
- une facilité de test
- une évolutivité du projet

---

## Tests

Les tests sont des tests d’intégration API.

Ils permettent de :

- vérifier le comportement des endpoints HTTP
- valider les règles métiers
- tester les cas invalides

Une approche paramétrée est utilisée pour couvrir plusieurs cas invalides sans duplication de code.

---

## Choix techniques

- TypeScript pour sécuriser le code et améliorer la maintenabilité
- Zod pour centraliser et rendre explicite la validation des données
- Vitest pour des tests rapides et modernes
- Supertest pour tester les endpoints HTTP sans lancer de serveur externe

Le projet privilégie une approche simple et pragmatique pour rester lisible et évolutif.

---

## Lancer le backend

cd backend  
npm install  
npm run dev

---

## Tests

cd backend  
npm run typecheck  
npm run test

---

## Améliorations possibles

- persistance des données (PostgreSQL)
- gestion des alertes :
  - stock faible
  - rupture
  - péremption proche
- ajout d’un système d’authentification
- mise en place d’une CI/CD complète
- monitoring et logs

---

## Vision produit

Dans un contexte réel, ce type de système permettrait :

- d’anticiper les ruptures de médicaments
- de réduire les pertes liées aux péremptions
- d’améliorer le suivi des patients

---

## Objectif

Ce projet a pour but de démontrer :

- une capacité à structurer un backend propre
- une approche orientée qualité (tests, validation)
- une compréhension des problématiques métier
- une logique d’amélioration continue

---

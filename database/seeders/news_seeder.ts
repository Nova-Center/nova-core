import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import News from '#models/news'

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()

    await News.createMany([
      {
        title: 'Nouveau marché bio le dimanche matin',
        excerpt:
          "Un marché de producteurs locaux s'installe sur la place centrale tous les dimanches.",
        content: `# Nouveau marché bio le dimanche matin

Notre quartier accueille un nouveau marché bio hebdomadaire ! À partir du dimanche prochain, retrouvez vos producteurs locaux sur la place centrale.

## Horaires et infos pratiques

- Tous les dimanches de 8h à 13h
- Place centrale du quartier
- Parking gratuit à proximité

## Les producteurs présents

- Légumes bio de la ferme des Quatre Saisons
- Fromages de chèvre de la famille Martin
- Miel et confitures artisanales
- Boulangerie bio
- Œufs frais de poules élevées en plein air

## Animations

Des ateliers de cuisine et des dégustations seront régulièrement organisés pour petits et grands.

Venez nombreux soutenir nos producteurs locaux et profiter de produits frais et de qualité !`,
        tags: ['marché', 'bio', 'local', 'alimentation'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Rénovation du parc municipal',
        excerpt: "Le parc sera fermé pendant deux mois pour d'importants travaux d'amélioration.",
        content: `# Rénovation du parc municipal

La mairie lance un grand projet de rénovation du parc municipal pour améliorer notre cadre de vie.

## Planning des travaux

- Début : 1er mars
- Durée : 2 mois
- Réouverture prévue : 1er mai

## Améliorations prévues

- Nouvelle aire de jeux pour enfants
- Installation de bancs et tables de pique-nique
- Création d'un parcours sportif
- Plantation de nouveaux arbres
- Rénovation des allées
- Installation d'un système d'arrosage automatique

## Accès pendant les travaux

Le parc sera totalement fermé au public pour des raisons de sécurité. Un itinéraire alternatif sera mis en place pour les piétons.`,
        tags: ['travaux', 'parc', 'rénovation', 'mairie'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Grande fête des voisins ce weekend',
        excerpt:
          'Rejoignez-nous pour un moment convivial entre voisins avec animations et buffet participatif.',
        content: `# Grande fête des voisins ce weekend

## Programme de la journée

### 11h - Ouverture
- Accueil des participants
- Installation du buffet participatif
- Début des animations pour enfants

### 12h30 - Déjeuner
- Grand buffet partagé
- Animation musicale

### 14h - Activités
- Tournoi de pétanque
- Jeux pour enfants
- Atelier jardinage
- Démonstration de danse

### 18h - Soirée
- Apéritif offert par le comité de quartier
- Concert des musiciens du quartier

## Informations pratiques

- Date : Samedi 15 juin
- Lieu : Place du marché
- Chacun apporte un plat à partager
- Prévoir ses couverts pour limiter les déchets

En cas de pluie, repli dans la salle des fêtes.`,
        tags: ['fête', 'voisins', 'animation', 'convivialité'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Nouveau service de covoiturage de quartier',
        excerpt:
          'Une application de covoiturage locale pour faciliter les déplacements entre voisins.',
        content: `# Nouveau service de covoiturage de quartier

Pour faciliter les déplacements et créer du lien entre voisins, un nouveau service de covoiturage local est lancé.

## Comment ça marche ?

1. Inscrivez-vous sur l'application
2. Indiquez vos trajets réguliers
3. Trouvez des voisins qui font le même trajet
4. Partagez vos déplacements

## Avantages

- Économies sur les frais de transport
- Réduction de l'impact environnemental
- Création de liens entre voisins
- Solution pour les personnes à mobilité réduite

## Tarifs

Service gratuit la première année grâce au soutien de la mairie.`,
        tags: ['transport', 'covoiturage', 'écologie', 'entraide'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: "Ouverture d'une nouvelle bibliothèque de rue",
        excerpt: "Une boîte à livres participative est installée près de l'école primaire.",
        content: `# Ouverture d'une nouvelle bibliothèque de rue

## Le principe

Une boîte à livres est désormais disponible près de l'école primaire. Le principe est simple :
- Prenez un livre qui vous intéresse
- Déposez ceux que vous souhaitez partager
- Profitez d'un accès gratuit à la lecture

## Règles de fonctionnement

- Livres en bon état uniquement
- Tous genres acceptés
- Pensez aux enfants (livres jeunesse bienvenus)
- Respectez la capacité de la boîte

## Entretien

Un groupe de bénévoles du quartier s'occupe de :
- Trier régulièrement les livres
- Maintenir la boîte en bon état
- Renouveler les ouvrages

Pour devenir bénévole, contactez l'association de quartier.`,
        tags: ['culture', 'livres', 'partage', 'lecture'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Collecte solidaire pour les sinistrés',
        excerpt: "Organisation d'une collecte d'urgence suite aux récentes inondations.",
        content: `# Collecte solidaire pour les sinistrés

Suite aux récentes inondations, une collecte est organisée pour aider les familles touchées.

## Besoins urgents

- Vêtements chauds
- Couvertures
- Produits d'hygiène
- Denrées non périssables
- Eau potable

## Points de collecte

- Mairie : 9h-17h
- École primaire : aux heures d'ouverture
- Supermarché local : 8h-20h

## Comment aider ?

- Faire un don matériel
- Devenir bénévole pour la collecte
- Proposer un hébergement temporaire
- Participer à la distribution

Merci de votre solidarité !`,
        tags: ['solidarité', 'entraide', 'urgence', 'collecte'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Cours de jardinage gratuits au jardin partagé',
        excerpt: 'Apprenez à cultiver vos légumes avec notre jardinier municipal.',
        content: `# Cours de jardinage gratuits au jardin partagé

## Programme des ateliers

### Mars
- Préparation du sol
- Semis de printemps
- Compostage

### Avril
- Plantation des tomates
- Entretien du potager
- Lutte naturelle contre les parasites

### Mai
- Arrosage économe
- Culture sur balcon
- Plantes aromatiques

## Informations pratiques

- Tous les samedis matin
- De 10h à 12h
- Matériel fourni
- Sur inscription (places limitées)

Repartez avec vos semis et des conseils personnalisés !`,
        tags: ['jardinage', 'nature', 'apprentissage', 'potager'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Nouveau commerce : épicerie zéro déchet',
        excerpt:
          'Une nouvelle épicerie proposant des produits en vrac ouvre ses portes dans le quartier.',
        content: `# Nouveau commerce : épicerie zéro déchet

Une nouvelle épicerie vrac "Au bon sens" ouvre ses portes dans notre quartier !

## Concept

- Produits vendus en vrac
- Contenants consignés disponibles
- Produits locaux privilégiés
- Zéro emballage jetable

## Produits proposés

- Céréales et légumineuses
- Fruits secs
- Produits d'entretien
- Cosmétiques solides
- Épices
- Thés et cafés

## Horaires

- Mardi au samedi : 9h-19h
- Dimanche : 9h-13h
- Fermé le lundi

N'oubliez pas d'apporter vos contenants !`,
        tags: ['commerce', 'écologie', 'alimentation', 'zéro-déchet'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Recherche bénévoles pour soutien scolaire',
        excerpt:
          "L'association du quartier cherche des bénévoles pour aider les élèves en difficulté.",
        content: `# Recherche bénévoles pour soutien scolaire

## Notre besoin

L'association recherche des bénévoles pour :
- Aide aux devoirs
- Soutien en mathématiques et français
- Accompagnement méthodologique
- Préparation aux examens

## Profil recherché

- Patient(e) et pédagogue
- Disponible 2h par semaine minimum
- Niveau bac minimum
- Expérience avec les enfants appréciée

## Créneaux disponibles

- Lundi et jeudi : 17h-19h
- Mercredi : 14h-16h
- Samedi : 10h-12h

Formation assurée par l'association.`,
        tags: ['bénévolat', 'éducation', 'entraide', 'jeunesse'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Alerte travaux : réfection de la rue principale',
        excerpt: 'Important chantier de voirie prévu pour le mois prochain.',
        content: `# Alerte travaux : réfection de la rue principale

## Nature des travaux

- Réfection complète de la chaussée
- Création d'une piste cyclable
- Élargissement des trottoirs
- Installation de nouveaux lampadaires LED
- Plantation d'arbres d'alignement

## Planning

- Phase 1 : 1-15 avril (portion nord)
- Phase 2 : 16-30 avril (portion sud)

## Impact circulation

- Rue barrée par tronçons
- Déviation par les rues adjacentes
- Accès riverains maintenu
- Stationnement interdit pendant les travaux

Merci de votre compréhension pour la gêne occasionnée.`,
        tags: ['travaux', 'voirie', 'circulation', 'aménagement'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
    ])

    console.log('News seeded successfully ! 📰')
  }
}

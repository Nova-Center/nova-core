import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Event from '#models/event'
import { DateTime } from 'luxon'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()

    await Event.createMany([
      {
        title: 'Vide-grenier de printemps',
        description:
          'Grand vide-grenier annuel du quartier, venez chiner et rencontrer vos voisins',
        date: DateTime.fromISO('2024-06-15T08:00:00'),
        location: 'Place du marché',
        image: 'https://picsum.photos/1000/500?random=1',
        maxParticipants: 100,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Atelier jardinage collectif',
        description: 'Apprenez à cultiver vos légumes dans notre jardin partagé',
        date: DateTime.fromISO('2024-07-01T10:00:00'),
        location: 'Jardin communautaire des Lilas',
        image: 'https://picsum.photos/1000/500?random=2',
        maxParticipants: 30,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Fête de quartier',
        description: 'Grande fête annuelle avec barbecue, musique et animations pour tous',
        date: DateTime.fromISO('2024-08-20T11:00:00'),
        location: 'Parc municipal',
        image: 'https://picsum.photos/1000/500?random=3',
        maxParticipants: 200,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Repair Café',
        description: 'Atelier de réparation collaborative : électroménager, vélos, informatique',
        date: DateTime.fromISO('2024-09-10T14:00:00'),
        location: 'Salle des associations',
        image: 'https://picsum.photos/1000/500?random=4',
        maxParticipants: 40,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Atelier cuisine du monde',
        description: 'Découverte et partage de recettes entre voisins',
        date: DateTime.fromISO('2024-10-05T15:00:00'),
        location: 'Centre social',
        image: 'https://picsum.photos/1000/500?random=5',
        maxParticipants: 25,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Troc de plantes',
        description: 'Échangez vos boutures, graines et conseils de jardinage',
        date: DateTime.fromISO('2024-11-15T10:00:00'),
        location: 'Place des Tilleuls',
        image: 'https://picsum.photos/1000/500?random=6',
        maxParticipants: 50,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Ciné plein air',
        description: "Projection gratuite d'un film familial",
        date: DateTime.fromISO('2024-12-01T20:00:00'),
        location: 'Parc des Sports',
        image: 'https://picsum.photos/1000/500?random=7',
        maxParticipants: 150,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Tournoi de pétanque',
        description: 'Compétition amicale et conviviale entre voisins',
        date: DateTime.fromISO('2025-01-20T14:00:00'),
        location: 'Boulodrome municipal',
        image: 'https://picsum.photos/1000/500?random=8',
        maxParticipants: 48,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Atelier couture',
        description: 'Apprenez à réparer et customiser vos vêtements',
        date: DateTime.fromISO('2025-02-10T14:00:00'),
        location: 'Maison de quartier',
        image: 'https://picsum.photos/1000/500?random=9',
        maxParticipants: 20,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Bourse aux jouets',
        description: "Achetez et vendez des jouets d'occasion",
        date: DateTime.fromISO('2025-03-05T09:00:00'),
        location: 'Gymnase municipal',
        image: 'https://picsum.photos/1000/500?random=10',
        maxParticipants: 80,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Course solidaire',
        description: '5km de course ou marche au profit des associations locales',
        date: DateTime.fromISO('2025-04-15T09:00:00'),
        location: 'Départ place de la Mairie',
        image: 'https://picsum.photos/1000/500?random=11',
        maxParticipants: 200,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Atelier compostage',
        description: 'Initiation au compostage collectif',
        date: DateTime.fromISO('2025-05-20T10:00:00'),
        location: 'Jardin partagé des Roses',
        image: 'https://picsum.photos/1000/500?random=12',
        maxParticipants: 30,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Fête des voisins',
        description: 'Repas partagé et animations musicales',
        date: DateTime.fromISO('2025-06-10T19:00:00'),
        location: 'Rue des Cerisiers',
        image: 'https://picsum.photos/1000/500?random=13',
        maxParticipants: 100,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Atelier bricolage',
        description: 'Initiation aux bases du bricolage',
        date: DateTime.fromISO('2025-07-01T14:00:00'),
        location: 'Local associatif',
        image: 'https://picsum.photos/1000/500?random=14',
        maxParticipants: 15,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Concours de jardins fleuris',
        description: 'Récompense des plus beaux jardins et balcons du quartier',
        date: DateTime.fromISO('2025-08-15T11:00:00'),
        location: 'Tout le quartier',
        image: 'https://picsum.photos/1000/500?random=15',
        maxParticipants: 50,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Marché nocturne artisanal',
        description: 'Découverte des artisans et producteurs locaux',
        date: DateTime.fromISO('2025-09-20T17:00:00'),
        location: 'Place centrale',
        image: 'https://picsum.photos/1000/500?random=16',
        maxParticipants: 150,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Atelier photo',
        description: 'Balade photo dans le quartier et conseils techniques',
        date: DateTime.fromISO('2025-10-05T14:00:00'),
        location: 'Départ Maison de la Culture',
        image: 'https://picsum.photos/1000/500?random=17',
        maxParticipants: 20,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Loto du quartier',
        description: 'Grand loto avec de nombreux lots à gagner',
        date: DateTime.fromISO('2025-11-15T19:00:00'),
        location: 'Salle des fêtes',
        image: 'https://picsum.photos/1000/500?random=18',
        maxParticipants: 200,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Atelier décorations de Noël',
        description: 'Création de décorations durables pour les fêtes',
        date: DateTime.fromISO('2025-12-01T14:00:00'),
        location: 'Centre culturel',
        image: 'https://picsum.photos/1000/500?random=19',
        maxParticipants: 30,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Galette des rois géante',
        description: 'Partage de la galette des rois entre voisins',
        date: DateTime.fromISO('2026-01-20T16:00:00'),
        location: 'Salle polyvalente',
        image: 'https://picsum.photos/1000/500?random=20',
        maxParticipants: 120,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Carnaval de quartier',
        description: 'Défilé costumé et animations pour tous',
        date: DateTime.fromISO('2026-02-15T14:00:00'),
        location: 'Rues du quartier',
        image: 'https://picsum.photos/1000/500?random=21',
        maxParticipants: 300,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Chasse aux œufs',
        description: 'Grande chasse aux œufs de Pâques pour les enfants',
        date: DateTime.fromISO('2026-03-10T10:00:00'),
        location: 'Parc municipal',
        image: 'https://picsum.photos/1000/500?random=22',
        maxParticipants: 100,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Troc de livres',
        description: 'Échangez vos livres et partagez vos coups de cœur',
        date: DateTime.fromISO('2026-04-05T14:00:00'),
        location: 'Bibliothèque de quartier',
        image: 'https://picsum.photos/1000/500?random=23',
        maxParticipants: 50,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Journée propreté',
        description: 'Nettoyage collectif du quartier et sensibilisation',
        date: DateTime.fromISO('2026-05-20T09:00:00'),
        location: 'Tout le quartier',
        image: 'https://picsum.photos/1000/500?random=24',
        maxParticipants: 100,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Fête de la musique locale',
        description: 'Scène ouverte aux musiciens du quartier',
        date: DateTime.fromISO('2026-06-15T18:00:00'),
        location: 'Kiosque du parc',
        image: 'https://picsum.photos/1000/500?random=25',
        maxParticipants: 150,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Olympiades inter-quartiers',
        description: 'Compétitions sportives amicales entre quartiers',
        date: DateTime.fromISO('2026-07-01T10:00:00'),
        location: 'Complexe sportif',
        image: 'https://picsum.photos/1000/500?random=26',
        maxParticipants: 200,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Cinéma des voisins',
        description: 'Projection de courts-métrages réalisés par les habitants',
        date: DateTime.fromISO('2026-08-15T20:00:00'),
        location: 'Théâtre de verdure',
        image: 'https://picsum.photos/1000/500?random=27',
        maxParticipants: 100,
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
    ])

    for (const user of users) {
      const numberOfEvents = Math.floor(Math.random() * 10)
      const randomEvents = await Event.query().orderByRaw('RANDOM()').limit(numberOfEvents)
      for (const event of randomEvents) {
        await event.related('participants').attach([user.id])
      }
    }
  }
}

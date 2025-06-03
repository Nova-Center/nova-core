import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Service from '#models/service'
import User from '#models/user'

function getRandomElement<T>(arr: T[], canBeEmpty: boolean = false): T | null {
  if (canBeEmpty && Math.random() < 0.1) {
    return null
  }

  return arr[Math.floor(Math.random() * arr.length)]
}

const serviceTitles = [
  'Promenade de chien',
  'Courses alimentaires',
  'Aide au jardinage',
  'Soutien en mathématiques',
  'Échange linguistique',
  'Aide au déménagement',
  'Assistance informatique',
  "Garde d'enfants",
  'Cours de cuisine',
  'Compagnie pour personnes âgées',
  'Ménage à domicile',
  'Réparation de vélo',
  'Relecture de CV',
  'Préparation à un entretien',
  'Cours de musique',
  "Atelier d'art",
  'Séance photo',
  "Organisation d'événement",
  'Covoiturage',
  "Garde d'animaux",
  'Coaching sportif',
  'Cours de yoga',
  'Club de lecture',
  'Aide à la couture',
  'Organisation de la maison',
  'Aide à la peinture',
  'Montage de meubles',
  "Installation d'ordinateur",
  'Aide réseaux sociaux',
  'Création de site web',
  'Traduction de langue',
  'Rédaction de CV',
  'Conseils de carrière',
  'Pratique de prise de parole',
  "Cours d'échecs",
  'Soirée jeux de société',
  'Cuisine pour événements',
  'Entretien des plantes',
  'Soutien en sciences',
  "Cours d'histoire",
  'Cours de danse',
  'Session de groupe musical',
  'Coaching sportif',
  'Partenaire de course',
  'Visites guidées',
  'Service de bricolage',
  'Aide à la décoration',
  'Atelier créatif',
  'Éducation canine',
  'Préparation de repas',
]

const serviceDescriptions = [
  "Recherche quelqu'un pour aider dans les tâches quotidiennes.",
  'Je propose mes compétences à la communauté.',
  "Besoin d'un coup de main pour un projet spécial.",
  'Rejoignez-moi pour une expérience ludique et éducative.',
  'Facilitons-nous la vie ensemble !',
  'Soutien nécessaire pour un événement local.',
  'Partagez votre expertise ou apprenez quelque chose de nouveau.',
  'Service amical et fiable.',
  'Ouvert à tous les âges et profils.',
  'Connectons-nous et aidons-nous mutuellement !',
]

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()
    if (users.length < 2) {
      throw new Error('At least 2 users are required to seed services.')
    }

    const services = []
    for (let i = 0; i < 50; i++) {
      let owner = getRandomElement(users)
      let volunteer = getRandomElement(users, true)

      while (volunteer?.id === owner!.id) {
        volunteer = getRandomElement(users, true)
      }
      const title = serviceTitles[i % serviceTitles.length]
      const description = getRandomElement(serviceDescriptions)!
      const date = new Date(Date.now() + Math.floor(Math.random() * 60 - 30) * 24 * 60 * 60 * 1000) // +/- 30 days
      services.push({
        title,
        description,
        date,
        ownerId: owner!.id,
        volunteerId: volunteer?.id,
      })
    }
    await Service.createMany(services)

    console.log(`${services.length} services created successfully ! 🙌🏽`)
  }
}

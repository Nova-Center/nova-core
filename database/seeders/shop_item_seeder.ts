import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ShopItem from '#models/shop_item'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()
    if (users.length === 0) {
      console.log("Aucun utilisateur trouvé. Veuillez d'abord exécuter le seeder des utilisateurs.")
      return
    }

    const items = [
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Vélo électrique',
        description: 'Vélo électrique en excellent état, parfait pour les déplacements en ville',
        price: 89900,
        image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Tondeuse à gazon',
        description: 'Tondeuse thermique peu utilisée, idéale pour jardin moyen',
        price: 19900,
        image: 'https://images.unsplash.com/photo-1589288195669-091cb7c1d2eb?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Barbecue Weber',
        description: "Barbecue à charbon Weber, parfait pour les repas d'été",
        price: 15900,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Table de jardin',
        description: 'Table en teck avec 6 chaises, idéale pour le jardin',
        price: 29900,
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Perceuse Bosch',
        description: 'Perceuse visseuse sans fil 18V avec 2 batteries',
        price: 12900,
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Poussette double',
        description: 'Poussette double en bon état, parfaite pour jumeaux',
        price: 19900,
        image: 'https://images.unsplash.com/photo-1566678124698-60b68e65addd?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Machine à coudre',
        description: 'Machine à coudre Singer, parfaite pour débutant',
        price: 9900,
        image: 'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Appareil à raclette',
        description: 'Appareil à raclette 8 personnes avec pierrade',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1635361803857-92fe4b8b9177?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Échelle télescopique',
        description: 'Échelle aluminium 3.8m, parfaite pour travaux en hauteur',
        price: 8900,
        image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Lit parapluie',
        description: 'Lit parapluie avec matelas, idéal pour bébé en déplacement',
        price: 3900,
        image: 'https://images.unsplash.com/photo-1586183189334-1f1b6bc9ca43?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Taille-haie électrique',
        description: 'Taille-haie électrique 600W avec lame 60cm',
        price: 7900,
        image: 'https://images.unsplash.com/photo-1590004987778-bece5c9adab6?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Canapé convertible',
        description: 'Canapé-lit 3 places en tissu gris, très confortable',
        price: 39900,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Vélo enfant',
        description: 'Vélo 16 pouces pour enfant 4-6 ans avec stabilisateurs',
        price: 5900,
        image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Karcher',
        description: 'Nettoyeur haute pression avec accessoires',
        price: 14900,
        image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Table à langer',
        description: 'Table à langer pliable avec matelas et rangements',
        price: 4900,
        image: 'https://images.unsplash.com/photo-1586183189334-1f1b6bc9ca43?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Escabeau',
        description: 'Escabeau 4 marches en aluminium',
        price: 3900,
        image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Appareil à fondue',
        description: 'Service à fondue complet pour 8 personnes',
        price: 2900,
        image: 'https://images.unsplash.com/photo-1635361803857-92fe4b8b9177?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Chaise haute bébé',
        description: 'Chaise haute réglable et pliable pour bébé',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1586183189334-1f1b6bc9ca43?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Débroussailleuse',
        description: 'Débroussailleuse thermique 52cm³ avec harnais',
        price: 19900,
        image: 'https://images.unsplash.com/photo-1590004987778-bece5c9adab6?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Parasol déporté',
        description: 'Parasol déporté 3x3m avec pied lesté',
        price: 12900,
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400',
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        clientId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Trottinette électrique',
        description: 'Trottinette électrique pliable, autonomie 25km',
        price: 29900,
        image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
        datePurchase: DateTime.now().minus({ days: 15 }),
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        clientId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Aspirateur robot',
        description: 'Robot aspirateur connecté avec station de charge',
        price: 19900,
        image: 'https://images.unsplash.com/photo-1589288195669-091cb7c1d2eb?w=400',
        datePurchase: DateTime.now().minus({ days: 12 }),
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        clientId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Plancha gaz',
        description: 'Plancha gaz 2 brûleurs avec couvercle',
        price: 15900,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
        datePurchase: DateTime.now().minus({ days: 8 }),
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        clientId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Salon de jardin',
        description: 'Salon de jardin en résine tressée avec coussins',
        price: 49900,
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400',
        datePurchase: DateTime.now().minus({ days: 20 }),
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        clientId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Serre de jardin',
        description: 'Serre de jardin 6m² avec étagères',
        price: 29900,
        image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=400',
        datePurchase: DateTime.now().minus({ days: 25 }),
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        clientId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Broyeur végétaux',
        description: 'Broyeur de végétaux électrique 2500W',
        price: 19900,
        image: 'https://images.unsplash.com/photo-1590004987778-bece5c9adab6?w=400',
        datePurchase: DateTime.now().minus({ days: 5 }),
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        clientId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Berceau bébé',
        description: 'Berceau cododo avec matelas et draps',
        price: 12900,
        image: 'https://images.unsplash.com/photo-1586183189334-1f1b6bc9ca43?w=400',
        datePurchase: DateTime.now().minus({ days: 10 }),
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        clientId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Machine à pain',
        description: 'Machine à pain automatique avec programmes variés',
        price: 8900,
        image: 'https://images.unsplash.com/photo-1635361803857-92fe4b8b9177?w=400',
        datePurchase: DateTime.now().minus({ days: 3 }),
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        clientId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Composteur',
        description: 'Composteur de jardin 400L en plastique recyclé',
        price: 5900,
        image: 'https://images.unsplash.com/photo-1590004987778-bece5c9adab6?w=400',
        datePurchase: DateTime.now().minus({ days: 18 }),
      },
      {
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        clientId: users[Math.floor(Math.random() * users.length)].id,
        name: 'Remorque vélo',
        description: 'Remorque vélo pour enfants, convertible en poussette',
        price: 16900,
        image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
        datePurchase: DateTime.now().minus({ days: 1 }),
      },
    ]

    await ShopItem.createMany(items)
    console.log('Articles de la boutique ajoutés avec succès ! 🛒')
  }
}

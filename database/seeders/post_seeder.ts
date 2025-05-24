import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Post from '#models/post'
import User from '#models/user'
import PostComment from '#models/post_comment'
import CommentLike from '#models/comment_like'
import PostLike from '#models/post_like'

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()
    if (users.length === 0) {
      console.log('No users found. Please run the users seeder first.')
      return
    }

    const posts = [
      {
        content:
          'Juste terminé une randonnée incroyable dans les Alpes ! Les vues étaient à couper le souffle. 🏔️ #Nature #Montagne',
        likes: Math.floor(Math.random() * 150),
      },
      {
        content:
          'Nouvelle recette de cuisine testée ce soir : un risotto aux champignons et truffes. Un délice ! 🍄 #Cuisine #Gastronomie',
        likes: Math.floor(Math.random() * 120),
      },
      {
        content:
          "Quelqu'un a des recommandations de livres pour cet été ? Je cherche des romans captivants ! 📚 #Lecture #Culture",
        likes: Math.floor(Math.random() * 80),
      },
      {
        content:
          'Premier jour de mon nouveau projet de développement web. Très motivé pour cette nouvelle aventure ! 💻 #Tech #Code',
        likes: Math.floor(Math.random() * 100),
      },
      {
        content:
          'Concert exceptionnel hier soir ! La performance live était époustouflante. 🎵 #Musique #Live',
        likes: Math.floor(Math.random() * 200),
      },
      {
        content:
          'Petit déjeuner parfait avec un café et des croissants frais. Le bonheur simple ! ☕ #Foodie',
        likes: Math.floor(Math.random() * 90),
      },
      {
        content:
          "Découverte d'un nouveau café dans le quartier. L'ambiance est parfaite pour travailler ! 🏠 #Café #Travail",
        likes: Math.floor(Math.random() * 70),
      },
      {
        content:
          'Séance de yoga matinale, le meilleur moyen de commencer la journée ! 🧘‍♀️ #Bienêtre #Yoga',
        likes: Math.floor(Math.random() * 110),
      },
      {
        content:
          "Exposition d'art contemporain très inspirante aujourd'hui. L'art moderne ne cesse de me surprendre ! 🎨 #Art #Culture",
        likes: Math.floor(Math.random() * 85),
      },
      {
        content:
          'Nouveau projet photo : la street photography. Paris regorge de moments uniques à capturer ! 📸 #Photographie',
        likes: Math.floor(Math.random() * 130),
      },
      {
        content:
          'Week-end en famille, les meilleurs moments sont ceux partagés avec nos proches. ❤️ #Famille',
        likes: Math.floor(Math.random() * 160),
      },
      {
        content:
          "Découverte d'un nouveau podcast sur l'histoire de France. Très enrichissant ! 🎧 #Culture #Histoire",
        likes: Math.floor(Math.random() * 75),
      },
      {
        content: "Séance de cinéma : le dernier film était un véritable chef-d'œuvre ! 🎬 #Cinéma",
        likes: Math.floor(Math.random() * 95),
      },
      {
        content: 'Nouveau challenge sportif : préparer un semi-marathon ! 💪 #Sport #Running',
        likes: Math.floor(Math.random() * 140),
      },
      {
        content:
          "Création d'un nouveau jardin sur mon balcon. Les plantes apportent tant de sérénité ! 🌱 #Jardinage",
        likes: Math.floor(Math.random() * 65),
      },
      {
        content:
          "Découverte d'un nouveau restaurant végétarien. La cuisine était délicieuse ! 🥗 #Végétarien",
        likes: Math.floor(Math.random() * 105),
      },
      {
        content:
          'Séance de méditation guidée ce matin. Le calme intérieur est précieux. 🧘‍♂️ #Méditation',
        likes: Math.floor(Math.random() * 115),
      },
      {
        content: "Nouveau projet de bricolage : création d'une étagère en bois recyclé ! 🛠️ #DIY",
        likes: Math.floor(Math.random() * 125),
      },
      {
        content: "Concert de jazz improvisé dans un petit bar. L'ambiance était magique ! 🎺 #Jazz",
        likes: Math.floor(Math.random() * 145),
      },
      {
        content: "Découverte d'un nouveau jeu de société avec des amis. Très addictif ! 🎲 #Jeux",
        likes: Math.floor(Math.random() * 135),
      },
      {
        content:
          "Séance de peinture ce weekend. L'art est une excellente thérapie ! 🎨 #Art #Créativité",
        likes: Math.floor(Math.random() * 155),
      },
      {
        content:
          'Nouveau livre de développement personnel commencé. Très inspirant ! 📖 #DéveloppementPersonnel',
        likes: Math.floor(Math.random() * 165),
      },
      {
        content:
          "Découverte d'un nouveau parcours de randonnée. La nature est si belle ! 🌲 #Nature",
        likes: Math.floor(Math.random() * 175),
      },
      {
        content:
          'Séance de cuisine avec des amis. Les meilleurs moments sont ceux partagés ! 👨‍🍳 #Cuisine',
        likes: Math.floor(Math.random() * 185),
      },
      {
        content:
          'Nouveau projet de photographie : la macro. Les détails sont fascinants ! 🔍 #Photo',
        likes: Math.floor(Math.random() * 195),
      },
      {
        content:
          "Découverte d'un nouveau café-théâtre. L'humour est le meilleur remède ! 🎭 #Théâtre",
        likes: Math.floor(Math.random() * 205),
      },
      {
        content: 'Séance de yoga en plein air. Le soleil et le calme, un combo parfait ! 🌞 #Yoga',
        likes: Math.floor(Math.random() * 215),
      },
      {
        content: "Nouveau projet de jardinage : création d'un potager ! 🥕 #Jardinage",
        likes: Math.floor(Math.random() * 225),
      },
      {
        content: "Découverte d'un nouveau musée d'art moderne. L'inspiration est partout ! 🖼️ #Art",
        likes: Math.floor(Math.random() * 235),
      },
      {
        content:
          "Séance de méditation en groupe. L'énergie collective est puissante ! 🧘‍♀️ #Méditation",
        likes: Math.floor(Math.random() * 245),
      },
      {
        content: "Nouveau projet de couture : création d'un sac en tissu recyclé ! 🧵 #DIY",
        likes: Math.floor(Math.random() * 255),
      },
      {
        content:
          "Découverte d'un nouveau restaurant fusion. Les saveurs sont uniques ! 🍽️ #Cuisine",
        likes: Math.floor(Math.random() * 265),
      },
      {
        content: "Séance de cinéma en plein air. L'ambiance est magique ! 🎬 #Cinéma",
        likes: Math.floor(Math.random() * 275),
      },
      {
        content:
          'Nouveau projet de photographie : la photo de rue. La vie urbaine est fascinante ! 📸 #Photo',
        likes: Math.floor(Math.random() * 285),
      },
      {
        content:
          "Découverte d'un nouveau parc d'attractions. Les sensations fortes sont au rendez-vous ! 🎢 #Loisirs",
        likes: Math.floor(Math.random() * 295),
      },
      {
        content: 'Séance de yoga en montagne. La vue est à couper le souffle ! 🏔️ #Yoga',
        likes: Math.floor(Math.random() * 305),
      },
      {
        content: "Nouveau projet de bricolage : création d'un meuble en palettes ! 🛠️ #DIY",
        likes: Math.floor(Math.random() * 315),
      },
      {
        content:
          "Découverte d'un nouveau festival de musique. L'ambiance est électrique ! 🎵 #Musique",
        likes: Math.floor(Math.random() * 325),
      },
      {
        content:
          'Séance de méditation au lever du soleil. Le calme du matin est précieux ! 🌅 #Méditation',
        likes: Math.floor(Math.random() * 335),
      },
      {
        content: "Nouveau projet de jardinage : création d'un jardin zen ! 🎋 #Jardinage",
        likes: Math.floor(Math.random() * 345),
      },
    ]

    for (const post of posts) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const createdPost = await Post.create({
        ...post,
        userId: randomUser.id,
      })

      const numberOfPostLikes = Math.floor(Math.random() * 151)
      for (let j = 0; j < numberOfPostLikes; j++) {
        const randomLiker = users[Math.floor(Math.random() * users.length)]
        await PostLike.create({
          postId: createdPost.id,
          userId: randomLiker.id,
        })
      }

      const numberOfComments = Math.floor(Math.random() * 7)
      const possibleComments = [
        'Superbe photo ! Les couleurs sont magnifiques. 📸',
        "J'adore l'ambiance de ce lieu ! 😍",
        "Merci pour le partage, c'est vraiment inspirant ! ✨",
        'Je comprends totalement ton enthousiasme ! 🎉',
        "Quelle belle expérience ! J'aimerais bien vivre ça aussi. 🌟",
        'Les détails sont incroyables, bravo ! 👏',
        "C'est exactement ce dont j'avais besoin aujourd'hui ! 🙏",
        "Tu as raison, c'est vraiment un moment magique ! ✨",
        "Je ne peux qu'être d'accord avec toi ! 👍",
        'Quelle belle initiative ! 🌈',
        "C'est exactement ce que je pensais ! 💭",
        'Tu as parfaitement raison ! 👌',
        'Je partage totalement ton point de vue ! 🤝',
        "C'est vraiment inspirant, merci ! 🙌",
        'Quelle belle découverte ! 🎯',
        "Je suis complètement d'accord ! 💯",
        "C'est exactement ce que je cherchais ! 🔍",
        'Tu as raison sur tous les points ! ✅',
        "Je ne peux qu'approuver ! 👍",
        "C'est vraiment bien vu ! 👀",
        'Superbe analyse ! 🧠',
        'Je partage ton enthousiasme ! 🎊',
        "C'est vraiment bien expliqué ! 📝",
        "Je suis totalement d'accord avec toi ! 🤝",
        'Excellent point de vue ! 👏',
        "C'est vraiment bien pensé ! 💡",
        "Je ne peux qu'être d'accord ! ✅",
        'Superbe commentaire ! 🌟',
        "C'est exactement ça ! 🎯",
        'Je partage ton avis à 100% ! 💯',
      ]

      for (let i = 0; i < numberOfComments; i++) {
        const randomComment = possibleComments[Math.floor(Math.random() * possibleComments.length)]
        const randomCommentUser = users[Math.floor(Math.random() * users.length)]

        const comment = await PostComment.create({
          postId: createdPost.id,
          userId: randomCommentUser.id,
          content: randomComment,
        })

        const numberOfLikes = Math.floor(Math.random() * 50)
        for (let j = 0; j < numberOfLikes; j++) {
          const randomLiker = users[Math.floor(Math.random() * users.length)]
          await CommentLike.create({
            commentId: comment.id,
            userId: randomLiker.id,
          })
        }
      }
    }

    console.log(
      '40 posts with their comments, post likes and comment likes have been created successfully ! 🎉'
    )
  }
}

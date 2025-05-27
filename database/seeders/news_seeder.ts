import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import News from '#models/news'

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()

    await News.createMany([
      {
        title: 'Example of README.md',
        content:
          '# React Vision Camera\n\n### Features\n\nVisionCamera is a powerful, high-performance Camera library for React Native. It features:\n\n* 📸 Photo and Video capture\n* 👁️ QR/Barcode scanner\n* 📱 Customizable devices and multi-cameras ("fish-eye" zoom)\n* 🎞️ Customizable resolutions and aspect-ratios (4k/8k images)\n* ⏱️ Customizable FPS (30..240 FPS)\n* 🧩 [Frame Processors](https://react-native-vision-camera.com/docs/guides/frame-processors) (JS worklets to run facial recognition, AI object detection, realtime video chats, ...)\n* 🎨 Drawing shapes, text, filters or shaders onto the Camera\n* 🔍 Smooth zooming (Reanimated)\n* ⏯️ Fast pause and resume\n* 🌓 HDR & Night modes\n* ⚡ Custom C++/GPU accelerated video pipeline (OpenGL)\n\nInstall VisionCamera from npm:\n\n```sh\nnpm i react-native-vision-camera\ncd ios && pod install\n```\n\n..and get started by [setting up permissions](https://react-native-vision-camera.com/docs/guides)!\n\n### Documentation\n\n* [Guides](https://react-native-vision-camera.com/docs/guides)\n* [API](https://react-native-vision-camera.com/docs/api)\n* [Example](./example/)\n* [Frame Processor Plugins](https://react-native-vision-camera.com/docs/guides/frame-processor-plugins-community)\n\n### ShadowLens\n\nTo see VisionCamera in action, check out [ShadowLens](https://mrousavy.com/projects/shadowlens)!\n\n### Example\n\n```tsx\nfunction App() {\n  const device = useCameraDevice(\'back\')\n\n  if (device == null) return <NoCameraErrorView />\n  return (\n    <Camera\n      style={StyleSheet.absoluteFill}\n      device={device}\n      isActive={true}\n    />\n  )\n}\n```\n\n> See the [example](./example/) app\n\n### Adopting at scale\n\nVisionCamera is provided _as is_, I work on it in my free time.\n\nIf you\'re integrating VisionCamera in a production app, consider [funding this project](https://github.com/sponsors/mrousavy) and <a href="mailto:me@mrousavy.com?subject=Adopting VisionCamera at scale">contact me</a> to receive premium enterprise support, help with issues, prioritize bugfixes, request features, help at integrating VisionCamera and/or Frame Processors, and more.\n\n### Socials\n\n* 🐦 [**Follow me on Twitter**](https://twitter.com/mrousavy) for updates\n* 📝 [**Check out my blog**](https://mrousavy.com/blog) for examples and experiments\n* 💬 [**Join the Margelo Community Discord**](https://margelo.com/discord) for chatting about VisionCamera\n* 💖 [**Sponsor me on GitHub**](https://github.com/sponsors/mrousavy) to support my work\n* 🍪 [**Buy me a Ko-Fi**](https://ko-fi.com/mrousavy) to support my work',
        excerpt: 'There is an example of markdown compiler',
        tags: ['react', 'typescript'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: "Découverte de l'intelligence artificielle générative",
        excerpt: "Explorez les principes et applications de l'IA générative dans le monde moderne.",
        content:
          "# Découverte de l'intelligence artificielle générative\nL'intelligence artificielle générative (IAG) désigne une catégorie d'IA capable de créer du contenu original, qu'il s'agisse de texte, d'images, de musique ou de code.\n\n## Domaines d'application\n\n### Textes et langage naturel\n\nDes modèles comme GPT permettent de générer des articles, du code ou des réponses en langage naturel.\n\n### Images et médias\n\nDes outils comme DALL·E et Midjourney génèrent des visuels à partir de simples descriptions textuelles.\n\n## Défis et éthique\n\nL'IAG soulève des questions sur le plagiat, les droits d'auteur et la désinformation.\n\n## Conclusion\n\nL'IA générative ouvre des perspectives fascinantes tout en appelant à une réflexion éthique approfondie.",
        tags: ['ia', 'gpt', 'générative', 'deep learning'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Comprendre le Serverless et ses usages',
        excerpt:
          "Apprenez comment l'approche serverless simplifie le déploiement d'applications modernes.",
        content:
          "# Comprendre le Serverless et ses usages\nLe serverless est un modèle d'exécution cloud où le fournisseur gère l'infrastructure serveur.\n\n## Fonctionnement\n\n### FaaS\n\nDes fonctions sont déclenchées à la demande, comme avec AWS Lambda ou Vercel.\n\n### Avantages\n\nMoins de gestion d'infrastructure, scalabilité automatique et facturation à l'utilisation.\n\n## Limites\n\nPas adapté aux processus longs ou persistants.\n\n## Conclusion\n\nLe serverless est une option puissante pour des applications rapides, évolutives et économiques.",
        tags: ['serverless', 'cloud', 'aws', 'vercel'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Les bases de Docker pour les développeurs',
        excerpt:
          "Découvrez comment Docker facilite le développement, le test et le déploiement d'applications.",
        content:
          "# Les bases de Docker pour les développeurs\nDocker est un outil de virtualisation légère qui permet de créer des conteneurs reproductibles pour vos applications.\n\n## Concepts clés\n\n### Conteneurs vs VM\n\nLes conteneurs sont plus légers, démarrent plus vite et consomment moins de ressources que des VM.\n\n### Dockerfile\n\nPermet de décrire l'environnement d'exécution de l'application.\n\n## Cas d'utilisation\n\nDéveloppement local, CI/CD, microservices.\n\n## Conclusion\n\nMaîtriser Docker est essentiel pour tout développeur moderne souhaitant travailler efficacement en équipe ou en production.",
        tags: ['docker', 'devops', 'ci/cd', 'virtualisation'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Introduction à Rust pour les développeurs web',
        excerpt:
          'Rust gagne en popularité grâce à sa performance et sa sécurité. Voici pourquoi vous devriez vous y intéresser.',
        content:
          '# Introduction à Rust pour les développeurs web\nRust est un langage système moderne connu pour sa sécurité mémoire sans garbage collector.\n\n## Pourquoi Rust ?\n\n### Sécurité\n\nEmpêche les erreurs de segmentation et les fuites mémoire à la compilation.\n\n### Performances\n\nComparable au C/C++ tout en étant plus sûr.\n\n## Usages web\n\nRust est utilisé côté serveur (avec Actix ou Rocket) et dans WebAssembly pour accélérer le frontend.\n\n## Conclusion\n\nRust combine puissance et sûreté, en faisant un candidat sérieux pour le développement web moderne.',
        tags: ['rust', 'webassembly', 'sécurité', 'backend'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Découvrir les Progressive Web Apps (PWA)',
        excerpt:
          'Les PWA combinent le meilleur du web et des apps mobiles. Plongez dans leurs avantages.',
        content:
          "# Découvrir les Progressive Web Apps (PWA)\nLes Progressive Web Apps offrent une expérience utilisateur riche, même hors ligne.\n\n## Fonctionnalités clés\n\n### Offline first\n\nGrâce aux Service Workers, une PWA fonctionne sans connexion.\n\n### Installation\n\nAjout possible à l'écran d'accueil sans passer par un store.\n\n## Bonnes pratiques\n\nUtiliser HTTPS, un manifest.json et mettre en cache intelligemment.\n\n## Conclusion\n\nLes PWA sont idéales pour créer des expériences rapides, fiables et engageantes sur mobile comme desktop.",
        tags: ['pwa', 'service worker', 'offline', 'mobile'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Les fondamentaux de Git pour les équipes agiles',
        excerpt:
          'Comprenez comment Git soutient le travail collaboratif dans un environnement agile.',
        content:
          '# Les fondamentaux de Git pour les équipes agiles\nGit est un système de gestion de versions distribué essentiel en développement logiciel.\n\n## Branches et collaboration\n\nTravailler sur des branches permet de paralléliser les tâches sans conflits.\n\n### Merge vs Rebase\n\nDeux stratégies de consolidation à connaître selon les cas.\n\n## Bonnes pratiques\n\nCommits clairs, pull requests, et révisions de code.\n\n## Conclusion\n\nGit est un pilier de la collaboration moderne, surtout en environnement agile.',
        tags: ['git', 'agile', 'collaboration', 'versioning'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: "Pourquoi adopter TypeScript dès aujourd'hui",
        excerpt:
          'Découvrez les bénéfices de TypeScript pour écrire du JavaScript plus sûr et maintenable.',
        content:
          "# Pourquoi adopter TypeScript dès aujourd'hui\nTypeScript est un surensemble de JavaScript qui ajoute le typage statique.\n\n## Avantages\n\n### Sécurité\n\nLes types aident à éviter des bugs courants dès la phase de développement.\n\n### Lisibilité et refactorisation\n\nLe code devient plus clair et plus facile à maintenir à long terme.\n\n## Adoption progressive\n\nTypeScript peut être introduit fichier par fichier dans un projet JS existant.\n\n## Conclusion\n\nAdopter TypeScript, c'est investir dans la qualité et la robustesse de vos projets JS.",
        tags: ['typescript', 'javascript', 'refactoring', 'types'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Déployer une API REST avec Fastify',
        excerpt:
          'Fastify est un framework Node.js rapide et léger pour créer des API performantes.',
        content:
          "# Déployer une API REST avec Fastify\nFastify est conçu pour la performance, la sécurité et l'extensibilité.\n\n## Installation\n\n```bash\nnpm install fastify\n```\n\n## Exemple simple\n\n```js\nconst fastify = require('fastify')();\nfastify.get('/', async () => ({ hello: 'world' }));\nfastify.listen(3000);\n```\n\n## Avantages\n\nRapide, supporte les plugins, typage natif avec TypeScript.\n\n## Conclusion\n\nFastify est une excellente alternative à Express pour des APIs REST modernes.",
        tags: ['fastify', 'api', 'nodejs', 'performance'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Comprendre le fonctionnement de WebAssembly',
        excerpt:
          "WebAssembly permet d'exécuter du code natif dans le navigateur avec des performances proches du C.",
        content:
          "# Comprendre le fonctionnement de WebAssembly\nWebAssembly (WASM) est un format binaire qui permet d'exécuter du code dans le navigateur.\n\n## Avantages\n\n- Très rapide\n- Portable\n- Sécurisé\n\n## Usages\n\nJeux, éditeurs, traitement d'images/audio dans le navigateur.\n\n## Compilation\n\nDes langages comme C, C++, Rust peuvent être compilés en WASM.\n\n## Conclusion\n\nWebAssembly étend considérablement les capacités du navigateur moderne.",
        tags: ['wasm', 'webassembly', 'navigateur', 'performance'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
      {
        title: 'Architecture des microservices expliquée simplement',
        excerpt:
          'Découvrez comment les microservices permettent de mieux structurer les grandes applications.',
        content:
          "# Architecture des microservices expliquée simplement\nLes microservices sont une approche qui consiste à diviser une application en petits services indépendants.\n\n## Caractéristiques\n\n- Chaque service est déployable individuellement\n- Communique via des API\n- Orienté domaine métier\n\n## Avantages\n\n- Scalabilité\n- Résilience\n- Flexibilité des équipes\n\n## Conclusion\n\nLes microservices sont puissants mais nécessitent une bonne discipline d'architecture.",
        tags: ['microservices', 'architecture', 'scalabilité', 'cloud'],
        userId: users[Math.floor(Math.random() * users.length)].id,
      },
    ])

    console.log('News seeded successfully ! 📰')
  }
}

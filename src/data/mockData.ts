import { InstagramAccount, ProxyConfig, TargetingConfig, AutomationConfig, ActivityLog, GrowthDataPoint } from '../types';

export const initialAccounts: InstagramAccount[] = [
  {
    id: 'acc_1',
    username: 'naturalisgourmet',
    displayName: 'Naturalis Gourmet',
    avatar: '/src/assets/images/avatar_instagram_creator_1790187939833.jpg',
    followers: 1200,
    following: 340,
    postsCount: 24,
    status: 'warming_up',
    warmUpDay: 1,
    warmUpTotalDays: 7,
    proxyId: 'prx_1',
    safetyPreset: 'safe',
    isRealAccount: true,
    dailyActions: {
      likes: 92,
      comments: 24,
      follows: 41,
      unfollows: 35,
      stories: 480,
      dms: 18,
    },
    dailyLimits: {
      likes: 120,
      comments: 35,
      follows: 50,
      unfollows: 50,
      stories: 800,
      dms: 30,
    },
    activeHours: { start: '08:30', end: '22:00' },
    delayRange: [45, 95],
    lastActive: 'Agora mesmo',
  },
  {
    id: 'acc_2',
    username: 'growth.mentor.br',
    displayName: 'Carlos Viana | Marketing Digital',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followers: 6310,
    following: 420,
    postsCount: 68,
    status: 'warming_up',
    warmUpDay: 3,
    warmUpTotalDays: 7,
    proxyId: 'prx_2',
    safetyPreset: 'safe',
    dailyActions: {
      likes: 22,
      comments: 6,
      follows: 12,
      unfollows: 0,
      stories: 150,
      dms: 5,
    },
    dailyLimits: {
      likes: 40,
      comments: 15,
      follows: 20,
      unfollows: 10,
      stories: 300,
      dms: 10,
    },
    activeHours: { start: '09:00', end: '20:30' },
    delayRange: [60, 140],
    lastActive: '5 min atrás',
  }
];

export const initialProxies: ProxyConfig[] = [
  {
    id: 'prx_1',
    name: 'Proxy Residencial SP #01',
    type: 'HTTPS',
    host: 'br-res.proxyservice.net',
    port: 8080,
    username: 'user_br_4910',
    password: '••••••••',
    status: 'online',
    latencyMs: 42,
    location: 'São Paulo, BR',
    ip: '177.136.241.88',
    lastChecked: 'Hoje às 11:20',
  },
  {
    id: 'prx_2',
    name: 'Proxy Móvel 4G RJ #03',
    type: 'SOCKS5',
    host: 'rj-mobile.proxyhub.io',
    port: 1080,
    username: 'user_rj_812',
    password: '••••••••',
    status: 'online',
    latencyMs: 78,
    location: 'Rio de Janeiro, BR',
    ip: '189.90.12.145',
    lastChecked: 'Hoje às 11:15',
  }
];

export const defaultTargeting: TargetingConfig = {
  hashtags: ['#vidasaudavel', '#nutricaoesportiva', '#estilodevida', '#suplementos', '#rotinasaudavel'],
  competitorAccounts: ['@mundoverde_brasil', '@nutricionista_aline', '@saudenoprato_oficial'],
  locations: ['São Paulo, Brazil', 'Rio de Janeiro, Brazil', 'Curitiba, Brazil'],
  exploreFeed: true,
  postCommenters: ['https://www.instagram.com/p/C9vKmQ0xLop/'],
  filters: {
    minFollowers: 100,
    maxFollowers: 12000,
    hasProfilePic: true,
    hasBio: true,
    minPosts: 5,
    accountType: 'all',
    skipPrivate: false,
  }
};

export const defaultAutomation: AutomationConfig = {
  likePosts: true,
  likesPerProfile: 2,
  commentPosts: true,
  commentsSpintax: [
    '{Sensacional|Incrível|Show de bola|Muito bom} esse {post|conteúdo}, @{username}! {Parabéns pelo trabalho|Sempre agregando muito valor}! 👏🔥',
    '{Dica de ouro|Conteúdo de altíssimo nível|Excelente reflexão}, @{username}! {Sucesso sempre|Continue com esses posts incríveis} 🚀',
    '{Adorei|Muito top|Muito bacana}! {Salvando aqui para consultar depois|Compartilhei com a minha equipe} 💡'
  ],
  followUsers: true,
  unfollowUsers: true,
  unfollowAfterDays: 3,
  unfollowOnlyNonFollowers: true,
  whitelist: ['@pedro_parceiro', '@fornecedor_oficial', '@influencer_amiga', '@mentoria_vip'],
  viewStories: true,
  likeStories: true,
  reactPolls: true,
  welcomeDmEnabled: true,
  welcomeDmMessage: 'Olá {primeiro_nome}! Seja muito bem-vindo(a) ao meu perfil 👋 Fico feliz em ter você aqui. Me conta: você já tem uma rotina equilibrada ou quer melhorar seus hábitos hoje?',
  keywordTriggers: [
    {
      id: 'kw_1',
      keyword: 'QUERO',
      postDescription: 'Post sobre o Guia de Hábitos Saudáveis',
      commentReply: 'Te mandei no direct agora mesmo! 🚀 Dá uma olhadinha lá.',
      directMessage: 'E aí {primeiro_nome}! Vi que você comentou no post. Aqui está o link do seu Guia Gratuito de Hábitos: 🔗 https://naturalis.com.br/guia-gratis Aproveite!',
      active: true,
      triggerCount: 38
    },
    {
      id: 'kw_2',
      keyword: 'PRECO',
      postDescription: 'Reels sobre a Mentoria Individual',
      commentReply: 'Acabei de te enviar todos os detalhes e valores no seu direct! 💬',
      directMessage: 'Olá {primeiro_nome}! As inscrições para a mentoria estão com condição especial. Veja todos os detalhes aqui: https://naturalis.com.br/mentoria-vip',
      active: true,
      triggerCount: 19
    }
  ]
};

export const initialLogs: ActivityLog[] = [
  {
    id: 'log_1',
    timestamp: '11:24:12',
    actionType: 'like',
    targetUser: '@marina_fit_coach',
    detail: 'Curtiu 2 publicações recentes (#vidasaudavel)',
    status: 'success',
    targetPostThumbnail: '/src/assets/images/post_lifestyle_fashion_1790187950485.jpg',
  },
  {
    id: 'log_2',
    timestamp: '11:23:45',
    actionType: 'comment',
    targetUser: '@juliana.nutri',
    detail: 'Comentou: "Excelente reflexão, @juliana.nutri! Sempre agregando muito valor! 👏🔥"',
    status: 'success',
  },
  {
    id: 'log_3',
    timestamp: '11:22:10',
    actionType: 'dm',
    targetUser: '@rodrigo.silva88',
    detail: 'Gatilho de palavra-chave [QUERO] enviado no direct com sucesso.',
    status: 'success',
  },
  {
    id: 'log_4',
    timestamp: '11:20:55',
    actionType: 'follow',
    targetUser: '@andre_corrida',
    detail: 'Seguiu perfil público (840 seguidores, seguidor de @mundoverde_brasil)',
    status: 'success',
  },
  {
    id: 'log_5',
    timestamp: '11:19:18',
    actionType: 'story',
    targetUser: '@beatriz_organica',
    detail: 'Visualizou 3 Stories e curtiu o último',
    status: 'success',
  },
  {
    id: 'log_6',
    timestamp: '11:18:02',
    actionType: 'warmup',
    targetUser: 'Sistema',
    detail: 'Pausa humana aleatória de 72 segundos aplicada para proteção anti-ban',
    status: 'delayed',
  }
];

export const growthHistory: GrowthDataPoint[] = [
  { date: '17/09', followers: 14320, actions: 180, dmsSent: 12 },
  { date: '18/09', followers: 14410, actions: 210, dmsSent: 15 },
  { date: '19/09', followers: 14505, actions: 240, dmsSent: 19 },
  { date: '20/09', followers: 14612, actions: 230, dmsSent: 14 },
  { date: '21/09', followers: 14690, actions: 220, dmsSent: 16 },
  { date: '22/09', followers: 14760, actions: 250, dmsSent: 20 },
  { date: '23/09', followers: 14820, actions: 221, dmsSent: 18 },
];

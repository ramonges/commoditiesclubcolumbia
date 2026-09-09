export interface MemberProfile {
  name: string;
  image: string;
  bio: string;
  imagePosition?: 'top' | 'center';
}

export const SITE_URL = 'https://www.columbia-commodity.com';

export const RESERVED_PATHS = new Set([
  'news',
  'article',
  'research',
  'strategies',
  'events',
  'admin',
  'assets',
]);

export const memberProfiles: MemberProfile[] = [
  {
    name: 'Timothe Jekel',
    image: '/assets/timothe_jekel.png',
    bio: 'Timothe focuses on commodity markets through the lens of geopolitics and the energy transition. He has worked at the International Energy Agency during the EU gas crisis and at Kpler focusing on global energy flows and market analysis. He founded the Columbia Commodity Club to foster open, rigorous and market-driven conversations.',
  },
  {
    name: 'Hans Sutikno',
    image: '/assets/hans_sutikno.png',
    bio: "Hans is an M.S. in Sustainability Management candidate at Columbia, focusing on energy finance as a Global Energy Fellow at the Center on Global Energy Policy. He has worked on critical minerals and transition finance research, and previously drove sustainable finance strategy and client engagement on decarbonization and green finance in Indonesia's banking sector.",
  },
  {
    name: 'Rahul Verma',
    image: '/assets/rahul_verma.png',
    bio: 'Rahul is an MS in Climate Finance student at Columbia. He previously worked at a critical minerals trading firm focused on battery metals and rare earths, and in energy private equity at Omidyar Ventures and Blackstone.',
  },
  {
    name: 'Priyal Patel',
    image: '/assets/Priyal_Patel.jpg',
    imagePosition: 'top',
    bio: 'Priyal is a climate finance professional specializing in ESG reporting, emissions analysis, and sustainability program implementation, and she is currently in the inaugural M.S. in Climate Finance class at Columbia. Her data-driven research focuses on capital flows in mining and expanding data center infrastructure, driven by her interest in commodity markets, energy costs, and critical mineral demand.',
  },
  {
    name: 'Raphael Monges',
    image: '/assets/raphael_monges.png',
    bio: 'Raphael is a graduate student at Columbia Engineering, focusing on building tools that make trading energy, metals and agricultural commodities more efficient. He has worked with freight companies to help forecast maritime freight rates and is preparing for a career as a commodity trader, contributing researched articles to this platform.',
  },
  {
    name: 'Mauricio Del Rio Hinojosa',
    image: '/assets/Mauricio.PNG',
    imagePosition: 'top',
    bio: 'Mauricio Del Rio Hinojosa works at a macro hedge fund in NYC, specializing in commodities, primarily energy. He is pursuing a master’s degree focused on renewable energy and energy policy. As a member of the Columbia Commodity Club, he aims to foster dialogue between students and experienced macro hedge fund professionals to share their perspectives and insights.',
  },
  {
    name: 'Arka Khorchidian',
    image: '/assets/Arka_Khorchidian.png',
    bio: 'Arka is a graduate student doing his M.S. in Electrical Engineering. With a strong background in telecommunications and software development, he aims to apply his technical skills to the energy and commodities space, particularly in areas like energy data analytics, market modeling, and building tools for commodity trading. He is passionate about leveraging technology to drive insights and innovation in commodity markets.',
  },
  {
    name: 'Noémie Remy',
    image: '/assets/Noemie.jpeg',
    imagePosition: 'top',
    bio: 'Noémie Remy is a M.S. in Sustainability Management candidate, she brings a background in sustainable finance and consulting, with experience working at the intersection of capital allocation and environmental transition. She examines how critical mineral supply chains, commodity markets, and industrial policy shape the broader energy transition, linking upstream resource dynamics to downstream electrification strategies.',
  },
  {
    name: 'David Tang',
    image: '/assets/david_tang.png',
    bio: 'David is pursuing a Master’s at Columbia’s Climate School, with a background in chemical engineering and atmospheric chemistry. He focuses on power, renewable energy certificates, carbon markets and emerging low‑carbon commodities, bridging climate science with energy market strategy to support the clean energy transition.',
  },
  {
    name: 'Jasmin Zheng',
    image: '/assets/jasmin_zheng.png',
    bio: 'Jasmin Zheng is pursuing an MA in Climate and Society at the Columbia Climate School. She focuses on the intersection of climate policy, biodiversity, development finance, and impact measurement. Her experience spans multilateral institutions and the private sector, including roles at the United Nations Environment Programme (UNEP), the UN Capital Development Fund (UNCDF), Ernst & Young, and Roland Berger.',
  },
  {
    name: 'Salman Al Fathan',
    image: '/assets/salman_al_fathan.png',
    bio: 'Salman has five years of experience in partnership development, policy research, project management and data analysis. Now pursuing an MA in Climate and Society at Columbia, he is passionate about climate mitigation policies, the energy transition and driving sustainable climate investments.',
  },
];

export function memberSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function memberPath(member: MemberProfile): string {
  return `/${memberSlug(member.name)}`;
}

export function memberUrl(member: MemberProfile): string {
  return `${SITE_URL}${memberPath(member)}`;
}

export function getMemberBySlug(slug: string): MemberProfile | undefined {
  if (!slug || RESERVED_PATHS.has(slug.toLowerCase())) {
    return undefined;
  }

  const normalized = slug.toLowerCase();
  return memberProfiles.find(
    (member) => memberSlug(member.name).toLowerCase() === normalized
  );
}

export function getMemberByName(name: string): MemberProfile | undefined {
  return memberProfiles.find((member) => member.name === name);
}

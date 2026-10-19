import {
  ALL_UTILITY_PRODUCT_SLUGS,
  CHEAT_PRODUCT_SLUGS,
  CHEATS_PRIMARY_SLUG,
  HWID_SPOOFER_SLUG,
  SKIN_CHANGER_SLUG,
  UGC_SLUG,
  UTILITY_PRODUCT_PATHS,
  UTILITY_PRODUCT_SLUGS,
  type UtilityProductSlug,
} from '../config/catalog';
import { PRODUCT_BASE } from '../config/site';
import { CHEAT_PRODUCT_NAME } from '../config/game';
import { getTranslations } from '../i18n';
import { deepApplySiteTokens } from '../i18n/brandTokens';
import type { SiteLocale } from '../i18n/locales';
import type { Translations } from '../i18n/types';
import { checkoutForSlug } from '../config/checkout';
import { EFT_SHOWCASE_GALLERY_KEYS } from '../config/gameplayMedia';
import { HWID_GALLERY_KEYS } from '../config/hwidMedia';
import type { IconName } from '../components/icons/types';
import { getProductCopyBundle, registerProductCopyBundle, type ProductCopyBundle } from './products/exportCopy';
import esProductCopy from './products/locales/es.json';
import deProductCopy from './products/locales/de.json';
import frProductCopy from './products/locales/fr.json';

export interface ProductSlide {
  /** Still image, or the poster frame when `videoSrc` is set. */
  src: string;
  alt: string;
  caption: string;
  captionDesc: string;
  /** `image` unless a clip is attached. */
  kind?: 'image' | 'video';
  /** MP4 or WebM. The slider shows this instead of the still; `src` stays the poster. */
  videoSrc?: string;
}

export interface ProductOverview {
  title: string;
  paragraphs: string[];
}

export interface AcquisitionStep {
  num: string;
  title: string;
  desc: string;
}

export interface ProductAcquisition {
  title: string;
  steps: AcquisitionStep[];
}

export interface SystemRequirement {
  icon: IconName;
  text: string;
}

export interface ProductPage {
  slug: string;
  kind: 'tier' | 'utility';
  badge: string;
  category?: string;
  tier?: string;
  name: string;
  title: string;
  subtitle: string;
  desc: string;
  features: string[];
  more: number;
  variant?: 'essential' | 'popular' | 'limited';
  buyUrl: string;
  images: ProductSlide[];
  overview: ProductOverview;
  acquisition: ProductAcquisition;
  goodToKnow: string;
  limitations: string;
  fullFeatures: string[];
  systemRequirements: SystemRequirement[];
  about?: { type: 'h2' | 'p'; text: string }[];
  body: { type: 'h2' | 'p'; text: string }[];
  relatedBlogSlugs: string[];
  relatedForumSlugs: string[];
}

/** Guides paired with each product detail page */
export const productRelatedBlogSlugs: Record<string, string[]> = {
  elite: [
    'escape-from-tarkov-cheats-price-monthly-vs-lifetime',
    'how-to-set-up-escape-from-tarkov-cheats-requirements',
    'tarkov-cloud-dma-explained-do-you-need-it',
    'tarkov-loot-esp-filters-price-category-containers',
    'tarkov-aimbot-settings-explained',
    'streamproof-tarkov-cheats-for-streamers',
    'battleye-and-escape-from-tarkov-cheats-what-to-know',
  ],
  'hwid-spoofer': [
    'tarkov-hwid-ban-how-hwid-spoofer-works',
    'battleye-and-escape-from-tarkov-cheats-what-to-know',
  ],
  ugc: ['battleye-and-escape-from-tarkov-cheats-what-to-know', 'tarkov-hwid-ban-how-hwid-spoofer-works'],
  'skin-changer': ['streamproof-tarkov-cheats-for-streamers', 'how-to-set-up-escape-from-tarkov-cheats-requirements'],
};

/** Community threads paired with each product detail page */
export const productRelatedForumSlugs: Record<string, string[]> = {
  elite: [
    'tarkov-cheats-monthly-or-lifetime-worth-it',
    'do-i-need-cloud-dma-for-tarkov-cheats',
    'tarkov-cheat-loader-not-working-what-to-check',
    'how-to-check-tarkov-cheat-status-after-patch',
  ],
  'hwid-spoofer': ['tarkov-hwid-ban-does-a-spoofer-help', 'tarkov-battleye-ban-honest-talk-risk'],
  ugc: ['tarkov-battleye-ban-honest-talk-risk', 'tarkov-hwid-ban-does-a-spoofer-help'],
};

const productBase = PRODUCT_BASE;

const planStep: AcquisitionStep = {
  num: '02',
  title: 'Select monthly or lifetime',
  desc: 'Monthly gives you 31 days of access and lifetime has no end date. Both plans include the same tool.',
};

const windowsSecurityStep: AcquisitionStep = {
  num: '03',
  title: 'Prepare Windows security settings',
  desc: 'Turn on HVCI and Core Isolation in Windows Security, and TPM and Secure Boot in your BIOS/UEFI, before the first launch.',
};

const hwidAcquisitionSteps: AcquisitionStep[] = [
  {
    num: '01',
    title: 'Check your game is covered',
    desc: 'The spoofer supports Riot Vanguard, Easy Anti-Cheat, BattlEye, Ricochet and other anti-cheats. Confirm your game is on the list and check the status banner on {siteDomain} before you buy.',
  },
  planStep,
  { ...windowsSecurityStep, desc: `${windowsSecurityStep.desc} Use a Windows account with administrator rights.` },
  {
    num: '04',
    title: 'Spoof and clean before you launch',
    desc: 'Run the spoof and cleanup steps before you open the banned game, in the order the current setup guide gives.',
  },
];

const ugcAcquisitionSteps: AcquisitionStep[] = [
  {
    num: '01',
    title: 'Check what was restricted',
    desc: 'UGC is for restricted accounts. If the ban is tied to your hardware instead (new accounts get banned straight away on the same PC), an appeal will not fix it.',
  },
  planStep,
  windowsSecurityStep,
  {
    num: '04',
    title: 'Build your appeal workflow',
    desc: 'Set up a workflow for the platform that restricted your account and let UGC automate the dispute steps. Ask support if you are unsure where to start.',
  },
];

const skinChangerAcquisitionSteps: AcquisitionStep[] = [
  {
    num: '01',
    title: 'Confirm your game is supported',
    desc: 'Skin Changer works across major titles, but coverage can change after game updates. Ask support to confirm your game before you buy.',
  },
  planStep,
  windowsSecurityStep,
  {
    num: '04',
    title: 'Pick your cosmetics',
    desc: 'Open the menu and choose the weapon skins, character outfits and knife variants you want.',
  },
];

const defaultAcquisitionSteps: AcquisitionStep[] = [
  {
    num: '01',
    title: 'Review current status',
    desc: 'Check the live banner on {siteDomain} and Discord #status before purchase, especially after an Escape From Tarkov or BattlEye update.',
  },
  {
    num: '02',
    title: 'Choose your access tier',
    desc: 'Select Escape From Tarkov Cheats or the utility that matches your goal. Review the feature list before checkout via our partner checkout.',
  },
  {
    num: '03',
    title: 'Contact the team',
    desc: 'Open Discord and confirm availability, Windows setup, and payment details with your order email ready.',
  },
  {
    num: '04',
    title: 'Follow guided setup',
    desc: 'Use only the operator portal, patch loader, and setup guide. Test offline, load presets, then run PMC raids when status is online.',
  },
];

function acquisitionFor(productName: string): ProductAcquisition {
  return {
    title: `How to get ${productName}`,
    steps: defaultAcquisitionSteps,
  };
}

const sharedGoodToKnow =
  'Escape From Tarkov and BattlEye receive frequent updates. Confirm module availability on the live status panel at {siteDomain} before you purchase or launch. Cloud DMA is a separate purchase when required for full functionality.';

const sharedLimitations =
  'Third-party software in Escape From Tarkov can violate {gamePublisher} terms and lead to BattlEye bans or account action. You use this software at your own risk. Compatibility and availability can change after game, BattlEye, or Windows updates without notice.';

const windowsSecurityRequirements: SystemRequirement[] = [
  { icon: 'reqShieldGuide', text: 'HVCI and Core Isolation turned on in Windows Security.' },
  { icon: 'reqSettings', text: 'TPM and Secure Boot enabled in BIOS/UEFI.' },
];

const eftSystemRequirements: SystemRequirement[] = [
  { icon: 'reqWindows', text: 'Windows 10 or 11 64-bit (Intel or AMD).' },
  ...windowsSecurityRequirements,
  { icon: 'reqWifi', text: 'Stable internet and loader access after purchase.' },
  { icon: 'reqShieldGuide', text: 'Cloud DMA is required for full functionality.' },
];

const galleryRaw = {
  gpDaylightEsp: {
    src: '/images/gameplay/eft-esp-daylight-player-highlights.webp',
    alt: 'Escape From Tarkov first-person view with player ESP showing red-highlighted figures, skeleton outlines, and distance labels in a sunlit industrial yard.',
    caption: 'Player ESP in daylight raids',
    captionDesc:
      'Red and green player highlights, skeleton wireframes, and distance readouts over an outdoor industrial map.',
  },
  gpNightEsp: {
    src: '/images/gameplay/eft-esp-night-vision-skeletons.webp',
    alt: 'Escape From Tarkov night-vision scene with skeleton ESP, PMC and Scav labels, and meter readouts visible through interior walls.',
    caption: 'Skeleton ESP at night',
    captionDesc:
      'Stick-figure skeletons, name tags, and distance markers through walls in a green-tinted indoor raid.',
  },
  gpWallEsp: {
    src: '/images/gameplay/eft-esp-enemies-through-concrete-wall.webp',
    alt: 'Escape From Tarkov first-person aim with red wallhack silhouettes and weapon labels visible through a concrete wall outdoors.',
    caption: 'ESP through hard cover',
    captionDesc:
      'Red enemy silhouettes and weapon callouts rendered through a concrete barrier while aiming down sights.',
  },
} satisfies Record<
  string,
  { src: string; alt: string; caption: string; captionDesc: string; videoSrc?: string }
>;

type GalleryKey = keyof typeof galleryRaw;

function slide(...keys: GalleryKey[]): ProductSlide[] {
  return keys.map((key) => {
    const item = galleryRaw[key];
    if (!item) throw new Error(`Missing gallery key: ${String(key)}`);
    const { src, alt, caption, captionDesc, videoSrc } = item;
    return {
      src,
      alt,
      caption,
      captionDesc,
      ...(videoSrc ? { videoSrc, kind: 'video' as const } : {}),
    };
  });
}

const eftShowcaseSlides = slide(...EFT_SHOWCASE_GALLERY_KEYS);

const hwidGalleryRaw = {
  hwidSerialCheck: {
    src: '/images/hwid-spoofer/hwid-spoofer-serial-check-panel.webp',
    alt: 'Operator portal serial screen with disk, board, display, UUID, GPU, and network rows marked changed or unchanged beside a check-serials action.',
    caption: 'Identifier diff view',
    captionDesc: 'Each hardware identifier row shows whether its value changed after the spoof.',
  },
  hwidUefiSpoof: {
    src: '/images/hwid-spoofer/hwid-spoofer-uefi-spoof-panel.webp',
    alt: 'UEFI spoof tab showing permanent spoof switch, GPU and ethernet toggles, and a seed field on a dark mountain-themed dashboard.',
    caption: 'UEFI toggle board',
    captionDesc:
      'Enable GPU or ethernet spoofing, set a seed, and trigger permanent spoof without leaving the UEFI tab.',
  },
} satisfies Record<
  string,
  { src: string; alt: string; caption: string; captionDesc: string; videoSrc?: string }
>;

type HwidGalleryKey = keyof typeof hwidGalleryRaw;

function hwidSlide(...keys: HwidGalleryKey[]): ProductSlide[] {
  return keys.map((key) => {
    const item = hwidGalleryRaw[key];
    const { src, alt, caption, captionDesc, videoSrc } = item;
    return {
      src,
      alt,
      caption,
      captionDesc,
      ...(videoSrc ? { videoSrc, kind: 'video' as const } : {}),
    };
  });
}

const hwidShowcaseSlides = hwidSlide(...HWID_GALLERY_KEYS);

const ugcShowcaseSlides: ProductSlide[] = [
  {
    src: '/images/ugc/ugc.webp',
    alt: 'Red gear with a clock inside and motion lines, the UGC mark.',
    caption: 'UGC',
    captionDesc: 'Custom appeal workflows and dispute automation for restricted accounts.',
  },
];

const skinChangerShowcaseSlides: ProductSlide[] = [
  {
    src: '/images/skin-changer/skin-changer.webp',
    alt: 'Skin Changer emblem: a metal shield reading Skin Changer, with crossed rifles, revolvers and stars.',
    caption: 'Skin Changer',
    captionDesc: 'Premium weapon skins, character outfits and rare knife variants.',
  },
];

function slugFromHref(href: string): string {
  const normalized = href.replace(/^\//, '').replace(/\/$/, '');
  for (const slug of ALL_UTILITY_PRODUCT_SLUGS) {
    if (normalized === slug || normalized.endsWith(`/${slug}`)) return slug;
  }
  const segment = href.replace(productBase, '').replace(/^\//, '').replace(/\/$/, '');
  if (!segment || segment === 'dota-2-cheats' || segment === 'cheats' || segment === 'product') {
    return CHEATS_PRIMARY_SLUG;
  }
  return segment;
}

const tierAbout: Record<string, ProductPage['about']> = {
  elite: [
    {
      type: 'p',
      text: 'This license covers main Escape From Tarkov raids with player ESP, loot ESP, aimbot, no recoil, radar and extract helpers. Arena is a separate product key. Cloud DMA is required for full functionality.',
    },
    { type: 'h2', text: 'Tune before you queue' },
    {
      type: 'p',
      text: 'Load portal presets offline first, then raise ESP distance and aim smoothing over several sessions. Discord staff help with loader tabs if a module conflicts after a BattlEye patch.',
    },
  ],
};

const tierBodies: Record<string, ProductPage['body']> = {
  elite: [
    { type: 'h2', text: 'Plans and delivery' },
    {
      type: 'p',
      text: 'Choose monthly ($35 for 31 days) or lifetime ($150) at checkout. The operator portal unlocks instantly with loader download, preset library and patch notes. Check the live status banner before every session.',
    },
    { type: 'h2', text: 'Module layout' },
    {
      type: 'p',
      text: 'ESP, loot, aim, weapons, radar and utilities each have their own loader tab so you can disable combat assists while keeping loot filters during stash runs.',
    },
  ],
};

const utilityBodies: Record<string, ProductPage['body']> = {
  'hwid-spoofer': [
    { type: 'h2', text: 'When you need a spoofer' },
    {
      type: 'p',
      text: 'An HWID ban ties the punishment to your PC, not only to the account. The usual sign is that new accounts get banned straight away on one machine but work on another. The spoofer changes disk serials, MAC addresses, GPU IDs and related identifiers so you can come back on a clean hardware profile. It does not lift a ban on an existing account.',
    },
    { type: 'h2', text: 'Supported anti-cheats' },
    {
      type: 'p',
      text: 'It works across Riot Vanguard (Valorant), Easy Anti-Cheat, BattlEye, Ricochet (Call of Duty) and other systems such as ACE and Javelin. Confirm your game is covered before you buy, since support can change after anti-cheat updates.',
    },
    { type: 'h2', text: 'Cleaner included' },
    {
      type: 'p',
      text: 'Spoofing comes with cleanup steps that clear leftover traces before you launch the game again. Run the spoof and cleanup before you open the banned game, in the order the current setup guide gives.',
    },
    { type: 'h2', text: 'System requirements' },
    {
      type: 'p',
      text: 'Windows 10 or 11 (64-bit), administrator rights for the spoof and cleanup steps, HVCI, Core Isolation, TPM and Secure Boot turned on, and a stable connection for activation and updates.',
    },
  ],
  ugc: [
    { type: 'h2', text: 'What UGC is for' },
    {
      type: 'p',
      text: 'UGC (Unban & Governance Control) is an automation tool for recovering restricted accounts on any platform: gaming profiles, social media handles and marketplace storefronts. You build custom appeal workflows and automate dispute processes instead of handling each case by hand.',
    },
    { type: 'h2', text: 'Realistic expectations' },
    {
      type: 'p',
      text: 'UGC helps you prepare and manage appeals, but the platform reviewing them makes the final decision, and some bans are permanent. It does not change hardware identifiers, so it will not help when the ban is tied to your PC.',
    },
    { type: 'h2', text: 'System requirements' },
    {
      type: 'p',
      text: 'Windows 10 or 11 with HVCI, Core Isolation, TPM and Secure Boot turned on.',
    },
  ],
  'skin-changer': [
    { type: 'h2', text: 'What it unlocks' },
    {
      type: 'p',
      text: 'Skin Changer is a lightweight tool that unlocks premium weapon skins, character outfits and rare knife variants across major titles, so you do not have to buy each item through microtransactions.',
    },
    { type: 'h2', text: 'Cosmetics stay on your client' },
    {
      type: 'p',
      text: 'The cosmetics exist in your own game client. Nothing is added to your account, so the items cannot be traded or sold, and they are gone when you stop using the tool. Assume other players do not see them.',
    },
    { type: 'h2', text: 'Supported games' },
    {
      type: 'p',
      text: 'Coverage spans major titles and can change after game updates. Ask support to confirm your game is supported before you buy.',
    },
    { type: 'h2', text: 'System requirements' },
    {
      type: 'p',
      text: 'Windows 10 or 11 with HVCI, Core Isolation, TPM and Secure Boot turned on.',
    },
  ],
};

const productContent: Record<
  string,
  Pick<ProductPage, 'overview' | 'images' | 'fullFeatures' | 'goodToKnow' | 'limitations' | 'systemRequirements'>
> = {
  elite: {
    images: eftShowcaseSlides,
    goodToKnow: sharedGoodToKnow,
    limitations: sharedLimitations,
    systemRequirements: eftSystemRequirements,
    fullFeatures: [
      'Player ESP (box, skeleton, health, distance)',
      'PMC, Scav and boss ESP filters',
      'Loot ESP with category and price filters',
      'Container, corpse and quest item highlights',
      'Extract and transition markers',
      'Aimbot with FOV, smoothing and bone select',
      'No recoil and no sway toggles',
      'Stream-proof overlays',
      'Hotkeys and config save/load',
      '2D radar and OOF arrows',
      'Raids only (separate key from Arena)',
      'Instant delivery via operator portal',
      'Windows 10/11; Intel/AMD',
      'Check live status after BattlEye patches',
      'Cloud DMA required for full functionality',
    ],
    overview: {
      title: 'One license for PMC raids on Windows',
      paragraphs: [
        'Escape From Tarkov Cheats bundles awareness and combat modules for main raids: player and loot ESP, aimbot, no recoil, radar, extract markers and stream-proof overlays. The loader groups settings by tab so you can run loot-only profiles or full combat loadouts.',
        'Licenses cover Windows 10 and 11 on Intel or AMD, with HVCI, Core Isolation, TPM and Secure Boot turned on. Raids-only access excludes Arena, and Cloud DMA is required for full functionality. Monthly (31 days) and lifetime plans are listed at checkout. Confirm online status on {siteDomain} before you buy or launch.',
      ],
    },
  },
  'hwid-spoofer': {
    images: hwidShowcaseSlides,
    goodToKnow:
      'Run the spoof and cleanup steps before you launch the banned game, in the order the current setup guide gives. Confirm your game and its anti-cheat are supported before you buy.',
    limitations:
      'Built for hardware ID bans; it does not lift a ban on an existing account. Using a spoofer can break game terms and lead to further bans. Support for a game can change after anti-cheat updates without notice.',
    systemRequirements: [
      { icon: 'reqWindows', text: 'Windows 10 or 11, 64-bit.' },
      { icon: 'reqSettings', text: 'Administrator rights for the spoof and cleanup steps.' },
      ...windowsSecurityRequirements,
      { icon: 'reqWifi', text: 'Stable internet for activation and updates.' },
    ],
    fullFeatures: [
      'Disk serial spoofing',
      'MAC address spoofing',
      'GPU ID spoofing',
      'Related hardware IDs spoofed',
      'Cleaner included',
      'Riot Vanguard (Valorant)',
      'Easy Anti-Cheat titles',
      'BattlEye titles',
      'Ricochet (Call of Duty)',
      'ACE, Javelin and other anti-cheats',
    ],
    overview: {
      title: 'Hardware ID ban recovery across major anti-cheats',
      paragraphs: [
        'HWID Spoofer changes disk serials, MAC addresses, GPU IDs and related identifiers so you can come back after a hardware ban on a clean hardware profile. It covers Riot Vanguard, Easy Anti-Cheat, BattlEye, Ricochet and other anti-cheats, and a cleaner is included.',
        'Use it when new accounts get banned straight away on your PC but work on another. It does not lift a ban on an existing account. Monthly (31 days) and lifetime plans include the same tool.',
      ],
    },
  },
  ugc: {
    images: ugcShowcaseSlides,
    goodToKnow:
      'UGC prepares and manages appeals; the platform reviewing your case makes the final call. Have your account details and any proof of ownership ready before you start.',
    limitations:
      'No tool can guarantee an unban, and some bans are permanent. UGC does not change hardware identifiers or bypass platform security, and false or misleading information in an appeal will hurt your case.',
    systemRequirements: [
      { icon: 'reqWindows', text: 'Windows 10 or 11, 64-bit.' },
      ...windowsSecurityRequirements,
      { icon: 'reqWifi', text: 'Stable internet after purchase.' },
    ],
    fullFeatures: [
      'Custom appeal workflows',
      'Dispute process automation',
      'Works on any platform',
      'Gaming profiles',
      'Social media handles',
      'Marketplace storefronts',
      'Monthly (31 days) or lifetime access',
      'Windows 10 and 11',
    ],
    overview: {
      title: 'Account recovery for any platform',
      paragraphs: [
        'UGC (Unban & Governance Control) is an automation tool for recovering restricted accounts on gaming, social media and marketplace platforms. Build custom appeal workflows and automate dispute processes instead of handling each case by hand.',
        'It cannot guarantee a result, since the platform still decides, and it does not help with hardware bans. Monthly (31 days) and lifetime plans unlock the same tool.',
      ],
    },
  },
  'skin-changer': {
    images: skinChangerShowcaseSlides,
    goodToKnow:
      'Cosmetics apply in your own game client, and nothing is added to your account. Ask support to confirm your game is supported before you buy.',
    limitations:
      'Third-party tools can violate game terms and lead to account action, even for cosmetics. Skins are not real items, cannot be traded, and disappear when the tool is off. Supported titles and items can change after game or Windows updates without notice.',
    systemRequirements: [
      { icon: 'reqWindows', text: 'Windows 10 or 11, 64-bit.' },
      ...windowsSecurityRequirements,
      { icon: 'reqWifi', text: 'Stable internet and loader access after purchase.' },
    ],
    fullFeatures: [
      'Premium weapon skins',
      'Character outfits',
      'Rare knife variants',
      'Works across major titles',
      'Lightweight tool',
      'Cosmetics stay on your client',
      'Monthly (31 days) or lifetime access',
      'Windows 10 and 11',
    ],
    overview: {
      title: 'Premium cosmetics without the microtransactions',
      paragraphs: [
        'Skin Changer is a lightweight tool that unlocks premium weapon skins, character outfits and rare knife variants across major titles, without buying each item.',
        'Cosmetics apply in your own game client, and nothing is added to your account. Monthly (31 days) and lifetime plans include the same tool. Confirm your game is supported before you buy.',
      ],
    },
  },
};

const utilityAcquisitionSteps: Record<UtilityProductSlug, AcquisitionStep[]> = {
  [HWID_SPOOFER_SLUG]: hwidAcquisitionSteps,
  [UGC_SLUG]: ugcAcquisitionSteps,
  [SKIN_CHANGER_SLUG]: skinChangerAcquisitionSteps,
};

function buildTierPages(t: Translations): ProductPage[] {
  return t.cheats.items.map((cheat) => {
    const slug = slugFromHref(cheat.href);
    const content = productContent[slug];
    const displayName = CHEAT_PRODUCT_NAME;
    return {
      slug,
      kind: 'tier',
      badge: cheat.badge,
      tier: cheat.tier,
      name: cheat.name,
      title: cheat.title,
      subtitle: cheat.heroDesc ?? cheat.desc,
      desc: cheat.desc,
      features: cheat.features,
      more: cheat.more,
      variant: cheat.variant,
      buyUrl: checkoutForSlug(slug),
      images: content.images,
      overview: content.overview,
      acquisition: acquisitionFor(displayName),
      goodToKnow: content.goodToKnow,
      limitations: content.limitations,
      fullFeatures: content.fullFeatures,
      systemRequirements: content.systemRequirements,
      about: tierAbout[slug],
      body: tierBodies[slug] ?? [],
      relatedBlogSlugs: productRelatedBlogSlugs[slug] ?? [],
      relatedForumSlugs: productRelatedForumSlugs[slug] ?? [],
    };
  });
}

function findProductCard(t: Translations, slug: UtilityProductSlug) {
  const match = (items: Translations['products']['items']) =>
    items.find((item) => slugFromHref(item.href) === slug);
  return match(t.products.items) ?? match(getTranslations('en').products.items);
}

function buildUtilityPages(t: Translations): ProductPage[] {
  return UTILITY_PRODUCT_SLUGS.flatMap((slug) => {
    const product = findProductCard(t, slug);
    const content = productContent[slug];
    if (!product || !content) return [];

    return [
      {
        slug,
        kind: 'utility' as const,
        badge: product.badge,
        category: product.category,
        name: product.title,
        title: product.title,
        subtitle: product.subtitle,
        desc: product.desc,
        features: product.features,
        more: Math.max(0, content.fullFeatures.length - product.features.length),
        buyUrl: checkoutForSlug(slug),
        images: content.images,
        overview: content.overview,
        acquisition: {
          title: acquisitionFor(product.title).title,
          steps: utilityAcquisitionSteps[slug],
        },
        goodToKnow: content.goodToKnow,
        limitations: content.limitations,
        fullFeatures: content.fullFeatures,
        systemRequirements: content.systemRequirements,
        body: utilityBodies[slug] ?? [],
        relatedBlogSlugs: productRelatedBlogSlugs[slug] ?? [],
        relatedForumSlugs: productRelatedForumSlugs[slug] ?? [],
      },
    ];
  });
}

export function getProductPages(locale: SiteLocale): ProductPage[] {
  const t = getTranslations(locale);
  return [...buildTierPages(t), ...buildUtilityPages(t)].map((page) =>
    deepApplySiteTokens(applyProductCopy(page, locale)),
  );
}

export function getCheatPages(locale: SiteLocale) {
  return getProductPages(locale).filter((p) => p.kind === 'tier');
}

export function getProductPage(slug: string, locale: SiteLocale) {
  return getProductPages(locale).find((p) => p.slug === slug);
}

/** Tier slugs for sitemap extras, store lives at `PRODUCT_BASE` only. */
export function getAllProductSlugs(): string[] {
  const slugs = getAllCheatSlugs();
  const catalog = new Set<string>(CHEAT_PRODUCT_SLUGS);
  for (const slug of slugs) {
    if (!catalog.has(slug as (typeof CHEAT_PRODUCT_SLUGS)[number])) {
      throw new Error(`Cheat slug "${slug}" missing from CHEAT_PRODUCT_SLUGS in src/config/catalog.ts`);
    }
  }
  return [];
}

export function getHwidSpooferPage(locale: SiteLocale) {
  return getProductPage(HWID_SPOOFER_SLUG, locale);
}

export function getUtilityPages(locale: SiteLocale) {
  return getProductPages(locale).filter((p) => p.kind === 'utility');
}

export function utilityProductPath(slug: UtilityProductSlug): string {
  return UTILITY_PRODUCT_PATHS[slug];
}

export function getAllCheatSlugs() {
  return getCheatPages('en').map((p) => p.slug);
}

export function getHeroSlides(_locale: SiteLocale): ProductSlide[] {
  return eftShowcaseSlides;
}

const productCopyByLocale: Record<Exclude<SiteLocale, 'en'>, ProductCopyBundle> = {
  es: esProductCopy as ProductCopyBundle,
  de: deProductCopy as ProductCopyBundle,
  fr: frProductCopy as ProductCopyBundle,
};

function acquisitionTitleFor(productName: string) {
  return `How to get ${productName}`;
}

function buildEnglishProductCopyBundle(): ProductCopyBundle {
  const tierSlugs = ['elite'] as const;
  const utilitySlugs = ALL_UTILITY_PRODUCT_SLUGS;

  const tiers = Object.fromEntries(
    tierSlugs.map((slug) => {
      const content = productContent[slug];
      const displayName = CHEAT_PRODUCT_NAME;
      return [
        slug,
        {
          about: tierAbout[slug],
          body: tierBodies[slug] ?? [],
          overview: content.overview,
          goodToKnow: content.goodToKnow,
          limitations: content.limitations,
          acquisitionTitle: acquisitionTitleFor(displayName),
        },
      ];
    }),
  ) as ProductCopyBundle['tiers'];

  const utilities = Object.fromEntries(
    utilitySlugs.map((slug) => {
      const content = productContent[slug];
      const title = findProductCard(getTranslations('en'), slug)?.title ?? slug;
      return [
        slug,
        {
          body: utilityBodies[slug] ?? [],
          overview: content.overview,
          goodToKnow: content.goodToKnow,
          limitations: content.limitations,
          acquisitionTitle: acquisitionTitleFor(title),
          acquisitionSteps: utilityAcquisitionSteps[slug],
          systemRequirements: content.systemRequirements.map((r) => r.text),
        },
      ];
    }),
  ) as ProductCopyBundle['utilities'];

  return {
    sharedGoodToKnow,
    sharedLimitations,
    acquisitionSteps: defaultAcquisitionSteps.map(({ num, title, desc }) => ({ num, title, desc })),
    systemRequirements: eftSystemRequirements.map((r) => r.text),
    gallery: Object.values(galleryRaw).map(({ alt, caption, captionDesc }) => ({
      alt,
      caption,
      captionDesc,
    })),
    tiers,
    utilities,
  };
}

registerProductCopyBundle(buildEnglishProductCopyBundle());

export const heroSlides = getHeroSlides('en');

function productCopyFor(locale: SiteLocale): ProductCopyBundle {
  if (locale === 'en') return getProductCopyBundle();
  return productCopyByLocale[locale];
}

function applyProductCopy(page: ProductPage, locale: SiteLocale): ProductPage {
  if (locale === 'en') return page;
  const copy = productCopyFor(locale);
  const bucket = page.kind === 'tier' ? copy.tiers[page.slug] : copy.utilities[page.slug];
  if (!bucket) return page;

  const isTier = page.kind === 'tier';
  const localizedSteps = isTier ? copy.acquisitionSteps : 'acquisitionSteps' in bucket ? bucket.acquisitionSteps : undefined;
  const localizedRequirements = isTier
    ? copy.systemRequirements
    : 'systemRequirements' in bucket
      ? bucket.systemRequirements
      : undefined;

  const acquisition: ProductAcquisition = {
    title: bucket.acquisitionTitle,
    steps: localizedSteps?.map((step) => ({ ...step })) ?? page.acquisition.steps,
  };

  const localizedGallery = isTier ? copy.gallery : 'gallery' in bucket ? bucket.gallery : undefined;
  const images = localizedGallery
    ? page.images.map((slide, index) => {
        const g = localizedGallery[index];
        if (!g) return slide;
        return { ...slide, alt: g.alt, caption: g.caption, captionDesc: g.captionDesc };
      })
    : page.images;
  const fullFeatures =
    'fullFeatures' in bucket && bucket.fullFeatures?.length ? bucket.fullFeatures : page.fullFeatures;

  const systemRequirements = page.systemRequirements.map((req, index) => ({
    ...req,
    text: localizedRequirements?.[index] ?? req.text,
  }));

  return {
    ...page,
    overview: bucket.overview,
    body: bucket.body,
    about: 'about' in bucket ? bucket.about : page.about,
    goodToKnow: bucket.goodToKnow,
    limitations: bucket.limitations,
    acquisition,
    images,
    fullFeatures,
    systemRequirements,
  };
}

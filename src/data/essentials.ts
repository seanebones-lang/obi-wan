export type EssentialTopic = {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  sections: { headingKey: string; bodyKey: string }[];
  mapAnchorId?: string;
  externalLinks?: { labelKey: string; url: string }[];
};

export const essentialTopics: EssentialTopic[] = [
  {
    slug: "getting-around",
    titleKey: "essentials.gettingAround.title",
    descriptionKey: "essentials.gettingAround.description",
    icon: "train",
    sections: [
      {
        headingKey: "essentials.gettingAround.dartHeading",
        bodyKey: "essentials.gettingAround.dartBody",
      },
      {
        headingKey: "essentials.gettingAround.treHeading",
        bodyKey: "essentials.gettingAround.treBody",
      },
      {
        headingKey: "essentials.gettingAround.gopassHeading",
        bodyKey: "essentials.gettingAround.gopassBody",
      },
      {
        headingKey: "essentials.gettingAround.rideshareHeading",
        bodyKey: "essentials.gettingAround.rideshareBody",
      },
    ],
    externalLinks: [
      {
        labelKey: "essentials.gettingAround.gopassLink",
        url: "https://www.dart.org/guide/gopass",
      },
      {
        labelKey: "essentials.gettingAround.dartLink",
        url: "https://www.dart.org",
      },
    ],
  },
  {
    slug: "know-before-you-go",
    titleKey: "essentials.knowBefore.title",
    descriptionKey: "essentials.knowBefore.description",
    icon: "info",
    sections: [
      {
        headingKey: "essentials.knowBefore.emergencyHeading",
        bodyKey: "essentials.knowBefore.emergencyBody",
      },
      {
        headingKey: "essentials.knowBefore.tippingHeading",
        bodyKey: "essentials.knowBefore.tippingBody",
      },
      {
        headingKey: "essentials.knowBefore.weatherHeading",
        bodyKey: "essentials.knowBefore.weatherBody",
      },
      {
        headingKey: "essentials.knowBefore.powerHeading",
        bodyKey: "essentials.knowBefore.powerBody",
      },
    ],
  },
  {
    slug: "bbq-trail",
    titleKey: "essentials.bbq.title",
    descriptionKey: "essentials.bbq.description",
    icon: "flame",
    mapAnchorId: "downtown-dallas",
    sections: [
      {
        headingKey: "essentials.bbq.introHeading",
        bodyKey: "essentials.bbq.introBody",
      },
      {
        headingKey: "essentials.bbq.tipsHeading",
        bodyKey: "essentials.bbq.tipsBody",
      },
    ],
  },
  {
    slug: "deep-ellum",
    titleKey: "essentials.deepEllum.title",
    descriptionKey: "essentials.deepEllum.description",
    icon: "music",
    mapAnchorId: "deep-ellum",
    sections: [
      {
        headingKey: "essentials.deepEllum.introHeading",
        bodyKey: "essentials.deepEllum.introBody",
      },
    ],
  },
  {
    slug: "fort-worth-stockyards",
    titleKey: "essentials.stockyards.title",
    descriptionKey: "essentials.stockyards.description",
    icon: "horse",
    mapAnchorId: "fort-worth-stockyards",
    sections: [
      {
        headingKey: "essentials.stockyards.introHeading",
        bodyKey: "essentials.stockyards.introBody",
      },
    ],
  },
  {
    slug: "official-links",
    titleKey: "essentials.official.title",
    descriptionKey: "essentials.official.description",
    icon: "link",
    sections: [
      {
        headingKey: "essentials.official.introHeading",
        bodyKey: "essentials.official.introBody",
      },
    ],
    externalLinks: [
      {
        labelKey: "essentials.official.fifaTickets",
        url: "https://www.fifa.com/en/tickets",
      },
      {
        labelKey: "essentials.official.fanFestival",
        url: "https://www.dallasfwc26.com",
      },
      {
        labelKey: "essentials.official.visitDallas",
        url: "https://www.visitdallas.com/sports-recreation/fifa-world-cup-2026-dallas/",
      },
    ],
  },
];

export function getEssentialTopic(slug: string): EssentialTopic | undefined {
  return essentialTopics.find((t) => t.slug === slug);
}

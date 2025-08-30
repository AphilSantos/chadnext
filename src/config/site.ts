export const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://pokereditpro.com";

export const siteConfig = (locale: string = "en") => ({
  name: "Poker Edit Pro | Make Your Poker Videos Go Viral",
  url: siteUrl + "/" + locale,
  ogImage: `${siteUrl}/${locale}/opengraph-image`,
  description:
    "Professional video editing services for poker players and content creators. Transform your raw footage into viral-worthy content.",
  links: {
    twitter: "https://twitter.com/pokereditpro",
    github: "https://github.com/pokereditpro",
  },
});

export type SiteConfig = typeof siteConfig;

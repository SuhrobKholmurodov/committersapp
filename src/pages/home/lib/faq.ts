import type { JsonLdNode } from "@/shared/seo";

export interface FaqItem {
  question: string;
  answer: string;
}

export const buildHomeFaq = (countriesCount: number): FaqItem[] => [
  {
    question: "How is the GitHub committers ranking calculated?",
    answer:
      "The data comes from committers.top, which finds GitHub users by the location set in their public profile and ranks them by contribution activity. The Commits tab ranks developers by public commits, Contributions counts all public contributions, and All also includes private contributions that users choose to show on their profile.",
  },
  {
    question: "How can I appear in the ranking for my country?",
    answer:
      "Set the location field of your public GitHub profile to your country, for example \"Tajikistan\". Users also need a minimum number of followers to be considered, and the threshold depends on the country.",
  },
  {
    question: "How often are the rankings updated?",
    answer:
      "Rankings are refreshed every few days. The date of the last update is shown at the bottom of every country page.",
  },
  {
    question: "Which countries are covered?",
    answer:
      countriesCount > 0
        ? `CommittersTop tracks ${countriesCount} countries and regions, including a worldwide ranking of the most active GitHub users.`
        : "CommittersTop tracks more than 150 countries and regions, including a worldwide ranking of the most active GitHub users.",
  },
];

export const buildFaqJsonLd = (items: FaqItem[]): JsonLdNode => ({
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

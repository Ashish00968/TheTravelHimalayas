interface ContentItem {
  slug: string;
  region: string;
  difficulty?: string;
}

export function getRelatedContent<T extends ContentItem>(
  current: T,
  allItems: T[],
  limit: number = 3
): T[] {
  return allItems
    .filter(
      (item) =>
        item.slug !== current.slug &&
        (item.region === current.region || item.difficulty === current.difficulty)
    )
    .slice(0, limit);
}

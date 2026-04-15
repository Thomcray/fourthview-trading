"use client";

import { useMemo } from "react";
import { Products } from "@/components/AppContext";

export interface TopPick extends Products {
  badge?: string;
  score: number;
  reasons: string[];
  savingsPercent?: number;
}

interface UseTopPicksOptions {
  limit?: number;
  shuffle?: boolean;
  requireImages?: boolean;
  minSavingsThreshold?: number;
}

export function useTopPicks(
  products: Products[],
  categorySlug: string,
  options: UseTopPicksOptions = {},
): TopPick[] {
  const {
    limit = 8,
    shuffle = true,
    requireImages = true,
    minSavingsThreshold = 10,
  } = options;

  return useMemo(() => {
    const categoryProducts = categorySlug
      ? products.filter((p) => p.slug === categorySlug)
      : products;

    if (categoryProducts.length === 0) return [];

    const now = Date.now();
    const oneDay = 1000 * 60 * 60 * 24;

    const allSavings = categoryProducts
      .map((p) => {
        if (!p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
        return ((p.compareAtPrice - p.price) / p.compareAtPrice) * 100;
      })
      .filter((s) => s > 0);

    const maxCategorySavings =
      allSavings.length > 0 ? Math.max(...allSavings) : 0;
    const avgCategorySavings =
      allSavings.length > 0
        ? allSavings.reduce((a, b) => a + b, 0) / allSavings.length
        : 0;

    const scored = categoryProducts.map((product): TopPick => {
      let score = 50;
      const reasons: string[] = [];
      let savingsPercent: number | undefined;

      if (
        requireImages &&
        (!product.imageUrl || product.imageUrl.length === 0)
      ) {
        score -= 100;
      }

      if (product.discount && product.discount > 0) {
        score += Math.min(product.discount * 1.2, 30);
        reasons.push(`${product.discount}% off`);
      }

      const daysSinceAdded =
        (now - new Date(product.created_at).getTime()) / oneDay;
      if (daysSinceAdded < 14) {
        score += Math.max(20 - daysSinceAdded * 1.5, 0);
        if (daysSinceAdded < 3) reasons.push("Just added");
        else if (daysSinceAdded < 7) reasons.push("New this week");
      }

      const hasColors = product.colours && product.colours.length > 0;
      const hasSizes = product.sizes && product.sizes.length > 0;
      if (hasColors && hasSizes) {
        score += 10;
        if (product.colours.length > 2 && product.sizes.length > 3) {
          score += 5;
          reasons.push("Multiple options");
        }
      }

      const effectiveCompareAt =
        product.compareAtPrice ||
        (product.discount
          ? product.price / (1 - product.discount / 100)
          : null);

      if (effectiveCompareAt && effectiveCompareAt > product.price) {
        const savingsAmount = effectiveCompareAt - product.price;
        savingsPercent = (savingsAmount / effectiveCompareAt) * 100;

        if (savingsPercent >= minSavingsThreshold) {
          let pricingBoost = 0;

          if (savingsPercent >= 50) {
            pricingBoost = 25;
            reasons.push(`Save ${Math.round(savingsPercent)}%`);
          } else if (savingsPercent >= 30) {
            pricingBoost = 18;
            reasons.push(`Save $${savingsAmount.toFixed(0)}`);
          } else if (savingsPercent >= 20) {
            pricingBoost = 12;
            reasons.push(`${Math.round(savingsPercent)}% off`);
          } else {
            pricingBoost = 8;
            reasons.push("Good value");
          }

          if (
            savingsPercent >= maxCategorySavings * 0.95 &&
            savingsPercent >= 20
          ) {
            pricingBoost += 10;
            reasons.push("Best deal");
          } else if (
            savingsPercent > avgCategorySavings * 1.3 &&
            avgCategorySavings > 0
          ) {
            pricingBoost += 5;
          }

          score += pricingBoost;
        }
      }

      let badge: string | undefined;
      if (reasons.includes("Best deal")) {
        badge = "Best Deal";
      } else if (savingsPercent && savingsPercent >= 30) {
        badge = `-${Math.round(savingsPercent)}%`;
      } else if (daysSinceAdded < 3) {
        badge = "New";
      } else if (reasons.includes("Multiple options")) {
        badge = "Trending";
      }

      return {
        ...product,
        score: Math.round(score),
        reasons: reasons.slice(0, 3),
        badge,
        savingsPercent: savingsPercent ? Math.round(savingsPercent) : undefined,
      };
    });

    const sorted = scored.sort((a, b) => b.score - a.score);
    let topItems = sorted.slice(0, limit);

    if (shuffle && topItems.length > 3) {
      const fixed = topItems.slice(0, 3);
      const variable = topItems.slice(3).sort(() => Math.random() - 0.5);
      topItems = [...fixed, ...variable];
    }

    return topItems;
  }, [
    products,
    categorySlug,
    limit,
    shuffle,
    requireImages,
    minSavingsThreshold,
  ]);
}

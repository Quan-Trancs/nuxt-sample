import data from '@/lib/data'
import type { IRecipeInput, Item } from '@/types'

/* Get all published recipes */
const recipes = data.recipes

/* Get a recipe by its slug */
export const getRecipeBySlug = (slug: string): IRecipeInput | undefined => {
  return recipes.find((recipe) => recipe.slug === slug && recipe.isPublished)
}

/* Get all categories available in published recipes */
export const getAllCategories = (): string[] => {
  const categories = new Set<string>()
  for (const recipe of recipes) {
    if (recipe.isPublished) {
      categories.add(recipe.category)
    }
  }
  return Array.from(categories)
}

/* Get all recipes by category */
export const getRecipesByCategory = (category: string): IRecipeInput[] => {
  return recipes.filter(
    (recipe) => recipe.category === category && recipe.isPublished
  )
}

export function getRelatedRecipesByCategory({
  category,
  productId,
  limit = 4,
  page = 1,
}: {
  category: string
  productId: string
  limit?: number
  page: number
}) {
  const products = data.recipes as IRecipeInput[]

  // Filter: Published, same category, different ID
  const filtered = products.filter(
    (product) =>
      product.isPublished &&
      product.category === category &&
      product.id !== productId
  )

  // Sort by numSales descending
  const sorted = filtered.sort(
    (a, b) =>
      (b.avgRating * b.numReviews || 0) - (a.avgRating * a.numReviews || 0)
  )

  // Pagination
  const pageSize = limit || 20
  const start = (page - 1) * pageSize
  const paginated = sorted.slice(start, start + pageSize)

  return {
    data: paginated,
    totalPages: Math.ceil(filtered.length / pageSize),
  }
}

/* Get all recipes by tag */
export const getRecipesByTag = (tag: string): IRecipeInput[] => {
  return recipes.filter(
    (recipe) => recipe.tags?.includes(tag) && recipe.isPublished
  )
}

/* Get recipes for card */
export const getRecipesForCard = async ({
  tag,
  limit = 4,
}: {
  tag?: string
  limit?: number
}): Promise<Item[]> => {
  try {
    let filtered = recipes.filter((recipe: IRecipeInput) => recipe.isPublished)

    if (tag) {
      filtered = filtered.filter((recipe: IRecipeInput) =>
        recipe.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
      )
    }

    // Map IRecipeInput to Item (simplified version)
    const items: Item[] = filtered
      .slice(0, limit)
      .map((recipe: IRecipeInput) => ({
        name: recipe.name,
        href: `/recipe/${recipe.slug}`,
        image: recipe.images[0] || '', // Assume first image for the card
      }))

    return items
  } catch (error) {
    console.error('Error fetching recipes for card:', error)
    return []
  }
}

// GET ALL RECIPES
export function getAllRecipes({
  query,
  limit,
  page,
  category,
  tag,
  rating,
  sort,
}: {
  query: string
  category: string
  tag: string
  limit?: number
  page: number
  rating?: string
  sort?: string
}) {
  const pageSize = 20
  limit = limit || pageSize

  const queryFilter =
    query && query !== 'all'
      ? (recipe: IRecipeInput) =>
          recipe.name.toLowerCase().includes(query.toLowerCase())
      : () => true

  const categoryFilter =
    category && category !== 'all'
      ? (recipe: IRecipeInput) => recipe.category === category
      : () => true

  const tagFilter =
    tag && tag !== 'all'
      ? (recipe: IRecipeInput) => recipe.tags.includes(tag)
      : () => true

  const ratingFilter =
    rating && rating !== 'all'
      ? (recipe: IRecipeInput) => recipe.avgRating >= Number(rating)
      : () => true

  const difficultyRank = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
  }

  const order: (a: IRecipeInput, b: IRecipeInput) => number =
    sort === 'popularity'
      ? (a, b) => b.numReviews - a.numReviews
      : sort === 'prep-time-asc'
      ? (a, b) =>
          (a.avgRating * a.numReviews || 0) - (b.avgRating * a.numReviews || 0)
      : sort === 'prep-time-desc'
      ? (a, b) =>
          (b.avgRating * a.numReviews || 0) - (a.avgRating * b.numReviews || 0)
      : sort === 'difficulty'
      ? (a, b) =>
          (difficultyRank[a.difficulty as keyof typeof difficultyRank] || 0) -
          (difficultyRank[b.difficulty as keyof typeof difficultyRank] || 0)
      : sort === 'calories-asc'
      ? (a, b) => (a.caloriesPerServing || 0) - (b.caloriesPerServing || 0)
      : sort === 'calories-desc'
      ? (a, b) => (b.caloriesPerServing || 0) - (a.caloriesPerServing || 0)
      : (a, b) => a.name.localeCompare(b.name)
  const filteredRecipes = recipes
    .filter(
      (recipe) =>
        recipe.isPublished &&
        queryFilter(recipe) &&
        categoryFilter(recipe) &&
        tagFilter(recipe) &&
        ratingFilter(recipe)
    )
    .sort(order)

  const totalRecipes = filteredRecipes.length
  const slicedRecipes = filteredRecipes.slice(
    limit * (Number(page) - 1),
    limit * page
  )

  return {
    slicedRecipes,
    totalPages: Math.ceil(totalRecipes / limit),
    totalRecipes,
    from: limit * (Number(page) - 1) + 1,
    to: limit * (Number(page) - 1) + recipes.length,
  }
}

// GET ALL TAGS
export function getAllTags() {
  const allTags = new Set<string>()
  recipes.forEach((recipe) => recipe.tags.forEach((tag) => allTags.add(tag)))

  return Array.from(allTags).sort((a, b) => a.localeCompare(b))
}

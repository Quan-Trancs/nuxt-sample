import type { IReview } from '~/types'
import data from '~/lib/data'

const recipes = data.recipes

export const getReviewsBySlug = (
  slug: string,
  page: number = 1,
  pageSize: number = 5
): { reviews: IReview[] | undefined; totalPages: number | undefined } => {
  const recipe = recipes.find(
    (recipe) => recipe.slug === slug && recipe.isPublished
  )

  if (recipe) {
    const totalReviews = recipe.reviews.length
    const totalPages = Math.ceil(totalReviews / pageSize)

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const reviews = recipe.reviews.slice(start, end)

    return { reviews, totalPages }
  }

  return { reviews: undefined, totalPages: undefined }
}

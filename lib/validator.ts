import { z } from 'zod'

// ========== USER ==========

const UserName = z
  .string()
  .min(1, { message: 'Name is required' })
  .max(50, { message: 'Name must be at most 50 characters' })

const UserEmail = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Email is invalid' })

const UserPassword = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters' })
  .max(20, { message: 'Password must be at most 20 characters' })

const UserRole = z.string().min(1, { message: 'Role is required' })

export const UserInputSchema = z.object({
  name: UserName,
  email: UserEmail,
  image: z.string().url().optional(),
  emailVerified: z.boolean().default(false),
  password: UserPassword,
  role: UserRole,
})

export const UserSignInSchema = z.object({
  email: UserEmail,
  password: UserPassword,
})

export const UserSignUpSchema = UserSignInSchema.extend({
  name: UserName,
  confirmPassword: UserPassword,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Used for author field in recipes
export const AuthorInputSchema = z.object({
  name: UserName,
  email: UserEmail,
  image: z.string().url().optional(),
})

// ========== RECIPE ==========
export const ReviewSchema = z.object({
  id: z.string(),
  author: AuthorInputSchema,
  reviewerName: z.string(),
  rating: z.number(),
  comment: z.string(),
  date: z.preprocess((arg) => {
    // Use preprocess to handle potential string dates
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg)
    }
    return arg
  }, z.date()), // Validates that date is a Date object (handles string conversion)
})

export const RecipeInputSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'Recipe name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  author: AuthorInputSchema.optional(),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  description: z.string().min(1, 'Description is required'),
  isPublished: z.boolean(),
  tags: z.array(z.string()).default([]),
  avgRating: z.coerce
    .number()
    .min(0, 'Average rating must be a non-negative number')
    .max(5, 'Average rating must be a number between 0 and 5'),
  numReviews: z.coerce.number().int().nonnegative({
    message: 'Number of reviews must be a non-negative integer',
  }),
  ratingDistribution: z
    .array(z.object({ rating: z.number(), count: z.number() }))
    .max(5, 'Rating distribution cannot exceed 5 entries'),
  reviews: z.array(ReviewSchema).default([]),

  ingredients: z.array(z.string()).min(1, 'Ingredients cannot be empty'),
  instructions: z.array(z.string()).min(1, 'Instructions cannot be empty'),
  prepTimeMinutes: z.coerce
    .number()
    .min(0, 'Prep time must be a non-negative number'),
  cookTimeMinutes: z.coerce
    .number()
    .min(0, 'Cook time must be a non-negative number'),
  servings: z.coerce.number().int().min(1, 'Servings must be at least 1'),
  difficulty: z.string().min(1, 'Difficulty level is required'),
  cuisine: z.string().min(1, 'Cuisine type is required'),
  caloriesPerServing: z.coerce
    .number()
    .min(0, 'Calories per serving must be a non-negative number'),
})

// ========== USER'S LIBRARY (Saved Recipes Collection) ==========

export const LibraryItemSchema = z.object({
  recipeId: z.string(),
  name: z.string(),
  slug: z.string(),
  category: z.string(),
  image: z.string().url(),
})

export const LibrarySchema = z.object({
  items: z
    .array(LibraryItemSchema)
    .min(1, 'Library must contain at least one recipe'),
})

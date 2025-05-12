import type {
  LibraryItemSchema,
  LibrarySchema,
  RecipeInputSchema,
  ReviewSchema,
  UserInputSchema,
  UserSignInSchema,
  UserSignUpSchema,
} from '@/lib/validator'
import type { z } from 'zod'

export type IRecipeInput = z.infer<typeof RecipeInputSchema>

export type Data = {
  users: IUserInput[]
  recipes: IRecipeInput[]
  headerMenus: {
    name: string
    href: string
  }[]

  carousels: {
    image: string
    title: string
    url: string
    buttonCaption: string
    isPublished: boolean
  }[]
}

//LIBRARY
export type LibraryItem = z.infer<typeof LibraryItemSchema>
export type Library = z.infer<typeof LibrarySchema>

export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUserSignUp = z.infer<typeof UserSignUpSchema>

// External Item interface
export interface Item {
  name: string
  href: string
  image: string
  items?: string[] // Optional array of strings
}

export interface IRecipe extends IRecipeInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export type IReview = z.infer<typeof ReviewSchema>

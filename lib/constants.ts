export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Nuxt App'
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
export const APP_SLOGAN = process.env.NEXT_PUBLIC_APP_SLOGAN || 'Slogan'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Description'

export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `Copyright © 2025 ${APP_NAME}. All rights reserved.`

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 10)

//sender
export const SENDER_EMAIL = 'quantrancs@gmail.com'
export const SENDER_NAME = 'Nuxt Examples'

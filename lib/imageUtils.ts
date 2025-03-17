const BASE_URL = "https://philippmasur.de/research/photogram/"

export function getImageUrl(filename: string): string {
  if (!filename) return "/placeholder.svg"
  return `${BASE_URL}${filename}.jpg`
}

export function getAvatarUrl(filename: string): string {
  if (!filename) return "/placeholder.svg"
  return `${BASE_URL}${filename}.jpg`
}


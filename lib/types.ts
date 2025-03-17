export interface Post {
  id: string
  username: string
  userAvatar?: string
  contentUrl: string
  contentType: "image" | "video"
  caption: string
  likes: number
  comments?: Comment[]
  timestamp?: string
  location?: string
}

export interface Comment {
  id: string
  username: string
  text: string
  timestamp: string
}

export interface PostProps {
  post: Post
  onAddComment: (postId: string, comment: Comment) => void
}


"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Send, Bookmark, X } from "lucide-react"
import type { Post, Comment } from "@/lib/types"
import { formatTimestamp } from "@/lib/dateUtils"
import { parseISO, compareDesc } from "date-fns"
import { useUser } from "@/contexts/UserContext" // Add this import

interface PostModalProps {
  post: Post
  onClose: () => void
  onAddComment: (postId: string, comment: Comment) => void
}

export default function PostModal({ post, onClose, onAddComment }: PostModalProps) {
  const [newComment, setNewComment] = React.useState("")
  const [comments, setComments] = React.useState<Comment[]>(() => {
    return Array.isArray(post.comments) ? post.comments : []
  })
  const [imageError, setImageError] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const { username } = useUser() // Get the current username from UserContext

  const handleImageError = () => {
    setImageError(true)
  }

  const handleAvatarError = () => {
    setAvatarError(true)
  }

  useEffect(() => {
    setImageError(false)
    setAvatarError(false)
  }, [post.contentUrl, post.userAvatar])

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      const comment: Comment = {
        id: `c${Date.now()}`,
        username: username, // Use the actual username
        text: newComment.trim(),
        timestamp: new Date().toISOString(),
      }
      setComments((prevComments) => [comment, ...prevComments]) // Add new comment to the beginning
      onAddComment(post.id, comment)
      setNewComment("")
    }
  }

  // Sort comments in descending order
  const sortedComments = [...comments].sort((a, b) => compareDesc(parseISO(a.timestamp), parseISO(b.timestamp)))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-6xl h-[90vh] flex">
        {/* Left side - Image/Video */}
        <div className="w-2/3 relative bg-black flex items-center justify-center">
          {post.contentType === "image" ? (
            imageError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                Image not available
              </div>
            ) : (
              <Image
                src={post.contentUrl || "/placeholder.svg"}
                alt={post.caption}
                layout="fill"
                objectFit="contain"
                onError={handleImageError}
              />
            )
          ) : (
            <video src={post.contentUrl} controls className="max-w-full max-h-full" />
          )}
        </div>

        {/* Right side - Post details */}
        <div className="w-1/3 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {avatarError ? (
                  <AvatarFallback>{post.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                ) : (
                  <AvatarImage src={post.userAvatar} alt={post.username} onError={handleAvatarError} />
                )}
              </Avatar>
              <span className="font-semibold">{post.username}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Caption and Comments */}
          <div className="flex-grow overflow-y-auto p-4">
            <p className="mb-4">
              <span className="font-semibold mr-2">{post.username}</span>
              {post.caption}
            </p>
            {sortedComments.map((comment) => (
              <div key={`modal-comment-${comment.id}`} className="mb-2">
                <span className="font-semibold mr-2">{comment.username}</span>
                {comment.text}
                <p className="text-xs text-gray-500 mt-1">{formatTimestamp(comment.timestamp)}</p>
              </div>
            ))}
          </div>

          {/* Actions and Add Comment */}
          <div className="p-4 border-t">
            <div className="flex justify-between mb-4">
              <div className="flex gap-4">
                <Heart className="h-6 w-6" />
                <MessageCircle className="h-6 w-6" />
                <Send className="h-6 w-6" />
              </div>
              <Bookmark className="h-6 w-6" />
            </div>
            <p className="font-semibold mb-2">{post.likes.toLocaleString()} likes</p>
            <p className="text-xs text-gray-500 mb-4">{formatTimestamp(post.timestamp)}</p>
            <form onSubmit={handleCommentSubmit} className="flex items-center">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" variant="ghost" size="sm" className="ml-2">
                Post
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


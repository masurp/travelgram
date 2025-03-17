"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Play, Pause, Volume2, VolumeX } from "lucide-react"
import type { Post as PostType, Comment } from "@/lib/types"
import PostModal from "./post-modal"
import { useUser } from "@/contexts/UserContext"
import { formatTimestamp } from "@/lib/dateUtils"
import { isDesktop } from "@/lib/deviceUtils"

interface PostProps {
  post: PostType
  onAddComment: (postId: string, comment: Comment) => void
}

export default function Post({ post, onAddComment }: PostProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>(post.comments || [])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [contentError, setContentError] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { username } = useUser()

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1)
    } else {
      setLikesCount(likesCount + 1)
    }
    setLiked(!liked)
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      const comment: Comment = {
        id: `c${Date.now()}`,
        username: username,
        text: newComment.trim(),
        timestamp: new Date().toISOString(),
      }
      setComments((prevComments) => [comment, ...prevComments]) // Add new comment to the beginning
      onAddComment(post.id, comment)
      setNewComment("")
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handlePostClick = () => {
    if (isDesktop()) {
      setShowModal(true)
    }
  }

  const handleContentError = () => {
    setContentError(true)
  }

  const handleAvatarError = () => {
    setAvatarError(true)
  }

  useEffect(() => {
    setContentError(false)
    setAvatarError(false)
  }, [post.contentUrl, post.userAvatar])

  const renderContent = () => {
    if (!post.contentUrl || contentError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          Content not available
        </div>
      )
    }

    if (post.contentType === "image") {
      return (
        <Image
          src={post.contentUrl || "/placeholder.svg"}
          alt={post.caption || "Post image"}
          fill
          className="object-cover"
          onError={handleContentError}
        />
      )
    }

    if (post.contentType === "video") {
      return (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={post.contentUrl}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            onError={handleContentError}
          />
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <Button variant="secondary" size="icon" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="secondary" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
        Unsupported content type
      </div>
    )
  }

  return (
    <>
      <div className="bg-white border rounded-lg overflow-hidden">
        {/* Post header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {avatarError ? (
                <AvatarFallback>{post.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              ) : (
                <AvatarImage src={post.userAvatar} alt={post.username} onError={handleAvatarError} />
              )}
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{post.username}</p>
              {post.location && <p className="text-xs text-gray-500">{post.location}</p>}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Post content */}
        <div className={`relative aspect-square ${isDesktop() ? "cursor-pointer" : ""}`} onClick={handlePostClick}>
          {renderContent()}
        </div>

        {/* Post actions */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLike}>
                <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleComments}>
                <MessageCircle className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Send className="h-6 w-6" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSave}>
              <Bookmark className={`h-6 w-6 ${saved ? "fill-black" : ""}`} />
            </Button>
          </div>

          {/* Likes count */}
          <p className="font-semibold text-sm mb-1">{likesCount.toLocaleString()} likes</p>

          {/* Caption */}
          {post.caption && (
            <div className="mb-1">
              <span className="font-semibold text-sm mr-2">{post.username}</span>
              <span className="text-xs sm:text-sm">{post.caption}</span>
            </div>
          )}

          {/* Comments */}
          <button className="text-gray-500 text-xs sm:text-sm mb-1" onClick={toggleComments}>
            {showComments ? "Hide comments" : `View all ${comments.length} comments`}
          </button>

          {showComments && (
            <div className="mt-2 space-y-2">
              {comments.map((comment) => (
                <div key={`comment-${comment.id}`} className="text-xs sm:text-sm">
                  <span className="font-semibold mr-2">{comment.username}</span>
                  {comment.text}
                  <p className="text-2xs sm:text-xs text-gray-500 mt-0.5">{formatTimestamp(comment.timestamp)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comment form */}
          <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center">
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

          {/* Timestamp */}
          <p className="text-xs text-gray-500 uppercase mt-2">{formatTimestamp(post.timestamp)}</p>
        </div>
      </div>

      {showModal && isDesktop() && (
        <PostModal post={post} onClose={() => setShowModal(false)} onAddComment={onAddComment} />
      )}
    </>
  )
}


"use client"

import { useEffect, useState } from "react"
import { parseISO, compareDesc } from "date-fns"
import Post from "@/components/post"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPosts, fetchComments } from "@/lib/data"
import type { Post as PostType, Comment } from "@/lib/types"
import { useUser } from "@/contexts/UserContext"
import { shuffleArray } from "@/lib/arrayUtils"
import { Button } from "@/components/ui/button"

export default function Feed() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const { condition } = useUser()

  useEffect(() => {
    async function loadData() {
      if (!condition) {
        setError("No condition set. Please register first.")
        setLoading(false)
        return
      }

      try {
        const [postData, commentData] = await Promise.all([
          fetchPosts(condition).catch((error) => {
            console.error("Error fetching posts:", error)
            throw new Error("Failed to load posts")
          }),
          fetchComments(condition).catch((error) => {
            console.error("Error fetching comments:", error)
            throw new Error("Failed to load comments")
          }),
        ])

        // Attach comments to their respective posts and sort them in descending order
        const postsWithComments = postData.map((post) => ({
          ...post,
          comments: commentData
            .filter((comment) => comment.postId === post.id)
            .sort((a, b) => compareDesc(parseISO(a.timestamp), parseISO(b.timestamp))),
        }))

        // Shuffle the posts
        const shuffledPosts = shuffleArray(postsWithComments)

        setPosts(shuffledPosts)
        setFilteredPosts(shuffledPosts)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setError("Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [condition])

  useEffect(() => {
    if (searchKeyword) {
      const filtered = posts.filter(
        (post) =>
          post.caption.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          post.username.toLowerCase().includes(searchKeyword.toLowerCase()),
      )
      setFilteredPosts(filtered)
    } else {
      setFilteredPosts(posts)
    }
  }, [searchKeyword, posts])

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword)
  }

  const handleAddComment = (postId: string, comment: Comment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? { ...post, comments: [...(post.comments || []), comment] } : post)),
    )
    setFilteredPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? { ...post, comments: [...(post.comments || []), comment] } : post)),
    )
  }

  const handleCloseTab = () => {
    window.open("", "_self")
    window.close()
  }

  return (
    <div className="flex flex-col items-center min-h-screen w-full pt-14 sm:pt-16 bg-gray-100">
      <Header onSearch={handleSearch} />
      <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="space-y-6 pt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="bg-white border rounded-lg overflow-hidden">
                <div className="p-4 flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-96 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500 mt-8">{error}</p>
        ) : (
          <>
            <div className="space-y-6 pt-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => <Post key={post.id} post={post} onAddComment={handleAddComment} />)
              ) : (
                <p className="text-center text-gray-500 mt-8">No posts found matching your search.</p>
              )}
            </div>
            <div className="mt-8 text-center">
              <p className="mb-4 text-gray-700">
                If you have finished browsing through the feed, please click the button below or close the current tab
                in your Browser to return to the survey.
              </p>
              <Button onClick={handleCloseTab} className="bg-red-500 hover:bg-red-600 text-white">
                Close Tab
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


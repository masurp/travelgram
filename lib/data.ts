import type { Post, Comment } from "./types"
import { getImageUrl, getAvatarUrl } from "./imageUtils"

const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID

type Condition = "condition1" | "condition2" | "condition3" | "condition4"

const sheetNames: Record<Condition, { posts: string; comments: string }> = {
  condition1: { posts: "Posts1", comments: "Comments1" },
  condition2: { posts: "Posts2", comments: "Comments2" },
  condition3: { posts: "Posts3", comments: "Comments3" },
  condition4: { posts: "Posts4", comments: "Comments4" },
}

async function fetchCSV(sheetId: string, sheetName: string) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch data from Google Sheet: ${sheetName}`)
  }
  const csvText = await response.text()

  // Use a more robust CSV parsing approach
  const rows = csvText.split("\n").map((row) => {
    const cells = []
    let currentCell = ""
    let withinQuotes = false

    for (let i = 0; i < row.length; i++) {
      if (row[i] === '"') {
        withinQuotes = !withinQuotes
      } else if (row[i] === "," && !withinQuotes) {
        cells.push(currentCell.trim())
        currentCell = ""
      } else {
        currentCell += row[i]
      }
    }
    cells.push(currentCell.trim())
    return cells.map((cell) => cell.replace(/^"|"$/g, "").replace(/""/g, '"'))
  })

  return rows
}

export async function fetchPosts(condition: Condition): Promise<Post[]> {
  if (!SHEET_ID) {
    throw new Error("Missing Google Sheet ID")
  }

  const POSTS_SHEET_NAME = sheetNames[condition].posts

  try {
    const [headers, ...dataRows] = await fetchCSV(SHEET_ID, POSTS_SHEET_NAME)

    return dataRows.map((row, rowIndex) => {
      const post: Partial<Post> = {}
      headers.forEach((header, index) => {
        switch (header) {
          case "id":
          case "username":
          case "caption":
          case "location":
          case "timestamp":
            post[header] = row[index]
            break
          case "userAvatar":
            post[header] = getAvatarUrl(row[index])
            break
          case "contentUrl":
          case "thumbnailUrl":
            post[header] = getImageUrl(row[index])
            break
          case "likes":
            post[header] = Number.parseInt(row[index], 10) || 0
            break
          case "contentType":
            post[header] = row[index] as "image" | "video"
            break
        }
      })

      // Ensure post has valid contentType and contentUrl
      if (!post.contentType || !post.contentUrl) {
        post.contentType = "image"
        post.contentUrl = "/placeholder.svg"
      }

      return post as Post
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw error
  }
}

export async function fetchComments(condition: Condition): Promise<Comment[]> {
  if (!SHEET_ID) {
    throw new Error("Missing Google Sheet ID")
  }

  const COMMENTS_SHEET_NAME = sheetNames[condition].comments

  try {
    const [headers, ...dataRows] = await fetchCSV(SHEET_ID, COMMENTS_SHEET_NAME)

    return dataRows.map((row, rowIndex) => {
      const comment: Partial<Comment> = {}
      headers.forEach((header, index) => {
        switch (header) {
          case "id":
          case "postId":
          case "username":
          case "text":
          case "timestamp":
            comment[header] = row[index]
            break
        }
      })
      return comment as Comment
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    throw error
  }
}


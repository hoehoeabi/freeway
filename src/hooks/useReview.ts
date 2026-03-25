// 리뷰 관련 모든 상태와 로직을 관리하는 커스텀 훅

import { useState } from 'react'
import { type Review } from '../types/review'

export const useReview = () => {
    const [reviews, setReviews] = useState<Review[]>([])

    //리뷰 생성 함수
    const createReview = (review: Omit<Review, 'id' | 'createdAt' | 'likes' | 'likedUsers' | 'comments'>) => {
        if (!review.content.trim()) {
            alert('리뷰 내용을 입력해주세요.')
            return
        }

        const newReview: Review = {
            ...review,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            likes: 0,
            likedUsers: [],
            comments: [],
        }
        setReviews((prev) => [newReview, ...prev])
    }

    //좋아요 토글 함수
    const toggleLike = (reviewId: number, userId: string) => {
        setReviews((prev) =>
            prev.map((r) => {
                if (r.id !== reviewId) return r

                const isLiked = r.likedUsers.includes(userId)

                return {
                    ...r,
                    likes: isLiked ? r.likes - 1 : r.likes + 1,
                    likedUsers: isLiked ? r.likedUsers.filter((id) => id !== userId) : [...r.likedUsers, userId],
                }
            }),
        )
    }

    //댓글 추가 함수
    const addComment = (reviewId: number, content: string, userId: string) => {
        setReviews((prev) =>
            prev.map((r) =>
                r.id === reviewId
                    ? {
                          ...r,
                          comments: [
                              ...r.comments,
                              {
                                  id: Date.now(),
                                  content,
                                  userId,
                                  createdAt: new Date().toISOString(),
                              },
                          ],
                      }
                    : r,
            ),
        )
    }

    return {
        reviews,
        createReview,
        toggleLike,
        addComment,
    }
}

//리뷰 및 댓글 데이터 구조 정의 (TypeScript 타입)

export interface Comment {
    id: number
    userId: string
    content: string
    createdAt: string
}

export interface Review {
    id: number
    content: string
    userId: string
    placeId: number
    createdAt: string
    likes: number
    likedUsers: string[]
    ratings: {
        entrance: number
        interior: number
        facility: number
    }
    comments: {
        id: number
        content: string
        userId: string
        createdAt: string
    }[]
}

import { supabase } from '@/lib/supabase'

export const createReview = async ({
    content,
    placeId,
    entrance,
    interior,
    facility,
}: {
    content: string
    placeId: number
    entrance: number
    interior: number
    facility: number
}) => {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('로그인이 필요합니다.')
    if (!content.trim()) throw new Error('리뷰 내용을 입력해주세요.')

    const { data: review, error } = await supabase
        .from('reviews')
        .insert([
            {
                content,
                user_id: user.id,
                place_id: placeId,
            },
        ])
        .select()
        .single()

    if (error) throw error

    await supabase.from('review_ratings').insert([
        {
            review_id: review.id,
            entrance_rating: entrance,
            interior_rating: interior,
            facility_rating: facility,
        },
    ])

    return review
}

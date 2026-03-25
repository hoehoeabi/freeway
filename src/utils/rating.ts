//리뷰들의 평균 평점을 계산하는 유틸 함수 모음

export const getAverageRating = (reviews: any[]) => {
    if (reviews.length === 0) return null

    const total = reviews.reduce(
        (acc, r) => {
            acc.entrance += r.ratings.entrance
            acc.interior += r.ratings.interior
            acc.facility += r.ratings.facility
            return acc
        },
        { entrance: 0, interior: 0, facility: 0 },
    )

    return {
        entrance: (total.entrance / reviews.length).toFixed(1),
        interior: (total.interior / reviews.length).toFixed(1),
        facility: (total.facility / reviews.length).toFixed(1),
    }
}

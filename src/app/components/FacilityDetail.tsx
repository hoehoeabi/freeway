import { Accessibility, ArrowLeft, Clock, DollarSign, MapPin, Phone, Star, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useReview } from '../../hooks/useReview'
import { facilities } from '../data/facilities'
import { ImageWithFallback } from './figma/ImageWithFallback'

export function FacilityDetail() {
    const { id } = useParams<{ id: string }>()
    const facility = facilities.find((f) => f.id === id)

    const { reviews, createReview, toggleLike, addComment } = useReview()
    const [content, setContent] = useState('')

    if (!facility) {
        return (
            <div className="text-center py-12">
                <Accessibility className="size-24 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl mb-4">시설을 찾을 수 없습니다</h2>
                <Link to="/" className="text-blue-500 hover:underline">
                    홈으로 돌아가기
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="size-5" />
                <span>목록으로</span>
            </Link>

            {/* Facility Header */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="relative h-96">
                    <ImageWithFallback
                        src={facility.imageUrl}
                        alt={facility.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h1 className="text-4xl mb-2">{facility.name}</h1>
                        <div className="flex items-center gap-3 text-lg">
                            <div className="flex items-center gap-1">
                                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                                <span>{facility.rating}</span>
                            </div>
                            <span>·</span>
                            <span>리뷰 {facility.reviewCount}개</span>
                            <span>·</span>
                            <span>{facility.category}</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    {/* Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <MapPin className="size-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">위치</p>
                                <p>{facility.location}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <Clock className="size-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">영업시간</p>
                                <p>{facility.hours}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <DollarSign className="size-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">가격대</p>
                                <p>{facility.priceRange}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <Phone className="size-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">문의</p>
                                <p className="text-sm">{facility.contact}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-2xl mb-3">소개</h2>
                        <p className="text-gray-700 leading-relaxed">{facility.description}</p>
                    </div>

                    {/* Accessibility Features */}
                    <div>
                        <h2 className="text-2xl mb-3 flex items-center gap-2">
                            <Accessibility className="size-6 text-blue-500" />
                            편의시설
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {facility.accessibilityFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                    <div className="size-2 bg-blue-500 rounded-full" />
                                    <span className="text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl mb-6">리뷰 ({reviews.filter((r) => r.placeId === Number(id)).length})</h2>

                {/* 리뷰 작성 */}
                <div className="mb-6 space-y-3">
                    <textarea
                        className="w-full border p-2 rounded"
                        placeholder="리뷰를 작성하세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => {
                            if (!content.trim()) {
                                alert('내용을 입력하세요')
                                return
                            }

                            createReview({
                                content,
                                userId: 'user1',
                                placeId: Number(id),
                                ratings: {
                                    entrance: 5,
                                    interior: 4,
                                    facility: 3,
                                },
                            })

                            setContent('')
                        }}
                    >
                        리뷰 작성
                    </button>
                </div>

                {/* 리뷰 리스트 */}
                <div className="space-y-6">
                    {reviews
                        .filter((r) => r.placeId === Number(id))
                        .map((r) => (
                            <div key={r.id} className="pb-6 border-b">
                                {/* 내용 */}
                                <p>{r.content}</p>

                                {/* 별점 */}
                                <p className="text-sm text-gray-500">
                                    진입로:{r.ratings.entrance} / 내부:{r.ratings.interior} / 시설:
                                    {r.ratings.facility}
                                </p>

                                {/* 좋아요 */}
                                <button
                                    onClick={() => toggleLike(r.id, 'user1')}
                                    className={`flex items-center gap-1 transition ${
                                        r.likedUsers.includes('user1')
                                            ? 'text-blue-500'
                                            : 'text-gray-400 hover:text-blue-400'
                                    }`}
                                >
                                    <ThumbsUp className={r.likedUsers.includes('user1') ? 'fill-blue-500' : ''} />
                                    {r.likes}
                                </button>

                                {/* 댓글 추가 */}
                                <button onClick={() => addComment(r.id, '댓글입니다', 'user1')}>댓글 추가</button>

                                {/* 댓글 목록 */}
                                {r.comments.map((c) => (
                                    <p key={c.id} className="ml-4 text-sm">
                                        💬 {c.content}
                                    </p>
                                ))}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

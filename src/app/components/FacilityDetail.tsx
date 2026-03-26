import { Accessibility, ArrowLeft, MapPin, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { AssistType, ContentType } from '../../../constants/api-codes'
import { supabase } from '../lib/supabase'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface Facility {
    content_id: string
    content_type: string
    title: string
    address: string
    addr2?: string | null
    tel?: string | null
    lat?: number | null
    lng?: number | null
    image_url?: string | null
    image_url2?: string | null

    parking?: string | null
    publictransport?: string | null
    route?: string | null
    ticketoffice?: string | null
    promotion?: string | null
    wheelchair?: string | null
    exit?: string | null
    elevator?: string | null
    restroom?: string | null
    auditorium?: string | null
    room?: string | null
    handicapetc?: string | null
    braileblock?: string | null
    helpdog?: string | null
    guidehuman?: string | null
    audioguide?: string | null
    bigprint?: string | null
    brailepromotion?: string | null
    guidesystem?: string | null
    blindhandicapetc?: string | null
    signguide?: string | null
    videoguide?: string | null
    hearingroom?: string | null
    hearinghandicapetc?: string | null
    stroller?: string | null
    lactationroom?: string | null
    babysparechair?: string | null
    infantsfamilyetc?: string | null
}

export function FacilityDetail() {
    const { id } = useParams<{ id: string }>()
    const [facility, setFacility] = useState<Facility | null>(null)

    useEffect(() => {
        if (id) {
            fetchFacility()
        }
    }, [id])

    const fetchFacility = async () => {
        const { data, error } = await supabase.from('places').select('*').eq('content_id', id).single()

        if (error) {
            console.error(error)
            return
        }

        setFacility(data)
    }

    if (!facility) {
        return <div className="py-12 text-center">로딩중...</div>
    }

    // content_type 숫자코드 -> 한글
    const contentTypeLabelMap: Record<string, string> = {
        [ContentType.TOURISM]: '관광지',
        [ContentType.LODGING]: '숙박',
        [ContentType.RESTAURANT]: '음식점',
    }

    const contentTypeLabel = contentTypeLabelMap[facility.content_type] ?? facility.content_type

    // AssistType 기준으로 값 있는 편의시설만 추출
    const activeAssistTypes = Object.entries(AssistType).filter(([key]) => {
        const value = facility[key as keyof Facility]
        return value !== null && value !== undefined && value !== ''
    })

    return (
        <div className="space-y-6">
            {/* 뒤로가기 */}
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="size-5" />
                <span>목록으로</span>
            </Link>

            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                {/* 이미지 */}
                <div className="relative h-96">
                    <ImageWithFallback
                        src={facility.image_url || '/fallback.png'}
                        alt={facility.title}
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute right-0 bottom-0 left-0 p-8 text-white">
                        <h1 className="mb-2 text-4xl">{facility.title}</h1>
                        <p className="opacity-90">{contentTypeLabel}</p>
                    </div>
                </div>

                {/* 내용 */}
                <div className="space-y-6 p-8">
                    {/* 기본 정보 */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-3">
                            <MapPin className="size-5 text-blue-600" />
                            <p>
                                {facility.address}
                                {facility.addr2 ? ` ${facility.addr2}` : ''}
                            </p>
                        </div>

                        {facility.tel && (
                            <div className="flex items-center gap-3">
                                <Phone className="size-5 text-orange-600" />
                                <p>{facility.tel}</p>
                            </div>
                        )}
                    </div>

                    {/* 접근성 */}
                    <div>
                        <h2 className="mb-3 flex items-center gap-2 text-2xl">
                            <Accessibility className="size-6 text-blue-500" />
                            편의시설
                        </h2>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                            {activeAssistTypes.map(([key, label]) => (
                                <div key={key} className="rounded-lg bg-blue-50 p-3">
                                    {label}
                                </div>
                            ))}
                        </div>

                        {activeAssistTypes.length === 0 && <p className="text-gray-400">등록된 편의시설 정보 없음</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

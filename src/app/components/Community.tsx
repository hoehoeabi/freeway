import { Calendar, MessageCircle, MessageSquare, ThumbsUp, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface Post {
    id: number
    title: string
    content: string
    author: string
    authorId: string
    createdAt: string
    likes: number
    comments: number
}

const mockPosts: Post[] = [
    {
        id: 1,
        title: '제주도 휠체어 접근 가능한 관광지 추천해주세요',
        content:
            '다음 달에 제주도 여행을 계획 중인데, 휠체어 사용자도 편하게 갈 수 있는 관광지나 식당 추천 부탁드립니다!',
        author: '김민수',
        authorId: 'user1',
        createdAt: '2024-03-20',
        likes: 12,
        comments: 8,
    },
    {
        id: 2,
        title: '장애인 화장실 정보 감사합니다',
        content: '이 앱 덕분에 외출이 훨씬 편해졌어요. 정보를 공유해주시는 모든 분들께 감사드립니다!',
        author: '이지은',
        authorId: 'user2',
        createdAt: '2024-03-19',
        likes: 25,
        comments: 5,
    },
]

export function Community() {
    const { user } = useAuth()
    const [posts] = useState<Post[]>(mockPosts)
    const [showNewPostForm, setShowNewPostForm] = useState(false)
    const [newPost, setNewPost] = useState({ title: '', content: '' })

    const handleSubmitPost = (e: React.FormEvent) => {
        e.preventDefault()
        // 실제로는 여기서 게시글을 저장하는 로직이 들어갑니다
        alert('게시글이 작성되었습니다! (실제 저장 기능은 백엔드 연동 시 구현됩니다)')
        setNewPost({ title: '', content: '' })
        setShowNewPostForm(false)
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-3">
                    <MessageSquare className="size-10" />
                    <h2 className="text-4xl">자유게시판</h2>
                </div>
                <p className="text-lg opacity-90">접근성에 대한 경험과 정보를 자유롭게 공유해보세요</p>
            </div>

            {/* Write Post Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowNewPostForm(!showNewPostForm)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
                >
                    <MessageSquare className="size-5" />
                    <span>글쓰기</span>
                </button>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
                <div className="bg-white rounded-xl p-6 shadow-md border-2 border-purple-200">
                    <h3 className="text-xl mb-4 flex items-center gap-2">
                        <MessageSquare className="size-6 text-purple-500" />새 게시글 작성
                    </h3>
                    <form onSubmit={handleSubmitPost} className="space-y-4">
                        <div>
                            <label className="block text-sm mb-2 text-gray-700">제목</label>
                            <input
                                type="text"
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                placeholder="제목을 입력하세요"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2 text-gray-700">내용</label>
                            <textarea
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none min-h-32"
                                placeholder="내용을 입력하세요"
                                required
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowNewPostForm(false)}
                                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                            >
                                작성하기
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                        <h3 className="text-xl mb-2 hover:text-purple-600 transition-colors cursor-pointer">
                            {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <User className="size-4" />
                                    <span>{post.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="size-4" />
                                    <span>{post.createdAt}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-pink-500">
                                    <ThumbsUp className="size-4" />
                                    <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-500">
                                    <MessageCircle className="size-4" />
                                    <span>{post.comments}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Box */}
            {!user && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center">
                    <MessageSquare className="size-12 text-purple-400 mx-auto mb-3" />
                    <p className="text-gray-700">로그인하시면 게시글 작성, 댓글, 좋아요 기능을 사용하실 수 있습니다.</p>
                </div>
            )}
        </div>
    )
}

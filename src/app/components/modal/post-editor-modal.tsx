import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useCreatePost } from '@/hooks/mutations/post/use-create-post'
import { usePostEditorModal } from '@/store/post-editor-modal'
import { ImageIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function PostEditorModal() {
    const { user } = useAuth()
    const { isOpen, close } = usePostEditorModal()
    const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
        onSuccess: () => {
            close()
        },
        onError: (_error) => {
            toast.error('게시물 등록에 실패하였습니다.', { position: 'top-center' })
        },
    })

    const [content, setContent] = useState('')

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const handleCloseModal = () => {
        close()
    }
    const handleCreatePostClick = () => {
        if (content.trim() === '') return
        if (!user?.id) {
            toast.error('로그인이 필요합니다.', { position: 'top-center' })
            return
        }

        createPost({
            title: content.slice(0, 20),
            content: content,
            user_id: user.id,
        })
    }

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
        }
    }, [content])
    useEffect(() => {
        if (!isOpen) return
        textareaRef.current?.focus()
        setContent('')
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="max-h-[90vh]">
                <DialogTitle>포스트 작성</DialogTitle>
                <textarea
                    disabled={isCreatePostPending}
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="max-h-125 min-h-25 focus:outline-none"
                    placeholder="새로운 소식이 있나요?"
                />
                <Button disabled={isCreatePostPending} variant={'outline'} className="cursor-pointer">
                    <ImageIcon />
                    이미지 추가
                </Button>
                <Button disabled={isCreatePostPending} onClick={handleCreatePostClick} className="cursor-pointer">
                    저장
                </Button>
            </DialogContent>
        </Dialog>
    )
}

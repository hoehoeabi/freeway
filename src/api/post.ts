import { supabase } from '@/app/lib/supabase'

export async function createPost(postData: { title: string; content: string; user_id: string }) {
    const { data, error } = await supabase
        .from('post')
        .insert({
            title: postData.title,
            content: postData.content,
            user_id: postData.user_id,
        })
        .select()
    if (error) throw error
    return data
}

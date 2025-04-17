import { createClient } from '@supabase/supabase-js'

// 创建Supabase客户端实例
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 消息相关的数据库操作
export const messagesApi = {
  // 获取所有消息
  async getMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('deleted', false)  // 只获取未删除的消息
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // 创建新消息
  async createMessage({ text, userId, originalText }) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        text,
        user_id: userId,
        original_text: originalText,
        deleted: false
      }])
      .select()

    if (error) throw error
    return data[0]
  },

  // 软删除消息
  async deleteMessage(messageId, userId, isAdmin) {
    const query = supabase
      .from('messages')
      .update({ deleted: true })
      .eq('id', messageId)
    
    // 如果不是管理员，添加用户ID限制
    if (!isAdmin) {
      query.eq('user_id', userId)
    }

    const { error } = await query

    if (error) throw error
    return true
  },

  // 计算用户在过去24小时内的留言数量
  async countUserMessagesInLast24Hours(userId) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('deleted', false)  // 只计算未删除的消息
      .gte('created_at', twentyFourHoursAgo);

    if (error) {
      console.error('Error counting messages:', error);
      // 返回一个较大的数，以防出错时允许无限发送
      // 或者可以抛出错误，让调用者处理
      return Infinity; 
    }
    return count;
  }
}
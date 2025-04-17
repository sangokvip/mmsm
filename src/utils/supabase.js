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
    console.log('Fetching messages...');
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    console.log('Fetched messages:', data);
    return data || [];
  },

  // 创建新消息
  async createMessage({ text, userId, originalText }) {
    console.log('Creating message:', { text, userId, originalText });
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        text,
        user_id: userId,
        original_text: originalText
      }])
      .select();

    if (error) {
      console.error('Error creating message:', error);
      throw error;
    }
    console.log('Created message:', data);
    return data[0];
  },

  // 删除消息
  async deleteMessage(messageId, userId, isAdmin) {
    console.log('Deleting message:', { messageId, userId, isAdmin });
    try {
      // 首先检查消息是否存在
      const { data: message, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', messageId)
        .single();

      if (fetchError) {
        console.error('Error fetching message:', fetchError);
        throw new Error('查找消息时出错');
      }

      if (!message) {
        console.error('Message not found:', messageId);
        throw new Error('消息不存在');
      }

      // 检查权限
      if (!isAdmin && message.user_id !== userId) {
        console.error('Permission denied:', { messageUserId: message.user_id, userId });
        throw new Error('无权限删除此消息');
      }

      // 直接删除消息
      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (deleteError) {
        console.error('Error deleting message:', deleteError);
        throw new Error('删除消息时出错');
      }

      console.log('Message deleted successfully:', messageId);
      return true;
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  },

  // 计算用户在过去24小时内的留言数量
  async countUserMessagesInLast24Hours(userId) {
    console.log('Counting messages for user:', userId);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', twentyFourHoursAgo);

    if (error) {
      console.error('Error counting messages:', error);
      return Infinity;
    }
    console.log('Message count:', count);
    return count || 0;
  }
}
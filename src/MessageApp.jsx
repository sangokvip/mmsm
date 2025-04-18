import React, { useState, useEffect, useCallback } from 'react'
import { Container, Typography, Paper, Box, TextField, Button, AppBar, Toolbar, IconButton, Snackbar, ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent, DialogActions, Divider, CircularProgress } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PushPinIcon from '@mui/icons-material/PushPin'
import ReplyIcon from '@mui/icons-material/Reply'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import './styles/pixel-theme.css'
import { messagesApi } from './utils/supabase'
import { v4 as uuidv4 } from 'uuid'; // 导入 uuid

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff69b4',
      light: '#ff8dc3',
      dark: '#c13b86',
    },
    secondary: {
      main: '#4a148c',
      light: '#7c43bd',
      dark: '#12005e',
    },
    background: {
      default: '#fce4ec',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Press Start 2P", cursive',
    h3: {
      fontWeight: 700,
      color: '#ff69b4',
      textShadow: '2px 2px 0 #4a148c',
      textAlign: 'center',
      marginBottom: '2rem',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '4px solid #ff69b4',
          boxShadow: '4px 4px 0 rgba(74, 20, 140, 0.5)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Press Start 2P", cursive',
          border: '3px solid #ff69b4',
          boxShadow: '3px 3px 0 rgba(74, 20, 140, 0.5)',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '5px 5px 0 rgba(74, 20, 140, 0.5)',
          },
          '&:active': {
            transform: 'translate(2px, 2px)',
            boxShadow: '1px 1px 0 rgba(74, 20, 140, 0.5)',
          },
        },
      },
    },
  },
})

// 添加联系方式过滤函数
const filterContactInfo = (text) => {
  // 手机号码
  const phoneRegex = /1[3-9]\d{9}/g;
  // 微信号（字母、数字、下划线和减号，6-20位）
  const wechatRegex = /(?<![a-zA-Z0-9])[a-zA-Z][a-zA-Z0-9_-]{5,19}/g;
  // QQ号（5-11位数字）
  const qqRegex = /(?<!\d)[1-9][0-9]{4,10}(?!\d)/g;
  // 邮箱
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  let filteredText = text;
  
  // 替换所有匹配的联系方式为星号
  filteredText = filteredText.replace(phoneRegex, match => '*'.repeat(match.length));
  filteredText = filteredText.replace(wechatRegex, match => '*'.repeat(match.length));
  filteredText = filteredText.replace(qqRegex, match => '*'.repeat(match.length));
  filteredText = filteredText.replace(emailRegex, match => '*'.repeat(match.length));

  return filteredText;
};

// 添加回复组件
const MessageReply = ({ reply, onDelete, isOwner, isAdminMessage }) => (
  <Paper
    sx={{
      p: { xs: 1, sm: 1.5 },
      ml: { xs: 2, sm: 3 },
      mb: 1,
      backgroundColor: isAdminMessage ? '#4a148c' : '#fff0f5',
      border: `2px solid ${isAdminMessage ? '#7c43bd' : '#ff69b4'}`,
      boxShadow: '2px 2px 0 rgba(255, 105, 180, 0.3)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '-10px',
        top: '10px',
        width: '0',
        height: '0',
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderRight: `10px solid ${isAdminMessage ? '#4a148c' : '#ff69b4'}`,
      }
    }}
  >
    <Typography 
      variant="body2" 
      sx={{ 
        wordBreak: 'break-word',
        color: isAdminMessage ? '#ffffff' : 'inherit',
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        ...(isAdminMessage && {
          '&::before': {
            content: '"[管理员]"',
            color: '#ff69b4',
            marginRight: '8px',
            fontWeight: 'normal'
          }
        })
      }}
    >
      {reply.text}
    </Typography>
    {isOwner && (
      <IconButton
        onClick={onDelete}
        size="small"
        sx={{
          position: 'absolute',
          right: 4,
          top: 4,
          padding: 0.5,
          color: isAdminMessage ? '#ffffff' : '#ff69b4',
          '&:hover': {
            color: '#ff8dc3',
          }
        }}
      >
        <DeleteIcon sx={{ fontSize: '0.875rem' }} />
      </IconButton>
    )}
  </Paper>
);

const MessageBubble = ({ 
  message, 
  originalText, 
  onDelete, 
  isOwner, 
  isAdminMessage, 
  onReact, 
  reactions, 
  isPinned, 
  onTogglePin, 
  isAdmin,
  onReply,
  replies = [],
  onDeleteReply
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(replyText.trim());
      setReplyText('');
      setIsReplying(false);
    }
  };

  return (
    <Paper
      className={`pixel-bubble ${isAdminMessage ? 'admin-bubble' : ''} ${isPinned ? 'pinned-bubble' : ''}`}
      sx={{
        p: { xs: 1.5, sm: 2 },
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        animation: 'float 3s ease-in-out infinite',
        animationDelay: `${Math.random() * 2}s`,
        ...(isAdminMessage && {
          backgroundColor: '#4a148c !important',
          border: '4px solid #7c43bd',
          boxShadow: '4px 4px 0 rgba(255, 105, 180, 0.5)',
          '& .MuiTypography-root:not(.reaction-count)': {
            color: '#ff8dc3',
            fontWeight: 'bold',
            position: 'relative',
            '&::before': {
              content: '"[管理员]"',
              color: '#ff69b4',
              marginRight: '8px',
              fontWeight: 'normal'
            }
          }
        }),
        ...(isPinned && {
          border: '2px solid #ff69b4',
          '&::before': {
            content: '"📌"',
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            fontSize: '20px',
            transform: 'rotate(45deg)'
          }
        })
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            wordBreak: 'break-word',
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          {message}
        </Typography>
        {isAdminMessage && originalText !== message && (
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              mt: 1, 
              color: '#ff69b4',
              fontStyle: 'italic',
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            原文: {originalText}
          </Typography>
        )}
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: { xs: 1.5, sm: 2 },
        pt: { xs: 1, sm: 1 },
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
          <IconButton
            size="small"
            onClick={() => onReact(true)}
            sx={{
              color: '#ff69b4',
              padding: { xs: 0.5, sm: 1 },
              '&:hover': { 
                color: '#ff8dc3',
                transform: 'scale(1.1)'
              },
              transition: 'transform 0.2s ease, color 0.2s ease',
              ...(isAdminMessage && {
                color: '#ffffff',
                '&:hover': {
                  color: '#ff8dc3',
                  transform: 'scale(1.1)'
                }
              })
            }}
          >
            <ThumbUpIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
            <Typography 
              variant="caption"
              className="reaction-count"
              sx={{ 
                ml: 0.5,
                color: isAdminMessage ? '#ffffff' : '#ff69b4',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {reactions?.likes || 0}
            </Typography>
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onReact(false)}
            sx={{
              color: '#ff69b4',
              padding: { xs: 0.5, sm: 1 },
              '&:hover': { 
                color: '#ff8dc3',
                transform: 'scale(1.1)'
              },
              transition: 'transform 0.2s ease, color 0.2s ease',
              ...(isAdminMessage && {
                color: '#ffffff',
                '&:hover': {
                  color: '#ff8dc3',
                  transform: 'scale(1.1)'
                }
              })
            }}
          >
            <ThumbDownIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
            <Typography 
              variant="caption"
              className="reaction-count"
              sx={{ 
                ml: 0.5,
                color: isAdminMessage ? '#ffffff' : '#ff69b4',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {reactions?.dislikes || 0}
            </Typography>
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setIsReplying(!isReplying)}
            sx={{
              color: '#ff69b4',
              padding: { xs: 0.5, sm: 1 },
              '&:hover': { 
                color: '#ff8dc3',
                transform: 'scale(1.1)'
              },
              transition: 'transform 0.2s ease, color 0.2s ease',
              ...(isAdminMessage && {
                color: '#ffffff',
                '&:hover': {
                  color: '#ff8dc3',
                  transform: 'scale(1.1)'
                }
              })
            }}
          >
            <ReplyIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
            <Typography 
              variant="caption"
              className="reaction-count"
              sx={{ 
                ml: 0.5,
                color: isAdminMessage ? '#ffffff' : '#ff69b4',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {replies.length}
            </Typography>
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
          {replies.length > 0 && (
            <IconButton
              size="small"
              onClick={() => setShowReplies(!showReplies)}
              sx={{
                padding: { xs: 0.5, sm: 1 },
                color: isAdminMessage ? '#ffffff' : '#ff69b4',
                '&:hover': { color: '#ff8dc3' }
              }}
            >
              {showReplies ? (
                <ExpandLessIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
              )}
            </IconButton>
          )}
          {isAdmin && !isAdminMessage && (
            <IconButton
              size="small"
              onClick={() => onTogglePin(!isPinned)}
              sx={{
                padding: { xs: 0.5, sm: 1 },
                color: isPinned ? '#ff69b4' : 'inherit',
                '&:hover': { color: '#ff69b4' }
              }}
            >
              <PushPinIcon 
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  transform: isPinned ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.3s ease'
                }} 
              />
            </IconButton>
          )}
          {isOwner && (
            <IconButton
              onClick={onDelete}
              size="small"
              sx={{
                padding: { xs: 0.5, sm: 1 },
                color: isAdminMessage ? '#ffffff' : '#ff69b4',
                '&:hover': {
                  color: isAdminMessage ? '#ff69b4' : '#ff8dc3',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <DeleteIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* 回复输入框 */}
      {isReplying && (
        <Box
          component="form"
          onSubmit={handleReplySubmit}
          sx={{
            mt: 2,
            display: 'flex',
            gap: 1,
            borderTop: '1px solid rgba(0,0,0,0.1)',
            pt: 2
          }}
        >
          <TextField
            size="small"
            fullWidth
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="回复..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ff69b4',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: '#ff69b4',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff69b4',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="small"
            sx={{
              minWidth: 'unset',
              backgroundColor: '#ff69b4',
              color: 'white',
              '&:hover': {
                backgroundColor: '#ff8dc3',
              },
            }}
          >
            发送
          </Button>
        </Box>
      )}

      {/* 回复列表 */}
      {showReplies && replies.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {replies.map((reply) => (
            <MessageReply
              key={reply.id}
              reply={reply}
              onDelete={() => onDeleteReply(reply.id)}
              isOwner={isAdmin || reply.user_id === userId}
              isAdminMessage={reply.is_admin}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

const TopMessages = ({ messages }) => (
  <Paper 
    sx={{ 
      p: 2, 
      width: '100%',
      boxSizing: 'border-box',
      margin: 0,
      '& > *:last-child': {
        marginBottom: 0
      }
    }} 
    className="pixel-theme-pink"
    elevation={0}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <EmojiEventsIcon sx={{ color: '#ff69b4', mr: 1 }} />
      <Typography variant="h6" sx={{ color: '#ff69b4' }}>
        热门留言榜
      </Typography>
    </Box>
    <Divider sx={{ mb: 2 }} />
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {messages.map((message, index) => (
        <Box 
          key={message.id} 
          sx={{ 
            p: 1.5,
            borderRadius: 1,
            backgroundColor: 'rgba(255, 105, 180, 0.1)',
            border: '2px solid rgba(255, 105, 180, 0.2)',
            position: 'relative',
            '&:hover': {
              backgroundColor: 'rgba(255, 105, 180, 0.15)',
            }
          }}
        >
          <Box sx={{ 
            position: 'absolute',
            top: -10,
            left: -10,
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: '#ff69b4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {index + 1}
          </Box>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: '#ff69b4', 
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ThumbUpIcon sx={{ fontSize: 16 }} />
              {message.likes || 0}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ThumbDownIcon sx={{ fontSize: 16 }} />
              {message.dislikes || 0}
            </Box>
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              ...(message.user_id === 'admin' && {
                color: '#4a148c',
                fontWeight: 'bold',
                '&::before': {
                  content: '"[管理员]"',
                  color: '#ff69b4',
                  marginRight: '8px',
                  fontWeight: 'normal'
                }
              })
            }}
          >
            {message.text}
          </Typography>
        </Box>
      ))}
      {messages.length === 0 && (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
          暂无热门留言
        </Typography>
      )}
    </Box>
  </Paper>
)

// 添加错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('MessageApp错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#fce4ec',
            padding: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: '#ff69b4', marginBottom: 2 }}>
            页面加载出错了
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              backgroundColor: '#ff69b4',
              '&:hover': {
                backgroundColor: '#ff8dc3',
              },
            }}
          >
            刷新页面
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

function MessageApp() {
  const [messages, setMessages] = useState([]);
  const [topMessages, setTopMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [messageReplies, setMessageReplies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // 在组件挂载时设置状态
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // 从Supabase获取消息
  const fetchMessages = useCallback(async () => {
    if (!userId || !isMounted) {
      console.log('跳过获取消息：', { userId: !!userId, isMounted });
      return;
    }

    try {
      setIsLoading(true);
      console.log('开始获取消息...');
      const data = await messagesApi.getMessages();
      
      // 确保组件仍然挂载
      if (!isMounted) {
        console.log('组件已卸载，取消更新状态');
        return;
      }

      console.log('获取到消息数据:', data?.length || 0, '条');
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.warn('获取到的消息数据格式不正确:', data);
        setMessages([]);
      }
    } catch (error) {
      if (!isMounted) return;
      console.error("获取消息失败:", error);
      setSnackbarMessage(`加载留言失败：${error.message || '请检查网络连接'}`);
      setSnackbarOpen(true);
      setMessages([]);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, [userId, isMounted]);

  // 获取热门消息
  const fetchTopMessages = useCallback(async () => {
    if (!userId) {
      console.log('用户ID未初始化，跳过获取热门消息');
      return;
    }

    try {
      console.log('开始获取热门消息...');
      const topMessages = await messagesApi.getTopMessages();
      console.log('获取到热门消息:', topMessages?.length || 0, '条');
      setTopMessages(topMessages || []);
    } catch (error) {
      console.error('获取热门消息失败:', error);
      setTopMessages([]);
    }
  }, [userId]);

  // 获取消息反应
  const fetchMessageReactions = useCallback(async (messageId) => {
    try {
      const reactions = await messagesApi.getMessageReactions(messageId);
      setMessageReactions(prev => ({
        ...prev,
        [messageId]: reactions
      }));
    } catch (error) {
      console.error('获取消息反应失败:', error);
    }
  }, []);

  // 获取所有消息的回复
  const fetchMessageReplies = useCallback(async (messageId) => {
    try {
      const replies = await messagesApi.getMessageReplies(messageId);
      setMessageReplies(prev => ({
        ...prev,
        [messageId]: replies
      }));
    } catch (error) {
      console.error('获取回复失败:', error);
      setSnackbarMessage('获取回复失败');
      setSnackbarOpen(true);
    }
  }, []);

  // 初始化用户ID和消息
  useEffect(() => {
    // 从cookie获取用户ID，如果不存在则创建新的UUID
    let idFromCookie = document.cookie.match(/userId=([^;]+)/)?.[1];
    let finalUserId;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (idFromCookie) {
      let potentialUserId = idFromCookie;
      if (potentialUserId.startsWith('user_')) {
        console.log("移除 'user_' 前缀:", potentialUserId);
        potentialUserId = potentialUserId.substring(5);
      }

      if (uuidRegex.test(potentialUserId)) {
        finalUserId = potentialUserId;
        console.log("使用cookie中的有效UUID:", finalUserId);
      } else {
        console.log('Cookie中的UUID格式无效，生成新的UUID');
        finalUserId = uuidv4();
      }
    } else {
      console.log('Cookie中未找到UUID，生成新的UUID');
      finalUserId = uuidv4();
    }

    // 保存到cookie
    document.cookie = `userId=${finalUserId};path=/;max-age=31536000;SameSite=Lax`;
    console.log("设置用户ID:", finalUserId);
    setUserId(finalUserId);
  }, []);

  // 监听用户ID变化，加载消息
  useEffect(() => {
    if (userId) {
      console.log('用户ID已设置，开始加载消息');
      fetchMessages();
      fetchTopMessages();
    }
  }, [userId, fetchMessages, fetchTopMessages]);

  // 定期刷新消息
  useEffect(() => {
    if (!userId) return;

    console.log('设置消息自动刷新');
    const refreshInterval = setInterval(() => {
      console.log('执行定期刷新');
      fetchMessages();
      fetchTopMessages();
    }, 30000);

    return () => {
      console.log('清理消息刷新定时器');
      clearInterval(refreshInterval);
    };
  }, [userId, fetchMessages, fetchTopMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      // 检查留言频率限制
      if (!isAdmin) {
        try {
          const messageCount = await messagesApi.countUserMessagesInLast24Hours(userId);
          if (messageCount >= 6) {
            setSnackbarMessage('您今天留言已达上限（6条）');
            setSnackbarOpen(true);
            return;
          }
        } catch (error) {
          console.error("Error checking message limit:", error);
          setSnackbarMessage('检查留言频率时出错，请稍后再试');
          setSnackbarOpen(true);
          return;
        }
      }

      // 过滤联系方式
      const filteredMessage = filterContactInfo(newMessage.trim());
      
      // 准备消息数据
      const messageData = {
        text: filteredMessage,
        userId: isAdmin ? 'admin' : userId,
        originalText: newMessage.trim()
      };

      try {
        const savedMessage = await messagesApi.createMessage(messageData);
        if (!savedMessage) {
          setSnackbarMessage('留言似乎成功，但服务器未返回确认信息');
          setSnackbarOpen(true);
        } else {
          await fetchMessages();
          setNewMessage('');
          setSnackbarMessage('留言成功！');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("详细错误信息:", error);
        // 处理特定的错误消息
        if (error.message.includes('相同的留言')) {
          setSnackbarMessage('您已经发送过相同的留言了');
        } else {
          const specificError = error?.details || error?.message || error?.error_description || '未知错误';
          setSnackbarMessage(`留言失败：${specificError}`);
        }
        setSnackbarOpen(true);
      }
    }
  }

  const handleDelete = async (messageId, messageUserId) => {
    console.log('Handling delete:', { messageId, messageUserId, userId, isAdmin });
    try {
      // 显示删除中的提示
      setSnackbarMessage('正在删除...');
      setSnackbarOpen(true);

      const success = await messagesApi.deleteMessage(messageId, userId, isAdmin);
      console.log('Message deleted, success:', success);
      
      if (success) {
        // 删除成功后立即重新获取消息列表
        await fetchMessages();
        setSnackbarMessage('删除成功！');
      }
    } catch (error) {
      console.error("删除消息时出错:", error);
      setSnackbarMessage(`删除失败：${error.message}`);
    } finally {
      setSnackbarOpen(true);
    }
  }

  const handleLogin = () => {
    if (password === 'Sangok#3') {
      setIsAdmin(true)
      setOpenLogin(false)
      setPassword('')
      setSnackbarMessage('管理员登录成功！')
      setSnackbarOpen(true)
    } else {
      setSnackbarMessage('密码错误！')
      setSnackbarOpen(true)
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setSnackbarMessage('已退出管理员模式！')
    setSnackbarOpen(true)
  }

  // 处理反应（点赞/踩）
  const handleReaction = async (messageId, isLike) => {
    try {
      await messagesApi.addReaction(messageId, userId, isLike);
      await fetchMessages(); // 重新获取消息列表以更新点赞数
      await fetchTopMessages(); // 更新热门留言榜
    } catch (error) {
      console.error('反应操作失败:', error);
      setSnackbarMessage(error.message || '操作失败，请稍后重试');
      setSnackbarOpen(true);
    }
  };

  // 处理置顶切换
  const handleTogglePin = async (messageId, isPinned) => {
    if (!messageId) {
      console.error('无效的消息ID:', messageId);
      setSnackbarMessage('操作失败：无效的消息ID');
      setSnackbarOpen(true);
      return;
    }

    if (!isAdmin) {
      console.error('非管理员尝试置顶消息');
      setSnackbarMessage('只有管理员可以置顶消息');
      setSnackbarOpen(true);
      return;
    }

    let originalMessages = null;
    try {
      // 保存原始消息列表，以便在出错时恢复
      originalMessages = [...messages];

      // 显示操作进行中的状态
      setSnackbarMessage(isPinned ? '正在置顶消息...' : '正在取消置顶...');
      setSnackbarOpen(true);

      // 更新本地状态以提供即时反馈
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, is_pinned: isPinned }
            : msg
        )
      );

      // 执行服务器端更新
      const updatedMessage = await messagesApi.toggleMessagePin(messageId, isPinned, isAdmin);
      console.log('置顶状态更新成功:', updatedMessage);

      // 更新本地状态以反映服务器端的更改
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, ...updatedMessage } : msg
        )
      );
      
      // 显示成功消息
      setSnackbarMessage(isPinned ? '消息已成功置顶' : '消息已取消置顶');
      setSnackbarOpen(true);

      // 延迟重新获取消息列表以确保数据同步
      setTimeout(() => {
        fetchMessages();
      }, 500);
    } catch (error) {
      console.error('置顶操作失败:', error);
      
      // 恢复原始状态
      if (originalMessages) {
        setMessages(originalMessages);
      }
      
      // 显示错误消息
      let errorMessage = '操作失败';
      if (error.message.includes('权限')) {
        errorMessage = '只有管理员可以置顶消息';
      } else if (error.message.includes('不存在')) {
        errorMessage = '找不到要操作的消息，可能已被删除';
      } else if (error.message.includes('验证失败')) {
        errorMessage = '更新状态失败，请重试';
      } else if (error.message.includes('未找到消息')) {
        errorMessage = '消息可能已被删除，请刷新页面';
      } else {
        errorMessage = `操作失败: ${error.message || '请稍后重试'}`;
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);

      // 延迟重新获取消息列表
      setTimeout(() => {
        fetchMessages();
      }, 1000);
    }
  };

  // 创建回复
  const handleCreateReply = async (messageId, text) => {
    try {
      const filteredText = filterContactInfo(text);
      await messagesApi.createReply({
        messageId,
        userId: isAdmin ? 'admin' : userId,
        text: filteredText,
        originalText: text
      });
      await fetchMessageReplies(messageId);
      setSnackbarMessage('回复成功！');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(error.message || '回复失败');
      setSnackbarOpen(true);
    }
  };

  // 删除回复
  const handleDeleteReply = async (replyId) => {
    try {
      await messagesApi.deleteReply(replyId, userId, isAdmin);
      // 重新获取所有消息的回复
      messages.forEach(message => fetchMessageReplies(message.id));
      setSnackbarMessage('回复删除成功！');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(error.message || '删除回复失败');
      setSnackbarOpen(true);
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <AppBar
            position="sticky"
            sx={{
              backgroundColor: '#fff0f5',
              border: '4px solid #ff69b4',
              borderBottom: '4px solid #ff69b4',
              boxShadow: '4px 4px 0 rgba(255, 105, 180, 0.5)',
              mb: 3,
            }}
            className="pixel-theme-pink"
          >
            <Container maxWidth="lg">
              <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" className="pixel-title-pink" sx={{ color: '#ff69b4' }}>
                  留言板
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    color="inherit"
                    startIcon={isAdmin ? <LogoutIcon /> : <LoginIcon />}
                    onClick={isAdmin ? handleLogout : () => setOpenLogin(true)}
                    className="pixel-button-pink"
                    sx={{ color: '#ff69b4' }}
                  >
                    {isAdmin ? '退出管理' : '管理员登录'}
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={<HomeIcon />}
                    href="/index.html"
                    className="pixel-button-pink"
                    sx={{ color: '#ff69b4' }}
                  >
                    返回首页
                  </Button>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>

          <Container maxWidth="lg" sx={{ pb: 4, mb: 10 }}>
            <Typography variant="h3" className="pixel-title-pink" sx={{ mb: 4 }}>
              I Love Dirty Talk
            </Typography>

            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              width: '100%',
              '& > *': {
                width: '100%',
                maxWidth: '100%'
              }
            }}>
              {/* 热门留言榜 - 在大屏幕上限制最大宽度 */}
              <Box sx={{
                maxWidth: { md: '800px' },
                mx: 'auto',
                width: '100%'
              }}>
                <TopMessages messages={topMessages} />
              </Box>
              
              {/* 加载状态显示 */}
              {isLoading ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '200px',
                  width: '100%',
                  gap: 2
                }}>
                  <CircularProgress sx={{ color: '#ff69b4' }} />
                  <Typography variant="h6" sx={{ color: '#ff69b4' }}>
                    加载中...
                  </Typography>
                </Box>
              ) : (
                /* 留言列表 - 响应式网格布局 */
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: { xs: 2, sm: 2, md: 3 },
                  width: '100%'
                }}>
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={isAdmin ? message.original_text : message.text}
                        originalText={message.original_text}
                        onDelete={() => handleDelete(message.id, message.user_id)}
                        isOwner={isAdmin || message.user_id === userId}
                        isAdminMessage={message.user_id === 'admin'}
                        onReact={(isLike) => handleReaction(message.id, isLike)}
                        reactions={message.reactions || { likes: 0, dislikes: 0 }}
                        isPinned={!!message.is_pinned}
                        onTogglePin={(isPinned) => handleTogglePin(message.id, isPinned)}
                        isAdmin={isAdmin}
                        onReply={(text) => handleCreateReply(message.id, text)}
                        replies={messageReplies[message.id] || []}
                        onDeleteReply={handleDeleteReply}
                      />
                    ))
                  ) : (
                    <Box sx={{ 
                      gridColumn: '1 / -1',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '200px'
                    }}>
                      <Typography variant="h6" sx={{ color: '#ff69b4' }}>
                        暂无留言
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Container>
          
          <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 1.5, sm: 2 },
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              gap: { xs: 1, sm: 2 },
              alignItems: 'center',
              backgroundColor: '#fff0f5',
              zIndex: 1000,
              borderTop: '4px solid #ff69b4',
              boxShadow: '0 -4px 0 rgba(255, 105, 180, 0.5)'
            }}
            className="pixel-theme-pink"
          >
            <TextField
              fullWidth
              multiline
              rows={{ xs: 1, sm: 2 }}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="说点什么..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ff69b4',
                    borderWidth: '3px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ff69b4',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff69b4',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              sx={{
                height: '100%',
                minWidth: { xs: '80px', sm: '100px' },
                backgroundColor: '#ff69b4',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#ff8dc3',
                },
              }}
              className="pixel-button-pink"
            >
              发送
            </Button>
          </Paper>

          <style jsx global>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .pixel-bubble {
              background-color: #fff0f5 !important;
            }
            .admin-bubble {
              position: relative;
              overflow: visible !important;
            }
            .admin-bubble::after {
              content: '★';
              position: absolute;
              top: -15px;
              right: -15px;
              color: #ff69b4;
              font-size: 24px;
              animation: spin 2s linear infinite;
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
          />

          <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
            <DialogTitle>管理员登录</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="密码"
                type="password"
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenLogin(false)}>取消</Button>
              <Button onClick={handleLogin}>登录</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default MessageApp
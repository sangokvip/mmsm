import React, { useState, useEffect, useCallback } from 'react'
import { Container, Typography, Paper, Box, TextField, Button, AppBar, Toolbar, IconButton, Snackbar, ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
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

const MessageBubble = ({ message, onDelete, isOwner, isAdminMessage }) => (
  <Paper
    className={`pixel-bubble ${isAdminMessage ? 'admin-bubble' : ''}`}
    sx={{
      p: 2,
      mb: 2,
      maxWidth: '80%',
      position: 'relative',
      animation: 'float 3s ease-in-out infinite',
      animationDelay: `${Math.random() * 2}s`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 2,
      ...(isAdminMessage && {
        backgroundColor: '#4a148c !important',
        border: '4px solid #7c43bd',
        boxShadow: '4px 4px 0 rgba(255, 105, 180, 0.5)',
        '& .MuiTypography-root': {
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
      })
    }}
  >
    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
      {message}
    </Typography>
    {isOwner && (
      <IconButton
        onClick={onDelete}
        sx={{
          color: isAdminMessage ? '#ffffff' : '#ff69b4',
          '&:hover': {
            color: isAdminMessage ? '#ff69b4' : '#ff8dc3',
            transform: 'scale(1.1)'
          }
        }}
      >
        <DeleteIcon />
      </IconButton>
    )}
  </Paper>
)

function MessageApp() {
  const [messages, setMessages] = useState([]); // Initialize with empty array
  const [newMessage, setNewMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState(null)

  // 从Supabase获取消息
  const fetchMessages = useCallback(async () => {
    try {
      const data = await messagesApi.getMessages();
      if (data && Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]); // 如果没有消息，就设置为空数组
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setSnackbarMessage(`加载留言失败：${error.message || '请检查网络连接'}`);
      setSnackbarOpen(true);
      setMessages([]); // 发生错误时也设置为空数组
    }
  }, []);

  useEffect(() => {
    // 从cookie获取用户ID，如果不存在则创建新的UUID
    let idFromCookie = document.cookie.match(/userId=([^;]+)/)?.[1];
    let finalUserId;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (idFromCookie) {
      // 如果从 cookie 读取到 ID，检查并移除可能的前缀 'user_'
      let potentialUserId = idFromCookie;
      if (potentialUserId.startsWith('user_')) {
        console.warn("Removing 'user_' prefix from cookie ID:", potentialUserId);
        potentialUserId = potentialUserId.substring(5); // 移除 "user_" 前缀
      }

      // 验证 UUID 格式
      if (uuidRegex.test(potentialUserId)) {
        finalUserId = potentialUserId; // 格式有效，使用它
        console.log("Using valid UUID from cookie:", finalUserId);
      } else {
        console.error('Invalid UUID format found in cookie:', potentialUserId, 'Generating new one.');
        // 格式无效，生成新的 UUID
        finalUserId = uuidv4();
        document.cookie = `userId=${finalUserId};path=/;max-age=31536000;SameSite=Lax`;
        console.log("Generated and saved new userId due to invalid format:", finalUserId);
      }
    } else {
      // 如果 cookie 中没有 ID，生成新的 UUID
      finalUserId = uuidv4();
      // 将纯净的 UUID 存入 cookie
      console.log("Generated new userId (no cookie found):", finalUserId);
      document.cookie = `userId=${finalUserId};path=/;max-age=31536000;SameSite=Lax`;
    }

    setUserId(finalUserId); // 设置状态为有效的 UUID
    fetchMessages(); // Fetch messages after getting userId
  }, [fetchMessages]);

  // Remove useEffect for saving to localStorage
  // useEffect(() => {
  //   localStorage.setItem('messages', JSON.stringify(messages));
  // }, [messages]);

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
            return; // 阻止提交
          }
        } catch (error) {
          console.error("Error checking message limit:", error);
          setSnackbarMessage('检查留言频率时出错，请稍后再试');
          setSnackbarOpen(true);
          return; // 发生错误时也阻止提交
        }
      }

      // 准备消息数据
      const messageData = {
        text: newMessage.trim(),
        userId: isAdmin ? 'admin' : userId, // 如果是管理员，使用 'admin' 作为 user_id
        originalText: newMessage.trim()
      };

      try {
        const savedMessage = await messagesApi.createMessage(messageData);
        if (!savedMessage) {
          console.warn('createMessage returned unexpected value:', savedMessage);
          setSnackbarMessage('留言似乎成功，但服务器未返回确认信息');
          setSnackbarOpen(true);
        } else {
          // 更新消息列表
          await fetchMessages(); // 重新获取所有消息以确保正确的排序
          setNewMessage('');
          setSnackbarMessage('留言成功！');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("详细错误信息:", error);
        const specificError = error?.details || error?.message || error?.error_description || '未知错误';
        setSnackbarMessage(`留言失败：${specificError}`);
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

  // 添加定期刷新消息的功能
  useEffect(() => {
    // 初始加载
    fetchMessages();

    // 设置定期刷新（每30秒）
    const refreshInterval = setInterval(() => {
      fetchMessages();
    }, 30000);

    // 清理函数
    return () => clearInterval(refreshInterval);
  }, [fetchMessages]);

  return (
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

        <Container maxWidth="md" sx={{ pb: 4, mb: 10 }}>
          <Typography variant="h3" className="pixel-title-pink">
            I Love Dirty Talk
          </Typography>
 
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 2,
            alignItems: 'start'
          }}>
            {messages
              .sort((a, b) => {
                // 首先按管理员消息排序
                const aIsAdmin = a.user_id === 'admin';
                const bIsAdmin = b.user_id === 'admin';
                if (aIsAdmin && !bIsAdmin) return -1;
                if (!aIsAdmin && bIsAdmin) return 1;
                // 然后按时间排序
                return new Date(b.created_at) - new Date(a.created_at);
              })
              .map((message) => (
                <MessageBubble
                  key={message.id}
                  message={isAdmin ? message.original_text : message.text}
                  onDelete={() => handleDelete(message.id, message.user_id)}
                  isOwner={isAdmin || message.user_id === userId}
                  isAdminMessage={message.user_id === 'admin'}
                />
              ))}
          </Box>
        </Container>
        
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            gap: 2,
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
            rows={2}
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
  )
}

export default MessageApp
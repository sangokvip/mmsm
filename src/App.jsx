import React, { useState, useRef } from 'react'
import { Container, Typography, Paper, Grid, Box, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, createTheme, ThemeProvider } from '@mui/material'
import Footer from './components/Footer'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import html2canvas from 'html2canvas'
import html2pdf from 'html2pdf.js'
import ScienceIcon from '@mui/icons-material/Science'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import HelpIcon from '@mui/icons-material/Help'
import MenuIcon from '@mui/icons-material/Menu'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CloseIcon from '@mui/icons-material/Close'
import MaleIcon from '@mui/icons-material/Male'
import MessageIcon from '@mui/icons-material/Message'
import './styles/pixel-theme.css'

const RATING_OPTIONS = ['SSS', 'SS', 'S', 'Q', 'N', 'W']
const CATEGORIES = {
  '👑 性奴': ['🔞 强奸', '👥 轮奸', '💋 口爆', '💦 颜射', '💉 内射', '🍑 肛交', '🔧 器具折磨', '⚡️ 强制高潮', '💧 潮吹失禁', '🎭 自慰展示', '🚫 禁止高潮', '🔄 扩张阴道', '⭕️ 扩张肛门', '🔄 双阳具插入', '➕ 多阳具插入', '✌️ 双插'],
  '🐕 犬奴': ['🔒 囚笼关押', '⛓️ 项圈镣铐', '🍽️ 喂食', '🐾 爬行', '👣 舔足', '👠 踩踏', '🎠 骑乘'],
  '🎎 玩偶奴': ['🎭 角色扮演', '👔 制服诱惑', '🎭 人偶装扮', '💍 乳环', '💎 阴环', '💫 脐环', '✂️ 剃毛', '🔍 内窥镜研究', '🔧 性工具研究', '🎨 作为艺术品', '🪑 作为家具', '🚬 作为烟灰缸', '👗 作为女仆', '🤐 限制说话内容'],
  '🌲 野奴': ['🌳 野外暴露', '⛓️ 野外奴役', '🏃‍♀️ 野外流放', '🌿 野外玩弄', '🏢 公共场合暴露', '🏛️ 公共场合玩弄', '🎗️ 公开场合捆绑（衣服内）', '📱 公开场合器具（衣服内）', '👀 露阴（像朋友）', '👥 露阴（向生人）', '🔐 贞操带', '📿 公开场合项圈'],
  '🐾 兽奴': ['🐕 兽交', '🐺 群兽轮交', '🐎 人兽同交', '🦁 兽虐', '🐜 昆虫爬身'],
  '⚔️ 刑奴': ['👋 耳光', '🤐 口塞', '💇‍♀️ 扯头发', '👢 皮带', '🎯 鞭子', '🎋 藤条', '🪵 木板', '🏏 棍棒', '🖌️ 毛刷', '⚡️ 虐阴', '🔗 紧缚', '⛓️ 吊缚', '🔒 拘束', '📎 乳夹', '⚡️ 电击', '🕯️ 滴蜡', '📍 针刺', '💉 穿孔', '🔥 烙印', '🎨 刺青', '✂️ 切割', '🔥 火刑', '💧 水刑', '😮‍💨 窒息', '👊 体罚', '🧊 冰块'],
  '🚽 厕奴': ['👅 舔精', '🥛 吞精', '💧 唾液', '💦 喝尿', '🚿 尿浴', '👄 舔阴', '💦 放尿', '🚰 灌肠', '👅 舔肛', '💩 排便', '🛁 粪浴', '🍽️ 吃粪', '🤧 吃痰', '🩸 吃经血'],
  '💭 心奴': ['🗣️ 言语侮辱', '😈 人格侮辱', '🧠 思维控制', '🌐 网络控制', '📢 语言管教'],
  '✨ 其他': ['👥 多奴调教', '👑 多主调教', '🌐 网络公调', '🪶 瘙痒', '📅 长期圈养', '⏱️ 短期圈养', '😴 剥夺睡眠', '🌀 催眠', '👭 同性性爱']
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
      light: '#9d46ff',
      dark: '#0a00b6',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#546e7a',
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
      marginBottom: '2rem',
      letterSpacing: '-0.5px',
      color: '#1a237e',
    },
    subtitle1: {
      color: 'text.secondary',
      marginBottom: '2.5rem',
      fontSize: '1.1rem',
    },
    h5: {
      fontWeight: 600,
      marginBottom: '1.5rem',
      color: '#303f9f',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '12px',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
})

function App() {
  const [ratings, setRatings] = useState({})
  const [openReport, setOpenReport] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedBatchRating, setSelectedBatchRating] = useState('')
  const reportRef = useRef(null)

  const handleRatingChange = (category, item, value) => {
    setRatings(prev => ({
      ...prev,
      [`${category}-${item}`]: value
    }))
  }

  const getRating = (category, item) => {
    return ratings[`${category}-${item}`] || ''
  }

  const getRatingColor = (rating) => {
    switch(rating) {
      case 'SSS': return '#FF1493'
      case 'SS': return '#FF69B4'
      case 'S': return '#87CEEB'
      case 'Q': return '#FFD700'
      case 'N': return '#FF4500'
      case 'W': return '#808080'
      default: return '#CCCCCC'
    }
  }

  const getRadarData = () => {
    return Object.entries(CATEGORIES).map(([category]) => {
      const items = CATEGORIES[category]
      const categoryScores = items.map(item => {
        const rating = getRating(category, item)
        switch(rating) {
          case 'SSS': return 6
          case 'SS': return 5
          case 'S': return 4
          case 'Q': return 3
          case 'N': return 2
          case 'W': return 1
          default: return 0
        }
      })
      const avgScore = categoryScores.reduce((a, b) => a + b, 0) / items.length
      return {
        category,
        value: avgScore,
        fullMark: 6
      }
    })
  }

  const getBarData = (category) => {
    return CATEGORIES[category].map(item => ({
      name: item,
      value: (() => {
        const rating = getRating(category, item)
        switch(rating) {
          case 'SSS': return 6
          case 'SS': return 5
          case 'S': return 4
          case 'Q': return 3
          case 'N': return 2
          case 'W': return 1
          default: return 0
        }
      })()
    }))
  }

  const handleExportImage = async () => {
    if (reportRef.current) {
      try {
        const reportElement = reportRef.current;
        
        // 创建一个新的容器元素
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.style.width = '1200px'; // 固定宽度以确保一致的布局
        container.style.backgroundColor = '#ffffff';
        document.body.appendChild(container);

        // 克隆报告元素
        const clonedReport = reportElement.cloneNode(true);
        container.appendChild(clonedReport);

        // 修改导出图片的网格布局为每行3列
        const optionsGrids = clonedReport.querySelectorAll('.options-grid');
        optionsGrids.forEach(grid => {
          grid.style.display = 'grid';
          grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
          grid.style.gap = '1rem';
          grid.style.width = '100%';
          grid.style.margin = '0 auto';
          // 确保每个选项有足够的空间
          const optionItems = grid.querySelectorAll('.option-item');
          optionItems.forEach(item => {
            item.style.minWidth = '0';
            item.style.flexWrap = 'nowrap';
            item.style.overflow = 'hidden';
            item.style.fontSize = '1.8em';
            // 增大评分等级说明的字体
            const ratingText = item.querySelector('.rating-text');
            if (ratingText) {
              ratingText.style.fontSize = '1.6em';
            }
          });
        });

        // 预处理克隆的元素
        const dialogElement = clonedReport.querySelector('[role="dialog"]');
        if (dialogElement) {
          dialogElement.style.position = 'relative';
          dialogElement.style.transform = 'none';
          dialogElement.style.top = '0';
          dialogElement.style.left = '0';
          dialogElement.style.width = '100%';
          dialogElement.style.height = 'auto';
          dialogElement.style.maxHeight = 'none';
          dialogElement.style.overflow = 'visible';
          dialogElement.style.display = 'block';
          dialogElement.style.margin = '0';
          dialogElement.style.padding = '2rem';
          dialogElement.style.boxSizing = 'border-box';

          // 增大标题字体
          const titles = dialogElement.querySelectorAll('.section-title');
          titles.forEach(title => {
            title.style.fontSize = '2.2em';
          });

          // 增大图表字体
          const charts = dialogElement.querySelectorAll('.recharts-text');
          charts.forEach(text => {
            text.style.fontSize = '1.6em';
          });
        }

        // 确保所有图表都已渲染
        await new Promise(resolve => setTimeout(resolve, 500));

        // 预加载二维码图片
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => {
            console.error('QR code image failed to load');
            resolve();
          };
          img.src = '/qrcode.png';
          // 确保图片完全加载
          if (img.complete) {
            resolve();
          }
        });
        
        // 增加额外延迟确保图片加载
        await new Promise(resolve => setTimeout(resolve, 200));

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: true,
          backgroundColor: '#ffffff',
          imageTimeout: 15000,
          onclone: (clonedDoc) => {
            const charts = clonedDoc.querySelectorAll('.recharts-wrapper');
            charts.forEach(chart => {
              chart.style.width = '100%';
              chart.style.height = 'auto';
            });
            
            // 确保二维码图片能够被正确渲染
            const qrCodeImages = clonedDoc.querySelectorAll('img[alt="QR Code"]');
            qrCodeImages.forEach(img => {
              // 确保图片已加载并可见
              if (img.src.includes('/qrcode.png')) {
                img.style.visibility = 'visible';
                img.style.display = 'block';
                // 强制设置图片源为绝对路径
                const absolutePath = new URL('/qrcode.png', window.location.origin).href;
                img.src = absolutePath;
                // 确保图片尺寸正确
                img.width = 200;
                img.height = 200;
              }
            });
          }
        });

        // 清理临时元素
        document.body.removeChild(container);

        // 将Canvas转换为Blob对象
        const blob = await new Promise(resolve => {
          canvas.toBlob(resolve, 'image/png', 1.0)
        })

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

        if (isMobile) {
          try {
            // 尝试使用Web Share API
            if (navigator.share && navigator.canShare) {
              const file = new File([blob], '女M自评报告.png', { type: 'image/png' })
              const shareData = { files: [file] }
              
              if (navigator.canShare(shareData)) {
                await navigator.share(shareData)
                setSnackbarMessage('图片已准备好分享！')
                setSnackbarOpen(true)
                return
              }
            }

            // 如果Web Share API不可用，尝试使用FileSaver API
            if ('saveAs' in navigator) {
              await navigator.saveAs(blob, '女M自评报告.png')
              setSnackbarMessage('报告已保存到相册！')
              setSnackbarOpen(true)
              return
            }

            // 回退方案：使用传统的下载方法
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = '女M自评报告.png'
            link.style.display = 'none'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            setSnackbarMessage('报告已保存为高清图片！')
            setSnackbarOpen(true)
          } catch (error) {
            console.error('保存图片错误:', error)
            setSnackbarMessage('保存图片失败，请尝试使用系统自带的截图功能')
            setSnackbarOpen(true)
          }
        } else {
          // 桌面端使用传统下载方法
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = '女M自评报告.png'
          link.click()
          URL.revokeObjectURL(url)
          setSnackbarMessage('报告已保存为高清图片！')
          setSnackbarOpen(true)
        }
      } catch (error) {
        console.error('导出图片错误:', error)
        setSnackbarMessage('导出图片失败，请重试')
        setSnackbarOpen(true)
      }
    }
  }

  const handleExportPDF = async () => {
    if (reportRef.current) {
      try {
        const element = reportRef.current
        const opt = {
          margin: 1,
          filename: '女M自评报告.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }
        await html2pdf().set(opt).from(element).save()
        setSnackbarMessage('报告已成功保存为PDF！')
        setSnackbarOpen(true)
      } catch (error) {
        setSnackbarMessage('导出PDF失败，请重试')
        setSnackbarOpen(true)
      }
    }
  }

  const handleSetAllRating = (category, rating) => {
    const items = CATEGORIES[category]
    const newRatings = { ...ratings }
    items.forEach(item => {
      newRatings[`${category}-${item}`] = rating
    })
    setRatings(newRatings)
    setSnackbarMessage(`已将${category}类别下所有选项设置为${rating}`)
    setSnackbarOpen(true)
  }

  const handleShareToWeChat = async () => {
    try {
      // 检查是否支持Web Share API
      if (!navigator.share) {
        setSnackbarMessage('您的浏览器不支持分享功能')
        setSnackbarOpen(true)
        return
      }

      // 检查是否支持分享文件
      const canShareFiles = navigator.canShare && await reportRef.current

      if (canShareFiles) {
        // 尝试分享带有文件的内容
        try {
          const canvas = await html2canvas(reportRef.current)
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0))
          const file = new File([blob], '女M自评报告.png', { type: 'image/png' })
          const shareData = {
            title: '女M自评报告',
            text: '查看我的女M自评报告',
            files: [file]
          }

          if (navigator.canShare(shareData)) {
            await navigator.share(shareData)
            setSnackbarMessage('分享成功！')
            setSnackbarOpen(true)
            return
          }
        } catch (error) {
          console.error('分享文件失败:', error)
        }
      }

      // 如果无法分享文件，退回到基本分享
      await navigator.share({
        title: '女M自评报告',
        text: '查看我的女M自评报告'
      })
      setSnackbarMessage('分享成功！')
      setSnackbarOpen(true)
    } catch (error) {
      console.error('分享失败:', error)
      if (error.name === 'AbortError') {
        setSnackbarMessage('分享已取消')
      } else {
        setSnackbarMessage('分享失败，请重试')
      }
      setSnackbarOpen(true)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh'
      }}>

      <AppBar position="sticky" sx={{
        background: 'transparent',
        backgroundColor: '#fff0f5',
        border: '4px solid #ff69b4',
        borderBottom: '4px solid #ff69b4',
        boxShadow: '4px 4px 0 rgba(255, 105, 180, 0.5)',
        borderRadius: '0',
        marginBottom: '1rem'
      }} className="pixel-theme-pink">

        <Container maxWidth="lg">
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: { xs: '8px 16px', md: '8px 24px' },
            minHeight: { xs: '56px', md: '64px' }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              flex: '1 1 auto',
              justifyContent: 'flex-start',
              height: '100%'
            }}>
              <ScienceIcon sx={{ display: 'flex', color: '#1E3D59' }} />
              <Typography variant="h5" sx={{
                fontWeight: 'bold',
                color: '#1E3D59',
                display: 'flex',
                alignItems: 'center',
                margin: 0,
                padding: 0,
                lineHeight: 1,
                height: '100%'
              }} className="pixel-title-pink">
                M-Profile Lab
              </Typography>
            </Box>
                
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: 2,
              flex: '1 1 auto',
              justifyContent: 'flex-end'
            }}>              
              <Button color="inherit" startIcon={<HomeIcon />} href="/index.html" className="pixel-button-pink" sx={{ color: '#1E3D59' }}>首页</Button>
              <Button color="inherit" startIcon={<InfoIcon />} className="pixel-button-pink" sx={{ color: '#1E3D59' }}>关于</Button>
              <Button color="inherit" startIcon={<HelpIcon />} className="pixel-button-pink" sx={{ color: '#1E3D59' }}>使用指南</Button>
              <Button color="inherit" startIcon={<ScienceIcon />} href="/s.html" className="pixel-button-pink" sx={{ color: '#1E3D59' }}>S版</Button>
              <Button color="inherit" startIcon={<MaleIcon />} href="/male.html" className="pixel-button-pink" sx={{ color: '#1E3D59' }}>男生版</Button>
              <Button color="inherit" startIcon={<MessageIcon />} href="/message.html" className="pixel-button-pink" sx={{ color: '#1E3D59' }}>留言板</Button>
            </Box>

            <IconButton
              color="inherit"
              sx={{ display: { xs: 'block', md: 'none' } }}
              onClick={() => setMobileMenuOpen(true)}
              className="pixel-button-pink"
            >
              <MenuIcon sx={{ color: '#1E3D59' }} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        className="pixel-theme-pink"
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            <ListItem button component="a" href="/index.html">
              <ListItemIcon><HomeIcon sx={{ color: '#1E3D59' }} /></ListItemIcon>
              <ListItemText primary="首页" sx={{ color: '#1E3D59' }} />
            </ListItem>
            <ListItem button>
              <ListItemIcon><InfoIcon sx={{ color: '#1E3D59' }} /></ListItemIcon>
              <ListItemText primary="关于" sx={{ color: '#1E3D59' }} />
            </ListItem>
            <ListItem button>
              <ListItemIcon><HelpIcon sx={{ color: '#1E3D59' }} /></ListItemIcon>
              <ListItemText primary="使用指南" sx={{ color: '#1E3D59' }} />
            </ListItem>
            <ListItem button component="a" href="/s.html">
              <ListItemIcon><ScienceIcon sx={{ color: '#1E3D59' }} /></ListItemIcon>
              <ListItemText primary="S版" sx={{ color: '#1E3D59' }} />
            </ListItem>
            <ListItem button component="a" href="/male.html">
              <ListItemIcon><MaleIcon sx={{ color: '#1E3D59' }} /></ListItemIcon>
              <ListItemText primary="男生版" sx={{ color: '#1E3D59' }} />
            </ListItem>
            <ListItem button component="a" href="/message.html">
              <ListItemIcon><MessageIcon sx={{ color: '#1E3D59' }} /></ListItemIcon>
              <ListItemText primary="留言板" sx={{ color: '#1E3D59' }} />
            </ListItem>
          </List>
          <List>
            <ListItem button onClick={() => {
              const newRatings = {};
              Object.entries(CATEGORIES).forEach(([category, items]) => {
                items.forEach(item => {
                  const randomIndex = Math.floor(Math.random() * RATING_OPTIONS.length);
                  newRatings[`${category}-${item}`] = RATING_OPTIONS[randomIndex];
                });
              });
              setRatings(newRatings);
              setSnackbarMessage('已完成随机选择！');
              setSnackbarOpen(true);
              setMobileMenuOpen(false);
            }}>
              <ListItemIcon><AutorenewIcon /></ListItemIcon>
              <ListItemText primary="随机选择" />
            </ListItem>
            <ListItem button onClick={() => setMobileMenuOpen(false)}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="首页" />
            </ListItem>
            <ListItem button onClick={() => setMobileMenuOpen(false)}>
              <ListItemIcon><InfoIcon /></ListItemIcon>
              <ListItemText primary="关于" />
            </ListItem>
            <ListItem button onClick={() => setMobileMenuOpen(false)}>
              <ListItemIcon><HelpIcon /></ListItemIcon>
              <ListItemText primary="使用指南" />
            </ListItem>
            <ListItem button component="a" href="/male.html">
              <ListItemText primary="男性版" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{
        py: 8,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        animation: 'fadeIn 0.6s ease-in-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }} className="pixel-theme-pink">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }} className="pixel-title-pink">
            女M自评报告
          </Typography>
          <Box className="pixel-divider-pink" sx={{ mb: 4, mt: 2 }}></Box>
          <Paper elevation={1} sx={{ 
            mt: 2, 
            p: 2, 
            borderRadius: 0,
            maxWidth: { xs: '100%', md: '80%' },
            mx: 'auto'
          }} className="pixel-card-pink">
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main', textAlign: 'center' }}>
              评分等级说明
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 1, md: 2 } }}>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: '#FF1493' }}>SSS</Box> = 非常喜欢
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: '#FF69B4' }}>SS</Box> = 喜欢
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: '#87CEEB' }}>S</Box> = 接受
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: '#FFD700' }}>Q</Box> = 不喜欢但会做
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: '#FF4500' }}>N</Box> = 拒绝
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: '#808080' }}>W</Box> = 未知
              </Typography>
            </Box>
          </Paper>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AutorenewIcon />}
              sx={{
                padding: '12px 32px',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
              className="pixel-button-pink"
              onClick={() => {
                const newRatings = {};
                Object.entries(CATEGORIES).forEach(([category, items]) => {
                  items.forEach(item => {
                    const randomIndex = Math.floor(Math.random() * RATING_OPTIONS.length);
                    newRatings[`${category}-${item}`] = RATING_OPTIONS[randomIndex];
                  });
                });
                setRatings(newRatings);
                setSnackbarMessage('已完成随机选择！');
                setSnackbarOpen(true);
              }}
            >
              随机选择
            </Button>
          </Box>
        </Box>
        
        {Object.entries(CATEGORIES).map(([category, items]) => (
          <Paper key={category} elevation={2} sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 0,
            backgroundColor: 'background.paper',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
            }
          }} className="pixel-card-pink">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h5" sx={{ mb: 0 }}>
                {category}
              </Typography>
              <Select
                size="small"
                value={selectedBatchRating}
                onChange={(e) => {
                  handleSetAllRating(category, e.target.value)
                  setSelectedBatchRating('')
                }}
                displayEmpty
                placeholder="一键选择"
                renderValue={(value) => value || "一键选择"}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value=""><em>一键选择</em></MenuItem>
                {RATING_OPTIONS.map(rating => (
                  <MenuItem key={rating} value={rating}>{rating}</MenuItem>
                ))}
              </Select>
            </Box>
            <Grid container spacing={2} sx={{ mt: 0, width: '100%', margin: 0 }}>
              {items.map(item => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: { xs: 1, md: 1.5 },
                    borderRadius: 2,
                    height: '100%',
                    backgroundColor: getRating(category, item) ? 
                      `${getRatingColor(getRating(category, item))}20` : // 添加20表示12.5%透明度
                      'background.paper',
                    boxShadow: getRating(category, item) ?
                      `0 1px 4px ${getRatingColor(getRating(category, item))}60` :
                      '0 1px 3px rgba(0,0,0,0.1)',
                    borderLeft: getRating(category, item) ?
                      `3px solid ${getRatingColor(getRating(category, item))}` :
                      'none',
                    transition: 'all 0.3s ease',
                    gap: 1,
                    '&:hover': {
                      backgroundColor: getRating(category, item) ? 
                        `${getRatingColor(getRating(category, item))}30` : // 悬停时增加透明度到约18.75%
                        'rgba(98, 0, 234, 0.04)',
                      transform: 'translateX(4px)',
                      boxShadow: getRating(category, item) ?
                        `0 2px 8px ${getRatingColor(getRating(category, item))}80` :
                        '0 2px 6px rgba(0,0,0,0.15)',
                    },
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      flexGrow: 1,
                      minWidth: 0
                    }}>
                    <Typography sx={{ 
                      fontWeight: 500, 
                      color: getRating(category, item) ? 
                        `${getRatingColor(getRating(category, item))}` : 
                        'text.primary',
                      fontSize: { xs: '0.85rem', md: '1rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.3s ease'
                    }}>{item}</Typography>
                    </Box>
                    <Select
                      size="small"
                      value={getRating(category, item)}
                      onChange={(e) => handleRatingChange(category, item, e.target.value)}
                      sx={{ 
                        minWidth: { xs: 100, md: 120 },
                        '.MuiSelect-select': {
                          py: 1.5,
                          px: 2
                        }
                      }}
                    >
                      <MenuItem value=""><em>请选择</em></MenuItem>
                      {RATING_OPTIONS.map(rating => (
                        <MenuItem key={rating} value={rating}>{rating}</MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, gap: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setOpenReport(true)}
            sx={{ minWidth: 200 }}
            className="pixel-button-pink"
          >
            生成报告
          </Button>
          <Paper elevation={2} sx={{
            p: 3,
            borderRadius: 0,
            textAlign: 'center',
            maxWidth: 300,
            mx: 'auto',
            backgroundColor: 'white'
          }} className="pixel-card-pink">
            <Typography variant="subtitle1" sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2
            }}>
              扫码领取您的XP报告
            </Typography>
            <Box component="img" src="/qrcode.png" alt="QR Code" sx={{
              width: '200px',
              height: '200px',
              display: 'block',
              margin: '0 auto'
            }} />
          </Paper>
        </Box>

        <Dialog
          open={openReport}
          onClose={() => setOpenReport(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              minHeight: { xs: '95vh', md: 'auto' },
              maxHeight: { xs: '95vh', md: '90vh' },
              overflowY: 'auto',
              m: { xs: 1, sm: 2 },
              width: '100%',
              maxWidth: { sm: '800px' },
              mx: 'auto',
              backgroundColor: '#fafafa',
              '@media print': {
                height: 'auto',
                maxHeight: 'none',
                overflow: 'visible'
              }
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            fontWeight: 'bold', 
            pt: { xs: 4, md: 5 },
            mt: { xs: 2, md: 3 },
            borderBottom: '2px dashed #ff69b4',
            mb: 2
          }} className="pixel-title-pink">
            女M自评详细报告
          </DialogTitle>
          <DialogContent ref={reportRef} sx={{ 
            px: 4, 
            py: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            '@media print': {
              overflow: 'visible',
              height: 'auto'
            }
          }}>
            <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.main', 
                textAlign: 'center', 
                fontSize: { xs: '1.1rem', md: '1.2rem' },
                fontWeight: 'bold',
                mb: 3,
                mt: { xs: 3, md: 4 }
              }}>
                女M自评总体评分分布
              </Typography>
              <Box sx={{
                width: '100%',
                height: { xs: 260, sm: 280, md: 300 },
                position: 'relative',
                mb: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '@media print': {
                  height: 300,
                  overflow: 'visible'
                }
              }}>
                <RadarChart
                  width={500}
                  height={300}
                  data={getRadarData()}
                  style={{ maxWidth: '100%', width: '100%', height: '100%' }}
                >
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{
                      fill: '#2c3e50',
                      fontSize: window.innerWidth < 600 ? 9 : 12
                    }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 6]} tick={{ fill: '#2c3e50' }} />
                  <Radar name="评分" dataKey="value" stroke="#6200ea" fill="#6200ea" fillOpacity={0.6} animationDuration={500} />
                  <Radar name="满分" dataKey="fullMark" stroke="#ddd" strokeDasharray="3 3" fill="none" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: window.innerWidth < 600 ? 10 : 12 }} />
                </RadarChart>
              </Box>
              <Paper elevation={2} sx={{ 
                mt: 4, 
                p: 3, 
                borderRadius: 2,
                backgroundColor: 'white',
                maxWidth: '100%',
                mx: 'auto',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2, 
                  color: 'primary.main', 
                  textAlign: 'center',
                  fontSize: '1rem'
                }}>
                  评分等级说明
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 1, md: 2 } }}>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    <Box component="span" sx={{ fontWeight: 'bold', color: '#FF1493' }}>SSS</Box> = 非常喜欢
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    <Box component="span" sx={{ fontWeight: 'bold', color: '#FF69B4' }}>SS</Box> = 喜欢
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    <Box component="span" sx={{ fontWeight: 'bold', color: '#87CEEB' }}>S</Box> = 接受
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    <Box component="span" sx={{ fontWeight: 'bold', color: '#FFD700' }}>Q</Box> = 不喜欢但会做
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    <Box component="span" sx={{ fontWeight: 'bold', color: '#FF4500' }}>N</Box> = 拒绝
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    <Box component="span" sx={{ fontWeight: 'bold', color: '#808080' }}>W</Box> = 未知
                  </Typography>
                </Box>
              </Paper>
            </Box>
            {Object.entries(CATEGORIES).map(([category, items]) => (
              <Box key={category} sx={{ mb: 2, maxWidth: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{
                  color: 'primary.main',
                  textAlign: 'center',
                  borderBottom: '2px solid #6200ea',
                  pb: 0.5,
                  mb: 1.5,
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}>
                  {category}
                </Typography>
                <Grid container spacing={1.5} justifyContent="center">
                  {items
                    .filter(item => getRating(category, item))
                    .sort((a, b) => {
                      const ratingOrder = { 'SSS': 0, 'SS': 1, 'S': 2, 'Q': 3, 'N': 4, 'W': 5 };
                      return ratingOrder[getRating(category, a)] - ratingOrder[getRating(category, b)];
                    })
                    .map(item => (
                    <Grid item xs={6} sm={4} key={item}>
                      <Paper elevation={1} sx={{
                        p: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(98, 0, 234, 0.04)'
                        },
                        backgroundColor: `${getRatingColor(getRating(category, item))}10`,
                        borderLeft: `3px solid ${getRatingColor(getRating(category, item))}`
                      }}>
                        <Typography sx={{
                          fontWeight: 500,
                          color: 'text.primary',
                          fontSize: { xs: '0.8rem', md: '0.85rem' }
                        }}>
                          {item}
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor: getRatingColor(getRating(category, item)),
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            fontWeight: 'bold',
                            minWidth: '50px',
                            textAlign: 'center',
                            fontSize: { xs: '0.8rem', md: '0.85rem' }
                          }}
                        >
                          {getRating(category, item)}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
            <Paper elevation={2} sx={{
              p: 3,
              borderRadius: 2,
              textAlign: 'center',
              maxWidth: 300,
              mx: 'auto',
              backgroundColor: 'white',
              mt: 4
            }}>
              <Box component="img" src="/qrcode.png" alt="QR Code" sx={{
                width: '200px',
                height: '200px',
                display: 'block',
                margin: '0 auto'
              }} />
            </Paper>
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center', 
            pb: 3, 
            pt: 2,
            gap: 2,
            borderTop: '1px solid rgba(0,0,0,0.1)',
            backgroundColor: 'white'
          }}>
            <Button
              onClick={handleExportImage}
              variant="contained"
              color="primary"
              className="pixel-button-pink"
            >
              保存为图片
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="contained"
              color="secondary"
              className="pixel-button-pink"
            >
              保存为PDF
            </Button>
            <Button
              onClick={handleShareToWeChat}
              variant="contained" color="info"
              className="pixel-button-pink"
            >
              分享到微信
            </Button>
            <Button
              onClick={() => setOpenReport(false)}
              variant="outlined"
              color="error"
              startIcon={<CloseIcon />}
              className="pixel-button-pink"
            >
              关闭报告
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Container>
      
      <Footer pixelStyle={true} pinkStyle={true} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
import React, { useState, useRef } from 'react'
import { Container, Typography, Paper, Grid, Box, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, createTheme, ThemeProvider } from '@mui/material'
import './styles/pixel-theme.css'
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
import FemaleIcon from '@mui/icons-material/Female'
import Footer from './components/Footer'

// 使用黑白像素风格的Footer

const MENU_ITEMS = [
  { icon: <HomeIcon />, text: '首页', href: '/index.html' },
  { icon: <ScienceIcon />, text: '评分说明', onClick: () => setOpenHelp(true) },
  { icon: <InfoIcon />, text: '关于', onClick: () => setOpenAbout(true) },
  { icon: <HelpIcon />, text: '帮助', onClick: () => setOpenGuide(true) }
]

const RATING_OPTIONS = ['SSS', 'SS', 'S', 'Q', 'N', 'W']
const CATEGORIES = {
  '👣 恋足': ['🧎 跪拜', '🦶 足交', '👃 闻脚', '👅 舔足(无味)', '👅 舔足(原味)', '🧦 舔袜(无味)', '🧦 舔袜(原味)', '🤐 袜堵嘴', '👞 舔鞋(调教用)', '👠 舔鞋(户外穿)', '🍽️ 足喂食', '💧 喝洗脚水', '💦 喝洗袜水', '👄 足深喉', '🦵 踢打', '🦶 裸足踩踏', '👠 高跟踩踏'],
  '👑 性奴': ['👅 舔阴', '👄 舔肛', '🚫 禁止射精', '🎭 自慰表演', '🔧 器具折磨', '💦 舔食自己精液', '🍑 肛门插入', '⭕️ 扩肛', '🕳️ 马眼插入', '🎠 木马', '🍆 阳具插入'],
  '🐕 狗奴': ['🐾 狗姿', '📿 项圈', '⛓️ 镣铐', '🏠 看门', '🐾 狗爬', '🦮 室内遛狗', '💦 狗撒尿', '👅 狗舔食', '🍽️ 口吐食', '💧 口水', '🥄 痰盂', '🎭 狗装', '🐶 狗叫', '👙 内裤套头', '👃 舔内裤（原味）', '🚬 烟灰缸', '🔒 狗笼关押', '⛓️ 圈禁饲养', '🎠 骑马'],
  '🎎 性玩具': ['🎭 角色扮演', '💍 乳环', '⭕️ 龟头环', '💫 肛环', '🔒 贞操锁', '🔌 肛塞', '✍️ 身上写字（可洗）', '📝 身上写字（不洗）', '👗 CD异装', '✂️ 剃光头', '🪒 剃毛', '🔧 性工具玩弄', '🪑 固定在桌椅上', '👤 坐脸', '💧 灌肠（温和液体）', '⚡️ 灌肠（刺激液体）', '📸 拍照/录像（露脸）', '📷 拍照/录像（不露脸）', '🎯 作为玩具', '🪑 作为家具', '👔 作为男仆'],
  '🐾 兽奴': ['🐕 兽交', '🐺 群兽轮交', '🦁 兽虐', '🐜 昆虫爬身'],
  '🌲 野奴': ['🌳 野外奴役', '🏃 野外流放', '🌿 野外玩弄', '👀 公共场合暴露', '🏛️ 公共场合玩弄', '⛓️ 公共场合捆绑', '🔧 公共场合器具', '🔒 贞操锁', '👥 露阳(熟人)', '👀 露阳(生人)', '🐕 野外遛狗'],
  '⚔️ 刑奴': ['👋 耳光', '🎋 藤条抽打', '🎯 鞭打', '🪵 木板拍打', '🖌️ 毛刷', '👊 拳脚', '🤐 口塞', '⛓️ 吊缚', '🔒 拘束', '🔗 捆绑', '😮‍💨 控制呼吸', '📎 乳夹', '⚖️ 乳头承重', '🔗 阴茎夹子', '📎 阴囊夹子', '⚖️ 阴茎吊重物', '⚖️ 阴囊吊重物', '🎯 鞭打阳具', '🦶 踢裆', '🪶 瘙痒', '⚡️ 电击', '🕯️ 低温滴蜡', '🔥 高温滴蜡', '📍 针刺', '💉 穿孔', '👊 体罚', '🤐 木乃伊', '💧 水刑', '🔥 火刑', '🧊 冰块', '🔥 烙印', '✂️ 身体改造', '✂️ 阉割'],
  '💭 心奴': ['🗣️ 语言侮辱', '🗣️ 语言侮辱', '😈 人格侮辱', '🧠 思维控制', '🌐 网络控制', '📢 网络公调'],
  '🏠 家奴': ['⏱️ 短期圈养', '📅 长期圈养', '👥 多奴调教', '👑 多主调教', '👥 熟人旁观', '👀 生人旁观', '😈 熟人侮辱', '🗣️ 生人侮辱', '😴 剥夺睡眠', '🌀 催眠', '🧹 家务', '👔 伺候'],
  '🚽 厕奴': ['🚽 伺候小便', '🚽 伺候大便', '🚿 圣水浴', '💧 喝圣水', '🍽️ 圣水食物', '🧻 舔舐厕纸', '🛁 黄金浴', '🍽️ 吃黄金', '🧹 清洁马桶', '🩸 吃红金', '💉 尿液灌肠']
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
      case 'SSS': return '#1E3D59' // 深海蓝
      case 'SS': return '#2C5530'  // 深森绿
      case 'S': return '#37474F'   // 深蓝灰
      case 'Q': return '#455A64'   // 蓝灰
      case 'N': return '#546E7A'   // 中蓝灰
      case 'W': return '#607D8B'   // 浅蓝灰
      default: return '#90A4AE'    // 极浅蓝灰
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
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        // 创建一个新的容器元素
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        // 根据设备类型调整容器宽度
        container.style.width = isMobile ? '900px' : '1200px'; // 移动端使用较小宽度以优化比例
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
          grid.style.gap = isMobile ? '0.8rem' : '1rem'; // 移动端减小间距
          grid.style.width = '100%';
          grid.style.margin = '0 auto';
          // 确保每个选项有足够的空间
          const optionItems = grid.querySelectorAll('.option-item');
          optionItems.forEach(item => {
            item.style.minWidth = '0';
            item.style.flexWrap = 'nowrap';
            item.style.overflow = 'hidden';
            item.style.fontSize = isMobile ? '1.5em' : '1.8em'; // 移动端适当减小字体
            // 调整评分等级说明的字体
            const ratingText = item.querySelector('.rating-text');
            if (ratingText) {
              ratingText.style.fontSize = isMobile ? '1.3em' : '1.6em';
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
          dialogElement.style.padding = isMobile ? '1.5rem' : '2rem'; // 移动端减小内边距
          dialogElement.style.boxSizing = 'border-box';

          // 调整标题字体
          const titles = dialogElement.querySelectorAll('.section-title');
          titles.forEach(title => {
            title.style.fontSize = isMobile ? '1.8em' : '2.2em'; // 移动端适当减小标题字体
          });

          // 调整图表字体
          const charts = dialogElement.querySelectorAll('.recharts-text');
          charts.forEach(text => {
            text.style.fontSize = isMobile ? '1.4em' : '1.6em'; // 移动端适当减小图表字体
          });
        }

        // 确保所有图表都已渲染
        await new Promise(resolve => setTimeout(resolve, 800)); // 增加等待时间确保图表完全渲染

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

        const canvas = await html2canvas(container, {
          scale: isMobile ? 3 : 2, // 移动端提高scale值以增加清晰度
          useCORS: true,
          allowTaint: true,
          logging: true, // 启用日志以便调试
          backgroundColor: '#ffffff',
          imageTimeout: 15000, // 增加图片加载超时时间
          width: container.offsetWidth, // 确保使用实际宽度
          height: container.offsetHeight, // 确保使用实际高度
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
        
        // 优化图片质量 - 将Canvas转换为高质量Blob对象
        const blob = await new Promise(resolve => {
          canvas.toBlob(resolve, 'image/png', 1.0) // 使用最高质量
        })

        // 已在前面定义了isMobile变量

        if (isMobile) {
          try {
            // 方法1: 尝试使用Web Share API (最现代的方法)
            if (navigator.share && navigator.canShare) {
              const file = new File([blob], '男M自评报告.png', { type: 'image/png' })
              const shareData = { files: [file] }
              
              if (navigator.canShare(shareData)) {
                await navigator.share(shareData)
                setSnackbarMessage('图片已准备好分享！')
                setSnackbarOpen(true)
                return
              }
            }

            // 方法2: 尝试使用FileSaver.js
            try {
              const FileSaver = await import('file-saver');
              FileSaver.saveAs(blob, '男M自评报告.png');
              setSnackbarMessage('报告已保存到相册！');
              setSnackbarOpen(true);
              return;
            } catch (error) {
              console.error('FileSaver error:', error);
            }

            // 方法3: 尝试使用传统下载方法 - 创建临时链接
            try {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = '男M自评报告.png';
              // 在iOS上，需要将链接添加到DOM并模拟点击
              document.body.appendChild(link);
              link.click();
              // 给足够的时间让浏览器处理下载
              setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }, 1000);
              setSnackbarMessage('报告已保存为图片！');
              setSnackbarOpen(true);
              return;
            } catch (downloadError) {
              console.error('Traditional download error:', downloadError);
            }

            // 方法4: 尝试使用data URL方法 (适用于某些移动浏览器)
            try {
              const dataUrl = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.href = dataUrl;
              link.download = '男M自评报告.png';
              link.target = '_blank'; // 在新标签页打开可能有助于某些移动浏览器
              document.body.appendChild(link);
              link.click();
              setTimeout(() => document.body.removeChild(link), 1000);
              setSnackbarMessage('报告已保存为高清图片！');
              setSnackbarOpen(true);
              return;
            } catch (dataUrlError) {
              console.error('Data URL error:', dataUrlError);
            }

            // 所有方法都失败时的提示
            setSnackbarMessage('保存图片失败，请尝试使用保存为PDF功能！');
            setSnackbarOpen(true);
          } catch (error) {
            console.error('保存图片错误:', error);
            setSnackbarMessage('保存图片失败，请尝试使用保存为PDF功能！');
            setSnackbarOpen(true);
          }
        } else {
          // 桌面端使用传统下载方法
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = '男M自评报告.png';
          link.click();
          URL.revokeObjectURL(url);
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
          filename: '男M自评报告.pdf',
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
          const file = new File([blob], '男M自评报告.png', { type: 'image/png' })
          const shareData = {
            title: '男M自评报告',
            text: '查看我的男M自评报告',
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
        title: '男M自评报告',
        text: '查看我的男M自评报告'
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
        background: '#000',
        border: '2px solid #fff',
        borderStyle: 'double',
        boxShadow: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)',
          opacity: 0.1,
          pointerEvents: 'none'
        }
      }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: { xs: '8px 16px', md: '8px 24px' },
            minHeight: { xs: '56px', md: '64px' },
            '& .MuiButton-root': {
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '0.8rem',
              border: '2px solid #fff',
              '&:hover': {
                background: '#fff',
                color: '#000',
                transform: 'translateY(0)',
                boxShadow: 'none'
              }
            }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              flex: '1 1 auto',
              justifyContent: 'flex-start',
              height: '100%'
            }}>
              <ScienceIcon sx={{ display: 'flex' }} />
              <Typography variant="h5" sx={{
                fontFamily: '"Press Start 2P", cursive',
                fontWeight: 'bold',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                margin: 0,
                padding: 0,
                lineHeight: 1,
                height: '100%',
                fontSize: '1rem',
                letterSpacing: '0.1em',
                textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000'
              }}>
                M-Profile Lab
              </Typography>
            </Box>
                
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: 2,
              flex: '1 1 auto',
              justifyContent: 'flex-end',
              '& .MuiButton-root': {
                border: '2px solid #fff',
                '&:hover': {
                  background: '#fff',
                  color: '#000'
                }
              }
            }}>              
              <Button color="inherit" startIcon={<HomeIcon />} href="/index.html">首页</Button>
              <Button color="inherit" startIcon={<InfoIcon />}>关于</Button>
              <Button color="inherit" startIcon={<HelpIcon />}>使用指南</Button>
              <Button color="inherit" startIcon={<ScienceIcon />} href="/s.html">S版</Button>
              <Button color="inherit" href="/female.html" startIcon={<FemaleIcon />}>女生版</Button>
            </Box>

            <IconButton
              color="inherit"
              sx={{ 
                display: { xs: 'block', md: 'none' },
                border: '2px solid #fff',
                borderRadius: '4px',
                padding: '4px',
                '&:hover': {
                  background: '#fff',
                  color: '#000'
                }
              }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>

            <ListItem button component="a" href="/index.html" onClick={() => setMobileMenuOpen(false)}>
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
            <ListItem button component="a" href="/female.html">
              <ListItemText primary="女性版" />
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
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'black' }}>
            男M自评报告
          </Typography>
          <Paper elevation={1} sx={{ 
            mt: 2, 
            p: 2, 
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            maxWidth: { xs: '100%', md: '80%' },
            mx: 'auto'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#000000', textAlign: 'center' }}>
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
              className="pixel-button"
              sx={{ fontFamily: '"Press Start 2P", cursive' }}
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
            borderRadius: 3,
            backgroundColor: 'background.paper',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h5" sx={{ mb: 0, color: 'black' }}>
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
                          px: 2,
                          color: getRating(category, item) ? getRatingColor(getRating(category, item)) : 'inherit'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: getRating(category, item) ? `${getRatingColor(getRating(category, item))}80` : 'rgba(0, 0, 0, 0.23)',
                          transition: 'border-color 0.3s ease'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: getRating(category, item) ? getRatingColor(getRating(category, item)) : 'rgba(0, 0, 0, 0.23)'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: getRating(category, item) ? getRatingColor(getRating(category, item)) : 'primary.main'
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
            className="pixel-button"
            sx={{ minWidth: 200 }}
          >
            生成报告
          </Button>
          <Paper elevation={2} sx={{
            p: 3,
            borderRadius: 2,
            textAlign: 'center',
            maxWidth: 300,
            mx: 'auto',
            backgroundColor: 'white'
          }}>
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
            color: 'black',
            borderBottom: '2px solid #6200ea',
            mb: 2
          }}>
            男M自评详细报告
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
                男M自评总体评分分布
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
                  color: 'black',
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
            >
              保存为图片
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="contained"
              color="secondary"
            >
              保存为PDF
            </Button>
            <Button
              onClick={handleShareToWeChat}
              variant="contained" color="info"
            >
              分享到微信
            </Button>
            <Button
              onClick={() => setOpenReport(false)}
              variant="outlined"
              color="error"
              startIcon={<CloseIcon />}
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
      
      <Footer pixelStyle={true} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
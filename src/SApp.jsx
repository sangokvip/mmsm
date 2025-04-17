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
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import Footer from './components/Footer'

// MENU_ITEMS定义移到函数组件内部

const RATING_OPTIONS = ['SSS', 'SS', 'S', 'Q', 'N', 'W']
const CATEGORIES = {
  '👑 性主': ['🔞 强制性交', '👥 多人支配', '💋 命令口交', '💦 命令颜射', '💉 命令内射', '🍑 命令肛交', '🔧 使用器具调教', '⚡️ 引发强制高潮', '💧 引发潮吹失禁', '🎭 命令自慰展示', '🚫 禁止对方高潮', '🔄 扩张对方阴道', '⭕️ 扩张对方肛门', '🔄 双阳具调教', '➕ 多阳具调教', '✌️ 双插掌控'],
  '🐕 犬主': ['🔒 囚笼管理', '⛓️ 使用项圈镣铐', '🍽️ 喂食控制', '🐾 命令爬行', '👣 要求舔足', '👠 踩踏调教', '🎠 骑乘支配'],
  '🎎 玩偶主': ['🎭 安排角色扮演', '👔 命令制服诱惑', '🎭 要求人偶装扮', '💍 安装乳环', '💎 安装阴环', '💫 安装脐环', '✂️ 命令剃毛', '🔍 使用内窥镜研究', '🔧 实验性工具', '🎨 将对方作为艺术品', '🪑 将对方作为家具', '🚬 将对方作为烟灰缸', '👗 将对方作为女仆', '🤐 限制对方说话内容'],
  '🌲 野主': ['🌳 野外暴露调教', '⛓️ 野外奴役', '🏃‍♀️ 野外流放支配', '🌿 野外玩弄', '🏢 公共场合暴露命令', '🏛️ 公共场合调戏', '🎗️ 公开场合捆绑（衣服内）', '📱 公开场合使用器具（衣服内）', '👀 命令露阴（向朋友）', '👥 命令露阴（向生人）', '🔐 使用贞操带', '📿 公开场合佩戴项圈'],
  '🐾 兽主': ['🐕 安排兽交', '🐺 安排群兽轮交', '🐎 安排人兽同交', '🦁 支配兽虐', '🐜 命令昆虫爬身'],
  '⚔️ 刑主': ['👋 施加耳光', '🤐 使用口塞', '💇‍♀️ 扯头发', '👢 使用皮带', '🎯 使用鞭子', '🎋 使用藤条', '🪵 使用木板', '🏏 使用棍棒', '🖌️ 使用毛刷', '⚡️ 虐阴调教', '🔗 紧缚控制', '⛓️ 吊缚调教', '🔒 拘束管理', '📎 使用乳夹', '⚡️ 使用电击', '🕯️ 滴蜡调教', '📍 使用针刺', '💉 穿孔设计', '🔥 烙印标记', '🎨 刺青设计', '✂️ 切割掌控', '🔥 施行火刑', '💧 施行水刑', '😮‍💨 窒息控制', '👊 施行体罚', '🧊 使用冰块'],
  '🚽 厕主': ['👅 命令舔精', '🥛 命令吞精', '💧 吐唾液', '💦 命令喝尿', '🚿 施行尿浴', '👄 命令舔阴', '💦 放尿支配', '🚰 施行灌肠', '👅 命令舔肛', '💩 命令排便', '🛁 施行粪浴', '🍽️ 命令吃粪', '🤧 命令吃痰', '🩸 命令吃经血'],
  '💭 心主': ['🗣️ 言语羞辱', '😈 人格贬低', '🧠 思维操控', '🌐 网络支配', '📢 语言管教'],
  '✨ 其他': ['👥 调教多奴', '👑 接受多主协助', '🌐 网络公开调教', '🪶 瘙痒惩罚', '📅 长期圈养', '⏱️ 短期圈养', '😴 剥夺睡眠', '🌀 施行催眠', '👭 安排同性性爱']
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff0000',
      light: '#ff5252',
      dark: '#c50000',
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
      primary: '#ff0000',
      secondary: '#ff5252',
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
      marginBottom: '2rem',
      letterSpacing: '-0.5px',
      color: '#ff0000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    subtitle1: {
      color: 'text.secondary',
      marginBottom: '2.5rem',
      fontSize: '1.1rem',
    },
    h5: {
      fontWeight: 600,
      marginBottom: '1.5rem',
      color: '#ff0000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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

function SApp() {
  const [ratings, setRatings] = useState({})
  const [openReport, setOpenReport] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedBatchRating, setSelectedBatchRating] = useState('')
  const [openHelp, setOpenHelp] = useState(false)
  const [openAbout, setOpenAbout] = useState(false)
  const [openGuide, setOpenGuide] = useState(false)
  const reportRef = useRef(null)

  // 将MENU_ITEMS移到函数组件内部，这样它可以访问组件的状态设置函数
  const MENU_ITEMS = [
    { icon: <HomeIcon />, text: '首页', href: '/index.html' },
    { icon: <ScienceIcon />, text: '评分说明', onClick: () => setOpenHelp(true) },
    { icon: <InfoIcon />, text: '关于', onClick: () => setOpenAbout(true) },
    { icon: <HelpIcon />, text: '帮助', onClick: () => setOpenGuide(true) }
  ]

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
      case 'SSS': return '#FFD700' // 金色
      case 'SS': return '#FFA500'  // 橙金色
      case 'S': return '#32CD32'   // 青翠绿
      case 'Q': return '#228B22'   // 森林绿
      case 'N': return '#4169E1'   // 皇家蓝
      case 'W': return '#1E90FF'   // 道奇蓝
      default: return '#333333'    // 灰色
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

        if (isMobile) {
          try {
            // 尝试使用Web Share API
            if (navigator.share && navigator.canShare) {
              const file = new File([blob], 'S自评报告.png', { type: 'image/png' })
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
              await navigator.saveAs(blob, 'S自评报告.png')
              setSnackbarMessage('报告已保存到相册！')
              setSnackbarOpen(true)
              return
            }

            // 回退方案：使用传统的下载方法
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'S自评报告.png'
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
          link.download = 'S自评报告.png'
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
          filename: 'S自评报告.pdf',
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
    if (!reportRef.current) {
      setSnackbarMessage('无法生成报告，请重试')
      setSnackbarOpen(true)
      return
    }

    try {
      const reportElement = reportRef.current
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0))
      const file = new File([blob], 'S自评报告.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: 'S自评报告',
          text: '查看我的S自评报告',
          files: [file]
        }

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData)
          setSnackbarMessage('分享成功！')
          setSnackbarOpen(true)
          return
        }
      }

      // 如果Web Share API不支持或分享失败，尝试保存文件
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'S自评报告.png'
      link.click()
      URL.revokeObjectURL(url)
      setSnackbarMessage('已保存为图片，请手动分享到微信')
      setSnackbarOpen(true)
    } catch (error) {
      console.error('分享错误:', error)
      setSnackbarMessage('分享失败，请尝试保存图片后手动分享')
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
        background: 'linear-gradient(135deg, #ff0000 0%, #ff5252 100%)',
        boxShadow: '0 4px 0 #000000',
        borderBottom: '4px solid #000000'
      }}>

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
              <ScienceIcon sx={{ display: 'flex' }} />
              <Typography variant="h5" sx={{
                fontWeight: 'bold',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                margin: 0,
                padding: 0,
                lineHeight: 1,
                height: '100%'
              }}>
                M-Profile Lab
              </Typography>
            </Box>
                
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: 2,
              flex: '1 1 auto',
              justifyContent: 'flex-end'
            }}>              
              <Button color="inherit" startIcon={<HomeIcon />} href="/index.html">首页</Button>
              <Button color="inherit" startIcon={<InfoIcon />} onClick={() => setOpenAbout(true)}>关于</Button>
              <Button color="inherit" startIcon={<HelpIcon />} onClick={() => setOpenGuide(true)}>使用指南</Button>
              <Button color="inherit" startIcon={<MaleIcon />} href="/male.html">男生版</Button>
              <Button color="inherit" startIcon={<FemaleIcon />} href="/female.html">女生版</Button>
            </Box>

            <IconButton
              color="inherit"
              sx={{ display: { xs: 'block', md: 'none' } }}
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
            {MENU_ITEMS.map((item, index) => (
              <ListItem 
                button 
                key={index} 
                onClick={item.onClick}
                component={item.href ? 'a' : 'div'}
                href={item.href}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button component="a" href="/male.html">
              <ListItemIcon><MaleIcon /></ListItemIcon>
              <ListItemText primary="男性版" />
            </ListItem>
            <ListItem button component="a" href="/female.html">
              <ListItemIcon><FemaleIcon /></ListItemIcon>
              <ListItemText primary="女性版" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="lg" className="pixel-theme-red" sx={{
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
          <Typography variant="h3" component="h1"  sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            How 'S' I Could Be?
          </Typography>

        </Box>

        <Paper elevation={3} className="pixel-card-red" sx={{ p: { xs: 2, md: 3 }, borderRadius: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main', textAlign: 'center' }}>
            评分等级说明
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 1, md: 2 } }}>
            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
              <Box component="span" sx={{ fontWeight: 'bold', color: getRatingColor('SSS') }}>SSS</Box> = 极度喜欢
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
              <Box component="span" sx={{ fontWeight: 'bold', color: getRatingColor('SS') }}>SS</Box> = 喜欢
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
              <Box component="span" sx={{ fontWeight: 'bold', color: getRatingColor('S') }}>S</Box> = 接受
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
              <Box component="span" sx={{ fontWeight: 'bold', color: getRatingColor('Q') }}>Q</Box> = 好奇可以尝试
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
              <Box component="span" sx={{ fontWeight: 'bold', color: getRatingColor('N') }}>N</Box> = 拒绝
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
              <Box component="span" sx={{ fontWeight: 'bold', color: getRatingColor('W') }}>W</Box> = 未知
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              const newRatings = { ...ratings }
              Object.entries(CATEGORIES).forEach(([category, items]) => {
                items.forEach(item => {
                  const randomIndex = Math.floor(Math.random() * RATING_OPTIONS.length)
                  newRatings[`${category}-${item}`] = RATING_OPTIONS[randomIndex]
                })
              })
              setRatings(newRatings)
              setSnackbarMessage('已完成随机选择！')
              setSnackbarOpen(true)
            }}
            className="pixel-button-red"
            startIcon={<AutorenewIcon />}
            sx={{ minWidth: 150 }}
          >
            随机选择
          </Button>
        </Box>
        
        {Object.entries(CATEGORIES).map(([category, items]) => (
          <Paper key={category} elevation={2} className="pixel-card-red" sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 0,
            backgroundColor: 'background.paper',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 0 rgba(255, 0, 0, 0.5)'
            }
          }}>
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
                className="pixel-select-red"
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
                      className="pixel-select-red"
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
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', width: '100%', mb: 2 }}>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setOpenReport(true)}
              className="pixel-button-red"
              sx={{ minWidth: 150 }}
            >
              生成报告
            </Button>
          </Box>
          <Paper elevation={2} className="pixel-card-red" sx={{
            p: 3,
            borderRadius: 0,
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
      </Container>
      <Footer pixelStyle={true} redStyle={true} />
      </Box>

      {/* 报告对话框 */}
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
          color: 'primary.main',
          borderBottom: '2px solid #ff0000',
          mb: 2
        }}>
          S自评详细报告
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
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h5" className="section-title" sx={{ color: 'primary.main', mb: 3 }}>
              S型人格雷达图
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              width: '100%',
              height: { xs: '300px', md: '400px' },
              mb: 2
            }}>
              <RadarChart 
                outerRadius={90} 
                width={500} 
                height={350} 
                data={getRadarData()}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 6]} />
                <Radar 
                  name="S型人格" 
                  dataKey="value" 
                  stroke="#ff0000" 
                  fill="#ff0000" 
                  fillOpacity={0.6} 
                />
                <Legend />
              </RadarChart>
            </Box>
          </Box>

          {Object.entries(CATEGORIES).map(([category, items]) => (
            <Box key={category} sx={{ mb: 4 }}>
              <Typography variant="h6" className="section-title" sx={{ 
                color: 'primary.main', 
                mb: 2,
                borderBottom: '1px solid #ff0000',
                pb: 1
              }}>
                {category} 详细评分
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                width: '100%',
                height: { xs: '300px', md: '400px' },
                mb: 2
              }}>
                <BarChart
                  width={700}
                  height={300}
                  data={getBarData(category)}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 6]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#ff0000" />
                </BarChart>
              </Box>
              <Box className="options-grid" sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                gap: 2,
                mt: 2
              }}>
                {items.map(item => (
                  <Box key={item} className="option-item" sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: 1,
                    backgroundColor: getRating(category, item) ? 
                      `${getRatingColor(getRating(category, item))}20` : 
                      'background.paper',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderLeft: getRating(category, item) ?
                      `3px solid ${getRatingColor(getRating(category, item))}` :
                      'none',
                  }}>
                    <Typography sx={{ 
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      flexGrow: 1
                    }}>
                      {item}
                    </Typography>
                    <Typography className="rating-text" sx={{ 
                      fontWeight: 'bold',
                      color: getRating(category, item) ? 
                        getRatingColor(getRating(category, item)) : 
                        'text.secondary',
                      backgroundColor: getRating(category, item) ? 
                        `${getRatingColor(getRating(category, item))}20` : 
                        'transparent',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      minWidth: 40,
                      textAlign: 'center'
                    }}>
                      {getRating(category, item) || '-'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}

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
                <Box component="span" sx={{ fontWeight: 'bold', color: getRatingColor('SSS') }}>SSS</Box> = 极度喜欢
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: getRatingColor('SS') }}>SS</Box> = 非常喜欢
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: getRatingColor('S') }}>S</Box> = 喜欢
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: getRatingColor('Q') }}>Q</Box> = 好奇
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: getRatingColor('N') }}>N</Box> = 不喜欢
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: getRatingColor('W') }}>W</Box> = 抵触
              </Typography>
            </Box>
          </Paper>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              此报告仅供参考，不构成任何专业建议。
            </Typography>
            <Box component="img" src="/qrcode.png" alt="QR Code" sx={{
              width: '150px',
              height: '150px',
              display: 'block',
              margin: '0 auto'
            }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              扫码获取更多S型人格分析
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'center',
          p: 3,
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Button 
            onClick={handleExportImage} 
            variant="contained" 
            color="primary"
            className="pixel-button-red"
          >
            保存为图片
          </Button>
          <Button 
            onClick={handleExportPDF} 
            variant="outlined" 
            color="primary"
            className="pixel-button-red"
          >
            保存为PDF
          </Button>
          <Button 
            onClick={handleShareToWeChat} 
            variant="outlined" 
            color="primary"
            className="pixel-button-red"
          >
            分享
          </Button>
          <IconButton 
            onClick={() => setOpenReport(false)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* 提示消息 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* 帮助对话框 */}
      <Dialog open={openHelp} onClose={() => setOpenHelp(false)} maxWidth="sm" fullWidth>
        <DialogTitle>评分说明</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            本测试旨在帮助您了解自己的S型人格特质。请根据您对各项活动的接受程度进行评分：
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>评分</TableCell>
                  <TableCell>含义</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ bgcolor: getRatingColor('SSS'), color: '#fff', fontWeight: 'bold' }}>SSS</TableCell>
                  <TableCell>极度喜欢，主动寻求</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: getRatingColor('SS'), color: '#fff', fontWeight: 'bold' }}>SS</TableCell>
                  <TableCell>非常喜欢，乐于尝试</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: getRatingColor('S'), color: '#fff', fontWeight: 'bold' }}>S</TableCell>
                  <TableCell>喜欢，愿意尝试</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: getRatingColor('Q'), color: '#000', fontWeight: 'bold' }}>Q</TableCell>
                  <TableCell>好奇，可以接受</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: getRatingColor('N'), color: '#000', fontWeight: 'bold' }}>N</TableCell>
                  <TableCell>不喜欢，但可以接受</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: getRatingColor('W'), color: '#000', fontWeight: 'bold' }}>W</TableCell>
                  <TableCell>抵触，坚决拒绝</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHelp(false)} color="primary">关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 关于对话框 */}
      <Dialog open={openAbout} onClose={() => setOpenAbout(false)} maxWidth="sm" fullWidth>
        <DialogTitle>关于</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            M-Profile Lab是一个专注于人格特质研究的实验室，我们致力于帮助人们更好地了解自己的性格特点和偏好。
          </Typography>
          <Typography variant="body1" paragraph>
            本测试工具仅供娱乐和自我探索使用，不构成任何专业的心理评估或医学建议。
          </Typography>
          <Typography variant="body1" paragraph>
            版本：1.0.0
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAbout(false)} color="primary">关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 使用指南对话框 */}
      <Dialog open={openGuide} onClose={() => setOpenGuide(false)} maxWidth="sm" fullWidth>
        <DialogTitle>使用指南</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            1. 浏览各个类别下的选项，根据您的真实感受为每个选项选择一个评分。
          </Typography>
          <Typography variant="body1" paragraph>
            2. 您可以使用每个类别旁边的"一键选择"功能，快速为整个类别设置相同的评分。
          </Typography>
          <Typography variant="body1" paragraph>
            3. 完成评分后，点击"生成报告"按钮查看您的S型人格分析报告。
          </Typography>
          <Typography variant="body1" paragraph>
            4. 在报告页面，您可以将报告保存为图片或PDF格式，也可以直接分享给朋友。
          </Typography>
          <Typography variant="body1" paragraph>
            5. 所有数据仅保存在您的浏览器中，刷新页面后数据将被清除。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGuide(false)} color="primary">关闭</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default SApp;
/* eslint-disable */
/** 站点罗盘数据（本地数据源，书签精简版）。用途见 src/pages/compass.astro。 */
export interface CompassEntry { label: string; href: string; note?: string; icon?: string; image?: string; }
export interface CompassShelf { key: string; name: string; icon?: string; blurb?: string; entries: CompassEntry[]; }
export const compassData: CompassShelf[] = [
  {
    "key": "tools",
    "name": "工具",
    "icon": "material-symbols:construction-rounded",
    "blurb": "效率工具与常用导航",
    "entries": [
      {
        "label": "果汁导航 - 上网从这里开始！",
        "href": "http://guozhivip.com/",
        "note": "常用网址导航聚合站"
      },
      {
        "label": "技术导航 - 学习技术 从这里开始",
        "href": "https://www.daohangtx.com/",
        "note": "daohangtx.com"
      },
      {
        "label": "TinyPNG – Compress PNG images while preserving transparency",
        "href": "https://tinypng.com/",
        "note": "在线 PNG/JPEG 无损压缩"
      },
      {
        "label": "图标库 – Font Awesome 中文网",
        "href": "http://www.fontawesome.com.cn/faicons/",
        "note": "fontawesome.com.cn"
      },
      {
        "label": "方正字库官网——中国人 方正字",
        "href": "https://www.foundertype.com/",
        "note": "foundertype.com"
      },
      {
        "label": "免费在线音频提取，快速提取视频中的音频",
        "href": "https://www.apowersoft.cn/extract-audio-online",
        "note": "apowersoft.cn"
      },
      {
        "label": "美国地址生成，美国人虚构信息生成-世界各国虚拟身份信息、地址、信用卡生成",
        "href": "http://www.haoweichi.com/",
        "note": "haoweichi.com"
      },
      {
        "label": "Steam++ - 主页",
        "href": "https://steampp.net/",
        "note": "Steam 社区加速与增强工具箱"
      },
      {
        "label": "Photopea",
        "href": "https://www.photopea.com",
        "note": "在线版 Photoshop，免安装修图"
      },
      {
        "label": "regex101",
        "href": "https://regex101.com",
        "note": "正则表达式在线测试与调试"
      },
      {
        "label": "DeepL",
        "href": "https://www.deepl.com",
        "note": "高质量机器翻译"
      },
      {
        "label": "caniuse",
        "href": "https://caniuse.com",
        "note": "浏览器兼容性查询"
      }
    ]
  },
  {
    "key": "study",
    "name": "学习",
    "icon": "material-symbols:school-rounded",
    "blurb": "教程、技术社区与 Linux",
    "entries": [
      {
        "label": "菜鸟教程 - 学的不仅是技术，更是梦想！",
        "href": "https://www.runoob.com/",
        "note": "runoob.com"
      },
      {
        "label": "博客园 - 开发者的网上家园",
        "href": "https://www.cnblogs.com/",
        "note": "cnblogs.com"
      },
      {
        "label": "书栈网 · BookStack_程序员IT互联网开源编程书籍免费阅读与下载，取之于猿用之于猿！",
        "href": "https://www.bookstack.cn/",
        "note": "bookstack.cn"
      },
      {
        "label": "Vue.js",
        "href": "https://cn.vuejs.org/",
        "note": "渐进式 JavaScript 框架官网"
      },
      {
        "label": "MyBatis-Plus",
        "href": "https://baomidou.com/",
        "note": "MyBatis 增强插件（CRUD 封装）"
      },
      {
        "label": "Markdown基本语法 - 简书",
        "href": "https://www.jianshu.com/p/191d1e21f7ed/",
        "note": "jianshu.com"
      },
      {
        "label": "Layui 开发使用文档 - 入门指南",
        "href": "https://layui.dev/",
        "note": "经典前端 UI 框架文档"
      },
      {
        "label": "Bootstrap v3 中文文档 · Bootstrap 是最受欢迎的 HTML、CSS 和 JavaScript 框架，用于开发响应式布局、移动设备优先的 WEB 项目。 | Bootstrap 中文网",
        "href": "https://v3.bootcss.com/",
        "note": "响应式前端框架中文文档"
      },
      {
        "label": "View Design",
        "href": "http://iviewui.com/",
        "note": "iView 企业级 UI 组件库"
      },
      {
        "label": "Mock.js",
        "href": "http://mockjs.com/",
        "note": "前端模拟数据生成工具"
      },
      {
        "label": "Download images - Home | Image Cyborg",
        "href": "https://imagecyborg.com/",
        "note": "批量下载网页图片"
      },
      {
        "label": "Apache ECharts",
        "href": "https://echarts.apache.org/zh/index.html",
        "note": "数据可视化图表库官网"
      },
      {
        "label": "Road 2 Coding",
        "href": "https://www.r2coding.com/#/",
        "note": "r2coding.com"
      },
      {
        "label": "Docker and Kubernetes Management | Portainer",
        "href": "https://www.portainer.io/",
        "note": "portainer.io"
      },
      {
        "label": "Home - Docker",
        "href": "https://www.docker.com/",
        "note": "docker.com"
      },
      {
        "label": "MDN Web Docs",
        "href": "https://developer.mozilla.org",
        "note": "Web 开发权威文档库"
      },
      {
        "label": "DevDocs",
        "href": "https://devdocs.io",
        "note": "开发者文档聚合快速查阅"
      },
      {
        "label": "LeetCode",
        "href": "https://leetcode.cn",
        "note": "算法刷题平台"
      },
      {
        "label": "TypeScript",
        "href": "https://www.typescriptlang.org",
        "note": "TypeScript 官方文档"
      }
    ]
  },
  {
    "key": "fun",
    "name": "娱乐",
    "icon": "material-symbols:stadia-controller-rounded",
    "blurb": "动漫影音与游戏社区",
    "entries": [
      {
        "label": "枫の主题社 ★ 二次元技术研究社区~",
        "href": "https://winmoes.com/",
        "note": "Windows 二次元主题美化站"
      },
      {
        "label": "致美化 - 最专业的桌面美化交流平台 - 漫锋网",
        "href": "https://zhutix.com//",
        "note": "桌面美化资源交流平台"
      },
      {
        "label": "AGE动漫 - 在线动漫观看",
        "href": "https://www.agedm.io/?ref=github",
        "note": "agedm.io"
      },
      {
        "label": "动漫无损音乐下载资讯站_ACG漫音社_专注分享二次元高品质音乐~",
        "href": "http://www.acgjc.com/",
        "note": "acgjc.com"
      },
      {
        "label": "动漫~4k修复~晕宝儿制作",
        "href": "https://www.kdocs.cn/l/ccz8LByVU8Kr",
        "note": "kdocs.cn"
      },
      {
        "label": "铥铥资源库",
        "href": "https://www.kdocs.cn/l/ccCsNOPLtmDa?R=L1MvNQ==",
        "note": "kdocs.cn"
      },
      {
        "label": "戰甲神兵",
        "href": "https://warframe.huijiwiki.com/wiki/Mainpage",
        "note": "Warframe 中文维基"
      },
      {
        "label": "Warframe Market | 最近的订单",
        "href": "https://warframe.market/zh-hans/",
        "note": "Warframe 交易市场"
      },
      {
        "label": "MC百科|最大的Minecraft中文MOD百科",
        "href": "https://www.mcmod.cn/",
        "note": "mcmod.cn"
      },
      {
        "label": "旅法师营地-有温度的玩家社区-旅法师营地",
        "href": "https://www.iyingdi.com/",
        "note": "iyingdi.com"
      },
      {
        "label": "土豆MC - Minecraft(我的世界)中文论坛",
        "href": "https://www.tudoumc.com/",
        "note": "tudoumc.com"
      },
      {
        "label": "游戏猪 | Link3",
        "href": "https://link3.cc/youxizhu",
        "note": "游戏链接聚合页"
      },
      {
        "label": "芙芙启动器",
        "href": "https://philia093.xyz/",
        "note": "个人项目启动器站点"
      },
      {
        "label": "AniList",
        "href": "https://anilist.co",
        "note": "国际追番/漫画收藏管理"
      }
    ]
  },
  {
    "key": "ai",
    "name": "AI",
    "icon": "material-symbols:smart-toy-rounded",
    "blurb": "人工智能工具与社区",
    "entries": [
      {
        "label": "opencode",
        "href": "https://opencode.ai",
        "note": "开源的终端 AI 编码助手"
      },
      {
        "label": "Hermes Agent 中文社区桌面版 — 装上就能用的 AI Agent 桌面端",
        "href": "https://desktop.hermesagent.org.cn/",
        "note": "AI Agent 桌面客户端"
      },
      {
        "label": "DeepSeek | 深度求索",
        "href": "https://www.deepseek.com/",
        "note": "deepseek.com"
      },
      {
        "label": "Ollama",
        "href": "https://ollama.com",
        "note": "本地运行大模型"
      },
      {
        "label": "LM Studio",
        "href": "https://lmstudio.ai",
        "note": "本地模型图形化管理"
      }
    ]
  },
  {
    "key": "resources",
    "name": "资源",
    "icon": "material-symbols:photo-library-outline-rounded",
    "blurb": "免费图库与图标资源",
    "entries": [
      {
        "label": "Unsplash",
        "href": "https://unsplash.com",
        "note": "免费高清图片库"
      },
      {
        "label": "Iconify",
        "href": "https://iconify.design",
        "note": "跨图标集图标搜索"
      }
    ]
  },
  {
    "key": "design",
    "name": "设计",
    "icon": "material-symbols:palette-outline-rounded",
    "blurb": "界面设计、灵感与素材",
    "entries": [
      {
        "label": "Figma",
        "href": "https://www.figma.com",
        "note": "界面设计与协作"
      },
      {
        "label": "Dribbble",
        "href": "https://dribbble.com",
        "note": "设计师灵感社区"
      },
      {
        "label": "Coolors",
        "href": "https://coolors.co",
        "note": "快速配色方案生成"
      },
      {
        "label": "Excalidraw",
        "href": "https://excalidraw.com",
        "note": "手绘风白板绘图"
      }
    ]
  },
  {
    "key": "community",
    "name": "社区",
    "icon": "material-symbols:forum-outline-rounded",
    "blurb": "开发者问答与内容社区",
    "entries": [
      {
        "label": "Stack Overflow",
        "href": "https://stackoverflow.com",
        "note": "全球开发者问答"
      },
      {
        "label": "思否 SegmentFault",
        "href": "https://segmentfault.com",
        "note": "中文技术问答社区"
      },
      {
        "label": "掘金",
        "href": "https://juejin.cn",
        "note": "技术文章与沸点"
      }
    ]
  },
  {
    "key": "media",
    "name": "影音",
    "icon": "material-symbols:movie-outline-rounded",
    "blurb": "视频与音乐平台",
    "entries": [
      {
        "label": "哔哩哔哩",
        "href": "https://www.bilibili.com",
        "note": "视频弹幕社区（ACG 主场）"
      },
      {
        "label": "网易云音乐",
        "href": "https://music.163.com",
        "note": "在线音乐平台"
      }
    ]
  }
];

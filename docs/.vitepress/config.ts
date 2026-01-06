import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Claude Code Notes",
  description: "Claude Code 學習筆記與技術文件",

  // GitHub Pages 部署設定
  base: '/claude-code-notes/',

  // 語言設定
  lang: 'zh-TW',

  // 主題配置
  themeConfig: {
    // 導航欄
    nav: [
      { text: '首頁', link: '/' },
      { text: 'Claude Code', link: '/claude-code/' },
      { text: '關於', link: '/about' }
    ],

    // 側邊欄
    sidebar: {
      '/claude-code/': [
        {
          text: 'Claude Code',
          collapsed: false,  // 預設展開
          items: [
            { text: '總覽', link: '/claude-code/' },
            { text: 'CLAUDE.md', link: '/claude-code/claude-md' },
            { text: 'Slash Command', link: '/claude-code/slash-command' },
            { text: 'Skill', link: '/claude-code/skill' },
            {
              text: '進階主題',
              collapsed: true,  // 預設收合
              items: [
                { text: '三者比較', link: '/claude-code/advanced/comparison' },
                { text: '最佳實踐', link: '/claude-code/advanced/best-practices' },
              ]
            }
          ]
        }
      ]
    },

    // 社交連結
    socialLinks: [
      { icon: 'github', link: 'https://github.com/DeanDream/claude-code-notes' }
    ],

    // 頁尾
    footer: {
      message: '以 VitePress 建置',
      copyright: 'Copyright © 2026'
    },

    // 搜尋
    search: {
      provider: 'local'
    },

    // 編輯連結
    editLink: {
      pattern: 'https://github.com/DeanDream/claude-code-notes/edit/main/docs/:path',
      text: '在 GitHub 上編輯此頁面'
    },

    // 最後更新時間
    lastUpdated: {
      text: '最後更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  }
})

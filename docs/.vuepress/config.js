const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'sealos | kubernetes安装',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: "一键离线安装高可用kubernetes集群，不依赖ansible haproxy keepalived，内核ipvs负载",

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['script', {}, `
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?2803648cc5852dd3e9e46bbd0bf63366";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
  `]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    logo: 'https://sealyun.com/img/logo.png',
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      { text: '使用文档', link: '/docs/', target:'_self', rel:'' },
      { text: '博客', link: 'https://blog.sealyun.com' },
      { text: '离线包下载', link: 'http://store.lameleg.com', rel:'' },
      { text: '常见问题', link: '/faq/', target:'_self', rel:'' },
      { text: '版本变更', link: '/changelog/', target:'_self', rel:'' },
      { text: '开源项目', link: '/github/', target:'_self' },
      { text: '联系方式', link: '/contact/', target:'_self' },
      { text: '论坛', link: 'http://store.lameleg.com:8536/'},
      {
        text: '友情连接',
        items: [
          { text: '', items: [{link: 'https://fuckcloudnative.io/#sealyun', text: "云原生实验室"}] },
          { text: '', items: [{link: 'https://kuboard.cn/#sealyun', text: "kuboard"}] },
          { text: '', items: [{link: 'https://www.qikqiak.com/?utm_source=sealyun.com', text: "阳明的博客"}] },
          { text: '', items: [{link: 'https://zhangguanzhang.github.io/#sealyun', text: "张馆长的博客"}] },
        ]
      },
    ],
    sidebar: {
      '/docs/': [
        {
          collapsable: false,
          children: [
            '' ,
            'tutorial',
            'app',
            'design',
            'theory',
          ]
        }
      ],
      '/docs/': [
        {
          collapsable: false,
          children: [
            '' ,
            'tutorial',
            'app',
            'design',
            'theory',
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    ['seo',{siteTitle: (_,$site) => "sealyun 专注于kubernetes安装", title: $page => "sealyun kubernetes安装"}]
  ]
}

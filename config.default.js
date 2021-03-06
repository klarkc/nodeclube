/**
 * config
 */

var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: process.env.NODE_ENV==='production'?false:true,

  get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader

    name: 'Guild Wars 2 Brasil', // 社区名字
    description: 'Fórum Guild Wars 2 Brasil', // 社区的描述
    keywords: 'guild wars 2, brasil, brazil, forum',

    // 添加到 html head 中的信息
    site_headers: [
    '<meta name="author" content="admin@guildwars2brasil.com.br" />'
  ],
    site_logo: '/public/images/logo.png', // default is `name`

    // Generator for favicons: http://www.favicon-generator.org
    site_icons: {
      apple: [
        {sizes: "57x57", href: "/public/images/apple-icon-57x57.png"},
        {sizes: "60x60", href: "/public/images/apple-icon-60x60.png"},
        {sizes: "72x72", href: "/public/images/apple-icon-72x72.png"},
        {sizes: "114x114", href: "/public/images/apple-icon-114x114.png"},
        {sizes: "120x120", href: "/public/images/apple-icon-120x120.png"},
        {sizes: "144x144", href: "/public/images/apple-icon-144x144.png"},
        {sizes: "152x152", href: "/public/images/apple-icon-152x152.png"},
        {sizes: "180x180", href: "/public/images/apple-icon-180x180.png"}
      ],
      android: [
        {sizes: "192x192", href: "/public/images/android-icon-192x192.png"}
      ],
      favicon: [
        {sizes: "32x32", href: "/public/images/favicon-32x32.png"},
        {sizes: "96x96", href: "/public/images/favicon-96x96.png"},
        {sizes: "16x16", href: "/public/images/favicon-16x16.png"}
      ],
      ms: {href: "/public/images/ms-icon-144x144.png"}
    },

    site_color: '#170600',
    site_manifest: '/public/manifest.json',

    // 右上角的导航区
    site_navs: [
    // 格式 [ path, title, [target=''] ]
    ['/about', 'Quem Somos']
  ],
  // cdn host，如 http://cnodejs.qiniudn.com
  site_static_host: '', // 静态文件存储域名
  // 社区的域名
  host: 'localhost',
  // 默认的Google tracker ID，自有站点请修改，申请地址：http://www.google.com/analytics/
  google_tracker_id: '',
  // 默认的cnzz tracker ID，自有站点请修改
  cnzz_tracker_id: '',

  // mongodb 配置
  db: 'mongodb://127.0.0.1/node_club_dev',

  // redis 配置，默认是本地
  redis_host: '127.0.0.1',
  redis_port: 6379,
  redis_db: 0,
  redis_pass: '',

  session_secret: 'gw2brreborn', // 务必修改
  auth_cookie_name: 'gw2brreborn',

  port: process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',

  // 话题列表显示的话题数量
  list_topic_count: 20,

  // RSS配置
  rss: {
        title: 'Guild Wars 2 Brasil',
        link: 'http://www.guildwars2brasil.com.br',
        language: 'pt-br',
        description: 'Fórum da Comunidade Brasileira de Guild Wars 2',
        //最多获取的RSS Item数量
        max_rss_items: 50
  },

  // 邮箱配置
  mail_opts: {
    host: 'smtp.126.com',
    port: 25,
    auth: {
      user: 'postmaster@mg.guildwars2brasil.com.br',
      pass: 'club'
    }
  },

  //weibo app key
  weibo_key: 10000000,
  weibo_id: 'your_weibo_id',

  // admin 可删除话题，编辑标签。把 user_login_name 换成你的登录名
  admins: { user_login_name: true },

  // github 登陆的配置
  GITHUB_OAUTH: {
    clientID: 'your GITHUB_CLIENT_ID',
    clientSecret: 'your GITHUB_CLIENT_SECRET',
    callbackURL: 'http://cnodejs.org/auth/github/callback'
  },
  // 是否允许直接注册（否则只能走 github 的方式）
  allow_sign_up: true,

  // oneapm 是个用来监控网站性能的服务
  oneapm_key: '',

  // 下面两个配置都是文件上传的配置

  // 7牛的access信息，用于文件上传
  qn_access: {
    accessKey: 'your access key',
    secretKey: 'your secret key',
    bucket: 'your bucket name',
    origin: 'http://your qiniu domain',
    // 如果vps在国外，请使用 http://up.qiniug.com/ ，这是七牛的国际节点
    // 如果在国内，此项请留空
    uploadURL: 'http://xxxxxxxx',
  },

  // 文件上传配置
  // 注：如果填写 qn_access，则会上传到 7牛，以下配置无效
  upload: {
    path: process.env.OPENSHIFT_DATA_DIR || path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },

  file_limit: '1MB',

  // 版块
  tabs: [
    ['geral', 'geral'],
    ['duvidas', 'dúvidas'],
    ['guildas', 'guildas'],
    ['pvp', 'pvp'],
    ['pve', 'pve'],
    ['off-topic', 'off-topic']
  ],

  // 极光推送
  jpush: {
    appKey: 'YourAccessKeyyyyyyyyyyyy',
    masterSecret: 'YourSecretKeyyyyyyyyyyyyy',
    isDebug: false,
  },

  create_post_per_day: 1000, // 每个用户一天可以发的主题数
  create_reply_per_day: 1000, // 每个用户一天可以发的评论数
  visit_per_day: 1000, // 每个 ip 每天能访问的次数
};

if (process.env.NODE_ENV === 'test') {
  config.db = 'mongodb://127.0.0.1/node_club_test';
}

module.exports = config;

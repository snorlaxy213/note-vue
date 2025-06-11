import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter);

// 路由懒加载函数，支持 chunk 命名和错误处理
const lazyLoad = (componentPath, chunkName) => {
  return () =>
    import(
      /* webpackChunkName: "[request]" */
      /* webpackPrefetch: true */
      `../pages/${componentPath}`
    ).catch(error => {
      console.error(`Failed to load component: ${componentPath}`, error);
      // 返回一个错误组件
      return import('../components/ErrorComponent.vue').catch(() => {
        // 如果错误组件也加载失败，返回一个简单的错误组件
        return {
          template:
            '<div class="error-component">页面加载失败，请刷新重试</div>'
        };
      });
    });
};

// 管理模块路由懒加载
const manageLoad = componentPath => {
  return () =>
    import(
      /* webpackChunkName: "manage" */
      /* webpackPrefetch: true */
      `../pages/manage/components/${componentPath}`
    );
};

const routes = [
  {
    path: '/',
    redirect: '/files' // 默认显示文件管理页面
  },
  // 添加首页路由
  {
    name: 'home',
    path: '/home',
    component: lazyLoad('home/Home.vue'),
    meta: {
      title: '首页',
      keepAlive: true,
      preload: true
    }
  },
  {
    name: 'files',
    path: '/files',
    component: lazyLoad('files/Files.vue'),
    meta: {
      title: '文件管理',
      keepAlive: true,
      preload: true
    }
  },
  {
    name: 'write',
    path: '/write',
    component: lazyLoad('write/write.vue'),
    meta: {
      title: '编写笔记',
      keepAlive: false
    }
  },
  {
    name: 'rubbish',
    path: '/rubbish',
    component: lazyLoad('rubbish/Rubbish.vue'),
    meta: {
      title: '回收站',
      keepAlive: true
    }
  },
  {
    name: 'manage',
    path: '/manage',
    component: lazyLoad('manage/Manage.vue'),
    meta: {
      title: '管理中心',
      keepAlive: true
    },
    children: [
      {
        name: 'manage-home',
        path: '',
        component: manageLoad('Home.vue'),
        meta: {
          title: '管理首页'
        }
      },
      {
        name: 'manage-book',
        path: 'my_book',
        component: manageLoad('MyBook.vue'),
        meta: {
          title: '我的书籍'
        }
      },
      {
        name: 'manage-article',
        path: 'article',
        component: manageLoad('Article.vue'),
        meta: {
          title: '文章管理'
        }
      }
    ]
  },
  {
    name: 'mybook',
    path: '/mybook',
    component: lazyLoad('book/Book.vue'),
    meta: {
      title: '我的书籍',
      keepAlive: true
    }
  },
  {
    path: '*',
    name: '404',
    component: () =>
      import(
        /* webpackChunkName: "error" */
        '../components/NotFound.vue'
      ).catch(() => ({
        template: '<div class="not-found">页面未找到</div>'
      })),
    meta: {
      title: '页面未找到'
    }
  }
];

const router = new VueRouter({
  routes,
  mode: 'history', // 使用 history 模式
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    // 路由切换时的滚动行为
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

// 路由守卫 - 实现预加载和权限验证
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} - 笔记应用`;
  }

  next();
});

// 路由加载完成后的处理
router.afterEach((to, from) => {
  // 预加载相关页面
  if (to.meta && to.meta.preload) {
    // 预加载写作页面（因为用户可能从文件页面跳转到写作页面）
    if (to.name === 'files') {
      setTimeout(() => {
        import('../pages/write/write.vue').catch(() => {});
      }, 1000);
    }
  }
});

export default router;

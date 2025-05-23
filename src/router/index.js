import VueRouter from "vue-router";
import Vue from 'vue'

Vue.use(VueRouter);

const routes = [
        {
                path: '',
                redirect: '/files'
        },
        {
                name: "files",
                path: "/files",
                component: () => import("../pages/files/files.vue")
        },
        {
                name: "write",
                path: "/write",
                component: () => import("../pages/write/write.vue")
        },

        {
                name: "rubbish",
                path: "/rubbish",
                component: () => import("../pages/rubbish/rubbish.vue")
        },
        {
                name: "manage",
                path: "/manage",
                component: () => import("../pages/manage/manage.vue"),
                children: [
                        {
                                name: 'manage',
                                path: '',
                                component: () => import("../pages/manage/components/home.vue")
                        },
                        {
                                name: 'manage',
                                path: 'my_book',
                                component: () => import("../pages/manage/components/mybook.vue")
                        },
                        {
                                name: "manage",
                                path: 'article',
                                component: () => import("../pages/manage/components/article.vue")
                        },
                ]
        },
        {
                name: "mybook",
                path: "/mybook",
                component: () => import("../pages/book/book.vue")
        }



];

const router = new VueRouter({
        routes,

});


export default router;
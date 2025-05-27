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
        component: () => import("../pages/files/Files.vue")
    },
    {
        name: "write",
        path: "/write",
        component: () => import("../pages/write/write.vue")
    },

    {
        name: "rubbish",
        path: "/rubbish",
        component: () => import("../pages/rubbish/Rubbish.vue")
    },
    {
        name: "manage",
        path: "/manage",
        component: () => import("../pages/manage/Manage.vue"),
        children: [
            {
                name: 'manage',
                path: '',
                component: () => import("../pages/manage/components/Home.vue")
            },
            {
                name: 'manage',
                path: 'my_book',
                component: () => import("../pages/manage/components/MyBook.vue")
            },
            {
                name: "manage",
                path: 'article',
                component: () => import("../pages/manage/components/Article.vue")
            },
        ]
    },
    {
        name: "mybook",
        path: "/mybook",
        component: () => import("../pages/book/Book.vue")
    }


];

const router = new VueRouter({
    routes,

});


export default router;
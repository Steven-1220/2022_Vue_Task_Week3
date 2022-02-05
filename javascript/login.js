import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";


// url 也可放在外面
// const url = 'https://vue3-course-api.hexschool.io/v2';

const app = createApp({

    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io/v2',
            user: {
                "username": "",
                "password": ""
            }
        }
    },

    methods: {
        login() {
            axios.post(`${this.url}/admin/signin`, this.user)
                .then(res => {
                    // console.log(res.data);
                    const { token, expired } = res.data
                    // console.log(token, expired);
                    document.cookie = `myToken=${token}; expires=${new Date(expired)};`;
                    // 轉址到 products.html
                    window.location.href = 'products.html'
                })
                .catch(error => {
                    console.log(error.data);
                    alert(error.data.message)
                })
        }
    },

}).mount('#app');
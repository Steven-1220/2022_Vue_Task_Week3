import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

let productModal = {};
let delProductModal = {};


const app = createApp({

    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'steven1220',
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: []
            },
        }
    },
    methods: {
        checkLogin() {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            // 當每次發出請求時，都會在 headers 自動帶入 token
            axios.defaults.headers.common['Authorization'] = token;

            axios.post(`${this.url}/api/user/check`)
                .then(res => {
                    // console.log(res.data);
                    this.getAllProducts();
                })
                .catch(err => {
                    alert(err.data.message);
                    window.location.href = 'index.html';
                })

        },
        getAllProducts() {
            axios.get(`${this.url}/api/${this.apiPath}/admin/products/all`)
                .then(res => {
                    // console.log(res.data);
                    this.products = res.data.products;
                })
                .catch(err => {
                    console.log(err.data);
                })
        },
        changeActiveState(item) {
            item.is_enabled = !item.is_enabled;
        },

        // 開啟模組
        openModal(state, item) {
            // console.log(state, item);
            if (state == 'new') {
                // 若是要新增一個新的 modal，需要做清空物件的動作
                this.tempProduct = {
                    imagesUrl: []
                }
                productModal.show();
                this.isNew = true;
            } else if (state == 'edit') {
                this.tempProduct = { ...item };
                productModal.show();
                this.isNew = false;
            } else if (state == 'delete') {
                this.tempProduct = { ...item };
                delProductModal.show();
            }

        },
        //新增產品或修改產品
        updateProduct() {
            // 新增
            let productUrl = `${this.url}/api/${this.apiPath}/admin/product`;
            let methods = 'post';

            //根據 isNew 來判斷要串接 post 或是 put API，當 isNew 是  false 才進入編輯
            if (!this.isNew) {
                productUrl = `${this.url}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                methods = 'put'
            }
            axios[methods](productUrl, { data: this.tempProduct })
                .then(res => {
                    // console.log(res.data);
                    this.getAllProducts();
                    productModal.hide();
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        //刪除產品
        deleteProduct() {
            axios.delete(`${this.url}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`)
                .then(res => {
                    this.getAllProducts();
                    delProductModal.hide();
                })
                .catch(err => {
                    console.log(err.data);
                })
        },
        //新增圖片
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
        //上傳圖片
        upload(index) {
            let fileInput = document.querySelectorAll('input[type=file]');
            // console.dir(fileInput);
            const file = fileInput[index].files[0]
            // console.log(file);
            const formData = new FormData();
            formData.append('file-to-upload', file);

            axios.post(`${this.url}/api/${this.apiPath}/admin/upload`, formData)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err.response);
                })
        }
    },
    //生命週期
    mounted() {
        this.checkLogin();
        // 使用 new 建立 bootstrap Modal，拿到實體 DOM 並賦予到變數上
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false,
            backdrop: 'static'
        })

        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false,
            backdrop: 'static'
        })

    },

}).mount('#app');
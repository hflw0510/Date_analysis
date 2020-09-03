import Vue from 'vue'
import VueBus from 'vue-bus';
import Element from 'element-ui'
import VueI18n from 'vue-i18n'
import langs from '~/assets/langs'

Vue.use(VueI18n)
Vue.use(VueBus);

export default ({ app }) => {
    let i18n = new VueI18n({
        locale: 'zhCN',
        messages: langs
    });

    app.i18n = i18n;

    Vue.use(Element, {
        i18n: (key, value) => i18n.t(key, value)
    });
}
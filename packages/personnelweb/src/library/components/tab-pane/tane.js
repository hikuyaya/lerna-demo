import {Tabs, TabPane, Button} from 'element-ui'
import store from '@src/store'
import de from "element-ui/src/locale/lang/de";
const ExtendDialogProps = {
    pid: {
        type: String,
        default() {
            return ''
        }
    },

    ptype: {
        type: String,
        default() {
            return '1'
        }
    }
}

export default {
    name: 'el-tabs',

    props: {
        ...Tabs.props,

        ...ExtendDialogProps
    },
    mounted() {


    },
    methods: {
        ...Tabs.methods
    },
    render(h) {



        let slots = [];
        this.$slots.default.forEach(item=> {
            let pid = item.data.attrs.pid;
            if(pid) {
                let permission = store.getters['user/permissions'];
                if(!permission.includes(pid)) {

                } else {
                    slots.push(item);
                }
            } else {
                slots.push(item);
            }
        })
        console.log('slots', slots)
        // if(this.pid) {
        //     let permission = store.getters['user/permissions'];
        //     if(!permission.includes(this.pid)) {
        //         Node = null;
        //     } else {
        //         if(this.ptype == '1') {
        //             this.disabled = true;
        //         } else {
        //             Node = null;
        //         }
        //     }
        // }
        return h(
            Tabs,
            {
                // 扩展 props
                props: this.$props,

                // 扩展 attrs
                attrs: this.$attrs,

                // 扩展 listeners
                on: this.$listeners,

                // 扩展 slots
                // scopedSlots: this.$scopedSlots,
             // scopedSlots: this.$scopedSlots,


            },
            slots
        )
    }
}

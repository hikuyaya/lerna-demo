<template>
    <div>
        <el-tree
                :data="treeData"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                highlight-current>
        </el-tree>
    </div>
</template>

<script>

    import service from '@src/service'

    export default {
        name: "treeCard",
        props: ['defaultCheckedKeys', 'type', 'prtcode'],
        data: function () {
            return {
                treeData: [],
                cardList: [],
            }
        },
        watch: {
            defaultCheckedKeys() {
                this.set()
            },
        },
        mounted() {
            service.payType.cardList().then(res => {
                this.cardList = res.data
                this.cardList.map(e => {
                    if ((e.cardType == '1' && this.prtcode == '003') || (e.cardType == '2' && this.prtcode == '004')) {
                        e.label = e.cpname
                        this.treeData.push(e)
                    }
                })
                this.set()
            })
        },
        methods: {
            set() {
                if (this.type == '8' || this.type == '10') {
                    this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys, true)
                } else {
                    this.$refs.tree.setCheckedKeys([], true)
                }
            },
            get() {
                return this.$refs.tree.getCheckedNodes()
            }
        }
    }

</script>
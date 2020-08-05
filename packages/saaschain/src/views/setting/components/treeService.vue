<template>
    <div>
        <el-tree
                :data="treeData"
                show-checkbox
                default-expand-all
                node-key="treekey"
                ref="tree"
                highlight-current>
        </el-tree>
    </div>
</template>

<script>

    import service from '@src/service'

    export default {
        name: "treeService",
        props: ['defaultCheckedKeys', 'type'],
        data: function () {
            return {
                treeData: [],
                serviceList: [],
                typeList: [],
            }
        },
        watch: {
            defaultCheckedKeys() {
                this.set()
            },
        },
        mounted() {
            service.fwbackConfig.getServiceType().then(res => {
                this.typeList = res.data
                return this.typeList
            }).then(types => {
                service.fwbackConfig.getServiceInfoByTypeId().then(res1 => {
                    let services = res1.data
                    this.serviceList = res1.data
                    types.map(c => {
                        c.children = []
                        c.label = c.sname
                        c.treekey = "servt"+c.id
                        services.map(p => {
                            p.label = p.servname
                            p.treekey = p.id
                            if (c.id == p.servtid)
                                c.children.push(p)
                        })
                    })
                    this.treeData = types.filter(types=>types.children.length>0);
                    this.set()
                })
            })
        },
        methods: {
            set() {
                if (this.type == '2') {
                    this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys)
                } else {
                    this.$refs.tree.setCheckedKeys([])
                }
            },
            get() {
                return this.$refs.tree.getCheckedNodes(true)
            }
        }
    }

</script>
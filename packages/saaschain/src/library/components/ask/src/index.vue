<template>
    <div class="yid-ask">
        <el-tooltip :content="content" placement="top">
            <span class="icon"></span>
        </el-tooltip>
    </div>
</template>

<script>
    export default {
        name: "yid-ask",
        data() {
            return {
                content: ""
            }
        },
        mounted() {
            this.content = this.$slots.default[0].text;
        }
    }
</script>

<style scoped lang="scss">
    .yid-ask {
        display: inline-block;
        margin-left: 15px;
        vertical-align: middle;
        .icon {
            width: 18px;
            height: 18px;
            background: url("../../../../assets/images/ask.png");
            display: inline-block;
            background-size: 100% 100%;
        }
    }
</style>
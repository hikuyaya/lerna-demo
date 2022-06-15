<template>
    <div>
        <!--  关联实体卡组件  -->
        <div class="first" v-if="!firstFlag">
            <div class="content">
                <span>实体卡卡号： </span>
                <el-input clearable filterable v-model="cardNum"></el-input>
            </div>
            <el-button class="next" @click="readCard">下一步</el-button>
        </div>
        <div class="sec" v-else>
            <div class="content">
                <span>实体卡卡号： </span>
                <span class="cardnum">{{cardNo}}</span>
                <span class="writeCard" @click="writeCard">写卡</span>
            </div>

            <div class="footer">
                <el-button @click="pre">上一步</el-button>
                <el-button type="primary" @click="sure">确定</el-button>
            </div>
        </div>
    </div>
    
</template>


<script>
    import Vue from 'vue'
    import yid from '@src/library'
    import service from '@src/service'

    export default{
        props:{
            sitem:{
                typeof: Object,
                default:{}
            },
            memid:{
                typeof: String,
                default:''
            }
        },
        mounted(){
            if(this.cardno == ''){
                this.cardNum = ''
            }
            console.log(this.sitem)
        },
        data(){
            return{
               cardNum: '',
               cardNo:'',
               warning: '请仔细检查填写卡号与实体卡卡片上的卡号是否一致!',
               warningFlag:false,
               firstFlag: false,
            }
        },
        methods:{
            async initData(){
                this.cardNum = ''
                this.cardNo = ''
                this.firstFlag = false
            },
            call(command, parms) {
                let params = {
                    command: command, 
                    para: parms,
                    callbackQuery: 'callback',
                    callbackName: 'callback'
                }
                    // Vue.jsonp({
                        // url: "http://127.0.0.1:7765",

                        // callback: "callback",
                        // timeout: 10000,
                         Vue.jsonp("http://127.0.0.1:7765",params).then((mdata) =>{
                             console.log(mdata)
                             var printmsg = mdata;
                            if (printmsg.length < 0) {
                                return yid.util.error("返回数据为空 !");
                            }
                            if (printmsg.substring(0, 4) == '[ER]') {
                                return yid.util.error(printmsg);
                            }
                            if (command == 'readcard') {

                                let cardno = mdata;
                                if (cardno.length == 0) {
                                    return yid.util.error("卡号为空!");
                                }
                                if (cardno.substring(0, 4) == '[ER]') {
                                    if (cardno.substring(0, 8) == '[ER][08]' || cardno.substring(0, 8) == '[ER][09]' || cardno.substring(0, 8) == '[ER][10]' || cardno.substring(0, 8) == '[ER][11]') {
                                       return yid.util.error("卡已锁定，请移交信息部！");
                                    } else {
                                        return yid.util.error(cardno);
                                    }
                                }
                                if(this.cardNum == cardno){
                                    // console.log('卡号输入正确')
                                    this.cardNo = cardno
                                    this.findCardDispatch()
                                    // this.warningFlag = false
                                    // this.firstFlag = true
                                    
                                }else{
                                    this.warningFlag = true
                                    return yid.util.error('请仔细检查填写卡号与实体卡卡片上的卡号是否一致!')
                                }
                            }
                         }).catch((e) =>{
                            return yid.util.error('连接驱动失败!')
                         })
            },
            //读卡
            readCard(){
                this.call("readcard", "")
                // this.call("writecard", "21354687901")
                // this.call("writecard", "0")      //写卡0，初始化
            },
            //写卡
            writeCard(){
                this.call("writecard", "")
            },
            //上一步
            pre(){
                this.firstFlag = false
            },
            //确定
            sure(){
                console.log(this.sitem)
                let dcardno
                let memid
                if(this.sitem.row != undefined){
                    dcardno = this.sitem.row.cardno
                    memid = this.sitem.row.memid
                }else{
                    dcardno = this.sitem.cardno
                    memid = this.memid

                }
                let params = {
                    dcardno: dcardno,
                    scardno: this.cardNo,
                    memid: memid
                }
                service.batchCard.cardRelevance(params).then(res =>{
                    yid.util.success("已成功关联实体卡!")
                    this.$emit('onClose',this.cardNo)
                })
                
            },
            //查询卡号是否分拨
            findCardDispatch(){
                let params = {
                    cardno: this.cardNum
                }
                service.batchCard.findCardDispatch(params).then(res =>{
                    console.log(111)
                    if(res.data == null){
                        return yid.util.error('可销售的卡中没有卡号为[' + this.cardNo+']的卡!')
                    }else{
                        this.warningFlag = false
                        this.firstFlag = true
                    }
                    
                    
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    .content{
        display: flex;
        align-items: center;
        /deep/ .el-input{
            width: 300px !important;
        }
        .next{
            margin-top: 40px;
            margin-left: 40%;
        }
        .cardnum{
            margin-right: 30px;
        }
        .writeCard{
            color:#0099FF;
            cursor: pointer;
        }
    }
    .footer{
        margin-top: 34px;
        text-align: center;
        button:nth-child(2){
            margin-left: 60px;
        }
    }
</style>
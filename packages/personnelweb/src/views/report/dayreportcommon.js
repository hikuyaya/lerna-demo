import service from '@src/service'
import {add, mul, div, sub, addsub, addArray, moneyFormat} from "../../library/helper/number"

export const common = {
    data() {
        return {
            activeNames: ['1', '2', '3', '4'],
            searchForm: {
                shopid: '',
                day: '',
            },
            paycodes: [], // 付款方式
            pageInfo: {
                page: 1, limit: 10000
            },
            allShopList: [],
            filterShopList: [],
            payList: [], // 付款方式
            saledata: [], //收银单
            packagedata: [], // 套餐单
            carddata: [],  // 充值单
            ksdata: [], // 客数
            servyj: [], // 服务业绩
            packageyj: [], // 客装业绩
            kkdata: [], // 开卡
            payhj: [], //付款方式汇总
            sumdata: [], // 总业绩
            salebillhead: [], // 收银单
            packagebillhead: [],// 套餐单
            cardbillhad: [], // 充值单
            ioaccount: [], // 收支
            jddayitem: [], // 代扣代缴
            cardtkhead: [], // 退卡
            printAll: {
                id: "printAll",
                popTitle: "日报表打印",
                extraCss: "",
                extraHead: '<meta http-equiv="Content-Language" content="zh-cn"/>'
            },
            printObj: {
                id: "printId",
                popTitle: "日报表打印结存",
                extraCss: "",
                extraHead: '<meta http-equiv="Content-Language" content="zh-cn"/>'
            },
        }
    },
    mounted() {
        this.getPayList({})
        this.searchForm.day = this.getToday();
    },
    created() {
        this.handleprint();
    },
    filters: {
        moneyFormat(money) {
            if (money == null || money == 'null' || money == 0) return '0.00';
            return money.toFixed(2);
        },
    },
    methods: {
        formatMoney(row, column) {
            let moneystr = row[column.property] + "";
            if (moneystr == null || moneystr == "" || moneystr == "0")
                return '0.00';
            return moneystr.toFixed(2);
        },
        handleprint(val) {
            console.log(val)
        },
        handleChange(val) {
            console.log(val);
        },
        getPayList(params) {
            service.chain.payType.payTypeList(params).then(res => {
                if (res.resp_code == 200) {
                    this.payList = res.data;
                }
            })
        },
        getShopList(params) {
            service.chain.shop.shopList(params).then(res => {
                if (res.resp_code == 200) {
                    this.filterShopList = res.data;
                    this.allShopList = Object.assign(this.filterShopList);//保留原数据
                }
            })
        },
        seachData() {
            this.$refs['searchForm'].validate((valid) => {
                if (valid) {
                    this.getData({...this.pageInfo, ...this.searchForm})
                }
            })
        },
        async getData(params) {
            this.clearData();
            await this.queryData(params);
            this.jsData();
        },
        jsData() {
            const ksdata = {
                sumks: 0,
                gks: 0,
                mks: 0,
                sjszks: 0,
                asstzks: 0,
                bxks: 0,
                bxzks: 0,
                fczks: 0,
                nks: 0,
                bks: 0
            };
            const servList = [], kzList = [];
            const bxm = {name: '大项目合计', sl: 0, je: 0, yj: 0}, sxm = {name: '小项目合计', sl: 0, je: 0, yj: 0};
            const kzhj = {name: '客装合计', sl: 0, je: 0, yj: 0}, nghj = {name: '内购合计', sl: 0, je: 0, yj: 0};
            // 01 人民币 07 银联POS 23 微信 52 银联通 33 工行爱购 27 美团 02 储值卡卡金 03 储值卡赠送 11 生日赠送 29 红包  其他
            const salepays = {
                id: 1,
                name: '收银',
                pay1: 0,
                pay2: 0, pay21: 0,
                pay3: 0, pay31: 0,
                pay4: 0, pay41: 0,
                pay5: 0, pay51: 0,
                pay6: 0,
                pay7: 0,
                pay8: 0,
                pay9: 0,
                pay10: 0,
                payOther: 0
            };
            const packpays = {
                id: 2,
                name: '套餐购买',
                pay1: 0,
                pay2: 0, pay21: 0,
                pay3: 0, pay31: 0,
                pay4: 0, pay41: 0,
                pay5: 0, pay51: 0,
                pay6: 0,
                pay7: 0,
                pay8: 0,
                pay9: 0,
                pay10: 0,
                payOther: 0
            };
            const cardpays = {
                id: 3,
                name: '开充卡',
                pay1: 0,
                pay2: 0, pay21: 0,
                pay3: 0, pay31: 0,
                pay4: 0, pay41: 0,
                pay5: 0, pay51: 0,
                pay6: 0,
                pay7: 0,
                pay8: 0,
                pay9: 0,
                pay10: 0,
                payOther: 0
            };
            const itempays = {
                id: 4,
                name: '营业外收入',
                pay1: 0,
                pay2: 0, pay21: 0,
                pay3: 0, pay31: 0,
                pay4: 0, pay41: 0,
                pay5: 0, pay51: 0,
                pay6: 0,
                pay7: 0,
                pay8: 0,
                pay9: 0,
                pay10: 0,
                payOther: 0
            };
            const sumdata = {
                zjzyj: 0,
                zyzj: 0,
                zywj: 0,
                wmbk: 0,
                tgbk: 0,
                dsbk: 0,
                rzio: 0,
                tkzj: 0,
                xkj: 0,
                xdc: 0,
                xzs: 0,
                xlk: 0
            };

            this.salebillhead.forEach((head, index) => {
                let isAdd = this.paycodes.length == 0 ? true : false;
                const isCompute = Number(head.isCompute);
                let sjszks = 0, asstzks = 0, bxks = 0, bxzks = 0, fczks = 0;
                const sale = {
                    id: head.id,
                    orderno: (index + 1),
                    billcode: head.billcode,
                    cardno: head.cmcode,
                    memname: head.memName,
                    sex: "1" == head.sex ? "男" : "女",
                    iskc: "1" == head.isCompute ? "是" : "否",
                    billje: head.totalMoney,
                    zkje: head.zkeTotal,
                    ysje: head.hjbillje,
                    servnames: '',
                    sjss: '',
                    assts: '',
                    pays: ''
                };
                fczks = head.cmcode ? 0 : isCompute;
                if (head.payList && head.payList.length > 0) {
                    let pays = "";
                    head.payList.forEach(pay => {
                        pays += pay.payname + ":" + pay.money + "\n";
                        // 美发非储值客数：计客次服务单无卡消费且没有使用团购拨款，骁骁网，新美大付款方式
                        if (pay.paycode == '18' || pay.paycode == '35' || pay.paycode == '27') fczks = 0;
                        if (pay.paycode == '01') salepays.pay1 = add(salepays.pay1, pay.money);
                        else if (pay.paycode == '07') {
                            salepays.pay2 = add(salepays.pay2, pay.payyj)
                            salepays.pay21 = add(salepays.pay21, pay.payyjzke)
                        }
                        else if (pay.paycode == '23') {
                            salepays.pay3 = add(salepays.pay3, pay.payyj)
                            salepays.pay31 = add(salepays.pay31, pay.payyjzke)
                        }
                        else if (pay.paycode == '52') {
                            salepays.pay4 = add(salepays.pay4, pay.payyj)
                            salepays.pay41 = add(salepays.pay41, pay.payyjzke)
                        }
                        else if (pay.paycode == '33') {
                            salepays.pay5 = add(salepays.pay5, pay.payyj)
                            salepays.pay51 = add(salepays.pay51, pay.payyjzke)
                        }
                        else if (pay.paycode == '27') salepays.pay6 = add(salepays.pay6, pay.money)
                        else if (pay.paycode == '02') salepays.pay7 = add(salepays.pay7, pay.money)
                        else if (pay.paycode == '03') salepays.pay8 = add(salepays.pay8, pay.money)
                        else if (pay.paycode == '11') salepays.pay9 = add(salepays.pay9, pay.money)
                        else if (pay.paycode == '29') salepays.pay10 = add(salepays.pay10, pay.money)
                        else salepays.payOther = add(salepays.payOther, pay.money)
                        this.paycodes.forEach(code => {
                            if (code == pay.paycode) isAdd = true;
                        })
                        if (pay.paycode == '02') sumdata.xkj = add(sumdata.xkj, pay.money)
                        // 06 套餐, 50 套餐支付
                        if (pay.paycode == '06' || pay.paycode == '50') sumdata.xdc = add(sumdata.xdc, pay.money)
                        // ptcode='02' 赠送
                        if (pay.ptcode == '02') sumdata.xzs = add(sumdata.xzs, pay.payyj)
                        // 09 老卡
                        if (pay.paycode == '09') sumdata.xlk = add(sumdata.xlk, pay.money)
                    })
                    sale.pays = pays;
                }
                if (head.servVOList && head.servVOList.length > 0) {
                    let servs = "", kz = "";
                    head.servVOList.forEach(serv => {
                        if (serv.stype == "1") {
                            servs += "[项目]" + serv.sname + ":" + serv.payftje + "\n"
                            if (serv.sertype == '1') {
                                bxm.sl = add(bxm.sl, serv.num)
                                bxm.je = add(bxm.je, serv.payftje)
                                bxm.yj = sub(bxm.je, serv.payftyjzke);
                                bxks = isCompute;
                                if (serv.isApppoint == '1') bxzks = isCompute;
                            }
                            if (serv.sertype == '2') {
                                sxm.sl = add(sxm.sl, serv.num)
                                sxm.je = add(sxm.je, serv.payftje)
                                sxm.yj = sub(sxm.je, serv.payftyjzke)
                            }
                            let isSev = true;
                            servList.forEach(sev => {
                                if (serv.scode == sev.code) {
                                    sev.sl = add(sev.sl, serv.num)
                                    sev.je = add(sev.je, serv.payftje)
                                    sev.yj = sub(sev.je, serv.payftyjzke)
                                    isSev = false
                                }
                            })
                            if (isSev) {
                                servList.push({
                                    code: serv.scode,
                                    name: serv.sname,
                                    sl: serv.num,
                                    je: serv.payftje,
                                    yj: sub(serv.payftje, serv.payftyjzke)
                                })
                            }
                        }
                        if (serv.stype == "2") {
                            kz += "[客装]" + serv.sname + ":" + serv.payftje + '|' + (serv.isKeep == '1' ? '寄存' : '取走') + "\n"
                            if (serv.pricetype == "3") {
                                nghj.sl = add(nghj.sl, serv.num)
                                nghj.je = add(nghj.je, serv.payftje)
                                nghj.yj = sub(nghj.je, serv.payftyjzke)
                            } else {
                                kzhj.sl = add(kzhj.sl, serv.num)
                                kzhj.je = add(kzhj.je, serv.payftje)
                                kzhj.yj = sub(kzhj.je, serv.payftyjzke)
                            }
                            let isKz = true;
                            kzList.forEach(sev => {
                                if (serv.scode == sev.code) {
                                    sev.sl = add(sev.sl, serv.num)
                                    sev.je = add(sev.je, serv.payftje)
                                    sev.yj = sub(sev.je, serv.payftyjzke)
                                    isKz = false
                                }
                            })
                            if (isKz) {
                                kzList.push({
                                    code: serv.scode,
                                    name: serv.sname,
                                    sl: serv.num,
                                    je: serv.payftje,
                                    yj: sub(serv.payftje, serv.payftyjzke)
                                })
                            }
                        }
                    })
                    if (servs) {
                        sale.servnames += servs;
                    }
                    if (kz) {
                        sale.servnames += kz;
                    }
                }
                if (head.royaltyList && head.royaltyList.length > 0) {
                    let sjssserv = "", sjsszk = "", assts = "";
                    head.royaltyList.forEach(ee => {
                        if (ee.postion == 1) {
                            if (ee.stype == "1") {
                                sjssserv += "[项目]" + ee.eename + "|" + ee.yj + "|" + (ee.isApppoint == '1' ? '√' : '×') + "\n"
                            }
                            if (ee.stype == "2") {
                                sjsszk += "[客装]" + ee.eename + "|" + ee.yj + "\n"
                            }
                            if (ee.isApppoint == '1') sjszks = isCompute;
                        }
                        if (ee.postion == 2 && ee.stype == "1") {
                            assts += "[项目]" + ee.eename + "|" + ee.yj + "|" + "\n";
                            if (ee.isApppoint == '1') asstzks = isCompute;
                        }
                    })
                    if (sjssserv) sale.sjss += sjssserv;
                    if (sjsszk) sale.sjss += sjsszk;
                    if (assts) sale.assts += assts;
                }
                if (head.eeservpayList && head.eeservpayList.length > 0) {
                    let assts = "";
                    head.eeservpayList.forEach(ee => {
                        if (ee.postion == 2) {
                            if (ee.stype == "2") {
                                let str = ""
                                if ((ee.ptcode == "01" || ee.ptcode == '04')) str = "[现金客装]";
                                else str = "[卡消客装]";
                                assts += str + ee.eename + "|" + ee.payyj + "\n";
                            }
                        }
                    })
                    if (sale.assts.length > 0) sale.assts += "\n";
                    if (assts) sale.assts += assts;
                }
                if (isAdd) this.saledata.push(sale);
                ksdata.sumks += isCompute;
                ksdata.gks += '2' == head.sex ? isCompute : 0;
                ksdata.mks += '1' == head.sex ? isCompute : 0;
                ksdata.sjszks = add(ksdata.sjszks, sjszks)
                ksdata.asstzks = add(ksdata.asstzks, asstzks)
                ksdata.bxks = add(ksdata.bxks, bxks)
                ksdata.bxzks = add(ksdata.bxzks, bxzks)
                ksdata.fczks = add(ksdata.fczks, fczks)
            })
            this.packagebillhead.forEach((head, index) => {
                const pack = {
                    id: head.id,
                    orderno: (index + 1),
                    billcode: head.billcode,
                    cardno: head.cmcode,
                    memname: head.memName,
                    sex: "1" == head.sex ? "男" : "女",
                    billje: head.totalMoney,
                    zkje: head.zkeTotal,
                    ysje: head.hjbillje,
                    packageinfo: '',
                    eenames: '',
                    yj1: '',
                    yj2: '',
                    pays: ''
                }
                let isAdd = this.paycodes.length == 0 ? true : false;
                if (head.paysList && head.paysList.length > 0) {
                    let pays = "";
                    head.paysList.forEach(pay => {
                        pays += pay.payname + ":" + pay.money + "\n";
                        if (pay.paycode == '01') packpays.pay1 = add(packpays.pay1, pay.money)
                        else if (pay.paycode == '07') {
                            packpays.pay2 = add(packpays.pay2, pay.payyj)
                            packpays.pay21 = add(packpays.pay21, pay.payyjzke)
                        }
                        else if (pay.paycode == '23') {
                            packpays.pay3 = add(packpays.pay3, pay.payyj)
                            packpays.pay31 = add(packpays.pay31, pay.payyjzke)
                        }
                        else if (pay.paycode == '52') {
                            packpays.pay4 = add(packpays.pay4, pay.payyj)
                            packpays.pay41 = add(packpays.pay41, pay.payyjzke)
                        }
                        else if (pay.paycode == '33') {
                            packpays.pay5 = add(packpays.pay5, pay.payyj)
                            packpays.pay51 = add(packpays.pay51, pay.payyjzke)
                        }
                        else if (pay.paycode == '27') packpays.pay6 = add(packpays.pay6, pay.money)
                        else if (pay.paycode == '02') packpays.pay7 = add(packpays.pay7, pay.money)
                        else if (pay.paycode == '03') packpays.pay8 = add(packpays.pay8, pay.money)
                        else if (pay.paycode == '11') packpays.pay9 = add(packpays.pay9, pay.money)
                        else if (pay.paycode == '29') packpays.pay10 = add(packpays.pay10, pay.money)
                        else packpays.payOther = add(packpays.payOther, pay.money)
                        this.paycodes.forEach(code => {
                            if (code == pay.paycode) isAdd = true;
                        })
                    })
                    pack.pays = pays;
                }
                if (head.royaltyList && head.royaltyList.length > 0) {
                    let eenames = "", yj1 = "", yj2 = "";
                    head.royaltyList.forEach(ee => {
                        eenames += ee.eename + ":" + ee.yj + "\n";
                        if (ee.postion == 1) yj1 += ee.eename + ":" + ee.yj + "\n";
                        if (ee.postion == 2) yj2 += ee.eename + ":" + ee.yj + "\n";
                    })
                    if (eenames) pack.eenames = eenames;
                    if (yj1) pack.yj1 = yj1;
                    if (yj2) pack.yj2 = yj2;
                }
                if (head.servList && head.servList.length > 0) {
                    let servs = "", kz = "";
                    head.servList.forEach(serv => {
                        if (serv.stype == "1") servs += "[项目]" + serv.sname + ":" + serv.num + "*" + serv.price + "=" + serv.ysje + "\n";
                        if (serv.stype == "2") kz += "[客装]" + serv.sname + ":" + serv.num + "*" + serv.price + "=" + serv.ysje + "\n";
                    })
                    if (servs.length > 3) {
                        pack.packageinfo += servs;
                    }
                    if (kz.length > 3) {
                        pack.packageinfo += kz;
                    }
                }
                if (isAdd) this.packagedata.push(pack)
            })
            this.cardbillhad.forEach((head, index) => {
                const card = {
                    id: head.id,
                    orderno: (index + 1),
                    billcode: head.billcode,
                    cardno: head.cardnum ? head.content : head.cardno,
                    memname: head.memName,
                    sex: "1" == head.sex ? "男" : "女",
                    isOpen: "1" == head.isOpen ? "是" : "否",
                    money: head.ysje,
                    gmoney: head.gmoney,
                    eenames: '',
                    yj1: '',
                    yj2: '',
                    pays: ''
                }
                let isAdd = this.paycodes.length == 0 ? true : false;
                if (head.paysList && head.paysList.length > 0) {
                    let pays = "";
                    head.paysList.forEach(pay => {
                        pays += pay.payname + ":" + pay.payje + "\n";
                        if (pay.paycode == '01') cardpays.pay1 = add(cardpays.pay1, pay.payje)
                        else if (pay.paycode == '07') {
                            cardpays.pay2 = addsub(cardpays.pay2, pay.payje, pay.free)
                            cardpays.pay21 = add(cardpays.pay21, pay.free)
                        }
                        else if (pay.paycode == '23') {
                            cardpays.pay3 = addsub(cardpays.pay3, pay.payje, pay.free)
                            cardpays.pay31 = add(cardpays.pay31, pay.free)
                        }
                        else if (pay.paycode == '52') {
                            cardpays.pay4 = addsub(cardpays.pay4, pay.payje, pay.free)
                            cardpays.pay41 = add(cardpays.pay41, pay.free)
                        }
                        else if (pay.paycode == '33') {
                            cardpays.pay5 = addsub(cardpays.pay5, pay.payje, pay.free)
                            cardpays.pay51 = add(cardpays.pay51, pay.free)
                        }
                        else if (pay.paycode == '27') cardpays.pay6 = add(cardpays.pay6, pay.payje)
                        else if (pay.paycode == '02') cardpays.pay7 = add(cardpays.pay7, pay.payje)
                        else if (pay.paycode == '03') cardpays.pay8 = add(cardpays.pay8, pay.payje)
                        else if (pay.paycode == '11') cardpays.pay9 = add(cardpays.pay9, pay.payje)
                        else if (pay.paycode == '29') cardpays.pay10 = add(cardpays.pay10, pay.payje)
                        else cardpays.payOther = add(cardpays.payOther, pay.payje)
                        this.paycodes.forEach(code => {
                            if (code == pay.paycode) isAdd = true;
                        })
                    })
                    card.pays = pays;
                }
                if (head.yjsList && head.yjsList.length > 0) {
                    let eenames = "", yj1 = "", yj2 = "";
                    head.yjsList.forEach(yj => {
                        eenames += yj.eename + ":" + yj.yjje + "\n";
                        if (yj.postion == 1) yj1 += yj.eename + ":" + yj.yjje + "\n";
                        if (yj.postion == 2) yj2 += yj.eename + ":" + yj.yjje + "\n";
                    })
                    if (eenames) card.eenames = eenames;
                    if (yj1) card.yj1 = yj1;
                    if (yj2) card.yj2 = yj2;
                }
                if (isAdd) this.carddata.push(card)
                const kkdata = {
                    cpcode: head.cpcode,
                    cardname: head.cardname,
                    kksl: "1" == head.isOpen ? (head.cardnum ? head.cardnum : 1) : 0,
                    kkje: "1" == head.isOpen ? head.ysje : 0,
                    kkyj: "1" == head.isOpen ? head.ysje : 0,
                    czsl: "0" == head.isOpen ? 1 : 0,
                    czje: "0" == head.isOpen ? head.ysje : 0,
                    czyj: "0" == head.isOpen ? head.ysje : 0,
                    kcsl: 1,
                    kcje: head.ysje,
                    kcyj: head.ysje,
                }
                let flag = true;
                this.kkdata.forEach(kk => {
                    if (head.cpcode == kk.cpcode) {
                        kk.kksl = add(kk.kksl, kkdata.kksl)
                        kk.kkje = add(kk.kkje, kkdata.kkje)
                        kk.kkyj = add(kk.kkyj, kkdata.kkyj)
                        kk.czsl = add(kk.czsl, kkdata.czsl)
                        kk.czje = add(kk.czje, kkdata.czje)
                        kk.czyj = add(kk.czyj, kkdata.czyj)
                        kk.kcsl = add(kk.kcsl, kkdata.kcsl)
                        kk.kcje = add(kk.kcje, kkdata.kcje)
                        kk.kcyj = add(kk.kcyj, kkdata.kcyj)
                        flag = false;
                    }
                })
                if (flag) {
                    this.kkdata.push(kkdata);
                }
                ksdata.bks += "1" == head.isOpen ? 1 : 0;
            })
            this.ioaccount.forEach(io => {
                if (io.type == "1") {// 类型 1-收入2-支出
                    io.details.forEach(pay => {
                        if (pay.paycode == '01') itempays.pay1 += pay.money;
                        else if (pay.paycode == '07') {
                            itempays.pay2 = addsub(itempays.pay2, pay.money, pay.freeRateJe)
                            itempays.pay21 = add(itempays.pay21, pay.freeRateJe)
                        }
                        else if (pay.paycode == '23') {
                            itempays.pay3 = addsub(itempays.pay3, pay.money, pay.freeRateJe)
                            itempays.pay31 = add(itempays.pay31, pay.freeRateJe)
                        }
                        else if (pay.paycode == '52') {
                            itempays.pay4 = addsub(itempays.pay4, pay.money, pay.freeRateJe)
                            itempays.pay41 = add(itempays.pay41, pay.freeRateJe)
                        }
                        else if (pay.paycode == '33') {
                            itempays.pay5 = addsub(itempays.pay5, pay.money, pay.freeRateJe)
                            itempays.pay51 = add(itempays.pay51, pay.freeRateJe)
                        }
                        else if (pay.paycode == '27') itempays.pay6 += pay.money;
                        else if (pay.paycode == '02') itempays.pay7 += pay.money;
                        else if (pay.paycode == '03') itempays.pay8 += pay.money;
                        else if (pay.paycode == '11') itempays.pay9 += pay.money;
                        else if (pay.paycode == '29') itempays.pay10 += pay.money;
                        else itempays.payOther += pay.money;
                        sumdata.zywj += pay.money;
                    })
                }
                if (io.type == "2") {
                    sumdata.rzio += io.hjje;
                }
            })
            this.jddayitem.forEach(jd => {
                // 55 微慕拨款 wmbk 94 团购拨款 tgbk 54 电商券拨款 dsbk
                if (jd.djcode == "55") {
                    sumdata.wmbk = jd.money
                }
                if (jd.djcode == "94") {
                    sumdata.tgbk = jd.money
                }
                if (jd.djcode == "54") {
                    sumdata.dsbk = jd.money
                }
            })
            this.cardtkhead.forEach(tk => {
                sumdata.tkzj = tk.totalMoney
            })

            ksdata.nks = add(ksdata.fczks, ksdata.bks);
            this.ksdata.push(ksdata);

            servList.forEach(serv => {
                this.servyj.push(serv);
            })
            const xmhj = {name: '合计', sl: add(bxm.sl, sxm.sl), je: add(bxm.je, sxm.je), yj: add(bxm.yj, sxm.yj)};
            this.servyj.push(xmhj);

            kzList.forEach(kz => {
                this.packageyj.push(kz);
            })
            const product = {
                name: '合计',
                sl: add(kzhj.sl, nghj.sl),
                je: add(kzhj.je, nghj.je),
                yj: add(kzhj.yj, nghj.yj)
            };
            this.packageyj.push(product);
            this.packageyj.push(kzhj);
            this.packageyj.push(nghj);

            this.payhj.push(salepays);
            this.payhj.push(packpays);
            this.payhj.push(cardpays);
            this.payhj.push(itempays);
            const hjpays = {
                id: 5,
                name: '合计',
                pay1: addArray([salepays.pay1, packpays.pay1, cardpays.pay1, itempays.pay1]),
                pay2: addArray([salepays.pay2, packpays.pay2, cardpays.pay2, itempays.pay2]),
                pay21: addArray([salepays.pay21, packpays.pay21, cardpays.pay21, itempays.pay21]),
                pay3: addArray([salepays.pay3, packpays.pay3, cardpays.pay3, itempays.pay3]),
                pay31: addArray([salepays.pay31, packpays.pay31, cardpays.pay31, itempays.pay31]),
                pay4: addArray([salepays.pay4, packpays.pay4, cardpays.pay4, itempays.pay4]),
                pay41: addArray([salepays.pay41, packpays.pay41, cardpays.pay41, itempays.pay41]),
                pay5: addArray([salepays.pay5, packpays.pay5, cardpays.pay5, itempays.pay5]),
                pay51: addArray([salepays.pay51, packpays.pay51, cardpays.pay51, itempays.pay51]),
                pay6: addArray([salepays.pay6, packpays.pay6, cardpays.pay6, itempays.pay6]),
                pay7: addArray([salepays.pay7, packpays.pay7, cardpays.pay7, itempays.pay7]),
                pay8: addArray([salepays.pay8, packpays.pay8, cardpays.pay8, itempays.pay8]),
                pay9: addArray([salepays.pay9, packpays.pay9, cardpays.pay9, itempays.pay9]),
                pay10: addArray([salepays.pay10, packpays.pay10, cardpays.pay10, itempays.pay10]),
                payOther: addArray([salepays.payOther, packpays.payOther, cardpays.payOther, itempays.payOther])
            };
            this.payhj.push(hjpays);

            sumdata.zyzj = addArray([salepays.pay1, packpays.pay1, cardpays.pay1
                , salepays.pay2, packpays.pay2, cardpays.pay2
                , salepays.pay3, packpays.pay3, cardpays.pay3
                , salepays.pay4, packpays.pay4, cardpays.pay4
                , salepays.pay5, packpays.pay5, cardpays.pay5]);
            sumdata.zjzyj = addArray([sumdata.zyzj, sumdata.zywj, sumdata.wmbk, sumdata.tgbk, sumdata.dsbk]);
            this.sumdata.push(sumdata);
        },
        async queryData(params) {
            params.updatedTimeStart = params.day;
            params.updatedTimeEnd = params.day;
            params.status = '4';
            params.isHc = '0';
            await service.dayreport.servicerecordList(params).then(res => {
                if (res.resp_code == 200) {
                    this.salebillhead = res.data;
                }
            })
            params.saleTimeStart = params.day;
            params.saleTimeEnd = params.day;
            await  service.dayreport.packagerecordList(params).then(res => {
                if (res.resp_code == 200) {
                    this.packagebillhead = res.data;
                }
            })
            params.status = '1';
            await service.dayreport.cardRecordList(params).then(res => {
                if (res.resp_code == 200) {
                    this.cardbillhad = res.data;
                }
            })
            params.status = '2';
            await service.dayreport.ioAccountList(params).then(res => {
                if (res.resp_code == 200) {
                    this.ioaccount = res.data;
                }
            })
            params.rq = params.day;
            await service.dayreport.jditemList(params).then(res => {
                if (res.resp_code == 200) {
                    this.jddayitem = res.data;
                }
            })
            params.status = '4';
            await service.dayreport.tkheadList(params).then(res => {
                if (res.resp_code == 200) {
                    this.cardtkhead = res.data;
                }
            })
        },
        clearData() {
            this.saledata = []; //收银单
            this.packagedata = []; // 套餐单
            this.carddata = [];  // 充值单
            this.ksdata = []; // 客数
            this.servyj = []; // 服务业绩
            this.packageyj = []; // 客装业绩
            this.kkdata = []; // 开卡
            this.payhj = []; //业绩汇总
            this.sumdata = []; // 总业绩
            this.cardtkhead = [];
        },
        changePayment() {
            this.clearData();
            this.jsData();
        },
        clearFormShopList() {
            this.searchForm.shopid = null
            this.filterShopList = this.allShopList
        },
        filterShop(v) {
            this.filterShopList = this.allShopList.filter((item) => {
                // 如果直接包含输入值直接返回true
                if (item.shopname.indexOf(v) !== -1) return true
                if (item.shopcode.indexOf(v) !== -1) return true
            })
        },
        getToday() {
            let date = new Date
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            if (Number(month) < 10) {
                month = "0" + month
            }
            let day = date.getDate()
            if (Number(day) < 10) {
                day = "0" + day
            }
            return year + "-" + month + "-" + day;
        }
    }
}
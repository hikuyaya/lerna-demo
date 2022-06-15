import Vue from 'vue'
import yid from '@src/library'


const request = async function (command, para = "", url = "http://localhost:7765", show = true) {

    var param = {
        command: command,
        para: para,
        callbackQuery: 'callback',
        callbackName: 'callback'
    };
    return await Vue.jsonp(url, param).catch((e) => {
        if (e.statusText == "Bad Request") {

          //  yid.util.alert('请求失败，请检查驱动')

        }

        //  console.error(e);
    });

}
const readCard = async function () {
    return await request("readcard", "", "http://localhost:7765", false);
}
const writeCard = async function (data) {
    return await request("writecard", data);


}
const initCard = async function () {

    return await request("initcard", "0");

}

const getMac = async function () {


    return new Promise(async function (resolve, reject) {

            if (window.device && window.device.serial) {
                resolve(window.device.serial);
            }
            let promise = await request("mac", "", "http://localhost:7765", false);

            if (promise && promise.length > 0) {
                resolve(promise.split(",")[0]);
            } else {

                resolve(null);
            }

        }
    )


}

const printTicket = async function (data) {

    return await request("print", data, "http://localhost:7765", false);
}


export default {
    writeCard,
    readCard,
    getMac,
    initCard,
    printTicket,

}
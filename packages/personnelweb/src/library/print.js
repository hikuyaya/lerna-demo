




/**
 * 转全角字符
 */
function toDBC(str) {
    var result = "";
    var len = str.length;
    for (var i = 0; i < len; i++) {
        var cCode = str.charCodeAt(i);
        //全角与半角相差（除空格外）：65248(十进制)
        cCode = (cCode >= 0x0021 && cCode <= 0x007E) ? (cCode + 65248) : cCode;
        //处理空格
        cCode = (cCode == 0x0020) ? 0x03000 : cCode;
        result += String.fromCharCode(cCode);
    }
    return result;
}

function objectForKey(obj, filed) {


    let newStr = null;
    let tmpObj = obj;


    if (filed.indexOf(".") != -1) {


        let strings1 =
            filed.split(".");

        for (let i = 0; i < strings1.length; i++) {

            tmpObj = tmpObj[strings1[i]];

        }


        newStr = tmpObj;


    } else {

        newStr = obj[filed];
    }

    return newStr

}

function spaceToDBC(str) {
    var result = "";
    var len = str.length;
    for (var i = 0; i < len; i++) {


        var cCode = str.charCodeAt(i);
        // console.log(cCode);
        if (cCode == 0x0020) {
            //全角与半角相差（除空格外）：65248(十进制)
            cCode = (cCode >= 0x0021 && cCode <= 0x007E) ? (cCode + 65248) : cCode;
            //处理空格
            cCode = (cCode == 0x0020) ? 0x03000 : cCode;
            result += String.fromCharCode(cCode);
        } else {

            result += String.fromCharCode(cCode);
        }
    }
    return result;
}

/**
 * 转半角字符
 */
function toSBC(str) {
    var result = "";
    var len = str.length;
    for (var i = 0; i < len; i++) {
        var cCode = str.charCodeAt(i);
        //全角与半角相差（除空格外）：65248（十进制）
        cCode = (cCode >= 0xFF01 && cCode <= 0xFF5E) ? (cCode - 65248) : cCode;
        //处理空格
        cCode = (cCode == 0x03000) ? 0x0020 : cCode;
        result += String.fromCharCode(cCode);
    }
    return result;
}


function formatStr(str, length) {


    if (!str) str = "";

    if (typeof (str) != 'string') str = str.toString();


    let strLen;
    if (str == null) {
        strLen = 0;
    } else {

        strLen = str.length;
    }

    //字符串中 非汉字长度 需要补的长度  默认1个汉字 等于 两个字母 或 数字宽

    // console.log(GetLength(toDBC(str)) + "=>" + GetLength(str))
    let zimu = GetLength(toDBC(str)) - GetLength(str);


    let hanzi = strLen - zimu;

    strLen = hanzi + Math.ceil(zimu * 0.55);
    // console.log(str + "：" + strLen + "fixed:" + zimu);
    if (hanzi == 0) {


        if (str.length > length * 2) return str.substr(0, length * 2);


        let temp = length * 2 - str.length;
        let tem = "";
        for (let i = 0; i < temp; i++) {
            tem = tem + " ";
        }
        return str + tem;

    } else if (strLen == length) {

        return str;


    } else if (strLen < length) {


        let temp = length - strLen;
        let tem = "";
        for (let i = 0; i < temp; i++) {
            tem = tem + " ";
        }
        return str + toDBC(tem);

    }

    else {


        return toDBC(str).substr(0, length);


    }
}


function findFormat(print) {


    let match =
        print.match(/\[\s*#(\S*)\s*]/g);


    return match;
}

function findAFormat(print) {


    let match =
        print.match(/\[\s*\*(\S*)\s*]/g);


    return match;
}


function findStr(print) {


    let match =
        print.match(/@(\S*)@/);


    let strings = match[1];


    let obj = {

        str: match[0],
        length: parseInt(strings),
    }

    return obj;
}

function findArray(print) {


    let match =
        print.match(/\[(\S*)\]/);


    return match[1];
}


function GetLength(str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}


const setCaretPosition = (textDom, pos) => {
    if (textDom.setSelectionRange) {//chrome/firefox
        textDom.focus();
        textDom.setSelectionRange(pos, pos);
    } else if (textDom.createTextRange) {//IE
        var range = textDom.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}

const insertAtCursor = (myField, myValue) => {


    //IE 浏览器
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        sel.select();
    }
    //FireFox、Chrome等
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        // 保存滚动条
        var restoreTop = myField.scrollTop;
        myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
        if (restoreTop > 0) {
            myField.scrollTop = restoreTop;
        }
        myField.focus();
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
    } else {
        myField.value += myValue;
        myField.focus();
    }


}

const getTextareaCursor = (textarea) => {

    let rangeData = {
        text: '',
        start: 0,
        end: 0
    }
    if (textarea.setSelectionRange) {
        textarea.focus()
        rangeData.start = textarea.selectionStart
        rangeData.end = textarea.selectionEnd
        rangeData.text = (rangeData.start !== rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : ''
    } else if (document.selection) { // IE
        textarea.focus();
        let i = 0
        let o = document.selection.createRange()
        let oR = document.body.createTextRange()
        oR.moveToElementText(textarea)
        rangeData.text = oS.text
        rangeData.bookmark = oS.getBookmark()
        for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart('character', -1) !== 0; i++) {
            if (textarea.value.charAt(i) === '/r') {
                i++
            }
        }
        rangeData.start = i
        rangeData.end = rangeData.text.length + rangeData.start
    }
    return rangeData
}


// 设置光标回原先位置 在插入文本时调用
const setTextareaCursor = (textarea, rangeData) => {
    let oR, start, end
    textarea.focus()
    if (textarea.setSelectionRange) {
        textarea.setSelectionRange(rangeData.start, rangeData.end)
    } else if (textarea.createtextRange) { // IE
        oR = textarea.createTextRange()
        if (textarea.value.length === rangeData.start) {
            oR.collapse(false)
            oR.select()
        } else {
            oR.moveToBookmark(rangeData.bookmark)
            oR.select()
        }
    }
}
// 在获取的光标位置插入指定文本 或 替换选定文本
const addTextareaCursor = (textarea, cursor, text) => {
    // textarea 容器； cursor：光标位置和选中内容； text：要插入的文本
    let oValue, nValue, oR, nStart, nEnd, st
    const sR = ''
    setTextareaCursor(textarea, cursor) // 调用获取位置
    if (textarea.setSelectionRange) {
        oValue = textarea.value
        nValue = oValue.substring(0, cursor.start) + text + oValue.substring(cursor.end)
        nStart = nEnd = cursor.start + text.length
        st = textarea.scrollTop
        textarea.value = nValue
        if (textarea.scrollTop !== st) {
            textarea.scrollTop = st
        }
        textarea.setSelectionRange(nStart, nEnd)
    } else if (textarea.createTextRange) { // IE
        sR.document.selection.createRange();
        sR.text = text
        sR.select()
    }
}


function printItem(format, keymap, obj) {

    let array = findFormat(format);

    if (!array) return format;


    let a = format.split('');

    array.forEach((item) => {


        let keymapElement =
            keymap[item];

        let filed = keymapElement.filed;


        let getLength = keymapElement.length;

        // printData.replaceAll(strings[0],)

        let newStr = "";
        let tmpObj = obj;


        if (filed.indexOf(".") != -1) {


            let strings1 =
                filed.split(".");

            for (let i = 0; i < strings1.length; i++) {

                tmpObj = tmpObj[strings1[i]];

            }


            if (typeof(tmpObj) == 'string') {

                newStr = tmpObj;
            }


        } else {

            newStr = obj[filed];
        }


        if (!newStr) newStr = "";

        let start = format.indexOf(item);


        a.splice(start, item.length, formatStr(newStr, getLength));


        format = a.join("");
        a = format.split('');
    })

    return a.join('');


}

function printLine(format, keymap, Obj) {


    let array = findAFormat(format);

    if (!array || array.length == 0) {

        return printItem(format, keymap, Obj);

    } else {

        let arrayElement =
            array[0];


        let filed =
            keymap[arrayElement].filed;

        //找到[sername].num 中的 sername
        let key = findArray(filed);

        //   let objElement =
        //     Obj[key];


        let objElement = objectForKey(Obj, key);

        let lines = [];

        if (!objElement) return;


        objElement.forEach((item) => {

            let temp = format;


            let a = temp.split('');
            array.forEach((keyItem) => {


                let keymapElement = keymap[keyItem];
                let filed = keymapElement.filed;
                let getLength = keymapElement.length;
                let subkey = filed.substr(filed.indexOf("].") + 2);


                let newStr = objectForKey(item, subkey);

                /*
                let newStr = "";
                let tmpObj = item;


                if (subkey.indexOf(".") != -1) {


                    let strings1 =
                        subkey.split(".");

                    for (let i = 0; i < strings1.length; i++) {

                        tmpObj = tmpObj[strings1[i]];

                    }


                    if (typeof(tmpObj) == 'string') {

                        newStr = tmpObj;
                    }


                } else {

                    newStr = tmpObj[subkey];
                }
*/

                if (!newStr) newStr = "";


                let start = temp.indexOf(keyItem);


                a.splice(start, keyItem.length, formatStr(newStr, getLength));


                temp = a.join("");
                a = temp.split('');

            })


            lines.push(a.join(""))

        })


        return lines.join("\n");
    }


}

function printData(obj, printData, printKeys) {


    let keymap = printKeys.split("|");


    let formatKeyMap = {};


    keymap.forEach(item => {

        let strings =
            item.split("=");


        let key = strings[1].split("@")[0];


        let findStr1 = findStr(item);
        let getLength = findStr1.length
        formatKeyMap[strings[0]] = {filed: key, length: getLength};

    });

    let printDataLines =
        printData.split("\n");

    let data = [];

    printDataLines.forEach(item => {


        data.push(printLine(item, formatKeyMap, obj));

    })


    return data.join('\n');


}

function formatContent(print, printitemData) {
    let match =
        //   print.match(new RegExp(/\[#(\S*|\s)]/, "g"));//
        print.match(new RegExp(/\[\s*[#\*](\S*)\s*]/, "g"));

    let keys = [];

    match.forEach(item => {

        let filter =
            printitemData.filter(item2 => item.indexOf(item2.name) != -1);

        if (filter) {

            let filterElement = filter[0];
            if (!filterElement) return;
            let itemkey = filterElement.filed;


            let length = item.replace("[", "").replace("]", "").replace("*", "").replace("#", "").length

            keys.push(item + "=" + itemkey + "@" + length + "@");

        }

    })


    return keys.join("|")

}




let testObj = {
    custname: '测试顾客',
    shopname: '测试店',
    shopcode: 'MF00000',
    billcode: "SA7878787878222",
    tel: "12345678",
    address: "湖北省武汉市永清路",
    total: 300,
    saletime: "2027-01-01 00:00:00",
    sers: [

        {sname: "洗剪吹", price: "300", num: 1},
        {sname: "烫发", price: "400", num: 2},
        {sname: "染发", price: "500", num: 3}
    ],
    cards: [

        {carno: "80003777733", money: "300", yj: 100},
        {carno: "17788366663", money: "400", yj: 200},
        {carno: "99666333888883", money: "500", yj: 300}
    ],
    payList: [

        {payname: "美发卡", payno: "899990004", money: 100},
        {payname: "人民币", payno: "", money: 200},
        {payname: "微信", payno: "", money: 300},
        {payname: "卡", payno: "", money: 500}
    ],
    ssers: [

        {sname: "眼部护理", num: 10,}, {sname: "艾灸", num: 16}, {sname: "颈部护理", num: 3}
    ],

    servVOList: [
        {
            "sname": "洗剪吹",
            "num": 1,
            "ysprice": 98,
        },
        {

            "sname": "露新兰大毛刘",
            "num": 1,
            "ysprice": 160,

        }
    ]
    ,
    servList: [
        {

            "sname": "【自由组合套餐】洗剪吹",
            "price": 40,
            "num": 1,

        }
    ]
}



export default {

    spaceToDBC,
    getTextareaCursor,
    addTextareaCursor,
    insertAtCursor,
    setCaretPosition,
    setTextareaCursor,
    printData,
    formatContent,
    testObj

}
import * as math from 'mathjs';

export function add(num1, num2) {
    return math.format(math.chain(math.bignumber(num1)).add(math.bignumber(num2)).done());
}

export function addArray(numList) {
    let numAll = 0;
    numList.forEach(num => {
        numAll = math.format(math.chain(math.bignumber(numAll)).add(math.bignumber(num)).done());
    })
    return numAll;
}

// 乘
export function mul(num1, num2) {
    return math.format(math.chain(math.bignumber(num1)).multiply(math.bignumber(num2)).done());
}

// 减
export function sub(num1, num2) {
    return math.format(math.chain(math.bignumber(num1)).subtract(math.bignumber(num2)).done());
}

// 除
export function div(num1, num2) {
    return math.format(math.chain(math.bignumber(num1)).divide(math.bignumber(num2)).done());
}

export function addsub(num1, num2, num3) {
    return math.format(math.chain(math.bignumber(num1)).add(math.bignumber(num2)).subtract(math.bignumber(num3)).done());
}

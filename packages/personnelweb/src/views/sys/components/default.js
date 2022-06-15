export  default "{\n" +
"    'init':function (that,params,defaults) {\n" +
"     },\n" +
"    'loadbefore':function (that,params) {\n" +
"        },\n" +
"    'loadafter':function (that,result,params) {\n" +
"        },\n" +
"    'cellstyle':function (that,row,column) {\n" +
"            return {};\n" +
"        },\n" +
"    'validator':function (that,column,rule, value){\n" +
"      if(rule.required==true&&value==''){\n" +
"        return '必填项未填写';\n" +
"        }\n" +
"        },\n" +
"    'cellformat':function (that,column, row) {\n" +
"            return row[column];\n" +
"        },\n" +
"    'spanMethod':function (that,row, column, rowIndex, columnIndex) {\n" +
"            return [1,1];\n" +
"        },\n" +
"    'summary':function (that,columns, data) {  \n" +
"      const sums = [];\n" +
"      if (columns.length > 0) {\n" +
"        columns.forEach((column, index) => {\n" +
"             data.forEach(item => {\n" +
"               if(!sums[index]){\n" +
"                 sums[index]=0;\n" +
"               }\n" +
"               let n=Number(item[column.property]);\n" +
"               if(!isNaN(n)){\n" +
"                  sums[index] +=n;\n" +
"               }\n" +
"              \n" +
"             });\n" +
"           \n" +
"             \n" +
"        });\n" +
"      }\n" +
"      return sums;\n" +
"        }\n" +
"}";

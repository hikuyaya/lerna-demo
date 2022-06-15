import stream from './stream'
import checkRule from "./checkRule";
import shopConfig from "./shopConfig";
import checkClass from "./checkClass";
import checkChstatistics from "./checkChstatistics";
import checkRecords from "./checkRecords";
import awardDesc from "./awardDesc";
import employeeSchedule from "./employeeSchedule";

/**员工相关**/
export default {
    /**提成明细**/
    stream,
    /**迟到早退规则**/
    checkRule,
    /**考勤配置**/
    shopConfig,
    /**考勤班次**/
    checkClass,
    /**考勤统计**/
    checkChstatistics,
    /**考勤记录**/
    checkRecords,
    /**员工奖励处罚明细**/
    awardDesc,
    /**员工排班**/
    employeeSchedule,
}
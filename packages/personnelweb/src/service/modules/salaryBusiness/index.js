/*
 * @Author: wqy
 * @Date: 2022-08-02 11:20:08
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-16 11:12:26
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\index.js
 * @Description:
 */
import attendance from './attendance'
import specialRequest from './specialRequest'
import salaryRequest from './salaryRequest'
import specialApprove from './specialApprove'
import salaryApprove from './salaryApprove'
import cutEnter from './cutEnter'
import payRequest from './payRequest'
import payApprove from './payApprove'
import pointToPoint from './pointToPoint'

export default {
  attendance,
  specialRequest,
  salaryRequest,
  specialApprove,
  salaryApprove,
  cutEnter,
  payRequest,
  payApprove,
  pointToPoint
}

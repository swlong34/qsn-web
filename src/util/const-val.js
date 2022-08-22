/*选择题 1xx*/
const SELECT_RADIO = {desc: '单选题', value: '11'}
const SELECT_MULTI = {desc: '多选题', value: '12'}
const SELECT_DROP = {desc: '下拉题', value: '13'}

/*填空题 2xx*/
const FILL_SINGLE = {desc: '单行填空', value: '21'}
const FILL_MULTI = {desc: '多行填空', value: '22'}
const FILL_REGION = {desc: '地区', value: '23'}
const FILL_DATE = {desc: '日期', value: '24'}

/*快捷题目 3xx*/
const SHORTCUT_NAME = {desc: '姓名', value: '31'}
const SHORTCUT_NUMBER = {desc: '学号/工号', value: '32'}
const SHORTCUT_GENDER = {desc: '性别', value: '33'}
const SHORTCUT_BIRTHDAY = {desc: '出生日期', value: '34'}
const SHORTCUT_ORIGIN = {desc: '籍贯', value: '35'}
const SHORTCUT_PHONE = {desc: '手机号', value: '36'}
const SHORTCUT_EMAIL = {desc: '邮箱', value: '37'}

/*问卷状态*/
const UN_PUBLIC = {desc: '未发布', value: 0}
const IS_PUBLIC = {desc: '已发布', value: 1}
const IS_STOP = {desc: '已结束', value: 2}

const DEV_URL = "http://localhost"
const DEV_PORT = ":8000"
const PRO_URL = "http://114.115.222.34"
const PRO_PORT = ":81"

export default {
  SELECT_RADIO,
  SELECT_MULTI,
  SELECT_DROP,
  FILL_SINGLE,
  FILL_MULTI,
  FILL_REGION,
  FILL_DATE,
  SHORTCUT_NAME,
  SHORTCUT_NUMBER,
  SHORTCUT_GENDER,
  SHORTCUT_BIRTHDAY,
  SHORTCUT_ORIGIN,
  SHORTCUT_PHONE,
  SHORTCUT_EMAIL,
  UN_PUBLIC,
  IS_PUBLIC,
  IS_STOP,
  DEV_URL,
  DEV_PORT,
  PRO_URL,
  PRO_PORT
}

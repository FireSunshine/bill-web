import React, { useState, useEffect, useRef } from 'react'
import { Icon, Progress } from 'zarm';
import cx from 'classnames';
import { get, typeMap } from '@/utils'

import s from './style.module.less'
import dayjs from 'dayjs';
import PopupDate from '@/components/PopupDate';
import CustomIcon from '@/components/CustomIcon';

let proportionChart = null; // 用于存放 echart 初始化返回的实例

const Data = () => {
  const monthRef = useRef();
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM')); // 当前月份
  const [totalType, setTotalType] = useState('expense'); // 收入或支出类型
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [expenseData, setExpenseData] = useState([]); // 支出数据
  const [incomeData, setIncomeData] = useState([]); // 收入数据
  const [pieType, setPieType] = useState('expense'); // 饼状图 收入 和 支出 控制

  useEffect(() => {
    getData();
    return () => {
      // 每次组件卸载的时候， 需要释放图表实例， clear 只是将其清空不会释放
      proportionChart.dispose()
    }
  }, [currentMonth])

  // 绘制饼状图的方法
  const setPieChart = (data) => {
    console.log(data);
    if (window.echarts) {
      // 初始化饼图，返回实例。
      proportionChart = echarts.init(document.getElementById('proportion'));
      proportionChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          // 图例
          legend: {
              data: data.map(item => item.type_name)
          },
          series: [
            {
              name: pieType === 'expense' ? '支出' : '收入',
              type: 'pie',
              radius: '55%',
              data: data.map(item => {
                return {
                  value: item.number,
                  name: item.type_name
                }
              }),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 1)'
                }
              }
            }
          ]
      })
    };
  };

  // 获取数据详情
  const getData = async () => {
    const { data } = await get(`/api/bill/data?date=${currentMonth}`);
    // 总收支
    setTotalExpense(data.total_expense);
    setTotalIncome(data.total_income);
    // 过滤支出和收入
    // 过滤出账单类型为支出的项
    const expense_data = data.total_data.filter(item => item.pay_type === 1).sort((a, b) => b.number - a.number); 
    // 过滤出账单类型为收入的项
    const income_data = data.total_data.filter(item => item.pay_type === 2).sort((a, b) => b.number - a.number);
    setExpenseData(expense_data);
    setIncomeData(income_data);

    // 绘制饼图
    setPieChart(pieType === 'expense' ? expense_data : income_data)
  }

  // 切换收支构成类型
  const changeTotalType = (type) => {
    setTotalType(type)
  }

  // 切换饼图收支类型
  const changePieType = (type) => {
    setPieType(type);
    // 绘制饼图
    setPieChart(type === 'expense' ? expenseData : incomeData);
  }


  // 月份弹窗开关
  const monthShow = () => {
    monthRef.current && monthRef.current.show();
  }
  
  // 选择月份
  const selectMonth = (item) => {
    setCurrentMonth(item)
  }

  return (
    <div className={s.data}>
      <div className={s.total}>
        <div className={s.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon className={s.date} type="date" />
        </div>
        <div className={s.title}>共支出</div>
        <div className={s.expense}>¥{ totalExpense }</div>
        <div className={s.income}>共收入¥ { totalIncome }</div>
      </div>
      <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span onClick={() => changeTotalType('expense')} className={cx({ [s.expense]: true, [s.active]: totalType === 'expense' })}>支出</span>
            <span onClick={() => changeTotalType('income')} className={cx({ [s.income]: true, [s.active]: totalType === 'income' })}>收入</span>
          </div>
        </div>
        <div className={s.content}>
          {
            (totalType === 'expense' ? expenseData : incomeData).map(item => <div key={item.type_id} className={s.item}>
              <div className={s.left}>
                <div className={s.type}>
                  <span className={cx({ [s.expense]: totalType === 'expense', [s.income]: totalType === 'income' })}>
                    <CustomIcon type={item.type_id ? typeMap[item.type_id].icon : 1}  />
                  </span>
                  <span className={s.name}>{item.type_name}</span>
                </div>
                <div className={s.progress}>¥{Number(item.number).toFixed(2) || 0}</div>
              </div>
              <div className={s.right}>
                <div className={s.percent}>
                  <Progress
                    shape='line'
                    theme='primary'
                    percent={Number((item.number / Number(totalType === 'expense' ? totalExpense : totalIncome)) * 100).toFixed(2)}
                  />
                </div>
              </div>
            </div>)
          }
        </div>
        <div className={s.proportion}>
          <div className={s.head}>
            <span className={s.title}>收支构成</span>
            <div className={s.tab}>
              <span onClick={() => changePieType('expense')} className={cx({ [s.expense]: true, [s.active]: pieType === 'expense' })}>支出</span>
              <span onClick={() => changePieType('income')} className={cx({ [s.income]: true, [s.active]: pieType === 'income' })}>收入</span>
            </div>
          </div>
          <div id="proportion"></div>
        </div>
      </div>
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    </div>
  )
}

export default Data
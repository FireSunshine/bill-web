import React, { forwardRef, useEffect, useState} from 'react';
import PropTypes from 'prop-types'
import { Popup, Icon } from 'zarm'
import cx from 'classnames'
import { get } from '@/utils'
import s from './style.module.less'

// forwardRef 用于拿到父组件传入的 ref 属性，这样在父组件便能通过 ref 控制子组件。
const PopupType = forwardRef(({ onSelect }, ref) => {
  const [show, setShow] = useState(false); // 组件的显示与隐藏
  const [active, setActive] = useState('all'); // 激活的 type
  const [expence, setExpence] = useState([]); // 支出类型标签
  const [income, setIncome] = useState([]); // 收入类型标签

  useEffect(async () => {
    // （复用）请求的标签接口放在弹窗内
    const {data : { list }} = await get(`/api/type/list`)
    setExpence(list.filter(item => item.type === '1'))
    setIncome(list.filter(item => item.type === '2'))
  }, [])

  if (ref) {
    ref.current = {
      // 外部可以通过 ref.current.show 来控制组件的显示
      show: () => {
        setShow(true)
      },
      // 外部可以通过 ref.current.close 来控制组件的隐藏
      close: () => {
        setShow(false)
      }
    }
  }

  // 选择类型的回调
  const choseType = (item) => {
    setActive(item)
    setShow(false)
    // 父组件传入的 onselect， 获取类型
    onSelect(item)
  }
  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.popupType}>
        <div className={s.header}>
          请选择类型
          <Icon type="wrong" className={s.cross} onClick={() => setShow(false)} />
        </div>
        <div className={s.content}>
          <div onClick={() => choseType({ id: 'all' })} className={cx({ [s.all]:true, [s.active]:active === 'all' })}>全部类型</div>
          <div className={s.title}>支出</div>
          <div className={s.incomeWrap}>
            {
              expence.map(item => <p key={item.id} onClick={() => choseType(item)} className={cx({[s.active]: active.id === item.id})}>{ item.name }</p>)
            }
          </div>
          <div className={s.title}>收入</div>
          <div className={s.incomeWrap}>
            {
              income.map(item => <p key={item.id} onClick={() => choseType(item)} className={cx({[s.active]: active.id === item.id})}>{ item.name }</p>)
            }
          </div>
        </div>
      </div>
    </Popup>
  );
});

PopupType.propTypes = {
  onSelect: PropTypes.func
}

export default PopupType;
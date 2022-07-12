import React from 'react';
import Header from '@/components/Header/Header';
import { Button, Input, Cell } from 'zarm';
import { createForm  } from 'rc-form';
import { useNavigate } from 'react-router-dom';
import s from './style.module.less'
import { Toast } from 'zarm';
import { post } from '@/utils';

const Account = (props) => {
  // Account 通过 createFrom 高阶组件 包裹之后，可以在 props 中获取到 form属性
  const {getFieldProps, getFieldError} = props.form;
  const navigate = useNavigate()

  // 提交修改的方法
  const submit = () => {
    // validateFields 获取表单属性元素
    props.form.validateFields(async (error, value) => {
      // error 表单验证全部通过为false，否则为true
      if (!error) {
        console.log(value);
        if (value.newpass !== value.rnewpass) {
          Toast.show('新密码输入不一致')
          return
        }
        await post('/api/user/modify_pass', {
          old_pass: value.oldpass,
          new_pass: value.newpass,
          new_pass2: value.rnewpass
        })
        Toast.show('修改成功')
        navigate(-1)
      }
    })
  }
  return (
    <>
      <Header title='重置密码'/>
      <div className={s.account}>
        <div className={s.form}>
          <Cell title="原密码">
            <Input
              clearable
              type='text'
              placeholder='请输入原密码'
              {...getFieldProps('oldpass', { rules: [{required: true}] })}
            />
          </Cell>
          <Cell title="新密码">
            <Input
              clearable
              type='text'
              placeholder='请输入新密码'
              {...getFieldProps('newpass', { rules: [{required: true}] })}
            />
          </Cell>
          <Cell title="确认密码">
            <Input
              clearable
              type='text'
              placeholder='请再次输入密码确认'
              {...getFieldProps('rnewpass', { rules: [{required: true}] })}
            />
          </Cell>
          <Button className={s.btn} block theme='primary' onClick={submit}>提交</Button>
        </div>
      </div>
    </>
  );
};

export default createForm()(Account);
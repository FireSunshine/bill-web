import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { get, post } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { Toast, Button, FilePicker, Input } from 'zarm';
import { baseUrl } from 'config'
import Header from '@/components/Header/Header';
import { imgUrlTrans } from '@/utils';
import s from './style.module.less'

const UserInfo = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({}); // 用户
  const [avatar, setAvatar] = useState(''); // 头像
  const [signature, setSignature] = useState(''); // 个性签名
  const token = localStorage.getItem('token'); // 登录令牌

  useEffect(() => {
    getUserInfo(); // 初始化请求
  }, [])

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get('/api/user/get_userinfo');
    setUser(data);
    setAvatar(imgUrlTrans(data.avatar));
    setSignature(data.signature);
  }

  // 获取图片的回调
  const handleSelect = (file) => {
    console.log('file', file);
    if (file && file.file.size > 200 * 1024) {
      Toast.show('上传头像不能超过 200KB！')
      return
    }
    let formData = new FormData()
    // 生成 form-data 数据类型
    formData.append('file', file.file)
    axios({
      method: 'post',
      url: `${baseUrl}/upload`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      }
    }).then(res => {
      // 返回图片地址
      setAvatar(imgUrlTrans(res.data))
    })
  }
  
  // 编辑用户信息的方法
  const save = async () => {
    const { data } = await post('/api/user/edit_userinfo', {
      signature,
      avatar
    })

    Toast.show('修改成功')
    navigate(-1)
  }
  return (
    <>
      <Header title='用户信息'/>
      <div className={s.userinfo}>
        <h1>个人资料</h1>
        <div className={s.item}>
          <div className={s.title}>头像</div>
          <div className={s.avatar}>
            <img className={s.avatarUrl} src={avatar} alt="" />
            <div className={s.desc}>
              <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              <FilePicker onChange={handleSelect} accept='image/*'>
                <Button theme='primary' size="xs">点击上传</Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={s.item}>
          <div className={s.title}>个性签名</div>
          <div className={s.signature}>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value) => setSignature(value)}
            />
          </div>
        </div>
        <Button onClick={save} style={{ marginTop: 50 }} block theme='primary'>保存</Button>
      </div>
    </>
  );
};

export default UserInfo;
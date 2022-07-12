import React from 'react';
import { useNavigate } from 'react-router-dom'
import { Icon, NavBar } from 'zarm';
import PropTypes from 'prop-types';

import s from './style.module.less'

const Header = ({ title = '' }) => {
  const navigate = useNavigate()
  return (
    <div className={s.headerWarp}>
      <div className={s.block}>
        <NavBar 
          className={s.header}
          left={<Icon type="arrow-left" theme="primary" onClick={() => navigate(-1)} />}
          title={title}
        />
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string, // 标题
}

export default Header;
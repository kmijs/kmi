import React from 'react';
import { useLocation } from 'umi';
import styles from './index.less';

export default () => {
  const location = useLocation();
  return <div className={styles.hi}>About {location.pathname}</div>;
};

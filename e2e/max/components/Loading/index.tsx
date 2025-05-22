// @ts-ignore
import { Spin } from 'antd'
// @ts-ignore
import styles from './index.less'

const Loading: React.FC = () => {
  return (
    <div className={styles.loading}>
      <Spin tip="loading ..." />
    </div>
  )
}

export default Loading

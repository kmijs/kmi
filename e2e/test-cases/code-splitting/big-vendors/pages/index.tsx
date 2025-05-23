// @ts-expect-error
import { history } from '@umijs/max'
import { Button } from 'antd'

const HomePage = () => {
  return (
    <div>
      Home Page
      <Button onClick={() => history.push('/about')}>Go to About</Button>
    </div>
  )
}

export default HomePage

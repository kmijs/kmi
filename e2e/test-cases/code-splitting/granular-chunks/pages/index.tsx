// @ts-expect-error
import { history } from '@umijs/max'
import { Button } from 'antd'
import { useState } from 'react'

const HomePage = () => {
  const [hello] = useState('hello word')
  return (
    <div>
      Home Page
      <Button onClick={() => history.push('/about')}>Go to About</Button>
      {hello}
    </div>
  )
}

export default HomePage

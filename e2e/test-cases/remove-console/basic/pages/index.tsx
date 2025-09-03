import React, { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    console.log('This log should be removed')
    console.warn('This warning should be removed')
    console.error('This error should be removed')
    console.info('This info should be removed')
    console.debug('This debug should be removed')
  }, [])

  const handleClick = () => {
    console.log('Button clicked - should be removed')
    console.warn('Button warning - should be removed')
  }

  const handleSubmit = () => {
    console.error('Form error - should be removed')
    console.info('Form submitted - should be removed')
  }

  return (
    <div>
      <h1>Remove Console Test - Basic</h1>
      <p>All console statements should be removed when removeConsole: true</p>
      <button onClick={handleClick}>Test Console Log</button>
      <button onClick={handleSubmit}>Test Console Error</button>
    </div>
  )
}

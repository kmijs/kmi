import React, { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    console.log('This log should be kept')
    console.warn('This warning should be kept')
    console.error('This error should be kept')
    console.info('This info should be kept')
    console.debug('This debug should be kept')
  }, [])

  const handleClick = () => {
    console.log('Button clicked - should be kept')
    console.warn('Button warning - should be kept')
  }

  const handleSubmit = () => {
    console.error('Form error - should be kept')
    console.info('Form submitted - should be kept')
  }

  return (
    <div>
      <h1>Remove Console Test - Disabled</h1>
      <p>
        All console statements should be kept when removeConsole is not
        configured
      </p>
      <button onClick={handleClick}>Test Console Log</button>
      <button onClick={handleSubmit}>Test Console Error</button>
    </div>
  )
}

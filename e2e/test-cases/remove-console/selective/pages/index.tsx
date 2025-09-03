import React, { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    console.log('This log should be removed')
    console.warn('This warning should be removed')
    console.error('This error should be kept')
    console.info('This info should be kept')
    console.debug('This debug should be kept')
  }, [])

  const handleClick = () => {
    console.log('Button clicked - should be removed')
    console.warn('Button warning - should be removed')
    console.error('Button error - should be kept')
  }

  const handleSubmit = () => {
    console.error('Form error - should be kept')
    console.info('Form submitted - should be kept')
  }

  return (
    <div>
      <h1>Remove Console Test - Selective</h1>
      <p>Only log and warn should be removed, error and info should be kept</p>
      <button onClick={handleClick}>Test Console Methods</button>
      <button onClick={handleSubmit}>Test Form Console</button>
    </div>
  )
}

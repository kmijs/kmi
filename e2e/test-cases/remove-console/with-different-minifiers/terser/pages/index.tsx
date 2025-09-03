import React, { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    console.log('This log should be removed with terser')
    console.warn('This warning should be removed with terser')
    console.error('This error should be removed with terser')
    console.info('This info should be removed with terser')
    console.debug('This debug should be removed with terser')
  }, [])

  const handleClick = () => {
    console.log('Button clicked - should be removed with terser')
    console.warn('Button warning - should be removed with terser')
  }

  const handleSubmit = () => {
    console.error('Form error - should be removed with terser')
    console.info('Form submitted - should be removed with terser')
  }

  return (
    <div>
      <h1>Remove Console Test - Terser Minifier</h1>
      <p>All console statements should be removed when using terser minifier</p>
      <button onClick={handleClick}>Test Console Log</button>
      <button onClick={handleSubmit}>Test Console Error</button>
    </div>
  )
}

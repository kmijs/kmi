import React, { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    console.log('This log should be removed with esbuild')
    console.warn('This warning should be removed with esbuild')
    console.error('This error should be removed with esbuild')
    console.info('This info should be removed with esbuild')
    console.debug('This debug should be removed with esbuild')
  }, [])

  const handleClick = () => {
    console.log('Button clicked - should be removed with esbuild')
    console.warn('Button warning - should be removed with esbuild')
  }

  const handleSubmit = () => {
    console.error('Form error - should be removed with esbuild')
    console.info('Form submitted - should be removed with esbuild')
  }

  return (
    <div>
      <h1>Remove Console Test - ESBuild Minifier</h1>
      <p>
        All console statements should be removed when using esbuild minifier
      </p>
      <button onClick={handleClick}>Test Console Log</button>
      <button onClick={handleSubmit}>Test Console Error</button>
    </div>
  )
}

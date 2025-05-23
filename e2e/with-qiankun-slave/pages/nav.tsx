import { MicroAppLink } from '@umijs/max'
import React from 'react'

export default function HomePage() {
  return (
    <MicroAppLink name="slave-app2" to="/hello">
      goto slave app2
    </MicroAppLink>
  )
}

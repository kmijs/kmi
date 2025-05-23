import { Link, MicroAppLink, Outlet } from '@umijs/max'
import React from 'react'

export default function Layouts() {
  return (
    <div>
      <h1>App2</h1>
      <ul>
        <li>
          <Link to="/">HomePage</Link>
        </li>
        <li>
          <Link to="/hello">Hello</Link>
        </li>
        <li>
          <MicroAppLink name="slave" to="/nav">
            goto slave
          </MicroAppLink>
        </li>
        <li>
          <MicroAppLink to="/home" isMaster>
            goto master
          </MicroAppLink>
        </li>
      </ul>
      <Outlet />
    </div>
  )
}

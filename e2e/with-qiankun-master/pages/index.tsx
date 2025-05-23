import { Link } from '@umijs/max'

function HomePage() {
  return (
    <div>
      <h2>Qiankun Master Page</h2>

      <div>
        <Link to="/slave/home">
          <button type="button">go-slave</button>
        </Link>
        <Link to="/nav">
          <button type="button">go-match-slave</button>
        </Link>
      </div>
    </div>
  )
}

export default HomePage

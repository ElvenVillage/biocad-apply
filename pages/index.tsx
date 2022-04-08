import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Post } from '../model/model'
import { search } from '../lib/post_service'
import Layout from '../components/root_layout'


type Props = {
  posts: Array<Post> | null,
  pages: number | null
}

const Home = ({ posts }: Props) => {
 
  return (
    <Layout>
      <Head>
        <title>Blog Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {(posts === null) ? <div>
        Постов еще нет
      </div> :
        posts.map(e => (<div key={e.timestamp}>{e.body}</div>))}
     
    </Layout>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async context => {
  let {posts, pages} = await search({
    page: 1
  })
  return {
    props: {
      posts: posts,
      pages: pages
    }
  }
}
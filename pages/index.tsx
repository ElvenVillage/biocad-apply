import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Post } from '../model/model'
import { search } from '../lib/post_service'
import SearchPage from './content/[[...params]]'


type Props = {
  posts: Array<Post> | null,
  pages: number | null
}

const Home = ({ posts, pages }: Props) => {
 
  return (
    <SearchPage category='all' page={1} pages={pages} posts={posts}></SearchPage>
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
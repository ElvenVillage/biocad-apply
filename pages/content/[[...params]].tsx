import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Layout from '../../components/root_layout'
import { search } from '../../lib/post_service'
import { Post } from '../../model/model'



type Props = {
  posts: Array<Post> | null,
  pages: number | null,
  page: number,
  category: string
}

const SearchPage = ({ posts, category }: Props) => {
  return (
    <Layout>
      <Head>
        <title>Blog Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>{category}</div>
      {((posts?.length ?? 0) > 0)? posts!.map(e => (<div key={e.timestamp}>{e.body}</div>)) : 
        <div>Ничего не найдено</div> 
       }

    </Layout>
  )
}


export default SearchPage

export const getServerSideProps: GetServerSideProps = async context => {
  const params = context.params!['params'] as string[]

  let category = ''; let page = 1
  if (params != undefined) {
    category = params[0]; page = Number(params[1])
    console.log(params)
  }
  let { posts, pages } = await search({
    page: page, category: category === 'all'? undefined : category
  })
  return {
    props: {
      posts: posts,
      pages: pages,
      page: page,
      category: category
    }
  }
}
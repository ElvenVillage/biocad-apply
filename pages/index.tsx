import type { GetServerSideProps } from 'next'
import { Post } from '../model/model'
import { getCategories, search } from '../lib/post_service'
import SearchPage from './content/[[...params]]'


type Props = {
  posts: Post[] | null,
  pages: number | null,
  categories: string[]
}

const Home = ({ posts, pages, categories }: Props) => {
 
  return (
    <SearchPage 
        category='all' 
        page={1} 
        pages={pages} 
        posts={posts} 
      
        categories={categories}/>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async context => {
  const {posts, pages} = await search({
    page: 1
  })
  const categories = await getCategories()
  return {
    props: {
      posts,
      pages,
      categories: ['all', ...categories]
    }
  }
}
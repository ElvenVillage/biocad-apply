import { GetServerSideProps } from "next"
import { loadData } from "../../lib/post_service"
import { Post } from "../../model/model"


export default function PostPage({postData} : {postData: Post | undefined}) {
    if (postData === undefined) return <div>HI</div>
    return (
        <div>
            {postData.body}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async context => {
    let { posts } = await loadData()
    const pid = context.query.pid
    const post = posts?.filter((e) => (e.id.toString() == pid))
    return {
      props: {
        postData: post![0]
      }
    }
  }
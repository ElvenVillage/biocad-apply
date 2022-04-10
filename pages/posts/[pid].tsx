import { Card, Divider, PageHeader, Space, Tag, Typography } from "antd"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { loadData } from "../../lib/post_service"
import { Post } from "../../model/model"


export default function PostPage({ postData }: { postData: Post }) {
  return (
    <div>
      <PageHeader title={postData.title} subTitle={postData.author}></PageHeader>
      <Card style={{ width: '50%' }}>
        <div>
          <Typography.Text>
            {postData.body}
          </Typography.Text>
        </div>
        <Divider />
        <Typography.Paragraph>
          {(new Date(postData.timestamp)).toLocaleDateString()}
        </Typography.Paragraph>
        <Link href={`/content/${postData.category}/1`}>
          {`Категория: ${postData.category}`}
        </Link>
      </Card>
      <div style={{ paddingLeft: '1em' }}>
        <Space>
          {postData.tags.map(tag => <Tag>{tag}</Tag>)}
        </Space>
      </div>

    </div >
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  let { posts } = await loadData()
  const pid = context.query.pid
  const post = posts?.filter((e) => (e.id.toString() == pid))

  if (post.length != 0)
    return {
      props: {
        postData: post![0]
      }
    }; else return {
      notFound: true
    }
}
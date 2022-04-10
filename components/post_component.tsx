import { Card, Col, Row, Tag, Typography } from "antd"
import Link from "next/link"
import { Post } from "../model/model"

export type ClickCallback = (tag: string) => void

const PostComponent = (post: Post, clickTag: ClickCallback) => {
    return (
        <Card title={
            <Link href={`/posts/${post.id}/`}>{post.title}</Link>
        }>
            <div>
                <Row>
                    <Col flex="20em">
                        <Typography.Paragraph>{post.author}</Typography.Paragraph>
                        <p><Link href={`/content/${post.category}/1/`}>{post.category}</Link></p>
                        <p>{(new Date(post.timestamp)).toDateString()}</p>

                    </Col>
                    <Col flex="auto">
                        <Typography.Paragraph>
                            {post.body}
                        </Typography.Paragraph>
                    </Col>
                </Row>
                Теги: {post.tags.map(e =>
                    <Tag 
                       
                        onClick={() => { clickTag(e) }}
                    >
                        {e}
                    </Tag>)}
            </div>
        </Card>
    )
}


export default PostComponent
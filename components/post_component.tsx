import { Card, Col, Row, Tag } from "antd"
import Link from "next/link"
import { Post } from "../model/model"

export type ClickCallback = (tag: string) => void

const PostComponent = (post: Post, clickTag: ClickCallback) => {
    return (
        <Card title={post.title}>
            <div>
                <Row>
                    <Col span={6}>
                        <p>{post.author}</p>
                        <p><Link href={`/content/${post.category}/1/`}>{post.category}</Link></p>
                        <p>{(new Date(post.timestamp)).toDateString()}</p>

                    </Col>
                    <Col span={18}>
                        <p>
                            {post.body}
                        </p>
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
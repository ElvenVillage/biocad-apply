import { Button, Divider, message, Select, Space, Typography } from "antd"
import Form from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import Input from "antd/lib/input"
import TextArea from "antd/lib/input/TextArea"
import Layout, { Content, Header } from "antd/lib/layout/layout"
import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { GetServerSideProps } from "next/types"
import { useState } from "react"
import { HeaderComponent } from "../components/header_component"
import { getCategories, getTags } from "../lib/post_service"

const Create = ({ categories, tags }: { categories: string[], tags: string[] }) => {

    const router = useRouter()
    const [localCategories, setLocalCategories] = useState(categories)
    const [localTags, setLocalTags] = useState(tags)
    const [catName, setCatName] = useState('')
    const [tagName, setTagName] = useState('')

    const onFinish = async ({ text, title, category, tags }: {
        text: string, title: string, category: string,
        tags: string[]
    }) => {
     
        const response = await fetch('/api/post/', {
            'method': 'POST',
            'body': new URLSearchParams({
                'title': title,
                'text': text,
                'category': category,
                'tags': JSON.stringify(tags)
            })
        })
        if (response.ok) {
            const body = await response.text();
            router.push(`/posts/${body}`)
        } else {
            message.error('Произошла ошибка')
        }
    }

    return (
        <Layout>
            <Header style={{ backgroundColor: 'white' }}>
                <HeaderComponent title="Создание поста" />
            </Header>
            <Content>
                <Divider />
                <Form name="post" onFinish={onFinish}

                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 15 }}
                    initialValues={{ remember: true }}>
                    <FormItem label="Название" name="title" rules={[
                        {
                            required: true,
                            message: 'Введите название поста'
                        }
                    ]}>
                        <Input />
                    </FormItem>
                    <FormItem label="Текст" name="text">
                        <TextArea />
                    </FormItem>
                    <FormItem label="Категория" name="category" rules={[
                        {
                            required: true,
                            message: 'Выберите категорию'
                        }
                    ]}>
                        <Select dropdownRender={menu => (
                            <>
                                {menu}
                                <Divider style={{ margin: '8px 0' }} />
                                <Space align="center" style={{ padding: '0 8px 4px' }}>
                                    <Input placeholder="Категория" value={catName}
                                        onChange={(event) => setCatName(event.currentTarget.value)} />
                                    <Typography.Link onClick={() => setLocalCategories((localCategories) => {
                                        return [...localCategories, catName]
                                    })} >Добавить</Typography.Link>
                                </Space>
                            </>
                        )}>
                            {localCategories.map(cat => <Select.Option value={cat}>{cat}</Select.Option>)}
                        </Select>
                    </FormItem>
                    <FormItem label="Теги" name="tags">
                        <Select mode="tags">
                            {localTags.map(tag => <Select.Option key={tag}>{tag}</Select.Option>)}
                        </Select>
                    </FormItem>
                    <Button htmlType="submit">Submit</Button>
                </Form>
            </Content>
        </Layout>
    )
}

export default Create

export const getServerSideProps: GetServerSideProps = async context => {
    const session = await getSession(context)
    if (session) {
        const categories = await getCategories()
        const tags = await getTags()
        return {
            props: {
                categories, tags
            }
        }
    }
    return {
        props: {},
        redirect: {
            destination: '/',
            statusCode: 403
        }
    }
}
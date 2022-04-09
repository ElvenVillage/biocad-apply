import { Button, Divider, message, Select, Space, Typography } from "antd"
import Form from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import Input from "antd/lib/input"
import TextArea from "antd/lib/input/TextArea"
import Layout, { Content, Header } from "antd/lib/layout/layout"
import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { GetServerSideProps } from "next/types"
import { FC, useState } from "react"
import { HeaderComponent } from "../components/header_component"
import { getCategories } from "../lib/post_service"

const Create = ({categories} : {categories: string[]}) => {

    const router = useRouter()
    const [localCategories, setLocalCategories] = useState(categories)
    const [catName, setCatName] = useState('')

    const onFinish = async ({text, title, category} : {text: string, title: string, category: string}) => {
        const response = await fetch('/api/post/', {
            'method': 'POST',
            'body': new URLSearchParams({
                'title': title,
                'text': text,
                'category': category,
                'tags': JSON.stringify(['Flutter']) 
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
          <Header>
              <HeaderComponent title="Создание поста"/>
          </Header>
        <Content>
            <Form name="post" onFinish={onFinish}

            labelCol={{span: 16}}
             wrapperCol={{span: 32}}
            initialValues={{remember: true}}>
                <FormItem label="Название" name="title"  rules={[
                    {
                        required: true,
                        message: 'Введите название поста'
                    }
                ]}>
                    <Input/>
                </FormItem>
                <FormItem label="Текст" name="text">
                    <TextArea/>
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
        return {
            props: {
                categories
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
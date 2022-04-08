import { Button, message } from "antd"
import Input from "antd/lib/input"
import TextArea from "antd/lib/input/TextArea"
import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { GetServerSideProps } from "next/types"
import { useState } from "react"
import RootLayout from "../components/root_layout"


const Create = () => {

    const router = useRouter()

    const [text, setText] = useState<string>("")
    const [title, setTitle] = useState("")

    const submit = async () => {
        const response = await fetch('/api/post/', {
            'method': 'POST',
            'body': new URLSearchParams({
                'title': title,
                'text': text,
                'category': 'category',
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
        <RootLayout>
        <div>
            Созданем текст
            <Input value={title} onChange={(e) => setTitle(e.target.value)}></Input>
            <TextArea value={text} onChange={(e) => setText(e.target.value)}></TextArea>
            <Button onClick={submit}>SUBMIT</Button>
        </div>
        </RootLayout>
    )
}

export default Create

export const getServerSideProps: GetServerSideProps = async context => {
    const session = await getSession(context)
    if (session) return {
        props: {}
    }
    return {
        props: {},
        redirect: {
            destination: '/',
            statusCode: 403
        }
    }
}
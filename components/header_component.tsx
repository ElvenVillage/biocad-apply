import { Button } from "antd"
import { signIn, signOut, useSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"

export const HeaderComponent = ({title}: {title: string}) => {
    const { data } = useSession()
    const router = useRouter()
    return (
        <>
        <Head>
            <title>{title}</title>
        </Head>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{title}</div>
                <div style={{ display: 'flex' }}>
                    {data ? 
                    (<>
                        <div><Button onClick={() => router.push('/create/')}>Создать пост</Button></div>
                        <div><Button onClick={() => signOut()}>Выйти</Button></div>
                    </>) : 
                    (<>
                        <div><Button onClick={() => signIn()}>Войти</Button></div>
                    </>)
                    }

                </div>
            </div>
        </>
    )
}
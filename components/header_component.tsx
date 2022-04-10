import { Button, Space, Typography } from "antd"
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
                <div style={{width: '40m', paddingTop: '10px'}}>
                    <Typography.Title>{title}</Typography.Title>
                </div>
                <div style={{ display: 'flex' }}>
                    {data ? 
                    (<Space size='large'>
                        <div><Typography.Link onClick={() => router.push('/create/')}>Создать пост</Typography.Link>  </div>
                        <div><Typography.Link onClick={() => signOut()}>Выйти</Typography.Link></div>
                    </Space>) : 
                    (<>
                        <div><Typography.Link onClick={() => signIn()}>Войти</Typography.Link></div>
                    </>)
                    }

                </div>
            </div>
        </>
    )
}
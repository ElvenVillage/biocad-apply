import { Button, Layout, Space } from "antd"
import { Content, Footer, Header } from "antd/lib/layout/layout"
import { signIn, signOut, useSession } from "next-auth/react"
import { LoginOutlined, LogoutOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { useRouter } from "next/router"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { data } = useSession()
  const router = useRouter()

  return (<>
    <Layout>
      <Header style={{ backgroundColor: 'white', alignItems: "end" }}>
        <Space>
          {(data) ? <div>
            <Button type="primary" onClick={() => router.push('/create')}>
              Создать пост
              <PlusCircleOutlined />
            </Button>
            <Button type="primary" onClick={() => signOut()}>
              Выйти
              <LogoutOutlined />
            </Button>

          </div> : <div>
            <Button onClick={() => signIn()} type="default" loading={false}>
              Войти<LoginOutlined />
              </Button>
          </div>
          }
        </Space>
      </Header>
      <Content>{children}</Content>
      <Footer>Footer</Footer>
    </Layout>

  </>)
}

export default RootLayout


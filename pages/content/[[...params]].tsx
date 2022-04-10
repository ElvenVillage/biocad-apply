import { Layout, Menu, Pagination, Space, Tag } from "antd";
import Search from "antd/lib/input/Search";
import { Content, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HeaderComponent } from "../../components/header_component";
import PostComponent from "../../components/post_component";
import { getCategories, search } from "../../lib/post_service";
import { Post } from "../../model/model";

type Props = {
  posts: Post[] | null;
  pages: number | null;
  page: number;
  category: string;
  categories: string[];
};

const SearchPage = ({
  posts,
  category,
  page,
  pages,
  categories,
}: Props) => {
  const [tags, setTags] = useState<string[]>([]);

  const [localQuery, setLocalQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [localPosts, setLocalPosts] = useState<Post[] | null>([]);
  const [localPages, setLocalPages] = useState(0);
  const [localPage, setLocalPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    setTags([])
    setLocalQuery('')
    setSearchQuery('')
  }, [category])

  useEffect(() => {
    const fetchPosts = async () => {
      if (tags.length == 0 && searchQuery.length === 0) return;
      const result = await fetch("/api/search/", {
        method: "POST",
        body: new URLSearchParams({
          category: category,
          page: localPage.toString(),
          tags: JSON.stringify(tags),
          query: searchQuery,
        }),
      });
      const text = await result.json();
      setLocalPosts(text["posts"]);
      setLocalPages(text["pages"]);
    };
    fetchPosts();
  }, [tags, localPage, searchQuery]);


  return (
    <Layout>
      <Header style={{ backgroundColor: 'white' }}>
        <HeaderComponent title={category} />
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Layout style={{ padding: '24px 0' }} hasSider>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
          >
            <Search
              value={localQuery}
              onChange={(event) => setLocalQuery(event.currentTarget.value)}
              onSearch={(event) => {
                setLocalPage(1);
                setSearchQuery(event);
              }}
            />
            <Menu
              mode="inline"
              onClick={(e) => {
                router.push(`/content/${e.key}/1`)
              }}
              style={{ height: '100%' }}
              defaultSelectedKeys={[category]}
            >
              {categories.map((cat) => (
                <Menu.Item key={cat}>{cat}</Menu.Item>
              ))}
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Space>
              {tags.map((tag) => (
                <Tag
                  closable
                  onClose={(event) => {
                    event.preventDefault();
                    setLocalPage(1);
                    setTags((prevTags) => prevTags.filter((e) => e != tag));
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
            {((tags.length === 0 && searchQuery.length === 0) ? posts : localPosts)?.map((post) =>
              PostComponent(post, (tag) => {
                if (tags.includes(tag)) return;
                setLocalPage(1);
                setTags((prevTags) => [...prevTags, tag]);
              })
            )}
            <Pagination
              total={
                (tags.length === 0 && searchQuery.length === 0) ? (pages ?? 0) * 10 : (localPages ?? 0) * 10
              }
              current={(tags.length === 0 && searchQuery.length === 0) ? page : localPage}
              onChange={(page) => {
                if (tags.length == 0) {

                  router.push(`/content/${category}/${page}`);

                } else {
                  setLocalPage(page);
                }
              }}
            />
          </Content>
        </Layout>
      </Content>

    </Layout>
  )
};

export default SearchPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params!["params"] as string[];


  let category = "";
  category = params[0];
  let page = Number(params[1]);


  let { posts, pages } = await search({
    page: page,
    category: category === "all" ? undefined : category,
    query: '',
  });

  let categories = await getCategories();

  return {
    props: {
      posts: posts.map(post => {
        const temp = Object.assign({}, post)
        if (temp.body.length > 40) {
          temp.body = temp.body.slice(0, 40) + '...'
        }
        return temp
      }),
      pages,
      page,
      category,
      categories: ['all', ...categories],
    },
  };
};

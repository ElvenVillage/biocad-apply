export type Post = {
    id: string
    timestamp: number,
    body: string,
    author: string,
    title: string,
    category: string,
    tags: string[]
}

export type DataStorage = {
    posts: Array<Post>,
    categories: Array<string>,
    tags: Array<string>
}
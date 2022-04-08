import * as fs from 'fs/promises'
import { DataStorage, Post } from '../model/model';


const FILE_NAME = "post.json"

declare global {
    var cached: Array<Post> | null
    var categories: Array<string>
    var tags: Array<string>
}

globalThis.cached = null; globalThis.categories = []; globalThis.tags = []

export async function loadData(): Promise<DataStorage> {
    if (globalThis.cached === null) {
        try {
            await fs.access(FILE_NAME);
            console.log('read file')
            const fileBuffer = await fs.readFile(FILE_NAME)

            const fileContent: Array<Post> = JSON.parse(fileBuffer.toString())
            globalThis.cached = fileContent

            fileContent.forEach((post) => {
                if (!globalThis.categories.includes(post.category))
                    globalThis.categories.push(post.category)
                post.tags.forEach((tag) => {
                    if (!globalThis.tags.includes(tag))
                        globalThis.tags.push(tag)
                })
            })

        } catch {
            console.log("write file")
            await fs.writeFile(FILE_NAME, JSON.stringify([]))
            globalThis.cached = []
        }

    }
    console.log('cached')
    return {
        posts: globalThis.cached,
        categories: globalThis.categories,
        tags: globalThis.tags
    }
}

export async function writePost(post: Post) {
    console.log('writing post')
    if (globalThis.cached === null) await loadData()
    globalThis.cached!.push(post)
    console.log('wrrite')

    post.tags.forEach((tag) => {
        if (!globalThis.tags.includes(tag))
            globalThis.tags.push(tag)
    })

    if (!globalThis.categories.includes(post.category))
        globalThis.categories.push(post.category)

    return await fs.writeFile(FILE_NAME, JSON.stringify(cached))
}

export async function search({query = '', category = '', tags = [], page = 1}) {
    if (globalThis.cached === null) await loadData()
    var posts = globalThis.cached!.filter((post) => {
        return ((category.length === 0 || post.category === category) &&
            (post.body.includes(query) || post.title.includes(query) || query.length === 0))
    }
    )
    for (let tag in tags) {
        posts = posts.filter((post) => post.tags.includes(tag))
    }
    const pages = Math.ceil(posts.length / 10)
    posts = posts.slice(10*(page-1), 10*page)
    return {pages, posts}
}
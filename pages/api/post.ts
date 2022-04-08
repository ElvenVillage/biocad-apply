import { randomUUID } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { writePost } from '../../lib/post_service';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {

    const session = await getSession({ req })

    if (session?.user) {

      const text = req.body['text']
      const title = req.body['title']
      const uuid = randomUUID()
      const category = req.body['category']
      const tags = JSON.parse(req.body['tags'])

      await writePost({ 
        timestamp: Date.now(), 
        body: text, 
        id: uuid, 
        title: title, 
        category: category, 
        tags: tags, 
        author: session!.user!.email! })

      res.status(200).send(uuid)
    } else {
      res.status(403).send('unauthorized')
    }
  }
}

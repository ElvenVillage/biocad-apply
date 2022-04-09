import type { NextApiRequest, NextApiResponse } from 'next'
import { search } from '../../lib/post_service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'POST') {
      const searchResult = await search({
          query: req.body['query'],
          tags: JSON.parse(req.body['tags']),
          category: req.body['category'],
          page: Number(req.body['page'])
      })
      
      res.status(200).json(JSON.stringify(searchResult))
  }
}

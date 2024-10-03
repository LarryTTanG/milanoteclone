import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const boards = await kv.get('boards') || [];
    res.status(200).json(boards);
  } else if (req.method === 'POST') {
    const newBoard = req.body;
    const boards = await kv.get('boards') || [];
    newBoard.id = Date.now().toString(); // 简单的 ID 生成
    boards.push(newBoard);
    await kv.set('boards', boards);
    res.status(201).json(newBoard);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
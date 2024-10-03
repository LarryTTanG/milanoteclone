import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const updatedBoard = req.body;
    const boards = await kv.get('boards') || [];
    const index = boards.findIndex(board => board.id === id);
    if (index !== -1) {
      boards[index] = updatedBoard;
      await kv.set('boards', boards);
      res.status(200).json(updatedBoard);
    } else {
      res.status(404).json({ message: 'Board not found' });
    }
  } else if (req.method === 'DELETE') {
    const boards = await kv.get('boards') || [];
    const updatedBoards = boards.filter(board => board.id !== id);
    await kv.set('boards', updatedBoards);
    res.status(200).json({ message: 'Board deleted' });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
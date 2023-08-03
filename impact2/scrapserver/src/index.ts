import { createServer } from 'node:http';

const port = Number(process.env.API_PORT) || 4000

const server = createServer({

})

server.listen(port, () => {
  console.info(`server fired up 🚀 on port ${port} or at http://localhost:${port}/graphql`)
})

// console.log('Hey there! 👋');

import { rest } from 'msw';
import fields from '../json/fields.json'
import searchResults from '../json/searchResult.json'

const users = [
    { id: 1, username: 'john', password: '1' },
    { id: 2, username: 'jane', password: '1' },
    { id: 3, username: 'testtest1', password: 'testtest'}
  ];

// handler는 여기 있고 각 부분에서 fetch로 요청 확인

export const apiHandlers = [
    rest.post('/api/login', (req, res, ctx) => {
        const { username, password } = req.body; // 요청의 body에 있는 id와 pw

        const user = users.find(
            (user) => user.username === username && user.password === password
        );

        if (user) {
            return res(ctx.status(200), ctx.json({ isFirst: true }))
        } else {
            return res(ctx.status(401), ctx.json( { message: 'Invalid User'}))
        }
    }),

    rest.get('/api/userprofile/:username', (req, res, ctx) => {
      const { username } = req.params;
      // const payload = {
      //   username,
      //   fields// res.fields로 고치기
      // }
      return res(ctx.status(200), ctx.json(fields));
    }),

    rest.post('/api/userprofile', (req, res, ctx) => {
      const { username, studyfield, keywords } = req.body;

      if (!username) {
        console.log('username error')
        return res(ctx.status(400), ctx.json({message: 'Bad Request - username'}))
      }
      if (!studyfield) {
        console.log('field error')
        return res(ctx.status(400), ctx.json({message: 'Bad Request - studyfield'}))
      }
      if (!keywords || keywords.length == 0) {
        console.log('keywords error')
        return res(ctx.status(400), ctx.json({message: 'Bad Request - keywords'}))
      }

      const user = users.find( (user) => user.username === username);
      if (!user){
        return res(ctx.status(401), ctx.json({message: 'Unauthorized'}))
      }

      return res(ctx.status(200), ctx.json({username, studyfield, keywords, message: 'Success'}));
    }),

    rest.get('/api/homesearch', (req, res, ctx) => {
      console.log(req)
      return res(ctx.status(200), ctx.json(searchResults));
    }),

    rest.post('/api/paperlikeonoff', (req, res, ctx) => {
      const {username, paperId, onoff} = req.body;
      return res(ctx.status(200), ctx.json({username, paperId, onoff}))
    })
]


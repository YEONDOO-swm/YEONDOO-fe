import { rest } from 'msw';
import fields from '../json/fields.json'

const users = [
    { id: 1, username: 'john', password: '1' },
    { id: 2, username: 'jane', password: '1' },
  ];

// handler는 여기 있고 각 부분에서 fetch로 요청 확인

export const apiHandlers = [
    rest.post('/api/login', (req, res, ctx) => {
        const { username, password } = req.body; // 요청의 body에 있는 id와 pw

        const user = users.find(
            (user) => user.username === username && user.password === password
        );

        if (user) {
            return res(ctx.status(200), ctx.json({username, password, message: 'Success'}))
        } else {
            return res(ctx.status(401), ctx.json( { message: 'Invalid User'}))
        }
    }),

    rest.get('/api/userprofile/:username', (req, res, ctx) => {
      const { username } = req.params;
      const payload = {
        username,
        fields: fields
      }
      return res(ctx.status(200), ctx.json(payload));
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
    })
]


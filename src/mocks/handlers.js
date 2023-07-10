import { rest } from 'msw';

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
            return res(ctx.status(200), ctx.json({message: '로그인 성공'}))
        } else {
            return res(ctx.status(401),
            ctx.json( { message: '사용자 인증에 실패했습니다. '}))
        }
        // return res(
        //     ctx.status(200),
        //     ctx.delay(4000),
        //     ctx.json({

        //     })

        // )
    })
]


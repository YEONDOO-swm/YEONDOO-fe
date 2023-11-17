# YEONDOO (연두)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)
[![Build Status](https://github.com/YEONDOO-swm/YEONDOO-fe/actions/workflows/main.yml/badge.svg)](https://github.com/YEONDOO-swm/YEONDOO-fe/actions)

## 🔗 [Yeondoo 서비스 바로가기](https://yeondoo.net)


## Introduction
<p align="center">
  <img width="500" alt="image" src="./src/asset/mainLanding.png" title="Yeondoo 워크북 공간 및 채팅 서비스">
  <div style="text-align: center; margin-top: 10px">
    연두는 연구를 도와주는 웹 서비스입니다. <br/>
    연두 서비스는 논문에 대한 노팅 및 하이라이팅 기능을 제공하는 워크북 공간이 있습니다. 뿐만 아니라, 채팅을 통해 논문을 깊이 이해할 수 있도록 도와줍니다.
  </div>
</p>

## Main feature

<table>
  <tr>
    <td valign="top">
      <img width="1000" alt="image" src="./src/asset/workspaces.gif">
    </td>
    <td valign="center">
      <div>
        개인 워크스페이스를 생성하여 자신만의 연구 공간을 관리할 수 있습니다.
      </div>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td valign="top">
      <img width="600" alt="image" src="./src/asset/chatLading.gif">
    </td>
    <td valign="center">
      <div>
        논문에 대해 궁금한 내용을 모두 질문할 수 있습니다. 논문 전체 컨텍스트를 임베딩하였기 때문에, 논문에 대한 질문을 정확하게 응답하여 줍니다.
      </div>
    </td>
  </tr>
</table>

## Tech Stacks
<p align="center">
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <br/>
  <img src="https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=MUI&logoColor=white">
  <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white">
  <img src="https://img.shields.io/badge/React Query-FF4154?style=for-the-badge&logo=React Query&logoColor=white">
  <br/><br/>
  <img src="https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=Sentry&logoColor=white">
  <img src="https://img.shields.io/badge/Amplitude-1904DA?style=for-the-badge&logo=&logoColor=white">
  <br/><br/>
  <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=Amazon AWS&logoColor=white">
  <img src="https://img.shields.io/badge/AWS S3-569A31?style=for-the-badge&logo=Amazon S3&logoColor=white">
  <img src="https://img.shields.io/badge/AWS Route 53-8C4FFF?style=for-the-badge&logo=Amazon Route 53&logoColor=white">
  <br/><br/>
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white">
  <img src="https://img.shields.io/badge/GitHub Actions-2088FF?style=for-the-badge&logo=GitHub Actions&logoColor=white">
  <br/>
  <img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white">
  <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white">





</p>

## How to start
### Clone
```
git clone https://github.com/YEONDOO-swm/YEONDOO-fe.git --recursive
```

Install the application dependencies by running:

```sh
npm install
```

### Set .env
```
VITE_REACT_APP_LOCAL_SERVER={Swagger api server}

VITE_READER_URL={zotero/pdf-worker url}

VITE_AMPLITUDE_ID={amplitude Id}

VITE_GOOGLE_CLIENT_ID={google client Id}
```


### Development

Start the application in development mode by running:

```sh
npm run dev
```

### Production

Build the application in production mode by running:

```sh
npm run build
```

## Members
|      임가윤       |          이석우         |       정찬호         |                                                                                                               
| :------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | 
|   <img width="160px" src="https://avatars.githubusercontent.com/u/81891345?v=4" /> <br/> [@coddingyun](https://github.com/coddingyun)   |                       <img width="160px" src="https://avatars.githubusercontent.com/u/83485983?v=4" />  <br/> [@ProgrammingLee](https://github.com/IHateChem)  |                   <img width="160px" src="https://avatars.githubusercontent.com/u/62923434?s=64&v=4"/> <br/> [@chjung99](https://github.com/chjung99)   |
|   Frontend, Team Lead   |   Backend  | AI |

## Contributors
### Software Maestro
- 한국산업연합회 주관
### Zotero
#### [zotero/pdf-worker](https://github.com/zotero/pdf-worker) 
- 해당 레포지토리에서 서브 모듈로 사용
#### [zotero/reader](https://github.com/zotero/reader) 
- [개인 레포지토리](https://github.com/coddingyun/yeondoo-pdf)에서 관리
- 서브도메인으로 Yeondoo와 통신

## License
연두는 GNU AFFERO GENERAL PUBLIC LICENSE를 따릅니다. 자세한 내용은 [LICENSE](https://github.com/YEONDOO-swm/YEONDOO-fe/blob/main/LICENSE)파일을 참고해주세요.



# [110-1] Web Programming Final (Group 13)  暗棋對戰系統

## [服務簡介]
一款雙人連線對戰的暗棋遊戲，可在註冊&登入後創建房間、加入房間(滿足房間為兩人)後開始進行一般規則的暗棋對戰。

## [安裝]
* `yarn` 或 `npm install`
* 建議使用 npm lts 版本 (16, 14)，其餘版本則待測試 (deploy 的版本為 16.13.2)

## [設定]
* 後端: 按照 `backend/.env.defaults` 的格式 複製一份 `backend/.env` 填入 mongodb 的連線網址以及 jwt-token 所使用的 secret key，port 若不填則預設是開在 4000
* 前端：若架設連線的環境不是在 localhost 或者後端不是開在 port 4000 的話，修改 `frontend/src/api.js` 以及 `frontend/src/useWebsocket.js` 這兩個檔案中定義的連接後端的網址 （與協定，如果要使用 TLS 加密的話）
 
## [執行]
* 前端: `yarn start` 或 `npm start`
* 後端: `yarn server` 或 `npm run server`

## [框架]
前端：React.js, axios
後端：TypeScript, MVC
資料庫：mongodb
前後端連接：http api, web socket

## [第三方套件/程式碼]
前端：ant-design

## [詳細功能]
首先可選擇註冊或是登入，請注意註冊的username不可重複，註冊後將被導回主頁面，隨後可進行登入。登入驗證方式是使用 jwt token 來做驗證，並且登入成功後會紀錄在瀏覽器中讓下次開啟時會自動登入。
接下來就可選擇創建房間或加入房間，創建新房間後將會直接進入房間等待頁面。若選加入房間則會移動到房間列表可選擇欲加入的房間。每間房間人數最多為兩人，加入房間者可以在頁面中的各房間找到Room ID或是username相符的房間，而房主在房間人數滿足兩人時即可開始遊戲。
開始遊戲後進入棋盤頁面，其中會顯示當前是哪兩位玩家正在對戰、輪到哪位玩家的回合，以及哪位玩家是哪個顏色。每當輪到玩家移動時，玩家可以先點選一個可以移動的棋子，並再點選第二下作為目的地（翻棋則是點相同位置兩下）。任何一方的無法移動時時即結束遊戲無法移動的一方敗。若雙方僵持 50 步沒有吃子或翻棋則視為平手。
確認結束遊戲後即重新導向回創建或加入房間頁面。

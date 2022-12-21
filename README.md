# brush-votes
nodejs写的刷票程序，包括爬取免费代理ip。

## 使用

1. 获取代理ip
  - 通过第三方获取，[https://schttp.shanchendaili.com/](https://schttp.shanchendaili.com/)（实名认证送3000免费ip，亲测有效）
  - 调用 `await getFreeIps()` 爬取免费代理ip，免费代理ip网站：[https://www.kuaidaili.com/free/inha/](https://www.kuaidaili.com/free/inha/)（ip不稳定，能用的很少）
2. 替换 `index.js` -> `targetUri` 为你要访问的地址，也就是投票接口
3. 执行 `npm run start`

> 如果使用爬取的免费代理ip，请在 `index.js` 里以 `bootstrap(await getFreeIps())` 这种方式调用主函数，详情参加代码。

## 许可

[MIT](./LICENSE)

Copyright (c) 2022 - Boda Lü
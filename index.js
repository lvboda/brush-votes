import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';
import abortController from 'abort-controller';

import getFreeIps from './getFreeIps.js';

// 获取代理ip接口
const getIpsApi = "https://sch.shanchendaili.com/api.html?action=get_ip&key=HU5307096186424339953jU2&time=10&count=2&protocol=http&type=json&only=1";

// 要访问的目标地址
const targetUri = "https://www.baidu.com";

let recordIndex = 1;
const currentCallErrorIps = [];

// 获取代理ip列表
async function getIps() {
    const res = await (await fetch(getIpsApi, { method: 'GET'})).json();
    if (String(res.status) !== "0") {
        console.log(`[ error ]: get ips error, status: ${res.status}, msg: ${res.info}`);
        return [];
    }
    return res.list.map((item) => `http://${item.sever}:${item.port}`);
}

// 访问目标地址
async function call(ip) {
    // 设置超时
    const controller = new (global.AbortController || abortController)();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 10000);
    // 访问目标地址
    try {
        await fetch(targetUri, {
            method: 'GET',
            signal: controller.signal,
            agent: new HttpsProxyAgent(ip),
        });
        console.log(`[ finish ]: ip: ${ip}, index: ${recordIndex++}.`);
    } catch (error) {
        currentCallErrorIps.push(ip);
        console.log(`[ error ]: ip: ${ip}, error: ${error}, index: ${recordIndex++}.`);
    } finally {
        clearTimeout(timeout);
    }
}

async function bootstrap(ips, loopFlag = true) {
    !ips && (ips = await getIps());

    console.log(`[ start ]: run script, ips: \n`);
    console.log(JSON.stringify(ips), "\n");

    for (const ip of ips) {
        await call(ip);
    }

    loopFlag && currentCallErrorIps.length && (await bootstrap(currentCallErrorIps, false));

    console.log("[ end ]: finished all.");
}

// bootstrap(await getFreeIps());

bootstrap();
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const freeIpsUrl = "https://www.kuaidaili.com/free/inha/";

async function getFreeIps(page = "1") {
    const html = await (await fetch(freeIpsUrl + page)).text();
    const $ = cheerio.load(html);
    const ipList = [];
    $('tr').each((_, item) => {
        const type = $(item).find(`td[data-title="类型"]`).text();
        if (type === "HTTP" || type === "HTTPS") {
            ipList.push(`http://${$(item).find(`td[data-title="IP"]`).text()}:${$(item).find(`td[data-title="PORT"]`).text()}`);
        }
    });

    return ipList;
}

let currentPage = 0;
export default async function getFreeIpsByNum(num = 100) {
    let list = [];

    const page = Math.ceil(num / 15);
    for (let i = 1; i <= page; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        list.push(...await getFreeIps(String(currentPage + i)));
    }
    currentPage += page;
    list = Array.from(new Set(list));

    if (list.length < num) list.push(...await getFreeIpsByNum(num - list.length));

    return list;
}
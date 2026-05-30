import YahooFinance from "yahoo-finance2";

const test = new YahooFinance();

const history = await test.chart('GOOG', {
    period1: '2000-01-01',
    period2: '2024-01-01',
    interval: '1mo',
})

console.log(history);

// const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

// const history2 = await test.chart('GOOG', {
//     period1: oneDayAgo,
//     period2: new Date(),
//     interval: '1h',
// })

// console.log(history2);
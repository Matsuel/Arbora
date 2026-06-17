import YahooFinance from "yahoo-finance2";

const test = new YahooFinance();

const history = await test.chart('AMZN', {
    period1: new Date(0),
})

console.log(history);

// const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

// const history2 = await test.chart('GOOG', {
//     period1: oneDayAgo,
//     period2: new Date(),
//     interval: '1h',
// })

// console.log(history2);
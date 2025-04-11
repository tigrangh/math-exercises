let tasks = [];

function trunc(fraction) {
    for (let i = 2; i <= Math.min(fraction.numerator, fraction.denominator); ++i) {
        if (fraction.numerator % i == 0 && fraction.denominator % i == 0) {
            fraction.numerator = Math.floor(fraction.numerator / i);
            fraction.denominator = Math.floor(fraction.denominator / i);
            i = 1;
        }
    }

    return fraction;
}

function randomFraction() {
    let r = [
        Math.floor(Math.random() * 15),
        Math.floor(Math.random() * 15)
    ];

    return {
        numerator: 1 + r[0],
        denominator: 1 + r[0] + 1 + r[1]
    };
}

function generate() {
    for (let index = 0; index != 16; ++index) {

        let task = {
            fraction1: trunc(randomFraction()),
            fraction2: trunc(randomFraction()),
            fraction3: trunc(randomFraction()),
            sum: true
        };

        if (task.fraction1.numerator * task.fraction2.denominator - task.fraction2.numerator * task.fraction1.denominator < 0) {
            let t = task.fraction2;
            task.fraction2 = task.fraction1;
            task.fraction1 = t;
        }

        if (Math.floor(Math.random() * 15) % 2 == 0) {
            task.sum = false;
        }

        if (task.sum) {
            task.fraction3.numerator = task.fraction1.numerator * task.fraction2.denominator + task.fraction2.numerator * task.fraction1.denominator;
        } else {
            task.fraction3.numerator = task.fraction1.numerator * task.fraction2.denominator - task.fraction2.numerator * task.fraction1.denominator;
        }

        task.fraction3.denominator = task.fraction1.denominator * task.fraction2.denominator;
        task.fraction3 = trunc(task.fraction3);

        tasks.push(task);
    }

    let i = 0;
    for (let task of tasks) {
        ++i;

        document.getElementById(`problem${i % 2}`).innerHTML += divTask(task, false);
        document.getElementById(`solution${i % 2}`).innerHTML += divTask(task, true);
    }
}

function divTask(task, solve) {
    return `<div style="width:100mm">
    <table>
        <tr>
            <td>
                <table cellspacing="0" cellpadding="0">${drawFraction(task.fraction1, false)}</table>
            </td>
            <td>${task.sum ? "+" : "-"}</td>
            <td>
                <table cellspacing="0" cellpadding="0">${drawFraction(task.fraction2, false)}</table>
            </td>
            <td>=</td>
            <td>
                <table cellspacing="0" cellpadding="0">${drawFraction(task.fraction3, solve == false)}</table>
            </td>
        </tr>
    <table></div>`;
}

function drawFraction(fraction, blank) {
    let fullUpper = "";
    let fullLower = "";

    let n = fraction.numerator;
    let d = fraction.denominator;

    while (n != 0 || d != 0) {
        let style = "min-width: 1em; height: 1.5em;";
        if (blank)
            style = `${style}; border: 1px dotted black`;
        if (n != 0) {
            fullUpper = `<td style="${style}; border-bottom-style: solid; border-bottom-width: 1px">${blank ? " " : n % 10}</td>${fullUpper}`;

            n = Math.floor(n / 10);
        } else {
            fullUpper = `<td style="${style}; border-bottom-style: solid; border-bottom-width: 1px"></td>${fullUpper}`;
        }

        if (d != 0) {
            fullLower = `<td style="${style}">${blank ? " " : d % 10}</td>${fullLower}`;

            d = Math.floor(d / 10);
        } else {
            fullLower = `<td style="${style}"> </td>${fullLower}`;
        }
    }

    return `<tr>${fullUpper}</tr><tr>${fullLower}</tr>`
}



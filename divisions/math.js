let tasks = [];


function generate() {
    for (let index = 0; index != 12; ++index) {
        let a = 500 + Math.floor(Math.random() * 1000);
        let b = 20 + Math.floor(Math.random() * 120);

        tasks.push({
            divident: a * b,
            divisor: b,
            quotient: a
        });
    }
    // document.getElementById("numbers").innerHTML = tasks.map(item => `<div>${item.divident}, ${item.divisor}, ${item.quotient}</div>`).reduce((full, item) => `${full}${item}<br>`, "");

    let i = 0;
    for (let task of tasks) {
        ++i;
        i = i % 2;

        document.getElementById("solution" + i).innerHTML += divTask(task, true, expand);
        document.getElementById("problem" + i).innerHTML += divTask(task, false, expand);
    }
}

function expand(task, solve) {
    const string1 = `_${task.divident}||${task.divisor}?`;
    const header = '?'.repeat(("" + task.divident + task.divisor).length + 2);

    let full = "";
    full = convertToRow(header);
    full += convertToRow(string1);

    let carry = 0;
    let offset = -1;
    let drawQuotient = true;
    for (let index = 0; index < countDigits(task.divident); ++index) {
        if (firstDigits(task.divident, index + 1) < task.divisor)
        {
            carry = firstDigits(task.divident, index + 1);
            continue;
        }
        ++offset;

        const currentDivdent = carry * 10 + nthDigit(task.divident, index);
        const sub = nthDigit(task.quotient, offset) * task.divisor;

        let stringIndex1 = ' '.repeat(index + 2 - countDigits(sub)) + (solve ? sub : '?'.repeat(countDigits(sub)));
        if (drawQuotient)
        {
            stringIndex1 += ' '.repeat(countDigits(task.divident) - index - 1) + '|' + (solve ? task.quotient : '?'.repeat(countDigits(task.quotient)));
        }
        full += convertToRow(stringIndex1);

        carry = currentDivdent - nthDigit(task.quotient, offset) * task.divisor;
        const minus = (solve && index + 1 !== countDigits(task.divident)) ? "_" : "?";
        let stringIndex2 = ' '.repeat(1 + index - countDigits(carry)) + minus + (solve ? carry : '?'.repeat(countDigits(carry)));
        if (countDigits(task.divident) > index + 1)
            stringIndex2 += (solve ? nthDigit(task.divident, index + 1) : '?');

        full += convertToRow(stringIndex2);

        drawQuotient = false;
    }
    
    return full;
}

function countDigits(number) {
    let d = 0;

    do {
        number = Math.floor(number / 10);
        ++d;
    } while (number > 0)

    return d;
}

function lastDigits(number, count)
{
    return number % (10 ** count);
}

function firstDigits(number, count)
{
    return Math.floor(number / (10 ** (countDigits(number) - count)));
}

function subDigits(number, startAt, count)
{
    const tailLength = countDigits(number) - startAt;
    const tail = lastDigits(number, tailLength);
    const tailDigits = countDigits(tail);
    const tailShortage = tailLength - tailDigits;

    return firstDigits(tail, count - tailShortage);
}

function nthDigit(number, n)
{
    const tailLength = countDigits(number) - n;
    const tail = lastDigits(number, tailLength);
    const tailDigits = countDigits(tail);
    const tailShortage = tailLength - tailDigits;

    if (tailShortage == 0)
        return firstDigits(tail, 1);
    return 0;
}

function divTask(task, solve, expand) {
    return `<div><table cellspacing="0" cellpadding="0">${expand(task, solve)}</table></div><div style="width:20mm"><br></div>`;
}

function convertToRow(string) {
    let styleLeft = false;
    let styleBottom = false;

    let full = "";

    for (let ch of string.split("")) {
        if (ch == '|' && styleLeft === false) {
            styleLeft = true;
        } else if (ch == '|') {
            styleBottom = true;
        } else {
            let style = "";
            if (styleLeft)
                style = `${style}; border-left-style: solid; border-left-width: 4px`;
            if (styleBottom)
                style = `${style}; border-bottom-style: solid; border-bottom-width: 4px`;

            if (ch === ' ')
                style = "border-left-style: none; border-bottom-style: none";
            else if (ch === '?')
                ch = ' ';

            full = `${full}<td style="${style}">${ch}</td>`;

            styleLeft = false;
        }
    }

    return `<tr>${full}</tr>`;
}

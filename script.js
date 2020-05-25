class Calculator {
    constructor(prevOperandTextElement, curOperandTextElement) {
        this.prevOperandTextElement = prevOperandTextElement;
        this.curOperandTextElement = curOperandTextElement;
        this.readyToReset = false;
        this.clear();
    }

    /* clear output - set operands to empty string, operand to undefined */
    clear() {
        this.curOperand = '';
        this.prevOperand = '';
        this.operation = undefined;
    }

    /* delete a single digit */
    delete() {
        this.curOperand = this.curOperand.toString().slice(0, -1);
    }

    /* add digit to the output as user clicks */
    appendNumber(number) {
        if (number === '.' && this.curOperand.includes('.')) return;
        this.curOperand = this.curOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.curOperand === '') return;
        if (this.curOperand !== '' && this.prevOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.prevOperand = this.curOperand;
        this.curOperand = '';
    }

    compute() {
        const prev = parseFloat(this.prevOperand);
        const cur = parseFloat(this.curOperand);
        if (isNaN(prev) || isNaN(cur)) return;
        switch (this.operation) {
            case '+':
                this.curOperand = prev + cur;
                break;
            case '-':
                this.curOperand = prev - cur;
                break;
            case '×':
                this.curOperand = prev * cur;
                break;
            case '÷':
                if (cur !== 0) {
                    this.curOperand = prev / cur;
                } else {
                    this.clear();
                    window.alert("Error - Cannot divide by zero.")
                }
                break; 
            default:
                return;
        }
        this.readyToReset = true;
        this.operation = undefined;
        this.prevOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        const floatNumber = parseFloat(number);
        var integerDisplay;
        if(isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            })
        }
        if(decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.curOperandTextElement.innerText = this.getDisplayNumber(this.curOperand);

        /* display prev operand + operand */
        if (this.operation != null) {
            this.prevOperandTextElement.innerText = `${this.getDisplayNumber(this.prevOperand)} ${this.operation}`;
        } else {
            this.prevOperandTextElement.innerText ='';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number');
const operationButtons = document.querySelectorAll('[data-operation');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-allClear]');
const prevOperandTextElement = document.querySelector('[data-prevOperand]');
const curOperandTextElement = document.querySelector('[data-curOperand]');

/* create calculator */
const calculator = new Calculator(prevOperandTextElement, curOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if(calculator.prevOperand === '' && calculator.curOperand !== '' && calculator.readyToReset) {
            calculator.curOperand = '';
            calculator.readyToReset = false;
        }
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
})

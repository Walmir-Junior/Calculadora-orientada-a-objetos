class CalcController{
    #displayCalcEl;
    #dateEl;
    #timeEl;
    #currentDate;
    #locale;
    #operation;
    #isPercentageOperation;
    #lastOperator;
    #lastNumber;

    constructor(displayCalcEl, currentDate, dateEl, timeEl, locale, operation, isPercentageOperation, lastOperator, lastNumber){
        this.#lastOperator = "";
        this.#lastNumber = "";
        this.#operation = [];
        this.#locale = "pt-BR";
        this.#displayCalcEl = document.querySelector("#display");
        this.#dateEl = document.querySelector("#data");
        this.#timeEl = document.querySelector("#hora");
        this.#currentDate;
        this.#isPercentageOperation = false;
        this.initialize();
        this.initButtonsEvents();
    }

    initialize(){
        
        this.setDisplayDateTime();

        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000);

        this.showLastNumberOnDisplay();
    }

    addEventListenerAll(element, events, fn){
        events.split(" ").forEach(event => {
            element.addEventListener(event, fn);
        })
    }

    clearAll(){
        this.#operation = [];
        this.#lastNumber = "";
        this.#lastOperator = "";
        this.showLastNumberOnDisplay();
    }

    cancelEntry(){

        this.#operation.pop();
        this.showLastNumberOnDisplay();
    }

    setError(){
    this.displayCalc = "ERROR";
    }

    getLastOperation(){

        return this.#operation[this.#operation.length - 1];
    }

    setLastOperation(value){

        this.#operation[this.#operation.length - 1] = value
    }

    isOperator(value){

        return (["+", "-", "*", "%", "/"].indexOf(value) > -1);

    }

    pushOperation(value){

        this.#operation.push(value);

        if(this.#operation.length > 3){
            
            this.calc();
        }
    }

    getResult() {

        return eval(this.#operation.join(""));
    }

    calc(){

        let lastItem = "";
        this.#lastOperator = this.getLastItem();

        if(this.#operation.length < 3){
            const firstItem = this.#operation[0];
            this.#operation = [firstItem, this.#lastOperator, this.#lastNumber];

        }

        if(this.#operation.length > 3){
           lastItem = this.#operation.pop();
           this.#lastNumber = this.getResult();

        }else if(this.#operation.length == 3){

            this.#lastNumber = this.getLastItem(false);
        }
        
        let result = this.getResult();
        
        if(lastItem == "%"){

            result /= 100;

            this.#operation = [result]; 

        } else {

            this.#operation = [result];

            if (lastItem) this.#operation.push(lastItem);
        }

        this.showLastNumberOnDisplay();
    }

    addOperation(value){


        if(isNaN(this.getLastOperation())){
        
            if(this.isOperator(value)){ 

                this.setLastOperation(value);
                
            }  else {

                this.pushOperation(value);

                this.showLastNumberOnDisplay();
            };

        }else {

            if(this.isOperator(value)){

                this.pushOperation(value);

            } else {

                if(this.#isPercentageOperation){
                    this.setLastOperation(value);
                    this.#isPercentageOperation = false;
                } else {
                    
                    const newValue = this.getLastOperation().toString() + value.toString();
                    this.setLastOperation(newValue);
                };

                this.showLastNumberOnDisplay();
            }
        }   

    }

    getLastItem (isOperator = true){
        let lastItem;

        for(let i = this.#operation.length - 1; i >= 0; i--){

                if(this.isOperator(this.#operation[i]) == isOperator){
                    lastItem = this.#operation[i];
                    break;
                };
      
        };

        if (!lastItem) lastItem = (isOperator) ? this.#lastOperator : this.#lastNumber;

        return lastItem;
    };

    showLastNumberOnDisplay(){

        let lastNumber =  this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    };

    addDot(){

        const lastOperation = this.getLastOperation();

        if(typeof lastOperation === "string" && lastOperation.split("").indexOf(".") > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation("0.");
        } else {
            this.setLastOperation(lastOperation.toString() + ".");
        }

        this.showLastNumberOnDisplay();

    }

    execBtn(value){
        switch (value) {
            case "ac":
                this.clearAll();
                break;
            case "ce":
                
                this.cancelEntry();

                break;
            case "porcento":
                this.addOperation("%");
                break;
            case "multiplicacao":
                this.addOperation("*");
                break;
            case "divisao":
                this.addOperation("/");
                break;
        
            case "igual":
                this.calc();
                break;
        
            case "soma":
                this.addOperation("+");
                break;
        
            case "subtracao":
                this.addOperation("-");
                break;
            
            case "ponto":
                this.addDot();
                break;

            case'0':
            case'1':
            case'2':
            case'3':
            case'4':
            case'5':
            case'6':
            case'7':
            case'8':
            case'9':
                this.addOperation(parseInt(value));
                break;
        
            default:
                break;
        }
    }

    initButtonsEvents(){
        const buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach(btn => {
            this.addEventListenerAll(btn,"click drag", e => {
                const textBtn = (btn.className.baseVal.replace("btn-",""));

                this.execBtn(textBtn);
            })
        })

        buttons.forEach(btn => {
            this.addEventListenerAll(btn,"mouseover mouseup mousedown", e=>{
                btn.style.cursor = "pointer";
            });
        });
    };

    setDisplayDateTime (){
        this.displayDate = this.currentDate.toLocaleDateString(this.#locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this.#locale);
    };



    get displayCalc(){
        return this.#displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        this.#displayCalcEl.innerHTML = value;
    } 

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this.#currentDate = value;
    }

    get displayDate() {
        return this.#dateEl.innerHTML;
    }

    set displayDate (value) {
        this.#dateEl.innerHTML = value;
    }

    get displayTime() {
        return this.#timeEl.innerHTML;
    }

    set displayTime(value) {
        this.#timeEl.innerHTML = value;
    }
}
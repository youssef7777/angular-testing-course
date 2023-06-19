import {CalculatorService} from "./calculator.service";
import {LoggerService} from "./logger.service";
import {TestBed} from "@angular/core/testing";


describe('CalculatorService', () => {

  let calculator: CalculatorService,
    loggerSpy: any;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

    //Wie machen uns die Dependency Injection von Angular zur Nutze
    TestBed.configureTestingModule({
      providers: [
        //Hier wird ein echtes Obj deklariert
        CalculatorService,
        //Hier wird ein fake Obj deklariert
        {provide: LoggerService, useValue:  loggerSpy}
      ]
    });

    calculator = TestBed.inject(CalculatorService);
  });




  // Specification oder spec in Jasmine Framework
  // Ein Suite kann mehrere specs besitzen
  it('should add two numberss', () => {

    //Abhängige Services wie der LoggerService werden in Unit-Testing immer gemockt (Ein Fake Obj wird erstellt und damit weiter gearbeitet, ALLERDINGS dieses Obj beinhaltet keine Logik und gibt nichts zurück!!). Dieser Ansatz ist Ressourcen schonend, und performant
    //const logger = new LoggerService();

    //Mocked LoggerService -> Beim Benutzen diesen Ansatz ist die spyOn() Methode überflüssig!!
    //const logger = jasmine.createSpyObj('LoggerService', ['log']);


    //Wenn eine Rückgabe durch das SpyObj zurückgeben wird, muss dies explizit geschrieben
    //logger.log().and.returnValue('Add method was executed');

    /**
     *  Jasmine has test double functions called spies. A spy can stub any function and tracks calls to it and all arguments.*
     *  A spy only exists in the describe or it block in which it is defined, and will be removed after each spec. There are special matchers for interacting with spies.
     *  spyOn() wird auf ein echtes Obj aufgerufen. Oder man hat die Möglichkeit ein komplett fake obj zu erstellen (s.o)
     */

      //spyOn(logger, 'log');

    //const calculator = new CalculatorService(logger);

    const result = calculator.add(2,2);

    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {

    // const logger = jasmine.createSpyObj('LoggerService', ['log']);
    // const calculator = new CalculatorService(logger);

    const result = calculator.subtract(2,2);

    expect(result).toBe(0,'unexpected subtraction result');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });


});

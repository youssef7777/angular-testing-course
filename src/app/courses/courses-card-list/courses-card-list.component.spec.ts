import {ComponentFixture, TestBed} from "@angular/core/testing";
import {CoursesModule} from "../courses.module";
import {CoursesCardListComponent} from "./courses-card-list";
import {DebugElement} from "@angular/core";
import {setupCourses} from "../common/setup-test-data";
import {By} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";


describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;

  // ComponentFixture ist ein test Utility Typ, der uns hilfreiche Funktionalitäten bereitstellt. Z.B.: Erstellen eines Instanzes der Component, debugging der Component etc.
  let fixture: ComponentFixture<CoursesCardListComponent>;

  //So these debug element is going to allow us to query the DOM, among other things.
  let debugElement: DebugElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      // Wir importieren hier ein von uns erstelltes Modul, um alle benötigten Module für unsere Test-Suite auf einmal zu deklarieren, ANSTATT jedes Modul einzel zu deklarieren im declarations:[] Part
      imports: [CoursesModule]

      // die Compilierung von Angular Components geschieht in einem ansyncronus Prozess, weil meistens wird gewartet auf http-Responses oder fetch templates /stylesheets etc.
      // daher der einzige sichere Weg, um Sachen nach der Compielierung auszuführen, ist die Benutzung von then() function
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CoursesCardListComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

    });
  });

  // Diese Spec wird fehlschlagen, weil der test Runner wird nicht auf das Auflösen des Promis-Obj in der then() Methode
  // daher wird die expectation false zurückliefern.
  // Die Lösung besteht darin das Schlüsselwort "async"  in den Header der beforeEach() Methode tippen. Das ist von Angular ein Testing Utility a function that receives as input argument another function.
  // Well, what async is going to do is to wait for any asynchronous operations triggered by the code that we passed to complete. So async is going to wait for a predefined amount of time by default (default is 5 seconds).
  // This means that async is going to keep track of, for example, any promises or timeouts or other browser asynchronous operations triggered by this code block.
  // The async utility is going to keep track of every single one of those operations, and a sink is then will be finish with the beforeEach block
  it("should create the component", () => {
    expect(component).toBeTruthy();
    // console.log(component);
  });


  it("should display the course list", () => {

    //So after assigning any data to a component via an @input property, we also need to notify the component. We need to trigger the component change detection mechanism.
    //And if some changes are detected, then the DOM is going to get updated with the latest data.
    component.courses = setupCourses();

    //Wir müssen change detection mechanism starten, bevor wir nach Elemente im DOM suchen!!! Das ist ein synchronous prozess
    fixture.detectChanges();

    // console.log(debugElement.nativeElement.outerHTML);

    const cards = debugElement.queryAll(By.css('.course-card'));

    expect(cards).withContext('Could not find cards').toBeTruthy();
    expect(cards.length).withContext('Unexpected number of courses').toBe(12);

  });


  it("should display the first course", () => {

    component.courses = setupCourses();

    fixture.detectChanges();

    const course = component.courses[0];

    const card = debugElement.query(By.css('.course-card:first-child')),
          title = card.query(By.css('mat-card-title')),
          image = card.query(By.css('img'));

    expect(card).withContext('Could not find card').toBeTruthy();

    expect(title.nativeElement.textContent).toBe(course.titles.description);

    expect(image.nativeElement.src).toBe(course.iconUrl);

  });


});



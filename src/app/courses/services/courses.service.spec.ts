import {CoursesService} from "./courses.service";
import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {COURSES, findLessonsForCourse} from "../../../../server/db-data";
import {Course} from "../model/course";

describe('CoursesService', () => {

  let coursesService: CoursesService,

    // httpTestingController wird gebraucht, um zu definieren, welche Daten beim Http-Aufruf zurückgegeben werden, weil wir hier den kompletten HttpClient mocken, wird keine reale Http-Requests gesendet
    httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  it('should retrieve all courses', () => {
    coursesService.findAllCourses()
      .subscribe(courses => {
        expect(courses).withContext('No courses returned').toBeTruthy();
        expect(courses.length).withContext('Length dose not matches').toBe(12);

        const course = courses.find(course => course.id === 12);
        expect(course.titles.description).toBe('Angular Testing Course');
      });

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');

    // Wir simulieren das Verhalten im Fall einer erfolgreichen Ausführung des GET-Request, indem ein response mit dem Body COURSES zurückgegeben wird.
    req.flush({payload: Object.values(COURSES)});
  });

  it('should find a course by id', () => {
    coursesService.findCourseById(12)
      .subscribe(course => {
        expect(course).withContext('No course returned').toBeTruthy();
        expect(course.id).withContext('Id dose not matches').toBe(12);
      });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('GET');

    req.flush(COURSES[12]);
  });

  it('should save a course data', () => {

    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};
    coursesService.saveCourse(12, changes)
      .subscribe(course => {
        expect(course.id).toBe(12);
      });

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('PUT');

    expect(req.request.body.titles.description).toBe(changes.titles.description);


    /**
     * The main objective of the spread operator is to spread the elements of an array or object.
     * Verteilen das args Obj in drei Objs
     *
     * function foo(x, y, z) { }
     * var args = [0, 1, 2];
     * foo(...args);
     *
     * Object spread:
     *
     * EXAMPLE 1:
     * const point2D = {x: 1, y: 2};
     * const point3D = {...point2D, z: 3}; Create a new object by using all the point2D props along with z
     *
     *
     * For objects, the order of where you put the spread matters. This works something like Object.assign, and does what you'd expect: what comes first is 'overridden' by what comes later:
     *
     * EXAMPLE 2:
     * const point2D = {x: 1, y: 2};
     * const anotherPoint3D = {x: 5, z: 4, ...point2D};
     * console.log(anotherPoint3D); // {x: 1, y: 2, z: 4}
     * const yetAnotherPoint3D = {...point2D, x: 5, z: 4}
     * console.log(yetAnotherPoint3D); // {x: 5, y: 2, z: 4}
     *
     *
     * https://basarat.gitbook.io/typescript/future-javascript/spread-operator
     */
    //Response Verhalten simulieren (triggering the mock request)
    req.flush({
      ...COURSES[12],
      ...changes
    });
  });

  it('should give an error if save course fails', () => {

    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

    coursesService.saveCourse(12, changes)
      .subscribe(
        () => fail('the save course operation should have failed'),
        error => {
          expect(error.status).toBe(500);
        }
      );

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('PUT');
    req.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'});
  });

  it('should find a list of lessons', () => {
    coursesService.findLessons(12)
      .subscribe(lessons => {
        expect(lessons).toBeTruthy();

        expect(lessons.length).toBe(3);
      });

    const request = httpTestingController.expectOne(req => req.url === '/api/lessons');

    expect(request.request.method).toEqual('GET');
    expect(request.request.params.get('courseId')).toEqual('12');
    expect(request.request.params.get('filter')).toEqual('');
    expect(request.request.params.get('sortOrder')).toEqual('asc');
    expect(request.request.params.get('pageNumber')).toEqual('0');
    expect(request.request.params.get('pageSize')).toEqual('3');

    // request.flush(), um die obige definierte Anfrage zu triggern, sonst werden die specs für diese konkrete Anfrage nicht auf Richtigkeit geprüft
    request.flush({
      payload: findLessonsForCourse(12).slice(0,3)
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });


});

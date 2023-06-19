import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Course} from "../model/course";
import {map} from "rxjs/operators";
import {Lesson} from "../model/lesson";


@Injectable()
export class CoursesService {

  constructor(private http: HttpClient) {

  }

  findCourseById(courseId: number): Observable<Course> {
    return this.http.get<Course>(`/api/courses/${courseId}`);
  }

  findAllCourses(): Observable<Course[]> {
    return this.http.get('/api/courses')
      .pipe(
        /**
         * Schließlich wird der HTTP-Response mithilfe des map-Operators transformiert,
         * um nur das Feld "payload" aus dem Response-Objekt zu extrahieren.
         * Das resultierende Observable gibt dann die Liste der Lektionen zurück.
         */
        map(res => res['payload'])
      );
  }


  saveCourse(courseId: number, changes: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`/api/courses/${courseId}`, changes);
  }

  findLessons(
    courseId: number, filter = '', sortOrder = 'asc',
    pageNumber = 0, pageSize = 3): Observable<Lesson[]> {

    return this.http.get('/api/lessons', {
        params: new HttpParams()
          .set('courseId', courseId.toString())
          .set('filter', filter)
          .set('sortOrder', sortOrder)
          .set('pageNumber', pageNumber.toString())
          .set('pageSize', pageSize.toString())
      }
    ).pipe(
      map(res => res["payload"])
    );
  }

}

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {CoursesService} from '../services/courses.service';

import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {setupCourses} from "../common/setup-test-data";
import {of} from "rxjs";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";


describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let coursesService: CoursesService;

  const beginnerCourses = setupCourses().filter(course => course.category === 'BEGINNER');

  beforeEach(async () => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        {providers: CoursesService, useValue: coursesServiceSpy}
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      coursesService = TestBed.inject(CoursesService);
    });

  });

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {

    // const ss = coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    //
    // console.log(ss);
    //
    // fixture.detectChanges();

      pending();


  });


  it("should display only advanced courses", () => {

    pending();

  });


  it("should display both tabs", () => {

    pending();

  });


  it("should display advanced courses when tab clicked", () => {

    pending();

  });

});



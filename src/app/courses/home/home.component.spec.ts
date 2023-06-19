import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {CoursesService} from '../services/courses.service';

import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {setupCourses} from "../common/setup-test-data";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";

import {By} from "@angular/platform-browser";
import SpyObj = jasmine.SpyObj;
import {click} from "../common/test-utils";


describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(course => course.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category === 'ADVANCED');

  beforeEach(async () => {

    coursesService = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    await TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: CoursesService, useValue: coursesService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    coursesService = TestBed.inject(CoursesService) as SpyObj<CoursesService>;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mdc-tab'));

    expect(tabs.length).withContext('Unexpected number of tabs found').toBe(1);
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mdc-tab'));

    expect(tabs.length).withContext('Unexpected number of tabs found').toBe(1);
  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mdc-tab'));

    expect(tabs.length).withContext('Unexpected number of tabs found').toBe(2);
  });


  it("should display advanced courses when tab clicked", (done: DoneFn) => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mdc-tab'));

    // Das ist Möglichkeit (1), um im DOM ein Click-Event zu simulieren
    // debugElement.nativeElement.click();
    // tabs[1].nativeElement.click();
    // Das ist Möglichkeit (2), um im DOM ein Click-Event zu simulieren, durch selbst geschriebene Funktion
    // Wir klicken hier auf das zweite Tab!!!
    click(tabs[1]);

    fixture.detectChanges();

    setTimeout(() => {
      const cardTitles = debugElement.queryAll(By.css('.mat-mdc-tab-body-active .mat-mdc-card-title'));

      expect(cardTitles.length).toBeGreaterThan(0);
      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');

      done();
    }, 500);
  });

});



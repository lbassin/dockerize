import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Template } from '../models/template';
import { ApiService } from '../../../core/services/api.service';

@Injectable()
export class TemplateRepository {

    constructor(private api: ApiService) {
    }

    public getAll(): Observable<Template[]> {
        return this.api.get('template').pipe(
            map((elements: Array<object>) => {
                return elements.map(element => Object.assign(new Template, element));
            }),
            catchError((error: HttpErrorResponse) => {
                console.error(error.message);
                return of([]);
            })
        );
    }
}
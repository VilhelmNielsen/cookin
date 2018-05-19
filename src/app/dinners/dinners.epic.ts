import { Injectable } from '@angular/core';
import { DinnersService } from './dinners.service';
import { ActionsObservable } from 'redux-observable';
import { DinnersActions } from './dinners.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Dinner } from '../entities/Dinner';

@Injectable()
export class DinnersEpic {
  constructor(
    private dinnersService: DinnersService
  ) { }

  // TODO: UpdateDinner
  // TODO: DeleteDinner



  getDinners = (action$: ActionsObservable<any>) => {
    return action$.ofType(DinnersActions.REQUEST_GET_DINNERS)
      .mergeMap(({ payload }) => {
        return this.dinnersService.getDinners()
          .map((response: Object) => {
            const dinners = Object.keys(response).reduce((array, key) => {
              const dinner = { attendees: [], ...response[key], id: key };
              array.push(dinner);
              return array;
            }, []);
            return {
              type: DinnersActions.SET_DINNERS,
              payload: dinners
            };
          })
          .catch(err => Observable.of({
            type: DinnersActions.FAILED_GET_DINNERS,
            payload: err
          }));
      });
  }

  addDinner = (action$: ActionsObservable<any>) => {
    return action$.ofType(DinnersActions.REQUEST_ADD_DINNER)
      .mergeMap(({ payload: dinner }) => {
        return this.dinnersService.addDinner(dinner)
          .map(({ name: id }: any) => {
            const createdDinner = { ...dinner, id } as Dinner;
            return {
              type: DinnersActions.ADD_DINNER,
              payload: createdDinner
            };
          })
          .catch(err => Observable.of({
            type: DinnersActions.FAILED_ADD_DINNER,
            payload: err
          }));
      });
  }

}
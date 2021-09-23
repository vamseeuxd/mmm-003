import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {delay, switchMap, tap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';

interface IExpenses {
  name: string;
  start: number;
  end: number;
  id?: string;
}

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  data$: Observable<IExpenses[]>;
  startFilterAction: BehaviorSubject<number> = new BehaviorSubject<number>(8);
  startFilter$: Observable<number> = this.startFilterAction.asObservable().pipe(
    tap(
      x => {
        console.log('Start Change', x);
      }
    )
  );
  endFilterAction: BehaviorSubject<number> = new BehaviorSubject<number>(9);
  endFilter$: Observable<number> = this.endFilterAction.asObservable().pipe(
    tap(
      x => {
        console.log('End Change', x);
      }
    )
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore
  ) {
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    // eslint-disable-next-line max-len
    this.data$ = this.firestore.collection<IExpenses>('expenses', ref => ref.orderBy('name')).valueChanges({idField: 'id'}).pipe(delay(500));


    combineLatest([this.startFilter$, this.endFilter$]).pipe(
      switchMap(
        // eslint-disable-next-line max-len
        ([start, end]) => {
          return this.firestore.collection('expenses').valueChanges({idField: 'id'});
        }
      )
    ).subscribe(value => {
      console.log(value);
      console.log('-----------------------------------');
    });

  }

  addBulkData() {
    const data = [[1, 10], [2, 9], [3, 8], [4, 7], [5, 6], [6, 10], [7, 9], [8, 10], [8, 9], [1, 4]];
    const batch = this.firestore.firestore.batch();
    data.forEach((value, index) => {
      const expenses = this.firestore.collection<IExpenses>('expenses').ref.doc();
      batch.set(expenses, {name: `Expenses ${index}`, start: value[0], end: value[1]});
    });
    batch.commit().then(value => {
      alert('Success');
    }).catch(reason => {
      alert('Error');
    });
  }

}

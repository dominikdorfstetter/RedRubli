import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';
import { map, take, tap } from 'rxjs/operators';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

/**
 * @author Dominik Dorfstetter
 */
@Injectable({
    providedIn: 'root'
})
export class FirestoreProvider {

  constructor(public afs: AngularFirestore) {}

  /**
   * get a collection reference
   * @param ref     reference
   * @param queryFn query function
   */
  col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  /**
   * get a document reference
   * @param ref reference
   */
  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  /**
   * get a document
   * @param ref reference
   */
  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges().pipe(
        map(doc => {
            return doc.payload.data() as T;
          })
      );
  }

  /**
   * get a collection
   * @param ref reference
   * @param queryFn query function
   */
  col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
    return this.col(ref, queryFn)
      .snapshotChanges().pipe(
      map(docs => {
        return docs.map(a => a.payload.doc.data()) as T[];
      }));
  }

  /**
   * get collection with inserted Ids
   * @param ref 
   * @param queryFn 
   */
  colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map(actions => {
            return actions.map(a => {
            const data: {} = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
            });
        })
      );
  }

  /**
   * get current server timestamp
   */
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  /**
   * set document to any given data
   * @param ref reference
   * @param data cocument data to set
   */
  set<T>(ref: DocPredicate<T>, data: any) {
    const timestamp = this.timestamp;
    return this.doc(ref).set({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp
    });
  }

  /**
   * update data on any given document with data
   * @param ref reference
   * @param data document data to update
   */
  update<T>(ref: DocPredicate<T>, data: any) {
    return this.doc(ref).update({
      ...data,
      updatedAt: this.timestamp
    });
  }

  /**
   * delete document
   * @param ref reference
   */
  delete<T>(ref: DocPredicate<T>) {
    return this.doc(ref).delete();
  }

  /**
   * add data to a collection
   * @param ref reference
   * @param data data to add to a collection
   */
  add<T>(ref: CollectionPredicate<T>, data) {
    const timestamp = this.timestamp;
    return this.col(ref).add({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp
    });
  }

  /**
   * get firebase GeoPoint
   * @param lat latitude
   * @param lng longitude
   */
  geopoint(lat: number, lng: number) {
    return new firebase.firestore.GeoPoint(lat, lng);
  }

  /**
   * upsert data
   * @param ref reference
   * @param data data to either insert or update
   */
  async upsert<T>(ref: DocPredicate<T>, data: any) {
    const doc = this.doc(ref)
      .snapshotChanges()
      .pipe(
        take(1)
      )
      .toPromise();

    const snap = await doc;
      return snap.payload.exists ? this.update(ref, data) : this.set(ref, data);
  }

  /**
   * inspect document
   * @param ref reference
   */
  inspectDoc(ref: DocPredicate<any>): void {
    const tick = new Date().getTime();

    this.doc(ref)
      .snapshotChanges()
      .pipe(
        take(1),
        tap(d => {
            const tock = new Date().getTime() - tick;
            console.log(`Loaded Document in ${tock}ms`, d);
        })
      )
      .subscribe();
  }

    /**
     * inspect collection
     * @param ref 
     */
  inspectCol(ref: CollectionPredicate<any>): void {
    const tick = new Date().getTime();
    
    this.col(ref)
      .snapshotChanges()
      .pipe(
        take(1),
        tap(c => {
            const tock = new Date().getTime() - tick;
            console.log(`Loaded Collection in ${tock}ms`, c);
        })
      ).subscribe();
  }

  /**
   * Create and read doc references
   * @param host host document
   * @param key key
   * @param doc document reference
   */
  connect(host: DocPredicate<any>, key: string, doc: DocPredicate<any>) {
    return this.doc(host).update({ [key]: this.doc(doc).ref });
  }

  /**
   * returns a documents references mapped to AngularFirestoreDocument
   * @param ref reference
   */
  docWithRefs$<T>(ref: DocPredicate<T>) {
    return this.doc$(ref).pipe(map(doc => {
      for (const k of Object.keys(doc)) {
        if (doc[k] instanceof firebase.firestore.DocumentReference) {
          doc[k] = this.doc(doc[k].path);
        }
      }
      return doc;
    }));
  }
}
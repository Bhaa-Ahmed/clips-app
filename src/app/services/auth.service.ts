import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import IUSer from '../models/user.model';
import { map, delay, filter, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IUSer>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.firstChild),
        switchMap((route) => route?.data ?? of({}))
      )
      .subscribe((data) => {
        this.redirect = data['authOnly'] ?? false;
      });
  }

  public async createUser(userData: IUSer) {
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email as string,
      userData.password as string
    );

    if (!userCred) throw new Error("User can't be found");

    await this.userCollection.doc(userCred.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });

    await userCred.user?.updateProfile({
      displayName: userData.name,
    });
  }

  public async logout(e?: Event) {
    if (e) {
      e.preventDefault();
    }
    await this.auth.signOut();

    if (this.redirect) await this.router.navigateByUrl('/');
  }
}

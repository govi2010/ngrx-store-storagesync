import { InjectionToken, NgModule } from '@angular/core';
import { FormSyncModule, FORM_SYNC_STORE_KEY, storageSync } from '@larscom/ngrx-store-storagesync';
import { ActionReducer, ActionReducerMap, StoreModule as NgRxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as fromSettings from '../modules/settings/store/settings.reducer';
import * as fromApp from './app.reducer';
import { IRootState } from './models/root-state';

export const ROOT_REDUCER = new InjectionToken<ActionReducerMap<IRootState>>('ROOT_REDUCER');

export function storageSyncReducer(reducer: ActionReducer<IRootState>): ActionReducer<IRootState> {
  const sync = storageSync<IRootState>({
    version: 1,
    features: [
      { stateKey: 'app', storageForFeature: window.sessionStorage },
      { stateKey: 'todo' },
      { stateKey: 'settings' },
      { stateKey: 'forms' },
      { stateKey: FORM_SYNC_STORE_KEY, storageForFeature: window.sessionStorage }
    ],
    storageError: console.error,
    storage: window.localStorage
  });

  return sync(reducer);
}

@NgModule({
  imports: [
    NgRxStoreModule.forRoot(ROOT_REDUCER, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true
      },
      metaReducers: [storageSyncReducer]
    }),
    StoreDevtoolsModule.instrument({ maxAge: 30 }),
    FormSyncModule.forRoot()
  ],
  exports: [NgRxStoreModule],
  providers: [{ provide: ROOT_REDUCER, useValue: { app: fromApp.reducer, settings: fromSettings.reducer } }]
})
export class StoreModule {}

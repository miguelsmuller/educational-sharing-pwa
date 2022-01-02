import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subject, merge } from 'rxjs';
import { takeUntil, map, mergeMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Reference } from "@angular/fire/compat/storage/interfaces";


import { CommonService } from '@app/services/common.service';

@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.page.html',
  styleUrls: ['./listagem.page.scss'],
})
export class ListagemPage implements OnInit {
  public listItems;
  public listPrefix;
  private unSubscribeAllObservables$: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private serviceStorage: AngularFireStorage,
    private serviceNavigation: NavController,
    private serviceCommon: CommonService,
  ) { }

  ngOnInit() {
    this.route.queryParams.pipe(
      takeUntil(this.unSubscribeAllObservables$),
      mergeMap(
        (data) => this.getFolderContent(data.prefix)
      ),
      map((data) => {
        return { items: this.getExtraInformation(data.items), prefixes: data.prefixes };
      }),
    ).subscribe(
      (data) => {
        this.listItems = data.items;
        this.listPrefix = data.prefixes;
      }
    );
  }

  ngOnDestry() {
    this.unSubscribeAllObservables$.next();
  }

  getExtraInformation(arrayReference: Reference[]) {
    const newArrayReferences = [];
    arrayReference.forEach(async (item, index) => {
      newArrayReferences.push({
        item,
        downloadUrl: await item.getDownloadURL().then((promisseReturn) => promisseReturn ),
        metaData: await item.getMetadata().then((promisseReturn) => promisseReturn ),
      });
    });
    return newArrayReferences;
  }

  getFolderContent(folder: string) {
    return this.serviceStorage.ref('/' + folder).listAll()
    .pipe(
      takeUntil(this.unSubscribeAllObservables$),
      map((data) => {
        return {items: data.items, prefixes: data.prefixes};
      })
    );
  }

  goToPrefix(prefix: string) {
    this.serviceNavigation.navigateForward('/tabs/listagem', {
      queryParams: {
        prefix
      },
    });
  }

  goToItem(item: string) {
    this.serviceCommon.newAnalyticsEvent(
      'action',
      'load',
      'load-file',
      item
    );

    this.serviceNavigation.navigateForward('/tabs/arquivo', {
      queryParams: {
        item
      },
    });
  }

  goBack() {
    this.serviceNavigation.back();
  }
}

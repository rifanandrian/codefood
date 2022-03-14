import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable()
export class GlobalService {

  @Output() public updateRecipe = new EventEmitter<number>();
  @Output() public nServing = new EventEmitter<number>();
  @Output() public searchRecipe = new EventEmitter<string>();

  constructor() { }

  updateMainRecipe(isChanges: any) {
    this.updateRecipe.emit(isChanges);
  }

  sendServing(serving: number) {
    this.nServing.emit(serving);
  }

  updateListRecipe(search: string) {
    this.searchRecipe.emit(search);
  }

}

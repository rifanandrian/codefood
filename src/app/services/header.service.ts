import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable()
export class HeaderService {

  @Output() public updateRecipe = new EventEmitter<number>();

  constructor() { }

  updateMainRecipe(isChanges: any) {
    this.updateRecipe.emit(isChanges);
  }

}

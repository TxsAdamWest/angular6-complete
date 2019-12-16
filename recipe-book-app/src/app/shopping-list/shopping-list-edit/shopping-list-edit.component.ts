import { Component, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent {
  @ViewChild('f', { static: false }) shoppingListForm: NgForm;
  private subscription: Subscription;
  public editMode: boolean = false;
  public editedItemIndex: number;
  public editedItem: Ingredient;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{ shoppingList: { ingredient: Ingredient[] }}>)
  { }

  public onSubmit(form: NgForm): void {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);

    if ( this.editMode ) {
      // this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
      this.store.dispatch(new ShoppingListActions.UpdateIngredient({ index: this.editedItemIndex, ingredient: newIngredient }));
    } else {
      // this.shoppingListService.addIngredient(newIngredient); // Previously used in non-ngrx approach. ( no State / store )
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }

    this.editMode = false;
    this.shoppingListForm.reset();
  }

  public onDelete(): void {
    // this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedItemIndex));
    this.clearForm();
  }

  public clearForm(): void {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  public ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing
      .subscribe((index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

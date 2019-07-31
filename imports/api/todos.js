import { Mongo } from "meteor/mongo";

export const ToDos = new Mongo.Collection("todos");

Meteor.methods({
  'todos.toggleComplete'(todo) {
    if (todo.owner !== this.userId) {
      throw new Meteor.Error(
        'todos.toggleComplete.not-authorized',
        'You are not allowed to update to-dos for other users.',
      );
    }
    ToDos.update(todo._id, {
      $set: { complete: !todo.complete },
    });
  },
  'todos.removeToDo'(todo) {
    if (todo.owner !== this.userId) {
      throw new Meteor.Error(
        'todos.removeToDo.not-authorized',
        'You are not allowed to update to-dos for other users.',
      );
    }
    ToDos.remove({_id: todo._id});
  },
  'todos.addToDo'(newToDo) {
    const owner = this.userId;
    ToDos.insert({...newToDo, owner});
  },
  'todos.removeCompleted'() {
    const owner = this.userId;
    ToDos.remove({
      owner, 
      complete: true,
    });
  },
});

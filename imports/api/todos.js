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
});

import { Mongo } from "meteor/mongo";

export const ToDos = new Mongo.Collection("todos");

if (Meteor.isServer) {
  // IMPORTANT: declare a "channel" that contains todos owned by this user
  Meteor.publish('myTodos', function todosPublication() {
    // IMPORTANT: Rather than publishing ALL todos in the collection
    //            we only send back the ones owned by this user
    return ToDos.find({ owner: this.userId });
  });
}

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

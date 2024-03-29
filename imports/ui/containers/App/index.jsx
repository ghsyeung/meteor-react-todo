import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import {withTracker} from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import AccountsUIWrapper from "../../components/AccountsWrapper";
import ToDoForm from "../../components/ToDoForm";
import "./styles.css";

import { ToDos } from "../../../api/todos";

class App extends Component {

  toggleComplete = item => {
    Meteor.call('todos.toggleComplete', item);
  };

  addToDo = title => {
    const newTodo = {
      complete: false,
      title,
    };

    Meteor.call('todos.addToDo', newTodo);
  };

  removeToDo = todo => {
    Meteor.call('todos.removeToDo', todo);
  };

  removeCompleted = () => {
    Meteor.call('todos.removeCompleted');
  };

  render() {
    const {todos, currentUser, currentUserId} = this.props;
    const isLoggedIn = currentUser;

    return (
      <div className="app-wrapper">
        <div className="login-wrapper">
          <AccountsUIWrapper/>
        </div>
        <div>
          <ToDoForm 
            isLoggedIn={isLoggedIn}
            todos={todos}
            addToDo={title => this.addToDo(title)}
            toggleComplete={item => this.toggleComplete(item)}
            removeToDo={item => this.removeToDo(item)}
            removeCompleted={() => this.removeCompleted()}
          />
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  // IMPORTANT: this "channel" only contains todos
  //            owned by me
  Meteor.subscribe('myTodos');

  return {
    currentUser: Meteor.user(), 
    currentUserId: Meteor.userId(), 
    todos: ToDos.find({}).fetch()
  };
})(App);



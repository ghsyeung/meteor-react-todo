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
    const {currentUserId} = this.props;
    const newTodo = {
      complete: false,
      title,
      owner: currentUserId, 
    };

    ToDos.insert(newTodo);
  };

  removeToDo = item => {
    ToDos.remove({_id: item._id});
  };

  removeCompleted = () => {
    const {todos} = this.props;
    todos.forEach(todo => {
      if (todo.complete) {
        ToDos.remove({_id: todo._id});
      }
    });
  };

  render() {
    const {todos, currentUser, currentUserId} = this.props;
    const isLoggedIn = currentUser;
    const filteredTodos = todos.filter(todo => todo.owner === currentUserId);

    return (
      <div className="app-wrapper">
        <div className="login-wrapper">
          <AccountsUIWrapper/>
        </div>
        <div>
          <ToDoForm 
            isLoggedIn={isLoggedIn}
            todos={filteredTodos}
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
  return {
    currentUser: Meteor.user(), 
    currentUserId: Meteor.userId(), 
    todos: ToDos.find({}).fetch()
  };
})(App);



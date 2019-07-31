import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import {withTracker} from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import ToDoInput from "../../components/ToDoInput";
import ToDoItem from "../../components/ToDoItem";
import ToDoCount from "../../components/ToDoCount";
import ClearButton from "../../components/ClearButton";
import AccountsUIWrapper from "../../components/AccountsWrapper";
import "./styles.css";

import { ToDos } from "../../../api/todos";

class App extends Component {

  toggleComplete = item => {
    ToDos.update(
      { _id: item._id},
      { $set: { complete: !item.complete }}
    ); 
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

class ToDoForm extends Component {
  constructor() {
    super();

    this.state = {
      inputValue: "",
    };

    this.toDoInput = React.createRef();
  }

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  addToDo = event => {
    event.preventDefault();

    let toDoInput = this.toDoInput.current;

    if (this.state.inputValue) {
      const title = this.state.inputValue;
      this.props.addToDo(title);

      this.setState({
        inputValue: "",
      });

      toDoInput.value = "";
    }
  };

  hasCompleted() {
    const {todos} = this.props;
    let completed = todos.filter(todo => todo.complete);
    return completed.length > 0 ? true : false;
  }

  componentDidMount() {
    if (this.toDoInput.current) {
      this.toDoInput.current.focus();
    }
  }

  render() {
    const {isLoggedIn, todos, toggleComplete, addToDo, removeCompleted, removeToDo} = this.props;
    let number = todos.length;

    return (
      <div className="todo-list">
        <h1>So Much To Do</h1>
        { isLoggedIn ? (
          <div>
            <ToDoInput
              ref={this.toDoInput}
              addToDo={this.addToDo}
              onChange={this.handleInputChange}
              value={this.state.inputValue}
            />
            <ul>
              {
                todos.map((todo, index) => (
                  <ToDoItem
                    key={index}
                    item={todo}
                    toggleComplete={() => toggleComplete(todo)}
                    removeToDo={() => removeToDo(todo)}
                  />
                ))}
              </ul>
              <div className="todo-admin">
                <ToDoCount number={number} />
                {this.hasCompleted() && (
                  <ClearButton removeCompleted={removeCompleted} />
                )}
              </div>
            </div>
        ) : (
          <div className="logged-out-message">
            <p>Please sign in to see your todos.</p>
          </div>
        ) }
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



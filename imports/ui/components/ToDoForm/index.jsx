import React, { Component } from "react";
import ToDoInput from "../../components/ToDoInput";
import ToDoItem from "../../components/ToDoItem";
import ToDoCount from "../../components/ToDoCount";
import ClearButton from "../../components/ClearButton";

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

export default ToDoForm;

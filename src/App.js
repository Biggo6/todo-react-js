import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ListItem from './ListItem';
import axios from 'axios';

import loader from './loader.gif';

class App extends Component {

  constructor() {
    super();
    this.state = {
      editing: false, 
      editTodoId: null,
      newTodo: 'Doing some dishes',
      todos: [],
      loading: true
    }
    this.apiUrl = 'https://5bcc75b7cf2e85001387472e.mockapi.io';
  }

    async componentDidMount() {
      const response =  await axios.get(`${this.apiUrl}/todos`);
      console.log(response);
      this.setState({
        todos: response.data,
        loading: false
      })
    }

  handleChange = (event) => {
    this.setState({
      newTodo: event.target.value
    })
    
  }

  addTodo = async () => {

    if(!this.state.editing){
      let idtodo;
      if (this.state.todos.length) {
        idtodo = this.state.todos[this.state.todos.length - 1].id + 1;
      }else{
        idtodo = 1;
      }
      const newTodo = {
        name: this.state.newTodo,
        id: idtodo
       };

       const response = await axios.post(`${this.apiUrl}/todos`, {
         name: this.state.newTodo
       });

       this.setState({
         todos: [...this.state.todos, response.data],
         newTodo: ''
       });
    }

  }

  deleteTodo = async (id) => {


    let newTodos = this.state.todos;
    let todos = newTodos.filter(todo => {
        if(todo.id !== id) {
          return todo;
        }
    }); 
    const response = await axios.delete(`${this.apiUrl}/todos/${id}`);

    this.setState({
      todos: [...todos]
    })
  }

  handleUpdate = (id) => {
     this.setState({
       editing: true
     });
     const {name} = this.state.todos.find(todo => todo.id === id);
     
     
     this.setState({
      newTodo: name,
      editTodoId: id
     })
  }

  editTodo = async () => {
      let newTodos = this.state.todos.map(todo => {
        if(todo.id === this.state.editTodoId){
          return {
            id: this.state.editTodoId,
            name: this.state.newTodo
          }
        }else{
          return todo;
        }
      });
      
      const response = await axios.put(`${this.apiUrl}/todos/${this.state.editTodoId}`, {
        name: this.state.newTodo
      })
      this.setState({
        todos: [...newTodos],
        editing: false,
        editTodoId: null,
        newTodo: ''
      })
  }

  render() {
    return (
      <div className="App"> 
          <header className="App-header" style={{height:'20px'}}>
               <h1 className="App-title">CRUD REACT</h1>
          </header>
          <div className="container" style={{marginTop:'20px'}}>
                  <input 
                    type="text"
                    name="todo"
                    className="my-4 form-control"
                    placeholder="Add a new todo"
                    value={this.state.newTodo}
                    onChange={this.handleChange} />
                    <button 
                    onClick={!this.state.editing ? this.addTodo : this.editTodo}
                    className="btn-info mb-3 form-control">
                    
                    {this.state.editing ? 'Update' : 'Add'}  Todo</button>
                  
                  {
                    this.state.loading && 
                      <img src={loader} alt="" />
                  }
                  
                  {
                    (!this.state.editing || this.state.loading) &&
                    <ul className="list-group">
                      {
                        this.state.todos.map((todo) => {
                          return <ListItem key={todo.id}
                            todo={todo}
                            handleUpdate={() => this.handleUpdate(todo.id) }
                            deleteTodo={() => this.deleteTodo(todo.id)}
                          />
                        }) 
                      }
                  </ul>
          
                  }
                  
                  </div>
      </div>
    );
  }
}

export default App;

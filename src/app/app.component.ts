import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Console } from '@angular/core/src/console';

window.onbeforeunload = function() {
  localStorage.removeItem('name');
  return '';
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'app';
  public name = '';
  public messages = '';
  public storage: any;
  public myName: any;
  public messageList = [];

  public socket = io.connect('http://13.59.164.106:7200', {reconnect: true});
  // public socket = io.connect('http://localhost:7200', {reconnect: true});

  public constructor() {
    this.storage = localStorage;
    this.myName = JSON.parse(this.storage.getItem('name'));
    this.socket.on('send-message', function (data) {
      if (this.myName.name !== data.name) {
        this.messageList.push(data);
      } else {
        return;
      }
    }.bind(this));
  }

  public ngOnInit() {
    if (this.storage.length === 0 ) {
      document.getElementById('id01').style.display = 'block';
    }
  }

  public login() {
    if (this.name === '') {
      console.log('login');
      return;
    }
    const data = {
      'name' : this.name
    };

    this.storage.setItem('name', JSON.stringify(data));
    this.myName = JSON.parse(this.storage.getItem('name'));

    document.getElementById('id01').style.display = 'none';

    this.socket.emit('save-message', {'name': this.name, 'message': this.name + ' Connect.'});
  }

  public send() {
    if (this.messages === '') {
      console.log('empty');
      return;
    }

    console.log(this.name);

    this.messageList.push({
      'name': this.name,
      'message': this.messages
    });
    console.log(this.messageList);

    this.socket.emit('save-message', {'name': this.name, 'message': this.messages});

    this.messages = '';

  }
}

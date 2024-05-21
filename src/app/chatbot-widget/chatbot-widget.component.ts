import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [NgClass],
  templateUrl: './chatbot-widget.component.html',
  styleUrl: './chatbot-widget.component.css'
})
export class ChatbotWidgetComponent {

  args: any;
  state: Boolean;
  messages: Array<any>;
  chatbox: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private el: ElementRef
  ){}

  ngOnInit() {
    this.chatbox = this.el.nativeElement.querySelector('.chatbox__support')

    this.state = false;
    this.messages = [];
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.onSendButton()
    }
  }

  toggleState() {
    this.state = !this.state;
    this.cdr.detectChanges();
    this.chatbox = this.el.nativeElement.querySelector('.chatbox__support')
    // show or hides the box
    /*if(this.state) {
      this.chatbox.classList.add('chatbox--active')
    } else {
      this.chatbox.classList.remove('chatbox--active')
    }*/
    
  }

  onSendButton() {
    console.log('sending')
    var textField = this.chatbox.querySelector('input');
    let text1 = textField.value
    if (text1 === "") {
      return;
    }

    let msg1 = { name: "User", message: text1 }
    this.messages.push(msg1);

    fetch('http://85.215.243.214:5000/predict', {
      method: 'POST',
      body: JSON.stringify({ message: text1 }),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(r => r.json())
    .then(r => {
      let msg2 = { name: "DomeGPT", message: r.answer };
      this.messages.push(msg2);
      this.updateChatText()
      textField.value = ''
    }).catch((error) => {
      console.error('Error:', error);
      this.updateChatText()
      textField.value = ''
    });
  }

  updateChatText() {
    var html = '';
    this.messages.slice().reverse().forEach(function(item, index) {
      if (item.name === "DomeGPT") {
        html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
      } else {
        html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
      }
    });

    const chatmessage = this.chatbox.querySelector('.chatbox__messages');
    chatmessage.innerHTML = html;

    this.cdr.detectChanges();
  }
}

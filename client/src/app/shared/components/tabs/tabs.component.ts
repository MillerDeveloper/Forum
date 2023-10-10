import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/User';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, OnDestroy {

  @Input() currentUser: User = null
  @Input() link: string = '/cabinet/personal-data'
  constructor(private userService: UserService) { }

  subscription: Subscription = new Subscription()

  tabs = [
    // {
    //   name: 'Личные данные',
    //   link: '/cabinet/personal-data',
    //   canView: true,
    //   active: false
    // },
    {
      name: 'Ваши компании',
      link: '/cabinet/personal-companies',
      canView: true,
      active: false
    },
    {
      name: 'Добавить компанию',
      link: '/cabinet/add-company',
      canView: true,
      active: false
    }
  ]

  extraTabs = [
    {
      name: 'Модерация',
      link: '/cabinet/moderation',
      canView: false,
      canViewWith: 'moderator',
      active: false
    },
    {
      name: 'Админ панель',
      link: '/cabinet/admin/home',
      canView: false,
      canViewWith: 'admin',
      active: false
    }
  ]

  ngOnInit(): void {
    this.subscription.add(this.userService.getCurrentUser().subscribe((user: User) => {
      if(user.rules.moderator) {
        const index = this.extraTabs.findIndex(tab => tab.canViewWith === 'moderator')
        if(index !== -1) {
          this.tabs.push(this.extraTabs[index])
        }
      }

      if(user.rules.admin) {
        const index = this.extraTabs.findIndex(tab => tab.canViewWith === 'admin')
        if(index !== -1) {
          this.tabs.push(this.extraTabs[index])
        }
      }      

      this.tabs.forEach(tab => {
        if(tab.link === this.link) {
          tab.active = true;
          return
        }
      })
    }))
  }
  
  ngOnDestroy() {
    if(this.subscription) this.subscription.unsubscribe()
  }
}

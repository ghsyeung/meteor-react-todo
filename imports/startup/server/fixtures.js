import { Meteor } from "meteor/meteor";
import { ToDos } from "../../api/todos";
import { Accounts } from "meteor/accounts-base";

Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    user = Accounts.createUser({
      email: "m@wise.com",
      password: "password"
    });
  }

  if (ToDos.find().count() === 0) {
    ToDos.insert({
      title: "Learn React",
      complete: false
    });
  }
});

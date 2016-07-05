Meteor.methods({


	addTimer:function(new_time){
// To add a new time in our database
		check(new_time, Number);
		var current_user_id = Meteor.userId();
		var user = Meteor.users.findOne({_id: current_user_id});
// Check if the time is valid and if yes insert him		
		if (new_time <= 0) {
			throw new Meteor.Error('invalid-time',"You must enter a positiv timer.");
		} else {
		if (user.timer){
			var timer = user.timer;
			timer.push(new_time);
		} else {
			var timer =[new_time];
		}

// Organize the database in croissant order
		timer.sort(function(a,b){
			return a-b;
		});

// delete time present two time
		var a = [];
		for ( i = 0; i <timer.length; i++ ) {
		    while (timer[i]==timer[i+1] || i==timer.lenght - 1){
		    	timer.splice(i,1);
		    }
		}

		Meteor.users.update({_id: current_user_id},{$set: {timer:timer}});
		}
	},

	deleteTimer:function(old_time){
// to remove a timer from our database
		check(old_time, Number);
		var current_user_id = Meteor.userId();
		var user = Meteor.users.findOne({_id: current_user_id});
		var timer = user.timer;
		timer.forEach(function(el, index){
// Find where is this timer in the array and delete this case
			if (el == old_time){
				timer.splice(index, 1);
				Meteor.users.update({_id: current_user_id},{$set: {timer:timer}})
			}
		});
	},

	startTimer :function(time){
// create the running timer object and push it in the database
		check(time, Object);
		check(time.time, Number);
		check(time.busy, Boolean);
		var current_date = new Date().getTime();
		var timer_lenght = time.time * 60000;
		var timer_end = current_date + timer_lenght;
		var running_timer = {
			timerEnd: timer_end,
			timerStart : current_date,
			busy: time.busy
		};
		var current_user_id=Meteor.userId();
		Meteor.users.update({_id: current_user_id},{$set:{runningTimer:running_timer}});
		

	},

	syncTimer : function(running_timer){
// Update the database with the running timer whiwh want to copy.
		check(running_timer, Object);
		var current_user_id=Meteor.userId();
		Meteor.users.update({_id: current_user_id},{$set:{runningTimer:running_timer}});
	}



})
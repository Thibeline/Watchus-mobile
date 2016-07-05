duration = function(user_timer) {
 // calculate the time left of a timer.	

	var timer_end = user_timer.runningTimer.timerEnd;
	var current_date = new Date().getTime();
	var duration = (timer_end-current_date)/1000;
	var duration = parseInt(duration);

	return duration;

};

 start_countdown = function(time) {

 // To start  a countdown
 // before that stop the current countdow	
 	var current_user_id=Meteor.userId();
 	var ping = [];
	Meteor.users.update({"_id":current_user_id},{$set:{'ping': ping}});
	countdown.stop();
	
	countdown.start(function() {
// when the countdown is finish, delete the running timer object from our database
		//var sound = new Audio('alert.mp3');
		var sound = new Howl({
		  urls: ['alert.mp3'],
		  autoplay: true,
		  loop: false,
		  volume: 1,
		  onplay: function() {
		    alert("Your timer is finish!");
		  }
		});
 		Meteor.users.update({"_id": current_user_id},{$unset:{'runningTimer':""}});

 		//alert("Your timer is finish!");
 
 		//sound.play();

	});

	var remain_time = countdown.get();

	countdown.remove(remain_time);

	countdown.add(time);
};



followed_friends = function(fav) {

//Return a table of followed friend, fav or not function of the input.
	var user_id = Meteor.userId();
	if (user_id) {
		var user = Meteor.users.findOne({"_id": user_id},);

	var friends = user.friends;
	var array_followed_friends = [];

// For each friend complete the array with id if necessary
	friends.forEach(function (value) {
		if (value.followed == true && value.fav == fav) {
			array_followed_friends.push(value.id);
		}
	});

// for each id, find the user associate
	var followed_friends = Meteor.users.find({
				"_id": {$in :array_followed_friends}
			});
		
	return followed_friends;

	}
};

Meteor.methods({

	askFriend: function(username){
		check(username, String);
		var friend = Meteor.users.findOne({"username": username});
// Check if the username exist in the database
		if (friend) {
			var new_friends_id = friend._id;
		} else {
			throw new Meteor.Error('invalid-username',"We couldn't find this username in our database.");
		};

		var current_user_id = Meteor.userId();

		var is_still_friend = Meteor.users.findOne({_id: current_user_id, "friends.id": new_friends_id});
// Ceck if your not already friend with it, else, add it
		if (is_still_friend) {
			throw new Meteor.Error('still_friend',"You'r already friend with it.")
		} else {
			Meteor.users.update({_id: new_friends_id},{$push:{friends_demand : current_user_id}});
			Meteor.users.update({_id: current_user_id},{$push:{friends_waiting : new_friends_id}});
		};
	},

	addFriend: function(friend_id){

//To add a friend in your list
		check(friend_id, String);
		var friend = Meteor.users.findOne({_id: friend_id});
// Check if the email exist in the database
		if (!friend) {
			throw new Meteor.Error('invalid',"We couldn't find this user in our database.");
		};

		var current_user_id = Meteor.userId();

		var is_still_friend = Meteor.users.findOne({_id: current_user_id, "friends.id": friend_id});
// Ceck if your not already friend with it, else, add it
		if (is_still_friend) {
			throw new Meteor.Error('still_friend',"You'r already friend with it.")
		} else {
			var new_friends = {
				id: friend_id,
				followed : true,
				fav : 0
			}
			Meteor.users.update({_id: current_user_id},{$push:{friends : new_friends}});
			new_friends.id = current_user_id;
			Meteor.users.update({_id: friend_id},{$push:{friends : new_friends}});
			Meteor.users.update({_id: current_user_id},{$pull:{friends_demand: friend_id}});
			Meteor.users.update({_id: friend_id},{$pull:{friends_waiting: current_user_id}});
		};

	},

	deleteDemand : function (friend_id) {
		check(friend_id, String);
		var current_user_id = Meteor.userId();
		Meteor.users.update({_id: current_user_id},{$pull:{friends_demand: friend_id}});
		Meteor.users.update({_id: friend_id},{$pull:{friends_waiting: current_user_id}});

	},

	cancelDemand : function (friend_id) {
		check(friend_id, String);
		var current_user_id = Meteor.userId();
		Meteor.users.update({_id: current_user_id},{$pull:{friends_waiting: friend_id}});
		Meteor.users.update({_id: friend_id},{$pull:{friends_demand: current_user_id}});

	},

	deleteFriend: function(id){
// remove the selected friend from your friend list
		check(id, String);
		
		var current_user_id = Meteor.userId();

		var former_friends = {
				id: id,
		}

		Meteor.users.update({_id: current_user_id},{$pull:{friends : former_friends}});
		
		former_friends.id = current_user_id;
		Meteor.users.update({_id: id},{$pull:{friends : former_friends}});
	},

	followFriend: function(friend_id){

		check(friend_id, String);
		var current_user_id = Meteor.userId();
		Meteor.users.update({_id: current_user_id, "friends.id": friend_id},{$set:{"friends.$.id": friend_id, "friends.$.followed" : true}});
	},

	unfollowFriend: function(friend_id){
		check(friend_id, String);
		var current_user_id = Meteor.userId();
		Meteor.users.update({_id: current_user_id, "friends.id": friend_id},{$set:{"friends.$.id": friend_id, "friends.$.followed" : false}});
	},

	friend_demand : function(){
		var user_id = Meteor.userId();

		if (user_id) {
			var user = Meteor.users.findOne({"_id": user_id});
		}

		var friends_demand = user.friends_demand;
		var friends_array_demand = [];

		friends_demand.forEach(function (value) {
				friends_array_demand.push(value);
		});
		
		var demand_list = Meteor.users.find({
					"_id": {$in :friends_array_demand}
				});
		
		return demand_list;
	}

});
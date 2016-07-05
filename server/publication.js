Meteor.publishComposite('userData', {
	find : function() {
		var current_user_id = this.userId;
		return Meteor.users.find(
			{_id:current_user_id},
			{fields : 
			{'username':1,
			 'emails.address':1,
			 'timer':1, 
			 'friends':1,
			 'friends_demand' : 1,
			 'friends_waiting' : 1, 
			 'ping':1, 
			 'runningTimer':1,
			 'status' :1}});
	},
	children :[
		{
			find : function(user){ 
				var friends = user.friends;
				var array_friends = [];
				friends.forEach(function (value) {
					array_friends.push(value.id);
				});

				return Meteor.users.find(
					{"_id": {$in :array_friends}},
					{fields :
					{'username':1,
					 'emails.address':1,
					 'runningTimer':1,
					 'status':1,
					 'ping':1}});
			},
		

		},
		{
			find : function() {
				return Meteor.users.find({}, {fiels : 
					{'_id' : 1,
					'username': 1}});
			}	
		}
	
	]

});
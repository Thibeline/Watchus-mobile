Schema = {};

Schema.User = new SimpleSchema ({
	
	// Needed by meteor

	username: {
		type: String,
		// For accounts-password, either emails or username is required, but not both. It is OK to make this
		// optional here because the accounts-password package does its own validation.
		// Third-party login packages may not require either. Adjust this schema as necessary for your usage.		
	},

	emails: {
		type: Array,
		// For accounts-password, either emails or username is required, but not both. It is OK to make this
		// optional here because the accounts-password package does its own validation.
		// Third-party login packages may not require either. Adjust this schema as necessary for your usage.
	},

	"emails.$": {
		type: Object
	},

	"emails.$.address": {
		type: String,
		regEx: SimpleSchema.RegEx.Email
	},

	"emails.$.verified": {
		type: Boolean,
		autoValue: function() {
			return false
		}
	},

	// Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
	registered_emails: { 
		type: [Object], 
		optional: true,
		blackbox: true 
	},

	createdAt: {
		type: Date,
		denyUpdate: true,
		autoValue: function() {
			if (this.isInsert) {
				return new Date;
			} else if (this.isUpsert) {
				return {$setOnInsert: new Date};
			} else {
          this.unset();  // Prevent user from supplying their own value
      }
    }
  },

	services: {
    type: Object,
    optional: true,
    blackbox: true
    },

	// In order to avoid an 'Exception in setInterval callback' from Meteor
	heartbeat: {
		type: Date,
		optional: true
	},

	// Personal add

	timer: {
		type: [Number],
		// To keep the list of timer in memory.
		autoValue: function() {
			if (this.isInsert && !this.isSet ) {
				return [30, 60];
			};
		}	
	},


	friends:{
		type: Array,
		// For the list of friends, everyone keep in an object
		autoValue: function(){
			if (this.isInsert && !this.isSet ) {
				return [];
			};
		}
	},

	"friends.$": {
		type: Object
	},

	"friends.$.id":{
		type: String
	},


	"friends.$.followed": {
		type : Boolean		
	},

	"friends.$.fav": {
		type : Number
	},

	friends_demand : {
		type: [String],
		// For the list of people ask you to be friend,
		autoValue: function(){
			if (this.isInsert && !this.isSet ) {
				return [];
			};
		}
	},

	friends_waiting : {
		type: [String],
		// For the list of people you ask to be friend,
		autoValue: function(){
			if (this.isInsert && !this.isSet ) {
				return [];
			};
		}
	},

	ping :{
		type: Array,
		autoValue: function(){
			if (this.isInsert && !this.isSet ) {
				return [];
			};
		}
	},


	"ping.$":{
		type: Object
	},

	"ping.$._id":{
		type: String
	},

	"ping.$.time":{
		type: Date
	},
	
	"ping.$.message":{
		type: String
	},

	runningTimer:{
		type: Object,
		optional : true,
    	blackbox: true
	},

	status: {
        type: Object,
        optional: true,
        blackbox: true
    }

});

Meteor.users.attachSchema(Schema.User);
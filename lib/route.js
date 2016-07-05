Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate:'loading',
	waitOn: function() {

		return Meteor.subscribe('userData');
		
	}
});

var requireLogin = function(){
	if (! Meteor.user()) {
		if (Meteor.loggingIn()) {
			this.render(this.loadingTemplate);
		} else {
			this.render ('notConnect');
		}
	} else {
		this.next();
	}
}


Router.route('/', {
	name:"home",
	template:"bodi",
});
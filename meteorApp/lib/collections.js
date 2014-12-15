Movies = new Meteor.Collection('movies');

Movies.deny
(
	{
		update : function() { return true},
		insert : function() { return true},
		remove : function() { return true}
	}
);

Meteor.users.allow(
	{
		update: function (userId, doc, fields, modifier) {
		    return doc._id === userId;
	 	}
	}
);

Meteor.users.deny( 
	{
		insert : function() { return true},
		remove : function() { return true}
	}
);

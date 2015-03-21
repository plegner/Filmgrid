// =============================================================================
// FILMGRID - ROUTER
// =============================================================================


var routeConfig = { waitOn: function () {
  return { ready: function() { 
    if (Meteor.userId())
      return Meteor.user() != null;
    else
      return true;
  }};
}};

var cachedUserId = "initialUserId";

function configureRoute(that, path, sort) {
  if (Session.get('type') !== path) {
    Session.set('type', path);
    App.trigger('sortChange', sort);
    App.trigger('reload');
    Session.set('showSidebar', false);
  }
  that.render('movies', { data: { nav: path } });
}

Router.onBeforeAction(function() {
  if (Meteor.userId()) {
    this.next();
  } else {
    configureRoute(this, 'suggested', 'popularity')
  };
}, { except: ['about'] });

Router.route('/', function() {
  configureRoute(this, 'suggested', 'score');
}, routeConfig);

Router.route('/watchlist', function() {
  configureRoute(this, 'bookmarked', 'added');
}, routeConfig);

Router.route('/favourites', function() {
  configureRoute(this, 'liked', 'stars');
}, routeConfig);

Router.route('/disliked', function() {
  configureRoute(this, 'disliked|hidden', 'added');
}, routeConfig);

Router.route('/now-playing', function() {
  configureRoute(this, 'playing', 'score');
}, routeConfig);

Router.route('/watch-with-friends', function() {
  configureRoute(this, 'friends', 'score');
}, routeConfig);

Router.route('/about', function() {
  this.render('about', { data: { nav: "about" }, waitOn: Meteor.user() });
}, routeConfig);

Meteor.startup(function() {

  Session.set('loggedIn', false);
  Session.set('activeMovie', {});
  Session.set('type', null);
  Session.set('search', '');
  Session.set('filter', {});

  Session.set('showSidebar', false);
  Session.set('showSubnav', false);
  Session.set('loading', true);

  Deps.autorun(function(){
    var userId = Meteor.userId();
    if (cachedUserId != userId)
    {
      cachedUserId = userId;
      if (cachedUserId)
        Session.set('loggedIn', true);
      else
        Session.set('loggedIn', false);
      Meteor.call('initialInsert', function() { App.trigger('reload');});
    }
  });
});



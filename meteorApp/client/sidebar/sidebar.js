// =================================================================================================
// FILMGRID - SIDEBAR
// =================================================================================================


var $search;
var $genre;
var $sort;
var $specialSort;

var specialSortOptions = {
  popularity: 'Popularity',
  stars: 'Stars',
  score: 'Recommended',
  added: 'Date added'
};

function handleGenre() {
  var genre = $genre.val().replace('All', '') || null;

  var query = Session.get('filter') || {};
  query.genre = genre;
  Session.set('filter', query);

  App.trigger('reload');
}

function handleSort() {
  var sort = $sort.val() || null;
  Session.set('sort', sort);
  App.trigger('reload');
}

function handleSearch() {
  var search = $search.val() || '';
  Session.set('search', search);
  App.trigger('reload');
}

function clearSearch() {
  Session.set('search', '');
  $search.val('')
  App.trigger('reload');
}

function toggleSidebar() {
  Session.set('showSidebar', !Session.get('showSidebar'));
}

function toggleSubnav() {
  Session.set('showSubnav', !Session.get('showSubnav'));
}

// =================================================================================================

Template.sidebar.events = {
  'change #genre': handleGenre,
  'change #sort': handleSort,
  'keyup #search': handleSearch,
  'change #search': handleSearch,
  'click #search-clear': clearSearch,
  'click #mobile-menu': toggleSidebar,
  'click #subnav-link': toggleSubnav,
  'click #logout-button': function() { Meteor.logout(); }
};

Template.sidebar.helpers({
  navSelectedIs: function(nav) {
    return nav.split('|').indexOf(this.nav) >= 0;
  },
  filtersClass: function() {
    return this.nav == 'about' ? 'hidden' : '';
  },
  sidebarClass: function() {
    return Session.get('showSidebar') ? 'show' : '';
  },
  subnavClass: function() {
    return Session.get('showSubnav') ? 'open' : '';
  },
  services: function() {
    // Hack to get access to internal function in accounts-ui-unstyled
    return Template._loginButtonsLoggedOutAllServices.__helpers[' services']();
  },
  isNotLoading: function() {
    return !Session.get('loading');
  },
  searchText: function() {
    return Session.get('type') === 'suggested' ? 'Search all movies' : 'Filter movies';
  },
  searchStr: function() {
    return !!Session.get('search');
  }
});

Template.sidebar.rendered = function() {
  $search = $('#search');
  $genre = $('#genre');
  $sort = $('#sort');
  $specialSort = $('#special-sort');

  $specialSort.attr('value', Session.get('sort'));
  $specialSort.text(specialSortOptions[Session.get('sort')]);
};

App.on('sortChange', function(sort) {
  // TODO Simplify + Cleanup Special Sort Item
  if ($specialSort) {
    $specialSort.attr('value', sort);
    $specialSort.text(specialSortOptions[sort]);
  }
  Session.set('sort', sort);
});

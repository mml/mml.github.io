document.addEventListener('DOMContentLoaded', function() {
  var docElem = document.documentElement;
  var calendar = document.querySelector('.calendar');
  var week = calendar.querySelector('.week');
  var itemContainers = Array.prototype.slice.call(
      calendar.querySelectorAll('.day-content'));
  var columnGrids = [];
  var weekGrid;
  var dragCounter = 0;
  var friday = calendar.querySelector('#friday');
  var sleep = calendar.querySelector('#sleep');

  function colorizeWeek() {
      weekGrid.getItems([0,1,2,3]).forEach(function(item){
        item.getElement().classList.remove("play");
        item.getElement().classList.add("work");
      })
      weekGrid.getItems([4,5,6]).forEach(function(item){
        item.getElement().classList.remove("work");
        item.getElement().classList.add("play");
      })
  }

  function labelDays() {
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var offset = 1;
    if (friday.checked) {
      offset = 0;
    }
    weekGrid.getItems([0,1,2,3,4,5,6]).forEach(function(item, index) {
      console.log(item.getElement().querySelector('.day-header').innerHTML);
      console.log(index);
      console.log(days[(index + offset) % 7]);
      item.getElement().querySelector('.day-header').innerHTML = days[(index + offset) % 7];
    });
  }

  itemContainers.forEach(function(container) {
    var muuri = new Muuri(container, {
      items: '.day-item',
      layoutDuration: 400,
      layoutEasing: 'ease',
      dragEnabled: true,
      dragSort: function() {
        console.log(columnGrids);
        return columnGrids;
      },
      dragSortInterval: 0,
      dragContainer: document.body,
      dragReleaseDuration: 400,
      dragReleaseEasing: 'ease'
    })
    .on('dragStart', function(item) {
      ++dragCounter;
      docElem.classList.add('dragging');
      item.getElement().style.width = item.getWidth() + 'px';
      item.getElement().style.height = item.getHeight() + 'px';
    })
    .on('dragEnd', function(item) {
      if (--dragCounter < 1) {
        docElem.classList.remove('dragging');
      }
    })
    .on('dragReleaseEnd', function(item) {
      item.getElement().style.width = '';
      item.getElement().style.height = '';
      columnGrids.forEach(function(muuri) {
        muuri.refreshItems();
      });
    })
    .on('layoutStart', function() {
      weekGrid.refreshItems().layout();
    });

    columnGrids.push(muuri);
  });

  weekGrid = new Muuri(week, {
    layoutDuration: 400,
    layoutEasing: 'ease',
    dragEnabled: true,
    dragSortInterval: 0,
    dragStartPredicate: {
      handle: '.day-header',
    },
    dragReleaseDuration: 400,
    dragReleaseEasing: 'ease'
  })
  .on('dragReleaseEnd', function() {
    labelDays();
    colorizeWeek()
  });

  friday.onclick = function(x){
    if (x.srcElement.checked) {
      weekGrid.move(6,0);
    } else {
      weekGrid.move(0,6);
    }
    colorizeWeek();
  };

  sleep.onclick = function(x) {
    columnGrids.forEach(function(muuri) {
      muuri.filter('day-item :not(.sleep)');
    });
  };

  colorizeWeek();
});

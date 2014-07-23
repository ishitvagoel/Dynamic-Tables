var counter = 0;
var myDiv = [];
var divIndexes = [];
//divIndexes store the list of divs
/*data[tableID*2]->number of rows in the table
data[tableID*2+1]->number of columns in the table*/
var data = [];
//textboxID -> table+tableNumber+rowNumner+columNumber

/*form's Dom map after loading of js and creation of table(s)-
  input brand name
  input category id

  table Div
    div 0
      hr
      title input
      remove button
      chart table 0
      add rows and columns buttons
    div 1
      hr
      title input
      remove button
      chart table 1
      add rows and columns buttons
    .
    .
    .
  button add chart 
  button submit
*/


function addTable() {
  divIndexes.push(counter);
  myDiv[counter] = document.createElement('div');
  var Hline = document.createElement('HR');
  document.getElementById('mainDiv').appendChild(myDiv[counter]);
  myDiv[counter].appendChild(Hline);
  myDiv[counter].id = counter;

  myDiv[counter].innerHTML = myDiv[counter].innerHTML + "Title:";

  var titleInput = document.createElement('Input');
  titleInput.type = 'Text';
  titleInput.name = 'title' + counter.toString();
  titleInput.id = "titleInput" + counter.toString();
  myDiv[counter].appendChild(titleInput);


  var removeTablebutton = document.createElement('INPUT');
  removeTablebutton.type = 'BUTTON';
  removeTablebutton.addEventListener('click', removetable);
  removeTablebutton.value = 'Remove Table';
  removeTablebutton.tableNumber = counter;
  removeTablebutton.id = "removeTablebutton" + counter.toString();
  myDiv[counter].appendChild(removeTablebutton);
  $("#removeTablebutton" + counter.toString()).css("display", "block");


  data[counter * 2] = 0;
  data[counter * 2 + 1] = 0;

  var table = document.createElement('TABLE');
  table.border = 0;
  table.id = "table" + counter.toString();
  table.value = counter;
  var tableBody = document.createElement('tbody');
  tableBody.id = 'tbody' + counter.toString();
  table.appendChild(tableBody);
  var obj = {
    target: {
      tableNumber: counter
    }
  };
  myDiv[counter].appendChild(table);
  $("#table" + counter.toString()).css("display", "inline");
  addRows(obj, 1);


  var addColumnButton = document.createElement('INPUT');
  addColumnButton.type = 'BUTTON';
  addColumnButton.addEventListener('click', addColumns);
  addColumnButton.value = 'Add Columns';
  addColumnButton.tableNumber = counter;
  addColumnButton.id = "addColumnButton" + counter.toString();
  myDiv[counter].appendChild(addColumnButton);
  $("#" + "addColumnButton" + counter.toString()).css("display", "inline");

  var addRowButton = document.createElement('INPUT');
  addRowButton.type = 'BUTTON';
  addRowButton.addEventListener('click', addRows);
  addRowButton.value = "Add Rows";
  addRowButton.tableNumber = counter;
  addRowButton.id = "addRowButton" + counter.toString();
  myDiv[counter].appendChild(addRowButton);
  $("#" + "addRowButton" + counter.toString()).css("display", "block");



  counter++;
}

function addRows(sender, count) {
  var value = sender.target.tableNumber;
  var currentTable = document.getElementById('table' + value.toString());
  var row = currentTable.insertRow(-1);
  row.id = 'tr' + value.toString() + data[value * 2];
  var flag = 0;
  if (data[value * 2 + 1] == 0) {
    data[value * 2 + 1] = 2;
    flag = 1;
  }

  for (var i = 0; i <= data[value * 2 + 1] - 1; i++) {
    var cell = row.insertCell(-1);
    cell.id = 'td' + value.toString() + data[value * 2].toString() + i.toString();
    if (i == 0 && flag == 1)
    ;
    else if (i == 0) {
      var delButton = document.createElement('input');
      delButton.type = 'button';
      delButton.value = "Remove Row";
      delButton.id = "delRowButton" + value.toString() + data[value * 2].toString() + i.toString();
      cell.appendChild(delButton);
      delButton.addEventListener('click', removeRow);
      delButton.tableNumber = value;
      delButton.rowNumber = data[value * 2].toString();
    } else if (flag == 1) {
      var delButton = document.createElement('input');
      delButton.type = 'button';
      delButton.value = "Remove Column";
      delButton.id = "delColumnButton" + value.toString() + data[value * 2].toString() + i.toString();
      cell.appendChild(delButton);
      delButton.addEventListener('click', removeColumn);
      delButton.tableNumber = value;
      delButton.columnNumber = i;
      flag = 0;
    } else {
      var textbox = document.createElement('INPUT');
      textbox.type = 'text';
      textbox.id = "table" + value.toString() + data[value * 2].toString() + i.toString();
      cell.appendChild(textbox);
    }
  }
  data[value * 2]++;
  if (count)
    addRows(sender, count - 1);
}

function addColumns(sender, count) {
  var value = sender.target.tableNumber;
  var currentTable = document.getElementById('table' + value.toString());
  for (var i = 0; i <= data[value * 2] - 1; i++) {
    var cell = currentTable.rows[i].insertCell(-1);
    cell.id = 'td' + value.toString() + i.toString() + data[value * 2 + 1].toString();
    if (i == 0) {
      var delButton = document.createElement('input');
      delButton.type = 'button';
      delButton.value = "Remove Column";
      delButton.id = "delColumnButton" + value.toString() + i.toString() + data[value * 2 + 1].toString();
      cell.appendChild(delButton);
      delButton.addEventListener('click', removeColumn);
      delButton.tableNumber = value;
      delButton.columnNumber = (data[value * 2 + 1]).toString();
    } else {
      var textbox = document.createElement('INPUT');
      textbox.type = 'text';
      textbox.id = 'table' + value.toString() + i.toString() + data[value * 2 + 1].toString();
      cell.appendChild(textbox);
    }
  }
  data[value * 2 + 1]++;
}

function postData() {
  var Mydata = [];

  for (var z = 0; divIndexes[z] != undefined; z++) {
    i = divIndexes[z];
    var temp = {
      title: document.getElementById('titleInput' + i.toString()).value,
      tab: []
    };

    for (var j = 0; j < data[i * 2]; j++) {
      var tempArr = [];
      for (var k = 0; k < data[i * 2 + 1]; k++) {
        tempArr[k] = document.getElementById('table' + i.toString() + j.toString() + k.toString()).value;
      }
      temp.tab.push(tempArr);
    }
    Mydata[i] = temp;
  }

  $.ajax({
    url: '/chart/add',
    type: 'post',
    data: {
      brand: document.getElementById('brandName').value,
      category_id: document.getElementById('categoryId').value,
      data: Mydata
    },
    dataType: 'json',
    success: function(data) {
      if (data.error) {
        alert("some error occurred at server, values not inserted");
      } else {
        alert("Chart Uploaded");
        location.reload();
      }
    }
  });
}

function removeColumn(sender) {
  var tableNumber = sender.target.tableNumber;
  var columnNumber = sender.target.columnNumber;
  var rowNumber = sender.target.rowNumber;
  for (var i = 0; i < data[tableNumber * 2]; i++) {
    document.getElementById('tr' + tableNumber.toString() + i.toString()).removeChild(document.getElementById('td' + tableNumber + i + columnNumber));
    for (var j = columnNumber + 1; j < data[tableNumber * 2 + 1]; j++) {
      document.getElementById('td' + tableNumber.toString() + i.toString() + j.toString()).id = 'td' + i.toString() + (j - 1).toString();
      document.getElementById('table' + tableNumber.toString() + i.toString() + j.toString()).id = 'table' + i.toString() + (j - 1).toString();
    }
  }
  data[tableNumber * 2 + 1]--;
}

function removeRow(sender) {
  var tableNumber = sender.target.tableNumber;
  var columnNumber = sender.target.columnNumber;
  var rowNumber = sender.target.rowNumber;
  document.getElementById('tbody'+tableNumber).removeChild(document.getElementById('tr'+tableNumber+rowNumber));
  for (var i = rowNumber + 1; i < data[tableNumber * 2]; i++) {
    document.getElementById('tr' + tableNumber + i).id = 'tr' + tableNumber + (i - 1);
    for (var j = 0; j < data[tableNumber * 2 + 1]; j++) {
      document.getElementById('td'+tableNumber+i+j).id = 'td'+tableNumber+(i-1)+j;
      document.getElementById('table'+tableNumber+i+j).id = 'table'+tableNumber+(i-1)+j;
    }
  }
  data[tableNumber * 2]--;
}

function removetable(sender) {
  var r = confirm("Are you sure you want to delete it?");
  if (r == true) {} else {
    return false;
  }
  var count = sender.target.tableNumber;
  var i;
  for (i = 0; divIndexes[i] != undefined; i++) {
    if (count == divIndexes[i])
      break;
  }

  for (; divIndexes[i + 1] != undefined; i++) {
    divIndexes[i] = divIndexes[i + 1];
  }
  divIndexes.pop();
  document.getElementById('mainDiv').removeChild(myDiv[count]);
}
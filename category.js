$(document).ready(function () {
  console.log("Page loaded");

  function loadTable() {
    // lay du lieu tu server
    $.ajax({
      url: "http://localhost:1337/api/the-loais/?populate=*",
      method: "GET",
      success: function (data) {
        console.log("Data Loaded Successfully");
        toTable(data["data"]); // sau khi tai du lieu thanh cong thi chuyen sang bang
      },
      error: function (err) {
        console.log("Error loading data: ", err);
      },
    });
  }

  // chuyen sang bang
  function toTable(data) {
    let categoryTable = $("#categoryTable");
    categoryTable.empty();

    $.each(data, function (_, category) {
      let attributes = category.attributes;
      let categoryRow = $("<tr></tr>");

      categoryRow.append($("<td></td>").text(category.id));
      categoryRow.append($("<td></td>").text(attributes.TenTheLoai));
      console.log(attributes.TenTheLoai);
      categoryTable.append(categoryRow);
      categoryRow.append(
        '<td><button class="modify btn btn-light btn-sm m-1" data-id="' +
          category.id +
          '">Chỉnh sửa</button><button class="delete btn btn-light btn-sm m-1" data-id="' +
          category.id +
          '">Xoá</button></td>'
      );
    });
    categoryTable.append(bookRow);
  }

  // lay du lieu tu server
  loadTable();
});

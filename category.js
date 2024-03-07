$(document).ready(function () {
  console.log("Page loaded");

  function toast(message) {
    const toast = $(".toast");
    $(".toast-body").text(message);
    setTimeout(function () {
      toast.toast("show");

      setTimeout(function () {
        toast.toast("hide");
      }, 2000);
    }, 100);
  }

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
      categoryRow.append($("<td></td>").text(attributes.moTa));
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

  // them du lieu
  $("#addBtn").click(function () {
    let addModal = $("#addModal");
    addModal.modal("show");
    // gui du lieu len server
    $("#saveAdd")
      .off("click")
      .click(function () {
        // lay du lieu tu input
        let theLoai = $("#addTheLoai").val();
        let moTa = $("#addMoTa").val();
        if (theLoai === "") {
          toast("Vui lòng nhập đầy đủ thông tin");
          return;
        } else {
          $.ajax({
            url: "http://localhost:1337/api/the-loais/?populate=*",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              data: {
                TenTheLoai: theLoai,
                moTa: moTa,
              },
            }),
            success: function () {
              console.log("Data Added Successfully");
              loadTable();
              $("#addMaSach").val("");
              $("#addTenSach").val("");
              $("#addTacGia").val("");
              $("#addTheLoai").val("");
              $("#addNXB").val("");

              addModal.modal("hide");
              toast("Thêm thể loại mới thành công");
            },
            error: function (err) {
              console.log("Error adding data: ", err);
              const toast = $(".toast");
              toast("Sai kiểu dữ liệu hoặc thiếu dữ liệu");
            },
          });
        }
      });
  });

  // xoa du lieu
  $("#categoryTable").on("click", ".delete", function () {
    let id = $(this).data("id");
    console.log(id);
    console.log("delete: ", id);

    $.ajax({
      url: "http://localhost:1337/api/the-loais/" + id,
      method: "DELETE",
      success: function () {
        console.log("Data Deleted Successfully");
        loadTable();
        toast("Xoá thể loại thành công");
      },
      error: function (err) {
        console.log("Error deleting data: ", err);
        toast("Xoá thể loại thất bại");
      },
    });
  });

  // cap nhat du lieu
  $("#categoryTable").on("click", ".modify", function () {
    console.log("this1", $(this));
    let id = $(this).data("id");
    console.log("id :", id);
    console.log("modify: ", id);
    let modifyModal = $("#modifyModal");
    modifyModal.modal("show");

    // lay du lieu tu hang de chuyen vao modal
    let rowData = $(this)
      .closest("tr")
      .find("td")
      .map(function () {
        console.log($(this).text());
        return $(this).text();
      })
      .get();

    $("#modifyTheLoai").val(rowData[1]);
    $("#modifyMoTa").val(rowData[2]);


    $("#saveModify")
      .off("click")
      .click(function () {
        // lay du lieu tu input
        let theLoai = $("#modifyTheLoai").val();
        let moTa = $("#modifyMoTa").val();

        if (
          theLoai === ""
        ) {
          toast("Vui lòng nhập đầy đủ thông tin");
          return;
        } else {
          // gui du lieu len server
          $.ajax({
            url: "http://localhost:1337/api/the-loais/" + id,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
              data: {
                TenTheLoai: theLoai,
                moTa: moTa,
              },
            }),
            success: function (data) {
              console.log(data);
              console.log("Data Modified Successfully");
              loadTable();
              toast("Chỉnh sửa dữ liệu thành công");

              //reset du lieu modal
              $("#modifyTheLoai").val("");
              $("#modifyMoTa").val("");
              modifyModal.modal("hide");
            },
            error: function (err) {
              console.log("Error modifying data: ", err);
              toast("Sai kiểu dữ liệu hoặc thiếu dữ liệu");
            },
          });
        }
      });
  });
});

$(document).ready(function () {
  console.log("Page loaded");

  //thong bao
  function toast(message) {
    const toast = $(".toast");
    $(".toast-body").text(message);
    setTimeout(function () {
      // hien thi thong bao sau 100ms va an sau 2000ms
      toast.toast("show");

      setTimeout(function () {
        toast.toast("hide");
      }, 2000);
    }, 100);
  }

  // chuyen du lieu sang bang
  function toTable(data) {
    let categoryTable = $("#categoryTable");
    categoryTable.empty();

    $.each(data, function (_, category) {
      let attributes = category.attributes;
      let categoryRow = $("<tr></tr>");

      categoryRow.append($("<td></td>").text(category.id));
      categoryRow.append($("<td></td>").text(attributes.TenTheLoai));
      categoryRow.append($("<td></td>").text(attributes.moTa));
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

  // hien thi du lieu
  function loadTable() {
    $.ajax({
      url: "http://localhost:1337/api/the-loais/?populate=*",
      method: "GET",
      success: function (data) {
        console.log("Data Loaded Successfully");
        toTable(data["data"]);
      },
      error: function (err) {
        console.log("Error loading data: ", err);
      },
    });
  }
  loadTable();

  // them du lieu
  $("#addBtn").click(function () {
    let addModal = $("#addModal");
    addModal.modal("show");
    $("#saveAdd")
      .off("click")
      .click(function () {
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
              $("#addTheLoai").val("");
              $("#addMoTa").val("");
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

  // cap nhat du lieu
  $("#categoryTable").on("click", ".modify", function () {
    let id = $(this).data("id");
    let modifyModal = $("#modifyModal");
    modifyModal.modal("show");

    let rowData = $(this)
      .closest("tr")
      .find("td")
      .map(function () {
        return $(this).text();
      })
      .get();

    $("#modifyTheLoai").val(rowData[1]);
    $("#modifyMoTa").val(rowData[2]);

    $("#saveModify")
      .off("click")
      .click(function () {
        let theLoai = $("#modifyTheLoai").val();
        let moTa = $("#modifyMoTa").val();

        if (theLoai === "") {
          toast("Vui lòng nhập đầy đủ thông tin");
          return;
        } else {
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
              console.log("Data Modified Successfully");
              loadTable();
              toast("Chỉnh sửa dữ liệu thành công");

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

  // xoa du lieu
  $("#categoryTable").on("click", ".delete", function () {
    let id = $(this).data("id");

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
});

$(document).ready(function () {
  console.log("Page loaded");

  // thong bao
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

  // lay du lieu cho select menu
  function selectCategory() {
    $.ajax({
      url: "http://localhost:1337/api/the-loais/?populate=*",
      method: "GET",
      success: function (response) {
        let selectMenu = $(".categorySelect");
        selectMenu.empty();
        selectMenu.append("<option>Chọn thể loại</option>");
        response.data.forEach(function (category) {
          selectMenu.append(
            '<option class="optionTheLoai" value="' +
              category.id +
              '">' +
              category.attributes.TenTheLoai +
              "</option>"
          );
        });

        selectMenu.change(function () {
          let selectedOption = $(this).find(":selected");
          $(this).find("option").removeAttr("selected");
          selectedOption.attr("selected", "selected");
        });
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
  selectCategory();

  // chuyen sang bang
  function toTable(data) {
    let bookTable = $("#bookTable");
    bookTable.empty();

    $.each(data, function (_, book) {
      let attributes = book.attributes;
      let row = $("<tr></tr>");

      //them cac du lieu vao hang
      row.append($("<td></td>").text(attributes.maSach));
      row.append($("<td></td>").text(attributes.tenSach));
      row.append($("<td></td>").text(attributes.tenTacGia));
      row.append(
        $("<td></td>").text(attributes.the_loai.data?.attributes.TenTheLoai)
      );
      row.append($("<td></td>").text(attributes.namXuatBan));
      // them nut modify va delete
      row.append(
        '<td><button class="modify btn btn-light btn-sm m-1" data-id="' +
          book.id +
          '">Chỉnh sửa</button><button class="delete btn btn-light btn-sm m-1" data-id="' +
          book.id +
          '">Xoá</button></td>'
      );
      bookTable.append(row); // them hang vao bang
    });
  }

  // hien thi du lieu
  function loadTable() {
    // lay du lieu tu server
    $.ajax({
      url: "http://localhost:1337/api/thong-tin-saches/?populate=*",
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
        let maSach = $("#addMaSach").val();
        let tenSach = $("#addTenSach").val();
        let tenTacGia = $("#addTacGia").val();
        let theLoai =
          $(".categorySelect").find(":selected")[1].attributes.value.value;
        let namXuatBan = $("#addNXB").val();

        if (
          maSach === "" ||
          tenSach === "" ||
          tenTacGia === "" ||
          theLoai === "" ||
          namXuatBan === ""
        ) {
          toast("Vui lòng nhập đầy đủ thông tin");
          return;
        } else if (!Number(namXuatBan)) {
          toast("Năm xuất bản phải là số");
          return;
        } else {
          $.ajax({
            url: "http://localhost:1337/api/thong-tin-saches/?populate=*",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              data: {
                maSach: maSach,
                tenSach: tenSach,
                tenTacGia: tenTacGia,
                the_loai: {
                  id: theLoai,
                },
                namXuatBan: namXuatBan,
              },
            }),
            success: function () {
              console.log("Data Added Successfully");
              loadTable();
              $("#addMaSach").val("");
              $("#addTenSach").val("");
              $("#addTacGia").val("");
              $("#addNXB").val("");

              addModal.modal("hide");
              toast("Thêm sách mới thành công");
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
  $("#bookTable").on("click", ".modify", function () {
    let id = $(this).data("id");
    let modifyModal = $("#modifyModal");
    modifyModal.modal("show");

    // lay du lieu tu hang de chuyen vao modal
    let rowData = $(this)
      .closest("tr")
      .find("td")
      .map(function () {
        return $(this).text();
      })
      .get();

    $("#modifyMaSach").val(rowData[0]);
    $("#modifyTenSach").val(rowData[1]);
    $("#modifyTacGia").val(rowData[2]);
    $(".categorySelect").val(rowData[3]);
    $("#modifyNXB").val(rowData[4]);

    $("#saveModify")
      .off("click")
      .click(function () {
        // lay du lieu tu input
        let maSach = $("#modifyMaSach").val();
        let tenSach = $("#modifyTenSach").val();
        let tenTacGia = $("#modifyTacGia").val();
        let theLoai = $(".categorySelect").find(":selected").val();
        let namXuatBan = $("#modifyNXB").val();

        if (
          maSach === "" ||
          tenSach === "" ||
          tenTacGia === "" ||
          theLoai === "" ||
          namXuatBan === ""
        ) {
          toast("Vui lòng nhập đầy đủ thông tin");
          return;
        } else if (!Number(namXuatBan)) {
          toast("Năm xuất bản phải là số");
          return;
        } else {
          // gui du lieu len server
          $.ajax({
            url:
              "http://localhost:1337/api/thong-tin-saches/" +
              id +
              "?populate=*",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
              data: {
                maSach: maSach,
                tenSach: tenSach,
                tenTacGia: tenTacGia,
                the_loai: {
                  id: theLoai,
                },
                namXuatBan: namXuatBan,
              },
            }),
            success: function (data) {
              console.log("Data Modified Successfully");
              loadTable();
              toast("Chỉnh sửa dữ liệu thành công");

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
  $("#bookTable").on("click", ".delete", function () {
    let id = $(this).data("id");

    $.ajax({
      url: "http://localhost:1337/api/thong-tin-saches/" + id,
      method: "DELETE",
      success: function () {
        console.log("Data Deleted Successfully");
        loadTable();
        toast("Xoá sách thành công");
      },
      error: function (err) {
        console.log("Error deleting data: ", err);
        toast("Xoá sách thất bại");
      },
    });
  });

  //tim kiem theo the loai
  $("#searchBtn").click(function () {
    let searchValue = $("#searchBar").val();
    $.ajax({
      url:
        "http://localhost:1337/api/thong-tin-saches?filters[the_loai][TenTheLoai][$contains]=" +
        searchValue +
        "&populate=*",
      method: "GET",
      success: function (data) {
        console.log("Data Loaded Successfully");
        toTable(data["data"]);
      },
      error: function (err) {
        console.log("Error loading data: ", err);
        toast("Tìm kiếm thất bại");
      },
    });
  });
});
